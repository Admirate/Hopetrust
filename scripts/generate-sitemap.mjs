#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'out');
const BLOG_DIR = path.join(ROOT, 'content', 'blogs');
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://hopetrustindia.com'
).replace(/\/$/, '');

// Guard against the staging domain leaking into the sitemap, robots.txt and
// llms.txt, which is what happens when NEXT_PUBLIC_SITE_URL is left pointing at
// the Netlify preview host.
if (/netlify\.app/i.test(SITE_URL)) {
  console.warn(
    `\n  WARNING: NEXT_PUBLIC_SITE_URL is "${SITE_URL}".\n` +
      `  Sitemap, robots.txt and llms.txt will advertise the staging domain.\n` +
      `  Set it to the production domain in the Netlify environment variables.\n`
  );
}

const staticPages = [
  { path: '/',                       changefreq: 'weekly',  priority: '1.0', title: 'Home', desc: 'Mental health and addiction recovery care in Hyderabad.' },
  { path: '/about/',                 changefreq: 'monthly', priority: '0.9', title: 'About Hope Trust', desc: 'Our story since 2002, our team, and our evidence-based approach.' },
  { path: '/mental-health/',         changefreq: 'monthly', priority: '0.9', title: 'Mental Health Services', desc: 'Therapy, psychiatry, couples and family therapy for anxiety, depression, trauma, ADHD, OCD and grief.' },
  { path: '/addiction/',             changefreq: 'monthly', priority: '0.9', title: 'Addiction Recovery Services', desc: 'Outpatient and online treatment for alcohol, drug, nicotine and behavioural addiction.' },
  { path: '/training/',              changefreq: 'monthly', priority: '0.9', title: 'Training Programs', desc: 'Professional training and certification in mental health and addiction counselling.' },
  { path: '/corporate-wellness/',    changefreq: 'monthly', priority: '0.8', title: 'Corporate Wellness', desc: 'Employee mental health programmes, workshops and structured workplace support.' },
  { path: '/intervention-services/', changefreq: 'monthly', priority: '0.8', title: 'Intervention Services', desc: 'Professional intervention to help a loved one seek addiction treatment.' },
  { path: '/blogs/',                 changefreq: 'weekly',  priority: '0.8', title: 'Blog', desc: 'Articles on mental health, therapy, addiction recovery and wellness.' },
  { path: '/book-your-session/',     changefreq: 'monthly', priority: '0.7', title: 'Book Your Session', desc: 'Browse therapists and psychiatrists and book an in-clinic or online session.' },
  { path: '/contact/',               changefreq: 'monthly', priority: '0.7', title: 'Contact', desc: 'Location, hours and contact details for the Banjara Hills clinic.' },
  { path: '/terms-and-conditions/',  changefreq: 'monthly', priority: '0.3' },
  { path: '/cancellation-policy/',   changefreq: 'monthly', priority: '0.3' },
  { path: '/privacy-policy/',        changefreq: 'monthly', priority: '0.3' },
  { path: '/sitemap/',               changefreq: 'monthly', priority: '0.3' },
];

/** Blog posts with their real dates, newest first. */
function getBlogPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      try {
        const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8'));
        return {
          slug,
          title: data.title || slug,
          excerpt: data.excerpt || '',
          lastmod: toIsoDate(data.modified || data.date),
          sortKey: new Date(data.date || 0).getTime() || 0,
        };
      } catch {
        return { slug, title: slug, excerpt: '', lastmod: today(), sortKey: 0 };
      }
    })
    .sort((a, b) => b.sortKey - a.sortKey);
}

function today() {
  return new Date().toISOString().split('T')[0];
}

/** Normalise frontmatter dates (string or Date) to YYYY-MM-DD. */
function toIsoDate(value) {
  if (!value) return today();
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? today() : d.toISOString().split('T')[0];
}

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSitemap(posts) {
  const now = today();

  const urls = [
    ...staticPages.map(
      (page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    ),
    ...posts.map(
      (post) => `  <url>
    <loc>${xmlEscape(`${SITE_URL}/blogs/${post.slug}/`)}</loc>
    <lastmod>${post.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

function buildRobots() {
  return `# https://hopetrustindia.com

User-agent: *
Allow: /
Disallow: /arel-ops/

# --- AI / LLM crawlers -------------------------------------------------
# Explicitly allowed. These bots read the site for AI answer engines
# (ChatGPT, Claude, Perplexity, Google AI Overviews, Bing Copilot).
# Change Allow to Disallow for any bot that should not read this content.

User-agent: GPTBot
Allow: /
Disallow: /arel-ops/

User-agent: OAI-SearchBot
Allow: /
Disallow: /arel-ops/

User-agent: ChatGPT-User
Allow: /
Disallow: /arel-ops/

User-agent: ClaudeBot
Allow: /
Disallow: /arel-ops/

User-agent: Claude-User
Allow: /
Disallow: /arel-ops/

User-agent: Claude-SearchBot
Allow: /
Disallow: /arel-ops/

User-agent: PerplexityBot
Allow: /
Disallow: /arel-ops/

User-agent: Perplexity-User
Allow: /
Disallow: /arel-ops/

User-agent: Google-Extended
Allow: /
Disallow: /arel-ops/

User-agent: Applebot-Extended
Allow: /
Disallow: /arel-ops/

User-agent: meta-externalagent
Allow: /
Disallow: /arel-ops/

User-agent: Bingbot
Allow: /
Disallow: /arel-ops/

User-agent: CCBot
Allow: /
Disallow: /arel-ops/

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

/**
 * llms.txt — a plain-text map of the site for AI answer engines.
 * Spec: https://llmstxt.org/ . Google ignores it; ChatGPT, Perplexity and
 * others may use it to find the canonical pages worth reading.
 * Capped at the most recent posts so the file stays readable.
 */
function buildLlmsTxt(posts) {
  const RECENT = 60;

  const primary = staticPages
    .filter((p) => p.title)
    .map((p) => `- [${p.title}](${SITE_URL}${p.path}): ${p.desc}`)
    .join('\n');

  const articles = posts
    .slice(0, RECENT)
    .map((p) => {
      const summary = p.excerpt.replace(/\s+/g, ' ').trim().slice(0, 160);
      return `- [${p.title}](${SITE_URL}/blogs/${p.slug}/)${summary ? `: ${summary}` : ''}`;
    })
    .join('\n');

  return `# Hope Trust

> Hope Trust is a mental health and addiction recovery centre in Banjara Hills,
> Hyderabad, India, operating since 2002. We provide therapy, psychiatry,
> outpatient and online addiction treatment, professional intervention services,
> corporate wellness programmes, and clinical training. Care is delivered by a
> multidisciplinary team of 30+ professionals.

Hope Trust is operated by Arel Hope Recovery Services LLP. Content on this site
is general information about mental health and addiction, not a substitute for
individual clinical assessment. Anyone in immediate danger should contact local
emergency services.

## Services

${primary}

## Contact

- Address: C/o UCCHVAS Rehabilitation Center, Plot no. 564-A-36-111, Opp. Lotus Pond Road, MLA Colony, Banjara Hills, Hyderabad 500034, Telangana, India
- Phone: +91 9000850001
- Email: frontoffice@hopetrustindia.com
- Hours: Monday to Saturday, 10:00-19:00 IST

## Recent articles

${articles}

## Full index

- [Sitemap (HTML)](${SITE_URL}/sitemap/)
- [Sitemap (XML)](${SITE_URL}/sitemap.xml): all ${posts.length + staticPages.length} pages
`;
}

// --- write ---------------------------------------------------------------

const posts = getBlogPosts();
const targetDir = fs.existsSync(OUT_DIR) ? OUT_DIR : path.join(ROOT, 'public');
const label = targetDir === OUT_DIR ? 'out' : 'public';

const files = [
  ['sitemap.xml', buildSitemap(posts)],
  ['robots.txt', buildRobots()],
  ['llms.txt', buildLlmsTxt(posts)],
];

for (const [name, contents] of files) {
  fs.writeFileSync(path.join(targetDir, name), contents);
  console.log(`${name} written to ${label}/${name}`);
}

console.log(
  `  ${staticPages.length} static pages + ${posts.length} posts -> ${SITE_URL}`
);
