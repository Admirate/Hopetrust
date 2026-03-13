"use client";

import type React from "react";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import { motion } from "motion/react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { getAssetUrl } from '@/lib/assets';

const headingFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "400"],
});

export default function ContactSection() {
  const { elementRef: headerRef, isVisible: headerVisible } =
    useScrollAnimation({
      threshold: 0.2,
    });
  const { elementRef: cardRef, isVisible: cardVisible } = useScrollAnimation({
    threshold: 0.2,
  });

  return (
    <section className="w-full bg-[#F7F5EF] py-20">
      <motion.div
        ref={headerRef as React.RefObject<HTMLDivElement>}
        initial={{ opacity: 0, y: 24 }}
        animate={headerVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 0.61, 0.36, 1],
        }}
        className="mx-auto w-full max-w-5xl px-4 sm:px-6 text-center"
      >
        <p
          className={`${headingFont.className} mb-3 text-center uppercase text-[14px] leading-[14px] tracking-[0.5px] font-medium text-[#00373E]`}
        >
          Get in touch
        </p>

        <h2
          className={`${headingFont.className} text-center text-[32px] leading-[38px] sm:text-[40px] sm:leading-[46px] lg:text-[52px] lg:leading-[52px] tracking-[0.5px] font-bold text-[#00373E] flex flex-col items-center justify-center`}
        >
          We&apos;re here to
          <br />
          support you
        </h2>

        <p
          className={`${headingFont.className} mt-4 mx-auto max-w-[90%] sm:max-w-2xl text-center text-[18px] sm:text-[20px] lg:text-[22px] leading-[34px] tracking-[0.5px] font-normal text-[#486364]`}
        >
          Whether you have questions, need help getting started, or want to
          learn more — reach out anytime.
        </p>
      </motion.div>

      <motion.div
        ref={cardRef as React.RefObject<HTMLDivElement>}
        initial={{ opacity: 0, y: 32 }}
        animate={cardVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 0.61, 0.36, 1],
          delay: 0.15,
        }}
        className="mt-10 mx-auto w-full max-w-5xl px-4 sm:px-6"
      >
        <div className="w-full rounded-[32px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.06)] px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
            {/* Contact details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-base sm:text-lg mb-2">
                Contact Details:
              </h3>

              <div className="space-y-4 sm:space-y-5 lg:space-y-6 text-sm sm:text-base lg:text-lg leading-6 sm:leading-7 lg:leading-8 tracking-wide">
                {/* Email */}
                <p
                  className={`${headingFont.className} font-bold text-[#00373E]`}
                >
                  Email:
                  <span className="ml-2 font-normal text-[#111827] break-all">
                    frontoffice@hopetrustindia.com
                  </span>
                </p>

                {/* Phone */}
                <p
                  className={`${headingFont.className} font-bold text-[#00373E]`}
                >
                  Phone:
                  <span className="ml-2 font-normal text-[#111827]">
                    +91 9000850001 / +91 9000720003
                  </span>
                </p>

                {/* Address */}
                <p
                  className={`${headingFont.className} font-bold text-[#00373E]`}
                >
                  Address:
                  <span className="font-normal text-[#111827] block">
                    C/o, UCCHVAS Rehabilitation Center,
                    <br />
                    Plot no. 564-A-36-111,
                    <br />
                    Opp. Lotus Pond Road, MLA Colony,
                    <br />
                    Banjara Hills, Hyderabad – 500034
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Image
                  src={getAssetUrl("Asset 16.png")}
                  alt="LinkedIn icon"
                  width={24}
                  height={24}
                />
                <Image
                  src={getAssetUrl("Asset 17.png")}
                  alt="Facebook icon"
                  width={24}
                  height={24}
                />
                <Image
                  src={getAssetUrl("Asset 18.png")}
                  alt="Instagram icon"
                  width={24}
                  height={24}
                />
                <Image
                  src={getAssetUrl("Asset 19.png")}
                  alt="WhatsApp icon"
                  width={24}
                  height={24}
                />
              </div>

              <p
                className={`${headingFont.className} pt-3 sm:pt-4 text-sm sm:text-base lg:text-lg leading-6 sm:leading-7 lg:leading-8 tracking-wide text-[#00373E]`}
              >
                We typically respond within 12 hours.
              </p>
            </div>

            {/* Form card */}
            <div className="px-3 sm:px-0">
              <h3
                className={`${headingFont.className} mb-4 sm:mb-5 text-lg sm:text-xl lg:text-2xl font-bold text-[#00373E] text-center`}
              >
                Send us a message
              </h3>

              {/* Form Box */}
              <div
                className={`${headingFont.className} rounded-2xl sm:rounded-[28px] bg-[#FFF5ED] px-4 py-5 sm:px-7 sm:py-7`}
              >
                <form className="space-y-4 sm:space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-xs sm:text-sm lg:text-base font-medium uppercase text-[#6A8181] mb-2">
                      Email
                    </label>

                    <input
                      type="email"
                      className="w-full border-b border-[#D1D5DB] bg-transparent pb-2 text-sm sm:text-base lg:text-lg text-[#111827] focus:outline-none focus:border-[#00373E]"
                      placeholder="Email"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs sm:text-sm lg:text-base font-medium uppercase text-[#6A8181] mb-2">
                      Message
                    </label>

                    <textarea
                      rows={3}
                      className="w-full border-b border-[#D1D5DB] bg-transparent pb-2 text-sm sm:text-base lg:text-lg text-[#111827] resize-none focus:outline-none focus:border-[#00373E]"
                      placeholder="Message"
                    />
                  </div>

                  {/* Button */}
                  <div className="pt-2 flex justify-center sm:justify-start">
                    <button
                      type="submit"
                      className="w-full sm:w-auto min-h-[48px] px-6 sm:px-10 py-3 rounded-full bg-[#00373E] text-white text-sm sm:text-base font-medium tracking-wide shadow-md hover:bg-[#024a53] transition-colors"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
