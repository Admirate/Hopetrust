 'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';
import Header from '@/components/Header';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer'));

export default function AddictionPage() {
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
              src="https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/hopetrust%20assets/addictionservices_heroimage.png"
              alt="Lush green valley with flowing river"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/35" />

          {/* Centered content */}
          <motion.div
            style={{ y: textY }}
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
            <div className="w-full max-w-[1240px] min-h-[235px] rounded-[32px] sm:rounded-[59px] bg-white px-6 sm:px-12 lg:px-[100px] py-8 sm:py-10 flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
              <p className="text-center text-base sm:text-lg lg:text-xl font-medium leading-relaxed text-[#1a1a1a]">
                Hope Trust&apos;s outpatient/ online{' '}
                <span className="underline underline-offset-4 decoration-[#ED7428]">addiction treatment</span>{' '}
                programs offer you an individualised recovery plan. Clients receive psychological and social support with assessments and continuing care recommendations.
              </p>
            </div>

            {/* Image */}
            <div className="w-full rounded-[20px] sm:rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <Image
                src="https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/hopetrust%20assets/addictionervices_1.png"
                alt="Close-up representing addiction recovery"
                width={900}
                height={550}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* Addiction types section */}
        <section className="w-full bg-[#F7F6F4] px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24">
          <div className="mx-auto max-w-[1240px] flex flex-col gap-16 sm:gap-20">

            {/* Alcohol Addiction — icon left, text right */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14">
              <div className="w-[140px] sm:w-[180px] flex-shrink-0">
                <Image
                  src="https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/hopetrust%20assets/addictionservices_icon1.png"
                  alt="Alcohol addiction icon"
                  width={180}
                  height={180}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#00373E]">
                  Alcohol Addiction
                </h3>
                <p className="mt-4 text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-[#1a1a1a]">
                  Addiction is a disease, not a moral failing. Recovery and sobriety is not about will power. It can be achieved through medical assistance and structured treatment plans. Our team of trained and licensed professionals help you in choosing the best treatment approach and support you on your journey.
                </p>
                <p className="mt-4 text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-[#1a1a1a]">
                  We offer different treatment packages, designed to fit your needs. List different addiction packages with their costs.
                </p>
              </div>
            </div>

            {/* Nicotine and Drug Addiction — text left, icon right */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-14">
              <div className="w-[140px] sm:w-[180px] flex-shrink-0">
                <Image
                  src="https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/hopetrust%20assets/addictionservices_icon2.png"
                  alt="Nicotine and drug addiction icon"
                  width={180}
                  height={180}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#00373E]">
                  Nicotine and Drug Addiction
                </h3>
                <p className="mt-4 text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-[#1a1a1a]">
                  Addiction is a disease, not a moral failing. Recovery and sobriety is not about will power. It can be achieved through medical assistance and structured treatment plans. Our team of trained and licensed professionals help you in choosing the best treatment approach and support you on your journey.
                </p>
                <p className="mt-4 text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-[#1a1a1a]">
                  What we can help with - Smoking, Vaping, Marijuana, Hard Drugs
                </p>
              </div>
            </div>

            {/* Behavioural Addiction — icon left, text right */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14">
              <div className="w-[140px] sm:w-[180px] flex-shrink-0">
                <Image
                  src="https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/hopetrust%20assets/addictionservices_icon3.png"
                  alt="Behavioural addiction icon"
                  width={180}
                  height={180}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#00373E]">
                  Behavioural Addiction
                </h3>
                <p className="mt-4 text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-[#1a1a1a]">
                  The mind and body can get addicted to harmful yet gratifying behaviours as well. Behavioural addictions impact the mind, body and emotions. The therapist not only helps you understand the root causes but also psychoeducates and plans customised treatments to help you recover.
                </p>
                <p className="mt-4 text-sm sm:text-base lg:text-lg font-medium leading-relaxed text-[#1a1a1a]">
                  What we can help with - Gaming, Internet/Screen time, Gambling, Pornography, Sex Addiction
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Treatment Packages */}
        <section className="w-full bg-white py-16 sm:py-24 px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1240px] grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">

            {/* 30 Days Recovery Program */}
            <div className="rounded-[20px] border-l-4 border-[#ED7428] bg-[#FAFAFA] px-6 sm:px-8 py-8 sm:py-10">
              <h3 className="text-xl sm:text-2xl lg:text-[28px] font-semibold text-[#ED7428]">
                30 Days Recovery Program
              </h3>
              <h4 className="mt-5 text-lg sm:text-xl font-bold text-[#1a1a1a]">
                Who can benefit?
              </h4>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#1a1a1a]">
                The 30 Days Recovery Program focuses on helping your loved one overcome addiction. We have qualified therapists who can assist you online and offline. This program focuses on both, individual and family counselling. Post the completion of this program, you can also opt for our 30 days extended program.
              </p>
              <h4 className="mt-5 text-base sm:text-lg font-bold text-[#1a1a1a]">
                What do you get?
              </h4>
              <ul className="mt-2 space-y-1.5 text-sm sm:text-base leading-relaxed text-[#1a1a1a] list-disc pl-5">
                <li>2 weekly sessions by an addiction counsellor</li>
                <li>2 sessions with family</li>
                <li>Essential Step Work with a primary counsellor</li>
                <li>2 consultations with a psychiatrist.</li>
                <li>Relapse prevention strategies tailored for the individual</li>
                <li>Followed by after-care sessions which are chargeable</li>
              </ul>
              <p className="mt-4 text-xs sm:text-sm text-gray-500 leading-relaxed">
                Note: Any psychometric tests required will be charged extra. Medical tests are to be arranged by the client.
              </p>
              <p className="mt-4 text-lg sm:text-xl font-bold text-[#1a1a1a]">
                Package Cost: INR 26,500
              </p>
            </div>

            {/* 30 Days Extended OP / After Care Program */}
            <div className="rounded-[20px] border-l-4 border-[#ED7428] bg-[#FAFAFA] px-6 sm:px-8 py-8 sm:py-10">
              <h3 className="text-xl sm:text-2xl lg:text-[28px] font-semibold text-[#ED7428]">
                30 Days Extended OP/ After Care Program
              </h3>
              <h4 className="mt-5 text-lg sm:text-xl font-bold text-[#1a1a1a]">
                Who can benefit?
              </h4>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#1a1a1a]">
                The aftercare program focuses on relapse prevention and is ideal for patients who have recently completed an inpatient program at a rehab or after completing any of our packages.
              </p>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#1a1a1a]">
                This package offers increased after-care support to address ongoing issues arising in initial stages of recovery. It is proven to minimize risk of relapse and builds self confidence.
              </p>
              <ul className="mt-3 space-y-1.5 text-sm sm:text-base leading-relaxed text-[#1a1a1a] list-disc pl-5">
                <li>Support services are offered for one hour a day, once a week for 4 weeks/one session by psychiatrist</li>
                <li>Comprehensive evaluations, assessments, holistic treatment, and continued abstinence are some of the program&apos;s goals.</li>
                <li>Individualized treatment plan, comprehensive care and support by a team of qualified experts.</li>
              </ul>
              <p className="mt-4 text-xs sm:text-sm text-gray-500 leading-relaxed">
                Note: Any psychometric tests required will be charged extra. Medical tests are to be arranged by the client.
              </p>
              <p className="mt-4 text-lg sm:text-xl font-bold text-[#1a1a1a]">
                Package Cost: INR 18,000
              </p>
            </div>

            {/* Nicotine Cessation Program */}
            <div className="rounded-[20px] border-l-4 border-[#ED7428] bg-[#FAFAFA] px-6 sm:px-8 py-8 sm:py-10">
              <h3 className="text-xl sm:text-2xl lg:text-[28px] font-semibold text-[#ED7428]">
                Nicotine Cessation Program
              </h3>
              <h4 className="mt-5 text-lg sm:text-xl font-bold text-[#1a1a1a]">
                Kick the habit
              </h4>
              <ul className="mt-3 space-y-1.5 text-sm sm:text-base leading-relaxed text-[#1a1a1a] list-disc pl-5">
                <li>For cigarettes and all tobacco products</li>
                <li>Four sessions spread over 10 days with an addiction counsellor</li>
                <li>One consultation with a psychiatrist. NRT medications may be suggested</li>
                <li>Follow-up sessions are chargeable</li>
              </ul>
              <p className="mt-4 text-lg sm:text-xl font-bold text-[#1a1a1a]">
                Package Cost: INR 10,500
              </p>
            </div>

            {/* Gambling and Internet Cessation Program */}
            <div className="rounded-[20px] border-l-4 border-[#ED7428] bg-[#FAFAFA] px-6 sm:px-8 py-8 sm:py-10">
              <h3 className="text-xl sm:text-2xl lg:text-[28px] font-semibold text-[#ED7428]">
                Gambling and Internet Cessation Program
              </h3>
              <h4 className="mt-5 text-lg sm:text-xl font-bold text-[#1a1a1a]">
                What do you get?
              </h4>
              <ul className="mt-3 space-y-1.5 text-sm sm:text-base leading-relaxed text-[#1a1a1a] list-disc pl-5">
                <li>Eight sessions by an addiction counsellor</li>
                <li>Two sessions with family</li>
                <li>Essential Step Work with a primary counsellor</li>
                <li>1 or 2 consultations with a psychiatrist, if needed</li>
                <li>Relapse prevention strategies tailored for the individual</li>
                <li>Followed by after-care sessions.</li>
              </ul>
              <p className="mt-4 text-lg sm:text-xl font-bold text-[#1a1a1a]">
                Package Cost: INR 26,500
              </p>
            </div>

          </div>
        </section>
        {/* Alcoholics Anonymous banner */}
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
      </main>
      <Footer />
    </>
  );
}