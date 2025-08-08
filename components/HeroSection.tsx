"use client";

import { useRef } from 'react';

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 z-0 h-full w-full object-cover"
        preload="metadata"
        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 10'%3E%3Crect width='16' height='10' fill='%23000'/%3E%3C/svg%3E"
      >
        <source src="/final hero video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex h-full items-end justify-end p-8 md:p-12 lg:p-16">
        <div className="w-full max-w-md rounded-lg bg-black bg-opacity-75 p-8 text-white">
          <h1 className="space-y-2">
            <span className="block text-4xl font-light italic md:text-5xl">A place for</span>
            <span className="block text-5xl font-bold leading-tight text-orange-500 md:text-6xl lg:text-7xl">
              hope, healing,
              <br />
              and renewal.
            </span>
          </h1>
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-1.5 0a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0zm-4.5-2a1 1 0 100 2 1 1 0 000-2zm-5 0a1 1 0 100 2 1 1 0 000-2zm2.5 4.5c1.5 0 2.5-.75 2.5-.75s-1 1.75-2.5 1.75-2.5-1.75-2.5-1.75 1 .75 2.5 .75z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium text-base text-gray-300">A gentle reminder:</span>
            </div>
            <p className="text-lg text-gray-200">We're here if you need us — message us anytime</p>
          </div>
          <button className="mt-6 bg-white text-black px-6 py-2.5 rounded-full hover:bg-gray-200 transition-colors font-semibold text-base">
            Chat with us
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
