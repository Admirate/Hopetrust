 'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Bricolage_Grotesque } from 'next/font/google';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';
import FadeInSection from '@/components/FadeInSection';

// Code-split shared CTA
const HomeFinalCtaSection = dynamic(
  () => import('@/components/HomeFinalCtaSection')
);

type FocusAreaKey = 'therapy' | 'medications' | 'couples' | 'family';
type AssessmentKey = 'adhd' | 'student' | 'queer';

const FOCUS_AREAS: Record<
  FocusAreaKey,
  { label: string; heading: string; paragraphs: string[] }
> = {
  therapy: {
    label: 'Therapy',
    heading: 'Therapy',
    paragraphs: [
      'Therapy gives you a comfortable place to talk about what has been difficult.',
      'Your therapist helps you understand your feelings, patterns, and concerns with steady guidance.',
      'Sessions focus on making everyday life easier and helping you feel more in control.',
    ],
  },
  medications: {
    label: 'Medications',
    heading: 'Medications',
    paragraphs: [
      'Medication can support your recovery when recommended by a psychiatrist.',
      'You receive clear explanations of why a medicine is suggested and how it works.',
      'Decisions are always collaborative and based on what feels right for you.',
    ],
  },
  couples: {
    label: 'Couples Therapy',
    heading: 'Couples Therapy',
    paragraphs: [
      'Couples therapy helps partners talk openly without blame.',
      'You learn practical tools to handle conflict and rebuild trust.',
      'The focus stays on understanding each other and moving forward together.',
    ],
  },
  family: {
    label: 'Family Therapy',
    heading: 'Family Therapy',
    paragraphs: [
      'Family sessions create space for everyone to be heard.',
      'You explore patterns at home and find healthier ways to support each other.',
      'The aim is a calmer, more connected family life.',
    ],
  },
};

const ASSESSMENTS: Record<
  AssessmentKey,
  { label: string; paragraphs: string[] }
> = {
  adhd: {
    label: 'ADHD Testing',
    paragraphs: [
      'ADHD evaluations are structured and easy to follow.',
      'You receive a clear explanation of the results and what they mean for day-to-day life.',
      'Next steps are discussed gently so you know how to move forward.',
    ],
  },
  student: {
    label: 'Student Mental Health',
    paragraphs: [
      'Support for school, college, and university students navigating stress, exams, and changes.',
      'Sessions focus on building routines, managing expectations, and finding healthy balance.',
      'Parents and caregivers can be included when helpful.',
    ],
  },
  queer: {
    label: 'Queer Affirmative Mental Health',
    paragraphs: [
      'A space that respects and affirms your gender identity and sexual orientation.',
      'Therapists work with you to process stigma, build safety, and honour your lived experience.',
      'Care is collaborative, non-judgmental, and rooted in your context.',
    ],
  },
};

const assessmentBodyFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500'],
});

export default function MentalHealthPage() {
  const [activeKey, setActiveKey] = useState<FocusAreaKey>('therapy');
  const [rotationStep, setRotationStep] = useState(0);
  const [labelOffset, setLabelOffset] = useState(0);
  const [activeAssessment, setActiveAssessment] =
    useState<AssessmentKey>('adhd');

  const activeArea = FOCUS_AREAS[activeKey];
  const angle = rotationStep * 90;

  const handleSelect = (key: FocusAreaKey) => {
    if (key === activeKey) return;
    setActiveKey(key);
    setRotationStep((prev) => prev + 1);
  };

  // Animate the label from the edge of the ellipse towards the center
  useEffect(() => {
    // start near the outer ring
    setLabelOffset(80);
    const id = requestAnimationFrame(() => {
      setLabelOffset(0);
    });
    return () => cancelAnimationFrame(id);
  }, [activeKey]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-black">
        {/* Hero section with background video */}
        <FadeInSection>
        <section className="relative h-[calc(100vh-5rem)] w-full overflow-hidden">
          {/* Background video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            preload="metadata"
          >
            <source src="/mentalhealthherovideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Centered content */}
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-[48px] font-semibold tracking-[0.18em] uppercase">
              Mental Health
            </h1>

            <div className="mt-8 text-[72px] font-semibold">
              <p>
                <span>Therapy</span>
                <span className="mx-3 text-white/60">|</span>
                <span>Medications</span>
                <span className="mx-3 text-white/60">|</span>
                <span>Couples Therapy</span>
                <span className="mx-3 text-white/60">|</span>
                <span>Family Therapy</span>
              </p>
              <p className="mt-2">&amp; more</p>
            </div>
          </div>
        </section>
        </FadeInSection>

        {/* Focus area section with ellipse and copy */}
        <FadeInSection delay={100}>
        <section className="w-full bg-[#FEF2EB]">
          <div className="mx-auto flex w-full max-w-[1184px] flex-col px-4 sm:px-8 lg:px-12 pt-12 sm:pt-16 pb-16">
            <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-16">
              {/* Left: ellipse with wheel-style label animation */}
              <div className="relative flex w-full md:w-[40%] justify-start md:justify-center">
                <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px]">
                  <Image
                    src="/Ellipse 95.png"
                    alt="Decorative ring"
                    fill
                    className="object-contain"
                    priority={false}
                  />
                  {/* Rotating wheel container */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {/* Label that moves inward in a wheel-like fashion */}
                    <div
                      className="flex items-center gap-3"
                      style={{
                        transform: `rotate(${-angle}deg) translateX(${labelOffset}px)`,
                        transition:
                          'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      <span className="h-3 w-3 rounded-full bg-[#ED7428]" />
                      <span className="text-lg sm:text-xl font-semibold uppercase tracking-[0.18em] text-[#ED7428]">
                        {activeArea.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: explanatory copy */}
              <div className="w-full md:w-[60%] text-left text-[#4B5563] text-sm sm:text-base leading-relaxed space-y-5">
                <h2 className="text-xl sm:text-2xl font-semibold text-[#ED7428]">
                  {activeArea.heading}
                </h2>
                {activeArea.paragraphs.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
            </div>

            {/* Bottom navigation strip */}
            <div className="mt-10 -mx-4 sm:-mx-8 lg:-mx-12">
              <div className="border-t border-[#FAD9BF] bg-[#FEDFCE]">
                <div className="flex flex-wrap items-center justify-center gap-10 px-4 sm:px-8 lg:px-12 py-3 text-lg sm:text-2xl font-semibold">
                  {(
                    [
                      'therapy',
                      'medications',
                      'couples',
                      'family',
                    ] as FocusAreaKey[]
                  ).map((key) => {
                    const isActive = key === activeKey;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelect(key)}
                        className={`flex flex-col items-center pb-1 transition-colors ${
                          isActive
                            ? 'text-[#ED7428]'
                            : 'text-white hover:text-[#ED7428]'
                        }`}
                      >
                        <span>{FOCUS_AREAS[key].label}</span>
                        <span
                          className={`mt-1 h-[3px] w-full rounded-full ${
                            isActive ? 'bg-[#ED7428]' : 'bg-transparent'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
        </FadeInSection>

        {/* Assessment cards section */}
        <FadeInSection delay={150}>
        <section className="w-full bg-[#F7F6F4] pb-16 sm:pb-20">
          <div className="mx-auto w-full max-w-[1225px] px-4 sm:px-6 lg:px-8 pt-10">
            <div className="relative rounded-[63px] bg-white px-6 sm:px-10 lg:px-16 py-10 sm:py-12 shadow-[0_24px_60px_rgba(0,0,0,0.03)]">
              {/* Top tabs */}
              <div className="flex flex-col gap-6 sm:gap-8">
                <div className="flex flex-wrap items-center justify-start gap-8 text-base sm:text-xl font-semibold">
                  {(
                    ['adhd', 'student', 'queer'] as AssessmentKey[]
                  ).map((key) => {
                    const isActive = key === activeAssessment;
                    const label = ASSESSMENTS[key].label;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setActiveAssessment(key)}
                        className={`transition-colors ${
                          isActive
                            ? 'text-[#ED7428]'
                            : 'text-[#E0DFDD] hover:text-[#ED7428]'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Copy for active assessment */}
                <div
                  className={`${assessmentBodyFont.className} mt-2 max-w-[1058px] text-[24px] leading-relaxed text-[#5E5E5E] tracking-[0.724px] space-y-4`}
                >
                  <h3 className="text-[40px] font-semibold tracking-[0.724px] text-[#E26B20]">
                    {ASSESSMENTS[activeAssessment].label}
                  </h3>
                  {ASSESSMENTS[activeAssessment].paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        </FadeInSection>

        {/* Global footer-style support CTA */}
        <FadeInSection delay={200}>
          <HomeFinalCtaSection />
        </FadeInSection>
      </main>
    </>
  );
}

