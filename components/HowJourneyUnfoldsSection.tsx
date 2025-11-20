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
      "Individual therapy — sixty minutes",
      "Couples therapy — ninety minutes",
      "Psychiatry — thirty minutes",
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
            <div className="h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 overflow-hidden">
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
            className={`${ibmMono.className} text-[40px] md:text-[52px] lg:text-[64px] font-semibold leading-normal text-[#ED7428]`}
          >
            How Your Journey Unfolds
          </h2>

          {/* Scroll-driven body text */}
          <div className="mt-8 md:mt-10">
            <div className="mb-4 text-sm md:text-base font-medium tracking-[0.25em] uppercase text-[#ED7428]">
              Step {current.step}
            </div>
            <div
              className={`${ibarra.className} text-[24px] md:text-[30px] lg:text-[36px] font-semibold leading-normal text-black transition-opacity duration-300`}
            >
              {current.lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

