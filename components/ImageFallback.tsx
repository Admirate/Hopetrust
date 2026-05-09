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
        className={`flex items-center justify-center bg-gradient-to-br from-[#F7F6F4] to-[#EAF3FF] ${fill ? 'absolute inset-0 h-full w-full' : ''} ${className || ''}`}
      >
        <span className="text-3xl text-gray-300 sm:text-4xl">📝</span>
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
