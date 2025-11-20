"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";

const items = [
  { label: "Addiction Care", icon: "/asset1.png" },
  { label: "Medications", icon: "/asset2.png" },
  { label: "For Couples", icon: "/asset3.png" },
  { label: "Therapy", icon: "/asset4.png" },
  { label: "Queer Affirmative Care", icon: "/asset5.png" },
];

export default function WhatWeOfferSection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const distance = container.clientWidth * 0.6;
    const left = direction === "right" ? distance : -distance;

    container.scrollBy({ left, behavior: "smooth" });
  };

  return (
    <section className="flex justify-center px-4 py-16 md:py-20">
      <div
        className="relative w-full max-w-[1183px] bg-[#ED7428] text-white rounded-[50px] shadow-[8px_10px_19.9px_-5px_rgba(0,0,0,0.25)]"
      >
        {/* Content wrapper to approximate 616px height while staying responsive */}
        <div className="flex h-full flex-col px-8 py-8 md:px-12 md:py-10 lg:px-16 lg:py-12 gap-8 md:gap-10">
          {/* Header row */}
          <div className="flex items-start justify-start gap-4">
            <h2 className="font-mono text-3xl md:text-4xl font-semibold tracking-wide">
              What We Offer
            </h2>
          </div>

          {/* Top divider */}
          <div className="h-px w-full bg-white/80" />

          {/* Middle row: horizontally scrollable items */}
          <div className="flex flex-1 flex-col justify-center">
            <div
              ref={scrollRef}
              className="flex gap-10 md:gap-16 overflow-x-auto scroll-smooth no-scrollbar py-4 text-center"
            >
              {items.map((item) => (
                <div
                  key={item.label}
                  className="flex min-w-[180px] md:min-w-[220px] flex-col items-center space-y-4"
                >
                  <div className="relative h-20 w-20 md:h-24 md:w-24">
                    <Image
                      src={item.icon}
                      alt={item.label}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="font-serif text-lg md:text-xl text-[#FFFAD4]">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom divider + arrows */}
          <div className="flex items-center justify-between">
            <div className="h-px flex-1 bg-white/80" />
            <div className="ml-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                aria-label="Scroll left"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                aria-label="Scroll right"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 hover:bg-white/10 transition-colors"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

