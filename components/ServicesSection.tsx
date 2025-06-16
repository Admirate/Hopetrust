"use client";

import { useScrollAnimation, fadeInUp, scaleIn } from '@/hooks/useScrollAnimation';

export default function ServicesSection() {
  const { elementRef: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.2 });
  const { elementRef: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.1 });

  const services = [
    {
      title: "THERAPY AND COUNSELLING",
      image: "https://images.pexels.com/photos/7176319/pexels-photo-7176319.jpeg?auto=compress&cs=tinysrgb&w=600",
      alt: "Therapy session"
    },
    {
      title: "PSYCHIATRIC CONSULTATIONS", 
      image: "https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=600",
      alt: "Psychiatric consultation"
    },
    {
      title: "RECOVERY AND DE-ADDICTION",
      image: "https://images.pexels.com/photos/7176030/pexels-photo-7176030.jpeg?auto=compress&cs=tinysrgb&w=600", 
      alt: "Recovery support"
    },
    {
      title: "CARE FOR CHILDREN AND ADOLESCENTS",
      image: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=600",
      alt: "Child therapy"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className="text-center mb-16"
          style={fadeInUp(headerVisible, 200)}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-orange-500">SUPPORT</span> <span className="text-gray-600">WE OFFER</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Whatever you are facing, you do not have to go through it alone
          </p>
        </div>

        {/* Services Grid */}
        <div 
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              style={{
                ...scaleIn(gridVisible, 400 + (index * 150)),
              }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-gray-800 text-sm leading-tight">
                  {service.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}