'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, ArrowRight, X } from 'lucide-react';
import { Bricolage_Grotesque } from 'next/font/google';
import FadeInSection from '@/components/FadeInSection';
import NewsletterForm from '@/components/NewsletterForm';
import type { BlogPostMeta } from '@/lib/blog';

const headingFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700'],
});

const POSTS_PER_PAGE = 12;

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function BlogListClient({
  posts,
  categories,
}: {
  posts: BlogPostMeta[];
  categories: string[];
}) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    let result = posts;

    if (activeCategory !== 'All') {
      result = result.filter((p) => p.categories.includes(activeCategory));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.categories.some((c) => c.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [posts, search, activeCategory]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  const featured = posts[0];

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getVisiblePages = (): number[] => {
    const maxButtons = 5;
    const pages: number[] = [];
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, page - half);
    const end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <>
      {/* Hero section */}
      <FadeInSection>
        <section className="w-full bg-[#00373E]">
          <div className="mx-auto flex w-full max-w-[1225px] flex-col gap-6 px-4 py-12 sm:gap-8 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
            <div className="max-w-2xl space-y-3 sm:space-y-4">
              <h1
                className={`${headingFont.className} text-2xl font-bold text-white sm:text-4xl lg:text-5xl`}
              >
                Insights for your mind,{' '}
                <span className="text-[#ED7428]">body & soul</span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-white/70 sm:text-base lg:text-lg">
                Explore expert articles on mental health, therapy, addiction
                recovery, relationships, and wellness from the Hope Trust team.
              </p>
            </div>

            {/* Search bar */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 sm:h-5 sm:w-5" />
              <input
                type="text"
                id="blog-search"
                name="search"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-full bg-white py-2.5 pl-10 pr-10 text-sm text-gray-800 shadow-lg outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#ED7428] sm:py-3 sm:pl-12 sm:pr-4 sm:text-base"
              />
              {search && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 sm:hidden"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Featured post */}
      {featured && !search && activeCategory === 'All' && (
        <FadeInSection delay={100}>
          <section className="w-full bg-white py-8 sm:py-10 lg:py-14">
            <div className="mx-auto w-full max-w-[1225px] px-4 sm:px-8 lg:px-12">
              <Link
                href={`/blogs/${featured.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-[#F7F6F4] transition-shadow duration-300 active:scale-[0.99] active:transition-transform [@media(hover:hover)]:hover:shadow-xl sm:rounded-[28px] lg:flex-row"
              >
                {featured.featuredImage && (
                  <div className="relative h-[200px] w-full overflow-hidden sm:h-[260px] lg:h-auto lg:w-1/2">
                    <Image
                      src={featured.featuredImage}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col justify-center px-5 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-10">
                  <span className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[#ED7428] sm:mb-3 sm:text-xs">
                    Featured Article
                  </span>
                  {featured.categories.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1.5 sm:mb-3 sm:gap-2">
                      {featured.categories.map((cat) => (
                        <span
                          key={cat}
                          className="rounded-full bg-[#FFF7ED] px-2.5 py-0.5 text-[10px] font-medium text-[#ED7428] sm:px-3 sm:text-xs"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2
                    className={`${headingFont.className} mb-2 text-lg font-bold text-[#00373E] sm:mb-3 sm:text-2xl lg:text-3xl`}
                  >
                    {featured.title}
                  </h2>
                  <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[#4B5563] sm:mb-4 sm:line-clamp-3 sm:text-sm lg:text-base">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 sm:gap-4 sm:text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      {formatDate(featured.date)}
                    </span>
                    <span>{featured.author}</span>
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#ED7428] transition-colors group-hover:text-[#d4631f] sm:mt-4 sm:text-sm">
                    Read article
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
                  </span>
                </div>
              </Link>
            </div>
          </section>
        </FadeInSection>
      )}

      {/* Newsletter CTA */}
      <FadeInSection delay={150}>
        <section className="w-full bg-[#00373E]">
          <div className="mx-auto flex w-full max-w-[1225px] flex-col items-center gap-4 px-4 py-10 text-center sm:gap-6 sm:px-8 sm:py-14 lg:px-12">
            <h2
              className={`${headingFont.className} text-xl font-bold text-white sm:text-2xl lg:text-3xl`}
            >
              Stay updated with our latest insights
            </h2>
            <p className="max-w-lg text-xs text-white/60 sm:text-sm">
              Subscribe to receive weekly articles on mental health, therapy,
              recovery, and wellness — straight to your inbox.
            </p>
            <div className="w-full max-w-2xl">
              <NewsletterForm variant="inline" dark />
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Category filters + Grid */}
      <section ref={gridRef} className="w-full bg-[#F7F6F4] py-8 sm:py-10 lg:py-14">
        <div className="mx-auto w-full max-w-[1225px] px-4 sm:px-8 lg:px-12">
          {/* Category tabs — horizontally scrollable on mobile */}
          <div className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:mb-8 sm:overflow-visible sm:px-0">
            <div className="flex w-max gap-2 pb-2 sm:w-auto sm:flex-wrap sm:pb-0">
              <button
                onClick={() => handleCategoryChange('All')}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
                  activeCategory === 'All'
                    ? 'bg-[#00373E] text-white'
                    : 'bg-white text-[#00373E] hover:bg-gray-100'
                }`}
              >
                All ({posts.length})
              </button>
              {categories.map((cat) => {
                const count = posts.filter((p) =>
                  p.categories.includes(cat)
                ).length;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
                      activeCategory === cat
                        ? 'bg-[#00373E] text-white'
                        : 'bg-white text-[#00373E] hover:bg-gray-100'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results count */}
          <p className="mb-4 text-xs text-gray-500 sm:mb-6 sm:text-sm">
            {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
            {search && ` for "${search}"`}
            {activeCategory !== 'All' && ` in ${activeCategory}`}
          </p>

          {/* Blog grid */}
          {paginated.length > 0 ? (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginated.map((post, idx) => (
                <FadeInSection key={post.slug} delay={idx * 50}>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-shadow duration-300 active:scale-[0.98] active:transition-transform [@media(hover:hover)]:hover:-translate-y-1 [@media(hover:hover)]:hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] sm:rounded-[20px]"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-[160px] w-full overflow-hidden bg-[#EAF3FF] sm:h-[180px]">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#F7F6F4] to-[#EAF3FF]">
                          <span className="text-3xl text-gray-300 sm:text-4xl">📝</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col px-4 py-4 sm:px-5 sm:py-5">
                      {post.categories.length > 0 && (
                        <div className="mb-1.5 flex flex-wrap gap-1 sm:mb-2 sm:gap-1.5">
                          {post.categories.slice(0, 2).map((cat) => (
                            <span
                              key={cat}
                              className="rounded-full bg-[#FFF7ED] px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-[#ED7428] sm:px-2.5 sm:text-[10px]"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}

                      <h3
                        className={`${headingFont.className} mb-1.5 text-sm font-semibold leading-snug text-[#00373E] line-clamp-2 sm:mb-2 sm:text-base lg:text-lg`}
                      >
                        {post.title}
                      </h3>

                      <p className="mb-3 flex-1 text-[11px] leading-relaxed text-[#4B5563] line-clamp-2 sm:mb-4 sm:line-clamp-3 sm:text-xs lg:text-sm">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 sm:text-[11px]">
                          <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          {formatDate(post.date)}
                        </span>
                        <span className="text-[10px] font-semibold text-[#ED7428] transition-colors group-hover:text-[#d4631f] sm:text-xs">
                          Read more →
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeInSection>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center sm:py-20">
              <p className="text-base text-gray-400 sm:text-lg">No articles found</p>
              <p className="mt-2 text-xs text-gray-300 sm:text-sm">
                Try adjusting your search or filter
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1.5 sm:mt-10 sm:gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#00373E] shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed sm:px-4 sm:py-2 sm:text-sm"
              >
                Prev
              </button>

              {getVisiblePages().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`h-8 w-8 rounded-full text-xs font-medium transition-colors sm:h-10 sm:w-10 sm:text-sm ${
                    page === pageNum
                      ? 'bg-[#00373E] text-white'
                      : 'bg-white text-[#00373E] hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#00373E] shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed sm:px-4 sm:py-2 sm:text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
