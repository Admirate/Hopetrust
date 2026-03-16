const CRM_URL =
  "https://prodcron.askadmissionsone.in/external/carrier/hopetrust/66";

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

export default async (request) => {
  const cors = getCorsHeaders(request);

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const token = process.env.WHATSAPP_CRM_TOKEN;

  if (!token) {
    return new Response(JSON.stringify({ error: "CRM not configured" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  try {
    const res = await fetch(CRM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "CRM request failed" }), {
      status: 502,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
};

export const config = {
  path: "/api/whatsapp-crm",
};
