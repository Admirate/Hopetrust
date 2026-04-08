"use client";

import { Bricolage_Grotesque } from "next/font/google";

const headingFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600"],
});

const logos = [
  "https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/affiliations%20logo/image%2045.png",
  "https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/affiliations%20logo/image%2046.png",
  "https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/affiliations%20logo/image%2047.png",
  "https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/affiliations%20logo/image%2048.png",
  "https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/affiliations%20logo/image%2049.png",
  "https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/affiliations%20logo/image%2050.png",
  "https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/affiliations%20logo/image%2051.png",
  "https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/affiliations%20logo/image%2052.png",
  "https://mcrhgsyudgdgzfikbofr.supabase.co/storage/v1/object/public/affiliations%20logo/image%2053.png",
];

export default function AffiliationsSection() {
  return (
    <section className="w-full py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto w-full max-w-[1294px] min-h-[280px] sm:min-h-[350px] lg:h-[454px] rounded-[28px] sm:rounded-[40px] lg:rounded-[54px] bg-white py-10 sm:py-14 px-6 sm:px-10 shadow-[0_18px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col justify-center">
          <h2
            className={`${headingFont.className} mb-8 sm:mb-10 text-center text-2xl sm:text-3xl lg:text-4xl font-semibold italic text-[#00373E]`}
          >
            Affiliations
          </h2>

          {/* Auto-scrolling logo carousel */}
          <div className="relative overflow-hidden">
            <div className="flex animate-marquee-logos whitespace-nowrap">
              {/* First set */}
              {logos.map((src, i) => (
                <div
                  key={`a-${i}`}
                  className="mx-6 sm:mx-8 flex shrink-0 items-center justify-center"
                >
                  <img
                    src={src}
                    alt={`Affiliation logo ${i + 1}`}
                    className="h-14 sm:h-20 w-auto object-contain"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {logos.map((src, i) => (
                <div
                  key={`b-${i}`}
                  className="mx-6 sm:mx-8 flex shrink-0 items-center justify-center"
                >
                  <img
                    src={src}
                    alt={`Affiliation logo ${i + 1}`}
                    className="h-14 sm:h-20 w-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
