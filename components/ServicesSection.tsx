"use client";

import Image from 'next/image';
import { useScrollAnimation, fadeInUp, scaleIn } from '@/hooks/useScrollAnimation';

export default function ServicesSection() {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { elementRef: servicesRef, isVisible: servicesVisible } = useScrollAnimation({ threshold: 0.1 });

  const services = [
    {
      title: "THERAPY AND COUNSELING",
      description: "Individual, group, and family therapy sessions with licensed professionals in a safe, supportive environment.",
      imageUrl: "https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Two women having a counseling session"
    },
    {
      title: "PSYCHIATRIC CONSULTATIONS",
      description: "Expert psychiatric evaluations and medication management with board-certified psychiatrists.",
      imageUrl: "https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Professional psychiatric consultation"
    },
    {
      title: "RECOVERY AND DE-ADDICTION",
      description: "Comprehensive addiction recovery programs with personalized treatment plans and ongoing support.",
      imageUrl: "https://images.pexels.com/photos/7176319/pexels-photo-7176319.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Recovery support and counseling"
    },
    {
      title: "CARE FOR CHILDREN AND ADOLESCENTS",
      description: "Specialized mental health services for children and teenagers with age-appropriate approaches.",
      imageUrl: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800",
      alt: "Family therapy with children and adolescents"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="text-center mb-20"
          style={fadeInUp(headerVisible, 200)}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              OUR SERVICES
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive mental health services tailored to meet your unique needs. 
            We provide professional, compassionate care in a supportive environment.
          </p>
        </div>

        <div 
          ref={servicesRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white"
              style={scaleIn(servicesVisible, 200 + index * 150)}
            >
              {/* Service image */}
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={service.imageUrl}
                  alt={service.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-10 py-4 rounded-full text-lg hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            BOOK A SESSION TODAY
          </button>
        </div>
      </div>
    </section>
  );
}