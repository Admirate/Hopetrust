#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'out');
const BLOG_DIR = path.join(ROOT, 'content', 'blogs');
const DOCTORS_SNAPSHOT = path.join(ROOT, 'data', 'doctors-snapshot.json');
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
          featuredImage: data.featuredImage || '',
          categories: data.categories || [],
          tags: data.tags || [],
          author: data.author || 'Hope Trust',
          date: typeof data.date === 'string' ? data.date : toIsoDate(data.date),
          lastmod: toIsoDate(data.modified || data.date),
          sortKey: new Date(data.date || 0).getTime() || 0,
        };
      } catch {
        return {
          slug,
          title: slug,
          excerpt: '',
          featuredImage: '',
          categories: [],
          tags: [],
          author: 'Hope Trust',
          date: today(),
          lastmod: today(),
          sortKey: 0,
        };
      }
    })
    .sort((a, b) => b.sortKey - a.sortKey);
}

/**
 * Practitioner profile URLs.
 *
 * Read from the committed snapshot rather than Supabase so sitemap generation
 * stays offline-safe. `lib/doctors.ts` owns the same slug rule — keep the two in
 * step if that changes.
 */
function getTherapists() {
  if (!fs.existsSync(DOCTORS_SNAPSHOT)) return [];
  try {
    const { doctors, capturedAt } = JSON.parse(fs.readFileSync(DOCTORS_SNAPSHOT, 'utf-8'));

    // Next.js suppresses console output from its static-generation workers, so
    // a silent fallback to this snapshot is invisible in the build log. Warn
    // here instead — this script runs in the main process.
    const ageDays = Math.floor((Date.now() - new Date(capturedAt).getTime()) / 86400000);
    if (Number.isFinite(ageDays) && ageDays > 90) {
      console.warn(
        `\n  WARNING: data/doctors-snapshot.json was captured ${ageDays} days ago (${capturedAt}).\n` +
          `  It is the fallback used when Supabase is unreachable at build time.\n` +
          `  Refresh it with "npm run snapshot:doctors".\n`
      );
    }

    const seen = new Map();
    return doctors.map((d) => {
      const base =
        d.name
          .replace(/^(Mrs?\.?|Ms\.?|Dr\.?|Prof\.?)\s+/i, '')
          .toLowerCase()
          .normalize('NFKD')
          .replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') || 'therapist';
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      return {
        slug: count === 0 ? base : `${base}-${count + 1}`,
        name: d.name,
        qualification: d.qualification,
        department: d.department,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Cross-check the slugs derived above against the directories Next.js actually
 * emitted. If the two rules ever drift, the sitemap would advertise 404s — so
 * fail loudly here rather than shipping broken URLs.
 */
function verifyTherapistSlugs(therapists) {
  const dir = path.join(OUT_DIR, 'therapists');
  if (!fs.existsSync(dir)) return therapists;

  const built = new Set(
    fs.readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
  );
  const derived = new Set(therapists.map((t) => t.slug));

  const missing = [...derived].filter((s) => !built.has(s));
  const extra = [...built].filter((s) => !derived.has(s));

  if (missing.length || extra.length) {
    console.error(
      `\n  ERROR: therapist slug mismatch between data/doctors-snapshot.json and the build.\n` +
        (missing.length ? `  In sitemap but not built: ${missing.join(', ')}\n` : '') +
        (extra.length ? `  Built but not in sitemap: ${extra.join(', ')}\n` : '') +
        `  Run "npm run snapshot:doctors" to refresh the snapshot.\n`
    );
    process.exit(1);
  }

  return therapists;
}

/**
 * Every archive URL in the sitemap must correspond to a page Next.js actually
 * emitted. Mirrors verifyTherapistSlugs — the pagination and category rules live
 * in both lib/blog.ts and this script, so drift has to fail loudly.
 */
function verifyArchiveUrls(urls) {
  if (!fs.existsSync(OUT_DIR)) return urls;

  const missing = urls.filter(
    (u) => !fs.existsSync(path.join(OUT_DIR, u.replace(/^\/|\/$/g, ''), 'index.html'))
  );

  if (missing.length) {
    console.error(
      `\n  ERROR: sitemap lists blog archive URLs that were not built:\n` +
        missing.map((u) => `    ${u}`).join('\n') +
        `\n  The pagination/category rules in scripts/generate-sitemap.mjs and\n` +
        `  lib/blog.ts have drifted.\n`
    );
    process.exit(1);
  }

  return urls;
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

const POSTS_PER_PAGE = 12;
const GENERIC_CATEGORY = 'Blog';
const MIN_INDEXABLE_CATEGORY_POSTS = 3;

/**
 * Blog archive URLs: pages 2..N (page 1 is /blogs/) and the indexable category
 * archives. Thin archives (< 3 posts) and the generic "Blog" catch-all are
 * excluded — they are noindex or have no page, so listing them would contradict
 * the pages themselves. Mirrors the policy in lib/blog.ts.
 */
function getArchiveUrls(posts) {
  const pages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const urls = [];

  for (let n = 2; n <= pages; n++) urls.push(`/blogs/p/${n}/`);

  const counts = new Map();
  for (const p of posts) {
    for (const c of p.categories) counts.set(c, (counts.get(c) ?? 0) + 1);
  }

  for (const [name, count] of [...counts.entries()].sort()) {
    if (name === GENERIC_CATEGORY || count < MIN_INDEXABLE_CATEGORY_POSTS) continue;
    const slug = name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    urls.push(`/blogs/category/${slug}/`);
  }

  return urls;
}

function buildSitemap(posts, therapists, archiveUrls) {
  const now = today();

  const urls = [
    ...archiveUrls.map(
      (u) => `  <url>
    <loc>${xmlEscape(`${SITE_URL}${u}`)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`
    ),
    ...staticPages.map(
      (page) => `  <url>
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    ),
    ...therapists.map(
      (t) => `  <url>
    <loc>${xmlEscape(`${SITE_URL}/therapists/${t.slug}/`)}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
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
function buildLlmsTxt(posts, therapists) {
  const RECENT = 60;

  const primary = staticPages
    .filter((p) => p.title)
    .map((p) => `- [${p.title}](${SITE_URL}${p.path}): ${p.desc}`)
    .join('\n');

  const clinicians = therapists
    .map(
      (t) =>
        `- [${t.name}](${SITE_URL}/therapists/${t.slug}/): ${t.qualification}, ${t.department}`
    )
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

## Clinicians

${clinicians}

## Contact

- Address: C/o UCCHVAS Rehabilitation Center, Plot no. 564-A-36-111, Opp. Lotus Pond Road, MLA Colony, Banjara Hills, Hyderabad 500034, Telangana, India
- Phone: +91 9000850001
- Email: frontoffice@hopetrustindia.com
- Hours: Monday to Saturday, 10:00-19:00 IST

## Recent articles

${articles}

## Full index

- [Sitemap (HTML)](${SITE_URL}/sitemap/)
- [Sitemap (XML)](${SITE_URL}/sitemap.xml): all ${posts.length + staticPages.length + therapists.length} pages
`;
}

// --- write ---------------------------------------------------------------

const posts = getBlogPosts();
const therapists = verifyTherapistSlugs(getTherapists());
const archiveUrls = verifyArchiveUrls(getArchiveUrls(posts));
const targetDir = fs.existsSync(OUT_DIR) ? OUT_DIR : path.join(ROOT, 'public');
const label = targetDir === OUT_DIR ? 'out' : 'public';

// Fetched by the blog archive the first time a reader searches, so the full
// corpus stays off the initial page load.
const searchIndex = posts.map((p) => ({
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  featuredImage: p.featuredImage,
  categories: p.categories,
  tags: p.tags,
  author: p.author,
  date: p.date,
}));

const files = [
  ['sitemap.xml', buildSitemap(posts, therapists, archiveUrls)],
  ['robots.txt', buildRobots()],
  ['llms.txt', buildLlmsTxt(posts, therapists)],
  ['blogs-search-index.json', JSON.stringify(searchIndex)],
];

for (const [name, contents] of files) {
  fs.writeFileSync(path.join(targetDir, name), contents);
  console.log(`${name} written to ${label}/${name}`);
}

console.log(
  `  ${staticPages.length} static + ${therapists.length} therapists + ${posts.length} posts -> ${SITE_URL}`
);
