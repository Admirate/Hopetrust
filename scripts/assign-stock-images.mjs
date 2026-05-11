#!/usr/bin/env node
/**
 * assign-stock-images.mjs
 * 
 * Assigns curated Unsplash stock images to blog posts that are missing
 * their featured images. Categories are matched by keywords in the
 * blog title and image filename.
 *
 * Usage:  node scripts/assign-stock-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'content', 'blogs');
const FAILURES_FILE = path.join(ROOT, 'scripts', 'image-migration-failures.json');

// Curated Unsplash images by category (all free for commercial use)
// Using stable Unsplash CDN URLs with optimized dimensions
const STOCK_IMAGES = {
  addiction: [
    'https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=800&h=500&fit=crop&auto=format',
  ],
  alcohol: [
    'https://images.unsplash.com/photo-1569937756447-1d44f657dc69?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1516900448138-898720b936c7?w=800&h=500&fit=crop&auto=format',
  ],
  relationships: [
    'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&h=500&fit=crop&auto=format',
  ],
  family: [
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=800&h=500&fit=crop&auto=format',
  ],
  mental_health: [
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=500&fit=crop&auto=format',
  ],
  depression: [
    'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800&h=500&fit=crop&auto=format',
  ],
  anxiety: [
    'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=500&fit=crop&auto=format',
  ],
  therapy: [
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=500&fit=crop&auto=format',
  ],
  self_improvement: [
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=500&fit=crop&auto=format',
  ],
  stress: [
    'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&h=500&fit=crop&auto=format',
  ],
  social_media: [
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&h=500&fit=crop&auto=format',
  ],
  spirituality: [
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=500&fit=crop&auto=format',
  ],
  general: [
    'https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=800&h=500&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=500&fit=crop&auto=format',
  ],
};

// Keyword → category mapping
const KEYWORD_CATEGORIES = [
  { keywords: ['alcohol', 'drinking', 'alcoholic', 'alcoholism', 'bottle', 'sober', 'fun without alcohol'], category: 'alcohol' },
  { keywords: ['addict', 'recovery', 'rehab', 'relapse', 'substance', 'drug', 'gambling', 'denial', 'withdrawal', 'trigger'], category: 'addiction' },
  { keywords: ['relationship', 'couple', 'partner', 'love', 'breakup', 'divorce', 'marriage', 'dating', 'butterflies', 'heart stirs'], category: 'relationships' },
  { keywords: ['family', 'children', 'parent', 'father', 'mother', 'child', 'generation', 'tough love', 'adult children'], category: 'family' },
  { keywords: ['depress', 'treating depression', 'feeling blue', 'sadness'], category: 'depression' },
  { keywords: ['anxiety', 'anxious', 'calm', 'panic', 'worry', 'managing anxiety'], category: 'anxiety' },
  { keywords: ['stress', 'burnout', 'overwork', 'work-life'], category: 'stress' },
  { keywords: ['therapist', 'therapy', 'counsell', 'psychologist', 'psychiatrist', 'psychotherapist', 'digital psychologist'], category: 'therapy' },
  { keywords: ['social media', 'internet', 'online', 'digital', 'post on social'], category: 'social_media' },
  { keywords: ['spiritual', 'meditation', 'mindful', 'zen', 'buddhism', 'shanti', 'sacred'], category: 'spirituality' },
  { keywords: ['self-esteem', 'confidence', 'self-worth', 'growth', 'happy', 'happiness', 'self-improvement', 'qualities', 'impression'], category: 'self_improvement' },
  { keywords: ['mental health', 'mental-health', 'schizophrenia', 'adhd', 'mental state', 'ego', 'brain'], category: 'mental_health' },
];

/**
 * Determine the category for a blog post based on its title and image filename.
 */
function categorize(title, imageFilename) {
  const searchText = `${title} ${imageFilename}`.toLowerCase();
  
  for (const { keywords, category } of KEYWORD_CATEGORIES) {
    for (const keyword of keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  return 'general';
}

/**
 * Pick an image from a category, rotating through the array to avoid
 * giving adjacent blogs the same image.
 */
const categoryCounters = {};
function pickImage(category) {
  const images = STOCK_IMAGES[category] || STOCK_IMAGES.general;
  const idx = (categoryCounters[category] || 0) % images.length;
  categoryCounters[category] = idx + 1;
  return images[idx];
}

async function main() {
  // Load failure report
  if (!fs.existsSync(FAILURES_FILE)) {
    console.error('❌ No failure report found. Run migrate-blog-images.mjs first.');
    process.exit(1);
  }

  const failures = JSON.parse(fs.readFileSync(FAILURES_FILE, 'utf-8'));
  const failedUrls = new Set(failures.map((f) => f.url));

  console.log(`📋 Found ${failedUrls.size} missing images to replace\n`);

  // Read all MDX files and find those with failed image URLs
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
  let updatedCount = 0;
  const assignments = [];

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);

    if (!data.featuredImage || !failedUrls.has(data.featuredImage)) continue;

    // Categorize this blog
    const imageFilename = data.featuredImage.split('/').pop() || '';
    const category = categorize(data.title || '', imageFilename);
    const newImageUrl = pickImage(category);

    // Update the MDX file
    data.featuredImage = newImageUrl;
    const updatedRaw = matter.stringify(content, data);
    fs.writeFileSync(filePath, updatedRaw);
    updatedCount++;

    assignments.push({
      file,
      title: data.title || file,
      category,
      image: newImageUrl,
    });

    console.log(`  ✅ ${file}`);
    console.log(`     Category: ${category} → assigned stock image\n`);
  }

  console.log(`\n🎉 Done! Updated ${updatedCount} MDX files with stock images.`);

  // Save assignment log
  const logPath = path.join(ROOT, 'scripts', 'stock-image-assignments.json');
  fs.writeFileSync(logPath, JSON.stringify(assignments, null, 2));
  console.log(`📄 Assignment log saved to: scripts/stock-image-assignments.json`);
}

main().catch(console.error);
