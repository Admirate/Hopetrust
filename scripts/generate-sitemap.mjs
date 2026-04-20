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
  { path: '/',                        changefreq: 'weekly',  priority: '1.0' },
  { path: '/about/',                  changefreq: 'monthly', priority: '0.9' },
  { path: '/mental-health/',          changefreq: 'monthly', priority: '0.9' },
  { path: '/addiction/',              changefreq: 'monthly', priority: '0.9' },
  { path: '/training/',              changefreq: 'monthly', priority: '0.9' },
  { path: '/corporate-wellness/',    changefreq: 'monthly', priority: '0.8' },
  { path: '/intervention-services/', changefreq: 'monthly', priority: '0.8' },
  { path: '/blogs/',                  changefreq: 'weekly',  priority: '0.8' },
  { path: '/book-your-session/',     changefreq: 'monthly', priority: '0.7' },
  { path: '/contact/',               changefreq: 'monthly', priority: '0.7' },
  { path: '/sitemap/',               changefreq: 'monthly', priority: '0.3' },
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
    <loc>${SITE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
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
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml
`;

if (fs.existsSync(OUT_DIR)) {
  fs.writeFileSync(path.join(OUT_DIR, 'robots.txt'), robots);
  console.log('robots.txt written to out/robots.txt');
} else {
  fs.writeFileSync(path.join(ROOT, 'public', 'robots.txt'), robots);
  console.log('robots.txt written to public/robots.txt');
}
