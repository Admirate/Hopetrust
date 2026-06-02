'use client';

import React from 'react';
import Header from '@/components/Header';
import { motion } from 'motion/react';
import { Bricolage_Grotesque } from 'next/font/google';
import { MapPin, MessageSquare } from 'lucide-react';
import dynamic from 'next/dynamic';
import { siteConfig } from '@/lib/config';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { z } from 'zod';

const Footer = dynamic(() => import('@/components/Footer'));
const ScrollingTextBanner = dynamic(() => import('@/components/ScrollingTextBanner'));

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const contactSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export default function ContactPage() {
  const [formStatus, setFormStatus] = React.useState<'idle' | 'sending' | 'sent'>('idle');
  const [formData, setFormData] = React.useState({
    full_name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setFieldErrors(errors);
      toast.error(result.error.errors[0].message);
      return;
    }
    setFieldErrors({});
    setFormStatus('sending');
    try {
      const [supabaseResult] = await Promise.allSettled([
        supabase.from('contact_submissions').insert(result.data),
        fetch('/__forms.html', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ 'form-name': 'contact', ...result.data }).toString(),
        }),
      ]);
      if (supabaseResult.status === 'fulfilled' && supabaseResult.value.error) {
        throw supabaseResult.value.error;
      }
      setFormStatus('sent');
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ full_name: '', phone: '', email: '', message: '' });
    } catch {
      setFormStatus('idle');
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <Header />
      {/* Hidden form for Netlify build-time detection */}
      <form name="contact" data-netlify="true" netlify-honeypot="bot-field" hidden>
        <input name="bot-field" />
        <input name="full_name" />
        <input name="phone" />
        <input name="email" />
        <textarea name="message" />
      </form>

      <main className={`${bricolage.className} min-h-screen pt-20`}>

        {/* ── Hero: orange banner ── */}
        <section className="bg-[#ED7428] py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-[#00373E]"
            >
              Get in Touch
            </motion.h1>
          </div>
        </section>

        {/* ── Appointment info + Contact cards ── */}
        <section className="bg-[#F7F5EF] py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center mb-10 sm:mb-14"
            >
              <p className="text-base sm:text-lg lg:text-[24px] font-semibold text-[#00373E]">
                In-Clinic / Online Appointments
              </p>
              <p className="text-sm sm:text-base lg:text-[20px] text-[#486364] mt-1">
                Office Hours 10 AM – 7 PM (IST) (Monday to Saturday)
                <br />
                Except Holidays
              </p>
            </motion.div>

            {/* Contact cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-3xl mx-auto">
              <motion.a
                href={`mailto:${siteConfig.contact.email}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex flex-col items-center justify-center bg-white border border-gray-300 rounded-2xl py-6 sm:py-8 px-4 text-center hover:shadow-lg hover:border-[#00373E] transition-all duration-300"
              >
                <span className="text-lg sm:text-xl lg:text-[24px] font-bold text-[#00373E]">Email</span>
                <span className="text-sm sm:text-base text-[#486364] mt-1">Frontoffice</span>
              </motion.a>

              <motion.a
                href="tel:+919000850001"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex flex-col items-center justify-center bg-white border border-gray-300 rounded-2xl py-6 sm:py-8 px-4 text-center hover:shadow-lg hover:border-[#00373E] transition-all duration-300"
              >
                <span className="text-lg sm:text-xl lg:text-[24px] font-bold text-[#00373E]">Call us</span>
                <span className="text-sm sm:text-base text-[#486364] mt-1">Frontoffice</span>
              </motion.a>

              <motion.a
                href={siteConfig.contact.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-col items-center justify-center bg-white border border-gray-300 rounded-2xl py-6 sm:py-8 px-4 text-center hover:shadow-lg hover:border-[#00373E] transition-all duration-300"
              >
                <span className="text-lg sm:text-xl lg:text-[24px] font-bold text-[#00373E]">Visit Us</span>
                <span className="text-sm sm:text-base text-[#486364] mt-1">Frontoffice</span>
              </motion.a>
            </div>
          </div>
        </section>

        {/* ── Training Enquiries ── */}
        <section className="bg-[#00373E] py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl px-6 sm:px-12 text-center"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#ED7428] mb-2">
              Training enquiries
            </h2>
            <p className="text-white/80 text-sm sm:text-base lg:text-[20px] mb-8">
              Professional courses and workshops
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <a
                href={`mailto:${siteConfig.contact.trainingEmail}`}
                className="flex items-center justify-center bg-white rounded-2xl py-5 px-10 sm:px-14 text-center hover:shadow-lg transition-all duration-300 min-w-[160px]"
              >
                <span className="text-base sm:text-lg lg:text-[24px] font-bold text-[#00373E]">Email</span>
              </a>
              <a
                href="tel:+919866822240"
                className="flex items-center justify-center bg-white rounded-2xl py-5 px-10 sm:px-14 text-center hover:shadow-lg transition-all duration-300 min-w-[160px]"
              >
                <span className="text-base sm:text-lg lg:text-[24px] font-bold text-[#00373E]">Call us</span>
              </a>
            </div>
          </motion.div>
        </section>

        {/* ── Scrolling Text Banner ── */}
        <ScrollingTextBanner />

        {/* ── Form + Map Section ── */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-[#FFF5ED] p-6 sm:p-8 md:p-10 rounded-3xl shadow-sm"
              >
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-bold text-[#00373E] mb-2">Send us a Message</h2>
                  <p className="text-sm sm:text-base lg:text-[20px] text-[#486364]">Fill out the form below and our team will get back to you shortly.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#6A8181] ml-1">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className={`w-full bg-white border ${fieldErrors.full_name ? 'border-red-400' : 'border-gray-200'} px-4 py-3 rounded-xl text-sm sm:text-base focus:outline-none focus:border-[#ED7428] transition-colors`}
                    />
                    {fieldErrors.full_name && <p className="text-red-500 text-xs ml-1">{fieldErrors.full_name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#6A8181] ml-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full bg-white border ${fieldErrors.phone ? 'border-red-400' : 'border-gray-200'} px-4 py-3 rounded-xl text-sm sm:text-base focus:outline-none focus:border-[#ED7428] transition-colors`}
                    />
                    {fieldErrors.phone && <p className="text-red-500 text-xs ml-1">{fieldErrors.phone}</p>}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#6A8181] ml-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-white border ${fieldErrors.email ? 'border-red-400' : 'border-gray-200'} px-4 py-3 rounded-xl text-sm sm:text-base focus:outline-none focus:border-[#ED7428] transition-colors`}
                    />
                    {fieldErrors.email && <p className="text-red-500 text-xs ml-1">{fieldErrors.email}</p>}
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#6A8181] ml-1">Your Message</label>
                    <textarea
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="How can we help you today?"
                      className={`w-full bg-white border ${fieldErrors.message ? 'border-red-400' : 'border-gray-200'} px-4 py-3 rounded-xl text-sm sm:text-base focus:outline-none focus:border-[#ED7428] transition-colors resize-none`}
                    />
                    {fieldErrors.message && <p className="text-red-500 text-xs ml-1">{fieldErrors.message}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={formStatus !== 'idle'}
                      className="inline-flex items-center gap-2 bg-[#00373E] text-white text-sm sm:text-base font-semibold px-8 py-3.5 rounded-xl hover:bg-[#025a66] active:scale-[0.97] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {formStatus === 'sending' ? 'Sending...' : formStatus === 'sent' ? 'Sent!' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </motion.div>

              {/* Map + Appointment info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <a
                  href={siteConfig.contact.address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group relative rounded-3xl overflow-hidden h-[350px] border-4 border-[#F7F5EF] shadow-md grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer"
                >
                  <iframe
                    src={siteConfig.maps.embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Hope Trust Location"
                    className="pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-[#00373E] text-white px-6 py-2 rounded-full text-sm sm:text-base font-bold shadow-xl flex items-center gap-2">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                      Get Directions
                    </div>
                  </div>
                </a>

                <div className="bg-[#00373E] p-6 sm:p-8 rounded-3xl text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <MessageSquare className="text-[#ED7428] w-5 h-5" />
                      <h3 className="text-xl sm:text-2xl font-bold">By Appointment Only</h3>
                    </div>
                    <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                      All appointments are pre-booked. Please call or message us to schedule your visit. Walk-ins are not available.
                    </p>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
