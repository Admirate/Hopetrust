"use client";

import Image from 'next/image';
import { useScrollAnimation, fadeInUp, fadeInLeft, fadeInRight } from '@/hooks/useScrollAnimation';

const ServicesSection = () => {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: card1Ref, isVisible: card1Visible } = useScrollAnimation();
  const { elementRef: card2Ref, isVisible: card2Visible } = useScrollAnimation();
  const { elementRef: card3Ref, isVisible: card3Visible } = useScrollAnimation();
  const { elementRef: buttonRef, isVisible: buttonVisible } = useScrollAnimation();

  return (
    <section className="py-16 bg-white relative overflow-hidden min-h-screen flex items-center">
      {/* Pink lines background */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/lines.png"
          alt="Decorative background lines"
          fill
          className="object-cover opacity-30"
          priority
        />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <h2 ref={titleRef} className="text-4xl lg:text-5xl font-bold text-center mb-12" style={fadeInUp(titleVisible, 200)}>
          What We <span className="text-orange-500">Offer</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1: Therapy and Counseling */}
          <div ref={card1Ref} className="bg-white rounded-2xl shadow-lg overflow-hidden" style={fadeInLeft(card1Visible, 300)}>
            <div className="relative h-96">
              <Image src="/therapy.png" alt="Therapy and Counseling" fill className="object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                <div>
                  <h3 className="text-white font-bold text-xl flex items-center">
                    THERAPY AND COUNSELING <span className="ml-2">›</span>
                  </h3>
                  <p className="text-gray-200 mt-1">Emotional well-being, relationships, life challenges</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Home-based Recovery Programs */}
          <div ref={card2Ref} className="bg-white rounded-2xl shadow-lg overflow-hidden" style={fadeInUp(card2Visible, 400)}>
            <div className="relative h-96">
              <Image src="/children.png" alt="Home-based Recovery Programs" fill className="object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                <div>
                  <h3 className="text-white font-bold text-xl flex items-center">
                    HOME-BASED RECOVERY PROGRAMS <span className="ml-2">›</span>
                  </h3>
                  <p className="text-gray-200 mt-1">Flexible, discreet support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Addiction Recovery Care */}
          <div ref={card3Ref} className="bg-white rounded-2xl shadow-lg overflow-hidden" style={fadeInRight(card3Visible, 500)}>
            <div className="relative h-96">
              <Image src="/addiction.png" alt="Addiction Recovery Care" fill className="object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                <div>
                  <h3 className="text-white font-bold text-xl flex items-center">
                    ADDICTION RECOVERY CARE <span className="ml-2">›</span>
                  </h3>
                  <p className="text-gray-200 mt-1">Residential and outpatient</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={buttonRef} className="text-center mt-12" style={fadeInUp(buttonVisible, 600)}>
          <button className="bg-white text-gray-800 px-8 py-3 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors font-medium">
            Our Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
