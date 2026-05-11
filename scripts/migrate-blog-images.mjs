#!/usr/bin/env node
/**
 * migrate-blog-images.mjs
 * 
 * Copies blog featured images from a local WordPress backup and updates
 * MDX frontmatter to use local paths served from /blog-images/.
 *
 * Usage:  node scripts/migrate-blog-images.mjs
 * 
 * What it does:
 *  1. Scans all .mdx files in content/blogs/
 *  2. Extracts unique featuredImage URLs (hopetrustindia.com/wp-content/uploads/...)
 *  3. Finds matching files in the local WordPress backup
 *  4. Copies to public/blog-images/ with a clean filename
 *  5. Rewrites the featuredImage in each MDX file to /blog-images/<filename>
 *  6. Generates a report of successes and failures
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'content', 'blogs');
const OUTPUT_DIR = path.join(ROOT, 'public', 'blog-images');

// Local WordPress backup path
const WP_UPLOADS_DIR = 'C:\\Admirate work\\hopetrust_wpcontent\\wp-content\\uploads';

/**
 * Extract the relative path within wp-content/uploads/ from a WordPress URL.
 * e.g. https://hopetrustindia.com/wp-content/uploads/2022/09/father-daughter.jpg → 2022/09/father-daughter.jpg
 */
function extractRelativePath(url) {
  try {
    const match = url.match(/wp-content\/uploads\/(.+)$/);
    if (match) {
      return decodeURIComponent(match[1]);
    }
  } catch {}
  return null;
}

/**
 * Extract just the filename from a URL.
 */
function extractFilename(url) {
  try {
    const parsed = new URL(url);
    const basename = path.basename(parsed.pathname);
    return decodeURIComponent(basename);
  } catch {
    const parts = url.split('/');
    return decodeURIComponent(parts[parts.length - 1]);
  }
}

/**
 * Make filename safe for filesystem.
 */
function sanitizeFilename(name) {
  return name
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  console.log('🔍 Scanning MDX files for blog images...\n');

  // Verify WordPress backup exists
  if (!fs.existsSync(WP_UPLOADS_DIR)) {
    console.error(`❌ WordPress backup not found at: ${WP_UPLOADS_DIR}`);
    process.exit(1);
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Read all MDX files
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
  console.log(`Found ${files.length} MDX files\n`);

  // Build a map of original URL → local filename and source path
  const urlToFilename = new Map();   // originalUrl → localFilename
  const urlToSourcePath = new Map(); // originalUrl → path in WP backup
  const mdxData = new Map();         // mdxFilePath → { data, content }

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);

    mdxData.set(filePath, { data, content });

    const imgUrl = data.featuredImage;
    if (!imgUrl || !imgUrl.includes('hopetrustindia.com/wp-content/uploads/')) {
      continue;
    }

    if (!urlToFilename.has(imgUrl)) {
      // Get the relative path from URL (e.g., 2022/09/father-daughter.jpg)
      const relativePath = extractRelativePath(imgUrl);
      if (!relativePath) continue;

      // Build source path in WordPress backup
      const sourcePath = path.join(WP_UPLOADS_DIR, ...relativePath.split('/'));
      urlToSourcePath.set(imgUrl, sourcePath);

      // Determine output filename
      let filename = sanitizeFilename(extractFilename(imgUrl));
      
      // Handle duplicate filenames by prepending year-month
      if ([...urlToFilename.values()].includes(filename)) {
        const parts = relativePath.split('/');
        const prefix = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : 'dup';
        filename = `${prefix}-${filename}`;
      }
      
      urlToFilename.set(imgUrl, filename);
    }
  }

  const totalImages = urlToFilename.size;
  console.log(`Found ${totalImages} unique WordPress image URLs to migrate\n`);

  if (totalImages === 0) {
    console.log('✅ No images to migrate — all done!');
    return;
  }

  // Copy images from WordPress backup
  let copied = 0;
  let skipped = 0;
  const failures = [];

  for (const [url, filename] of urlToFilename) {
    const destPath = path.join(OUTPUT_DIR, filename);
    
    // Skip if already copied
    if (fs.existsSync(destPath)) {
      skipped++;
      continue;
    }

    const sourcePath = urlToSourcePath.get(url);
    
    if (!sourcePath || !fs.existsSync(sourcePath)) {
      failures.push({ url, sourcePath, error: 'File not found in WordPress backup' });
      console.log(`  ❌ ${filename} — not found at ${sourcePath}`);
      continue;
    }

    try {
      fs.copyFileSync(sourcePath, destPath);
      const size = fs.statSync(destPath).size;
      const sizeKB = (size / 1024).toFixed(1);
      copied++;
      console.log(`  ✅ [${copied}] ${filename} (${sizeKB} KB)`);
    } catch (err) {
      failures.push({ url, sourcePath, error: err.message });
      console.log(`  ❌ ${filename} — ${err.message}`);
    }
  }

  console.log(`\n📦 Copy complete: ${copied} copied, ${skipped} already existed, ${failures.length} failed\n`);

  // Update MDX files
  console.log('📝 Updating MDX frontmatter...\n');
  let updatedCount = 0;

  for (const [filePath, { data, content }] of mdxData) {
    const imgUrl = data.featuredImage;
    if (!imgUrl || !urlToFilename.has(imgUrl)) continue;

    const filename = urlToFilename.get(imgUrl);
    const destPath = path.join(OUTPUT_DIR, filename);

    // Only update if we have the file
    if (!fs.existsSync(destPath)) continue;

    const newImagePath = `/blog-images/${filename}`;
    if (data.featuredImage === newImagePath) continue; // Already updated

    // Rewrite frontmatter
    data.featuredImage = newImagePath;
    const updatedRaw = matter.stringify(content, data);
    fs.writeFileSync(filePath, updatedRaw);
    updatedCount++;
  }

  console.log(`✅ Updated ${updatedCount} MDX files\n`);

  // Report failures
  if (failures.length > 0) {
    console.log('⚠️  Missing files (MDX will keep original URL → shows fallback):');
    for (const f of failures) {
      console.log(`   ${f.url}`);
      console.log(`   → ${f.error}\n`);
    }
    
    // Save failure report
    const reportPath = path.join(ROOT, 'scripts', 'image-migration-failures.json');
    fs.writeFileSync(
      reportPath,
      JSON.stringify(failures, null, 2)
    );
    console.log(`📄 Failure report saved to: scripts/image-migration-failures.json`);
  }

  console.log('\n🎉 Migration complete!');
  console.log(`   Images stored in: public/blog-images/`);
  console.log(`   MDX files updated: ${updatedCount}`);
  console.log(`   Total available: ${copied + skipped}`);
  if (failures.length > 0) {
    console.log(`   Missing: ${failures.length} (will show fallback emoji)`);
  }
}

main().catch(console.error);
