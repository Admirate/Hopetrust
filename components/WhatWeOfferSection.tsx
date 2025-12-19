'use client';

import type React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Bricolage_Grotesque } from "next/font/google";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const headingFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600"],
});

const items = [
  { label: "Therapy", icon: "/asset4.png" },
  { label: "Addiction Care", icon: "/asset1.png" },
  { label: "Medications", icon: "/asset2.png" },
  { label: "For Couples", icon: "/asset3.png" },
  { label: "Queer Affirmative Care", icon: "/asset5.png" },
];

export default function WhatWeOfferSection() {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.2,
  });

  return (
    <section className="w-full bg-[#F9E6D0] py-12 sm:py-16">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-center gap-6 px-4 sm:px-8 lg:px-[106px]">
        <h2
          className={`${headingFont.className} mb-4 text-center md:mb-6`}
          style={{
            color: "#00373E",
            fontSize: "48px",
            lineHeight: "72px",
            fontWeight: 600,
          }}
        >
          What We Offer
        </h2>

        <div
          ref={elementRef as React.RefObject<HTMLDivElement>}
          className="grid w-full max-w-5xl grid-cols-2 gap-y-10 gap-x-8 md:grid-cols-3 lg:grid-cols-5 md:gap-x-14 md:gap-y-12"
        >
          {items.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileHover={{ y: -8 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 0.61, 0.36, 1],
                delay: index * 0.12,
              }}
              className="group flex flex-col items-center gap-4 cursor-pointer"
            >
              <div className="relative h-20 w-20 md:h-24 md:w-24 transition-transform duration-200 group-hover:scale-110">
                <Image
                  src={item.icon}
                  alt={item.label}
                  fill
                  className="object-contain opacity-100"
                />
              </div>
              <p
                className={`bold-body text-[#00373E] group-hover:text-[#005c66] transition-colors duration-200 ${
                  item.label === "Queer Affirmative Care" ? "text-center" : ""
                }`}
              >
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

