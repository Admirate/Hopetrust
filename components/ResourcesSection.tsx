"use client";

const resourceCards = [
  {
    titleLine1: "Articles &",
    titleLine2: "Guides",
    description:
      "Practical tips on stress management, mindfulness, and emotional resilience.",
    buttonColor: "bg-[#F9B93F] hover:bg-[#f8a90f]",
  },
  {
    titleLine1: "Meditation &",
    titleLine2: "Relaxation",
    description:
      "Audio sessions for guided meditation and deep breathing exercises.",
    buttonColor: "bg-[#1AB38F] hover:bg-[#159b7a]",
  },
  {
    titleLine1: "Webinars &",
    titleLine2: "Workshops",
    description:
      "Live and recorded sessions with mental health professionals.",
    buttonColor: "bg-[#F48AA8] hover:bg-[#f36a93]",
  },
];

export default function ResourcesSection() {
  return (
    <section className="w-full bg-[#F7F5EF] py-20">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 text-center relative">
        {/* Decorative donut shape behind heading (above and behind text) */}
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 -z-10">
          <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-[#FAD9A4]" />
          <div className="absolute inset-4 rounded-full bg-[#F7F5EF]" />
        </div>

        {/* Label */}
        <p className="mt-10 text-[11px] tracking-[0.2em] uppercase text-[#7A8F8E]">
          Explore & Learn
        </p>

        {/* Heading */}
        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold leading-snug text-[#00373E]">
          Resources for
          <br />
          Your Well-being
        </h2>

        {/* Subtext */}
        <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed text-[#476063]">
          Explore expert insights, self-care guides, and tools to support your
          mental health.
        </p>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {resourceCards.map((card) => (
            <div
              key={card.titleLine1}
              className="flex flex-col items-center justify-between rounded-[32px] bg-white px-8 py-10 shadow-[0_18px_40px_rgba(0,0,0,0.06)]"
            >
              <div className="space-y-3 text-[#00373E]">
                <h3 className="text-lg sm:text-xl font-semibold leading-snug">
                  {card.titleLine1}
                  <br />
                  {card.titleLine2}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-[#486364]">
                  {card.description}
                </p>
              </div>

              <button
                type="button"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-7 py-2 text-xs sm:text-sm font-semibold text-white shadow-md transition-colors ${card.buttonColor}`}
              >
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


