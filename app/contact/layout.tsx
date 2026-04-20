import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { getBreadcrumbSchema } from '@/lib/jsonld';

export const metadata: Metadata = {
  title: 'Contact Us | Hope Trust - Book an Appointment',
  description:
    'Get in touch with Hope Trust for in-clinic or online appointments. Office hours 9 AM to 8 PM, Monday to Saturday. Located at Banjara Hills, Hyderabad. Call +91 9000850001 or email frontoffice@hopetrustindia.com.',
  keywords:
    'contact Hope Trust, book appointment, therapy Hyderabad, mental health clinic, Banjara Hills, phone number, email',
  alternates: {
    canonical: '/contact/',
  },
  openGraph: {
    title: 'Contact Us | Hope Trust',
    description:
      'Reach out for in-clinic or online appointments. Office hours 9 AM to 8 PM, Monday to Saturday. Banjara Hills, Hyderabad.',
    type: 'website',
    siteName: 'Hope Trust',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={getBreadcrumbSchema([
        { name: 'Home', url: 'https://hopetrustindia.com/' },
        { name: 'Contact Us', url: 'https://hopetrustindia.com/contact/' },
      ])} />
      {children}
    </>
  );
}
