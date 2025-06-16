"use client";

import { useScrollAnimation, fadeInUp, scaleIn } from '@/hooks/useScrollAnimation';

export default function HeroSection() {
  const { elementRef: contentRef, isVisible: contentVisible } = useScrollAnimation({ 
    threshold: 0.1, 
    rootMargin: '0px' 
  });

  return (
    <section className="relative overflow-hidden bg-gray-900 rounded-3xl mx-4 mt-8 mb-16">
      {/* Background video */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-90"
          onError={(e) => {
            console.log('Video failed to load, using fallback background');
            e.currentTarget.style.display = 'none';
          }}
        >
          {/* Your custom video - put your video file in the public folder */}
          <source src="/hero-video.mp4" type="video/mp4" />
          <source src="/hero-video.webm" type="video/webm" />
          
          {/* Fallback message */}
          Your browser does not support the video tag.
        </video>
        
        {/* Fallback background - only shows if video fails */}
        <div 
          className="absolute inset-0 opacity-30 rounded-3xl"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/158163/clouds-cloudscape-fluffy-white-158163.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Very light overlay for text readability only */}
        <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
      </div>
      
      {/* Decorative curves */}
      <div className="absolute inset-0 rounded-3xl">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="none">
          <path
            d="M0,0 Q300,80 600,40 T1200,0 L1200,600 Q900,520 600,560 T0,600 Z"
            fill="rgba(255,255,255,0.05)"
          />
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-8 py-20 lg:py-28 z-10">
        <div 
          ref={contentRef as React.RefObject<HTMLDivElement>}
          className="text-center"
        >
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-xl"
            style={fadeInUp(contentVisible, 300)}
          >
            YOUR SPACE TO BEGIN HEALING
          </h1>
          <div 
            className="w-32 h-1 bg-white mx-auto mb-8 shadow-sm"
            style={scaleIn(contentVisible, 600)}
          ></div>
          <p 
            className="text-xl md:text-2xl text-white/95 mb-12 max-w-4xl mx-auto font-light drop-shadow-lg"
            style={fadeInUp(contentVisible, 800)}
          >
            NO PRESSURE. JUST SUPPORT. WHEN YOU&apos;RE READY, WE&apos;RE HERE
          </p>
          
          <button 
            className="bg-white text-orange-500 font-bold px-12 py-4 rounded-full text-lg hover:bg-orange-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            style={scaleIn(contentVisible, 1000)}
          >
            BOOK NOW
          </button>
        </div>
      </div>
    </section>
  );
}