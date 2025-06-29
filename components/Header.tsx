"use client";

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    'What Do We Treat',
    'About Us', 
    'Services',
    'Training',
    'Gallery',
    'Blog',
    'FAQS',
    'Contact Us'
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              {/* Custom Logo Image - Optimized for clarity only */}
              <Image
                src="/logo.png"
                alt="Hope Trust Logo"
                width={80}
                height={80}
                className="object-contain w-20 h-20"
                priority={true}
                quality={100}
                style={{
                  imageRendering: 'crisp-edges',
                  filter: 'contrast(1.15) brightness(1.05) saturate(1.1)',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                } as React.CSSProperties}
                onError={(e) => {
                  // Fallback to original design if custom logo fails to load
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              
              {/* Fallback logo (original design) - hidden by default */}
              <div 
                className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-300"
                style={{ display: 'none' }}
              >
                <div className="text-center">
                  <div className="text-white font-bold text-xs leading-tight">
                    HOPE<br />TRUST
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-12">
            {navItems.map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200 text-sm px-4 py-3 rounded-lg hover:bg-gray-50"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-3 rounded-md text-gray-700 hover:text-orange-500 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200">
            <div className="py-6 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block px-6 py-4 text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}