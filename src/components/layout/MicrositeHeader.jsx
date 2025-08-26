import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, Presentation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';

export default function MicrositeHeader({ currentPage }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { title: 'Vision', url: createPageUrl('pitchvision') },
    { title: 'Market Opportunity', url: createPageUrl('pitchmarket') },
    { title: 'For Investors', url: createPageUrl('pitchinvestors') },
    { title: 'Beta Program', url: createPageUrl('pitchbeta') },
    { title: 'Contact', url: createPageUrl('pitchcontact') }
  ];

  return (
    <header className="relative bg-white/90 backdrop-blur-sm sticky top-0 z-20 border-b border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to={createPageUrl('pitchvision')}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-[#446273] to-[#5A7A8A]">
                  <Presentation className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-[#1A1A1A] text-base uppercase tracking-wider">PITCH HQ</h1>
                </div>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button variant="ghost" onClick={() => setIsMobileMenuOpen(true)} className="text-[#2D2D2D]">
              <Menu className="w-6 h-6" />
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-end space-x-8">
            <nav className="flex space-x-8">
              {navLinks.slice(0, 4).map((link) => (
                <Link
                  key={link.title}
                  to={link.url}
                  className={`text-base font-medium transition-colors ${
                    currentPage === link.title 
                      ? 'text-[#446273] font-semibold' 
                      : 'text-[#2D2D2D] hover:text-[#446273]'
                  }`}
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right lg:hidden z-30"
          >
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white/95 backdrop-blur-sm divide-y-2 divide-[#F5F1EB] border border-[#E5E0D8]">
              <div className="pt-5 pb-6 px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-[#446273] to-[#5A7A8A]">
                      <Presentation className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="font-bold text-[#1A1A1A] text-base uppercase tracking-wider">PITCH HQ</h1>
                    </div>
                  </div>
                  <div className="-mr-2">
                    <Button variant="ghost" className="rounded-md p-2 text-[#2D2D2D]" onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-8">
                    {navLinks.slice(0, 4).map((link) => (
                      <Link
                        key={link.title}
                        to={link.url}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`-m-3 p-3 flex items-center rounded-md hover:bg-[#F5F1EB] transition-colors ${
                          currentPage === link.title ? 'bg-[#F5F1EB]' : ''
                        }`}
                      >
                        <span className={`ml-3 text-base font-medium ${
                          currentPage === link.title ? 'text-[#446273] font-semibold' : 'text-[#446273]'
                        }`}>{link.title}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}