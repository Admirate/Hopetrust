"use client";

import Image from 'next/image';
import { useScrollAnimation, fadeInUp, fadeInLeft, fadeInRight } from '@/hooks/useScrollAnimation';

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
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: descriptionRef, isVisible: descriptionVisible } = useScrollAnimation();
  const { elementRef: buttonRef, isVisible: buttonVisible } = useScrollAnimation();
  const { elementRef: card1Ref, isVisible: card1Visible } = useScrollAnimation();
  const { elementRef: card2Ref, isVisible: card2Visible } = useScrollAnimation();
  const { elementRef: card3Ref, isVisible: card3Visible } = useScrollAnimation();

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
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* Left side: Gray container */}
          <div ref={titleRef} className="w-full lg:w-1/2 h-96 bg-gray-200 rounded-2xl" style={fadeInLeft(titleVisible, 200)}></div>
          
          {/* Right side: Who We Are section */}
          <div ref={descriptionRef} className="w-full lg:w-1/2" style={fadeInRight(descriptionVisible, 400)}>
            <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-orange-500">Who</span> We Are?
              </h2>
              <p className="text-gray-600 text-base lg:text-lg">
                Hope Trust has been supporting individuals and families on their path to recovery for over 20 years. Our care is respectful, evidence-based, and always personal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}