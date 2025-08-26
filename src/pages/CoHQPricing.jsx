import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, ArrowRight, Zap, Users } from "lucide-react";
import { motion } from "framer-motion";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ScrollToTop from "@/components/utils/ScrollToTop";
import { createPageUrl } from "@/utils";
import { User } from '@/api/entities';

const tiers = [
  {
    name: "Solo Coach",
    price: "49",
    description: "For the individual practitioner ready to scale.",
    features: [
      "Up to 25 active clients",
      "AI-Powered Session Analysis",
      "Automated Progress Tracking",
      "Resource & Template Library",
      "Secure Client Messaging",
      "Basic Analytics & Reporting"
    ],
    cta: "Start Your 14-Day Trial"
  },
  {
    name: "Coaching Team",
    price: "199",
    description: "For small teams and growing practices.",
    features: [
      "All features in Solo Coach",
      "Up to 5 Coach Seats",
      "Up to 150 active clients total",
      "Centralized Client Management",
      "Team Performance Dashboards",
      "Collaborative Tools & Notes"
    ],
    cta: "Request a Demo"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations and coaching platforms.",
    features: [
      "All features in Coaching Team",
      "Unlimited Coach Seats & Clients",
      "Advanced Security & Compliance (SOC 2)",
      "Custom Integrations & API Access",
      "White-labeling & Custom Branding",
      "Dedicated Success Manager"
    ],
    cta: "Contact Sales"
  }
];

export default function CoHQPricing() {
    const handleLogin = async () => {
        try {
            const currentUser = await User.me();
            if (currentUser && currentUser.onboarding_completed && currentUser.user_type === 'coach') {
                window.location.href = createPageUrl("CoachDashboard");
                return;
            }
        } catch (error) {
            console.log("User not authenticated, proceeding with login flow");
        }

        try {
            await User.loginWithRedirect(window.location.origin + createPageUrl("CoachDashboard"));
        } catch (error) {
            console.error("Login failed:", error);
            await User.login();
        }
    };

    const handleTierClick = (tier) => {
        if (tier.name === 'Enterprise') {
            window.location.href = createPageUrl('EnterpriseSolutions');
        } else if (tier.name === 'Coaching Team') {
            window.location.href = createPageUrl('RequestDemo');
        } else {
            window.location.href = createPageUrl('CoachBetaSignup');
        }
    };

  return (
    <>
      <ScrollToTop />
      <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)]">
        <PublicHeader
          appName="CO | HQ"
          logoIcon={Users}
          logoGradientClass="coach-brand-gradient"
          onLoginClick={handleLogin}
          aboutPageUrl={createPageUrl("AboutCoHQ")}
          pricingPageUrl={createPageUrl("CoHQPricing")}
          isCoachTheme={true}
        />
        
        <main className="px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-6xl font-bold text-[var(--text-primary)] mb-4">
                Find the Plan That's Right for You
              </h1>
              <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto">
                Simple, transparent pricing that scales with your coaching practice. No hidden fees, ever.
              </p>
            </div>
            
            {/* Pricing Tiers */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`base-card flex flex-col ${tier.name === 'Coaching Team' ? 'border-[var(--brand-primary)]' : ''}`}
                >
                  <div className="flex-grow">
                    <h2 className="text-2xl font-bold text-[var(--brand-primary)] mb-2">{tier.name}</h2>
                    <p className="text-[var(--text-muted)] mb-6 h-10">{tier.description}</p>
                    
                    <div className="mb-8">
                      {tier.price === 'Custom' ? (
                        <span className="text-4xl font-bold">Custom</span>
                      ) : (
                        <div>
                          <span className="text-4xl font-bold">${tier.price}</span>
                          <span className="text-[var(--text-muted)]">/mo</span>
                        </div>
                      )}
                    </div>
                    
                    <ul className="space-y-4">
                      {tier.features.map(feature => (
                        <li key={feature} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-8">
                    <Button onClick={() => handleTierClick(tier)} className="w-full btn-primary text-lg">
                      {tier.cta}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
        
        <PublicFooter appName="CO | HQ" isCoachTheme={true} />
      </div>
    </>
  );
}