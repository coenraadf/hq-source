import React from 'react';
import { Link } from 'react-router-dom';
import { Presentation } from 'lucide-react';
import { createPageUrl } from '@/utils';

const FooterLink = ({ to, children }) => (
  <Link to={to} className="text-sm text-stone-300 hover:text-white transition-colors">
    {children}
  </Link>
);

export default function MicrositeFooter() {
  const footerLinks = {
    pitch: [
      { title: "Vision", url: createPageUrl("pitchvision") },
      { title: "Market Opportunity", url: createPageUrl("pitchmarket") },
      { title: "For Investors", url: createPageUrl("pitchinvestors") }
    ],
    product: [
      { title: "My | HQ", url: createPageUrl("MyHQHome") },
      { title: "Co | HQ", url: createPageUrl("CoHQHome") },
      { title: "Beta Program", url: createPageUrl("pitchbeta") }
    ],
    legal: [
      { title: "Terms of Service", url: createPageUrl("TermsOfService") },
      { title: "Privacy Policy", url: createPageUrl("TermsOfService") }
    ]
  };

  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-[#446273] to-[#5A7A8A]">
                <Presentation className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Pitch HQ</span>
            </div>
            <p className="text-sm text-stone-300 pr-8">The OS for the Inner World</p>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3 lg:col-span-3">
            <div>
              <h4 className="font-semibold mb-4">Pitch</h4>
              <ul className="space-y-3">
                {footerLinks.pitch.map((link) => (
                  <li key={link.title}><FooterLink to={link.url}>{link.title}</FooterLink></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.title}><FooterLink to={link.url}>{link.title}</FooterLink></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.title}><FooterLink to={link.url}>{link.title}</FooterLink></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-stone-700 pt-8 text-center text-sm text-stone-400">
          <p>© {new Date().getFullYear()} Pitch HQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}