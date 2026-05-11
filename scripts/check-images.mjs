import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const d = path.join(__dirname, '..', 'content', 'blogs');
const files = fs.readdirSync(d).filter(x => x.endsWith('.mdx'));

let local = 0, unsplash = 0, old = 0, empty = 0;

for (const f of files) {
  const { data } = matter(fs.readFileSync(path.join(d, f), 'utf-8'));
  const img = data.featuredImage || '';
  if (!img) empty++;
  else if (img.startsWith('/blog-images/')) local++;
  else if (img.includes('unsplash.com')) unsplash++;
  else if (img.includes('hopetrustindia.com')) old++;
  else console.log('OTHER:', img, f);
}

console.log(`Total MDX files: ${files.length}`);
console.log(`Local images (from WP backup): ${local}`);
console.log(`Unsplash stock images: ${unsplash}`);
console.log(`Still broken (old WP URLs): ${old}`);
console.log(`No image at all: ${empty}`);
console.log(`---`);
console.log(`Working images: ${local + unsplash} / ${files.length}`);
