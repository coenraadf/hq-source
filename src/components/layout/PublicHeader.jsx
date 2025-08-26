import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';

export default function PublicHeader({
  appName,
  logoIcon: LogoIcon,
  logoGradientClass,
  onLoginClick,
  aboutPageUrl,
  pricingPageUrl,
  isCoachTheme
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const contactUrl = isCoachTheme ? createPageUrl("CoHQContact") : createPageUrl("MyHQContact");

  const navLinks = [
    { title: 'About', url: aboutPageUrl },
  ];

  if (pricingPageUrl) {
    navLinks.push({ title: 'Pricing', url: pricingPageUrl });
  }

  navLinks.push({ title: 'Contact', url: contactUrl });
  
  const homeUrl = isCoachTheme ? createPageUrl('CoachLanding') : createPageUrl('MyHQHome');
  const buttonText = isCoachTheme ? "Coach Login" : "Client Login";

  return (
    <header className="relative bg-white/90 backdrop-blur-sm sticky top-0 z-20 border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex-shrink-0">
                <Link to={homeUrl}>
                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${logoGradientClass}`}>
                            <LogoIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="font-bold text-[var(--text-primary)] text-base uppercase tracking-wider">{appName}</h1>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Desktop Navigation - Right Aligned */}
            <div className="hidden lg:flex items-center space-x-10">
                <nav className="flex items-center space-x-10">
                    {navLinks.map((link) => (
                        <Link key={link.title} to={link.url} className="text-base font-medium text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors">
                            {link.title}
                        </Link>
                    ))}
                </nav>
                <Button onClick={onLoginClick} className="btn-primary">
                    {buttonText}
                </Button>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
                <Button variant="ghost" className="rounded-md p-2 text-[var(--text-secondary)]" onClick={() => setIsMobileMenuOpen(true)}>
                    <Menu className="w-6 h-6" />
                </Button>
            </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right lg:hidden z-30">

            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white/95 backdrop-blur-sm divide-y-2 divide-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="pt-5 pb-6 px-5">
                <div className="flex items-center justify-between">
                   <Link to={homeUrl} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${logoGradientClass}`}>
                        <LogoIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h1 className="font-bold text-[var(--text-primary)] text-base uppercase tracking-wider">{appName}</h1>
                      </div>
                    </div>
                  </Link>
                  <div className="-mr-2">
                    <Button variant="ghost" className="rounded-md p-2 text-[var(--text-secondary)]" onClick={() => setIsMobileMenuOpen(false)}>
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-8">
                    {navLinks.map((link) =>
                  <Link
                    key={link.title}
                    to={link.url}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="-m-3 p-3 flex items-center rounded-md hover:bg-[var(--bg-secondary)] transition-colors">

                        <span className="ml-3 text-base font-medium text-[var(--brand-primary)]">{link.title}</span>
                      </Link>
                  )}
                  </nav>
                </div>
              </div>
              <div className="py-6 px-5 space-y-6">
                <Button onClick={() => {onLoginClick();setIsMobileMenuOpen(false);}} className="btn-primary w-full">
                  {buttonText}
                </Button>
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>
    </header>
  );
}