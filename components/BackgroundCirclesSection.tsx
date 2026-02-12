"use client";

import type React from 'react';
import { Bricolage_Grotesque, Roboto_Flex } from 'next/font/google';
import TiltedCard from './TiltedCard';
import VariableProximity from './VariableProximity';
import { AuroraBackground } from './AuroraBackground';
import { useScrollAnimation, fadeInUp } from '@/hooks/useScrollAnimation';
import { useRef } from 'react';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700'],
});

const robotoFlex = Roboto_Flex({
  subsets: ['latin'],
  axes: ['opsz', 'GRAD'],
});

const BackgroundCirclesSection = () => {
  // Animate this section only when it scrolls into view
  const { elementRef: textRef, isVisible: textVisible } = useScrollAnimation({
    threshold: 0.25,
  });
  const { elementRef: cardRef, isVisible: cardVisible } = useScrollAnimation({
    threshold: 0.25,
  });

  const headingContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `
      radial-gradient(
        ellipse 600px 450px at -5% 105%,
        rgba(237, 116, 40, 1) 0%,
        rgba(237, 116, 40, 0.85) 20%,
        rgba(237, 116, 40, 0.6) 35%,
        rgba(237, 116, 40, 0.35) 48%,
        rgba(237, 116, 40, 0.15) 58%,
        rgba(237, 116, 40, 0.05) 65%,
        transparent 75%
      )
    `,
        }}
      />

      {/* Content area */}
      <div className="relative z-10 flex h-full items-start justify-center px-4 sm:px-8 lg:px-16 pt-28 pb-16">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
          {/* Left column: text + button */}
          <div
            ref={textRef as React.RefObject<HTMLDivElement>}
            className="w-full lg:w-1/2 text-left"
            style={fadeInUp(textVisible, 0)}
          >
            <div ref={headingContainerRef} className="relative inline-block">
              {/* Top small stats */}
              <div
                className={`${bricolage.className}`}
                style={{
                  width: "330px",
                  marginTop: "30px", // Top = 30px
                }}
              >
                <div
                  style={{
                    fontSize: "26.47px",
                    lineHeight: "35.59px",
                    fontWeight: 600,
                    letterSpacing: "0px",
                    color: "#ED7428",
                    height: "36px",
                  }}
                >
                  20+ years of experience
                </div>

                <div
                  style={{
                    fontSize: "26.47px",
                    lineHeight: "35.59px",
                    fontWeight: 600,
                    letterSpacing: "0px",
                    color: "#ED7428",
                    height: "36px",
                  }}
                >
                  15+ licensed experts
                </div>

                {/* underline */}
                <div
                  style={{
                    marginTop: "8px",
                    width: "275px",
                    height: "5px",
                    backgroundColor: "#ED7428",
                  }}
                />
              </div>

              <div style={{ marginTop: "24px" }}>
                <VariableProximity
                  label="We help you prioritise your mental health"
                  fromFontVariationSettings="'GRAD' 0, 'opsz' 14"
                  toFontVariationSettings="'GRAD' 100, 'opsz' 40"
                  containerRef={headingContainerRef}
                  radius={120}
                  falloff="linear"
                  className={`${bricolage.className} mt-4 font-semibold text-[#00373E] text-balance`}
                  style={{
                    fontSize: "48px",
                    lineHeight: "60px",
                    letterSpacing: "0px",
                    maxWidth: "483px",
                    flexShrink: 0,
                  }}
                />
              </div>
            </div>

            <div
              className={`${bricolage.className} mt-6 text-[#00373E]`}
              style={{
                fontSize: "24px",
                lineHeight: "36px",
                fontWeight: 700,
                maxWidth: "511px",
                flexShrink: 0,
              }}
            >
              Browse therapists, book a session, and start your healing journey
              with trusted professionals.
            </div>

            <button className="mt-10 inline-flex items-center justify-center rounded-full bg-[#00373E] px-8 sm:px-10 py-3 text-sm sm:text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#ea6a0e] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.97]">
              Find A Therapist
            </button>
          </div>

          {/* Right column: illustration on top of blue circle with tilted card effect */}
          <div
            ref={cardRef as React.RefObject<HTMLDivElement>}
            className="w-full lg:w-1/2 flex justify-center lg:justify-end"
            style={fadeInUp(cardVisible, 150)}
          >
            <div className="relative w-full max-w-[479px] aspect-[479/491] rounded-[52px] bg-[#F97316] shadow-[0_24px_60px_rgba(0,0,0,0.2)] overflow-hidden">
              <TiltedCard
                imageSrc="/2.jpg"
                altText="Illustration of a person with overlapping feelings"
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                showMobileWarning={false}
                showTooltip={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BackgroundCirclesSection;


