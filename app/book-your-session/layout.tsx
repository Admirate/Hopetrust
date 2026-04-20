import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getBreadcrumbSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Book Your Session | Hope Trust - Find a Therapist',
  description:
    'Browse our team of qualified therapists, psychiatrists, and counsellors. Book an in-clinic or online session at Hope Trust, Hyderabad. Filter by department to find the right professional for your needs.',
  keywords:
    'book therapy session, find therapist, psychiatrist Hyderabad, counsellor appointment, online therapy, Hope Trust doctors',
  alternates: {
    canonical: '/book-your-session/',
  },
  openGraph: {
    title: 'Book Your Session | Hope Trust',
    description:
      'Find the right therapist and book an in-clinic or online session at Hope Trust, Hyderabad.',
    type: 'website',
    siteName: 'Hope Trust',
  },
};

export default function BookYourSessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://hopetrustindia.com/' },
        { name: 'Book Your Session', url: 'https://hopetrustindia.com/book-your-session/' },
      ])} />
      {children}
    </>
  );
}
