import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/** Escape HTML to prevent injection in interpolated strings. */
function esc(s = ""): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface BlogPost {
  title: string;
  excerpt: string;
  url: string;
  featuredImage?: string;
}

interface RequestBody {
  customMessage: string;
  recentPosts?: BlogPost[];
  siteUrl?: string;
}

function buildNewsletterHtml(
  customMessage: string,
  recentPosts: BlogPost[],
  unsubscribeUrl: string,
  siteUrl: string
): string {
  const postCards = recentPosts
    .map(
      (post) => `
    <tr>
      <td style="padding: 0 0 20px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
          ${
            post.featuredImage
              ? `<tr><td style="padding: 0;"><img src="${esc(post.featuredImage)}" alt="${esc(post.title)}" width="100%" style="display: block; max-height: 200px; object-fit: cover; border-radius: 12px 12px 0 0;" /></td></tr>`
              : ""
          }
          <tr>
            <td style="padding: 20px 24px;">
              <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #00373E; line-height: 1.3;">${esc(post.title)}</h3>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #6B7280; line-height: 1.5;">${esc(post.excerpt.substring(0, 150))}${post.excerpt.length > 150 ? "..." : ""}</p>
              <a href="${esc(post.url)}" style="display: inline-block; background-color: #ED7428; color: #ffffff; padding: 10px 24px; border-radius: 50px; text-decoration: none; font-size: 14px; font-weight: 600;">Read Article</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Hope Trust Newsletter</title></head>
<body style="margin: 0; padding: 0; background-color: #F7F6F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F6F4;">
    <tr><td align="center" style="padding: 40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
        <tr><td style="background-color: #00373E; padding: 32px 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">AREL Hope Recovery Services</h1>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #ED7428; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">Weekly Newsletter</p>
        </td></tr>
        <tr><td style="padding: 32px 40px;">
          <div style="font-size: 16px; color: #374151; line-height: 1.7;">${esc(customMessage)}</div>
        </td></tr>
        <tr><td style="padding: 0 40px;"><hr style="border: none; border-top: 2px solid #F3F4F6; margin: 0;" /></td></tr>
        ${
          recentPosts.length > 0
            ? `<tr><td style="padding: 32px 40px 16px 40px;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 700; color: #00373E;">Recent from our blog</h2>
          <p style="margin: 6px 0 0 0; font-size: 14px; color: #9CA3AF;">Our latest insights and articles</p>
        </td></tr>
        <tr><td style="padding: 16px 40px 32px 40px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${postCards}</table>
        </td></tr>`
            : ""
        }
        <tr><td style="background-color: #FFF7ED; padding: 32px 40px; text-align: center;">
          <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #00373E;">Need support?</h3>
          <p style="margin: 0 0 20px 0; font-size: 14px; color: #6B7280; line-height: 1.5;">Our team is here to help you on your journey to wellness.</p>
          <a href="${siteUrl}/contact" style="display: inline-block; background-color: #00373E; color: #ffffff; padding: 12px 32px; border-radius: 50px; text-decoration: none; font-size: 14px; font-weight: 600;">Book a Session</a>
        </td></tr>
        <tr><td style="padding: 24px 40px; text-align: center; background-color: #00373E;">
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #9CA3AF;">AREL Hope Recovery Services, Banjara Hills, Hyderabad, India</p>
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #9CA3AF;">+91 90008 50001 | frontoffice@hopetrustindia.com</p>
          <p style="margin: 12px 0 0 0; font-size: 12px;"><a href="${unsubscribeUrl}" style="color: #ED7428; text-decoration: underline;">Unsubscribe</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // ── Auth: require service_role key as Bearer token ─────────────────────────
  const authHeader = req.headers.get("authorization") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (
    !serviceKey ||
    !authHeader.startsWith("Bearer ") ||
    authHeader.slice(7) !== serviceKey
  ) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = serviceKey;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
    const fromEmail =
      Deno.env.get("NEWSLETTER_FROM_EMAIL") ||
      "AREL Hope Recovery Services <newsletter@hopetrustindia.com>";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    const body: RequestBody = await req.json();
    const siteUrl = body.siteUrl || Deno.env.get("SITE_URL") || "https://hopetrustindia.com";
    const { customMessage, recentPosts = [] } = body;

    if (!customMessage) {
      return new Response(
        JSON.stringify({ error: "customMessage is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: subscribers, error: fetchError } = await supabase
      .from("newsletter_subscribers")
      .select("email, full_name")
      .eq("is_active", true);

    if (fetchError) {
      throw new Error(`Failed to fetch subscribers: ${fetchError.message}`);
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No active subscribers found", sent: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const html = buildNewsletterHtml(
      customMessage,
      recentPosts.map((p) => ({
        ...p,
        url: p.url.startsWith("http") ? p.url : `${siteUrl}${p.url}`,
      })),
      `${siteUrl}/unsubscribe`,
      siteUrl
    );

    const BATCH_SIZE = 50;
    let totalSent = 0;
    const errors: string[] = [];

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);

      const sendPromises = batch.map(async (subscriber) => {
        try {
          await resend.emails.send({
            from: fromEmail,
            to: subscriber.email,
            subject: "This Week at Hope Trust",
            html: html,
          });
          totalSent++;
        } catch (err) {
          errors.push(
            `Failed to send to ${subscriber.email}: ${(err as Error).message}`
          );
        }
      });

      await Promise.all(sendPromises);

      if (i + BATCH_SIZE < subscribers.length) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    return new Response(
      JSON.stringify({
        message: `Newsletter sent successfully`,
        total_subscribers: subscribers.length,
        sent: totalSent,
        failed: errors.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
