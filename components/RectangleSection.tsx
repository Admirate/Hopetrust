"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bricolage_Grotesque } from "next/font/google";
import { getAssetUrl } from '@/lib/assets';

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700"],
});

type JourneyCard = {
  title: string;
  lines: string[];
};

const cards: JourneyCard[] = [
  {
    title: "Choose how you want to start",
    lines: ["Online or in person."],
  },
  {
    title: "Book through whatsApp or the website.",
    lines: [
      "Select the therapist you feel right with.",
      "Pick a date and a time that works for you.",
    ],
  },
  {
    title:
      "If online, a private link is shared through mail or whatsApp.",
    lines: ["Choose how you want to start.", "Online or in person."],
  },
  {
    title: "Session timings",
    lines: [
      "Individual therapy — 60 minutes",
      "Couples therapy — 90 minutes",
      "Psychiatry — 30 minutes",
      "Your progress continues after each session.",
      "One step at a time.",
    ],
  },
];

export default function RectangleSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCard = cards[activeIndex];

  return (
    <section className="w-full bg-transparent py-12 sm:py-16">
      <div className="relative mx-4 sm:mx-6 lg:mx-auto h-[480px] sm:h-[500px] lg:h-[562px] w-auto lg:w-full max-w-[1294px] overflow-hidden rounded-[28px] sm:rounded-[40px] lg:rounded-[54px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.06)]">
        {/* Background video */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={getAssetUrl("Sun shine.mp4")}
          autoPlay
          muted
          playsInline
          loop
        >
          Your browser does not support the video tag.
        </video>

        {/* Overlay content */}
        <div className="relative z-10 h-full w-full px-6 py-10 sm:px-10 lg:px-16">
          {/* Section title centered at top */}
          <div className="absolute inset-x-0 top-6 flex justify-center">
            <h2
              className={`${bricolage.className} text-xl sm:text-[26px] lg:text-[32px] px-4 sm:px-6 font-bold text-[#00373E] text-center`}
            >
              How your journey unfolds
            </h2>
          </div>

          <div className="flex flex-row h-full mt-12 sm:mt-0">
            {/* Left text - vertically centered, left aligned */}
            <div className="flex h-full max-w-[60%] sm:max-w-[546px] flex-col justify-center space-y-4 sm:space-y-6 text-left text-[#00373E] lg:space-y-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="space-y-4 sm:space-y-7"
                >
                  <h2
                    className={`${bricolage.className} text-lg sm:text-[28px] lg:text-[36px] font-bold leading-snug sm:leading-[42px]`}
                  >
                    {activeCard.title}
                  </h2>
                  <div
                    className={`${bricolage.className} space-y-2 sm:space-y-2.5 text-lg sm:text-2xl lg:text-[32px] font-bold leading-normal tracking-[0.724px] text-[#00373E]`}
                  >
                    {activeCard.lines.map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right side: inline video - visible on all screens */}
            <div className="flex flex-1 items-center justify-end">
              <div className="h-[180px] w-[120px] sm:h-[200px] sm:w-[150px] lg:h-[286px] lg:w-[214px] overflow-hidden rounded-[20px] sm:rounded-[24px] lg:rounded-[32px]">
                <video
                  src={getAssetUrl("FINal.mp4")}
                  className="h-full w-full scale-[1.08] transform object-cover"
                  autoPlay
                  muted
                  playsInline
                  loop
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

          {/* Progress indicator - bottom center */}
          <div className="pointer-events-auto absolute inset-x-0 bottom-6 flex justify-center gap-3">
            {cards.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
                  index === activeIndex
                    ? "w-20 bg-[#F97316]"
                    : "w-14 bg-[#FFE3CF] hover:bg-[#FFD2B5]"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



