import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  /** Last substantive edit. Falls back to `date` when frontmatter omits it. */
  modified: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  featuredImage: string;
  author: string;
  wpLink: string;
  content: string;
  readingTime: string;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  modified: string;
  excerpt: string;
  categories: string[];
  tags: string[];
  featuredImage: string;
  author: string;
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blogs');

function parseMdxFile(filePath: string): BlogPost | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const stats = readingTime(content);

    return {
      slug: data.slug || path.basename(filePath, '.mdx'),
      title: data.title || 'Untitled',
      date: data.date || '',
      modified: data.modified || data.date || '',
      excerpt: data.excerpt || '',
      categories: data.categories || [],
      tags: data.tags || [],
      featuredImage: data.featuredImage || '',
      author: data.author || 'Hope Trust',
      wpLink: data.wpLink || '',
      content,
      readingTime: stats.text,
    };
  } catch {
    return null;
  }
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));
  const posts = files
    .map((file) => parseMdxFile(path.join(BLOG_DIR, file)))
    .filter((p): p is BlogPost => p !== null);

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getAllPostsMeta(): BlogPostMeta[] {
  return getAllPosts().map(({ content, readingTime, wpLink, ...meta }) => meta);
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return parseMdxFile(filePath);
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const cats = new Set<string>();
  for (const post of posts) {
    for (const cat of post.categories) {
      cats.add(cat);
    }
  }
  return Array.from(cats).sort();
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

export function getAdjacentPosts(
  slug: string
): { prev: BlogPostMeta | null; next: BlogPostMeta | null } {
  const posts = getAllPostsMeta();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };

  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  };
}
