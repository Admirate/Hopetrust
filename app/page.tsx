import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import BackgroundCirclesSection from '@/components/BackgroundCirclesSection';
import WhatWeOfferSection from '@/components/WhatWeOfferSection';
import RectangleSection from '@/components/RectangleSection';
import ClientsSayingSection from '@/components/ClientsSayingSection';
import ResourcesSection from '@/components/ResourcesSection';
import LargeRectangleSection from '@/components/LargeRectangleSection';
import MeetTheTeamSection from '@/components/MeetTheTeamSection';
import ContactSection from '@/components/ContactSection';
import HomeFinalCtaSection from '@/components/HomeFinalCtaSection';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <HeroSection />
        <BackgroundCirclesSection />
        <WhatWeOfferSection />
        <RectangleSection />
        <ClientsSayingSection />
        <ResourcesSection />
        <LargeRectangleSection />
        <MeetTheTeamSection />
        <ContactSection />
        <HomeFinalCtaSection />
      </main>
    </>
  );
}