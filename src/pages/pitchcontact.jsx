import React from 'react';
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import MicrositeHeader from "@/components/layout/MicrositeHeader";
import MicrositeFooter from "@/components/layout/MicrositeFooter";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ScrollToTop from "@/components/utils/ScrollToTop";

export default function PitchContact() {
  return (
    <>
      <ScrollToTop />
      <div className="bg-white">
        <style>
          {`
            .pitch-brand-gradient {
              background: linear-gradient(135deg, #446273 0%, #5A7A8A 100%);
            }
          `}
        </style>
        <MicrositeHeader currentPage="Contact" />
        <div className="bg-gradient-to-br from-[#FAF6F0] to-[#F5F1EB]">
          <section className="max-w-4xl mx-auto px-6 py-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6">Get in Touch</h1>
              <p className="text-xl text-[#2D2D2D] leading-relaxed">
                We'd love to hear from you. Whether you have a question about our platform, investment opportunities, or anything else, our team is ready to answer all your questions.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Contact Form */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#1A1A1A]">Full Name</label>
                    <Input id="name" type="text" className="mt-1 block w-full border-stone-200 focus:border-[#446273] focus:ring-[#446273]" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A]">Email</label>
                    <Input id="email" type="email" className="mt-1 block w-full border-stone-200 focus:border-[#446273] focus:ring-[#446273]" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#1A1A1A]">Message</label>
                    <Textarea id="message" rows={5} className="mt-1 block w-full border-stone-200 focus:border-[#446273] focus:ring-[#446273]" />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" className="pitch-brand-gradient text-white hover:opacity-90 px-8">
                      Send Message <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </form>
              </motion.div>
              {/* Contact Info */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <div className="space-y-6 text-[#2D2D2D]">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#446273] mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A]">Email</h3>
                      <a href="mailto:hello@corecompass.app" className="hover:text-[#446273] transition-colors">hello@corecompass.app</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-[#446273] mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A]">Phone</h3>
                      <a href="tel:+41000000000" className="hover:text-[#446273] transition-colors">+41 (0) 00 000 00 00</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-[#446273] mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1A1A1A]">Address</h3>
                      <p>Core Compass HQ</p>
                      <p>Geneva, Switzerland</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
        <MicrositeFooter />
      </div>
    </>
  );
}