'use client';

import { useState } from 'react';
import { Bricolage_Grotesque } from 'next/font/google';
import type { Doctor } from '@/lib/doctors';

const cardFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function TherapistCard({ doctor }: { doctor: Doctor }) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = doctor.bio.length > 120;
  const displayBio =
    shouldTruncate && !expanded ? doctor.bio.slice(0, 120) + '...' : doctor.bio;

  const initials = doctor.name
    .replace(/^(Mrs?\.|Ms\.|Dr\.?)\s*/i, '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`${cardFont.className} group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
    >
      {/* Large square image area */}
      {doctor.photo ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      ) : (
        <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#00373E] via-[#025a66] to-[#00373E]">
          <span className="text-5xl font-bold text-white/90 sm:text-6xl">
            {initials}
          </span>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#002a30] to-transparent" />
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#ED7428]/10" />
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-[#ED7428]/10" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Name + qualification */}
        <h3 className="text-lg font-bold leading-tight text-[#00373E] sm:text-xl">
          {doctor.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-[#ED7428]">
          {doctor.qualification}
        </p>
        <span className="mt-2 inline-block w-fit rounded-full bg-[#00373E]/10 px-3 py-1 text-xs font-medium text-[#00373E]">
          {doctor.department}
        </span>

        {/* Bio */}
        <p className="mt-3 text-[13px] leading-relaxed text-gray-600 sm:text-sm">
          {displayBio}
          {shouldTruncate && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="ml-1 font-semibold text-[#ED7428] hover:underline"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <a
          href={doctor.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#00373E] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#025a66] hover:shadow-lg active:scale-[0.97]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-none stroke-current stroke-2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Book Session
        </a>
      </div>
    </div>
  );
}
