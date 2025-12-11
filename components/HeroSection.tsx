"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Bricolage_Grotesque } from "next/font/google";

const heroFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const HeroSection = () => {
  const containerRef = useRef<HTMLElement | null>(null);

  // Track scroll progress while the hero is in view
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Background moves slightly slower than scroll (parallax)
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  // Foreground card has a subtle counter-movement
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Background gradient video with parallax */}
      <motion.video
        style={{ y: backgroundY }}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        preload="metadata"
      >
        <source src="/0_Pink_Red_1280x720.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </motion.video>

      {/* Soft overlay to improve text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/25" />

      {/* Centered rounded rectangle with inner hero video */}
      <div className="relative z-10 flex h-full w-full items-start justify-center px-4 sm:px-6 lg:px-10 pt-16 sm:pt-24 pb-10 fade-in-optimized">
        <motion.div
          style={{ y: cardY }}
          className="relative w-full max-w-[1200px] max-h-[calc(100vh-5rem)] aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]"
        >
          {/* Side handles (rounded rectangles) */}
          <div className="pointer-events-none absolute inset-y-10 -left-6 hidden sm:block">
            <div className="h-full w-8 rounded-full border-2 border-white/60" />
          </div>
          <div className="pointer-events-none absolute inset-y-10 -right-6 hidden sm:block">
            <div className="h-full w-8 rounded-full border-2 border-white/60" />
          </div>

          {/* Main rounded hero card */}
          <div className="relative h-full w-full overflow-hidden rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] border border-white/70 bg-black/60 backdrop-blur-md shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            {/* Inner hero video */}
            <div className="absolute inset-0">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
                preload="metadata"
              >
                <source src="/final hero video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-black/45" />
            </div>

            {/* Content overlay */}
            <div className="relative flex min-h-full flex-col items-center justify-center px-5 sm:px-10 lg:px-20 py-10 sm:py-14 gap-4 sm:gap-6 text-center text-white">
              <h1
                className={`${heroFont.className} font-semibold text-balance fade-in-optimized`}
                style={{
                  fontSize: "48px",
                  letterSpacing: "0.724px",
                  lineHeight: "normal",
                }}
              >
                A place for{" "}
                <span style={{ color: "#FFDF00" }}>hope</span>,<br />
                healing, and renewal.
              </h1>

              <p
                className={`${heroFont.className} text-balance fade-in-optimized`}
                style={{
                  color: "#FFFAD4",
                  fontSize: "24px",
                  fontWeight: 700,
                  letterSpacing: "0.724px",
                  lineHeight: "normal",
                  maxWidth: "338px",
                  textAlign: "center",
                }}
              >
                A gentle reminder: We&apos;re here if you need us — message us
                anytime
              </p>

              <button className="mt-4 inline-flex items-center justify-center rounded-full bg-[#00343A] px-8 sm:px-10 py-3 text-sm sm:text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[#02424a] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-[0.97] fade-in-optimized">
                Chat with us
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
