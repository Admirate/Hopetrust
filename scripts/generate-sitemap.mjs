#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'out');
const BLOG_DIR = path.join(ROOT, 'content', 'blogs');
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hopetrustindia.com';

const staticPages = [
  '/',
  '/about/',
  '/mental-health/',
  '/addiction/',
  '/blogs/',
  '/book-your-session/',
  '/contact/',
];

function getBlogSlugs() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

function buildSitemap() {
  const blogSlugs = getBlogSlugs();
  const today = new Date().toISOString().split('T')[0];

  const urls = [
    ...staticPages.map(
      (page) => `  <url>
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`
    ),
    ...blogSlugs.map(
      (slug) => `  <url>
    <loc>${SITE_URL}/blogs/${slug}/</loc>
    <lastmod>${today}</lastmod>
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

const sitemap = buildSitemap();

if (fs.existsSync(OUT_DIR)) {
  fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), sitemap);
  console.log(`Sitemap written to out/sitemap.xml`);
} else {
  fs.writeFileSync(path.join(ROOT, 'public', 'sitemap.xml'), sitemap);
  console.log(`Sitemap written to public/sitemap.xml`);
}

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

if (fs.existsSync(OUT_DIR)) {
  fs.writeFileSync(path.join(OUT_DIR, 'robots.txt'), robots);
  console.log('robots.txt written to out/robots.txt');
} else {
  fs.writeFileSync(path.join(ROOT, 'public', 'robots.txt'), robots);
  console.log('robots.txt written to public/robots.txt');
}
