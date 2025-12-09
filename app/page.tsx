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
        <FadeInSection delay={100}>
          <BackgroundCirclesSection />
        </FadeInSection>
        <FadeInSection delay={150}>
          <WhatWeOfferSection />
        </FadeInSection>
        <FadeInSection delay={200}>
          <RectangleSection />
        </FadeInSection>
        <FadeInSection delay={250}>
          <ClientsSayingSection />
        </FadeInSection>
        <FadeInSection delay={300}>
          <ResourcesSection />
        </FadeInSection>
        <FadeInSection delay={350}>
          <LargeRectangleSection />
        </FadeInSection>
        <FadeInSection delay={400}>
          <MeetTheTeamSection />
        </FadeInSection>
        <FadeInSection delay={450}>
          <ContactSection />
        </FadeInSection>
        <FadeInSection delay={500}>
          <HomeFinalCtaSection />
        </FadeInSection>
      </main>
    </>
  );
}