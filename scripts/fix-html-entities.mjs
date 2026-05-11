#!/usr/bin/env node
/**
 * fix-html-entities.mjs
 * 
 * Decodes HTML entities in MDX blog frontmatter and content.
 * Fixes things like &#8217; → ', &#8220; → ", &#038; → &, etc.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'content', 'blogs');

// Named HTML entities → Unicode
const NAMED_ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&rsquo;': '\u2019',   // '
  '&lsquo;': '\u2018',   // '
  '&rdquo;': '\u201D',   // "
  '&ldquo;': '\u201C',   // "
  '&ndash;': '\u2013',   // –
  '&mdash;': '\u2014',   // —
  '&hellip;': '\u2026',  // …
  '&nbsp;': ' ',
  '&trade;': '\u2122',   // ™
  '&copy;': '\u00A9',    // ©
  '&reg;': '\u00AE',     // ®
};

/**
 * Decode all HTML entities in a string.
 */
function decodeEntities(str) {
  if (!str || typeof str !== 'string') return str;
  
  // Decode numeric entities: &#8217; or &#x2019;
  let result = str.replace(/&#(\d+);/g, (_, code) => {
    return String.fromCharCode(parseInt(code, 10));
  });
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => {
    return String.fromCharCode(parseInt(code, 16));
  });
  
  // Decode named entities
  for (const [entity, char] of Object.entries(NAMED_ENTITIES)) {
    result = result.replaceAll(entity, char);
  }
  
  return result;
}

/**
 * Check if a string contains any HTML entities.
 */
function hasEntities(str) {
  if (!str || typeof str !== 'string') return false;
  return /&#\d+;|&#x[0-9a-fA-F]+;|&[a-zA-Z]+;/.test(str);
}

async function main() {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
  let fixedFiles = 0;

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    
    // Check if file has any entities at all (quick check)
    if (!hasEntities(raw)) continue;

    const { data, content } = matter(raw);
    let changed = false;

    // Fix frontmatter string fields
    for (const key of Object.keys(data)) {
      if (typeof data[key] === 'string' && hasEntities(data[key])) {
        const decoded = decodeEntities(data[key]);
        if (decoded !== data[key]) {
          if (!changed) console.log(`\n📝 ${file}`);
          console.log(`   ${key}: "${data[key].substring(0, 60)}..." → "${decoded.substring(0, 60)}..."`);
          data[key] = decoded;
          changed = true;
        }
      }
      // Handle arrays of strings (e.g., tags)
      if (Array.isArray(data[key])) {
        data[key] = data[key].map((item) => {
          if (typeof item === 'string' && hasEntities(item)) {
            const decoded = decodeEntities(item);
            if (decoded !== item) {
              if (!changed) console.log(`\n📝 ${file}`);
              console.log(`   ${key}[]: "${item}" → "${decoded}"`);
              changed = true;
              return decoded;
            }
          }
          return item;
        });
      }
    }

    // Fix content body
    let newContent = content;
    if (hasEntities(content)) {
      newContent = decodeEntities(content);
      if (newContent !== content) {
        if (!changed) console.log(`\n📝 ${file}`);
        console.log(`   [content body] decoded HTML entities`);
        changed = true;
      }
    }

    if (changed) {
      const updatedRaw = matter.stringify(newContent, data);
      fs.writeFileSync(filePath, updatedRaw);
      fixedFiles++;
    }
  }

  console.log(`\n\n🎉 Fixed HTML entities in ${fixedFiles} files.`);
}

main().catch(console.error);
