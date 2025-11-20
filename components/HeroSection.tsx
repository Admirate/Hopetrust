"use client";

import { useRef } from "react";
import { IBM_Plex_Mono } from "next/font/google";

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["600"],
});

const HeroSection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative min-h-[calc(100dvh-8rem)] w-full overflow-hidden">
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

      {/* Text overlay on left side */}
      <div className="relative z-10 h-full">
        <div className="flex h-full items-start justify-start px-6 sm:px-12 lg:px-24 pt-24 md:pt-32 lg:pt-40">
          <div
            className={`${ibmMono.className} max-w-lg space-y-8 text-left text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]`}
          >
            <p className="whitespace-pre-line text-[36px] leading-[47px]">
              {`A place for `}
              <span className="text-yellow-300">hope</span>
              {`,\nhealing, and renewal.`}
            </p>

            <div className="space-y-2">
              <p className="text-[32px] leading-[42px] text-[#FFFAD4]">
                A gentle reminder:
              </p>
              <p className="text-[32px] leading-[42px] text-[#FFFAD4]">
                We&apos;re here if you need us — message us anytime
              </p>
            </div>

            <button
              className="inline-flex h-[46px] w-[158px] items-center justify-center rounded-[7px] bg-[#FFFFFF] text-base sm:text-lg font-semibold text-black shadow-md hover:bg-gray-100 transition-colors"
            >
              Chat with us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
