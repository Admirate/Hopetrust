'use client';

import { useState } from 'react';
import { IBM_Plex_Mono, Ibarra_Real_Nova } from 'next/font/google';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const headingFont = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['600'],
});

const bodyFont = Ibarra_Real_Nova({
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
    setStartIndex((prev) =>
      (prev - 1 + teamMembers.length) % teamMembers.length
    );
  };

  const visibleMembers = Array.from({ length: visibleCount }, (_, i) => {
    const index = (startIndex + i) % teamMembers.length;
    return teamMembers[index];
  });

  return (
    <section className="bg-[#FCEFE5] py-16 md:py-24 lg:py-28 min-h-screen flex items-center">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-4 text-center">
        {/* Heading */}
        <h2
          className={`${headingFont.className} fluid-heading-xl font-semibold text-[#000000] mb-12 text-balance`}
        >
          Meet the Team
        </h2>

        {/* Carousel row */}
        <div className="flex w-full items-center justify-center gap-6 md:gap-10">
          {/* Left arrow */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous team members"
            className="flex h-10 w-10 items-center justify-center rounded-full text-black hover:bg-black/5 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Circles */}
          <div className="flex flex-1 items-center justify-center gap-6 md:gap-10">
            {visibleMembers.map((member, idx) => (
              <div
                key={`${member.name}-${idx}`}
                className="flex h-40 w-40 items-center justify-center rounded-full border border-black/40 bg-white shadow-sm"
              >
                {/* Placeholder initials */}
                <span className="text-lg font-medium text-black">
                  {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next team members"
            className="flex h-10 w-10 items-center justify-center rounded-full text-black hover:bg-black/5 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Body text */}
        <div
          className={`${bodyFont.className} mt-12 fluid-body-xl font-semibold text-black max-w-3xl text-balance`}
        >
          <p>The people who support your healing.</p>
          <p>Choose the person you connect with.</p>
          <p>Begin your journey with Hope.</p>
        </div>
      </div>
    </section>
  );
}


