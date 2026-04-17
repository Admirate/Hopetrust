'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to an error reporting service in production
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F7F6F4] px-4 text-center">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#ED7428]">
        Something went wrong
      </p>
      <h1 className="mb-4 text-3xl font-bold text-[#00373E] sm:text-5xl">
        Unexpected Error
      </h1>
      <p className="mb-8 max-w-md text-base text-[#486364] sm:text-lg">
        We&apos;re sorry — something broke on our end. Please try again or
        return to the homepage.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-full bg-[#00373E] px-8 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#024a53] hover:-translate-y-0.5 hover:shadow-lg"
        >
          Try Again
        </button>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full border-2 border-[#00373E] px-8 py-3 text-sm font-semibold text-[#00373E] transition-all duration-200 hover:bg-[#00373E] hover:text-white"
        >
          Back to Home
        </a>
      </div>
    </main>
  );
}
