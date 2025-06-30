import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

export default function About() {
  return (
    <ScrollArea className="h-screen">
      <div className="min-h-screen bg-white">
        <Header />
        
        {/* Main Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col xl:flex-row gap-8 lg:gap-12 items-start">
            
            {/* Left Side - Image with Overlay Box */}
            <div className="relative flex-shrink-0 w-full xl:w-auto flex justify-center xl:justify-start">
              {/* Orange Blob - Hidden on mobile, visible on larger screens */}
              <div 
                className="absolute z-0 hidden lg:block"
                style={{
                  width: 'clamp(200px, 25vw, 300px)',
                  height: 'clamp(300px, 40vw, 500px)',
                  background: 'linear-gradient(135deg, rgba(255, 140, 0, 0.9) 0%, rgba(255, 180, 50, 0.7) 30%, rgba(255, 220, 120, 0.5) 60%, rgba(255, 255, 200, 0.2) 100%)',
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                  left: 'clamp(-100px, -15vw, -50px)',
                  top: 'clamp(50px, 15vw, 100px)'
                }}
              ></div>
              
              <div 
                className="relative overflow-visible z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-none"
                style={{
                  width: 'clamp(300px, 80vw, 600px)',
                  height: 'clamp(350px, 95vw, 700px)',
                  borderRadius: '33px'
                }}
              >
                <Image
                  src="/Madam.png"
                  alt="About Us - Hope Trust Team Member"
                  fill
                  className="object-cover rounded-[33px]"
                  priority
                  quality={100}
                />
              </div>
              
              {/* We focus on section - Responsive positioning */}
              <div 
                className="absolute p-4 sm:p-6 z-10 hidden lg:block xl:block"
                style={{
                  width: 'clamp(300px, 35vw, 450px)',
                  height: 'auto',
                  minHeight: '200px',
                  background: '#FEF2EB',
                  borderRadius: '33px',
                  boxShadow: '0px 99px 40px rgba(0, 0, 0, 0.01), 0px 56px 33px rgba(0, 0, 0, 0.05), 0px 25px 25px rgba(0, 0, 0, 0.09), 0px 6px 14px rgba(0, 0, 0, 0.1)',
                  bottom: 'clamp(40px, 8vw, 80px)',
                  right: 'clamp(-250px, -25vw, -200px)'
                }}
              >
                <h3 className="text-lg xl:text-xl font-semibold text-gray-900 mb-3 xl:mb-4">
                  We focus on:
                </h3>
                
                <div className="space-y-2 xl:space-y-3">
                  <div className="flex items-center space-x-2 xl:space-x-3">
                    <div className="text-orange-500 font-bold text-base xl:text-lg">››</div>
                    <p className="text-gray-700 text-xs xl:text-sm leading-relaxed">
                      Care that is kind and respectful
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 xl:space-x-3">
                    <div className="text-orange-500 font-bold text-base xl:text-lg">››</div>
                    <p className="text-gray-700 text-xs xl:text-sm leading-relaxed">
                      Involving families
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 xl:space-x-3">
                    <div className="text-orange-500 font-bold text-base xl:text-lg">››</div>
                    <p className="text-gray-700 text-xs xl:text-sm leading-relaxed">
                      Blending global best practices with local understanding
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="space-y-6 sm:space-y-8 xl:-mt-2 w-full xl:w-auto">
              {/* About US Heading */}
              <div className="text-center xl:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  About
                </h1>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-600 italic ml-4 sm:ml-6 lg:ml-8">
                  US
                </h2>
              </div>

              {/* Main Description */}
              <div className="space-y-4 sm:space-y-6 text-center xl:text-left">
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto xl:mx-0">
                  Hope Trust was created to offer a space where recovery feels possible and people feel safe.
                </p>
                
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto xl:mx-0">
                  Our team includes experienced counselors, doctors, and wellness experts, working together to support every person and family we meet.
                </p>
              </div>

              {/* Mobile "We focus on" section - Only visible on mobile/tablet */}
              <div className="block lg:hidden bg-[#FEF2EB] rounded-2xl p-6 mx-4 sm:mx-0">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  We focus on:
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="text-orange-500 font-bold text-lg">››</div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Care that is kind and respectful
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-orange-500 font-bold text-lg">››</div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Involving families
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-orange-500 font-bold text-lg">››</div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Blending global best practices with local understanding
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </ScrollArea>
  );
} 