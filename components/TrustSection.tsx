"use client";

import { Trees } from 'lucide-react';
import { useScrollAnimation, fadeInUp, scaleIn } from '@/hooks/useScrollAnimation';

export default function TrustSection() {
  const { elementRef: iconRef, isVisible: iconVisible } = useScrollAnimation({ threshold: 0.3 });
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation({ threshold: 0.2 });
  const { elementRef: contentRef, isVisible: contentVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="mb-8">
          <div 
            ref={iconRef as React.RefObject<HTMLDivElement>}
            className="inline-flex items-center justify-center w-24 h-24 mb-6"
            style={scaleIn(iconVisible, 200)}
          >
            <Trees size={80} className="text-green-500" strokeWidth={1.5} />
          </div>
        </div>

        {/* Heading */}
        <div 
          ref={titleRef as React.RefObject<HTMLDivElement>}
          style={fadeInUp(titleVisible, 400)}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-12">
            <span className="text-orange-500">A PLACE YOU</span>
            <br />
            <span className="text-orange-500">CAN </span>
            <span className="text-gray-800">TRUST</span>
          </h2>
        </div>

        {/* Content */}
        <div 
          ref={contentRef as React.RefObject<HTMLDivElement>}
          className="space-y-4 text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto"
          style={fadeInUp(contentVisible, 600)}
        >
          <p>
            For over 20 years, Hope Trust has quietly supported individuals and
          </p>
          <p>
            families through therapy, psychiatry and recovery
          </p>
          <p>
            Rooted in empathy and guided by clinical experience
          </p>
        </div>
      </div>
    </section>
  );
}