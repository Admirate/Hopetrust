"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type Testimonial = {
  quote: string;
  author: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      '"Solus made it so easy to find the right therapist for me. The sessions have truly transformed my mindset, and I feel more in control of my emotions than ever before!"',
    author: "— Anna R., 32",
  },
  {
    quote:
      '"I was struggling with stress and anxiety, but the mindfulness programs have helped me regain balance. I finally feel like I\'m prioritizing my mental well-being."',
    author: "— Mark S., 41",
  },
  {
    quote:
      '"From the very first session, I felt heard and understood. The guidance I received has helped me navigate some of the most difficult moments of my life."',
    author: "— Priya K., 29",
  },
];

export default function ClientsSayingSection() {
  const [index, setIndex] = useState(0);
  const [typedHeading, setTypedHeading] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const { elementRef: headingRef, isVisible: headingVisible } = useScrollAnimation({
    threshold: 0.2,
  });
  const hasStartedTypingRef = useRef(false);

  // Typing animation for heading "What Our Clients\n\nAre Saying"
  useEffect(() => {
    // Start typing only when the heading section is in view, and only once
    if (!headingVisible || hasStartedTypingRef.current) return;

    hasStartedTypingRef.current = true;

    const fullText = "What Our Clients\nAre Saying";
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex += 1;
      setTypedHeading(fullText.slice(0, currentIndex));

      if (currentIndex >= fullText.length) {
        clearInterval(interval);
      }
    }, 60);

    return () => {
      clearInterval(interval);
    };
  }, [headingVisible]);

  // Blinking cursor for the typing effect
  useEffect(() => {
    if (!headingVisible) return;

    const blink = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(blink);
  }, [headingVisible]);

  const [firstLine, secondLine = ""] = typedHeading.split("\n");

  const visible = [
    testimonials[index],
    testimonials[(index + 1) % testimonials.length],
  ];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section className="w-full bg-white py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:items-stretch lg:gap-16">
        {/* Left column: heading (with typing animation) and description */}
        <div
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className="w-full max-w-md space-y-4 text-[#00373E]"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold leading-tight whitespace-pre-line min-h-[3.5rem]">
            {firstLine}
            <br />
            <span className="inline-flex items-center">
              {secondLine}
              {/* Typing cursor */}
              <span
                className="ml-1 inline-block w-[2px] h-[1.1em] bg-[#00373E] align-bottom"
                style={{ opacity: showCursor ? 1 : 0 }}
              />
            </span>
          </h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed">
            Positive experiences from users who have benefited from
            therapy or wellness programs.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={handlePrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-[#00373E] shadow-sm hover:bg-gray-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00373E] text-white shadow-md hover:bg-[#024a53] transition-colors"
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right column: testimonial cards */}
        <div className="flex w-full flex-1 items-stretch gap-6 overflow-hidden">
          {visible.map((item, i) => (
            <div
              key={`${item.author}-${i}`}
              className={`flex-1 rounded-[40px] p-8 sm:p-9 md:p-10 shadow-sm ${
                i === 0
                  ? "bg-[#FFE7CC] text-[#00373E]"
                  : "bg-[#00373E] text-white"
              }`}
            >
              <p className="text-sm sm:text-base leading-relaxed mb-6">
                {item.quote}
              </p>
              <p className="text-xs sm:text-sm font-semibold opacity-80">
                {item.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


