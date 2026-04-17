import Header from '@/components/Header';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer'));

export const metadata = {
  title: 'Corporate Wellness | Hope Trust - Employee Mental Health Programs',
  description:
    'Corporate wellness programs designed to support employee mental health, reduce workplace stress, and boost productivity. Workshops, counselling, and mental health first-aid training by Hope Trust.',
  keywords:
    'corporate wellness, employee mental health, workplace stress, EAP, employee assistance, mental health workshops, Hope Trust corporate',
  openGraph: {
    title: 'Corporate Wellness | Hope Trust',
    description:
      'Corporate wellness programs to support employee mental health and reduce workplace stress.',
    type: 'website',
    siteName: 'Hope Trust',
  },
};

export default function CorporateWellnessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F7F5EF]">
        {/* Placeholder hero */}
        <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#00373E]">
            Corporate Wellness
          </h1>
          <p className="mt-4 max-w-xl text-lg text-[#00373E]/70">
            This page is coming soon.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
