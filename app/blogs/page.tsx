import { getAllPostsMeta, getAllCategories } from '@/lib/blog';
import Header from '@/components/Header';
import BlogListClient from '@/components/BlogListClient';

export const metadata = {
  title: 'Blog | Hope Trust - Mental Health & Wellness Insights',
  description:
    'Explore articles on mental health, therapy, addiction recovery, relationships, and wellness from Hope Trust\'s team of experts.',
  openGraph: {
    title: 'Blog | Hope Trust',
    description:
      'Explore articles on mental health, therapy, addiction recovery, relationships, and wellness.',
    type: 'website',
    siteName: 'Hope Trust',
  },
};

export default function BlogsPage() {
  const posts = getAllPostsMeta();
  const categories = getAllCategories();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F7F6F4] pt-20">
        <BlogListClient posts={posts} categories={categories} />
      </main>
    </>
  );
}
