import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Hope Trust - Our Story, Team & Approach',
  description:
    'Hope Trust began in 2002 with a simple intention — to offer a calm and steady space for healing. Learn about our 20+ year journey, our multidisciplinary team of 30+ professionals, and our evidence-based approach to mental health and addiction recovery.',
  keywords:
    'Hope Trust, about us, mental health clinic Hyderabad, addiction recovery, therapy team, evidence-based treatment, wellness coaching',
  openGraph: {
    title: 'About Us | Hope Trust',
    description:
      'From one family\'s journey to a global network of care — Hope Trust stands for recovery, healing, and rebuilding meaningful lives.',
    type: 'website',
    siteName: 'Hope Trust',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
