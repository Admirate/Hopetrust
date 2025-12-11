"use client";

import { useState } from "react";

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

export default function RectangleSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCard = cards[activeIndex];

  return (
    <section className="w-full bg-transparent py-12 sm:py-16">
      <div className="relative mx-auto h-[562px] w-full max-w-[1294px] overflow-hidden rounded-[54px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.06)]">
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
        <div className="relative z-10 h-full w-full px-6 py-10 sm:px-10 lg:px-16">
          {/* Section title centered at top */}
          <div className="absolute inset-x-0 top-6 flex justify-center">
            <h2 className="text-[26px] font-semibold text-[#00373E] sm:text-[32px]">
              How Your Journey Unfolds
            </h2>
          </div>

          <div className="flex h-full">
            {/* Left text - vertically centered, left aligned */}
            <div className="flex h-full max-w-[546px] flex-col justify-center space-y-6 text-left text-[#00373E] sm:space-y-7">
              <h2 className="text-[32px] font-semibold leading-[42px] sm:text-[36px]">
                {activeCard.title}
              </h2>
              <div className="space-y-2.5 text-[24px] font-semibold leading-[34px] sm:text-[24px]">
                {activeCard.lines.map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>

            {/* Right side: inline video on the far right, visually blended with the box */}
            <div className="flex flex-1 items-center justify-end">
              <div className="h-[286px] w-[214px] overflow-hidden rounded-[32px]">
                <video
                  src="/FINal.mp4"
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


