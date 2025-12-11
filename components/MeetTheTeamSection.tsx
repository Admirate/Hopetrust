"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Bricolage_Grotesque } from 'next/font/google';
import { MagicText } from './MagicText';

const headingFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600'],
});

const teamMembers = [
  { name: 'Team Member 1', role: 'Therapist' },
  { name: 'Team Member 2', role: 'Therapist' },
  { name: 'Team Member 3', role: 'Therapist' },
  { name: 'Team Member 4', role: 'Therapist' },
  { name: 'Team Member 5', role: 'Therapist' },
];

export default function MeetTheTeamSection() {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const visibleMembers = Array.from({ length: visibleCount }, (_, i) => {
    const index = (startIndex + i) % teamMembers.length;
    return teamMembers[index];
  });

  return (
    <section className="bg-[#FFEFE4] py-16 sm:py-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
        {/* Heading with magic text */}
        <h2
          className={`${headingFont.className} mb-10 text-center`}
          style={{
            color: '#000000',
            fontSize: '48px',
            lineHeight: 'normal',
            fontWeight: 600,
            letterSpacing: '0.724px',
          }}
        >
          <MagicText text="Meet the Team" />
        </h2>

        {/* Carousel row */}
        <div className="flex w-full items-center justify-center gap-6 md:gap-10">
          {/* Left arrow */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous team members"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#111827] hover:bg-black/5 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Circles */}
          <motion.div
            className="flex flex-1 items-center justify-center gap-6 md:gap-10"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
          >
            {visibleMembers.map((member, idx) => (
              <motion.button
                key={`${member.name}-${idx}`}
                type="button"
                className="flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-full border-[10px] border-[#F47A24] bg-white shadow-sm"
                aria-label={member.name}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  show: {
                    opacity: 1,
                    scale: 1,
                    transition: {
                      duration: 0.5,
                      ease: [0.22, 0.61, 0.36, 1],
                    },
                  },
                }}
              />
            ))}
          </motion.div>

          {/* Right arrow */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next team members"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#111827] hover:bg-black/5 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Body text */}
        <div className="mt-10 max-w-xl text-[13px] sm:text-sm leading-relaxed text-[#111827]">
          <p>The people who support your healing.</p>
          <p>Choose the person you connect with.</p>
          <p>Begin your journey with Hope.</p>
        </div>
      </div>
    </section>
  );
}


