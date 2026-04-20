import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getServiceSchema, getBreadcrumbSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Training | Hope Trust - Professional Development Programs',
  description:
    'Professional training and certification programs in mental health, addiction counselling, and therapeutic techniques by Hope Trust. Upskill with evidence-based methodologies from industry experts.',
  keywords:
    'mental health training, addiction counselling course, therapy certification, professional development, Hope Trust training Hyderabad',
  alternates: {
    canonical: '/training/',
  },
  openGraph: {
    title: 'Training | Hope Trust',
    description:
      'Professional training programs in mental health and addiction counselling by Hope Trust.',
    type: 'website',
    siteName: 'Hope Trust',
  },
};

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={getServiceSchema({
        name: 'Training Programs',
        description: 'Professional training and certification programs in mental health, addiction counselling, and therapeutic techniques in Hyderabad.',
        url: 'https://hopetrustindia.com/training/',
        serviceType: 'Clinical Training',
      })} />
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://hopetrustindia.com/' },
        { name: 'Training', url: 'https://hopetrustindia.com/training/' },
      ])} />
      {children}
    </>
  );
}
