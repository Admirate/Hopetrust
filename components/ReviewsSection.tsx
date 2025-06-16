"use client";

import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useScrollAnimation, fadeInLeft, fadeInRight } from '@/hooks/useScrollAnimation';

export default function ReviewsSection() {
  const { elementRef: statsRef, isVisible: statsVisible } = useScrollAnimation({ threshold: 0.2 });
  const { elementRef: reviewRef, isVisible: reviewVisible } = useScrollAnimation({ threshold: 0.2 });

  const reviews = [
    {
      text: "Hope Trust transformed our family's life. The compassionate care and professional support helped us through our darkest times.",
      author: "Sarah M.",
      rating: 5
    },
    {
      text: "After struggling with anxiety for years, I finally found peace through their therapy sessions. The therapists truly understand and care.",
      author: "Michael R.",
      rating: 5
    },
    {
      text: "The psychiatric consultation changed everything for me. Professional, understanding, and genuinely helpful. Highly recommended!",
      author: "Jennifer L.",
      rating: 5
    },
    {
      text: "Their recovery program gave me my life back. The support team is incredible and the approach is both gentle and effective.",
      author: "David K.",
      rating: 5
    },
    {
      text: "As a parent, I was worried about my teenager. Hope Trust's adolescent care program was exactly what we needed. Thank you!",
      author: "Lisa P.",
      rating: 5
    },
    {
      text: "The no-pressure approach made all the difference. I felt safe and supported from day one. Truly life-changing experience.",
      author: "Robert T.",
      rating: 5
    }
  ];

  const [currentReview, setCurrentReview] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentReview((prev) => (prev + 1) % reviews.length);
        setIsAnimating(false);
      }, 400);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  const goToReview = (index: number) => {
    if (index !== currentReview) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentReview(index);
        setIsAnimating(false);
      }, 400);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Reviews statistics */}
          <div 
            ref={statsRef as React.RefObject<HTMLDivElement>}
            className="text-center lg:text-left space-y-6"
            style={fadeInLeft(statsVisible, 200)}
          >
            <div className="inline-block p-6 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  MORE THAN 14,000
                </span>
              </h2>
              
              <div className="flex justify-center lg:justify-start items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-gray-800">5 STAR</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={28} 
                      className="fill-amber-400 text-amber-400 drop-shadow-sm" 
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-2xl md:text-3xl font-bold">
                <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  REVIEWS FROM
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  OUR CLIENTS
                </span>
              </p>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-orange-100">
                <div className="text-2xl font-bold text-orange-500">20+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl border border-orange-100">
                <div className="text-2xl font-bold text-orange-500">100%</div>
                <div className="text-sm text-gray-600">Confidential</div>
              </div>
            </div>
          </div>

          {/* Right side - Enhanced review card */}
          <div 
            ref={reviewRef as React.RefObject<HTMLDivElement>}
            className="relative"
            style={fadeInRight(reviewVisible, 400)}
          >
            <div className="bg-gradient-to-br from-white via-orange-50/30 to-yellow-50/50 rounded-3xl p-10 min-h-[400px] flex items-center justify-center relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-orange-100/50">
              
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-200 rounded-full blur-xl"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-orange-300 rounded-full blur-xl"></div>
              </div>

              <div className={`text-center transition-all duration-500 ease-out relative z-10 ${
                isAnimating 
                  ? 'opacity-0 transform translate-y-8 scale-95' 
                  : 'opacity-100 transform translate-y-0 scale-100'
              }`}>
                
                {/* Avatar/Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg relative">
                  <Star size={36} className="text-orange-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
                </div>
                
                {/* Rating stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {[...Array(reviews[currentReview].rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      className="fill-amber-400 text-amber-400 drop-shadow-sm" 
                    />
                  ))}
                </div>
                
                {/* Quote */}
                <div className="relative mb-8">
                  <div className="text-6xl text-orange-200 absolute -top-4 -left-2 font-serif">&ldquo;</div>
                  <p className="text-gray-700 italic text-xl leading-relaxed max-w-md mx-auto font-light px-6">
                    {reviews[currentReview].text}
                  </p>
                  <div className="text-6xl text-orange-200 absolute -bottom-8 -right-2 font-serif rotate-180">&rdquo;</div>
                </div>
                
                {/* Author */}
                <div className="space-y-2">
                  <p className="text-gray-800 font-semibold text-xl">
                    {reviews[currentReview].author}
                  </p>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-orange-300 to-yellow-300 mx-auto rounded-full"></div>
                </div>
              </div>

              {/* Progress indicator (top-right) */}
              <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-600 shadow-sm">
                {currentReview + 1} / {reviews.length}
              </div>
            </div>

            {/* Navigation dots (outside card) */}
            <div className="flex justify-center gap-3 mt-8">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToReview(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentReview 
                      ? 'w-8 h-3 bg-gradient-to-r from-orange-400 to-orange-500 shadow-lg' 
                      : 'w-3 h-3 bg-orange-200 hover:bg-orange-300 hover:scale-125'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>

            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-200 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-yellow-200 rounded-full opacity-60 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}