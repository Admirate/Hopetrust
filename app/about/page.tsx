'use client';

import React, { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { Bricolage_Grotesque, IBM_Plex_Sans } from 'next/font/google';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import ProximityText from '@/components/ProximityText';
import OurTeamSection from '@/components/OurTeamSection';

// Re-use CTA via code-split chunk
const HomeFinalCtaSection = dynamic(
  () => import('@/components/HomeFinalCtaSection')
);

const aboutHeadingFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600'],
});

const aboutStoryLabelFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400'],
});

const aboutStoryHeadingFont = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['600'],
});

const aboutStoryBodyFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500'],
});

const aboutStoryBodyRegularFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400'],
});

const aboutStoryBodyBoldFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700'],
});

type TypewriterPlainProps = {
  text: string;
  start: boolean;
  onDone?: () => void;
  typingSpeedMs?: number;
  showCursor?: boolean;
};

const TypewriterPlain = ({
  text,
  start,
  onDone,
  typingSpeedMs = 18,
  showCursor = false,
}: TypewriterPlainProps) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const onDoneRef = useRef<TypewriterPlainProps['onDone']>(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!start) return;
    setVisibleCount(0);

    let index = 0;
    const intervalId = window.setInterval(() => {
      index += 1;
      setVisibleCount(index);

      if (index >= text.length) {
        window.clearInterval(intervalId);
        onDoneRef.current?.();
      }
    }, typingSpeedMs);

    return () => window.clearInterval(intervalId);
  }, [start, text, typingSpeedMs]);

  const displayed = start ? text.slice(0, visibleCount) : '';

  return (
    <span className="relative inline-block align-baseline">
      <span className="invisible">{text}</span>
      <span className="absolute inset-0">
        {displayed}
        {showCursor ? (
          <span className="inline-block w-[1ch] animate-cursor-blink text-current">
            |
          </span>
        ) : null}
      </span>
    </span>
  );
};

type TypewriterSegment = {
  text: string;
  className: string;
};

type TypewriterSegmentsProps = {
  segments: TypewriterSegment[];
  start: boolean;
  onDone?: () => void;
  typingSpeedMs?: number;
  showCursor?: boolean;
};

const TypewriterSegments = ({
  segments,
  start,
  onDone,
  typingSpeedMs = 18,
  showCursor = false,
}: TypewriterSegmentsProps) => {
  const fullText = segments.map((segment) => segment.text).join('');

  const [visibleCount, setVisibleCount] = useState(0);
  const onDoneRef = useRef<TypewriterSegmentsProps['onDone']>(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (!start) return;
    setVisibleCount(0);

    let index = 0;
    const intervalId = window.setInterval(() => {
      index += 1;
      setVisibleCount(index);

      if (index >= fullText.length) {
        window.clearInterval(intervalId);
        onDoneRef.current?.();
      }
    }, typingSpeedMs);

    return () => window.clearInterval(intervalId);
  }, [fullText, start, typingSpeedMs]);

  const displayedCount = start ? visibleCount : 0;

  let remaining = displayedCount;

  return (
    <span className="relative inline-block align-baseline">
      <span className="invisible">
        {segments.map((segment, index) => (
          <span key={`${segment.text}-${index}`} className={segment.className}>
            {segment.text}
          </span>
        ))}
      </span>

      <span className="absolute inset-0">
        {segments.map((segment, index) => {
          const take = Math.max(Math.min(remaining, segment.text.length), 0);
          remaining -= take;
          return (
            <span key={`${segment.text}-${index}`} className={segment.className}>
              {segment.text.slice(0, take)}
            </span>
          );
        })}

        {showCursor ? (
          <span className="inline-block w-[1ch] animate-cursor-blink text-current">
            |
          </span>
        ) : null}
      </span>
    </span>
  );
};

export default function About() {
  const { elementRef: mediaTypingRef, isVisible: isMediaTypingVisible } =
    useScrollAnimation({
      threshold: 0.25,
      triggerOnce: true,
    });

  const [mediaTypingPhase, setMediaTypingPhase] = useState(0);

  useEffect(() => {
    if (!isMediaTypingVisible) return;
    setMediaTypingPhase(1);
  }, [isMediaTypingVisible]);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* First section */}
        <section className="relative min-h-screen w-full overflow-hidden">
          <div className="relative z-10 flex h-full w-full flex-col justify-between px-4 sm:px-8 lg:px-16 py-12 gap-10">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-center">
              {/* Left column: text content */}
              <motion.div
                className="w-full lg:w-1/2 text-[#00373E]"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
              >
                {/* ABOUT US heading */}
                <h1
                  className={`${aboutHeadingFont.className} mb-6 self-stretch text-[48px] font-semibold leading-normal tracking-[0.724px] text-black`}
                >
                  ABOUT US
                </h1>

                {/* Our Story label */}
                <p
                  className={`${aboutStoryLabelFont.className} mb-4 self-stretch text-[24px] font-normal uppercase leading-normal tracking-[0.724px] text-[#00373E]`}
                >
                  OUR STORY
                </p>

                {/* Main subheading */}
                <h2
                  className={`${aboutStoryHeadingFont.className} mb-5 w-full text-[28px] font-semibold leading-normal text-[#00373E] sm:w-[542px] sm:text-[36px]`}
                >
                  <ProximityText
                    text={'Hope Trust began in 2002\nwith a simple intention'}
                    radius={140}
                    liftPx={6}
                  />
                </h2>

                {/* Body copy */}
                <p
                  className={`${aboutStoryBodyFont.className} mt-2 self-stretch text-[24px] font-medium leading-normal tracking-[0.724px] text-[#00373E]`}
                >
                  To offer a calm and steady space for healing. People come to us
                  with different struggles.
                </p>
                <p
                  className={`${aboutStoryBodyFont.className} mt-4 self-stretch text-[24px] font-medium leading-normal tracking-[0.724px] text-[#00373E]`}
                >
                  We meet them with patience.
                  <br />
                  We support them with care.
                  <br />
                  One person at a time.
                </p>
              </motion.div>

              {/* Right column: image card sitting over the background circles */}
              <motion.div
                className="w-full lg:w-1/2 flex justify-center lg:justify-end"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              >
                <div className="relative w-full max-w-2xl lg:max-w-3xl aspect-square">
                  <Image
                    src="\about us new.png"
                    alt="Hope Trust therapist"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </motion.div>
            </div>

            {/* Bottom-centered Our Team strip removed */}
          </div>
        </section>

        <OurTeamSection />

        {/* Services cards + long illustration box */}
        <section className="w-full bg-white py-16">
          <div className="mx-auto w-full max-w-[1246px] px-4 sm:px-8 lg:px-0 flex flex-col gap-10">
            {/* Three colored cards (Frame 37 layout) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-11">
              {/* Left card */}
              <motion.div
                className="flex flex-col items-center justify-center gap-6 rounded-[45px] bg-[#F9E6D0] px-10 py-16 shadow-sm w-full sm:w-[386px] sm:h-[367px] text-center cursor-default"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <Image
                  src="/Asset 15.png"
                  alt="Listener icon"
                  width={96}
                  height={96}
                  className="object-contain"
                />
                <p
                  className={`${aboutStoryBodyFont.className} h-[89px] self-stretch text-center text-[24px] font-medium leading-normal tracking-[0.724px] text-[#00373E]`}
                >
                  People who listen
                  <br />
                  without judgment.
                </p>
              </motion.div>

              {/* Middle card */}
              <motion.div
                className="flex flex-col items-center justify-center gap-6 rounded-[45px] bg-[#00373E] px-10 py-16 shadow-sm w-full sm:w-[386px] sm:h-[367px] text-center cursor-default"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: 0.08,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              >
                <Image
                  src="/Asset 14.png"
                  alt="Guidance icon"
                  width={96}
                  height={96}
                  className="object-contain"
                />
                <p
                  className={`${aboutStoryBodyFont.className} h-[89px] self-stretch text-center text-[24px] font-medium leading-normal tracking-[0.724px] text-white`}
                >
                  People who guide
                  <br />
                  with clarity.
                </p>
              </motion.div>

              {/* Right card */}
              <motion.div
                className="flex flex-col items-center justify-center gap-6 rounded-[45px] bg-[#FFFBF6] px-10 py-16 shadow-sm ring-1 ring-black/5 w-full sm:w-[386px] sm:h-[367px] text-center cursor-default"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: 0.16,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              >
                <Image
                  src="/Asset 13.png"
                  alt="Process icon"
                  width={96}
                  height={96}
                  className="object-contain"
                />
                <p
                  className={`${aboutStoryBodyFont.className} h-[89px] self-stretch text-center text-[24px] font-medium leading-normal tracking-[0.724px] text-[#00373E]`}
                >
                  People who stay with
                  <br />
                  you through the process.
                </p>
              </motion.div>
            </div>

            {/* Long rounded rectangle with text + Frame 5 illustration */}
            <div className="mx-auto w-full max-w-[1240px]">
              <div className="relative w-full rounded-[32px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)] overflow-hidden">
                <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-0 pl-8 pr-0 sm:pl-10 sm:pr-0 lg:pl-14 lg:pr-0 py-10 lg:py-12">
                  {/* Left text column */}
                  <motion.div
                    className="w-full md:w-1/2 text-left"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
                  >
                    <h3
                      className={`${aboutHeadingFont.className} mb-4 w-full text-[40px] font-semibold leading-normal tracking-[0.5px] text-[#00373E] sm:w-[515px]`}
                    >
                      Wellness Coaching
                    </h3>
                    <p
                      className={`${aboutStoryBodyRegularFont.className} mb-4 w-full text-[20px] font-normal leading-[26px] tracking-[0.5px] text-[#00373E] sm:w-[617px]`}
                    >
                      Personalized guidance to help you build healthier habits,
                      manage stress, and achieve balance in all areas of your life.
                    </p>
                    <p
                      className={`${aboutStoryBodyRegularFont.className} mb-6 w-full text-[20px] font-normal leading-[26px] tracking-[0.5px] text-[#00373E] sm:w-[617px]`}
                    >
                      Our wellness coaches support you in creating sustainable
                      routines for mental, emotional, and physical well-being.
                    </p>
                    <button className="inline-flex items-center justify-center rounded-full bg-[#00373E] px-6 sm:px-8 py-2.5 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-[#024a53] transition-all duration-200 active:scale-95">
                      Learn More
                    </button>
                  </motion.div>

                  {/* Right illustration */}
                  <motion.div
                    className="w-full md:w-1/2 relative min-h-[200px] sm:min-h-[260px] lg:min-h-[300px]"
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.1,
                      ease: [0.22, 0.61, 0.36, 1],
                    }}
                  >
                    <Image
                      src="/Frame 5.png"
                      alt="Wellness coaching illustration"
                      fill
                      className="object-contain md:object-cover md:object-right"
                      priority={false}
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works section */}
        <section className="w-full bg-white py-20">
          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8 lg:px-0 flex flex-col gap-10">
            {/* Heading */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <h2
                className={`${aboutHeadingFont.className} mx-auto inline-block whitespace-nowrap text-center text-[48px] font-semibold leading-normal tracking-[0.724px] text-[#00373E]`}
              >
                How it Works
              </h2>
              <p
                className={`${aboutStoryBodyFont.className} mx-auto mt-3 h-[48px] w-full max-w-[306px] text-center text-[20px] font-medium leading-normal tracking-[0.724px] text-[#00373E]`}
              >
                Choose how you want to start Online or in person.
              </p>
            </motion.div>

            {/* Three step cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {/* Step 1 */}
              <motion.div
                className="flex flex-col items-center text-center justify-between gap-6 rounded-[24px] bg-[#FFEBD7] px-10 py-10 shadow-sm h-full cursor-default"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
              >
                <p
                  className={`${aboutStoryBodyFont.className} w-full max-w-[325px] text-center text-[24px] font-medium leading-normal tracking-[0.724px] text-[#00373E]`}
                >
                  Book through WhatsApp or the website.
                  <br />
                  Select the therapist you feel right with.
                </p>
                <Image
                  src="/Asset 12.png"
                  alt="Booking via WhatsApp or website"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </motion.div>

              {/* Step 2 */}
              <motion.div
                className="flex flex-col items-center text-center justify-between gap-6 rounded-[24px] bg-[#FFEBD7] px-10 py-10 shadow-sm h-full cursor-default"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: 0.08,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              >
                <p
                  className={`${aboutStoryBodyFont.className} w-full max-w-[325px] text-center text-[24px] font-medium leading-normal tracking-[0.724px] text-[#00373E]`}
                >
                  Pick a date and a time
                  <br />
                  that works for you.
                </p>
                <Image
                  src="/Asset 11.png"
                  alt="Pick a date and time"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </motion.div>

              {/* Step 3 */}
              <motion.div
                className="flex flex-col items-center text-center justify-between gap-6 rounded-[24px] bg-[#FFEBD7] px-10 py-10 shadow-sm h-full cursor-default"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: 0.16,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              >
                <p
                  className={`${aboutStoryBodyFont.className} w-full max-w-[325px] text-center text-[24px] font-medium leading-normal tracking-[0.724px] text-[#00373E]`}
                >
                  If online, a private link is shared
                  <br />
                  through mail or WhatsApp.
                  <br />
                  If in person, you arrive at the centre
                  <br />
                  for your session.
                </p>
                <Image
                  src="/Asset 10.png"
                  alt="Online or in-person session"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </motion.div>
            </div>

            {/* Bottom orange strip */}
            <div className="mx-auto w-full max-w-[1240px]">
              <motion.div
                className="rounded-[32px] bg-[#F06D00] text-white px-8 sm:px-14 py-8 text-center"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.6,
                  delay: 0.12,
                  ease: [0.22, 0.61, 0.36, 1],
                }}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mb-6 border-b border-white/40 pb-6">
                  <div>
                    <p className="text-2xl font-semibold">60 minutes</p>
                    <p className="mt-1 text-sm">Individual therapy</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">90 minutes</p>
                    <p className="mt-1 text-sm">Couples therapy</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">30 minutes</p>
                    <p className="mt-1 text-sm">Psychiatry</p>
                  </div>
                </div>
                <p className="text-sm">
                  Your progress continues after each session.
                  <br />
                  One step at a time.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Media and Gallery section */}
        <section className="w-full bg-white py-20">
          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8 lg:px-0 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Overlapping images on the left */}
            <motion.div
              className="relative w-full max-w-[520px] aspect-[4/3]"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
            >
              {/* Back image */}
              <div className="absolute inset-y-4 left-0 right-20 rounded-[32px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
                <Image
                  src="/therapy.png"
                  alt="Therapist with client"
                  fill
                  className="object-cover"
                  priority={false}
                />
              </div>

              {/* Front image */}
              <div className="absolute inset-y-0 left-16 right-0 rounded-[32px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                <Image
                  src="/Madam.png"
                  alt="Hope Trust team member"
                  fill
                  className="object-cover"
                  priority={false}
                />
              </div>
            </motion.div>

            {/* Text content on the right */}
            <motion.div
              className="w-full lg:w-1/2 text-left"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.22, 0.61, 0.36, 1],
              }}
              ref={mediaTypingRef as React.RefObject<HTMLDivElement>}
            >
              <h2
                className={`${aboutHeadingFont.className} mb-4 text-center text-[48px] font-semibold leading-normal tracking-[0.724px] text-black lg:text-left`}
              >
                Media and Gallery
              </h2>
              <p
                className={`${aboutStoryBodyFont.className} mb-4 text-[24px] font-medium leading-normal tracking-[0.724px] text-black`}
              >
                <TypewriterPlain
                  text="A quiet look into our space."
                  start={mediaTypingPhase >= 1}
                  showCursor={mediaTypingPhase === 1}
                  onDone={() => setMediaTypingPhase(2)}
                />
              </p>
              <p className="mb-4">
                <TypewriterSegments
                  start={mediaTypingPhase >= 2}
                  showCursor={mediaTypingPhase === 2}
                  onDone={() => setMediaTypingPhase(3)}
                  segments={[
                    {
                      text: 'Our work.',
                      className: `${aboutStoryBodyBoldFont.className} text-[24px] font-bold leading-normal tracking-[0.724px] text-[#ED7428]`,
                    },
                    {
                      text: ' ',
                      className: `${aboutStoryBodyBoldFont.className} text-[24px] font-bold leading-normal tracking-[0.724px] text-[#ED7428]`,
                    },
                    {
                      text: 'Our people.',
                      className: `${aboutStoryBodyBoldFont.className} text-[24px] font-bold leading-normal tracking-[0.724px] text-[#D7D7D7]`,
                    },
                  ]}
                />
              </p>
              <p
                className={`${aboutStoryBodyFont.className} text-[24px] font-medium leading-normal tracking-[0.724px] text-black`}
              >
                <TypewriterPlain
                  text="The moments that shape Hope Trust."
                  start={mediaTypingPhase >= 3}
                  showCursor={mediaTypingPhase === 3}
                  onDone={() => setMediaTypingPhase(4)}
                />
              </p>
            </motion.div>
          </div>
        </section>

        {/* Final CTA + footer-style links section (last section on page) */}
        <HomeFinalCtaSection />
      </main>
    </>
  );
}