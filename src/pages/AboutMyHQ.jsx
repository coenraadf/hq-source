
import React from 'react';
import { Button } from '@/components/ui/button';
import { Compass, Shield, Heart, Zap, User, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import ScrollToTop from '@/components/utils/ScrollToTop';

export default function AboutMyHQ() {
  return (
    <>
      <ScrollToTop />
      <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)]">
        <PublicHeader
          appName="MY | HQ"
          logoIcon={Compass}
          logoGradientClass="compass-brand-gradient"
          onLoginClick={() => window.location.href = createPageUrl('CoachLanding')}
          aboutPageUrl={createPageUrl("AboutMyHQ")}
          isCoachTheme={false}
        />
        
        <main>
          {/* Hero Section */}
          <section className="section-primary px-6 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <h1 className="text-4xl sm:text-6xl font-bold text-[var(--text-primary)] mb-6">
                  Your Private Growth Space
                </h1>
                <p className="text-2xl text-[var(--brand-primary)] font-semibold mb-8 max-w-3xl mx-auto leading-snug">
                  My | HQ is a secure, invitation-only platform designed to help you get the most out of your professional coaching journey.
                </p>
                <p className="text-lg text-[var(--text-secondary)]">
                  Capture insights, track progress, and collaborate with your coach—all with total control over your data.
                </p>
              </motion.div>
            </div>
          </section>
          
          {/* Core Principles */}
          <section className="section-secondary px-6 py-16 md:py-24">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-h2">Built On Trust</h2>
                <p className="text-body-large max-w-3xl mx-auto">
                  Our platform was created with your privacy and growth as the highest priorities.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="feature-card">
                  <Shield className="w-12 h-12 text-[var(--brand-primary)] mx-auto mb-4" />
                  <h3 className="text-h3">You Own Your Data</h3>
                  <p className="text-body">Your journal is private by default. You decide what, if anything, to share with your coach. You can export or delete your data at any time.</p>
                </div>
                <div className="feature-card">
                  <User className="w-12 h-12 text-[var(--brand-primary)] mx-auto mb-4" />
                  <h3 className="text-h3">Invitation Only</h3>
                  <p className="text-body">My | HQ is not a public platform. Access is exclusively granted by professional coaches using CO | HQ, ensuring a focused and secure environment.</p>
                </div>
                <div className="feature-card">
                  <Zap className="w-12 h-12 text-[var(--brand-primary)] mx-auto mb-4" />
                  <h3 className="text-h3">Purpose-Built for Growth</h3>
                  <p className="text-body">Every feature is designed to help you reflect, find clarity, and make meaningful progress on the goals you set with your coach.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* How it Works Section */}
          <section className="section-primary px-6 py-16 md:py-24">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-h2">How It Works</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex flex-col items-center">
                  <div className="icon-container icon-container-branded mb-4"><div className="text-xl font-bold">1</div></div>
                  <h3 className="text-h3">Accept Invite</h3>
                  <p className="text-body">Your coach sends you a secure link to join My | HQ and set up your private account.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
                  <div className="icon-container icon-container-branded mb-4"><div className="text-xl font-bold">2</div></div>
                  <h3 className="text-h3">Capture Insights</h3>
                  <p className="text-body">Use your private journal to capture thoughts, reflections, and breakthroughs as they happen.</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex flex-col items-center">
                  <div className="icon-container icon-container-branded mb-4"><div className="text-xl font-bold">3</div></div>
                  <h3 className="text-h3">Share & Grow</h3>
                  <p className="text-body">Share specific entries with your coach to get feedback and accelerate your progress together.</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="section-secondary px-6 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-h2 mb-6">Ready to Start Your Journey?</h2>
                <p className="text-body-large mb-8">
                  If you're working with a coach, ask them for your invitation to My | HQ.
                </p>
                <Button asChild size="lg" className="btn-primary bg-[var(--brand-secondary)] hover:bg-[var(--brand-secondary)]/90">
                  <Link to={createPageUrl("CoachLanding")}>
                    <Users className="w-5 h-5 mr-2" />
                    Are you a Coach? Explore CO | HQ
                  </Link>
                </Button>
              </motion.div>
            </div>
          </section>
        </main>
        
        <PublicFooter isCoachTheme={false} />
      </div>
    </>
  );
}
