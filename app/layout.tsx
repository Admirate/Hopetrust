import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import WebVitals from '@/components/WebVitals';
import LenisProvider from '@/components/LenisProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  title: 'Hope Trust - A place for hope, healing, and renewal',
  description:
    'Hope Trust has been supporting individuals and families on their path to recovery for over 20 years. Our care is respectful, evidence-based, and always personal.',
  keywords: 'mental health, therapy, counseling, recovery, addiction, hope trust',
  authors: [{ name: 'Hope Trust' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Hope Trust - A place for hope, healing, and renewal',
    description:
      'Hope Trust has been supporting individuals and families on their path to recovery for over 20 years.',
    type: 'website',
    siteName: 'Hope Trust',
  },
};

// Next.js App Router requires viewport to be exported separately
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="smooth-scroll">
      <head>
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <LenisProvider>
          {children}
          <WebVitals />
        </LenisProvider>
      </body>
    </html>
  );
}