#!/usr/bin/env node
/**
 * Blog attribution tool — assigns named clinician bylines and medical
 * reviewers to posts, and reports how much of the archive is covered.
 *
 *   node scripts/attribution.mjs report
 *   node scripts/attribution.mjs apply content/attribution.json
 *   node scripts/attribution.mjs apply content/attribution.json --dry-run
 *
 * Attribution is deliberately data-driven rather than inferred. Deciding that
 * a named clinician wrote or medically reviewed an article is a factual claim
 * about a real person's professional work — it belongs to whoever knows the
 * answer, not to a script guessing from a filename. This tool only applies a
 * mapping someone has authored.
 *
 * Mapping format (content/attribution.json):
 * {
 *   "reviewedOn": "2026-08-25",          // default review date for `rules`
 *   "rules": [                            // first matching rule wins
 *     { "match": ["alcohol", "drinking"], "author": "nishanth-vemana",
 *       "reviewedBy": "k-aparna" }
 *   ],
 *   "bySlug": {                           // explicit, overrides `rules`
 *     "10-things-i-learnt-in-rehab": { "author": "rajeshwari-luther" }
 *   }
 * }
 *
 * `match` entries are case-insensitive substrings tested against the slug and
 * the title. A post matching no rule keeps its organisation byline.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'content', 'blogs');
const SNAPSHOT = path.join(ROOT, 'data', 'doctors-snapshot.json');

/** Mirrors doctorSlug() in lib/doctors.ts — the profile URLs must agree. */
function doctorSlug(name) {
  return name
    .replace(/^(Mrs?\.?|Ms\.?|Dr\.?|Prof\.?)\s+/i, '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function loadPractitioners() {
  const snap = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'));
  const seen = new Map();
  return snap.doctors.map((d) => {
    const base = doctorSlug(d.name) || 'therapist';
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return {
      slug: n === 0 ? base : `${base}-${n + 1}`,
      name: d.name,
      qualification: d.qualification,
      department: d.department,
    };
  });
}

function loadPosts() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(BLOG_DIR, file);
      const raw = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(raw);
      return {
        file,
        filePath,
        raw,
        data,
        slug: data.slug || file.replace(/\.mdx$/, ''),
        title: data.title || '',
        words: content.trim().split(/\s+/).filter(Boolean).length,
      };
    });
}

// ---------------------------------------------------------------- report ---

function report() {
  const posts = loadPosts();
  const people = loadPractitioners();

  const authored = posts.filter((p) => p.data.authorSlug);
  const reviewed = posts.filter((p) => p.data.reviewedBy && p.data.reviewedOn);
  const pct = (n) => `${((n / posts.length) * 100).toFixed(1)}%`;

  console.log(`\nAttribution coverage — ${posts.length} posts\n`);
  console.log(`  named author     ${String(authored.length).padStart(4)}  (${pct(authored.length)})`);
  console.log(`  medically reviewed ${String(reviewed.length).padStart(2)}  (${pct(reviewed.length)})\n`);

  const known = new Set(people.map((p) => p.slug));
  const bad = posts.filter(
    (p) =>
      (p.data.authorSlug && !known.has(p.data.authorSlug)) ||
      (p.data.reviewedBy && !known.has(p.data.reviewedBy))
  );
  if (bad.length) {
    console.log(`  ${bad.length} post(s) reference an unknown practitioner slug:`);
    bad.forEach((p) => console.log(`    ${p.slug}`));
    console.log('');
  }

  const dated = posts.filter((p) => p.data.reviewedBy && !p.data.reviewedOn);
  if (dated.length) {
    console.log(`  ${dated.length} post(s) name a reviewer but no reviewedOn date (ignored at build):`);
    dated.forEach((p) => console.log(`    ${p.slug}`));
    console.log('');
  }

  const byPerson = new Map();
  for (const p of authored) {
    byPerson.set(p.data.authorSlug, (byPerson.get(p.data.authorSlug) ?? 0) + 1);
  }
  if (byPerson.size) {
    console.log('  Posts per author:');
    [...byPerson.entries()]
      .sort((a, b) => b[1] - a[1])
      .forEach(([slug, n]) => {
        const person = people.find((x) => x.slug === slug);
        console.log(`    ${String(n).padStart(4)}  ${person ? person.name : slug}`);
      });
    console.log('');
  }

  console.log('  Available practitioner slugs:');
  people.forEach((p) =>
    console.log(`    ${p.slug.padEnd(26)} ${p.name} — ${p.qualification}`)
  );
  console.log('');
}

// ----------------------------------------------------------------- apply ---

function pickRule(post, mapping) {
  const explicit = mapping.bySlug?.[post.slug];
  if (explicit) return explicit;

  const haystack = `${post.slug} ${post.title}`.toLowerCase();
  return (mapping.rules ?? []).find((rule) =>
    (rule.match ?? []).some((needle) => haystack.includes(String(needle).toLowerCase()))
  );
}

/**
 * Frontmatter is rewritten textually rather than re-serialised by gray-matter,
 * which would reformat dates and quoting across all 395 files and bury the real
 * change in noise.
 */
function setField(block, key, value) {
  const line = `${key}: ${value}`;
  const re = new RegExp(`^${key}:.*$`, 'm');
  return re.test(block) ? block.replace(re, line) : `${block.trimEnd()}\n${line}\n`;
}

function apply(mappingPath, dryRun) {
  const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
  const people = loadPractitioners();
  const known = new Set(people.map((p) => p.slug));

  // Fail before touching anything if the mapping names someone who is not a
  // practitioner here — a typo would otherwise publish a byline for a person
  // who does not exist.
  const referenced = [
    ...Object.values(mapping.bySlug ?? {}),
    ...(mapping.rules ?? []),
  ].flatMap((r) => [r.author, r.reviewedBy].filter(Boolean));
  const unknown = [...new Set(referenced)].filter((s) => !known.has(s));
  if (unknown.length) {
    console.error(`\nUnknown practitioner slug(s): ${unknown.join(', ')}`);
    console.error('Run `node scripts/attribution.mjs report` for the valid list.\n');
    process.exit(1);
  }

  const posts = loadPosts();
  let changed = 0;

  for (const post of posts) {
    const rule = pickRule(post, mapping);
    if (!rule) continue;

    const reviewedOn = rule.reviewedOn ?? mapping.reviewedOn;
    if (rule.reviewedBy && !reviewedOn) {
      console.error(
        `  ${post.slug}: reviewedBy set with no reviewedOn — skipped (a review claim needs a date)`
      );
      continue;
    }

    const match = post.raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) continue;

    let block = match[1];
    if (rule.author) block = setField(block, 'authorSlug', rule.author);
    if (rule.reviewedBy) {
      block = setField(block, 'reviewedBy', rule.reviewedBy);
      block = setField(block, 'reviewedOn', reviewedOn);
    }
    if (block === match[1]) continue;

    const updated = post.raw.replace(match[0], `---\n${block.trimEnd()}\n---`);
    if (!dryRun) fs.writeFileSync(post.filePath, updated);
    changed++;
    console.log(
      `  ${dryRun ? '[dry]' : '[ok] '} ${post.slug}` +
        (rule.author ? ` author=${rule.author}` : '') +
        (rule.reviewedBy ? ` reviewedBy=${rule.reviewedBy}` : '')
    );
  }

  console.log(
    `\n${dryRun ? 'Would update' : 'Updated'} ${changed} of ${posts.length} posts.\n`
  );
}

// ------------------------------------------------------------------ main ---

const [cmd, arg] = process.argv.slice(2);

if (cmd === 'report' || !cmd) {
  report();
} else if (cmd === 'apply') {
  if (!arg) {
    console.error('usage: node scripts/attribution.mjs apply <mapping.json> [--dry-run]');
    process.exit(1);
  }
  apply(arg, process.argv.includes('--dry-run'));
} else {
  console.error(`unknown command: ${cmd}`);
  process.exit(1);
}
