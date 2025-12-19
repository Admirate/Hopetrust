'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type NavItem = {
  label: string;
  href: string;
  hasDropdown?: boolean;
};

const leftNavItems: NavItem[] = [
  { label: 'About us', href: '/about', hasDropdown: false },
  { label: 'Mental Health', href: '/mental-health', hasDropdown: false },
  { label: 'Addiction Services', href: '/addiction', hasDropdown: false },
  { label: 'For Companies', href: '#', hasDropdown: false },
];

const rightNavItems: NavItem[] = [
  { label: 'Blogs', href: '/blogs', hasDropdown: false },
  { label: 'Resources', href: '#', hasDropdown: true },
  { label: 'Contact Us', href: '#', hasDropdown: false },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const allItems: NavItem[] = [...leftNavItems, ...rightNavItems];

  const renderNavItem = (item: NavItem) => {
    // Robust check for active state:
    // 1. Ignore '#' links
    // 2. Exact match (ignoring trailing slash)
    // 3. Sub-path match (e.g. /about/team matches /about)
    const normalizePath = (path: string) => path.replace(/\/$/, '') || '/';
    const currentPath = normalizePath(pathname);
    const targetPath = normalizePath(item.href);
    
    const isActive = 
      item.href !== '#' && 
      (currentPath === targetPath || (currentPath.startsWith(`${targetPath}/`)));

    return (
      <Link
        key={item.label}
        href={item.href}
        className={`group relative flex items-center gap-1 text-sm md:text-base font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
          isActive ? 'text-orange-500' : 'text-gray-800 hover:text-orange-500'
        }`}
      >
        <span>{item.label}</span>
        {item.hasDropdown && (
          <ChevronDown className="h-3 w-3 md:h-3.5 md:w-3.5 stroke-[2]" />
        )}
        <span 
          className={`absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 rounded-full bg-orange-500 transition-transform duration-300 ease-out group-hover:scale-x-100 ${
            isActive ? 'scale-x-100' : ''
          }`} 
        />
      </Link>
    );
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 md:py-5">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="relative flex-shrink-0">
              <Image
                src="/logo1.png"
                alt="Hope Trust Logo"
                width={72}
                height={72}
                className="h-12 w-12 md:h-16 md:w-16 object-contain"
                priority
                quality={100}
              />
            </Link>
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
              {allItems.map((item) => {
                const normalizePath = (path: string) => path.replace(/\/$/, '') || '/';
                const currentPath = normalizePath(pathname);
                const targetPath = normalizePath(item.href);
                
                const isActive = 
                  item.href !== '#' && 
                  (currentPath === targetPath || (currentPath.startsWith(`${targetPath}/`)));

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 text-base font-semibold transition-colors ${
                      isActive
                        ? 'text-orange-500 bg-gray-50'
                        : 'text-gray-800 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown className="h-4 w-4 stroke-[2]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}