import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import BackgroundCirclesSection from '@/components/BackgroundCirclesSection';
import WhatWeOfferSection from '@/components/WhatWeOfferSection';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <HeroSection />
        <BackgroundCirclesSection />
        <WhatWeOfferSection />
      </main>
    </>
  );
}