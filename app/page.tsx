import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import TrustSection from '@/components/TrustSection';
import WhySection from '@/components/WhySection';
import WhatWeTreatSection from '@/components/WhatWeTreatSection';
import ServicesSection from '@/components/ServicesSection';
import ReviewsSection from '@/components/ReviewsSection';
import JourneySection from '@/components/JourneySection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <TrustSection />
      <WhySection />
      <WhatWeTreatSection />
      <ServicesSection />
      <ReviewsSection />
      <JourneySection />
      <Footer />
    </main>
  );
}