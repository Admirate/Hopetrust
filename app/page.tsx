import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';

// Lazy load components that are below the fold
const TrustSection = dynamic(() => import('@/components/TrustSection'), {
  loading: () => <div className="h-screen animate-pulse bg-gray-100" />,
});

const WhySection = dynamic(() => import('@/components/WhySection'), {
  loading: () => <div className="h-screen animate-pulse bg-gray-100" />,
});

const WhatWeTreatSection = dynamic(() => import('@/components/WhatWeTreatSection'), {
  loading: () => <div className="h-screen animate-pulse bg-gray-100" />,
});

const ServicesSection = dynamic(() => import('@/components/ServicesSection'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
});

const ReviewsSection = dynamic(() => import('@/components/ReviewsSection'), {
  loading: () => <div className="h-screen animate-pulse bg-gray-100" />,
});

const JourneySection = dynamic(() => import('@/components/JourneySection'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
});

const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="h-96 animate-pulse bg-gray-800" />,
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <Suspense fallback={<div className="h-screen animate-pulse bg-gray-100" />}>
        <TrustSection />
        <WhySection />
        <WhatWeTreatSection />
        <ServicesSection />
        <ReviewsSection />
        <JourneySection />
        <Footer />
      </Suspense>
    </main>
  );
}