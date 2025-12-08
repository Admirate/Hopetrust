import Image from 'next/image';

export default function ContactSection() {
  return (
    <section className="w-full bg-[#F7F5EF] py-20">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 text-center">
        {/* Heading */}
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#6A8181] mb-3">
          Get in touch
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold leading-snug text-[#00373E]">
          We&apos;re Here to
          <br />
          Support You
        </h2>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#486364] max-w-2xl mx-auto">
          Whether you have questions, need help getting started, or want to learn
          more — reach out anytime.
        </p>
      </div>

      {/* Card */}
      <div className="mt-10 mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="w-full rounded-[32px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.06)] px-6 py-8 sm:px-10 sm:py-10 md:px-12 md:py-12">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-start">
            {/* Contact details */}
            <div className="text-left text-[#00373E] text-sm sm:text-base space-y-4">
              <h3 className="font-semibold text-base sm:text-lg mb-2">
                Contact Details:
              </h3>

              <div>
                <p className="font-semibold">Email:</p>
                <p className="mt-0.5 text-[#111827]">support@hopetrust.com</p>
              </div>

              <div>
                <p className="font-semibold">Phone:</p>
                <p className="mt-0.5 text-[#111827]">+1 (123) 456-7890</p>
              </div>

              <div>
                <p className="font-semibold">Address:</p>
                <p className="mt-0.5 text-[#111827]">
                  123 Wellness Way, Calm City, CA 90210
                </p>
              </div>

              <div className="flex items-center gap-4 pt-2 text-[#111827] text-base">
                <a
                  href="#"
                  aria-label="Visit our LinkedIn"
                  className="inline-flex items-center justify-center"
                >
                  <Image
                    src="/Asset 16.png"
                    alt="LinkedIn icon"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </a>
                <a
                  href="#"
                  aria-label="Visit our Facebook"
                  className="inline-flex items-center justify-center"
                >
                  <Image
                    src="/Asset 17.png"
                    alt="Facebook icon"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </a>
                <a
                  href="#"
                  aria-label="Visit our Instagram"
                  className="inline-flex items-center justify-center"
                >
                  <Image
                    src="/Asset 18.png"
                    alt="Instagram icon"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </a>
                <a
                  href="#"
                  aria-label="Contact us on WhatsApp"
                  className="inline-flex items-center justify-center"
                >
                  <Image
                    src="/Asset 19.png"
                    alt="WhatsApp icon"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </a>
              </div>

              <p className="pt-4 text-xs sm:text-[13px] text-[#6B7280]">
                We typically respond within 12 hours.
              </p>
            </div>

            {/* Form card */}
            <div className="rounded-[28px] bg-[#FFF5ED] px-5 py-6 sm:px-7 sm:py-7 text-left text-sm sm:text-base">
              <h3 className="mb-5 text-base sm:text-lg font-semibold text-[#00373E] text-center sm:text-left">
                Send Us a Message
              </h3>

              <form className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-[0.18em] text-[#6A8181] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border-b border-[#D1D5DB] bg-transparent px-0 pb-1 text-sm text-[#111827] focus:outline-none focus:border-[#00373E]"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.18em] text-[#6A8181] mb-2">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border-b border-[#D1D5DB] bg-transparent px-0 pb-1 text-sm text-[#111827] resize-none focus:outline-none focus:border-[#00373E]"
                    placeholder="Message"
                  />
                </div>

                <div className="pt-2 flex justify-center sm:justify-start">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-[#00373E] px-8 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#024a53] transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


