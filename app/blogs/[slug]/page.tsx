import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllSlugs, getPostBySlug, getAdjacentPosts } from '@/lib/blog';
import Header from '@/components/Header';
import ImageFallback from '@/components/ImageFallback';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | Hope Trust Blog`,
    description: post.excerpt,
    authors: [{ name: post.author }],
    keywords: [
      ...post.tags,
      ...post.categories,
      'Hope Trust',
      'mental health',
    ].join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
      siteName: 'Hope Trust',
    },
  };
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function JsonLd({ post }: { post: NonNullable<ReturnType<typeof getPostBySlug>> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'Hope Trust' },
    ...(post.featuredImage && { image: post.featuredImage }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { prev, next } = getAdjacentPosts(slug);
  const rawHtml = marked.parse(post.content) as string;
  const htmlContent = sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'figure', 'figcaption', 'iframe', 'video', 'source',
      'h1', 'h2', 'details', 'summary',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      a: ['href', 'title', 'target', 'rel'],
      iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen'],
      video: ['src', 'controls', 'width', 'height'],
      source: ['src', 'type'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });

  return (
    <>
      <JsonLd post={post} />
      <Header />
      <main className="min-h-screen bg-[#F7F6F4] pt-16 sm:pt-20">
        {/* Hero / Featured Image */}
        {post.featuredImage && (
          <div className="relative h-[200px] w-full overflow-hidden bg-[#00373E] sm:h-[320px] lg:h-[440px]">
            <ImageFallback
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00373E]/80 to-transparent" />
          </div>
        )}

          <article className="relative mx-auto w-full max-w-[820px] px-3 sm:px-6 lg:px-8">
            {/* Article header card */}
            <div
              className={`relative rounded-2xl bg-white px-4 py-6 shadow-[0_16px_48px_rgba(0,0,0,0.08)] sm:rounded-[28px] sm:px-8 sm:py-8 lg:px-10 lg:py-10 ${
                post.featuredImage ? '-mt-16 sm:-mt-24 lg:-mt-32' : 'mt-6 sm:mt-8'
              }`}
            >
              <Link
                href="/blogs"
                className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#ED7428] transition-colors hover:text-[#d4631f] sm:mb-6 sm:gap-2 sm:text-sm"
              >
                <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Back to all posts
              </Link>

              {post.categories.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5 sm:mb-4 sm:gap-2">
                  {post.categories.map((cat) => (
                    <span
                      key={cat}
                      className="rounded-full bg-[#FFF7ED] px-2.5 py-0.5 text-[10px] font-medium text-[#ED7428] sm:px-3 sm:py-1 sm:text-xs"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="mb-3 text-xl font-bold leading-tight text-[#00373E] sm:mb-4 sm:text-2xl lg:text-4xl">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-500 sm:gap-4 sm:text-sm">
                <span className="inline-flex items-center gap-1 sm:gap-1.5">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {post.author}
                </span>
                <span className="inline-flex items-center gap-1 sm:gap-1.5">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {formatDate(post.date)}
                </span>
                <span className="inline-flex items-center gap-1 sm:gap-1.5">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {post.readingTime}
                </span>
              </div>
            </div>

            {/* Article body */}
            <div className="mt-4 rounded-2xl bg-white px-4 py-6 shadow-[0_16px_48px_rgba(0,0,0,0.04)] sm:mt-8 sm:rounded-[28px] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {post.tags.length > 0 && (
                <div className="mt-8 border-t border-gray-100 pt-4 sm:mt-10 sm:pt-6">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gray-200 px-2.5 py-0.5 text-[10px] text-gray-500 sm:px-3 sm:py-1 sm:text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Previous / Next navigation */}
            <div className="mt-4 mb-12 grid gap-3 sm:mt-8 sm:mb-16 sm:gap-4 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/blogs/${prev.slug}`}
                  className="group flex items-start gap-2.5 rounded-xl bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-shadow duration-300 active:scale-[0.98] active:transition-transform [@media(hover:hover)]:hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] sm:gap-3 sm:rounded-2xl sm:p-5"
                >
                  <ChevronLeft className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#ED7428] transition-transform group-hover:-translate-x-1 sm:h-5 sm:w-5" />
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 sm:text-xs">Previous</p>
                    <p className="mt-0.5 text-xs font-semibold text-[#00373E] line-clamp-2 sm:mt-1 sm:text-sm">
                      {prev.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/blogs/${next.slug}`}
                  className="group flex items-start gap-2.5 rounded-xl bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-shadow duration-300 active:scale-[0.98] active:transition-transform [@media(hover:hover)]:hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] sm:flex-row-reverse sm:gap-3 sm:rounded-2xl sm:p-5 sm:text-right"
                >
                  <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#ED7428] transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5" />
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 sm:text-xs">Next</p>
                    <p className="mt-0.5 text-xs font-semibold text-[#00373E] line-clamp-2 sm:mt-1 sm:text-sm">
                      {next.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </article>
      </main>
    </>
  );
}
