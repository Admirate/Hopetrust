import Header from '@/components/Header';
import { IBM_Plex_Sans } from 'next/font/google';
import FadeInSection from '@/components/FadeInSection';

const quoteBodyFont = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400'],
});

export default function BlogsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-[#F7F6F4]">
        {/* Hero section */}
        <FadeInSection>
        <section className="w-full bg-white">
          <div className="mx-auto flex w-full max-w-[1225px] flex-col-reverse gap-10 px-4 py-10 sm:px-8 lg:px-12 lg:flex-row lg:items-center lg:py-12">
            {/* Left: heading, copy, button */}
            <div className="w-full lg:w-1/2 space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-semibold text-[#071B36]">
                  Heading for Blogs
                </h1>
                <div className="mt-3 h-[3px] w-10 rounded-full bg-[#ED7428]" />
              </div>

              <p className="max-w-xl text-sm sm:text-base leading-relaxed text-[#4B5563]">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500.
              </p>

              <button className="inline-flex items-center justify-center rounded-full bg-[#ED7428] px-8 py-3 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-[#e16316] transition-colors">
                Contact us
              </button>
            </div>

            {/* Right: circular image placeholder */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative h-[260px] w-[260px] sm:h-[320px] sm:w-[320px] lg:h-[360px] lg:w-[360px] rounded-full bg-[#CBCBCB] shadow-[0_0_0_18px_#F8F3FF]">
                {/* If you later add an image/video, place it inside this circle */}
              </div>
            </div>
          </div>
        </section>
        </FadeInSection>

        {/* Featured blog card section */}
        <FadeInSection delay={100}>
        <section className="w-full bg-[#F7F6F4] py-12 sm:py-16">
          <div className="mx-auto w-full max-w-[1225px] px-4 sm:px-8 lg:px-12">
            {/* Section heading */}
            <h2 className="text-center text-2xl sm:text-3xl lg:text-[32px] font-semibold text-[#071B36] mb-8 sm:mb-10">
              Lorem Ipsum Is
            </h2>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
              {/* Left: image placeholder */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
                <div className="h-[260px] w-full max-w-[360px] bg-[#DEDEDE]" />
              </div>

              {/* Right: text and button */}
              <div className="w-full lg:w-1/2 space-y-4 text-left">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#071B36]">
                  Lorem Ipsum simply
                  <br />
                  dummy text
                </h3>
                <p className="max-w-xl text-sm sm:text-base leading-relaxed text-[#4B5563]">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text ever since the 1500s,
                </p>
                <button className="inline-flex items-center justify-center rounded-full bg-[#ED7428] px-8 py-3 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-[#e16316] transition-colors">
                  Read more
                </button>
              </div>
            </div>
          </div>
        </section>
        </FadeInSection>

        {/* Top blogs section */}
        <FadeInSection delay={150}>
        <section className="w-full bg-gradient-to-b from-white to-[#FFF5CF] py-12 sm:py-16">
          <div className="mx-auto w-full max-w-[1225px] px-4 sm:px-8 lg:px-12">
            {/* Section heading */}
            <h2 className="text-center text-2xl sm:text-3xl lg:text-[32px] font-semibold text-[#071B36] mb-10">
              TOP BLOGS
            </h2>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
              {/* Left: text and button */}
              <div className="w-full lg:w-1/2 space-y-4 text-left">
                <h3 className="text-xl sm:text-2xl font-semibold text-[#071B36]">
                  Lorem Ipsum Lorem
                  <br />
                  Ipsum Lorem
                </h3>
                <p className="max-w-xl text-sm sm:text-base leading-relaxed text-[#4B5563]">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry&apos;s
                  standard dummy text ever since the 1500s,
                </p>
                <button className="inline-flex items-center justify-center rounded-full bg-[#ED7428] px-8 py-3 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-[#e16316] transition-colors">
                  Read more
                </button>
              </div>

              {/* Right: image placeholder */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <div className="h-[260px] w-full max-w-[360px] bg-[#DEDEDE]" />
              </div>
            </div>
          </div>
        </section>
        </FadeInSection>

        {/* Blog grid section */}
        <FadeInSection delay={200}>
        <section className="w-full bg-[#FDF1E9] py-12 sm:py-16">
          <div className="mx-auto w-full max-w-[1225px] px-4 sm:px-8 lg:px-12">
            <h2 className="text-center text-2xl sm:text-3xl lg:text-[32px] font-semibold text-[#071B36] mb-10">
              Lorem Ipsum Is Simply Dummy
              <br />
              Text Of The Printing And
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <article
                  key={idx}
                  className="flex flex-col rounded-[6px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden"
                >
                  {/* Top thumbnail area */}
                  <div className="h-28 bg-[#EAF3FF]" />

                  {/* Content */}
                  <div className="flex flex-1 flex-col px-6 py-5 space-y-3 text-left">
                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#B3B3B3]">
                      Lorem ipsum lorem ipsum
                    </p>
                    <h3 className="text-sm sm:text-base font-semibold text-[#071B36] leading-relaxed">
                      Lorem Ipsum Lorem Ipsum
                      <br />
                      Lorem Ipsum Lorem
                    </h3>
                    <p className="text-[11px] sm:text-xs leading-relaxed text-[#4B5563]">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry&apos;s
                      standard dummy text ever since the 1500s.
                    </p>
                    <button className="mt-2 w-max text-xs font-semibold text-[#ED7428]">
                      Read the Post
                      <span className="mt-1 block h-[2px] w-14 bg-[#ED7428]" />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <button className="rounded-full bg-[#ED7428] px-8 py-2 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-[#e16316] transition-colors">
                Lorem Ipsums
              </button>
            </div>
          </div>
        </section>
        </FadeInSection>

        {/* Quote / navigation section */}
        <FadeInSection delay={250}>
        <section className="w-full bg-white py-12 sm:py-16">
          <div className="relative mx-auto w-full max-w-[900px] px-4 sm:px-8 lg:px-0 text-center">
            {/* Left arrow */}
            <button
              type="button"
              aria-label="Previous"
              className="absolute -left-10 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#E1E1E1] text-[#666666] sm:flex"
            >
              &#8249;
            </button>

            {/* Right arrow */}
            <button
              type="button"
              aria-label="Next"
              className="absolute -right-10 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#E1E1E1] text-[#666666] sm:flex"
            >
              &#8250;
            </button>

            <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-semibold text-[#071B36] mb-6">
              Lorem Ipsum Is Sim
            </h2>
            <p
              className={`${quoteBodyFont.className} mb-6 text-[30.45px] leading-[46.1px] text-[#001325] italic`}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s, when an unknown printer took a galley
              of type and scrambled it to make a type specimen book.
            </p>
            <p className="text-sm font-semibold text-[#ED7428]">Lorem Ipsum is</p>
            <p className="mt-1 text-xs sm:text-sm text-[#4B5563]">
              It Is A Long Established Fact That A Read
            </p>
          </div>
        </section>
        </FadeInSection>
      </main>
    </>
  );
}
