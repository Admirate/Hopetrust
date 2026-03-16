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
      {/* Top accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#00373E] to-[#ED7428]" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Header row */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          {doctor.photo ? (
            <img
              src={doctor.photo}
              alt={doctor.name}
              className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-[#ED7428]/30 sm:h-20 sm:w-20"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00373E] to-[#025a66] text-lg font-bold text-white ring-2 ring-[#ED7428]/30 sm:h-20 sm:w-20 sm:text-xl">
              {initials}
            </div>
          )}

          {/* Name + tags */}
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold leading-tight text-[#00373E] sm:text-lg">
              {doctor.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-[#ED7428]">
              {doctor.qualification}
            </p>
            <span className="mt-1.5 inline-block rounded-full bg-[#00373E]/10 px-3 py-0.5 text-xs font-medium text-[#00373E]">
              {doctor.department}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 text-[13px] leading-relaxed text-gray-600 sm:text-sm">
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
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#00373E] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-[#025a66] hover:shadow-lg active:scale-[0.97]"
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
