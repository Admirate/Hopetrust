// =============================================================================
// Branded HTML email templates for enrollment flow
// Used by razorpay-webhook.mjs via Resend
// =============================================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hopetrustindia.com';
const SUPPORT_EMAIL = 'frontoffice@hopetrustindia.com';
const SUPPORT_PHONE = '+91 9000850001';

/** Escape minimal HTML to prevent injection in user-supplied strings. */
function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Format paise as INR currency. */
export function formatINR(paise) {
  const rupees = (paise || 0) / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Build enrollment confirmation email for the user.
 */
export function buildEnrollmentConfirmationEmail({
  fullName,
  programTitle,
  programLevel,
  amountInr,
  paymentId,
  orderId,
  enrollmentId,
}) {
  const amountDisplay = formatINR(amountInr);
  const subject = `Enrollment confirmed — ${programTitle}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#F7F6F4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F6F4;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background-color:#00373E;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Hope Trust</h1>
              <p style="margin:8px 0 0 0;font-size:14px;color:#ED7428;font-weight:500;letter-spacing:1px;text-transform:uppercase;">Enrollment Confirmed</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:32px 40px 8px 40px;">
              <h2 style="margin:0 0 12px 0;font-size:22px;font-weight:700;color:#00373E;">Thank you, ${esc(fullName)}.</h2>
              <p style="margin:0;font-size:16px;color:#374151;line-height:1.6;">
                Your payment has been received and your enrollment is confirmed. We look forward to having you with us.
              </p>
            </td>
          </tr>

          <!-- Details card -->
          <tr>
            <td style="padding:24px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF7ED;border-radius:12px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#374151;">
                      <tr><td style="padding:6px 0;color:#6B7280;width:40%;">Program</td><td style="padding:6px 0;font-weight:600;color:#00373E;">${esc(programTitle)}</td></tr>
                      ${programLevel ? `<tr><td style="padding:6px 0;color:#6B7280;">Level</td><td style="padding:6px 0;font-weight:600;color:#00373E;">${esc(programLevel)}</td></tr>` : ''}
                      <tr><td style="padding:6px 0;color:#6B7280;">Amount paid</td><td style="padding:6px 0;font-weight:600;color:#00373E;">${esc(amountDisplay)}</td></tr>
                      <tr><td style="padding:6px 0;color:#6B7280;">Payment ID</td><td style="padding:6px 0;font-family:ui-monospace,Menlo,monospace;font-size:13px;color:#374151;">${esc(paymentId)}</td></tr>
                      <tr><td style="padding:6px 0;color:#6B7280;">Order ID</td><td style="padding:6px 0;font-family:ui-monospace,Menlo,monospace;font-size:13px;color:#374151;">${esc(orderId)}</td></tr>
                      <tr><td style="padding:6px 0;color:#6B7280;">Reference</td><td style="padding:6px 0;font-family:ui-monospace,Menlo,monospace;font-size:13px;color:#374151;">${esc(enrollmentId)}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Next steps -->
          <tr>
            <td style="padding:0 40px 24px 40px;">
              <h3 style="margin:0 0 8px 0;font-size:16px;font-weight:700;color:#00373E;">What happens next?</h3>
              <p style="margin:0;font-size:14px;color:#6B7280;line-height:1.6;">
                Our team will reach out to you within 1 working day with program details, schedule, and onboarding instructions. If you have any questions, reply to this email or call us.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background-color:#FFF7ED;padding:24px 40px;text-align:center;">
              <a href="${SITE_URL}/contact" style="display:inline-block;background-color:#00373E;color:#ffffff;padding:12px 32px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">Contact us</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;background-color:#00373E;">
              <p style="margin:0 0 4px 0;font-size:13px;color:#9CA3AF;">Hope Trust, Banjara Hills, Hyderabad, India</p>
              <p style="margin:0;font-size:13px;color:#9CA3AF;">${SUPPORT_PHONE} &nbsp;|&nbsp; ${SUPPORT_EMAIL}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `Thank you, ${fullName}.`,
    '',
    'Your payment has been received and your enrollment is confirmed.',
    '',
    `Program: ${programTitle}`,
    programLevel ? `Level: ${programLevel}` : null,
    `Amount paid: ${amountDisplay}`,
    `Payment ID: ${paymentId}`,
    `Order ID: ${orderId}`,
    `Reference: ${enrollmentId}`,
    '',
    'Our team will reach out within 1 working day.',
    '',
    `Hope Trust, Banjara Hills, Hyderabad`,
    `${SUPPORT_PHONE} | ${SUPPORT_EMAIL}`,
  ].filter(Boolean).join('\n');

  return { subject, html, text };
}

/**
 * Build internal admin alert email for a new paid enrollment.
 */
export function buildAdminAlertEmail({
  fullName,
  email,
  phone,
  programType,
  programTitle,
  programLevel,
  amountInr,
  paymentId,
  orderId,
  enrollmentId,
  createdAt,
}) {
  const amountDisplay = formatINR(amountInr);
  const subject = `New enrollment — ${programTitle} — ${fullName}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
        <tr><td style="background:#00373E;padding:20px 24px;">
          <p style="margin:0;font-size:12px;color:#ED7428;letter-spacing:1.5px;text-transform:uppercase;font-weight:600;">New paid enrollment</p>
          <h1 style="margin:4px 0 0 0;font-size:20px;font-weight:700;color:#ffffff;">${esc(programTitle)}</h1>
        </td></tr>
        <tr><td style="padding:24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#111827;">
            <tr><td style="padding:6px 0;color:#6B7280;width:42%;">Name</td><td style="padding:6px 0;font-weight:600;">${esc(fullName)}</td></tr>
            <tr><td style="padding:6px 0;color:#6B7280;">Email</td><td style="padding:6px 0;"><a href="mailto:${esc(email)}" style="color:#00373E;">${esc(email)}</a></td></tr>
            <tr><td style="padding:6px 0;color:#6B7280;">Phone</td><td style="padding:6px 0;">${esc(phone)}</td></tr>
            <tr><td style="padding:6px 0;color:#6B7280;">Program type</td><td style="padding:6px 0;">${esc(programType)}</td></tr>
            ${programLevel ? `<tr><td style="padding:6px 0;color:#6B7280;">Level</td><td style="padding:6px 0;">${esc(programLevel)}</td></tr>` : ''}
            <tr><td style="padding:6px 0;color:#6B7280;">Amount</td><td style="padding:6px 0;font-weight:600;">${esc(amountDisplay)}</td></tr>
            <tr><td style="padding:6px 0;color:#6B7280;">Payment ID</td><td style="padding:6px 0;font-family:ui-monospace,Menlo,monospace;font-size:13px;">${esc(paymentId)}</td></tr>
            <tr><td style="padding:6px 0;color:#6B7280;">Order ID</td><td style="padding:6px 0;font-family:ui-monospace,Menlo,monospace;font-size:13px;">${esc(orderId)}</td></tr>
            <tr><td style="padding:6px 0;color:#6B7280;">Enrollment ID</td><td style="padding:6px 0;font-family:ui-monospace,Menlo,monospace;font-size:13px;">${esc(enrollmentId)}</td></tr>
            <tr><td style="padding:6px 0;color:#6B7280;">Created</td><td style="padding:6px 0;">${esc(createdAt)}</td></tr>
          </table>
        </td></tr>
        <tr><td style="background:#F9FAFB;padding:16px 24px;text-align:center;">
          <a href="${SITE_URL}/admin" style="display:inline-block;background:#00373E;color:#ffffff;padding:10px 24px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Open admin dashboard</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    'New paid enrollment',
    '',
    `Program: ${programTitle}`,
    programLevel ? `Level: ${programLevel}` : null,
    `Type: ${programType}`,
    `Amount: ${amountDisplay}`,
    '',
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    '',
    `Payment ID: ${paymentId}`,
    `Order ID: ${orderId}`,
    `Enrollment ID: ${enrollmentId}`,
    `Created: ${createdAt}`,
  ].filter(Boolean).join('\n');

  return { subject, html, text };
}

/**
 * Send an email via Resend REST API (no SDK — keeps deps small for Netlify Functions).
 * Returns { ok, id?, error? } and never throws.
 */
export async function sendEmail({ to, subject, html, text, from, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY not configured' };

  const fromAddr = from
    || process.env.NEWSLETTER_FROM_EMAIL
    || 'Hope Trust <frontoffice@hopetrustindia.com>';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromAddr,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
        reply_to: replyTo || SUPPORT_EMAIL,
      }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data?.message || `Resend ${res.status}` };
    return { ok: true, id: data?.id };
  } catch (err) {
    return { ok: false, error: err?.message || 'Email send failed' };
  }
}
