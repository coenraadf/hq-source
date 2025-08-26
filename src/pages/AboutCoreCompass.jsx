import React from 'react';
import { Compass, Zap, Heart, Brain, Users } from 'lucide-react';
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

export default function AboutCoreCompass() {
  return (
    <>
      <ScrollToTop />
      <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)]">
        <PublicHeader
          appName="CORE | COMPASS"
          logoIcon={Compass}
          logoGradientClass="compass-brand-gradient"
          onLoginClick={() => window.location.href = createPageUrl('CoreCompassHome')}
          aboutPageUrl={createPageUrl("AboutCoreCompass")}
          pricingPageUrl={createPageUrl("ClientPricing")}
          isCoachTheme={false}
        />

        <main className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">About Core Compass</h1>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">Your private, AI-powered space for personal growth and self-discovery.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-16"
            >
              <Feature
                icon={Brain}
                title="Synthesize Your Knowledge"
                description="Core Compass is designed to be your second brain for personal development. Capture thoughts, journal entries, personality test results, and reflections in one secure place. Our AI helps you connect the dots, revealing patterns and insights that lead to profound self-awareness."
              />
              <Feature
                icon={Zap}
                title="AI-Powered Reflection"
                description="Our intelligent assistant helps you explore your own data, asking thoughtful questions and summarizing key themes from your entries. It's like having a personal growth partner available 24/7 to help you navigate your inner world and find clarity."
              />
              <Feature
                icon={Heart}
                title="Bridge to Professional Coaching"
                description="While Core Compass is a powerful tool for individual use, it truly shines when you're ready for professional guidance. Seamlessly share specific insights, goals, and breakthroughs with your coach, giving them the context they need to provide transformative support. You always remain in control of your data."
              />
              <Feature
                icon={Users}
                title="Our Philosophy"
                description="We believe that true growth comes from understanding yourself deeply. Core Compass was built on the principles of privacy, self-ownership of data, and the power of technology to augment human potential. Your journey is yours alone, and we provide the tools to help you navigate it with intention and clarity."
              />
            </motion.div>
          </div>
        </main>
        
        <PublicFooter isCoachTheme={false} />
      </div>
    </>
  );
}