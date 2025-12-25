'use client';

import React from 'react';
import Header from '@/components/Header';
import { motion, AnimatePresence } from 'motion/react';
import { Bricolage_Grotesque } from 'next/font/google';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const HomeFinalCtaSection = dynamic(
  () => import('@/components/HomeFinalCtaSection')
);

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const contactInfo = [
  {
    gif: '/email.gif',
    staticIcon: <Mail className="w-6 h-6" />,
    label: 'Email Us',
    value: 'frontoffice@hopetrustindia.com',
    href: 'mailto:frontoffice@hopetrustindia.com',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    gif: '/call.gif',
    staticIcon: <Phone className="w-6 h-6" />,
    label: 'Call Us',
    value: '+91 90008 50001 / +91 90007 20003',
    href: 'tel:+919000850001',
    color: 'bg-green-50 text-green-600',
  },
  {
    gif: '/map.gif',
    staticIcon: <MapPin className="w-6 h-6" />,
    label: 'Visit Us',
    value: 'C/o, UCCHVAS Rehabilitation Center, Plot no. 564-A-36-111, Opp. Lotus Pond Road, MLA Colony, Banjara Hills, Hyderabad-500034.',
    href: 'https://www.google.com/maps/dir/?api=1&destination=UCCHVAS+Rehabilitation+Center+Banjara+Hills+Hyderabad',
    color: 'bg-orange-50 text-orange-600',
  },
];

const ContactCard = ({ info, idx }: { info: typeof contactInfo[0], idx: number }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.a
      href={info.href}
      target={info.label === 'Visit Us' ? '_blank' : undefined}
      rel={info.label === 'Visit Us' ? 'noopener noreferrer' : undefined}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay: idx * 0.15,
        ease: [0.22, 1, 0.36, 1] 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        y: -12,
        scale: 1.02,
      }}
      className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-[48px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex flex-col items-center text-center transition-all duration-500 border border-white/50 hover:border-orange-200 hover:shadow-[0_30px_70px_rgba(249,115,22,0.1)] overflow-hidden"
    >
      {/* Background Glow Effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-100/30 rounded-full blur-3xl group-hover:bg-orange-200/40 transition-colors duration-700" />
      
      <div className={`p-5 rounded-3xl mb-6 ${info.color} relative w-20 h-20 flex items-center justify-center shadow-inner`}>
        <AnimatePresence mode="wait">
          {isHovered ? (
            <motion.div
              key="gif"
              initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
              animate={{ opacity: 1, scale: 1.1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="absolute inset-0 flex items-center justify-center p-2"
            >
              <Image 
                src={info.gif} 
                alt={info.label} 
                width={56} 
                height={56} 
                className="object-contain drop-shadow-md"
                unoptimized
              />
            </motion.div>
          ) : (
            <motion.div
              key="static"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center"
            >
              <div className="scale-125">{info.staticIcon}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <h3 className="text-2xl font-bold text-[#00373E] mb-3 group-hover:text-[#F97316] transition-colors duration-300">{info.label}</h3>
      <p className="text-[#486364] leading-relaxed text-lg px-2 group-hover:text-[#00373E] transition-colors duration-300">{info.value}</p>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1.5 bg-orange-500 rounded-full transition-all duration-500 group-hover:w-1/3" />
    </motion.a>
  );
};

const CustomSubmitButton = ({ status, text }: { status: 'idle' | 'sending' | 'sent', text: string }) => {
  return (
    <div className="custom-button-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-button-wrapper .button {
          --primary: #00373E;
          --bg-solid: #00373E;
          --neutral-1: #004d57;
          --neutral-2: #00373E;
          --radius: 14px;

          cursor: pointer;
          border-radius: var(--radius);
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
          border: none;
          box-shadow: 0 0.5px 0.5px 1px rgba(255, 255, 255, 0.1),
            0 10px 20px rgba(0, 0, 0, 0.2), 0 4px 5px 0px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          transition: all 0.3s ease;
          min-width: 200px;
          padding: 20px;
          height: 68px;
          font-family: inherit;
          font-style: normal;
          font-size: 18px;
          font-weight: 600;
          background: var(--bg-solid);
          width: 100%;
        }
        .custom-button-wrapper .button:hover {
          transform: scale(1.02);
          box-shadow: 0 0 1px 2px rgba(255, 255, 255, 0.3),
            0 15px 30px rgba(0, 0, 0, 0.3), 0 10px 3px -3px rgba(0, 0, 0, 0.04);
        }
        .custom-button-wrapper .button:active {
          transform: scale(1);
          box-shadow: 0 0 1px 2px rgba(255, 255, 255, 0.3),
            0 10px 3px -3px rgba(0, 0, 0, 0.2);
        }
        .custom-button-wrapper .button:after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: var(--radius);
          border: 2.5px solid transparent;
          background: linear-gradient(var(--neutral-1), var(--neutral-2)) padding-box,
            linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.45))
              border-box;
          z-index: 0;
          transition: all 0.4s ease;
        }
        .custom-button-wrapper .button:hover::after {
          transform: scale(1.05, 1.1);
          box-shadow: inset 0 -1px 3px 0 rgba(255, 255, 255, 1);
        }
        .custom-button-wrapper .button::before {
          content: "";
          inset: 7px 6px 6px 6px;
          position: absolute;
          background: linear-gradient(to top, var(--neutral-1), var(--neutral-2));
          border-radius: 30px;
          filter: blur(0.5px);
          z-index: 2;
        }
        .custom-button-wrapper .state p {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0;
          color: white;
        }
        .custom-button-wrapper .state .icon {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          transform: scale(1.25);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .custom-button-wrapper .state .icon svg {
          overflow: visible;
        }

        .custom-button-wrapper .outline {
          position: absolute;
          border-radius: inherit;
          overflow: hidden;
          z-index: 1;
          opacity: 0;
          transition: opacity 0.4s ease;
          inset: -2px -3.5px;
        }
        .custom-button-wrapper .outline::before {
          content: "";
          position: absolute;
          inset: -100%;
          background: conic-gradient(
            from 180deg,
            transparent 60%,
            white 80%,
            transparent 100%
          );
          animation: spin 2s linear infinite;
          animation-play-state: paused;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .custom-button-wrapper .button:hover .outline {
          opacity: 1;
        }
        .custom-button-wrapper .button:hover .outline::before {
          animation-play-state: running;
        }

        .custom-button-wrapper .state p span {
          display: block;
          opacity: 0;
          animation: slideDown 0.8s ease forwards calc(var(--i) * 0.03s);
        }
        .custom-button-wrapper .button:hover p span {
          opacity: 1;
          animation: wave 0.5s ease forwards calc(var(--i) * 0.02s);
        }
        .custom-button-wrapper .button--sent p span,
        .custom-button-wrapper .button--sending p span {
          opacity: 1;
          animation: disapear 0.6s ease forwards calc(var(--i) * 0.03s);
        }
        @keyframes wave {
          30% { opacity: 1; transform: translateY(4px) translateX(0) rotate(0); }
          50% { opacity: 1; transform: translateY(-3px) translateX(0) rotate(0); color: #F97316; }
          100% { opacity: 1; transform: translateY(0) translateX(0) rotate(0); }
        }
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-20px) translateX(5px) rotate(-90deg); color: #F97316; filter: blur(5px); }
          30% { opacity: 1; transform: translateY(4px) translateX(0) rotate(0); filter: blur(0); }
          50% { opacity: 1; transform: translateY(-3px) translateX(0) rotate(0); }
          100% { opacity: 1; transform: translateY(0) translateX(0) rotate(0); }
        }
        @keyframes disapear {
          from { opacity: 1; }
          to { opacity: 0; transform: translateX(5px) translateY(20px); color: #F97316; filter: blur(5px); }
        }

        .custom-button-wrapper .state--default .icon svg {
          animation: land 0.6s ease forwards;
        }
        .custom-button-wrapper .button:hover .state--default .icon {
          transform: rotate(45deg) scale(1.25);
        }
        .custom-button-wrapper .button--sent .state--default svg,
        .custom-button-wrapper .button--sending .state--default svg {
          animation: takeOff 0.8s linear forwards;
        }
        .custom-button-wrapper .button--sent .state--default .icon,
        .custom-button-wrapper .button--sending .state--default .icon {
          transform: rotate(0) scale(1.25);
        }
        @keyframes takeOff {
          0% { opacity: 1; }
          60% { opacity: 1; transform: translateX(70px) rotate(45deg) scale(2); }
          100% { opacity: 0; transform: translateX(160px) rotate(45deg) scale(0); }
        }
        @keyframes land {
          0% { transform: translateX(-60px) translateY(30px) rotate(-50deg) scale(2); opacity: 0; filter: blur(3px); }
          100% { transform: translateX(0) translateY(0) rotate(0); opacity: 1; filter: blur(0); }
        }

        .custom-button-wrapper .state--default .icon:before {
          content: "";
          position: absolute;
          top: 50%;
          height: 2px;
          width: 0;
          left: -5px;
          background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5));
        }
        .custom-button-wrapper .button--sent .state--default .icon:before,
        .custom-button-wrapper .button--sending .state--default .icon:before {
          animation: contrail 0.8s linear forwards;
        }
        @keyframes contrail {
          0% { width: 0; opacity: 1; }
          8% { width: 15px; }
          60% { opacity: 0.7; width: 80px; }
          100% { opacity: 0; width: 160px; }
        }

        .custom-button-wrapper .state {
          padding-left: 29px;
          z-index: 2;
          display: flex;
          position: relative;
        }
        .custom-button-wrapper .state--default span:nth-child(4) {
          margin-right: 5px;
        }
        .custom-button-wrapper .state--sent {
          display: none;
        }
        .custom-button-wrapper .state--sent svg {
          transform: scale(1.25);
          margin-right: 8px;
        }
        .custom-button-wrapper .button--sent .state--default,
        .custom-button-wrapper .button--sending .state--default {
          position: absolute;
        }
        .custom-button-wrapper .button--sent .state--sent {
          display: flex;
        }
        .custom-button-wrapper .button--sending .state--sent {
          display: none;
        }
        .custom-button-wrapper .button--sent .state--sent span {
          opacity: 0;
          animation: slideDown 0.8s ease forwards calc(var(--i) * 0.2s);
        }
        .custom-button-wrapper .button--sent .state--sent .icon svg {
          opacity: 0;
          animation: appear 1.2s ease forwards 0.8s;
        }
        @keyframes appear {
          0% { opacity: 0; transform: scale(4) rotate(-40deg); color: #F97316; filter: blur(4px); }
          30% { opacity: 1; transform: scale(0.6); filter: blur(1px); }
          50% { opacity: 1; transform: scale(1.2); filter: blur(0); }
          100% { opacity: 1; }
        }
      `}} />
      <button 
        type="submit"
        disabled={status !== 'idle'}
        className={`button ${status === 'sent' ? 'button--sent' : status === 'sending' ? 'button--sending' : ''}`}
      >
        <div className="outline" />
        <div className="state state--default">
          <div className="icon">
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g style={{filter: 'url(#shadow)'}}>
                <path d="M14.2199 21.63C13.0399 21.63 11.3699 20.8 10.0499 16.83L9.32988 14.67L7.16988 13.95C3.20988 12.63 2.37988 10.96 2.37988 9.78001C2.37988 8.61001 3.20988 6.93001 7.16988 5.60001L15.6599 2.77001C17.7799 2.06001 19.5499 2.27001 20.6399 3.35001C21.7299 4.43001 21.9399 6.21001 21.2299 8.33001L18.3999 16.82C17.0699 20.8 15.3999 21.63 14.2199 21.63ZM7.63988 7.03001C4.85988 7.96001 3.86988 9.06001 3.86988 9.78001C3.86988 10.5 4.85988 11.6 7.63988 12.52L10.1599 13.36C10.3799 13.43 10.5599 13.61 10.6299 13.83L11.4699 16.35C12.3899 19.13 13.4999 20.12 14.2199 20.12C14.9399 20.12 16.0399 19.13 16.9699 16.35L19.7999 7.86001C20.3099 6.32001 20.2199 5.06001 19.5699 4.41001C18.9199 3.76001 17.6599 3.68001 16.1299 4.19001L7.63988 7.03001Z" fill="currentColor" />
                <path d="M10.11 14.4C9.92005 14.4 9.73005 14.33 9.58005 14.18C9.29005 13.89 9.29005 13.41 9.58005 13.12L13.16 9.53C13.45 9.24 13.93 9.24 14.22 9.53C14.51 9.82 14.51 10.3 14.22 10.59L10.64 14.18C10.5 14.33 10.3 14.4 10.11 14.4Z" fill="currentColor" />
              </g>
              <defs>
                <filter id="shadow">
                  <feDropShadow dx={0} dy={1} stdDeviation="0.6" floodOpacity="0.5" />
                </filter>
              </defs>
            </svg>
          </div>
          <p>
            {text.replace(/\s+/g, "").split("").map((char, i) => (
              <span key={i} style={{ '--i': i } as React.CSSProperties}>{char}</span>
            ))}
          </p>
        </div>
        <div className="state state--sent">
          <div className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="1em" width="1em" strokeWidth="0.5px" stroke="black">
              <g style={{filter: 'url(#shadow)'}}>
                <path fill="currentColor" d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z" />
                <path fill="currentColor" d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z" />
              </g>
            </svg>
          </div>
          <p>
            {"Sent".split("").map((char, i) => (
              <span key={i} style={{ '--i': i + 5 } as React.CSSProperties}>{char}</span>
            ))}
          </p>
        </div>
      </button>
    </div>
  );
};

export default function ContactPage() {
  const [formStatus, setFormStatus] = React.useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    // Simulate sending
    setTimeout(() => setFormStatus('sent'), 1500);
  };

  return (
    <>
      <Header />
      <main className={`${bricolage.className} min-h-screen pt-20 bg-white`}>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-[#F7F5EF]">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
            <Image src="/Asset 10.png" alt="Decorative" fill className="object-contain object-right-top" />
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-[#00373E] mb-6"
            >
              Get in Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-[#486364] max-w-2xl mx-auto"
            >
              In-Clinic / Online Appointments
              <br />
              <span className="text-sm font-medium opacity-80">
                (Office Hours 9 AM – 8 PM Monday to Saturday)
              </span>
            </motion.p>
          </div>
        </section>

        {/* Training Enquiries Strip */}
        <section className="bg-[#00373E] py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Mail className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/60">Training Enquiries</p>
                  <a href="mailto:training@hopetrustindia.com" className="font-semibold hover:text-orange-400 transition-colors">
                    training@hopetrustindia.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Phone className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/60">Contact Number</p>
                  <a href="tel:+919866822240" className="font-semibold hover:text-orange-400 transition-colors">
                    +91 98668 22240
                  </a>
                </div>
              </div>
              <div className="hidden md:block h-8 w-px bg-white/20"></div>
              <div className="text-sm text-white/80">
                Professional courses and workshops
              </div>
            </div>
          </div>
        </section>

        {/* Contact Info Grid */}
        <section className="py-16 -mt-12 relative z-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactInfo.map((info, idx) => (
                <ContactCard key={info.label} info={info} idx={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* Form and Map Section */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Form Side */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-[#FFF5ED] p-8 md:p-12 rounded-[48px]"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-[#00373E] mb-4">Send us a Message</h2>
                  <p className="text-[#486364]">Fill out the form below and our team will get back to you shortly.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#6A8181] ml-2">Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-white border-2 border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] px-6 py-4 rounded-2xl focus:outline-none focus:border-orange-500 focus:shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#6A8181] ml-2">Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full bg-white border-2 border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] px-6 py-4 rounded-2xl focus:outline-none focus:border-orange-500 focus:shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#6A8181] ml-2">Email Address</label>
                    <input
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-white border-2 border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] px-6 py-4 rounded-2xl focus:outline-none focus:border-orange-500 focus:shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#6A8181] ml-2">Your Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How can we help you today?"
                      className="w-full bg-white border-2 border-transparent shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] px-6 py-4 rounded-2xl focus:outline-none focus:border-orange-500 focus:shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all duration-300 resize-none"
                    />
                  </div>

                  <div className="md:col-span-2 pt-4 flex justify-center lg:justify-start">
                    <CustomSubmitButton status={formStatus} text="Send Message" />
                  </div>
                </form>
              </motion.div>

              {/* Map/Info Side */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <a 
                  href="https://www.google.com/maps/dir/?api=1&destination=UCCHVAS+Rehabilitation+Center+Banjara+Hills+Hyderabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group relative rounded-[48px] overflow-hidden h-[400px] border-8 border-[#F7F5EF] shadow-lg grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer"
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.827258327178!2d78.423985!3d17.41725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb972e9a366667%3A0x7d6c6e76d99a4666!2sHope%20Trust!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Hope Trust Location"
                    className="pointer-events-none"
                  ></iframe>
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-[#00373E] text-white px-6 py-2 rounded-full font-bold shadow-xl flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Get Directions
                    </div>
                  </div>
                </a>

                <div className="bg-[#00373E] p-8 md:p-10 rounded-[40px] text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <MessageSquare className="text-orange-400" />
                      <h3 className="text-2xl font-bold">24/7 Support</h3>
                    </div>
                    <p className="text-white/80 mb-6 leading-relaxed">
                      Our helpline is available round the clock for emergencies. We are committed to providing immediate support to those in crisis.
                    </p>
                    <a
                      href="tel:+919000850001"
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all font-semibold"
                    >
                      <Phone className="w-5 h-5 text-orange-400" />
                      Appointments: +91 90008 50001
                    </a>
                  </div>
                  {/* Decorative element */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <HomeFinalCtaSection />
      </main>
    </>
  );
}

