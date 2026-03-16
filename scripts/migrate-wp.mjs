#!/usr/bin/env node

/**
 * WordPress → MDX Migration Script
 *
 * Fetches all blog posts from the WordPress REST API at hopetrustindia.com,
 * converts HTML content to Markdown, and saves each post as an .mdx file
 * with frontmatter under content/blogs/.
 *
 * Usage:  node scripts/migrate-wp.mjs
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import TurndownService from 'turndown';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'content', 'blogs');

const WP_BASE = 'https://hopetrustindia.com/wp-json/wp/v2';
const PER_PAGE = 100;

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

turndown.addRule('removeEmptyLinks', {
  filter: (node) =>
    node.nodeName === 'A' && !node.textContent.trim() && !node.querySelector('img'),
  replacement: () => '',
});

turndown.addRule('figures', {
  filter: 'figure',
  replacement: (_content, node) => {
    const img = node.querySelector('img');
    if (!img) return _content;
    const src = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt') || '';
    const caption = node.querySelector('figcaption');
    const captionText = caption ? caption.textContent.trim() : '';
    return captionText
      ? `\n\n![${alt}](${src})\n*${captionText}*\n\n`
      : `\n\n![${alt}](${src})\n\n`;
  },
});

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeYaml(str) {
  if (!str) return '""';
  if (str.includes('"') || str.includes(':') || str.includes('#') || str.includes('\n')) {
    return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return `"${str}"`;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return {
    data: await res.json(),
    totalPages: parseInt(res.headers.get('x-wp-totalpages') || '1', 10),
    total: parseInt(res.headers.get('x-wp-total') || '0', 10),
  };
}

async function fetchAllCategories() {
  const { data } = await fetchJson(`${WP_BASE}/categories?per_page=100`);
  const map = {};
  for (const cat of data) {
    map[cat.id] = cat.name;
  }
  return map;
}

async function fetchAllTags() {
  let page = 1;
  const map = {};
  while (true) {
    const { data, totalPages } = await fetchJson(
      `${WP_BASE}/tags?per_page=100&page=${page}`
    );
    for (const tag of data) {
      map[tag.id] = tag.name;
    }
    if (page >= totalPages) break;
    page++;
  }
  return map;
}

async function fetchAllPosts() {
  const posts = [];
  let page = 1;

  const first = await fetchJson(
    `${WP_BASE}/posts?per_page=${PER_PAGE}&page=1&_embed`
  );
  posts.push(...first.data);
  const totalPages = first.totalPages;
  console.log(`Total posts: ${first.total}, pages: ${totalPages}`);

  for (page = 2; page <= totalPages; page++) {
    console.log(`  Fetching page ${page}/${totalPages}...`);
    const { data } = await fetchJson(
      `${WP_BASE}/posts?per_page=${PER_PAGE}&page=${page}&_embed`
    );
    posts.push(...data);
    // Small delay to be respectful to the server
    await new Promise((r) => setTimeout(r, 300));
  }

  return posts;
}

function getPostFeaturedImage(post) {
  if (post.jetpack_featured_media_url) {
    return post.jetpack_featured_media_url;
  }
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  return media?.source_url || '';
}

function getPostCategories(post, categoryMap) {
  if (!post.categories?.length) return [];
  return post.categories
    .map((id) => categoryMap[id])
    .filter(Boolean)
    .filter((name) => name !== 'Uncategorized');
}

function getPostTags(post, tagMap) {
  if (!post.tags?.length) return [];
  return post.tags.map((id) => tagMap[id]).filter(Boolean);
}

function getPostAuthor(post) {
  const author = post._embedded?.author?.[0];
  return author?.name || 'Hope Trust';
}

function getYoastDescription(post) {
  const yoast = post.yoast_head_json;
  if (yoast?.og_description) return yoast.og_description;
  if (yoast?.description) return yoast.description;
  return '';
}

function buildFrontmatter(post, categoryMap, tagMap) {
  const title = stripHtml(post.title?.rendered || 'Untitled');
  const excerpt =
    getYoastDescription(post) || stripHtml(post.excerpt?.rendered || '');
  const categories = getPostCategories(post, categoryMap);
  const tags = getPostTags(post, tagMap);
  const featuredImage = getPostFeaturedImage(post);
  const author = getPostAuthor(post);

  let fm = '---\n';
  fm += `title: ${escapeYaml(title)}\n`;
  fm += `slug: "${post.slug}"\n`;
  fm += `date: "${post.date}"\n`;
  fm += `excerpt: ${escapeYaml(excerpt.substring(0, 300))}\n`;
  if (categories.length) {
    fm += `categories:\n`;
    for (const cat of categories) fm += `  - ${escapeYaml(cat)}\n`;
  }
  if (tags.length) {
    fm += `tags:\n`;
    for (const tag of tags) fm += `  - ${escapeYaml(tag)}\n`;
  }
  fm += `featuredImage: "${featuredImage}"\n`;
  fm += `author: ${escapeYaml(author)}\n`;
  fm += `wpLink: "${post.link}"\n`;
  fm += '---\n';

  return fm;
}

function convertContent(html) {
  let md = turndown.turndown(html || '');
  // Clean up excessive whitespace
  md = md.replace(/\n{4,}/g, '\n\n\n');
  // Remove leftover WP shortcodes like [caption]...[/caption]
  md = md.replace(/\[\/?\w+[^\]]*\]/g, '');
  return md.trim();
}

async function main() {
  console.log('=== WordPress → MDX Migration ===\n');

  console.log('Fetching categories...');
  const categoryMap = await fetchAllCategories();
  console.log(`  Found ${Object.keys(categoryMap).length} categories`);

  console.log('Fetching tags...');
  const tagMap = await fetchAllTags();
  console.log(`  Found ${Object.keys(tagMap).length} tags`);

  console.log('Fetching all posts...');
  const posts = await fetchAllPosts();
  console.log(`  Fetched ${posts.length} posts\n`);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  let success = 0;
  let skipped = 0;
  const slugsSeen = new Set();

  for (const post of posts) {
    try {
      let slug = post.slug;

      if (slugsSeen.has(slug)) {
        slug = `${slug}-${post.id}`;
      }
      slugsSeen.add(slug);

      const frontmatter = buildFrontmatter(post, categoryMap, tagMap);
      const content = convertContent(post.content?.rendered || '');

      if (!content) {
        console.log(`  SKIP (empty content): ${slug}`);
        skipped++;
        continue;
      }

      const mdx = `${frontmatter}\n${content}\n`;
      const filePath = path.join(OUTPUT_DIR, `${slug}.mdx`);
      await fs.writeFile(filePath, mdx, 'utf-8');
      success++;

      if (success % 50 === 0) {
        console.log(`  Wrote ${success} posts...`);
      }
    } catch (err) {
      console.error(`  ERROR on post ${post.slug}: ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`  Written: ${success}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Output:  ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
