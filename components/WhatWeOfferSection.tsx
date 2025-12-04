"use client";

import Image from "next/image";

const items = [
  { label: "Therapy", icon: "/asset4.png" },
  { label: "Addiction Care", icon: "/asset1.png" },
  { label: "Medications", icon: "/asset2.png" },
  { label: "For Couples", icon: "/asset3.png" },
  { label: "Queer Affirmative Care", icon: "/asset5.png" },
];

export default function WhatWeOfferSection() {
  return (
    <section className="w-full bg-[#F9E6D0] min-h-screen flex items-center">
      <div className="mx-auto flex min-h-[415px] w-full max-w-[1440px] flex-col items-center justify-center gap-6 px-4 sm:px-8 lg:px-[106px] py-12">
        <h2 className="fluid-heading-xl font-semibold text-[#004047] text-balance mb-4 md:mb-6">
          What We Offer
        </h2>

        <div className="grid w-full max-w-5xl grid-cols-2 gap-y-10 gap-x-8 md:grid-cols-3 lg:grid-cols-5 md:gap-x-14 md:gap-y-12">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-4 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="relative h-20 w-20 md:h-24 md:w-24">
                <Image
                  src={item.icon}
                  alt={item.label}
                  fill
                  className="object-contain opacity-100"
                />
              </div>
              <p className="bold-body text-[#00373E]">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
