"use client";

import Image from 'next/image';

const GradientBlobs = () => {
  return (
    <>
      {/* Right side gradient blobs */}
      <div className="absolute pointer-events-none">
        <div 
          className="absolute w-[310px] sm:w-[410px] lg:w-[510px] h-[310px] sm:h-[410px] lg:h-[510px] rounded-full"
          style={{
            background: 'radial-gradient(50% 50% at 50% 50%, #EE7329 0%, #F9E14B 100%)',
            filter: 'blur(57.5px)',
            right: '-155px',
            top: '0'
          }}
        />
        <div 
          className="absolute w-[212px] sm:w-[262px] lg:w-[312px] h-[212px] sm:h-[262px] lg:h-[312px] rounded-full"
          style={{
            background: 'radial-gradient(50% 50% at 50% 50%, #EE7329 0%, #FFFFFF 100%)',
            filter: 'blur(57.5px)',
            right: '-106px',
            top: '100px'
          }}
        />
      </div>

      {/* Bottom right corner blob */}
      <div 
        className="absolute w-[300px] sm:w-[350px] lg:w-[400px] h-[300px] sm:h-[350px] lg:h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, #EE7329 0%, #F9E14B 100%)',
          filter: 'blur(45px)',
          right: '0',
          bottom: '0',
          transform: 'translate(50%, 50%)'
        }}
      />

      {/* Left side gradient blobs */}
      <div className="absolute pointer-events-none">
        <div 
          className="absolute w-[310px] sm:w-[410px] lg:w-[510px] h-[310px] sm:h-[410px] lg:h-[510px] rounded-full"
          style={{
            background: 'radial-gradient(50% 50% at 50% 50%, #EE7329 0%, #F9E14B 100%)',
            filter: 'blur(57.5px)',
            left: '-155px',
            bottom: '0'
          }}
        />
        <div 
          className="absolute w-[212px] sm:w-[262px] lg:w-[312px] h-[212px] sm:h-[262px] lg:h-[312px] rounded-full"
          style={{
            background: 'radial-gradient(50% 50% at 50% 50%, #EE7329 0%, #FFFFFF 100%)',
            filter: 'blur(57.5px)',
            left: '-106px',
            bottom: '100px'
          }}
        />
      </div>
    </>
  );
};

export default function TrustSection() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 relative overflow-hidden">
      <GradientBlobs />
      {/* Pink lines background */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/lines.png"
          alt="Decorative background lines"
          fill
          className="object-cover opacity-50"
          priority
        />
      </div>
      <div className="container mx-auto px-4 relative">
        {/* Who We Are section */}
        <div className="mb-8 sm:mb-12 lg:mb-16 ml-0 sm:ml-[100px] lg:ml-[200px]">
          <h2 className="text-[40px] sm:text-[52px] lg:text-[64px] font-medium leading-tight mb-6 lg:mb-8">
            Who<br />
            We<br />
            Are?
          </h2>
          <div className="max-w-[320px] sm:max-w-[400px] lg:max-w-[480px] bg-white rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] p-4 sm:p-5 lg:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            <p className="text-gray-600 text-sm sm:text-base">
              Hope Trust has been supporting individuals and families on their path to recovery for over 20 years. Our care is respectful, evidence-based, and always personal.
            </p>
          </div>
        </div>

        {/* What We Offer button */}
        <button className="group bg-white rounded-full px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center gap-2 sm:gap-3 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all mb-8 sm:mb-10 lg:mb-12">
          <span className="text-sm sm:text-base font-medium">What We Offer</span>
          <span className="relative w-4 sm:w-5 h-4 sm:h-5 flex items-center">
            <span className="absolute w-3 sm:w-4 h-[2px] bg-black rounded-full"></span>
            <span className="absolute right-0 w-1.5 sm:w-2 h-[2px] bg-black rounded-full rotate-45 origin-right"></span>
            <span className="absolute right-0 w-1.5 sm:w-2 h-[2px] bg-black rounded-full -rotate-45 origin-right"></span>
          </span>
        </button>

        {/* Service Cards with exact positioning */}
        <div className="relative max-w-7xl mx-auto">
          {/* Top row with two cards */}
          <div className="flex flex-col lg:flex-row justify-between gap-6 sm:gap-8 lg:gap-16 mb-6 sm:mb-8 lg:mb-12">
            {/* Therapy and Counseling Card */}
            <div className="relative w-full lg:w-[400px]">
              <div className="relative rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] overflow-hidden aspect-[4/3]">
                <Image 
                  src="/therapy.png"
                  alt="Therapy and Counseling"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/60"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-white font-medium text-base sm:text-lg lg:text-xl flex items-center gap-2">
                      THERAPY AND COUNSELING <span className="text-lg sm:text-xl lg:text-2xl">→</span>
                    </h3>
                    <p className="text-white/90 text-sm sm:text-base">
                      Emotional well-being, relationships, life challenges
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Home-based Recovery Programs Card */}
            <div className="relative w-full lg:w-[400px]">
              <div className="relative rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] overflow-hidden aspect-[4/3]">
                <Image 
                  src="/children.png"
                  alt="Home-based Recovery Programs"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/60"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-white font-medium text-base sm:text-lg lg:text-xl flex items-center gap-2">
                      HOME-BASED RECOVERY PROGRAMS <span className="text-lg sm:text-xl lg:text-2xl">→</span>
                    </h3>
                    <p className="text-white/90 text-sm sm:text-base">
                      Flexible, discreet support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom centered card */}
          <div className="relative w-full lg:w-[400px] mx-auto">
            <div className="relative rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] overflow-hidden aspect-[4/3]">
              <Image 
                src="/addiction.png"
                alt="Addiction Recovery Care"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/60"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-white font-medium text-base sm:text-lg lg:text-xl flex items-center gap-2">
                    ADDICTION RECOVERY CARE <span className="text-lg sm:text-xl lg:text-2xl">→</span>
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base">
                    Residential and outpatient
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}