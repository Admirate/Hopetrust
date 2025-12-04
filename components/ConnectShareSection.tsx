'use client';

import Image from 'next/image';
import { IBM_Plex_Mono, Ibarra_Real_Nova } from 'next/font/google';

const headingFont = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['600'],
});

const bodyFont = Ibarra_Real_Nova({
  subsets: ['latin'],
  weight: ['600'],
});

export default function ConnectShareSection() {
  return (
    <section className="relative overflow-hidden bg-[#ED7428] py-14 md:py-16 lg:py-20 min-h-screen flex items-center">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 text-left md:flex-row md:items-center md:justify-between">
        {/* Left: Text + button */}
        <div className="w-full md:w-1/2">
          <h2
            className={`${headingFont.className} fluid-heading-xl text-white text-balance`}
          >
            Connect,
            <br />
            Share &amp;
            <br />
            Grow Together!
          </h2>

          <div className="mt-10">
            <button className={`${bodyFont.className} inline-flex items-center justify-center rounded-full bg-white px-8 md:px-10 py-3 text-lg md:text-xl font-semibold text-[#ED7428] shadow-sm hover:bg-[#FFF5EC] transition-colors`}>
              Connect with us
            </button>
          </div>
        </div>

        {/* Right: Image (605px x 408px in Figma, aspect-ratio ~121/98) */}
        <div className="relative w-full max-w-[605px] md:w-auto">
          <div className="relative w-full md:w-[605px] md:h-[408px] aspect-[121/98] overflow-hidden">
            {/* Decorative lines over the image (from 3 lines.png) – sized/rotated to match Figma */}
            <div
              className="pointer-events-none absolute z-10"
              style={{
                width: '117.175px',
                height: '169.145px',
                top: '-20px',
                left: '-10px',
                transform: 'rotate(-5.09deg)',
              }}
            >
              <Image
                src="/3 lines.png"
                alt="Decorative lines"
                fill
                className="object-contain"
                priority={false}
              />
            </div>

            {/* Curvy line on right side (from curvy line.png) */}
            <div
              className="pointer-events-none absolute z-10"
              style={{
                width: '80px',
                height: '80px',
                right: '-20px',
                top: '35%',
              }}
            >
              <Image
                src="/curvy line.png"
                alt="Curvy decorative line"
                fill
                className="object-contain"
                priority={false}
              />
            </div>

            <Image
              src="/pexels-olly-3756168 1.png"
              alt="Person enjoying sunflowers"
              fill
              className="object-cover shadow-lg"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}


