import Header from '@/components/Header';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer'));

export const metadata = {
  title: 'Intervention Services | Hope Trust',
  description: 'Intervention services for addiction recovery by Hope Trust.',
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
