`use client`;

import { useState } from "react";
import { Bricolage_Grotesque } from "next/font/google";

const headingFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const journeySteps = [
  {
    step: 1,
    // 1: Choose how you want to start
    lines: ["Choose how you want to start", "Online or in person."],
  },
  {
    step: 2,
    // 2: Booking details
    lines: [
      "Book through WhatsApp or the website.",
      "",
      "Select the therapist you feel right with.",
      "Pick a date and a time that works for you.",
    ],
  },
  {
    step: 3,
    // 3: Online flow
    lines: [
      "If online",
      "A private link is shared through mail or WhatsApp.",
      "Choose how you want to start",
      "",
      "Online or in person.",
    ],
  },
  {
    step: 4,
    // 4: Session timings
    lines: [
      "Session timings",
      "Individual therapy — 60 minutes",
      "Couples therapy — 90 minutes",
      "Psychiatry — 30 minutes",
      "Your progress continues after each session.",
      "One step at a time.",
    ],
  },
];

export default function HowJourneyUnfoldsSection() {
  const [stepIndex, setStepIndex] = useState(0);
  const current = journeySteps[stepIndex];

  const thumbWidth = 100 / journeySteps.length;

  return (
    <section className="relative bg-white py-16 md:py-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
        {/* Small looping video icon */}
        <div className="mb-6 md:mb-8">
          <div className="h-18 w-18 md:h-24 md:w-24 lg:h-28 lg:w-28 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            >
              <source src="/FINal.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Heading */}
        <h2
          className={`${headingFont.className} text-center`}
          style={{
            color: "#00373E",
            fontSize: "48px",
            lineHeight: "normal",
            fontWeight: 600,
            letterSpacing: "0.724px",
          }}
        >
          How Your Journey Unfolds
        </h2>

        {/* Body text */}
        <div className="mt-8 md:mt-10 w-full">
          <div className="mb-4 text-sm md:text-base font-medium tracking-[0.25em] uppercase text-[#ED7428]">
            Step {current.step}
          </div>
          <div className="relative left-1/2 w-screen -translate-x-1/2 bg-gradient-to-b from-white to-[#FFFAD4] py-8 md:py-10">
            <div className="mx-auto max-w-5xl px-4">
              <div
                className={`${headingFont.className} transition-opacity duration-300 text-[#00373E] text-balance`}
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  lineHeight: "normal",
                  letterSpacing: "0.724px",
                }}
              >
                {current.step === 4 ? (
                  <>
                    <p>Session timings</p>
                    <p>Individual therapy — 60 minutes</p>
                    <p>Couples therapy — 90 minutes</p>
                    <p>Psychiatry — 30 minutes</p>
                    <p>Your progress continues after each session.</p>
                    <p>One step at a time.</p>
                  </>
                ) : (
                  current.lines.map((line, i) => <p key={i}>{line}</p>)
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Capsule slider controls */}
        <div className="mt-8 flex w-full justify-center">
          <div className="relative flex w-full max-w-md items-center rounded-full bg-[#FFE7CF] px-1 py-1 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            {/* Moving thumb */}
            <div
              className="pointer-events-none absolute inset-y-1 rounded-full bg-[#ED7428] transition-transform duration-300"
              style={{
                width: `${thumbWidth}%`,
                transform: `translateX(${stepIndex * 100}%)`,
              }}
            />

            {/* Step buttons */}
            {journeySteps.map((step, index) => {
              const isActive = index === stepIndex;
              return (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => setStepIndex(index)}
                  className={`relative z-10 flex-1 px-3 py-2 text-xs sm:text-sm font-semibold transition-colors ${
                    isActive ? "text-white" : "text-[#ED7428]"
                  }`}
                >
                  Step {step.step}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

