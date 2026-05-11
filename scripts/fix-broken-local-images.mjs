#!/usr/bin/env node
/**
 * fix-broken-local-images.mjs
 * 
 * Finds MDX files where featuredImage points to /blog-images/X but the
 * file doesn't exist, and assigns Unsplash stock images based on topic.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'content', 'blogs');
const PUBLIC_DIR = path.join(ROOT, 'public');

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

const KEYWORD_CATEGORIES = [
  { keywords: ['alcohol', 'drinking', 'alcoholic', 'alcoholism', 'bottle', 'sober', 'wine', 'beer', 'hangover'], category: 'alcohol' },
  { keywords: ['addict', 'recovery', 'rehab', 'relapse', 'substance', 'drug', 'gambling', 'denial', 'withdrawal', 'trigger', 'sobriety', '12-step', 'twelve step'], category: 'addiction' },
  { keywords: ['relationship', 'couple', 'partner', 'love', 'breakup', 'divorce', 'marriage', 'dating', 'romance', 'intimacy', 'commitment'], category: 'relationships' },
  { keywords: ['family', 'children', 'parent', 'father', 'mother', 'child', 'generation', 'tough love', 'sibling', 'teen', 'kid'], category: 'family' },
  { keywords: ['depress', 'feeling blue', 'sadness', 'hopeless'], category: 'depression' },
  { keywords: ['anxiety', 'anxious', 'calm', 'panic', 'worry', 'fear', 'phobia'], category: 'anxiety' },
  { keywords: ['stress', 'burnout', 'overwork', 'work-life', 'exhaustion', 'pressure'], category: 'stress' },
  { keywords: ['therapist', 'therapy', 'counsell', 'psycholog', 'psychiatr', 'psychotherap'], category: 'therapy' },
  { keywords: ['social media', 'internet', 'online', 'digital', 'screen', 'phone', 'technology'], category: 'social_media' },
  { keywords: ['spiritual', 'meditation', 'mindful', 'zen', 'buddhism', 'yoga', 'prayer'], category: 'spirituality' },
  { keywords: ['self-esteem', 'confidence', 'self-worth', 'growth', 'happy', 'happiness', 'purpose', 'myth', 'positive', 'gratitude', 'habit', 'success', 'career', 'impression', 'question'], category: 'self_improvement' },
  { keywords: ['mental health', 'mental-health', 'schizophrenia', 'adhd', 'bipolar', 'ocd', 'ptsd', 'disorder', 'brain', 'cognitive', 'personality', 'emotion'], category: 'mental_health' },
];

function categorize(title, slug) {
  const searchText = `${title} ${slug}`.toLowerCase();
  for (const { keywords, category } of KEYWORD_CATEGORIES) {
    for (const keyword of keywords) {
      if (searchText.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  return 'general';
}

const categoryCounters = {};
function pickImage(category) {
  const images = STOCK_IMAGES[category] || STOCK_IMAGES.general;
  const idx = (categoryCounters[category] || 0) % images.length;
  categoryCounters[category] = idx + 1;
  return images[idx];
}

async function main() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
  let fixed = 0;

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);

    const img = data.featuredImage || '';
    
    // Check for broken local paths
    if (img.startsWith('/blog-images/')) {
      const localPath = path.join(PUBLIC_DIR, img);
      if (!fs.existsSync(localPath)) {
        const category = categorize(data.title || '', data.slug || file);
        const newImg = pickImage(category);
        data.featuredImage = newImg;
        fs.writeFileSync(filePath, matter.stringify(content, data));
        fixed++;
        console.log(`  ✅ ${file} → ${category}`);
      }
    }
  }

  console.log(`\n🎉 Fixed ${fixed} MDX files with broken local image paths.`);
}

main().catch(console.error);
