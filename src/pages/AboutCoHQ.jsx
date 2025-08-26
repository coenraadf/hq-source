import React from 'react';
import { Button } from "@/components/ui/button";
import { Users, CheckCircle, Lightbulb, TrendingUp, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ScrollToTop from '@/components/utils/ScrollToTop';
import { User } from '@/api/entities';

export default function AboutCoHQ() {
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
        
        <main>
          {/* Hero Section */}
          <section className="section-primary px-6 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="text-4xl sm:text-6xl font-bold text-[var(--text-primary)] mb-6">
                  The Future of Coaching is Collaborative Intelligence
                </h1>
                <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-8 max-w-3xl mx-auto">
                  We're building more than just a tool; we're building a new paradigm for professional coaching where technology enhances, not replaces, the human connection.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="section-secondary px-6 py-16 md:py-24">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Our Mission</h2>
                <p className="text-body mb-4">
                  Our mission is to empower coaches with intelligent, data-driven tools that streamline administrative tasks, reveal deep client insights, and ultimately elevate the impact of their work. We believe that by freeing coaches to focus on what they do best—coaching—we can unlock unprecedented levels of growth and transformation for their clients.
                </p>
                <p className="text-body">
                  CO | HQ is designed to be a coach's trusted digital partner, providing the analytical power to complement their intuitive expertise.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="base-card text-center">
                  <Lightbulb className="w-8 h-8 text-[var(--brand-primary)] mx-auto mb-3" />
                  <h3 className="font-semibold">Deeper Insights</h3>
                </div>
                <div className="base-card text-center">
                  <TrendingUp className="w-8 h-8 text-[var(--brand-primary)] mx-auto mb-3" />
                  <h3 className="font-semibold">Better Outcomes</h3>
                </div>
                <div className="base-card text-center">
                  <Shield className="w-8 h-8 text-[var(--brand-primary)] mx-auto mb-3" />
                  <h3 className="font-semibold">Enhanced Trust</h3>
                </div>
                <div className="base-card text-center">
                  <CheckCircle className="w-8 h-8 text-[var(--brand-primary)] mx-auto mb-3" />
                  <h3 className="font-semibold">Streamlined Workflow</h3>
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="section-primary px-6 py-16 md:py-24">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Meet the Visionaries</h2>
              <p className="text-lg text-[var(--text-secondary)] mb-12 max-w-3xl mx-auto">
                CO | HQ was born from a fusion of coaching expertise and technological innovation, driven by a team passionate about human potential.
              </p>
              {/* Placeholder for team members */}
              <div className="text-center text-warm-muted italic">
                Team profiles coming soon.
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="section-secondary px-6 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">Ready to Elevate Your Practice?</h2>
              <p className="text-lg text-[var(--text-secondary)] mb-8">
                Join our beta program and be among the first to experience the next evolution of professional coaching.
              </p>
              <Button onClick={() => window.location.href = createPageUrl("CoachBetaSignup")} className="btn-primary text-lg px-8 py-4">
                Join the Beta
              </Button>
            </div>
          </section>
        </main>

        <PublicFooter appName="CO | HQ" isCoachTheme={true} />
      </div>
    </>
  );
}