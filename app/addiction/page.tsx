import Header from '@/components/Header';
import Image from 'next/image';
import { Bricolage_Grotesque, IBM_Plex_Sans } from 'next/font/google';

const bricolageBody = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['500', '600'],
});

const roadHeadingFont = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['600'],
});

export default function AddictionPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-white">
        {/* Hero section: text left, hero image (to be updated) right */}
        <section className="w-full flex items-center bg-white pt-8 sm:pt-12 pb-10 sm:pb-14">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 sm:px-8 lg:px-12 md:flex-row md:items-center md:justify-between">
            {/* Left: centered text content */}
            <div className="w-full md:w-1/2 space-y-5 md:space-y-6 text-left">
              <p
                className={`${bricolageBody.className} text-[32px] sm:text-[40px] lg:text-[48px] font-semibold text-black uppercase`}
                style={{ letterSpacing: '0.724px' }}
              >
                Addiction
              </p>
              <h1
                className={`${bricolageBody.className} text-[18px] sm:text-[26px] lg:text-[32px] font-semibold leading-snug`}
                style={{ letterSpacing: '0.724px' }}
              >
                <span className="text-[#00373E]">When Stopping</span>{' '}
                <span className="text-[#E26B20]">Is Not Simple</span>
              </h1>
              <div className="space-y-2 text-sm sm:text-base text-[#004047] max-w-md">
                <p>Addiction is not about willpower.</p>
                <p>It affects behaviour, health, and relationships.</p>
                <p>Most people need structured support to recover.</p>
                <p>That is normal and treatable.</p>
              </div>
              <button className="mt-4 inline-flex items-center justify-center rounded-full bg-[#F97316] px-6 sm:px-8 py-2.5 text-sm sm:text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#ea6a0e] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.97]">
                Chat with us
              </button>
            </div>

            {/* Right: hero image placeholder (you can replace when ready) */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-end">
              <div className="relative w-full max-w-md h-64 sm:h-72 md:h-80 lg:h-96 rounded-[32px] overflow-hidden bg-white">
                <Image
                  src="/Group 28.png"
                  alt="Illustration representing addiction recovery support"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Hope Trust + Areas We Support section */}
        <section className="w-full py-16 sm:py-20 bg-[#FEF2EB]">
          <div className="mx-auto flex w-full max-w-[1184px] flex-col gap-12 px-4 sm:px-8 lg:px-12">
            {/* Top row: Why Hope Trust + dark green rounded square with illustration */}
            <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between">
              {/* Left text block */}
              <div className="w-full md:w-1/2 space-y-4 text-left">
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#ED7428]">
                  Why Hope Trust
                </h2>
                <div
                  className={`${bricolageBody.className} space-y-3 text-[#00373E] max-w-[548px]`}
                  style={{ letterSpacing: '0.724px' }}
                >
                  <p className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] leading-relaxed">
                    Hope Trust has supported addiction recovery since 2002.
                    Therapists, counsellors, and medical professionals work
                    together to create a clear, steady plan.
                  </p>
                  <p className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] leading-relaxed">
                    Families are included when helpful. Care is structured and
                    reliable.
                  </p>
                </div>
              </div>

              {/* Right: dark green rounded square with illustration_4.png */}
              <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                <div className="relative w-[260px] sm:w-[320px] lg:w-[406px] aspect-[406/442] rounded-[60px] bg-[#00373E] flex items-center justify-center shadow-[0_24px_60px_rgba(0,0,0,0.15)]">
                  <div className="relative w-[180px] sm:w-[220px] lg:w-[268px] aspect-[268/409]">
                    <Image
                      src="/illustration_4.png"
                      alt="Illustration of hopeful mind and recovery"
                      fill
                      className="object-contain"
                      priority={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row: long rounded rectangle with text + illustration */}
            <div className="w-full">
              <div className="relative w-full rounded-[60px] bg-[#F9E6D0] px-6 sm:px-10 lg:px-16 py-6 sm:py-8 lg:py-10 flex flex-col gap-10 md:flex-row md:items-center md:justify-between lg:min-h-[380px]">
                {/* Left text content */}
                <div className="max-w-2xl text-left">
                  <h3
                    className={`${bricolageBody.className} text-[32px] sm:text-[40px] lg:text-[48px] font-semibold text-[#00373E]`}
                    style={{ letterSpacing: '0.724px' }}
                  >
                    Areas We Support
                  </h3>
                  <p
                    className={`${bricolageBody.className} mt-4 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] text-[#00373E] leading-relaxed max-w-[720px]`}
                    style={{ letterSpacing: '0.724px' }}
                  >
                    Alcohol use | Smoking and vaping | Drug use | Prescription misuse | Gaming and internet dependence | Gambling | Pornography and sex related concerns
                  </p>
                  <p
                    className={`${bricolageBody.className} mt-6 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-bold text-[#00373E] max-w-[679px]`}
                    style={{ letterSpacing: '0.724px' }}
                  >
                    Each concern receives a tailored treatment approach.
                  </p>
                </div>

                {/* Right image block */}
                <div className="flex w-full md:w-auto md:ml-4 justify-end">
                  <div className="relative w-[229px] aspect-[229/322] translate-x-2 sm:translate-x-3 lg:translate-x-4">
                    <Image
                      src="/illustration10.png"
                      alt="Decorative illustration"
                      fill
                      className="object-contain object-right"
                      style={{ transform: 'scaleX(-1)' }}
                      priority={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Treatment Involves section */}
        <section className="w-full bg-white py-16 sm:py-20">
          <div className="mx-auto flex w-full max-w-[1184px] flex-col items-center gap-10 px-4 sm:px-8 lg:px-12">
            {/* Heading */}
            <h2
              className={`${bricolageBody.className} text-center text-[48px] font-semibold text-[#00373E]`}
              style={{ letterSpacing: '0.724px' }}
            >
              What Treatment Involves
            </h2>

            {/* Three treatment steps */}
            <div className="flex w-full flex-col items-center gap-6 md:flex-row md:justify-center md:gap-12">
              {/* Step 1 with circular highlight */}
              <div className="relative flex items-center justify-center">
                <div className="absolute -z-10 h-[96px] w-[96px] rounded-full border-[14px] border-[#FCDDC4]" />
                <button className="flex h-[68px] w-[302px] max-w-full items-center justify-center rounded-[10px] bg-[#ED7428] px-6 text-sm sm:text-base font-semibold text-white shadow-md">
                  A full assessment
                </button>
              </div>

              {/* Step 2 */}
              <button className="flex h-[68px] w-[302px] max-w-full items-center justify-center rounded-[10px] bg-[#ED7428] px-6 text-sm sm:text-base font-semibold text-white shadow-md">
                A personalised plan
              </button>

              {/* Step 3 */}
              <button className="flex h-[68px] w-[302px] max-w-full items-center justify-center rounded-[10px] bg-[#ED7428] px-6 text-sm sm:text-base font-semibold text-white shadow-md">
                Therapy sessions
              </button>
            </div>

            {/* Supporting bullet-style lines */}
            <div
              className={`${bricolageBody.className} mt-4 space-y-1 text-center text-[18px] sm:text-[20px] lg:text-[24px] font-medium text-[#5E5E5E]`}
              style={{ letterSpacing: '0.724px' }}
            >
              <p>Medical support when required</p>
              <p>Relapse prevention skills</p>
              <p>Family guidance</p>
              <p>Regular follow ups</p>
            </div>

            {/* Final reassurance line */}
            <p
              className={`${bricolageBody.className} mt-6 text-center text-[24px] sm:text-[28px] lg:text-[36px] font-semibold text-[#ED7428]`}
              style={{ letterSpacing: '0.724px' }}
            >
              Everything is explained clearly and at your pace.
            </p>
          </div>
        </section>

        {/* Road to Recovery section */}
        <section className="w-full bg-white py-16 sm:py-20">
          <div className="mx-auto flex w-full max-w-[1184px] flex-col items-center px-4 sm:px-8 lg:px-12">
            {/* Heading */}
            <h2
              className={`${roadHeadingFont.className} text-center text-[40px] sm:text-[52px] lg:text-[64px] font-semibold text-[#ED7428]`}
              style={{ letterSpacing: '0.724px' }}
            >
              Road to Recovery
            </h2>

            {/* Central illustration / video */}
            <div className="mt-10 w-full max-w-[506px] aspect-[253/142] overflow-hidden">
              <video
                src="/Mental health.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="block h-full w-full bg-white object-cover"
              />
            </div>
          </div>
        </section>

        {/* Recovery steps strip */}
        <section className="w-full bg-white pb-16 sm:pb-20">
          <div className="mx-auto w-full max-w-[1184px] px-4 sm:px-8 lg:px-12">
            <div className="flex gap-4 overflow-x-auto pb-2 sm:justify-between">
              {[
                {
                  text: 'You reach out and say you need help.',
                  step: 'Step 1',
                },
                {
                  text: 'We speak with you and understand what is going on.',
                  step: 'Step 2',
                },
                {
                  text: 'We create a clear recovery plan that fits your needs.',
                  step: 'Step 3',
                },
                {
                  text: 'You attend therapy online from wherever you feel comfortable.',
                  step: 'Step 4',
                },
                {
                  text: 'Your support person can join if it helps.',
                  step: 'Step 5',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex min-w-[180px] flex-1 flex-col items-center justify-between rounded-[6px] bg-[#FEF2EB] px-4 py-8 text-center sm:min-w-[200px]"
                >
                  <p
                    className={`${bricolageBody.className} text-[14px] sm:text-[16px] text-[#ED7428] leading-relaxed`}
                  >
                    {item.text}
                  </p>
                  <p
                    className={`${bricolageBody.className} mt-6 text-[18px] sm:text-[22px] font-semibold text-[#FED7B0]`}
                  >
                    {item.step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}