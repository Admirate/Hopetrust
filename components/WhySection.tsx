"use client";

import { useScrollAnimation, fadeInLeft, fadeInUp } from '@/hooks/useScrollAnimation';

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

const WhySection = () => {
  const features = [
    "OVER TWO DECADES OF EXPERIENCE",
    "FAMILY INVOLVEMENT AT EVERY STAGE",
    "A SAFE, PRIVATE PLACE TO HEAL",
    "GENTLE, PROVEN THERAPIES AND HOLISTIC CARE"
  ];

  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const featureRefs = features.map(() => useScrollAnimation());

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <section className="py-16 lg:py-24 min-h-screen flex items-center bg-[#FFF5F1] rounded-[40px] max-w-[1440px] mx-auto relative overflow-hidden">
        <GradientBlobs />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row lg:gap-20 max-w-6xl mx-auto">
            {/* Left side - Title */}
            <div className="mb-10 lg:mb-0 lg:w-1/3">
              <h2
                ref={titleRef}
                className="fluid-heading-hero font-medium text-balance"
                style={fadeInLeft(titleVisible, 200)}
              >
                WHY
                <div className="text-[#FF6B2C] mt-2">
                  HOPE<br />
                  TRUST
                </div>
              </h2>
            </div>

            {/* Right side - Cards */}
            <div className="lg:w-2/3">
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    ref={featureRefs[index].elementRef}
                    className="bg-white rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow duration-300 max-w-[540px]"
                    style={fadeInUp(featureRefs[index].isVisible, 300 + (index * 150))}
                  >
                    <p className="text-[#2D2D2D] text-sm sm:text-base tracking-wide">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhySection; 