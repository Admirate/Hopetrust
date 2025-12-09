"use client";

import Image from "next/image";
import { useRef } from "react";
import { Roboto_Flex } from "next/font/google";
import VariableProximity from "./VariableProximity";

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  axes: ["opsz", "GRAD"],
});

export default function LargeRectangleSection() {
  const headingContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="w-full bg-[#F7F5EF] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-[1244px] h-[587px] rounded-[59px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.06)] overflow-hidden relative">
        {/* Background illustration */}
        <Image
          src="/Group 22.png"
          alt="Community background illustration"
          fill
          className="object-cover"
          priority={false}
        />

        {/* Overlay content */}
        <div className="relative z-10 flex h-full w-full flex-col lg:flex-row items-center px-6 sm:px-10 lg:px-16 gap-8 lg:gap-12">
          {/* Left text content */}
          <div className="w-full lg:w-1/2 text-left text-[#00373E] space-y-6">
            <p className="text-[11px] tracking-[0.22em] uppercase text-[#6A8181]">
              Community
            </p>
            <div ref={headingContainerRef} className="relative inline-block">
              <VariableProximity
                label={"You're Not Alone on This Journey"}
                fromFontVariationSettings="'GRAD' 0, 'opsz' 14"
                toFontVariationSettings="'GRAD' 100, 'opsz' 40"
                containerRef={headingContainerRef}
                radius={120}
                falloff="linear"
                className={`${robotoFlex.className} whitespace-pre-line text-4xl sm:text-[2.6rem] font-semibold leading-snug`}
              />
            </div>
            <p className="text-base sm:text-lg leading-relaxed text-[#486364] max-w-md">
              Connect with others, share experiences, and find encouragement in
              a safe, supportive space.
            </p>
            <button
              type="button"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#00373E] px-7 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-[#024a53] transition-colors"
            >
              Join The Community
            </button>
          </div>

          {/* Right side left empty so background image shows */}
          <div className="w-full lg:w-1/2" />
        </div>
      </div>
    </section>
  );
}



