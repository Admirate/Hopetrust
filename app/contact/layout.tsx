import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Hope Trust - Book an Appointment',
  description:
    'Get in touch with Hope Trust for in-clinic or online appointments. Office hours 9 AM to 8 PM, Monday to Saturday. Located at Banjara Hills, Hyderabad. Call +91 9000850001 or email frontoffice@hopetrustindia.com.',
  keywords:
    'contact Hope Trust, book appointment, therapy Hyderabad, mental health clinic, Banjara Hills, phone number, email',
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
  return children;
}
