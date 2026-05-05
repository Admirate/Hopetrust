"use client";

import { useRef, useEffect } from "react";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500"],
});

const TEXT = "A quiet place to pause.  A safe place to feel.  A gentle space to heal.  ";

export default function ScrollingTextBanner() {
  const repeated = Array(8).fill(TEXT).join("");
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const prevScrollRef = useRef(0);

  useEffect(() => {
    prevScrollRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = currentScroll - prevScrollRef.current;
      prevScrollRef.current = currentScroll;

      // Move text sideways based on scroll delta
      offsetRef.current -= delta * 0.5;

      if (trackRef.current) {
        // Get half-width for seamless wrap
        const halfWidth = trackRef.current.scrollWidth / 2;
        // Wrap offset to prevent going to infinity
        if (halfWidth > 0) {
          offsetRef.current = ((offsetRef.current % halfWidth) + halfWidth) % halfWidth - halfWidth;
        }
        trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full overflow-hidden py-10 sm:py-14">
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform"
      >
        <span
          className={`${bricolage.className} text-[22px] sm:text-[28px] md:text-[34px] lg:text-[42px] font-medium italic text-[#00373E] tracking-wide shrink-0`}
        >
          {repeated}
        </span>
        <span
          className={`${bricolage.className} text-[22px] sm:text-[28px] md:text-[34px] lg:text-[42px] font-medium italic text-[#00373E] tracking-wide shrink-0`}
        >
          {repeated}
        </span>
      </div>
    </section>
  );
}
