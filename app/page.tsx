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
import FadeInSection from '@/components/FadeInSection';

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