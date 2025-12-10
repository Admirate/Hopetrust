import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import FadeInSection from '@/components/FadeInSection';

// Code-split home sections so each becomes its own chunk
const HeroSection = dynamic(() => import('@/components/HeroSection'));
const BackgroundCirclesSection = dynamic(
  () => import('@/components/BackgroundCirclesSection')
);
const WhatWeOfferSection = dynamic(
  () => import('@/components/WhatWeOfferSection')
);
const RectangleSection = dynamic(() => import('@/components/RectangleSection'));
const ClientsSayingSection = dynamic(
  () => import('@/components/ClientsSayingSection')
);
const ResourcesSection = dynamic(
  () => import('@/components/ResourcesSection')
);
const LargeRectangleSection = dynamic(
  () => import('@/components/LargeRectangleSection')
);
const MeetTheTeamSection = dynamic(
  () => import('@/components/MeetTheTeamSection')
);
const ContactSection = dynamic(() => import('@/components/ContactSection'));
const HomeFinalCtaSection = dynamic(
  () => import('@/components/HomeFinalCtaSection')
);

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <FadeInSection>
          <HeroSection />
        </FadeInSection>
        {/* Let BackgroundCirclesSection handle its own element animations so the background image stays static */}
        <BackgroundCirclesSection />
        <FadeInSection delay={150}>
          <WhatWeOfferSection />
        </FadeInSection>
        <FadeInSection delay={200}>
          <RectangleSection />
        </FadeInSection>
        <FadeInSection delay={250}>
          <ClientsSayingSection />
        </FadeInSection>
        {/* Let ResourcesSection handle its own staggered card animation */}
        <ResourcesSection />
        {/* Let LargeRectangleSection handle its own card animation */}
        <LargeRectangleSection />
        <FadeInSection delay={400}>
          <MeetTheTeamSection />
        </FadeInSection>
        {/* Let ContactSection handle its own text + card animation */}
        <ContactSection />
        {/* Let HomeFinalCtaSection handle its own left/right card animations */}
        <HomeFinalCtaSection />
      </main>
    </>
  );
}