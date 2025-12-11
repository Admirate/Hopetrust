"use client";

import type React from "react";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Bricolage_Grotesque, Roboto_Flex } from "next/font/google";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";
import VariableProximity from "./VariableProximity";

const robotoFlex = Roboto_Flex({
  subsets: ["latin"],
  axes: ["opsz", "GRAD"],
});

const bodyFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400"],
});

export default function LargeRectangleSection() {
  const headingContainerRef = useRef<HTMLDivElement | null>(null);
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.2,
  });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="w-full bg-[#F7F5EF] py-16 sm:py-20">
      <motion.div
        ref={elementRef as React.RefObject<HTMLDivElement>}
        initial={{ opacity: 0, y: 32 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 0.61, 0.36, 1],
        }}
        className="mx-auto w-full max-w-[1244px] h-[587px] rounded-[59px] shadow-[0_24px_60px_rgba(0,0,0,0.06)] overflow-hidden relative"
      >
        {/* Background illustration */}
        <Image
          src="/Group 22.png"
          alt="Community background illustration"
          fill
          className="object-cover"
          priority={false}
        />

        {/* Color overlay that tints the whole card on hover */}
        <div
          className={cn(
            "absolute inset-0 bg-[#00373E] opacity-0 transition-opacity duration-500",
            isHovered && "opacity-100",
          )}
        />

        {/* Overlay content */}
        <div className="relative z-10 flex h-full w-full flex-col lg:flex-row items-center px-6 sm:px-10 lg:px-16 gap-8 lg:gap-12">
          {/* Left text content */}
          <div
            className={cn(
              "w-full lg:w-1/2 text-left space-y-6 transition-colors duration-500",
              isHovered ? "text-white" : "text-[#00373E]",
            )}
          >
            <p
              className={cn(
                "text-[11px] tracking-[0.22em] uppercase transition-colors duration-500",
                isHovered ? "text-[#E0F2F2]" : "text-[#6A8181]",
              )}
            >
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
            <p
              className={cn(
                bodyFont.className,
                "transition-colors duration-500",
                isHovered ? "text-[#E5F4F4]" : "text-[#00373E]",
              )}
              style={{
                fontSize: "22px",
                lineHeight: "34px",
                fontWeight: 400,
                letterSpacing: "0.5px",
                width: "476px",
                maxWidth: "100%",
              }}
            >
              Connect with others, share experiences, and find encouragement in
              a safe, supportive space.
            </p>
            <button
              type="button"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={cn(
                "mt-4 inline-flex items-center justify-center rounded-full px-7 py-2.5 text-xs sm:text-sm font-semibold shadow-md transition-colors duration-300",
                isHovered
                  ? "bg-white text-[#00373E]"
                  : "bg-[#00373E] text-white hover:bg-[#024a53]",
              )}
            >
              Join The Community
            </button>
          </div>

          {/* Right side left empty so background image shows */}
          <div className="w-full lg:w-1/2" />
        </div>
      </motion.div>
    </section>
  );
}



