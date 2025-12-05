 'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-semibold text-[#111827] mb-10">
          Meet the Team
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
          <div className="flex flex-1 items-center justify-center gap-6 md:gap-10">
            {visibleMembers.map((member, idx) => (
              <button
                key={`${member.name}-${idx}`}
                type="button"
                className="flex h-32 w-32 md:h-40 md:w-40 items-center justify-center rounded-full border-[10px] border-[#F47A24] bg-white shadow-sm"
                aria-label={member.name}
              />
            ))}
          </div>

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


