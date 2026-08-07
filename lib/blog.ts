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

/** Posts shown per archive page. Shared by the routes and the UI. */
export const POSTS_PER_PAGE = 12;

/**
 * Catch-all category applied to almost every post. It carries no topical
 * signal, and an archive for it would be a near-duplicate of /blogs/, so its
 * pill links to /blogs/ and it gets no page of its own.
 */
export const GENERIC_CATEGORY = 'Blog';

/**
 * Below this many posts an archive is thin content. Those pages are still
 * generated and linked (readers use the filter) but carry `noindex, follow`.
 */
export const MIN_INDEXABLE_CATEGORY_POSTS = 3;

export type CategoryInfo = {
  name: string;
  slug: string;
  count: number;
  /** Where this category's pill points. */
  href: string;
  /** False for the generic catch-all — it has no archive page. */
  hasArchive: boolean;
  /** False for thin archives, which are generated but not indexed. */
  indexable: boolean;
};

/** URL slug for a category name, e.g. "Addiction Recovery" -> "addiction-recovery". */
export function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Categories with post counts, sorted by name. Slug collisions get a suffix. */
export function getCategoriesWithCounts(): CategoryInfo[] {
  const posts = getAllPostsMeta();
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const cat of post.categories) {
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }
  }

  const seen = new Map<string, number>();
  return Array.from(counts.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([name, count]) => {
      const base = categorySlug(name) || 'category';
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      const slug = n === 0 ? base : `${base}-${n + 1}`;
      const hasArchive = name !== GENERIC_CATEGORY;

      return {
        name,
        slug,
        count,
        hasArchive,
        href: hasArchive ? `/blogs/category/${slug}/` : '/blogs/',
        indexable: hasArchive && count >= MIN_INDEXABLE_CATEGORY_POSTS,
      };
    });
}

/** Categories that get their own archive page. */
export function getArchiveCategories(): CategoryInfo[] {
  return getCategoriesWithCounts().filter((c) => c.hasArchive);
}

export function getCategoryBySlug(slug: string): CategoryInfo | null {
  return getArchiveCategories().find((c) => c.slug === slug) ?? null;
}

export function getPostsByCategory(name: string): BlogPostMeta[] {
  return getAllPostsMeta().filter((p) => p.categories.includes(name));
}

/** Total archive pages for a given post count. */
export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
}

/** The slice of posts belonging to a 1-indexed archive page. */
export function paginate<T>(items: T[], page: number): T[] {
  return items.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
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
