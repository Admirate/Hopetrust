'use client';

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Bricolage_Grotesque } from "next/font/google";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const bodyFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700"],
});

type Testimonial = {
  quote: string;
  author: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "I'm really glad I found Tina ma'am. Her somatic work and the way she asks thoughtful questions helped me understand myself deeply and release a lot of stored tension.",
    author: "",
  },
  {
    quote:
      "I was struggling with stress and anxiety, but the mindfulness programs on Solus have helped me regain balance. I finally feel like I'm prioritizing my mental well-being.",
    author: "— Mark S., 41",
  },
  {
    quote:
      "Solus made it so easy to find the right therapist for me. The sessions have truly transformed my mindset, and I feel more in control of my emotions than ever before!",
    author: "— Anna R., 32",
  },
  {
    quote:
      "Dr. Rajeshwari Luther's sessions are structured, insightful, and deeply empowering. She helped me understand my emotional patterns, strengths, and areas of growth with clarity and kindness.",
    author: "",
  },
  {
    quote:
      "Dr Rajeshwari created a safe, non-judgmental space that helped me gain new perspectives. Because of her, I feel more self-aware and confident.",
    author: "",
  },
  {
    quote:
      "I had tried other therapists before, but this was the most effective experience. Her approach helped me directly identify my patterns and make real changes with her excellent guidance.",
    author: "",
  },
  {
    quote:
      "I felt welcomed, understood, and supported from the moment I walked in. The team is professional, compassionate, and the environment is very calming and healing.",
    author: "",
  },
  {
    quote:
      "Hope Trust is one of the best deaddiction facilities in Hyderabad. They are highly professional and truly empathetic towards clients.",
    author: "",
  },
  {
    quote:
      "Professional and research-oriented support for complex issues. Highly recommended for anxiety and emotional management.",
    author: "",
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

    const fullText = "What our clients\nare saying";
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
    testimonials[index % testimonials.length],
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
          <h2
            className={`${bodyFont.className} text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight whitespace-pre-line min-h-[3rem] sm:min-h-[3.5rem]`}
          >
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
          <p
            className={`${bodyFont.className} mt-3 text-base sm:text-lg lg:text-xl leading-7 sm:leading-8 max-w-sm`}
          >
            Positive experiences from users who have benefited from therapy or
            wellness programs.
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

        {/* Right column: two testimonial cards */}
        <div className="flex w-full flex-1 flex-col sm:flex-row items-stretch gap-4 sm:gap-6">
          {visible.map((item, i) => {
            const bgStyle = i === 0
              ? "bg-[#FFE7CC] text-[#00373E]"
              : "bg-[#00373E] text-white";
            return (
              <div
                key={i}
                className={`flex flex-1 flex-col justify-between rounded-[32px] sm:rounded-[60px] p-6 sm:pt-16 sm:pl-16 sm:pr-8 sm:pb-8 shadow-sm h-[240px] sm:h-[393px] overflow-hidden ${bgStyle}`}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${index}-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col justify-between h-full"
                  >
                    <p
                      className={`${bodyFont.className} mb-6 text-sm sm:text-base leading-relaxed sm:leading-7 font-normal`}
                    >
                      {item.quote}
                    </p>
                    {item.author && (
                      <p className="text-xs sm:text-sm font-semibold opacity-80">
                        {item.author}
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


