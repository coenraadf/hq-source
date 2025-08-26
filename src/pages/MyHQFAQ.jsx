
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Compass, HelpCircle, Shield, User, Users, 
  ChevronDown, ChevronRight, Mail, MessageSquare 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ScrollToTop from "@/components/utils/ScrollToTop";

const FAQ_DATA = {
  clients: [
    {
      question: "How do I get access to My | HQ?",
      answer: "My | HQ is invitation-only and accessed through your professional coach. Your coach will send you a secure invitation code that gives you access to your private growth space.",
      featured: true
    },
    {
      question: "What can my coach see?",
      answer: "Your coach can only see what you explicitly choose to share. By default, all your journal entries, reflections, and personal data are private. You have granular controls to share specific insights, goal progress, or breakthrough moments when you're ready.",
      featured: true
    },
    {
      question: "Can I remove or export my data?",
      answer: "Yes, absolutely. You can export all your data at any time in standard formats. You can also revoke access to previously shared insights or delete your account entirely while keeping your exported data.",
      featured: true
    },
    {
      question: "Who supports me if I need help?",
      answer: "Technical support is provided by CO | HQ, while coaching guidance comes from your assigned coach. You can contact support directly through My | HQ or ask your coach to help coordinate any technical issues."
    },
    {
      question: "What if my coaching relationship ends?",
      answer: "You retain full access to My | HQ and all your private data even if your coaching relationship ends. You can continue using it independently, connect with a new coach, or export your data and close your account."
    },
    {
      question: "Is my data secure and private?",
      answer: "Yes. All data is encrypted and hosted in Switzerland under strict privacy laws. We're GDPR compliant and give you complete control over what data is shared with your coach. Your private journals and reflections remain completely private unless you choose to share specific content."
    },
    {
      question: "Does My | HQ cost anything?",
      answer: "No, My | HQ access is included in your coach's CO | HQ subscription. There are no additional fees for clients using the invitation-based My | HQ platform."
    },
    {
      question: "Can I use My | HQ without a coach?",
      answer: "No, My | HQ is designed exclusively for clients working with professional coaches who use CO | HQ. Access is only available through coach invitation to ensure the best collaborative experience."
    }
  ],
  coaches: [
    {
      question: "Are you a coach looking to use CO | HQ?",
      answer: "CO | HQ is our professional coaching platform that includes My | HQ access for your clients. Learn more about CO | HQ features, pricing, and how to get started with our founding coach beta program.",
      featured: true
    },
    {
      question: "How do I invite my clients to My | HQ?",
      answer: "Through your CO | HQ dashboard, you can generate secure invitation codes for each client. These codes give them access to their private My | HQ space where they can journal and selectively share insights with you."
    },
    {
      question: "What insights do I get from My | HQ client data?",
      answer: "CO | HQ's AI analyzes client data (with permission) to provide pre-session briefs, identify patterns, track goal progress, and generate outcome reports. You see what clients choose to share plus AI-generated insights to enhance your coaching."
    }
  ]
};

const FAQAccordion = ({ items, icon: Icon, title, color }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h2>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`base-card cursor-pointer transition-all duration-200 hover:shadow-md ${item.featured ? 'border-l-4 border-l-[var(--brand-primary)]' : ''}`}>
              <CardContent className="p-0">
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--text-primary)] text-lg mb-1">
                      {item.question}
                    </h3>
                    {item.featured && (
                      <span className="text-xs text-[var(--brand-primary)] font-medium">Popular Question</span>
                    )}
                  </div>
                  {expandedIndex === index ? (
                    <ChevronDown className="w-5 h-5 text-[var(--text-secondary)] flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[var(--text-secondary)] flex-shrink-0" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        <div className="bg-[var(--bg-secondary)] p-4 rounded-lg">
                          <p className="text-[var(--text-secondary)] leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default function MyHQFAQ() {
  const handleCoachPortal = () => {
    window.location.href = createPageUrl("CoachLanding");
  };

  const handleContact = () => {
    window.location.href = createPageUrl("MyHQContact");
  };

  return (
    <>
      <ScrollToTop />
      <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)]">
        <PublicHeader
          appName="MY | HQ"
          logoIcon={Compass}
          logoGradientClass="compass-brand-gradient"
          onLoginClick={handleCoachPortal}
          aboutPageUrl={createPageUrl("AboutMyHQ")}
          isCoachTheme={false}
        />
        
        <main className="section-primary px-6 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                My | HQ Client Help
              </h1>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                Everything you need to know about using My | HQ as a client in your coach-guided growth journey.
              </p>
            </motion.div>

            <FAQAccordion
              items={FAQ_DATA.clients}
              icon={User}
              title="For Clients (My | HQ - by invitation)"
              color="compass-brand-gradient"
            />

            <FAQAccordion
              items={FAQ_DATA.coaches}
              icon={Users}
              title="Are you a Coach?"
              color="coach-brand-gradient"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-16 pt-12 border-t border-[var(--border-color)]"
            >
              <HelpCircle className="w-12 h-12 text-[var(--brand-primary)] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Need More Help?
              </h2>
              <p className="text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Contact support or ask your coach for assistance.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button onClick={handleContact} className="btn-primary">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button onClick={handleCoachPortal} variant="outline" className="btn-secondary">
                  <Users className="w-4 h-4 mr-2" />
                  Are you a Coach?
                </Button>
              </div>
            </motion.div>
          </div>
        </main>

        <PublicFooter isCoachTheme={false} />
      </div>
    </>
  );
}
