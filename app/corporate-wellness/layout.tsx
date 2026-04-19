import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Corporate Wellness | Hope Trust - Employee Mental Health Programs',
  description:
    'Hope Trust offers corporate wellness programmes designed to support employee mental health, reduce workplace stress, and boost team wellbeing. Sessions, workshops, and structured support in Hyderabad.',
  keywords:
    'corporate wellness, employee mental health, workplace stress, EAP, employee assistance programme, mental health workshops, Hope Trust Hyderabad, team wellbeing',
  openGraph: {
    title: 'Corporate Wellness | Hope Trust',
    description:
      'Corporate wellness programmes to support employee mental health and reduce workplace stress.',
    type: 'website',
    siteName: 'Hope Trust',
  },
};

export default function CorporateWellnessLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
