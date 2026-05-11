'use client';

import { useState } from 'react';

interface ImageFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
}

export default function ImageFallback({
  src,
  alt,
  fill,
  className,
}: ImageFallbackProps) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#00373E] to-[#005A5E] ${fill ? 'absolute inset-0 h-full w-full' : ''} ${className || ''}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-white/40 sm:h-10 sm:w-10"
        >
          <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
          <path d="M12 12v9" />
          <path d="m8 17 4 4 4-4" />
        </svg>
        <span className="text-xs font-medium tracking-wide text-white/30 sm:text-sm">
          Hope Trust
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${fill ? 'absolute inset-0 h-full w-full object-cover' : ''} ${className || ''}`}
      onError={() => setError(true)}
    />
  );
}
