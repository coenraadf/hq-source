import React, { useState } from 'react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Users } from 'lucide-react';
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

export default function CoachFAQ() {
  const [openItem, setOpenItem] = useState(null);

  const handleToggle = (title) => {
    setOpenItem(openItem === title ? null : title);
  };

  const faqItems = [
    {
      title: "What is Core Coach?",
      content: (
        <p className="text-text-secondary leading-relaxed">
          Core Coach is a professional coaching platform that streamlines your practice and deepens client engagement. It integrates seamlessly with Core Compass (the client platform) to give you unprecedented insights into your clients' growth journeys, while providing powerful tools for client management, progress tracking, and collaborative goal setting.
        </p>
      )
    },
    {
      title: "How does the client integration work?",
      content: (
        <div className="space-y-4">
          <p className="text-text-secondary leading-relaxed">
            When your clients use Core Compass, they can choose to share specific entries, insights, and goals with you. This gives you rich context about their inner world and growth patterns between sessions.
          </p>
          <p className="text-text-secondary leading-relaxed">
            You'll see their breakthrough moments, recurring themes, personality assessment insights, and progress on collaborative goals. This enables much deeper, more targeted coaching conversations.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Clients maintain full control over what they share - nothing is automatic. This builds trust while giving you the insights you need to be most effective.
          </p>
        </div>
      )
    },
    {
      title: "What client management features are included?",
      content: (
        <div className="space-y-4">
          <p className="text-text-secondary leading-relaxed">
            Core Coach provides comprehensive client management tools:
          </p>
          <ul className="space-y-2 text-text-secondary ml-4">
            <li>• Client dashboard with engagement analytics</li>
            <li>• Progress tracking across multiple goals</li>
            <li>• Session notes and coaching history</li>
            <li>• Resource library for sharing materials</li>
            <li>• Client grouping and organization</li>
            <li>• Automated check-in and follow-up systems</li>
            <li>• Breakthrough identification and celebration</li>
            <li>• Communication timeline and message history</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            Everything you need to deliver exceptional coaching experiences while staying organized.
          </p>
        </div>
      )
    },
    {
      title: "How much does Core Coach cost?",
      content: (
        <div className="space-y-4">
          <p className="text-text-secondary leading-relaxed">
            Core Coach offers three pricing tiers:
          </p>
          <ul className="space-y-2 text-text-secondary ml-4">
            <li>• <strong>Starter Coach ($19/month):</strong> Up to 5 clients, basic management tools, standard support</li>
            <li>• <strong>Pro Coach ($49/month):</strong> Up to 25 clients, advanced analytics, resource library, priority support</li>
            <li>• <strong>Enterprise (Custom pricing):</strong> Unlimited clients, white-label options, dedicated support, API access</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            All plans include seamless integration with client Core Compass accounts and core coaching tools. Start with a 30-day free trial.
          </p>
        </div>
      )
    },
    {
      title: "Do my clients need to use Core Compass?",
      content: (
        <div className="space-y-4">
          <p className="text-text-secondary leading-relaxed">
            While Core Coach works best when clients use Core Compass, it's not required. You can use Core Coach for client management, session notes, and goal tracking even if clients don't use the companion app.
          </p>
          <p className="text-text-secondary leading-relaxed">
            However, the real power comes from the integration. When clients use Core Compass, you get insights into their daily reflections, breakthrough moments, and growth patterns that would be impossible to capture otherwise.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Many coaches find that inviting clients to Core Compass significantly enhances the coaching relationship and outcomes.
          </p>
        </div>
      )
    },
    {
      title: "How do I invite and onboard clients?",
      content: (
        <div className="space-y-4">
          <p className="text-text-secondary leading-relaxed">
            Inviting clients is simple and secure:
          </p>
          <ul className="space-y-2 text-text-secondary ml-4">
            <li>• Send a personalized invitation link with your message</li>
            <li>• Clients create their Core Compass account</li>
            <li>• They choose what to share with you (if anything initially)</li>
            <li>• You're connected and can begin collaborative coaching</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            The onboarding process includes guided tutorials for both you and your clients, ensuring everyone gets the most value from the platform.
          </p>
        </div>
      )
    },
    {
      title: "What analytics and insights do I get?",
      content: (
        <div className="space-y-4">
          <p className="text-text-secondary leading-relaxed">
            Core Coach provides powerful analytics while respecting client privacy:
          </p>
          <ul className="space-y-2 text-text-secondary ml-4">
            <li>• Client engagement levels and patterns</li>
            <li>• Progress tracking on collaborative goals</li>
            <li>• Breakthrough identification and trends</li>
            <li>• Session outcome tracking</li>
            <li>• Communication frequency and response times</li>
            <li>• Resource usage and effectiveness</li>
            <li>• Practice-wide trends and insights</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            All analytics are aggregated and anonymized to protect individual client privacy while giving you the insights you need to improve your practice.
          </p>
        </div>
      )
    },
    {
      title: "Can I customize the platform for my coaching style?",
      content: (
        <div className="space-y-4">
          <p className="text-text-secondary leading-relaxed">
            Absolutely! Core Coach is designed to adapt to your unique coaching approach:
          </p>
          <ul className="space-y-2 text-text-secondary ml-4">
            <li>• Customizable session templates and frameworks</li>
            <li>• Personalized resource libraries</li>
            <li>• Flexible goal and progress tracking systems</li>
            <li>• Custom client intake and onboarding flows</li>
            <li>• White-label branding options (Enterprise)</li>
            <li>• Integration with your existing tools via API</li>
          </ul>
          <p className="text-text-secondary leading-relaxed">
            The platform works with your methodology, not against it.
          </p>
        </div>
      )
    },
    {
      title: "Is client data secure and private?",
      content: (
        <div className="space-y-4">
          <p className="text-text-secondary leading-relaxed">
            Client privacy and data security are our highest priorities. We use enterprise-grade encryption and security measures that exceed industry standards.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Clients maintain complete control over their data. They choose exactly what to share with you and can revoke access at any time. You only see what they explicitly permit you to see.
          </p>
          <p className="text-text-secondary leading-relaxed">
            All data is encrypted in transit and at rest. We're SOC 2 compliant and regularly audited for security. Your coaching practice and client relationships are protected.
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
          appName="CORE COACH"
          logoIcon={Users}
          logoGradientClass="coach-brand-gradient"
          onLoginClick={() => window.location.href = createPageUrl('CoreCoachHome')}
          aboutPageUrl={createPageUrl("AboutCoreCoach")}
          pricingPageUrl={createPageUrl("CoachPricing")}
          isCoachTheme={true}
        />

        <main className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-display">Frequently Asked Questions</h1>
              <p className="text-body-large mt-4">
                Everything you need to know about transforming your coaching practice with Core Coach.
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
        
        <PublicFooter isCoachTheme={true} />
      </div>
    </>
  );
}