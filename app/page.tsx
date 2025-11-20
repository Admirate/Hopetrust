import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import WhatWeOfferSection from '@/components/WhatWeOfferSection';
import HowJourneyUnfoldsSection from '@/components/HowJourneyUnfoldsSection';
import MeetTheTeamSection from '@/components/MeetTheTeamSection';
import ConnectShareSection from '@/components/ConnectShareSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <WhatWeOfferSection />
      <HowJourneyUnfoldsSection />
      <MeetTheTeamSection />
      <ConnectShareSection />
    </main>
  );
}