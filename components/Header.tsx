'use client';

import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type NavItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
};

const leftNavItems: NavItem[] = [
  { label: 'About Us', href: '#', hasDropdown: true },
  { label: 'Mental health', href: '#', hasDropdown: true },
  { label: 'Addiction services', href: '#', hasDropdown: true },
  { label: 'For companies', href: '#', hasDropdown: true },
];

const rightNavItems: NavItem[] = [
  { label: 'Blogs', href: '#', hasDropdown: false },
  { label: 'JOIN US', href: '#', hasDropdown: true },
  { label: 'RESOURCES', href: '#', hasDropdown: true },
  { label: 'CONTACT US', href: '#', hasDropdown: true },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const allItems: NavItem[] = [...leftNavItems, ...rightNavItems];

  const renderNavItem = (item: NavItem) => (
    <Link
      key={item.label}
      href={item.href}
      className="flex items-center gap-1 text-xs md:text-sm text-gray-800 hover:text-orange-500 font-medium transition-colors duration-200"
    >
      <span>{item.label}</span>
      {item.hasDropdown && (
        <ChevronDown className="h-3 w-3 md:h-3.5 md:w-3.5 stroke-[2]" />
      )}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 md:py-5">
          {/* Logo */}
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <Image
                src="/logo1.png"
                alt="Hope Trust Logo"
                width={72}
                height={72}
                className="h-12 w-12 md:h-16 md:w-16 object-contain"
                priority
                quality={100}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden flex-1 items-center justify-between lg:flex">
            <div className="ml-6 flex items-center gap-6 xl:gap-10">
              {leftNavItems.map(renderNavItem)}
            </div>
            <div className="flex items-center gap-6 xl:gap-10">
              {rightNavItems.map(renderNavItem)}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            className="rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-orange-500 lg:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 lg:hidden">
            <div className="space-y-1 py-4">
              {allItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 text-sm text-gray-800 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className="h-4 w-4 stroke-[2]" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}