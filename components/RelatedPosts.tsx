import Link from 'next/link';
import { Clock } from 'lucide-react';
import type { BlogPostMeta } from '@/lib/blog';

/**
 * "Read next" links at the foot of an article.
 *
 * Before this, a reader who finished a post had one way onward — the
 * previous/next pair, which is ordered by date and so almost never related to
 * what they were just reading. Topic-matched links keep someone inside the
 * subject they came for, and give the archive an internal link graph that
 * follows meaning rather than chronology.
 */
export default function RelatedPosts({ posts }: { posts: BlogPostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-10 sm:mt-12" aria-labelledby="read-next">
      <h2
        id="read-next"
        className="text-lg font-semibold text-[#00373E] sm:text-xl"
      >
        Read next
      </h2>

      <ul className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blogs/${post.slug}/`}
              className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#ED7428] sm:p-5"
            >
              <h3 className="text-sm font-semibold leading-snug text-[#00373E] transition-colors group-hover:text-[#ED7428] sm:text-base">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-600 sm:text-sm">
                  {post.excerpt}
                </p>
              )}
              <span className="mt-auto flex items-center gap-1.5 pt-3 text-[11px] text-gray-400 sm:text-xs">
                <Clock className="h-3 w-3" />
                {new Date(post.date).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
