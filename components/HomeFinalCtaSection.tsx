"use client";

import type React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Bricolage_Grotesque } from 'next/font/google';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getAssetUrl } from '@/lib/assets';
import NewsletterForm from './NewsletterForm';

const ctaFont = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['700'],
});

export default function HomeFinalCtaSection() {
  const { elementRef: leftRef, isVisible: leftVisible } = useScrollAnimation({
    threshold: 0.2,
  });
  const { elementRef: rightRef, isVisible: rightVisible } = useScrollAnimation({
    threshold: 0.2,
  });

  return (
    <section className="w-full bg-white pt-10 sm:pt-14 pb-20">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8 lg:px-0 flex flex-col lg:flex-row gap-10">
        {/* Left links card */}
        <motion.div
          ref={leftRef as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, x: -40 }}
          animate={leftVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 0.61, 0.36, 1],
          }}
          className="w-full lg:w-1/2 flex justify-start"
        >
          <div className="w-full lg:w-[570px] min-h-[266px] sm:min-h-[366px] lg:min-h-[466px] rounded-[28px] sm:rounded-[40px] lg:rounded-[50px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.06)] px-6 sm:px-10 lg:px-12 py-6 sm:py-8 lg:py-10 flex flex-col gap-6 sm:gap-8">
            <div>
              <Image
                src={getAssetUrl("logo1.png")}
                alt="Hope Trust logo"
                width={64}
                height={64}
                className="object-contain"
                style={{ width: '64px', height: '64px' }}
              />
            </div>
            <div
              className={`${ctaFont.className} grid grid-cols-2 sm:grid-cols-3 gap-y-3 sm:gap-y-0 gap-x-6 sm:gap-x-12 text-[#00373E] text-sm sm:text-base lg:text-[20px] leading-relaxed sm:leading-[34px] tracking-wide font-normal`}
            >
              <div className="space-y-3">
                <p>About</p>
                <p>Services</p>
                <p>Therapists</p>
                <p>Resources</p>
                <p>Contact</p>
              </div>

              <div className="space-y-3">
                <p>Instagram</p>
                <p>Facebook</p>
                <p>LinkedIn</p>
              </div>

              <div className="space-y-3">
                <p>Terms Of Use</p>
                <p>Privacy Policy</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className={`${ctaFont.className} text-sm font-semibold text-[#00373E]`}>
                Subscribe to our newsletter
              </p>
              <NewsletterForm variant="inline" />
            </div>
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} HopeTrust. All Rights Reserved.
            </p>
          </div>
        </motion.div>

        {/* Right orange CTA card */}
        <motion.div
          ref={rightRef as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, x: 40 }}
          animate={rightVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 0.61, 0.36, 1],
            delay: 0.15,
          }}
          className="w-full lg:w-1/2"
        >
          <div className="relative w-full min-h-[260px] sm:min-h-[320px] lg:min-h-[466px] rounded-[28px] sm:rounded-[40px] lg:rounded-[50px] bg-[#ED742B] text-white px-6 sm:px-10 lg:px-12 py-8 sm:py-12 overflow-hidden flex items-center">
            {/* Text content */}
            <div className="relative z-10 max-w-md space-y-3 sm:space-y-4">
              <h2
                className={`${ctaFont.className} leading-snug text-center sm:text-left text-3xl sm:text-4xl lg:text-[48px] font-bold tracking-wide`}
              >
                Find
                <br />
                support,
                <br />
                guidance,
                <br />
                and balance.
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-8 sm:px-10 py-3 text-sm sm:text-base font-semibold text-[#00373E] shadow-md hover:bg-[#FFF5EC] transition-colors">
                  Find Support Now
                </button>
              </div>
            </div>

            {/* Illustration on the right */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2">
              <Image
                src={getAssetUrl("illustration_7.png")}
                alt="Decorative flowers illustration"
                fill
                className="object-contain object-right"
                priority={false}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


