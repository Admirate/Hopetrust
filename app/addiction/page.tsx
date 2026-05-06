 'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import Header from '@/components/Header';
import FadeInSection from '@/components/FadeInSection';
import { getAssetUrl } from '@/lib/assets';
import dynamic from 'next/dynamic';
import type { AddictionProgram } from '@/lib/programs';
import { fetchPrograms } from '@/lib/programs';
// PAYMENT DISABLED — uncomment when Razorpay is integrated
// import EnrollmentModal from '@/components/EnrollmentModal';

const Footer = dynamic(() => import('@/components/Footer'));

/** Hardcoded fallback — used if Supabase is unreachable */
const FALLBACK_PROGRAMS: Omit<AddictionProgram, 'id' | 'is_active' | 'created_at' | 'updated_at'>[] = [
  {
    title: '30 Days Recovery Program',
    subtitle: 'Who can benefit?',
    description: 'The 30 Days Recovery Program focuses on helping your loved one overcome addiction. We have qualified therapists who can assist you online and offline. This program focuses on both, individual and family counselling. Post the completion of this program, you can also opt for our 30 days extended program.',
    features: [
      '2 weekly sessions by an addiction counsellor',
      '2 sessions with family',
      'Essential Step Work with a primary counsellor',
      '2 consultations with a psychiatrist',
      'Relapse prevention strategies tailored for the individual',
      'Followed by after-care sessions, which are chargeable',
    ],
    note: 'Note: Any psychometric tests required will be charged extra. Medical tests are to be arranged by the client.',
    cost: 'INR 26,500',
    display_order: 1,
  },
  {
    title: '30 Days Extended OP/ After Care Program',
    subtitle: 'Who can benefit?',
    description: 'The aftercare program focuses on relapse prevention and is ideal for patients who have recently completed an inpatient program at a rehab or after completing any of our packages. This package offers increased after-care support to address ongoing issues arising in initial stages of recovery. It is proven to minimize risk of relapse and builds self-confidence.',
    features: [
      'Support services are offered for one hour a day, once a week for 4 weeks/one session by psychiatrist',
      'Comprehensive evaluations, assessments, holistic treatment, and continued abstinence are some of the program\'s goals',
      'Individualized treatment plan, comprehensive care and support by a team of qualified experts',
    ],
    note: 'Note: Any psychometric tests required will be charged extra. Medical tests are to be arranged by the client.',
    cost: 'INR 18,000',
    display_order: 2,
  },
  {
    title: 'Nicotine Cessation Program',
    subtitle: 'Kick the habit',
    description: '',
    features: [
      'For cigarettes and all tobacco products',
      'Four sessions spread over 10 days with an addiction counsellor',
      'One consultation with a psychiatrist. NRT medications may be suggested',
      'Follow-up sessions are chargeable',
    ],
    note: '',
    cost: 'INR 10,500',
    display_order: 3,
  },
  {
    title: 'Gambling and Internet Cessation Program',
    subtitle: 'What do you get?',
    description: '',
    features: [
      'Eight sessions by an addiction counsellor',
      'Two sessions with family',
      'Essential Step Work with a primary counsellor',
      '1 or 2 consultations with a psychiatrist, if needed',
      'Relapse prevention strategies tailored for the individual',
      'Followed by after-care sessions',
    ],
    note: '',
    cost: 'INR 26,500',
    display_order: 4,
  },
];

const fadeFrom = (direction: 'left' | 'right' | 'up', delay = 0) => ({
  initial: {
    opacity: 0,
    x: direction === 'left' ? -60 : direction === 'right' ? 60 : 0,
    y: direction === 'up' ? 40 : 0,
  },
  whileInView: { opacity: 1, x: 0, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: {
    duration: 0.7,
    ease: [0.22, 0.61, 0.36, 1] as const,
    delay,
  },
});

export default function AddictionPage() {
  const [programs, setPrograms] = useState<
    Omit<AddictionProgram, 'id' | 'is_active' | 'created_at' | 'updated_at'>[] | AddictionProgram[]
  >(FALLBACK_PROGRAMS);

  useEffect(() => {
    fetchPrograms()
      .then((data) => { if (data.length > 0) setPrograms(data); })
      .catch(() => { /* keep fallback */ });
  }, []);

  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero section with parallax background image */}
        <section
          ref={heroRef}
          className="relative h-screen w-full overflow-hidden"
        >
          {/* Background image with parallax */}
          <motion.div style={{ y: backgroundY }} className="absolute inset-0 h-[120%] w-full">
            <Image
              src={getAssetUrl('addictionservices_newimage_hero.png')}
              alt="Lush green valley with flowing river"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/65" />

          {/* Centered content */}
          <motion.div
            style={{ y: textY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1], delay: 0.2 }}
            className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center text-white"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-semibold tracking-[0.18em] uppercase">
              Specialised Addiction Services
            </h1>
          </motion.div>
        </section>

        {/* Outpatient / Online treatment intro */}
        <section className="w-full bg-[#F7F6F4] py-14 sm:py-20">
          <div className="mx-auto max-w-[1340px] px-4 sm:px-8 lg:px-12 flex flex-col items-center gap-10">
            {/* Text card */}
            <FadeInSection>
              <div className="w-full max-w-[1240px] min-h-[235px] rounded-[32px] sm:rounded-[59px] bg-white px-6 sm:px-12 lg:px-[100px] py-8 sm:py-10 flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                <p className="text-center text-base sm:text-lg lg:text-xl font-medium leading-relaxed text-[#1a1a1a]">
                  Hope Trust&apos;s outpatient/online{' '}
                  <span className="underline underline-offset-4 decoration-[#ED7428]">addiction treatment</span>{' '}
                  programs offer you an individualised recovery plan. Clients receive psychological and social support with assessments and continuing care recommendations.
                </p>
              </div>
            </FadeInSection>

            {/* Image */}
            <FadeInSection delay={150}>
              <div className="w-full rounded-[20px] sm:rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                <Image
                  src={getAssetUrl('addictionervices_1.png')}
                  alt="Close-up representing addiction recovery"
                  width={900}
                  height={550}
                  className="w-full h-auto object-cover"
                />
              </div>
            </FadeInSection>
          </div>
        </section>

        {/* Addiction types section */}
        <section className="w-full bg-[#F7F6F4] px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24">
          <div className="mx-auto max-w-[1240px] flex flex-col gap-16 sm:gap-20">

            {/* Alcohol Addiction — icon left, text right */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14">
              <motion.div {...fadeFrom('left')} className="w-[140px] sm:w-[180px] flex-shrink-0">
                <Image
                  src={getAssetUrl('addictionservices_icon1.png')}
                  alt="Alcohol addiction icon"
                  width={180}
                  height={180}
                  className="w-full h-auto object-contain"
                />
              </motion.div>
              <motion.div {...fadeFrom('right', 0.15)} className="flex-1">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#00373E]">
                  Alcohol Addiction
                </h3>
                <p className="mt-4 text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-[#1a1a1a]">
                  Addiction is a disease, not a moral failing. Recovery and sobriety is not about willpower. It can be achieved through medical assistance and structured treatment plans. Our team of trained and licensed professionals help you in choosing the best treatment approach and support you on your journey.
                </p>
                <p className="mt-4 text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-[#1a1a1a]">
                  We offer different treatment packages, designed to fit your needs. List different addiction packages with their costs.
                </p>
              </motion.div>
            </div>

            {/* Nicotine and Drug Addiction — text left, icon right */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-14">
              <motion.div {...fadeFrom('right')} className="w-[140px] sm:w-[180px] flex-shrink-0">
                <Image
                  src={getAssetUrl('addictionservices_icon2.png')}
                  alt="Nicotine and drug addiction icon"
                  width={180}
                  height={180}
                  className="w-full h-auto object-contain"
                />
              </motion.div>
              <motion.div {...fadeFrom('left', 0.15)} className="flex-1">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#00373E]">
                  Nicotine and Drug Addiction
                </h3>
                <p className="mt-4 text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-[#1a1a1a]">
                  Addiction is a disease, not a moral failing. Recovery and sobriety is not about willpower. It can be achieved through medical assistance and structured treatment plans. Our team of trained and licensed professionals help you in choosing the best treatment approach and support you on your journey.
                </p>
                <p className="mt-4 text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-[#1a1a1a]">
                  What we can help with - Smoking, Vaping, Marijuana, Hard Drugs
                </p>
              </motion.div>
            </div>

            {/* Behavioural Addiction — icon left, text right */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14">
              <motion.div {...fadeFrom('left')} className="w-[140px] sm:w-[180px] flex-shrink-0">
                <Image
                  src={getAssetUrl('addictionservices_icon3.png')}
                  alt="Behavioural addiction icon"
                  width={180}
                  height={180}
                  className="w-full h-auto object-contain"
                />
              </motion.div>
              <motion.div {...fadeFrom('right', 0.15)} className="flex-1">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#00373E]">
                  Behavioural Addiction
                </h3>
                <p className="mt-4 text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-[#1a1a1a]">
                  The mind and body can get addicted to harmful yet gratifying behaviours as well. Behavioural addictions impact the mind, body and emotions. The therapist not only helps you understand the root causes but also psychoeducates and plans customised treatments to help you recover.
                </p>
                <p className="mt-4 text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-[#1a1a1a]">
                  What we can help with - Gaming, Internet/Screen time, Gambling, Pornography, Sex Addiction
                </p>
              </motion.div>
            </div>

          </div>
        </section>

        {/* Treatment Packages */}
        <section className="w-full bg-white py-16 sm:py-24 px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1240px] grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {programs.map((program, idx) => (
              <FadeInSection key={'id' in program ? program.id : idx} delay={idx * 100}>
                <div className="rounded-[20px] border-l-4 border-[#ED7428] bg-[#FAFAFA] px-6 sm:px-8 py-8 sm:py-10">
                  <h3 className="text-xl sm:text-2xl lg:text-[28px] font-semibold text-[#ED7428]">
                    {program.title}
                  </h3>
                  {program.subtitle && (
                    <h4 className="mt-5 text-lg sm:text-xl font-bold text-[#1a1a1a]">
                      {program.subtitle}
                    </h4>
                  )}
                  {program.description && (
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#1a1a1a]">
                      {program.description}
                    </p>
                  )}
                  {program.features.length > 0 && (
                    <ul className="mt-3 space-y-1.5 text-sm sm:text-base leading-relaxed text-[#1a1a1a] list-disc pl-5">
                      {program.features.map((feature, fi) => (
                        <li key={fi}>{feature}</li>
                      ))}
                    </ul>
                  )}
                  {program.note && (
                    <p className="mt-4 text-xs sm:text-sm text-gray-500 leading-relaxed">
                      {program.note}
                    </p>
                  )}
                  <p className="mt-4 text-lg sm:text-xl font-bold text-[#1a1a1a]">
                    Package Cost: {program.cost}
                  </p>
                  <a
                    href={`mailto:frontoffice@hopetrustindia.com?subject=Enquiry about ${encodeURIComponent(program.title)}`}
                    className="mt-4 inline-block rounded-full bg-[#ED7428] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d4651f] sm:text-base"
                  >
                    Enquire Now
                  </a>
                  {/* PAYMENT DISABLED — uncomment when Razorpay is integrated
                  {'id' in program && program.id && (
                    <button
                      type="button"
                      onClick={() => setEnrollTarget({
                        programId: program.id as string,
                        programTitle: program.title,
                        priceDisplay: program.cost,
                      })}
                      className="mt-4 inline-block rounded-full bg-[#ED7428] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d4651f] sm:text-base"
                    >
                      Enroll now
                    </button>
                  )}
                  */}
                </div>
              </FadeInSection>
            ))}
          </div>
        </section>

        {/* Alcoholics Anonymous banner */}
        <FadeInSection>
          <section className="w-full">
            <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#E8788A] via-[#E8889A] to-[#F0A07A] px-6 sm:px-10 lg:px-16 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm sm:text-base font-medium text-white/90 text-center sm:text-left">
                Additional support is available through Alcoholics Anonymous. Explore their resources and meetings.
              </p>
              <a
                href="https://www.aa.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#ED7428] px-6 sm:px-8 py-2.5 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-[#d4651f] transition-all duration-200 active:scale-95 flex-shrink-0"
              >
                Learn More
              </a>
            </div>
          </section>
        </FadeInSection>
      </main>
      <Footer />
      {/* PAYMENT DISABLED — uncomment when Razorpay is integrated
      <EnrollmentModal
        open={enrollTarget !== null}
        onClose={() => setEnrollTarget(null)}
        programType="addiction"
        programId={enrollTarget?.programId ?? ''}
        programTitle={enrollTarget?.programTitle ?? ''}
        priceDisplay={enrollTarget?.priceDisplay}
      />
      */}
    </>
  );
}