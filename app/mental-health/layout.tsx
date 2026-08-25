import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { mentalHealthFaqs } from '@/lib/faqs';
import { getServiceSchema, getBreadcrumbSchema, getFAQSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Mental Health Therapy & Psychiatry',
  description:
    'Therapy, psychiatry, couples and family therapy for anxiety, depression, trauma, ADHD, OCD and grief. In-clinic and online sessions in Hyderabad.',
  keywords:
    'mental health, therapy, psychiatry, couples therapy, family therapy, anxiety, depression, ADHD, OCD, trauma, counselling Hyderabad, Hope Trust',
  alternates: {
    canonical: '/mental-health/',
  },
  openGraph: {
    title: 'Mental Health Services | Hope Trust',
    description:
      'Support for the mind, emotions, relationships, and everyday life. Therapy, medications, couples therapy, family therapy, and more.',
    type: 'website',
    siteName: 'Hope Trust',
  },
};

export default function MentalHealthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={getServiceSchema({
        name: 'Mental Health Services',
        description: 'Comprehensive mental health support including therapy, psychiatry, couples therapy, and family therapy in Hyderabad.',
        url: 'https://hopetrustindia.com/mental-health/',
        serviceType: 'Mental Health Therapy',
      })} />
      <JsonLd data={getFAQSchema(mentalHealthFaqs)} />
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://hopetrustindia.com/' },
        { name: 'Mental Health', url: 'https://hopetrustindia.com/mental-health/' },
      ])} />
      {children}
    </>
  );
}
