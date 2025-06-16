"use client";

import { Heart, Brain, Shield, Users } from 'lucide-react';
import Image from 'next/image';
import { useScrollAnimation, fadeInUp, scaleIn } from '@/hooks/useScrollAnimation';

export default function ServicesSection() {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { elementRef: servicesRef, isVisible: servicesVisible } = useScrollAnimation({ threshold: 0.1 });

  const services = [
    {
      icon: Heart,
      title: "THERAPY/COUNSELLING",
      description: "Individual, group, and family therapy sessions with licensed professionals in a safe, supportive environment.",
      color: "from-pink-400 to-rose-500",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    {
      icon: Brain,
      title: "PSYCHIATRIC CONSULTATIONS",
      description: "Expert psychiatric evaluations and medication management with board-certified psychiatrists.",
      color: "from-blue-400 to-indigo-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Shield,
      title: "RECOVERY & DE-ADDICTION",
      description: "Comprehensive addiction recovery programs with personalized treatment plans and ongoing support.",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: Users,
      title: "CHILD & ADOLESCENT CARE",
      description: "Specialized mental health services for children and teenagers with age-appropriate approaches.",
      color: "from-orange-400 to-amber-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
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
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-3xl ${service.bgColor} ${service.borderColor} border-2 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden`}
                style={scaleIn(servicesVisible, 200 + index * 150)}
              >
                {/* Background gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon container */}
                <div className={`relative w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="text-white" size={32} />
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Service image */}
                <div className="mb-6 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300 h-32 relative">
                  <Image
                    src={`https://images.pexels.com/photos/${
                      index === 0 ? '4098369' : 
                      index === 1 ? '4099235' : 
                      index === 2 ? '3182832' : '4195504'
                    }/pexels-photo-${
                      index === 0 ? '4098369' : 
                      index === 1 ? '4099235' : 
                      index === 2 ? '3182832' : '4195504'
                    }.jpeg?auto=compress&cs=tinysrgb&w=800`}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300"></div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {service.description}
                  </p>
                </div>

                {/* Decorative corner accent */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${service.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                     style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
              </div>
            );
          })}
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