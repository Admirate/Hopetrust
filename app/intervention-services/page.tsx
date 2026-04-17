import Header from '@/components/Header';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer'));

export const metadata = {
  title: 'Intervention Services | Hope Trust - Professional Addiction Intervention',
  description:
    'Professional intervention services to help families guide loved ones toward addiction treatment. Structured, compassionate intervention planning by experienced counsellors at Hope Trust, Hyderabad.',
  keywords:
    'addiction intervention, family intervention, professional interventionist, substance abuse help, Hope Trust intervention Hyderabad',
  openGraph: {
    title: 'Intervention Services | Hope Trust',
    description:
      'Professional intervention services to help families guide loved ones toward addiction treatment.',
    type: 'website',
    siteName: 'Hope Trust',
  },
};

export default function InterventionServicesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F7F5EF]">
        {/* Placeholder hero */}
        <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#00373E]">
            Intervention Services
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
