const _rl = new Map();
function isRateLimited(ip, windowMs, max) {
  const now = Date.now();
  let e = _rl.get(ip);
  if (!e || now > e.reset) e = { count: 0, reset: now + windowMs };
  e.count++;
  _rl.set(ip, e);
  if (_rl.size > 5000) for (const [k, v] of _rl) if (now > v.reset) _rl.delete(k);
  return e.count > max;
}

const ALLOWED_ORIGINS = [
  "https://hopetrustindia.com",
  "https://www.hopetrustindia.com",
  "http://localhost:3000",
];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const ALLOWED_POSITIONS = [
  "therapist",
  "psychiatrist",
  "counsellor",
  "admin",
  "other",
];

function getCorsHeaders(request) {
  const origin = request.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

function validate({ full_name, email, position, cv_link, introduction }) {
  if (!full_name || full_name.trim().length < 2)
    return "Name must be at least 2 characters";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return "Please enter a valid email address";
  if (!position || !ALLOWED_POSITIONS.includes(position))
    return "Please select a valid position";
  if (!cv_link || !cv_link.startsWith("https://"))
    return "A valid CV upload is required";
  if (!introduction || introduction.trim().length < 20)
    return "Introduction must be at least 20 characters";
  return null;
}

export default async (request) => {
  const cors = getCorsHeaders(request);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, cors);
  }

  const clientIp =
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  if (isRateLimited(clientIp, 3_600_000, 3)) {
    return json({ error: "Too many requests. Please try again later." }, 429, cors);
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return json({ error: "Server configuration error" }, 500, cors);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400, cors);
  }

  // Honeypot — silently accept bots
  if (body.bot_field) {
    return json({ ok: true }, 200, cors);
  }

  const { full_name, email, position, cv_link, introduction } = body;
  const validationError = validate({ full_name, email, position, cv_link, introduction });
  if (validationError) {
    return json({ error: validationError }, 422, cors);
  }

  // Ensure cv_link belongs to this project's Supabase instance
  if (SUPABASE_URL && !cv_link.startsWith(SUPABASE_URL)) {
    return json({ error: "Invalid CV upload URL" }, 422, cors);
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/joinus_applications`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      position,
      cv_link,
      introduction: introduction.trim(),
    }),
  });

  if (!res.ok) {
    return json({ error: "Failed to submit application. Please try again." }, 502, cors);
  }

  return json({ ok: true }, 200, cors);
};
