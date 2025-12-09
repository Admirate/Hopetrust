import Header from '@/components/Header';
import Image from 'next/image';
import FadeInSection from '@/components/FadeInSection';

export default function About() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        {/* First section with BACKGROUND CIRCLES.png as background */}
        <FadeInSection>
          <section className="relative min-h-screen w-full overflow-hidden">
          <Image
            src="/BACKGROUND CIRCLES.png"
            alt="Decorative background circles"
            fill
            className="object-cover"
            priority={false}
          />

          <div className="relative z-10 flex h-full w-full flex-col justify-between px-4 sm:px-8 lg:px-16 py-12 gap-10">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-center">
              {/* Left column: text content */}
              <div className="w-full lg:w-1/2 text-[#00373E]">
                {/* ABOUT US heading */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-wide mb-6">
                  ABOUT US
                </h1>

                {/* Our Story label */}
                <p className="text-xs sm:text-sm tracking-[0.18em] uppercase mb-4">
                  OUR STORY
                </p>

                {/* Main subheading */}
                <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-semibold leading-snug mb-5 max-w-xl">
                  Hope Trust began in 2002
                  <br />
                  with a simple intention
                </h2>

                {/* Body copy */}
                <p className="mt-2 text-sm sm:text-base leading-relaxed max-w-xl">
                  To offer a calm and steady space for healing. People come to us
                  with different struggles.
                </p>
                <p className="mt-4 text-sm sm:text-base leading-relaxed max-w-xl">
                  We meet them with patience.
                  <br />
                  We support them with care.
                  <br />
                  One person at a time.
                </p>
              </div>

              {/* Right column: image card sitting over the background circles */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md aspect-[3/4] rounded-[32px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)] overflow-hidden">
                  <Image
                    src="/Madam.png"
                    alt="Hope Trust therapist"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Bottom-centered Our Team strip */}
            <div className="flex flex-col items-center text-center pb-6">
              <h3 className="text-3xl sm:text-4xl font-semibold text-[#ED7428] mb-4">
                Our Team
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-lg sm:text-xl">
                <span className="font-semibold text-gray-900">Therapists.</span>
                <span className="text-gray-300">Counsellors.</span>
                <span className="text-gray-300">Psychologists.</span>
                <span className="text-gray-300">Medical professionals.</span>
              </div>
            </div>
          </div>
        </section>
        </FadeInSection>

        {/* Services cards + long illustration box */}
        <FadeInSection delay={100}>
        <section className="w-full bg-white py-16">
          <div className="mx-auto w-full max-w-[1246px] px-4 sm:px-8 lg:px-0 flex flex-col gap-10">
            {/* Three colored cards (Frame 37 layout) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-11">
              {/* Left card */}
              <div className="flex flex-col items-center justify-center gap-6 rounded-[45px] bg-[#F9E6D0] px-10 py-16 shadow-sm w-full sm:w-[386px] sm:h-[367px] text-center">
                <Image
                  src="/Asset 15.png"
                  alt="Listener icon"
                  width={96}
                  height={96}
                  className="object-contain"
                />
                <p className="font-semibold text-[#00373E] text-lg leading-relaxed max-w-xs">
                  People who listen
                  <br />
                  without judgment.
                </p>
              </div>

              {/* Middle card */}
              <div className="flex flex-col items-center justify-center gap-6 rounded-[45px] bg-[#00373E] px-10 py-16 shadow-sm w-full sm:w-[386px] sm:h-[367px] text-center">
                <Image
                  src="/Asset 14.png"
                  alt="Guidance icon"
                  width={96}
                  height={96}
                  className="object-contain"
                />
                <p className="font-semibold text-white text-lg leading-relaxed max-w-xs">
                  People who guide
                  <br />
                  with clarity.
                </p>
              </div>

              {/* Right card */}
              <div className="flex flex-col items-center justify-center gap-6 rounded-[45px] bg-white px-10 py-16 shadow-sm w-full sm:w-[386px] sm:h-[367px] text-center">
                <Image
                  src="/Asset 13.png"
                  alt="Process icon"
                  width={96}
                  height={96}
                  className="object-contain"
                />
                <p className="font-semibold text-[#00373E] text-lg leading-relaxed max-w-xs">
                  People who stay with
                  <br />
                  you through the process.
                </p>
              </div>
            </div>

            {/* Long rounded rectangle with text + Frame 5 illustration */}
            <div className="mx-auto w-full max-w-[1240px]">
              <div className="relative w-full rounded-[32px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)] overflow-hidden">
                <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-0 pl-8 pr-0 sm:pl-10 sm:pr-0 lg:pl-14 lg:pr-0 py-10 lg:py-12">
                  {/* Left text column */}
                  <div className="w-full md:w-1/2 text-left">
                    <h3 className="text-2xl sm:text-3xl font-semibold text-[#00373E] mb-4">
                      Wellness Coaching
                    </h3>
                    <p className="text-sm sm:text-base text-[#00373E] leading-relaxed mb-4 max-w-xl">
                      Personalized guidance to help you build healthier habits,
                      manage stress, and achieve balance in all areas of your life.
                    </p>
                    <p className="text-sm sm:text-base text-[#00373E] leading-relaxed mb-6 max-w-xl">
                      Our wellness coaches support you in creating sustainable
                      routines for mental, emotional, and physical well-being.
                    </p>
                    <button className="inline-flex items-center justify-center rounded-full bg-[#00373E] px-6 sm:px-8 py-2.5 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-[#024a53] transition-colors">
                      Learn More
                    </button>
                  </div>

                  {/* Right illustration */}
                  <div className="w-full md:w-1/2 relative min-h-[200px] sm:min-h-[260px] lg:min-h-[300px]">
                    <Image
                      src="/Frame 5.png"
                      alt="Wellness coaching illustration"
                      fill
                      className="object-contain md:object-cover md:object-right"
                      priority={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </FadeInSection>

        {/* How it Works section */}
        <FadeInSection delay={150}>
        <section className="w-full bg-white py-20">
          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8 lg:px-0 flex flex-col gap-10">
            {/* Heading */}
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#00373E]">
                How it Works
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#00373E]">
                Choose how you want to start{' '}
                <span className="block sm:inline">Online or in person.</span>
              </p>
            </div>

            {/* Three step cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center gap-6 rounded-[24px] bg-[#FFEBD7] px-10 py-10 shadow-sm">
                <p className="text-[#00373E] text-sm sm:text-base font-semibold leading-relaxed max-w-xs">
                  Book through WhatsApp or the website.
                  <br />
                  Select the therapist you feel right with.
                </p>
                <Image
                  src="/Asset 12.png"
                  alt="Booking via WhatsApp or website"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center gap-6 rounded-[24px] bg-[#FFEBD7] px-10 py-10 shadow-sm">
                <p className="text-[#00373E] text-sm sm:text-base font-semibold leading-relaxed max-w-xs">
                  Pick a date and a time
                  <br />
                  that works for you.
                </p>
                <Image
                  src="/Asset 11.png"
                  alt="Pick a date and time"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center gap-6 rounded-[24px] bg-[#FFEBD7] px-10 py-10 shadow-sm">
                <p className="text-[#00373E] text-sm sm:text-base font-semibold leading-relaxed max-w-xs">
                  If online, a private link is shared
                  <br />
                  through mail or WhatsApp.
                  <br />
                  If in person, you arrive at the centre
                  <br />
                  for your session.
                </p>
                <Image
                  src="/Asset 10.png"
                  alt="Online or in-person session"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Bottom orange strip */}
            <div className="mx-auto w-full max-w-[1240px]">
              <div className="rounded-[32px] bg-[#F06D00] text-white px-8 sm:px-14 py-8 text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mb-6 border-b border-white/40 pb-6">
                  <div>
                    <p className="text-2xl font-semibold">60 minutes</p>
                    <p className="mt-1 text-sm">Individual therapy</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">90 minutes</p>
                    <p className="mt-1 text-sm">Couples therapy</p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">30 minutes</p>
                    <p className="mt-1 text-sm">Psychiatry</p>
                  </div>
                </div>
                <p className="text-sm">
                  Your progress continues after each session.
                  <br />
                  One step at a time.
                </p>
              </div>
            </div>
          </div>
        </section>
        </FadeInSection>

        {/* Media and Gallery section */}
        <FadeInSection delay={200}>
        <section className="w-full bg-white py-20">
          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8 lg:px-0 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Overlapping images on the left */}
            <div className="relative w-full max-w-[520px] aspect-[4/3]">
              {/* Back image */}
              <div className="absolute inset-y-4 left-0 right-20 rounded-[32px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
                <Image
                  src="/therapy.png"
                  alt="Therapist with client"
                  fill
                  className="object-cover"
                  priority={false}
                />
              </div>

              {/* Front image */}
              <div className="absolute inset-y-0 left-16 right-0 rounded-[32px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
                <Image
                  src="/Madam.png"
                  alt="Hope Trust team member"
                  fill
                  className="object-cover"
                  priority={false}
                />
              </div>
            </div>

            {/* Text content on the right */}
            <div className="w-full lg:w-1/2 text-left">
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#00373E] mb-4">
                Media and Gallery
              </h2>
              <p className="text-sm sm:text-base text-[#00373E] mb-4">
                A quiet look into our space.
              </p>
              <p className="text-sm sm:text-base mb-4">
                <span className="text-[#ED7428] font-semibold">Our work.</span>{' '}
                <span className="text-gray-400 font-semibold">Our people.</span>
              </p>
              <p className="text-sm sm:text-base text-[#00373E]">
                The moments that shape Hope Trust.
              </p>
            </div>
          </div>
        </section>
        </FadeInSection>

        {/* Final CTA + footer-style links section (last section on page) */}
        <FadeInSection delay={250}>
        <section className="w-full bg-white pb-20">
          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8 lg:px-0 flex flex-col lg:flex-row gap-10">
            {/* Left links card */}
            <div className="w-full lg:w-1/2 flex justify-start">
              <div className="w-full lg:w-[570px] min-h-[466px] rounded-[50px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.06)] px-8 sm:px-10 lg:px-12 py-8 sm:py-10 flex flex-col gap-8">
                <div>
                  <Image
                    src="/logo1.png"
                    alt="Hope Trust logo"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 sm:gap-y-0 sm:gap-x-12 text-sm text-[#00373E]">
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
                    <p>YouTube</p>
                    <p>LinkedIn</p>
                  </div>
                  <div className="space-y-3">
                    <p>Terms Of Use</p>
                    <p>Privacy Policy</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  © {new Date().getFullYear()} HopeTrust. All Rights Reserved.
                </p>
              </div>
            </div>

            {/* Right orange CTA card */}
            <div className="w-full lg:w-1/2">
              <div className="relative w-full min-h-[260px] sm:min-h-[320px] lg:min-h-[466px] rounded-[50px] bg-[#ED742B] text-white px-8 sm:px-10 lg:px-12 py-10 sm:py-12 overflow-hidden flex items-center">
                {/* Text content */}
                <div className="relative z-10 max-w-md space-y-3 sm:space-y-4">
                  <h2 className="text-3xl sm:text-4xl font-semibold leading-snug">
                    Find
                    <br />
                    Support,
                    <br />
                    Guidance,
                    <br />
                    and Balance.
                  </h2>
                  <button className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-8 sm:px-10 py-3 text-sm sm:text-base font-semibold text-[#00373E] shadow-md hover:bg-[#FFF5EC] transition-colors">
                    Find Support Now
                  </button>
                </div>

                {/* Illustration on the right */}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2">
                  <Image
                    src="/illustration_7.png"
                    alt="Decorative flowers illustration"
                    fill
                    className="object-contain object-right"
                    priority={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        </FadeInSection>
      </main>
    </>
  );
}