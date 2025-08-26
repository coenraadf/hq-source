import React, { useState } from 'react';
import { Plus, Minus, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ScrollToTop from "@/components/utils/ScrollToTop";
import { createPageUrl } from "@/utils";
import { User } from '@/api/entities';

const faqs = [
  {
    question: "What is CO | HQ?",
    answer: "CO | HQ is an AI-powered platform designed specifically for professional coaches. It analyzes client data from notes, sessions, and progress trackers to provide deep, actionable insights, helping you deliver more impactful coaching with less administrative work."
  },
  {
    question: "How does the AI work?",
    answer: "Our proprietary AI models are trained on anonymized coaching methodologies and communication patterns. The AI analyzes text from your notes and client interactions to identify recurring themes, track sentiment, measure progress against goals, and highlight potential breakthroughs. It does not give advice, but rather surfaces objective data for you to interpret with your professional expertise."
  },
  {
    question: "Is my and my clients' data secure?",
    answer: "Absolutely. Security and confidentiality are our top priorities. All data is encrypted at rest and in transit. We are SOC 2 compliant, and our systems are designed to ensure you and your client's information remains private and secure. You control what data is shared and how it is used."
  },
  {
    question: "Can I use CO | HQ with my existing workflow?",
    answer: "Yes, CO | HQ is designed to be flexible. You can use it as a complete client management system or integrate its insights into your current workflow. We offer integrations with popular calendar and note-taking apps, with more on the way."
  },
  {
    question: "How is this different from a standard CRM?",
    answer: "While a CRM helps you manage client relationships, CO | HQ goes a step further by providing intelligence on top of that data. It's not just about storing information; it's about analyzing it to help you become a more effective coach."
  },
  {
    question: "What is the pricing model?",
    answer: "We offer several tiers, including plans for solo coaches, small teams, and large enterprises. You can find detailed information on our pricing page. All paid plans start with a 14-day free trial."
  }
];

export default function CoHQFAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-6xl font-bold text-[var(--text-primary)] mb-4">Frequently Asked Questions</h1>
              <p className="text-lg text-[var(--text-secondary)]">
                Everything you need to know about CO | HQ.
              </p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="base-card p-0 overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center text-left p-6"
                  >
                    <span className="text-lg font-medium text-[var(--text-primary)]">{faq.question}</span>
                    {activeIndex === index ? (
                      <Minus className="w-6 h-6 text-[var(--brand-primary)]" />
                    ) : (
                      <Plus className="w-6 h-6 text-[var(--text-secondary)]" />
                    )}
                  </button>
                  <AnimatePresence>
                    {activeIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 text-[var(--text-secondary)]">
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </main>
        
        <PublicFooter appName="CO | HQ" isCoachTheme={true} />
      </div>
    </>
  );
}