// The website chat bubble's proxy.
//
// It exists for one reason: the CRM webhook is protected by a shared secret,
// and a secret in a browser is not a secret. The widget calls this, this holds
// the token, and the token never reaches the page.
//
// It is deliberately thin. No decisions are made here — the engine behind the
// webhook does all of that. Nothing a person types is logged or stored on this
// side of the wire.

const ALLOWED_ORIGINS = [
  "https://hopetrustindia.com",
  "https://www.hopetrustindia.com",
  "http://localhost:3000",
];

function getCorsHeaders(request) {
  const origin = request.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// Per-IP, in memory, deliberately. A serverless instance is short-lived, so
// this is a speed bump rather than a wall — it exists because every turn costs
// a Gemini call, and the wall is n8n's own token check.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const hits = new Map();

function overLimit(ip) {
  const now = Date.now();
  const seen = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  seen.push(now);
  hits.set(ip, seen);
  return seen.length > MAX_PER_WINDOW;
}

function json(body, status, cors) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

export default async (request) => {
  const cors = getCorsHeaders(request);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405, cors);
  }

  // Read at invoke rather than at module load. A missing variable then fails
  // the request visibly instead of baking an undefined into a cold start.
  const token = process.env.WHATSAPP_CRM_TOKEN;
  const crmUrl = process.env.CRM_ENDPOINT;

  if (!token || !crmUrl) {
    return json({ error: "CRM not configured" }, 500, cors);
  }

  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (overLimit(ip)) {
    return json({ error: "Too many messages. Please wait a moment." }, 429, cors);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Bad request" }, 400, cors);
  }

  const message = typeof body?.message === "string" ? body.message : "";
  const state = body?.state && typeof body.state === "object" ? body.state : {};

  try {
    const res = await fetch(crmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message, state }),
    });

    const data = await res.json();
    return json(data, res.status, cors);
  } catch {
    // Nothing about the message goes in the response, and nothing is logged.
    // A Netlify log line holding what someone typed about their addiction is
    // the same disclosure as a transcript column, minus the retention policy.
    return json({ error: "CRM request failed" }, 502, cors);
  }
};

export const config = {
  path: "/api/chat",
};
