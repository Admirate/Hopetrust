"use client";

import type React from "react";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import { motion } from "motion/react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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

              <div className="space-y-6">
                {/* Email */}
                <p
                  className={`${headingFont.className} text-[16px] sm:text-[18px] lg:text-[20px] leading-[28px] lg:leading-[34px] tracking-[0.5px] font-bold text-[#00373E]`}
                >
                  Email:
                  <span
                    className={`${headingFont.className} ml-2 text-[#111827] text-[16px] sm:text-[18px] lg:text-[20px] leading-[28px] lg:leading-[34px] tracking-[0.5px] font-normal`}
                  >
                    frontoffice@hopetrustindia.com
                  </span>
                </p>

                {/* Phone */}
                <p
                  className={`${headingFont.className} text-[16px] sm:text-[18px] lg:text-[20px] leading-[28px] lg:leading-[34px] tracking-[0.5px] font-bold text-[#00373E]`}
                >
                  Phone:
                  <span
                    className={`${headingFont.className} ml-2 text-[#111827] text-[16px] sm:text-[18px] lg:text-[20px] leading-[28px] lg:leading-[34px] tracking-[0.5px] font-normal`}
                  >
                    +91 9000850001 / +91 90007 20003
                  </span>
                </p>

                {/* Address */}
                <p
                  className={`${headingFont.className} text-[16px] sm:text-[18px] lg:text-[20px] leading-[28px] lg:leading-[34px] tracking-[0.5px] font-bold text-[#00373E]`}
                >
                  Address:
                  <span
                    className={`${headingFont.className} ml-2 text-[#111827] text-[16px] sm:text-[18px] lg:text-[20px] leading-[28px] lg:leading-[34px] tracking-[0.5px] font-normal`}
                  >
                    C/o, UCCHVAS Rehabilitation Center, Plot no. 564-A-36-111,
                    Opp. Lotus Pond Road, MLA Colony, Banjara Hills,
                    <br /> Hyderabad – 500034
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <Image
                  src="/Asset 16.png"
                  alt="LinkedIn icon"
                  width={24}
                  height={24}
                />
                <Image
                  src="/Asset 17.png"
                  alt="Facebook icon"
                  width={24}
                  height={24}
                />
                <Image
                  src="/Asset 18.png"
                  alt="Instagram icon"
                  width={24}
                  height={24}
                />
                <Image
                  src="/Asset 19.png"
                  alt="WhatsApp icon"
                  width={24}
                  height={24}
                />
              </div>

              <p
                className={`${headingFont.className} pt-4 text-[16px] sm:text-[18px] lg:text-[20px] leading-[28px] lg:leading-[34px] tracking-[0.5px] font-normal text-[#00373E]`}
              >
                We typically respond within 12 hours.
              </p>
            </div>

            {/* Form card */}
            <div>
              <h3
                className={`${headingFont.className} mb-5 text-[20px] leading-[34px] tracking-[0.5px] font-bold text-[#00373E] text-center`}
              >
                Send us a message
              </h3>

              {/* Pink form box */}
              <div
                className={`${headingFont.className} rounded-[28px] bg-[#FFF5ED] px-4 py-5 sm:px-7 sm:py-7 text-left`}
              >
                <form className="space-y-5">
                  <div>
                    <label className="block text-[12px] sm:text-[14px] lg:text-[18px] leading-[14px] tracking-[0.5px] font-medium uppercase text-[#6A8181] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className={`${headingFont.className} w-full border-b border-[#D1D5DB] bg-transparent px-0 pb-1 text-[16px] sm:text-[18px] lg:text-[20px] leading-[28px] lg:leading-[34px] tracking-[0.5px] font-normal text-[#111827] focus:outline-none focus:border-[#00373E]`}
                      placeholder="Email"
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] sm:text-[14px] lg:text-[18px] leading-[14px] tracking-[0.5px] font-medium uppercase text-[#6A8181] mb-2">
                      Message
                    </label>
                    <textarea
                      rows={2}
                      className={`${headingFont.className} w-full border-b border-[#D1D5DB] bg-transparent px-0 pb-1 text-[16px] sm:text-[18px] lg:text-[20px] leading-[28px] lg:leading-[34px] tracking-[0.5px] font-normal text-[#111827] resize-none focus:outline-none focus:border-[#00373E]`}
                      placeholder="Message"
                    />
                  </div>

                  <div className="pt-2 flex justify-center sm:justify-start">
                    <button
                      type="submit"
                      className={`${headingFont.className} w-full sm:w-[320px] lg:w-[450px] h-[54px] px-[39px] py-[15px] flex items-center justify-center gap-[10px] rounded-full bg-[#00373E] text-white text-[14px] font-medium tracking-[0.5px] shadow-md hover:bg-[#024a53] transition-colors`}
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
