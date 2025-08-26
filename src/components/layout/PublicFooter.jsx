
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users, Compass } from 'lucide-react';
import { createPageUrl } from '@/utils';

const FooterLink = ({ to, children }) => (
  <Link to={to} className="text-sm text-stone-300 hover:text-white transition-colors">
    {children}
  </Link>
);

export default function PublicFooter({ isCoachTheme }) {
  const brandName = isCoachTheme ? "CO | HQ" : "MY | HQ";
  const LogoIcon = isCoachTheme ? Users : Compass;
  const logoBg = isCoachTheme ? 'coach-brand-gradient' : 'compass-brand-gradient';
  const tagline = isCoachTheme ? "Professional Coaching Platform" : "Coach-Connected Client Portal";
  const homeUrl = isCoachTheme ? createPageUrl("CoachLanding") : createPageUrl("MyHQHome");
  const contactUrl = isCoachTheme ? createPageUrl("CoHQContact") : createPageUrl("MyHQContact");
  const aboutUrl = createPageUrl("AboutCoHQ");
  const faqUrl = isCoachTheme ? createPageUrl("CoHQFAQ") : createPageUrl("MyHQFAQ");
  const altPlatformName = isCoachTheme ? "My | HQ" : "CO | HQ";
  const altPlatformUrl = isCoachTheme ? createPageUrl("MyHQHome") : createPageUrl("CoachLanding");

  const footerLinks = {
    product: isCoachTheme ? [
      { title: "Features", url: createPageUrl("CoachFeatures") },
      { title: "Enterprise Solutions", url: createPageUrl("EnterpriseSolutions") },
      { title: "Pricing", url: createPageUrl("CoHQPricing") },
      { title: "FAQ", url: faqUrl }
    ] : [
      // For My | HQ (client theme), links specifically point to MyHQ pages
      { title: "About My | HQ", url: createPageUrl("AboutMyHQ") },
      { title: "Privacy & Security", url: createPageUrl("AboutMyHQ") }, // Point to about page section
      { title: "Client FAQ", url: faqUrl }
    ],
    company: [
      // Company-wide about page uses the new 'aboutUrl'
      { title: "About", url: aboutUrl },
      { title: "Investor Opportunity", url: createPageUrl("InvestorOpportunity") },
      { title: "Contact", url: contactUrl }
    ],
    forCoaches: isCoachTheme ? [
      { title: "Join Beta Program", url: createPageUrl("CoachBetaSignup") },
      { title: "Request Demo", url: createPageUrl("RequestDemo") },
      { title: "Coach FAQ", url: createPageUrl("CoHQFAQ") }
    ] : [
      { title: "Are you a coach?", url: createPageUrl("CoachLanding") },
      { title: "Coach Features", url: createPageUrl("CoachFeatures") },
      { title: "Coach Pricing", url: createPageUrl("CoHQPricing") }
    ],
    legal: [
      { title: "Terms of Service", url: createPageUrl("TermsOfService") },
      { title: "Privacy Policy", url: createPageUrl("TermsOfService") } // Updated to point to TermsOfService
    ]
  };

  return (
    <footer className="bg-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to={homeUrl}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${logoBg}`}>
                  <LogoIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base uppercase tracking-wider">{brandName}</h3>
                  <p className="text-xs text-stone-400">{tagline}</p>
                </div>
              </div>
            </Link>
            <p className="text-sm text-stone-300 max-w-xs">
              {isCoachTheme
                ? "AI-powered coaching insights and client success platform for professional coaches."
                : "Private growth journal accessible exclusively through your professional coach."
              }
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">
              {isCoachTheme ? "For Coaches" : "Client Portal"}
            </h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.title}>
                  <FooterLink to={link.url}>{link.title}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.title}>
                  <FooterLink to={link.url}>{link.title}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* For Coaches / Legal */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">
              {isCoachTheme ? "Get Started" : "For Coaches"}
            </h4>
            <ul className="space-y-2">
              {footerLinks.forCoaches.map((link) => (
                <li key={link.title}>
                  <FooterLink to={link.url}>{link.title}</FooterLink>
                </li>
              ))}
            </ul>
            
            {/* Legal Links */}
            <h4 className="font-semibold text-white text-sm mb-2 mt-6">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.title}>
                  <FooterLink to={link.url}>{link.title}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-stone-400">
            &copy; {new Date().getFullYear()} CO | HQ. All rights reserved.
          </p>
          <p className="text-sm text-stone-400 mt-2 sm:mt-0">
            {isCoachTheme ? (
              <>Explore: <Link to={altPlatformUrl} className="text-stone-300 hover:text-white underline transition-colors">Client Portal (by invitation)</Link></>
            ) : (
              <>Are you a coach? <Link to={altPlatformUrl} className="text-stone-300 hover:text-white underline transition-colors">{altPlatformName}</Link></>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
