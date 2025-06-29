"use client";

import { useRef, memo } from 'react';
import { useScrollAnimation, fadeIn, fadeInUp } from '@/hooks/useScrollAnimation';

const HeroSection = memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: messageRef, isVisible: messageVisible } = useScrollAnimation();
  const { elementRef: buttonRef, isVisible: buttonVisible } = useScrollAnimation();
  const { elementRef: videoContainerRef, isVisible: videoVisible } = useScrollAnimation();

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8">
      <section className="bg-[#FEF2EB] relative overflow-hidden rounded-[2rem] px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h1 ref={titleRef} className="space-y-2" style={fadeInUp(titleVisible, 200)}>
              <span className="block text-4xl md:text-5xl italic font-light">A place for</span>
              <span className="block text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                hope, healing,
                <br />
                and renewal.
              </span>
            </h1>
            
            {/* WhatsApp-style message */}
            <div ref={messageRef} className="space-y-2" style={fadeInUp(messageVisible, 400)}>
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-1.5 0a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0zm-4.5-2a1 1 0 100 2 1 1 0 000-2zm-5 0a1 1 0 100 2 1 1 0 000-2zm2.5 4.5c1.5 0 2.5-.75 2.5-.75s-1 1.75-2.5 1.75-2.5-1.75-2.5-1.75 1 .75 2.5 .75z" clipRule="evenodd"/>
                </svg>
                <span className="text-green-700 font-medium text-base">A gentle reminder:</span>
              </div>
              <p className="text-gray-700 text-lg">We're here if you need us — message us anytime</p>
            </div>

            {/* Chat Button */}
            <button ref={buttonRef} className="bg-black text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors text-base" style={fadeInUp(buttonVisible, 600)}>
              Chat with us
            </button>
          </div>

          {/* Right Content - Video Container */}
          <div ref={videoContainerRef} className="w-full lg:w-1/2 aspect-[16/10] bg-gray-200 rounded-xl overflow-hidden" style={fadeInUp(videoVisible, 300)}>
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              preload="metadata"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 10'%3E%3Crect width='16' height='10' fill='%23ddd'/%3E%3C/svg%3E"
            >
              <source src="/final hero video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>
    </div>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;