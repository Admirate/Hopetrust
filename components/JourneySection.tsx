"use client";

import { MessageCircle, Calendar } from 'lucide-react';
import { useScrollAnimation, fadeInUp, scaleIn } from '@/hooks/useScrollAnimation';

export default function JourneySection() {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.3 });
  const { elementRef: buttonsRef, isVisible: buttonsVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section className="py-20 bg-gradient-to-br from-yellow-50 to-yellow-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div 
          ref={headerRef as React.RefObject<HTMLDivElement>}
          style={fadeInUp(headerVisible, 200)}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-4">
            START YOUR JOURNEY
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            YOU CAN TALK TO US ON WHATSAPP OR BOOK A SESSION ONLINE
          </p>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-12">
            CHOOSE WHAT FEELS EASIER
          </h3>
        </div>

        {/* Booking Options */}
        <div 
          ref={buttonsRef as React.RefObject<HTMLDivElement>}
          className="space-y-6 max-w-md mx-auto"
        >
          <button 
            className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-4 px-8 rounded-full flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            style={scaleIn(buttonsVisible, 400)}
          >
            <MessageCircle size={24} />
            BOOK VIA WHATSAPP
          </button>
          
          <button 
            className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-4 px-8 rounded-full flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            style={scaleIn(buttonsVisible, 600)}
          >
            <Calendar size={24} />
            BOOK ONLINE  
          </button>
        </div>
      </div>
    </section>
  );
}