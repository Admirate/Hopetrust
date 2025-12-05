"use client";

import { useEffect, useState } from "react";

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
    title: "Book through WhatsApp or the website.",
    lines: [
      "Select the therapist you feel right with.",
      "Pick a date and a time that works for you.",
    ],
  },
  {
    title:
      "If online, a private link is shared through mail or WhatsApp.",
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

const CAROUSEL_INTERVAL_MS = 2000;

export default function RectangleSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % cards.length);
    }, CAROUSEL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const activeCard = cards[activeIndex];

  return (
    <section className="w-full bg-transparent py-12 sm:py-16">
      <div className="mx-auto w-full max-w-[1294px] h-[562px] rounded-[54px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.06)] overflow-hidden relative">
        {/* Background video */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/Sun shine.mp4"
          autoPlay
          muted
          playsInline
          loop
        >
          Your browser does not support the video tag.
        </video>

        {/* Overlay content */}
        <div className="relative z-10 h-full w-full px-6 sm:px-10 lg:px-16 py-10">
          {/* Section title centered at top */}
          <div className="absolute inset-x-0 top-6 flex justify-center">
            <h2 className="text-[26px] sm:text-[32px] font-semibold text-[#00373E]">
              How Your Journey Unfolds
            </h2>
          </div>

          <div className="flex h-full">
            {/* Left text carousel - vertically centered, left aligned */}
            <div className="flex h-full flex-col justify-center max-w-[546px] text-left text-[#00373E] space-y-6 sm:space-y-7">
              <h2 className="text-[32px] sm:text-[36px] font-semibold leading-[42px]">
                {activeCard.title}
              </h2>
              <div className="space-y-2.5 text-[24px] sm:text-[24px] leading-[34px] font-semibold">
                {activeCard.lines.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>

            {/* Right side: inline video on the far right, visually blended with the box */}
            <div className="flex flex-1 items-center justify-end">
              <div className="w-[214px] h-[286px] rounded-[32px] overflow-hidden">
                <video
                  src="/FINal.mp4"
                  className="h-full w-full object-cover transform scale-[1.08]"
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

          {/* Progress indicator - fixed at bottom center of the video/card */}
          <div className="pointer-events-auto absolute inset-x-0 bottom-6 flex justify-center gap-3">
            {cards.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
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


