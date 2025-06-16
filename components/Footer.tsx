"use client";

import { Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [showChat, setShowChat] = useState(false);

  const navigationLinks = [
    { title: 'About Us', href: '#' },
    { title: 'Services', href: '#' },
    { title: 'Training', href: '#' },
    { title: 'Blog', href: '#' },
    { title: 'FAQs', href: '#' },
    { title: 'Contact Us', href: '#' }
  ];

  const legalLinks = [
    { title: 'Sitemap', href: '#' },
    { title: 'Terms & Conditions', href: '#' },
    { title: 'Privacy Policy', href: '#' },
    { title: 'Cancellation/Consent', href: '#' }
  ];

  const socialLinks = [
    { title: 'WhatsApp', href: '#', icon: '📱' },
    { title: 'Instagram', href: '#', icon: '📷' },
    { title: 'Facebook', href: '#', icon: '📘' },
    { title: 'LinkedIn', href: '#', icon: '💼' },
    { title: 'YouTube', href: '#', icon: '📺' }
  ];

  return (
    <footer className="bg-gray-800 text-white">
      {/* Newsletter Section */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Subscribe to our newsletter
              </h3>
              <p className="text-gray-600">
                Get the latest updates on mental health tips and resources
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[250px]"
              />
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <Phone size={20} className="text-orange-500" />
                <h4 className="text-lg font-semibold">Call Us Today</h4>
              </div>
              
              <div className="space-y-3">
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-orange-500" />
                  +91 90008 50001
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-orange-500" />
                  +91 90007 20003
                </p>
                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-orange-500" />
                  (Office Hours 10:00 am - 7:00 pm)
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-orange-500" />
                  frontoffice@hopetrustindia.com
                </p>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-3 pt-4">
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-200">
                  <span className="text-lg">📷</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-200">
                  <span className="text-lg">📘</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-200">
                  <span className="text-lg">💼</span>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors duration-200">
                  <span className="text-lg">📺</span>
                </a>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-500 mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {navigationLinks.map((link) => (
                  <li key={link.title}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-500 mb-6">Legal</h4>
              <ul className="space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.title}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-orange-500 mb-6">Follow Us</h4>
              <ul className="space-y-3">
                {socialLinks.map((link) => (
                  <li key={link.title}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
                    >
                      <span>{link.icon}</span>
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400">
            Copyright © 2025 Hope Trust
          </p>
        </div>
      </div>

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowChat(!showChat)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
        >
          <MessageCircle size={20} />
          <span className="hidden sm:inline">Need Help? Chat with us</span>
          <span className="sm:hidden">Chat</span>
        </button>
      </div>

      {/* Chat Widget Placeholder */}
      {showChat && (
        <div className="fixed bottom-20 right-6 bg-white rounded-lg shadow-xl p-4 w-80 z-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-gray-800 font-semibold">Chat with us</h4>
            <button 
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Hi! How can we help you today?
          </p>
          <div className="flex gap-2">
            <a 
              href="https://wa.me/919000850001" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
            >
              WhatsApp
            </a>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200">
              Call Now
            </button>
          </div>
        </div>
      )}
    </footer>
  );
}