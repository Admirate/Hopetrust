#!/usr/bin/env node
/**
 * Repair the internal links the WordPress import broke.
 *
 *   node scripts/repair-links.mjs report
 *   node scripts/repair-links.mjs apply --dry-run
 *   node scripts/repair-links.mjs apply
 *
 * The migration kept every link's destination and threw away its text, leaving
 * ~2000 naked URLs sitting in parentheses mid-sentence:
 *
 *   Generalised (https://hopetrustindia.com/blog/the-10-most-common-phobias/)
 *
 * A reader sees a raw URL as the clickable text, and a search engine sees
 * anchor text that says nothing about the destination. Worse, hundreds of them
 * point at a URL structure the site no longer has — /counselling-psychologists/,
 * /what-do-we-treat/..., /about-us/... — so they resolve to 404s.
 *
 * This restores the two things that were lost, without inventing either:
 *   - the destination, by mapping old paths onto their current equivalents
 *   - the anchor text, taken from the destination page's own title
 *
 * Where a link carried a title attribute — (url "Addiction treatment") — that
 * text was the author's own and is used as-is.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blogs');
const SITE = /^https?:\/\/(www\.)?hopetrustindia\.com/i;

/** Live pages, with the words a reader should see for each. */
const PAGE_LABELS = {
  '/': 'Hope Trust',
  '/about/': 'about Hope Trust',
  '/mental-health/': 'our mental health services',
  '/addiction/': 'our addiction recovery services',
  '/intervention-services/': 'our intervention services',
  '/corporate-wellness/': 'our corporate wellness programmes',
  '/training/': 'our training programmes',
  '/book-your-session/': 'our therapists',
  '/contact/': 'contact us',
  '/blogs/': 'our blog',
};

/**
 * Old path -> current path. Longest prefix wins, so the specific entries above
 * a catch-all do the right thing for their subtree.
 */
const REDIRECTS = [
  ['/what-do-we-treat/alcohol-addiction', '/addiction/'],
  ['/what-do-we-treat/behavioral-addiction', '/addiction/'],
  ['/what-do-we-treat/dual-diagnosis', '/addiction/'],
  ['/what-do-we-treat/', '/mental-health/'],
  ['/what-do-we-treat', '/mental-health/'],
  ['/service/intervention-services', '/intervention-services/'],
  ['/service/', '/addiction/'],
  ['/about-us/know-your-therapists', '/book-your-session/'],
  ['/about-us', '/about/'],
  ['/counselling-psychologists', '/book-your-session/'],
  ['/online-counselling-therapists', '/book-your-session/'],
  ['/therapist-details', '/book-your-session/'],
  ['/therapist-list', '/book-your-session/'],
  ['/psychological-services', '/mental-health/'],
  ['/specialised-addiction-services', '/addiction/'],
  ['/recovery-program', '/addiction/'],
  ['/adhd-clinic', '/mental-health/'],
  ['/assessment', '/mental-health/'],
  ['/training', '/training/'],
  ['/contact-us', '/contact/'],
  ['/services/', '/addiction/'],
  ['/outpatient-care', '/addiction/'],
  ['/online-care', '/addiction/'],
  ['/content/online-care', '/addiction/'],
];

/** Paths worth no link at all — the destination is gone and has no successor. */
const DROP = ['/uncategorized', '/product', '/wp-content', '/checkout'];

const posts = new Map(); // slug -> title
const therapists = new Map(); // slug -> name

/** Mirrors doctorSlug() in lib/doctors.ts, so profile URLs agree. */
function doctorSlug(name) {
  return name
    .replace(/^(Mrs?\.?|Ms\.?|Dr\.?|Prof\.?)\s+/i, '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function loadTherapists() {
  const snap = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'doctors-snapshot.json'), 'utf8')
  );
  for (const d of snap.doctors) therapists.set(doctorSlug(d.name), d.name);
}

function loadPosts() {
  for (const file of fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))) {
    const { data } = matter(fs.readFileSync(path.join(BLOG_DIR, file), 'utf8'));
    posts.set(data.slug || file.replace(/\.mdx$/, ''), data.title || '');
  }
}

/**
 * Resolve one raw href.
 * Returns { href, label } for a link worth keeping, or null to drop the link.
 */
function resolve(raw) {
  const url = raw.trim().replace(/[.,;]+$/, '');

  // Leave anything genuinely external alone.
  if (!SITE.test(url) && /^https?:\/\//i.test(url)) return { href: url, label: null };

  let p = url.replace(SITE, '') || '/';
  p = p.split('#')[0].split('?')[0];
  if (!p.startsWith('/')) p = '/' + p;

  if (DROP.some((d) => p.startsWith(d))) return null;

  // Blog posts: the destination's own title is the anchor text.
  const blog = p.match(/^\/blogs?\/([a-z0-9-]+)\/?$/i);
  if (blog) {
    const slug = blog[1];
    if (posts.has(slug)) {
      return { href: `/blogs/${slug}/`, label: posts.get(slug) };
    }
    // The post did not survive the migration; send the reader to the archive.
    return { href: '/blogs/', label: PAGE_LABELS['/blogs/'] };
  }
  if (/^\/blogs?\/?$/i.test(p)) return { href: '/blogs/', label: PAGE_LABELS['/blogs/'] };

  // Practitioner profiles. The archive links to honorific-prefixed slugs
  // ("dr-vidhya-sagar") that the current slug rule does not produce, so an
  // unknown name goes to the directory rather than to a 404.
  const who = p.match(/^\/therapists\/([a-z0-9-]+)\/?$/i);
  if (who) {
    const slug = who[1].replace(/^(dr|mrs?|ms|prof)-/, '');
    if (therapists.has(slug)) {
      return { href: `/therapists/${slug}/`, label: therapists.get(slug) };
    }
    return { href: '/book-your-session/', label: PAGE_LABELS['/book-your-session/'] };
  }

  if (p === '/' || p === '') return { href: '/', label: PAGE_LABELS['/'] };

  if (PAGE_LABELS[p]) return { href: p, label: PAGE_LABELS[p] };

  const hit = REDIRECTS.find(([from]) => p.startsWith(from));
  if (hit) return { href: hit[1], label: PAGE_LABELS[hit[1]] ?? null };

  // An older generation still: /content/drug-addiction, /treatment.html,
  // /addictionrecovery/. There is no path mapping for these, but the subject is
  // written into the URL itself, so route on that rather than leave a 404.
  const words = p.toLowerCase();
  if (/addict|alcohol|drug|rehab|sober|recovery|detox|cocaine|substance|treatment/.test(words)) {
    return { href: '/addiction/', label: PAGE_LABELS['/addiction/'] };
  }
  if (/mental|psych|therap|counsel|depress|anxiet|esteem|stress|wellness/.test(words)) {
    return { href: '/mental-health/', label: PAGE_LABELS['/mental-health/'] };
  }

  return { href: null, label: null }; // unmapped — reported, left untouched
}

/** Escape markdown link-text characters so the rewrite cannot nest brackets. */
function safeLabel(text) {
  return String(text).replace(/[[\]]/g, '').replace(/\s+/g, ' ').trim();
}

const unmapped = new Map();

function repairBody(content) {
  let changed = 0;

  // 1. Bare URLs in parentheses, optionally with a title attribute.
  //    (https://…)  or  (https://… "Some text")
  let body = content.replace(
    /(!?)\((https?:\/\/[^\s)"]+)(?:\s+"([^"]*)")?\)/g,
    (whole, bang, url, title) => {
      // A leading "!" means the import mangled an image the same way it
      // mangled links. Every one points at /wp-content/ on the old WordPress
      // host, which now 404s, so the whole construct goes — today it renders
      // as a stray "!" followed by a dead link.
      if (bang) {
        changed++;
        return '';
      }
      const r = resolve(url);
      if (r === null) {
        // Dropping a dead link is still a change. Without counting it, a post
        // whose only repair was a removal never gets written back.
        changed++;
        return title ? safeLabel(title) : '';
      }
      if (r.href === null) {
        unmapped.set(url, (unmapped.get(url) ?? 0) + 1);
        return whole;
      }
      const label = safeLabel(title || r.label || '');
      if (!label) return whole; // nothing meaningful to say; leave as-is
      changed++;
      return `([${label}](${r.href}))`;
    }
  );

  // 2. Existing proper links: keep the author's text, fix a dead destination.
  body = body.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (whole, text, url) => {
    if (!SITE.test(url)) return whole;
    const r = resolve(url);
    if (r === null) return safeLabel(text);
    if (r.href === null) {
      unmapped.set(url, (unmapped.get(url) ?? 0) + 1);
      return whole;
    }
    if (r.href === url.replace(SITE, '')) return whole;
    changed++;
    return `[${safeLabel(text)}](${r.href})`;
  });

  return { body, changed };
}

// ------------------------------------------------------------------ main ---

loadPosts();
loadTherapists();

const cmd = process.argv[2] || 'report';
const dryRun = process.argv.includes('--dry-run');
const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

let touchedPosts = 0;
let totalLinks = 0;

for (const file of files) {
  const full = path.join(BLOG_DIR, file);
  const raw = fs.readFileSync(full, 'utf8');
  const match = raw.match(/^(---\r?\n[\s\S]*?\r?\n---\r?\n)([\s\S]*)$/);
  if (!match) continue;

  const { body, changed } = repairBody(match[2]);
  if (!changed) continue;

  touchedPosts++;
  totalLinks += changed;

  if (cmd === 'apply' && !dryRun) fs.writeFileSync(full, match[1] + body);
}

console.log(
  `\n${cmd === 'apply' && !dryRun ? 'Repaired' : 'Would repair'} ${totalLinks} links across ${touchedPosts} posts (of ${files.length}).\n`
);

if (unmapped.size) {
  console.log('Unmapped internal URLs (left untouched):');
  [...unmapped.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([url, n]) => console.log(`  ${String(n).padStart(4)}  ${url}`));
  console.log('');
}
