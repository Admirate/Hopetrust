"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import Image from 'next/image';
import { Bricolage_Grotesque } from 'next/font/google';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';

// Code-split shared CTA
const HomeFinalCtaSection = dynamic(
  () => import('@/components/HomeFinalCtaSection')
);

type FocusKey = 'therapy' | 'medications' | 'couples' | 'family';
type AssessmentKey = 'adhd' | 'student' | 'queer';

type FocusConfig = {
  label: string;
  heading: string;
  paragraphs: string[];
  issues: string;
  cardBg: string;
  imageSrc: string;
  imageAlt: string;
};

const FOCUS_SECTIONS: Record<FocusKey, FocusConfig> = {
  therapy: {
    label: 'Therapy',
    heading: 'THERAPY',
    paragraphs: [
      'A quiet space to understand what is happening within you.',
      'Therapy helps you notice patterns, make sense of your concerns and move toward clarity and steadiness at your own pace.',
    ],
    issues:
      'Anxiety, Depression, Stress, Anger Management, Loneliness, Procrastination, Grief, Trauma, Interpersonal Challenges',
    cardBg: '#F9E6D0',
    imageSrc: '/mental health therapy.png',
    imageAlt: 'Therapy illustration',
  },
  medications: {
    label: 'Medications',
    heading: 'MEDICATIONS',
    paragraphs: [
      'If medication can support your wellbeing, our psychiatrists explain it simply. You understand why it is suggested, how it works and what to expect. Your progress is reviewed gently and decisions are made together.',
    ],
    issues:
      'Anxiety, Depression, Stress, Anger Management, Loneliness, Procrastination, Grief, Trauma, Interpersonal Challenges',
    cardBg: '#FFF0D5',
    imageSrc: '/medications.png',
    imageAlt: 'Medications illustration',
  },
  couples: {
    label: 'Couples Therapy',
    heading: 'COUPLES THERAPY',
    paragraphs: [
      'A space for partners to slow down, talk openly and understand each other with less conflict.',
      'The focus is on communication, trust and rebuilding connection.',
      'Steps: 1. Initial session  2. Individual space for each partner  3. Joint sessions for collaboration.',
    ],
    issues:
      'Communication, Conflict Resolution, Trust Building, Empathy',
    cardBg: '#FFE6DA',
    imageSrc: '/couple therapy.png',
    imageAlt: 'Couples therapy illustration',
  },
  family: {
    label: 'Family Therapy',
    heading: 'FAMILY THERAPY',
    paragraphs: [
      'Family therapy offers a calm space to work through misunderstandings, repeated arguments or changes that feel heavy at home.',
      'The aim is healthier communication and balance.',
    ],
    issues:
      'Family Conflicts, Boundaries, Generational Gaps, Parent Child Communication',
    cardBg: '#FFEED7',
    imageSrc: '/family therapy.png',
    imageAlt: 'Family therapy illustration',
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

const focusHeadingFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600'],
});

const focusBodyFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500'],
});

const focusBoldBodyFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700'],
});

const TYPING_SPEED_MS = 18;

type TypingParagraphProps = {
  text: string;
  start: boolean;
  className?: string;
  style?: React.CSSProperties;
};

function TypingParagraph({
  text,
  start,
  className,
  style,
}: TypingParagraphProps) {
  const [displayed, setDisplayed] = useState(start ? "" : text);

  useEffect(() => {
    if (!start) return;
    setDisplayed("");
    let index = 0;
    const id = window.setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(id);
      }
    }, TYPING_SPEED_MS);

    return () => {
      window.clearInterval(id);
    };
  }, [start, text]);

  return (
    <p className={className} style={style}>
      {displayed}
    </p>
  );
}

export default function MentalHealthPage() {
  const [activeFocus, setActiveFocus] = useState<FocusKey>('therapy');
  const [activeAssessment, setActiveAssessment] =
    useState<AssessmentKey>('adhd');
  const [hasAssessmentCardInView, setHasAssessmentCardInView] =
    useState(false);

  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-black">
        {/* Hero section with background video */}
        <section
          ref={heroRef}
          className="relative h-[calc(100vh-5rem)] w-full overflow-hidden"
        >
          {/* Background video */}
          <motion.video
            style={{ y: backgroundY }}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            preload="metadata"
          >
            <source src="/mentalhealthherovideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </motion.video>

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Centered content */}
          <motion.div
            style={{ y: textY }}
            className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center text-white"
          >
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
          </motion.div>
        </section>

        {/* Focus area strip + card */}
          <section className="w-full bg-[#F7F6F4]">
            <div className="mx-auto flex w-full justify-center px-4 sm:px-8 lg:px-12 pt-10 pb-16">
              {/* Outer card */}
              <div className="flex h-[650px] w-full max-w-[1170px] flex-col rounded-[84px] bg-transparent overflow-hidden">
                {/* Top strip with tabs */}
                <div className="flex bg-[#FFE3C7]">
                  {(Object.keys(FOCUS_SECTIONS) as FocusKey[]).map((key) => {
                    const isActive = key === activeFocus;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setActiveFocus(key)}
                        className={`flex-1 px-4 py-4 text-xs sm:text-sm md:text-base font-semibold transition-colors ${
                          isActive
                            ? 'bg-[#FFF4D9] text-[#ED7428]'
                            : 'bg-transparent text-[#00373E] hover:bg-[#FFEED2]'
                        }`}
                      >
                        {FOCUS_SECTIONS[key].label}
                      </button>
                    );
                  })}
                </div>

                {/* Content card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFocus}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.4,
                      ease: [0.22, 0.61, 0.36, 1],
                    }}
                    className="flex-1 px-6 py-10 sm:px-10 sm:py-12 shadow-[0_24px_60px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-center gap-8 md:gap-12"
                    style={{ backgroundColor: FOCUS_SECTIONS[activeFocus].cardBg }}
                  >
                    {/* Left illustration */}
                    <div className="w-full md:w-[30%] flex justify-center">
                      <div className="relative w-[140px] h-[180px] sm:w-[170px] sm:h-[210px]">
                        <Image
                          src={FOCUS_SECTIONS[activeFocus].imageSrc}
                          alt={FOCUS_SECTIONS[activeFocus].imageAlt}
                          fill
                          className="object-contain"
                          priority={false}
                        />
                      </div>
                    </div>

                    {/* Right text */}
                    <div className="w-full md:w-[70%] text-left text-[#00373E] space-y-4">
                      <h2
                        className={focusHeadingFont.className}
                        style={{
                          color: '#E26B20',
                          fontSize: '48px',
                          fontWeight: 600,
                          lineHeight: 'normal',
                          letterSpacing: '0.724px',
                          maxWidth: '341px',
                        }}
                      >
                        {FOCUS_SECTIONS[activeFocus].heading}
                      </h2>
                      <div
                        style={{
                          maxWidth: '744px',
                        }}
                      >
                        {FOCUS_SECTIONS[activeFocus].paragraphs.map((para) => (
                          <p
                            key={para}
                            className={focusBodyFont.className}
                            style={{
                              fontSize: '24px',
                              fontWeight: 500,
                              lineHeight: 'normal',
                              letterSpacing: '0.724px',
                              color: '#00373E',
                              marginBottom: '12px',
                            }}
                          >
                            {para}
                          </p>
                        ))}
                      </div>
                      <p
                        className={focusBoldBodyFont.className}
                        style={{
                          fontSize: '24px',
                          fontWeight: 700,
                          lineHeight: 'normal',
                          letterSpacing: '0.724px',
                          color: '#00373E',
                        }}
                      >
                        {FOCUS_SECTIONS[activeFocus].issues}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>

        {/* Assessment cards section */}
        <section className="w-full bg-[#F7F6F4] pb-16 sm:pb-20">
          <div className="mx-auto w-full max-w-[1225px] px-4 sm:px-6 lg:px-8 pt-10">
            <motion.div
              viewport={{ once: true, amount: 0.3 }}
              onViewportEnter={() => setHasAssessmentCardInView(true)}
              className="relative rounded-[63px] bg-white px-6 sm:px-10 lg:px-16 py-10 sm:py-12 shadow-[0_24px_60px_rgba(0,0,0,0.03)]"
            >
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
                  {ASSESSMENTS[activeAssessment].paragraphs.map((p) => {
                    const shouldStart =
                      activeAssessment === 'adhd'
                        ? hasAssessmentCardInView
                        : true;
                    return (
                      <TypingParagraph
                        key={`${activeAssessment}-${p}`}
                        text={p}
                        start={shouldStart}
                      />
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Global footer-style support CTA */}
        <HomeFinalCtaSection />
      </main>
    </>
  );
}

