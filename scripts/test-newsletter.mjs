#!/usr/bin/env node

/**
 * Test script for the newsletter email.
 *
 * Usage:
 *   1. Set your Resend API key:  set RESEND_API_KEY=re_your_key_here
 *   2. Run:  node scripts/test-newsletter.mjs your-email@example.com
 *
 * This sends a single test newsletter to the email you provide,
 * so you can preview the template without emailing all subscribers.
 */

import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const testEmail = process.argv[2];

if (!RESEND_API_KEY) {
  console.error('Missing RESEND_API_KEY. Set it first:');
  console.error('  Windows:  set RESEND_API_KEY=re_your_key_here');
  console.error('  Mac/Linux: export RESEND_API_KEY=re_your_key_here');
  process.exit(1);
}

if (!testEmail) {
  console.error('Usage: node scripts/test-newsletter.mjs <your-email@example.com>');
  process.exit(1);
}

const samplePosts = [
  {
    title: 'The Most Important Connection You Can Have: With Yourself',
    excerpt:
      'Before you can love, trust, or genuinely know another person, you must first reconcile with yourself.',
    url: 'http://localhost:3000/blogs/the-most-important-connection-you-can-have-with-yourself/',
    featuredImage:
      'https://hopetrustindia.com/wp-content/uploads/2025/12/The-Most-Important-Connection-You-Can-Have.jpg',
  },
  {
    title: 'How to Stay Calm in Any Situation: 5 Stoic Principles',
    excerpt:
      'Life constantly tests our composure. Whether facing financial pressure, relationship conflicts, or unexpected challenges.',
    url: 'http://localhost:3000/blogs/how-to-stay-calm-in-any-situation-5-stoic-principles/',
    featuredImage: '',
  },
];

const customMessage = `
<p>Hello!</p>
<p>Welcome to this week's Hope Trust newsletter. We've been exploring some powerful ideas around self-connection, emotional resilience, and finding calm in the storm.</p>
<p>Here are a couple of articles we think you'll find meaningful.</p>
`;

function buildHtml(message, posts) {
  const postCards = posts
    .map(
      (post) => `
    <tr>
      <td style="padding: 0 0 20px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
          ${
            post.featuredImage
              ? `<tr><td style="padding: 0;"><img src="${post.featuredImage}" alt="${post.title}" width="100%" style="display: block; max-height: 200px; object-fit: cover; border-radius: 12px 12px 0 0;" /></td></tr>`
              : ''
          }
          <tr>
            <td style="padding: 20px 24px;">
              <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #00373E; line-height: 1.3;">${post.title}</h3>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #6B7280; line-height: 1.5;">${post.excerpt}</p>
              <a href="${post.url}" style="display: inline-block; background-color: #ED7428; color: #ffffff; padding: 10px 24px; border-radius: 50px; text-decoration: none; font-size: 14px; font-weight: 600;">Read Article</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Hope Trust Newsletter</title></head>
<body style="margin: 0; padding: 0; background-color: #F7F6F4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F6F4;">
    <tr><td align="center" style="padding: 40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
        <tr><td style="background-color: #00373E; padding: 32px 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">Hope Trust</h1>
          <p style="margin: 8px 0 0 0; font-size: 14px; color: #ED7428; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">Weekly Newsletter</p>
        </td></tr>
        <tr><td style="padding: 32px 40px;">
          <div style="font-size: 16px; color: #374151; line-height: 1.7;">${message}</div>
        </td></tr>
        <tr><td style="padding: 0 40px;"><hr style="border: none; border-top: 2px solid #F3F4F6; margin: 0;" /></td></tr>
        <tr><td style="padding: 32px 40px 16px 40px;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 700; color: #00373E;">Recent from our blog</h2>
          <p style="margin: 6px 0 0 0; font-size: 14px; color: #9CA3AF;">Our latest insights and articles</p>
        </td></tr>
        <tr><td style="padding: 16px 40px 32px 40px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${postCards}</table>
        </td></tr>
        <tr><td style="background-color: #FFF7ED; padding: 32px 40px; text-align: center;">
          <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 700; color: #00373E;">Need support?</h3>
          <p style="margin: 0 0 20px 0; font-size: 14px; color: #6B7280; line-height: 1.5;">Our team is here to help you on your journey to wellness.</p>
          <a href="https://hopetrustindia.com/contact" style="display: inline-block; background-color: #00373E; color: #ffffff; padding: 12px 32px; border-radius: 50px; text-decoration: none; font-size: 14px; font-weight: 600;">Book a Session</a>
        </td></tr>
        <tr><td style="padding: 24px 40px; text-align: center; background-color: #00373E;">
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #9CA3AF;">Hope Trust, Banjara Hills, Hyderabad, India</p>
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #9CA3AF;">+91 90008 50001 | frontoffice@hopetrustindia.com</p>
          <p style="margin: 12px 0 0 0; font-size: 12px;"><a href="#" style="color: #ED7428; text-decoration: underline;">Unsubscribe</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function main() {
  console.log(`Sending test newsletter to: ${testEmail}\n`);

  const resend = new Resend(RESEND_API_KEY);
  const html = buildHtml(customMessage, samplePosts);

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: testEmail,
      subject: 'This Week at Hope Trust (TEST)',
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      process.exit(1);
    }

    console.log('Email sent successfully!');
    console.log('Email ID:', data?.id);
    console.log('\nCheck your inbox (and spam folder) for the test email.');
  } catch (err) {
    console.error('Failed:', err.message);
    process.exit(1);
  }
}

main();
