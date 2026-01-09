"use client";

import Header from "@/components/Header";
import TherapistCard from "@/components/TherapistCard";
import dynamic from "next/dynamic";
import { Bricolage_Grotesque, IBM_Plex_Sans } from "next/font/google";

const HomeFinalCtaSection = dynamic(
  () => import("@/components/HomeFinalCtaSection")
);

const bookHeadingFont = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["600"],
});

const bookBodyMediumFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500"],
});

const bookAccentFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500"],
});

export default function Page() {
  return (
    <>
      <Header />

      <main className="min-h-screen pt-20">
        {/* Book Session Section */}
        <section className="min-h-screen bg-[#F6EFE8] w-full px-3 sm:px-4 md:px-6 lg:px-8 py-10">
          {/* Heading */}
          <h1
  className={`
    ${bookHeadingFont.className}
    mx-auto
    mb-8 sm:mb-10

    max-w-[568px]
    text-center

    text-[56px]
    leading-[83px]

    text-[#00373E]
  `}
>
  Book your{" "}
  <span className="relative inline-block">
    sessions
    <span className="absolute left-0 -bottom-2 h-[3px] w-full bg-[#F06D00]" />
  </span>
</h1>


          {/* Filters */}
          <div className="mb-10 w-full">
            <div
              className="
                grid grid-cols-1 gap-6
                lg:grid-cols-[auto_1fr]
                lg:items-center
              "
            >
              {/* Search */}
              <div className="flex justify-center lg:justify-start">
                <input
                  type="text"
                  placeholder="Search name"
                  className={`${bookBodyMediumFont.className}
                    w-full max-w-md lg:max-w-2xl xl:max-w-3xl
                    rounded-full
                    border border-gray-300
                    px-8 py-3.5
                    text-sm sm:text-base
                    text-center
                    outline-none
                    transition-all duration-300
                    hover:shadow-md
                    focus:shadow-lg
                    focus:scale-[1.01]
                    focus:border-[#00373E]
                  `}
                />
              </div>

              {/* Categories */}
              <div
                className={`flex flex-wrap justify-center lg:justify-end gap-6 text-base sm:text-lg text-[#F06D00] ${bookAccentFont.className}`}
              >
                {[
                  "Therapy",
                  "Psychiatry",
                  "Relationships",
                  "Family Therapy",
                ].map((item) => (
                  <span
                    key={item}
                    className="
                        cursor-pointer
                        relative
                        transition-all duration-300
                        hover:text-[#00373E]
                        hover:-translate-y-[1px]
                        after:absolute after:left-0 after:-bottom-1
                        after:h-[2px] after:w-0 after:bg-[#F06D00]
                        after:transition-all after:duration-300
                        hover:after:w-full
                      "
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            <TherapistCard />
            <TherapistCard />
            <TherapistCard />
            <TherapistCard />
            <TherapistCard />
            <TherapistCard />
          </div>
        </section>

        {/* Footer CTA */}
        <HomeFinalCtaSection />
      </main>
    </>
  );
}
