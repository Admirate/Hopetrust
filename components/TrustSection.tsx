"use client";

import { useScrollAnimation, fadeInUp } from '@/hooks/useScrollAnimation';

export default function TrustSection() {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { elementRef: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.1 });

    return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        
        {/* Decorative Circles */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large circle top right */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full opacity-60 transform translate-x-8 -translate-y-8"></div>
          
          {/* Medium circle left */}
          <div className="absolute top-1/3 left-0 w-20 h-20 bg-orange-300 rounded-full opacity-70 transform -translate-x-4"></div>
          
          {/* Small circle bottom right */}
          <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-orange-200 rounded-full opacity-50"></div>
          
          {/* Extra small circle bottom left */}
          <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-orange-400 rounded-full opacity-60"></div>
        </div>

        {/* Heading */}
        <div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          style={fadeInUp(titleVisible, 400)}
          className="relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 leading-tight">
            <span className="text-orange-500">A PLACE YOU</span>
            <br />
            <span className="text-orange-500">CAN </span>
            <span className="text-gray-800 italic">TRUST</span>
          </h2>
        </div>

        {/* Content */}
        <div 
          ref={contentRef as React.RefObject<HTMLDivElement>}
          className="space-y-4 text-gray-700 text-base leading-relaxed max-w-2xl mx-auto relative z-10"
          style={fadeInUp(contentVisible, 600)}
        >
          <p>
            For over 20 years, Hope Trust has quietly supported individuals and families through therapy, psychiatry and recovery
          </p>
          <p>
            Rooted in empathy and guided by clinical experience
          </p>
        </div>
      </div>
    </section>
  );
}