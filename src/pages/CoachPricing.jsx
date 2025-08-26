import React, { useState } from 'react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, Users, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollToTop from "@/components/utils/ScrollToTop";

export default function CoachPricing() {
  const handleJoinBeta = () => {
    window.location.href = createPageUrl("CoachBetaSignup");
  };

  const handleRequestDemo = () => {
    window.location.href = createPageUrl("RequestDemo");
  };

  const handleContactEnterprise = () => {
    window.location.href = createPageUrl("CoachContact");
  };

  const pricingPlans = [
    {
      name: "Beta Coach",
      price: "Free",
      frequency: "90-day pilot",
      description: "Perfect for trying out Core Compass with your first clients",
      features: [
        "Up to 5 active clients",
        "AI-powered session briefs",
        "Basic outcome reports",
        "Client data synthesis",
        "Email support",
        "Swiss-hosted privacy"
      ],
      buttonText: "Apply for Beta",
      isPrimary: false,
      isPopular: false,
      onClick: handleJoinBeta
    },
    {
      name: "Professional",
      price: "$49",
      frequency: "per month",
      description: "Scale your practice with advanced AI insights and unlimited history",
      features: [
        "Up to 25 active clients",
        "Advanced AI session briefs",
        "Comprehensive outcome & ROI reports",
        "Retention & churn alerts",
        "Unlimited insight history",
        "Integration with Calendly, Stripe, etc.",
        "Priority support & coaching",
        "White-label reports"
      ],
      buttonText: "Start Professional",
      isPrimary: true,
      isPopular: true,
      onClick: handleJoinBeta
    },
    {
      name: "Enterprise",
      price: "Custom",
      frequency: "for organizations",
      description: "Large coaching organizations with custom compliance and branding needs",
      features: [
        "Unlimited clients & coaches",
        "Custom AI model training",
        "Advanced compliance (HIPAA+)",
        "White-label platform",
        "API access & integrations",
        "Dedicated success manager",
        "Custom reporting & analytics",
        "SSO & enterprise security"
      ],
      buttonText: "Contact Sales",
      isPrimary: false,
      isPopular: false,
      onClick: handleContactEnterprise
    },
  ];

  return (
    <>
      <ScrollToTop />
      <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)] min-h-screen">
        <PublicHeader
          appName="CORE COMPASS"
          logoIcon={Users}
          logoGradientClass="coach-brand-gradient"
          onLoginClick={handleJoinBeta}
          aboutPageUrl={createPageUrl("CoachAbout")}
          pricingPageUrl={createPageUrl("CoachPricing")}
          isCoachTheme={true}
        />

        <main className="max-w-7xl mx-auto px-6 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-8">
              Scale as you grow. No hidden fees, no per-client charges after your plan limit. Just powerful AI coaching tools that pay for themselves.
            </p>
            <div className="inline-flex items-center gap-4 bg-[var(--bg-secondary)] px-6 py-3 rounded-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Beta Program Active</span>
              </div>
              <div className="w-px h-4 bg-[var(--border-color)]"></div>
              <span className="text-sm text-[var(--text-secondary)]">Join 200+ founding coaches</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`base-card p-8 flex flex-col justify-between relative ${
                  plan.isPrimary ? 'border-[var(--brand-primary)] border-2 shadow-xl' : ''
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[var(--brand-primary)] text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-[var(--brand-primary)]">{plan.price}</span>
                      {plan.price !== "Free" && plan.price !== "Custom" && (
                        <span className="text-[var(--text-secondary)]">/{plan.frequency}</span>
                      )}
                      {plan.price === "Free" && (
                        <span className="text-[var(--text-secondary)]"> {plan.frequency}</span>
                      )}
                      {plan.price === "Custom" && (
                        <span className="text-[var(--text-secondary)]"> {plan.frequency}</span>
                      )}
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-[var(--text-secondary)]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={plan.onClick}
                  className={plan.isPrimary ? 'btn-primary w-full' : 'btn-secondary w-full'}
                >
                  {plan.name === "Beta Coach" && <Users className="w-4 h-4 mr-2" />}
                  {plan.name === "Professional" && <Zap className="w-4 h-4 mr-2" />}
                  {plan.name === "Enterprise" && <Crown className="w-4 h-4 mr-2" />}
                  {plan.buttonText}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[var(--bg-secondary)] rounded-2xl p-8 md:p-12 text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
              ROI Calculator: Core Compass Pays for Itself
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-[var(--brand-primary)] mb-2">4+ Hours</div>
                <p className="text-[var(--text-secondary)]">Saved per week on session prep</p>
                <p className="text-sm text-[var(--text-muted)] mt-2">Worth $200-400+ at your hourly rate</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--brand-primary)] mb-2">15-20%</div>
                <p className="text-[var(--text-secondary)]">Increase in client retention</p>
                <p className="text-sm text-[var(--text-muted)] mt-2">Prevents costly client churn</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--brand-primary)] mb-2">3x Faster</div>
                <p className="text-[var(--text-secondary)]">Contract renewals with ROI reports</p>
                <p className="text-sm text-[var(--text-muted)] mt-2">Easier to justify coaching value</p>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-8">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">Is there a free trial?</h4>
                  <p className="text-[var(--text-secondary)]">Yes! Our Beta Coach plan includes a 90-day free pilot with full access to all core features for up to 5 clients.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">How does client data privacy work?</h4>
                  <p className="text-[var(--text-secondary)]">All client data is Swiss-hosted, GDPR compliant, and requires explicit client consent. Clients own their data and can revoke access anytime.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">Can I integrate with my existing tools?</h4>
                  <p className="text-[var(--text-secondary)]">Absolutely. We integrate with Calendly, Stripe, Google Drive, Slack, and most major coaching admin tools.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">What makes this different from other platforms?</h4>
                  <p className="text-[var(--text-secondary)]">We're not an admin tool—we're an AI-powered insight engine. Our focus is deep synthesis and pattern recognition, not scheduling or payments.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">How quickly can I onboard clients?</h4>
                  <p className="text-[var(--text-secondary)]">Most coaches onboard their first client within 15 minutes. We provide templates and guidance for the consent and data sharing process.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">Is there a long-term contract?</h4>
                  <p className="text-[var(--text-secondary)]">No contracts. Pay month-to-month and cancel anytime. We earn your business every month with results.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-16 pt-16 border-t border-[var(--border-color)]"
          >
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Ready to Transform Your Practice?</h2>
            <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              Join 200+ professional coaches who are already saving time and proving their value with AI-powered insights.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={handleJoinBeta} size="lg" className="btn-primary">
                <Users className="w-5 h-5 mr-2" />
                Apply for Beta Access
              </Button>
              <Button onClick={handleRequestDemo} variant="outline" size="lg" className="btn-secondary">
                Schedule a Demo
              </Button>
            </div>
          </motion.div>
        </main>

        <PublicFooter isCoachTheme={true} />
      </div>
    </>
  );
}