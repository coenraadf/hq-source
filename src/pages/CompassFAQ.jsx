import React, { useState } from 'react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollToTop from "@/components/utils/ScrollToTop";

const AccordionItem = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="border-b border-[var(--border-color)]">
      <button
        className="w-full text-left py-6 px-4 md:px-6 flex justify-between items-center hover:bg-[rgba(var(--brand-primary-r),var(--brand-primary-g),var(--brand-primary-b),0.05)] transition-colors"
        onClick={onToggle}
      >
        <h2 className="text-h3 text-[var(--text-primary)]">{title}</h2>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6 text-[var(--brand-primary)]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="prose max-w-none px-4 md:px-6 pb-6 text-[var(--text-secondary)]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function CompassFAQ() {
  const [openItem, setOpenItem] = useState(null);

  const handleToggle = (title) => {
    setOpenItem(openItem === title ? null : title);
  };

  const faqItems = [
    {
      title: "What is Core Compass?",
      content: (
        <p className="text-text-secondary leading-relaxed">
          Core Compass is a private, AI-powered personal growth platform that helps you understand yourself better. It's your secure space to capture thoughts, reflect on experiences, track personality insights, and connect the dots of your personal journey. Think of it as your digital growth companion that helps you see patterns and gain clarity about your path forward.
        </p>
      )
    },
    {
      title: "How does the AI synthesis work?",
      content: (
        <div className="space-y-4">
          <p className="text-text-secondary leading-relaxed">
            Our AI analyzes your journal entries, goals, personality test results, and reflections to identify patterns, themes, and connections you might not see on your own. It can help you understand recurring thoughts, track emotional patterns, and suggest insights based on your personal data.
          </p>
          <p className="text-text-secondary leading-relaxed">
            The AI is trained to ask thoughtful questions, summarize your insights, and help you explore different perspectives on your experiences. All analysis happens securely and privately - your data never leaves our protected environment.
          </p>
        </div>
      )
    },
    {
      title: "Is my data private and secure?",
      content: (
        <div className="space-y-4">
          <p className="text-text-secondary leading-relaxed">
            Absolutely. Your privacy is our top priority. All your personal data is encrypted and stored with enterprise-grade security. We use the same level of protection as banks and healthcare systems.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Your journal entries, thoughts, and insights are completely private by default. You control exactly what you share and with whom. Even when working with a coach, you choose which entries and insights to share - nothing is shared automatically.
          </p>
          <p className="text-text-secondary leading-relaxed">
            We never sell your data, use it for advertising, or share it with third parties. Your personal growth journey belongs to you.
          </p>
        </div>
      )
    },
    {
      title: "How do I work with a coach through Core Compass?",
      content: (
        <div className="space-y-4">
          <p className="text-text-secondary leading-relaxed">
            When you're ready to work with a coach, you can invite them to view specific entries, goals, and insights you choose to share. This gives your coach valuable context about your growth journey without compromising your privacy.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Your coach can leave feedback on shared entries, track your progress on collaborative goals, and share resources directly within the platform. This creates a seamless coaching experience while keeping your private thoughts completely private.
          </p>
          <p className="text-text-secondary leading-relaxed">
            You maintain full control over what your coach can see. You can change sharing permissions at any time or work entirely privately if you prefer.
          </p>
        </div>
      )
    },
    {
      title: "What types of personality tests can I upload?",
      content: (
        <div className="space-y-4">
          <p className="text-text-secondary leading-relaxed">
            Core Compass supports a wide range of personality and assessment tools, including:
          </p>
          <ul className="space-y-2 text-text-secondary ml-4">
            <li>• Myers-Briggs Type Indicator (MBTI)</li>
            <li>• Big Five personality traits</li>
            <li>• DISC assessment</li>
            <li>• CliftonStrengths</li>
            <li>• Enneagram</li>
            <li>• VIA Character Strengths</li>
            <li>• Working Genius</li>
            <li>• And many more professional assessments</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            You can upload results from any personality test or assessment. Our AI will help you understand how these insights connect to your daily experiences and growth patterns.
          </p>
        </div>
      )
    },
    {
      title: "How much does Core Compass cost?",
      content: (
        <div className="space-y-4">
          <p className="text-text-secondary leading-relaxed">
            Core Compass offers three tiers:
          </p>
          <ul className="space-y-2 text-text-secondary ml-4">
            <li>• <strong>Free:</strong> Unlimited journaling, basic AI insights, personal goal tracking</li>
            <li>• <strong>Growth Pro ($9/month):</strong> Advanced AI synthesis, unlimited personality tests, coach sharing features</li>
            <li>• <strong>Unlimited ($29/month):</strong> Dedicated AI assistant, advanced goal tracking, premium content access</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            Start with our free tier to explore the platform, then upgrade when you're ready for more advanced features. No long-term commitments required.
          </p>
        </div>
      )
    },
    {
      title: "Can I use Core Compass without a coach?",
      content: (
        <p className="text-text-secondary leading-relaxed">
          Absolutely! Core Compass is designed to be valuable whether you're working with a coach or not. Many users find tremendous value in the AI-powered insights, goal tracking, and reflection tools for their independent growth journey. The coach integration is optional - you can add a coach later if you decide you'd like professional guidance.
        </p>
      )
    },
    {
      title: "How is Core Compass different from other journaling apps?",
      content: (
        <div className="space-y-4">
          <p className="text-text-secondary leading-relaxed">
            Unlike simple journaling apps, Core Compass is designed specifically for personal growth and self-understanding. Key differences include:
          </p>
          <ul className="space-y-2 text-text-secondary ml-4">
            <li>• AI-powered pattern recognition and insights</li>
            <li>• Integration with personality tests and assessments</li>
            <li>• Seamless coach collaboration features</li>
            <li>• Goal tracking and progress visualization</li>
            <li>• Breakthrough identification and celebration</li>
            <li>• Privacy-first design with granular sharing controls</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            We're not just about recording thoughts - we're about helping you understand and act on them.
          </p>
        </div>
      )
    }
  ];

  return (
    <>
      <ScrollToTop />
      <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)]">
        <PublicHeader
          appName="CORE COMPASS"
          logoIcon={Compass}
          logoGradientClass="client-brand-gradient"
          onLoginClick={() => window.location.href = createPageUrl('CoreCompassHome')}
          aboutPageUrl={createPageUrl("AboutCoreCompass")}
          pricingPageUrl={createPageUrl("ClientPricing")}
          isCoachTheme={false}
        />

        <main className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-display">Frequently Asked Questions</h1>
              <p className="text-body-large mt-4">
                Everything you need to know about your personal growth journey with Core Compass.
              </p>
            </div>

            <Card className="base-card overflow-hidden p-0">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  title={item.title}
                  isOpen={openItem === item.title}
                  onToggle={() => handleToggle(item.title)}
                >
                  {item.content}
                </AccordionItem>
              ))}
            </Card>
          </div>
        </main>
        
        <PublicFooter isCoachTheme={false} />
      </div>
    </>
  );
}