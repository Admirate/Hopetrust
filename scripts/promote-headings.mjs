#!/usr/bin/env node
/**
 * Promote latent headings in blog posts to real H2s.
 *
 *   node scripts/promote-headings.mjs report
 *   node scripts/promote-headings.mjs apply --dry-run
 *   node scripts/promote-headings.mjs apply
 *
 * The WordPress import flattened the archive's structure: headings survived as
 * bold text rather than as headings. 380 of 395 posts have no H2 at all, which
 * costs featured snippets and leaves nothing for an answer engine to quote as a
 * passage — but the headings are almost all still there, just wearing the wrong
 * markup.
 *
 * This promotes what already exists. It writes no new prose, so the wording of
 * every heading remains the author's. Two shapes are recognised:
 *
 *   **What is anxiety?**                    ->  ## What is anxiety?
 *   **1\. NEGLECTING RESPONSIBILITIES** - x  ->  ## 1. Neglecting Responsibilities
 *                                                x
 *
 * Anything it is not confident about is left alone: see SKIP below.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blogs');

/** A line that is nothing but bold text. */
const STANDALONE = /^\*\*\s*([^*]{3,120}?)\s*\*\*$/;
/** A numbered item whose heading and body share one line. */
const NUMBERED = /^\*\*\s*(\d+)\\?\.\s*([^*]{2,140}?)\s*\*\*\s*[–—-]\s*(.+)$/;

/**
 * Some headings were bold *and* italic. Once the bold becomes a heading the
 * italic markers are left stranded inside the text, so they come off first —
 * before the skip checks, which would otherwise see a trailing "_" instead of
 * the punctuation those checks are meant to catch.
 */
function stripEmphasis(text) {
  let out = text.trim();
  for (const mark of ['__', '**', '_', '*']) {
    while (
      out.length > mark.length * 2 &&
      out.startsWith(mark) &&
      out.endsWith(mark)
    ) {
      out = out.slice(mark.length, -mark.length).trim();
    }
  }
  return out;
}
/**
 * Reasons to leave a bold line alone. A heading is a promise that a section
 * follows; promoting a line that is really emphasis, a caption or a sign-off
 * would make the document lie about its own shape.
 */
function shouldSkip(text) {
  return (
    text.length < 3 ||
    // Ends in sentence punctuation other than a question mark: prose, not a heading.
    /[.!,;:]$/.test(text) ||
    // Contains a link, image or leftover markup.
    /\[|\]|\(http|!\[|<[a-z]/i.test(text) ||
    // Mostly punctuation or digits.
    !/[a-z]/i.test(text) ||
    // Long enough to be a sentence rather than a label.
    text.split(/\s+/).length > 18
  );
}

/**
 * ALL-CAPS headings read as shouting once they are real headings rather than
 * inline bold, so they are title-cased. Mixed-case headings are left exactly as
 * the author wrote them.
 */
function tidyCase(text) {
  const letters = text.replace(/[^a-z]/gi, '');
  if (!letters || letters !== letters.toUpperCase()) return text;

  const SMALL = new Set(['a','an','and','as','at','but','by','for','in','of','on','or','the','to','vs','with']);
  return text
    .toLowerCase()
    .split(/(\s+)/)
    .map((word, i) => {
      if (/^\s+$/.test(word)) return word;
      if (i > 0 && SMALL.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

/** Rewrite one post body. Returns { body, promoted }. */
export function promote(content) {
  const lines = content.split(/\r?\n/);
  const out = [];
  let promoted = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    const numbered = trimmed.match(NUMBERED);
    if (numbered) {
      const [, num, rawTitle, body] = numbered;
      const title = stripEmphasis(rawTitle);
      if (!shouldSkip(title)) {
        // The body used to continue the heading's sentence after a dash, so it
        // usually starts lower-case. Standing alone as its own paragraph, it
        // needs a capital.
        const text = body.trim();
        out.push(
          `## ${num}. ${tidyCase(title)}`,
          '',
          text.charAt(0).toUpperCase() + text.slice(1)
        );
        promoted++;
        continue;
      }
    }

    const standalone = trimmed.match(STANDALONE);
    if (standalone) {
      const title = stripEmphasis(standalone[1]);
      if (!shouldSkip(title)) {
        out.push(`## ${tidyCase(title)}`);
        promoted++;
        continue;
      }
    }

    out.push(line);
  }

  return { body: out.join('\n'), promoted };
}

// ------------------------------------------------------------------ main ---

// Guarded so other tooling can import `promote` without running the CLI.
const isMain =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const cmd = process.argv[2] || 'report';
  const dryRun = process.argv.includes('--dry-run');
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

  let touched = 0;
  let headings = 0;
  const perPost = [];

  for (const file of files) {
    const full = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(full, 'utf8');
    const { content } = matter(raw);

    // Never touch a post that already has real headings — it was written or
    // edited properly and is not the import's problem.
    if (/^##\s/m.test(content)) continue;

    const { body, promoted } = promote(content);
    if (!promoted) continue;

    touched++;
    headings += promoted;
    perPost.push([promoted, file.replace(/\.mdx$/, '')]);

    if (cmd === 'apply' && !dryRun) {
      // Replace only the body, leaving the frontmatter block byte-identical.
      const match = raw.match(/^(---\r?\n[\s\S]*?\r?\n---\r?\n)([\s\S]*)$/);
      if (!match) continue;
      fs.writeFileSync(full, match[1] + body);
    }
}

  perPost.sort((a, b) => b[0] - a[0]);

  console.log(`\n${cmd === 'apply' && !dryRun ? 'Promoted' : 'Would promote'} ${headings} headings across ${touched} posts (of ${files.length}).\n`);
  console.log('Most affected posts:');
  perPost.slice(0, 15).forEach(([n, slug]) => console.log(`  ${String(n).padStart(3)}  ${slug}`));
  console.log('');

}
