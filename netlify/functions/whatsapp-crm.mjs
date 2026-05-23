// =============================================================================
// WHATSAPP CRM DISABLED — uncomment when new CRM is integrated
// =============================================================================
//
// const CRM_URL = process.env.CRM_ENDPOINT;
//
// const ALLOWED_ORIGINS = [
//   "https://hopetrustindia.com",
//   "https://www.hopetrustindia.com",
//   "http://localhost:3000",
// ];
//
// function getCorsHeaders(request) {
//   const origin = request.headers.get("origin") || "";
//   const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
//   return {
//     "Access-Control-Allow-Origin": allowedOrigin,
//     "Access-Control-Allow-Methods": "POST, OPTIONS",
//     "Access-Control-Allow-Headers": "Content-Type",
//   };
// }
//
// export default async (request) => {
//   const cors = getCorsHeaders(request);
//
//   if (request.method === "OPTIONS") {
//     return new Response(null, { status: 204, headers: cors });
//   }
//
//   if (request.method !== "POST") {
//     return new Response(JSON.stringify({ error: "Method not allowed" }), {
//       status: 405,
//       headers: { ...cors, "Content-Type": "application/json" },
//     });
//   }
//
//   const token = process.env.WHATSAPP_CRM_TOKEN;
//   const crmUrl = CRM_URL;
//
//   if (!token || !crmUrl) {
//     return new Response(JSON.stringify({ error: "CRM not configured" }), {
//       status: 500,
//       headers: { ...cors, "Content-Type": "application/json" },
//     });
//   }
//
//   try {
//     const res = await fetch(crmUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({}),
//     });
//
//     let data = await res.json();
//
//     // Ensure redirect URLs include the country code (91 for India)
//     const fixUrl = (url) => {
//       if (typeof url !== "string") return url;
//       try {
//         const u = new URL(url);
//         let phone = u.searchParams.get("phone");
//         if (phone && !phone.startsWith("+")) {
//           phone = phone.replace(/\D/g, "");
//           if (phone.length === 10) {
//             // 10-digit local number -> prepend India country code
//             u.searchParams.set("phone", "91" + phone);
//             return u.toString();
//           } else if (phone.length === 12 && phone.startsWith("91")) {
//             // Already a valid 12-digit Indian number, keep it
//             u.searchParams.set("phone", phone);
//             return u.toString();
//           }
//         }
//       } catch {
//         // not a valid URL, return as-is
//       }
//       return url;
//     };
//
//     if (data?.url || data?.redirectUrl || data?.link) {
//       data = {
//         ...data,
//         url: fixUrl(data.url),
//         redirectUrl: fixUrl(data.redirectUrl),
//         link: fixUrl(data.link),
//       };
//     }
//
//     return new Response(JSON.stringify(data), {
//       status: res.status,
//       headers: { ...cors, "Content-Type": "application/json" },
//     });
//   } catch {
//     return new Response(JSON.stringify({ error: "CRM request failed" }), {
//       status: 502,
//       headers: { ...cors, "Content-Type": "application/json" },
//     });
//   }
// };
//
// export const config = {
//   path: "/api/whatsapp-crm",
// };

// Stub so Netlify doesn't error on deploy — returns 503 until re-enabled
export default async () => {
  return new Response(
    JSON.stringify({ error: "WhatsApp CRM is temporarily disabled" }),
    { status: 503, headers: { "Content-Type": "application/json" } }
  );
};

export const config = {
  path: "/api/whatsapp-crm",
};
