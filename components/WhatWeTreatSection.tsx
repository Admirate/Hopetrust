"use client";

import Image from 'next/image';
import { useScrollAnimation, fadeInUp, scaleIn } from '@/hooks/useScrollAnimation';

export default function WhatWeTreatSection() {
  const treatmentAreas = [
    {
      title: "ALCOHOL AND SUBSTANCE USE",
      icon: (
        <Image
          src="/alcohol.png"
          alt="Alcohol and Substance Use"
          width={84}
          height={84}
          className="object-contain"
        />
      )
    },
    {
      title: "BEHAVIORAL ADDICTIONS (GAMING, GAMBLING)",
      icon: (
        <Image
          src="/gambling.png"
          alt="Behavioral Addictions - Gaming, Gambling"
          width={84}
          height={84}
          className="object-contain"
        />
      )
    },
    {
      title: "EMOTIONAL AND MENTAL HEALTH CONCERNS",
      icon: (
        <Image
          src="/heart.png"
          alt="Emotional and Mental Health Concerns"
          width={84}
          height={84}
          className="object-contain"
        />
      )
    },
    {
      title: "RELATIONSHIP AND FAMILY CHALLENGES",
      icon: (
        <Image
          src="/social.png"
          alt="Relationship and Family Challenges"
          width={84}
          height={84}
          className="object-contain"
        />
      )
    }
  ];

  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const cardRefs = treatmentAreas.map(() => useScrollAnimation());

  return (
    <section className="py-12 lg:py-16 bg-white min-h-screen flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div ref={titleRef} className="text-center mb-12" style={fadeInUp(titleVisible, 200)}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FF6B2C] tracking-wide">
              WHAT WE TREAT
            </h2>
          </div>

          {/* Treatment Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatmentAreas.map((area, index) => (
              <div
                key={index}
                ref={cardRefs[index].elementRef}
                className="text-center hover:scale-105 transition-transform duration-300"
                style={{
                  background: '#FEFBDC',
                  boxShadow: '0px 99px 40px rgba(0, 0, 0, 0.01), 0px 56px 33px rgba(0, 0, 0, 0.05), 0px 25px 25px rgba(0, 0, 0, 0.09), 0px 6px 14px rgba(0, 0, 0, 0.1)',
                  borderRadius: '38px',
                  padding: '24px',
                  minHeight: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...scaleIn(cardRefs[index].isVisible, 300 + (index * 150))
                }}
              >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  {area.icon}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-gray-800 leading-tight tracking-wide">
                  {area.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 