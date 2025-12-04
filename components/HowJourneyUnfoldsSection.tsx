'use client';

import { useEffect, useRef, useState } from "react";
import { IBM_Plex_Mono, Ibarra_Real_Nova } from "next/font/google";

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["600"],
});

const ibarra = Ibarra_Real_Nova({
  subsets: ["latin"],
  weight: ["600"],
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
  const sectionRef = useRef<HTMLElement | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el || typeof window === "undefined") return;

      const viewportHeight = window.innerHeight || 1;
      const sectionTop = el.offsetTop;
      const scrollY = window.scrollY;

      // Total height we want to "pin" for all steps
      const totalHeight = journeySteps.length * viewportHeight;
      const sectionBottom = sectionTop + totalHeight;

      // Only react while we're within the section's scroll window
      if (scrollY < sectionTop) {
        setStepIndex(0);
        return;
      }
      if (scrollY >= sectionBottom) {
        setStepIndex(journeySteps.length - 1);
        return;
      }

      const scrolledInside = scrollY - sectionTop;
      const index = Math.min(
        journeySteps.length - 1,
        Math.floor(scrolledInside / viewportHeight + 0.0001)
      );

      setStepIndex(index);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const current = journeySteps[stepIndex];

  return (
    <section
      ref={sectionRef}
      style={{ height: `${journeySteps.length * 100}vh` }}
      className="relative bg-white"
    >
      <div className="sticky top-24 md:top-28 lg:top-32">
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
            className={`${ibmMono.className} fluid-heading-hero font-semibold text-[#ED7428] text-balance`}
          >
            How Your Journey Unfolds
          </h2>

          {/* Scroll-driven body text */}
          <div className="mt-8 md:mt-10">
            <div className="mb-4 text-sm md:text-base font-medium tracking-[0.25em] uppercase text-[#ED7428]">
              Step {current.step}
            </div>
            <div className="relative left-1/2 w-screen -translate-x-1/2 bg-gradient-to-b from-white to-[#FFFAD4] py-8 md:py-10">
              <div className="mx-auto max-w-5xl px-4">
                <div
                className={`${ibarra.className} fluid-body-xl font-semibold text-black transition-opacity duration-300 text-balance`}
                >
                  {current.step === 4 ? (
                    <>
                      <p>Session timings</p>
                      <p>
                        Individual therapy —{" "}
                        <span className="text-[#ED7428]">60</span>{" "}
                        <span className="text-[#FFDF00]">minutes</span>
                      </p>
                      <p>
                        Couples therapy —{" "}
                        <span className="text-[#ED7428]">90</span>{" "}
                        <span className="text-[#FFDF00]">minutes</span>
                      </p>
                      <p>
                        Psychiatry —{" "}
                        <span className="text-[#ED7428]">30</span>{" "}
                        <span className="text-[#FFDF00]">minutes</span>
                      </p>
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
        </div>
      </div>
    </section>
  );
}

