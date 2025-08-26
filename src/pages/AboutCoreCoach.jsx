import React from 'react';
import { Users, Zap, Heart, Brain, BarChart3, MessageSquare } from 'lucide-react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { createPageUrl } from '@/utils';
import ScrollToTop from '@/components/utils/ScrollToTop';
import { motion } from 'framer-motion';

const Feature = ({ icon: Icon, title, description }) => (
  <div className="flex items-start space-x-6">
    <div className="icon-container icon-container-branded w-12 h-12 flex-shrink-0">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">{title}</h3>
      <p className="text-[var(--text-secondary)] leading-relaxed">{description}</p>
    </div>
  </div>
);

export default function AboutCoreCoach() {
  return (
    <>
      <ScrollToTop />
      <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)]">
        <PublicHeader
          appName="CORE | COACH"
          logoIcon={Users}
          logoGradientClass="coach-brand-gradient"
          onLoginClick={() => window.location.href = createPageUrl('CoreCoachHome')}
          aboutPageUrl={createPageUrl("AboutCoreCoach")}
          pricingPageUrl={createPageUrl("CoachPricing")}
          isCoachTheme={true}
        />

        <main className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">About Core Coach</h1>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">The professional platform for delivering data-driven, transformational coaching.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-16"
            >
              <Feature
                icon={BarChart3}
                title="Data-Driven Insights"
                description="Move beyond anecdotal evidence. Core Coach provides analytics on client engagement, goal progress, and recurring themes. Access client-shared entries and breakthroughs to prepare for sessions and guide conversations with meaningful data."
              />
              <Feature
                icon={Zap}
                title="AI-Powered Assistance"
                description="Leverage AI to spot common threads across your client base, identify potential areas for group workshops, and quickly summarize a client's recent progress. Spend less time on administrative tasks and more time on high-impact coaching."
              />
              <Feature
                icon={MessageSquare}
                title="Seamless Client Collaboration"
                description="Core Coach is the professional counterpart to Core Compass. When your clients use Core Compass, you get a secure, consent-based window into their journey, enabling deeper, more effective coaching sessions. Share resources, send notes, and track collaborative goals in one place."
              />
              <Feature
                icon={Heart}
                title="Built for Professional Impact"
                description="We understand that coaching is about transformation, not just conversation. Core Coach provides the tools and insights you need to demonstrate measurable progress, maintain professional boundaries, and deliver results that matter to your clients and their organizations."
              />
            </motion.div>
          </div>
        </main>
        
        <PublicFooter isCoachTheme={true} />
      </div>
    </>
  );
}