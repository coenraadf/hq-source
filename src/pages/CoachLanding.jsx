
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users, BarChart3, Brain, Shield, Clock, TrendingUp,
  CheckCircle, ArrowRight, Zap, FileText, Target, Award,
  Building2, Globe, Lock, Share2, Lightbulb, Calendar, LogIn
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ScrollToTop from "@/components/utils/ScrollToTop";
import { User } from "@/api/entities";

export default function CoachLanding() {

  const handleLogin = async () => {
    try {
      // Check if user is already authenticated
      const currentUser = await User.me();
      if (currentUser && currentUser.onboarding_completed && currentUser.user_type === 'coach') {
        // User is already logged in as coach, redirect to coach dashboard
        window.location.href = createPageUrl("CoachDashboard");
        return;
      }
    } catch (error) {
      // User is not authenticated, proceed with login
      console.log("User not authenticated, proceeding with login flow");
    }

    // Trigger the login flow - this should show a login form
    try {
      await User.loginWithRedirect(window.location.origin + createPageUrl("CoachDashboard"));
    } catch (error) {
      console.error("Login failed:", error);
      // Fallback to basic login if redirect fails
      await User.login();
    }
  };

  const handleRequestDemo = () => {
    window.location.href = createPageUrl("RequestDemo");
  };

  const handleEnterpriseContact = () => {
    window.location.href = createPageUrl("EnterpriseSolutions");
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
          {/* Hero Section - Dynamic with Animated Elements */}
          <section className="section-primary px-6 py-20 md:py-32 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] opacity-5 rounded-full"></div>
              {/* Removed the second smaller blue circle as requested */}
            </div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-light)] text-white px-4 py-2 rounded-full mb-6">
                  <Brain className="w-4 h-4" />
                  <span className="text-sm font-medium">For Professional Coaches Only</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold text-[var(--text-primary)] mb-6">
                  Transform Your Coaching Practice with AI Intelligence
                </h1>
                <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-8 leading-relaxed">
                  CO | HQ analyzes client sessions, notes, and progress to generate actionable insights and measurable outcomes—helping you deliver more impact with less admin.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Button onClick={handleLogin} className="btn-primary text-lg px-8 py-4">
                    <LogIn className="w-5 h-5 mr-2" />
                    Coach Login
                  </Button>
                  <Button onClick={handleRequestDemo} variant="outline" className="btn-secondary text-lg px-8 py-4">
                    <Calendar className="w-5 h-5 mr-2" />
                    Request Demo
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-[var(--border-color)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="icon-container icon-container-branded w-8 h-8">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-[var(--text-primary)]">Session Impact Report</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                      <span className="text-sm font-medium text-green-800">Client Breakthrough Identified</span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <span className="text-sm font-medium text-blue-800">Goal Progress: +23%</span>
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <span className="text-sm font-medium text-purple-800">Recommended Focus Areas</span>
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Professional Coach Testimonials */}
          <section className="bg-gradient-to-r from-[var(--bg-secondary)] to-white px-6 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-h2 mb-4">Trusted by Top Coaches, Coaching Teams, and Organizations</h2>
                <p className="text-body-large max-w-3xl mx-auto text-[var(--text-secondary)]">
                  Professional coaches are already seeing measurable improvements in client outcomes and practice efficiency.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-[var(--border-color)] relative"
                >
                  <div className="absolute -top-3 -left-3 w-6 h-6 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] rounded-full"></div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] rounded-full flex items-center justify-center text-white font-bold">
                      LS
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--text-primary)]">Lisa S.</h4>
                      <p className="text-sm text-[var(--text-secondary)]">Executive Coach, Fortune 500</p>
                    </div>
                  </div>
                  <p className="text-[var(--text-secondary)] italic leading-relaxed">
                    "CO | HQ has transformed how I prepare for sessions. The AI briefs surface patterns I might have missed, and my client retention has increased by 18% since implementation."
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-lg border border-[var(--border-color)] relative"
                >
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] rounded-full"></div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] rounded-full flex items-center justify-center text-white font-bold">
                      MR
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--text-primary)]">Michael R.</h4>
                      <p className="text-sm text-[var(--text-secondary)]">Leadership Coach & Team Facilitator</p>
                    </div>
                  </div>
                  <p className="text-[var(--text-secondary)] italic leading-relaxed">
                    "The outcome dashboards are game-changing for corporate clients. I can now show clear ROI and measurable transformation—it's elevated my entire practice."
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="section-secondary px-6 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-h2 mb-6">A Smarter Workflow, Not a New One</h2>
                <p className="text-body-large max-w-3xl mx-auto">
                  CO | HQ integrates seamlessly into your practice, saving you hours on prep and follow-up so you can focus on what you do best: coaching.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-start gap-6 text-left">
                  <div className="icon-container icon-container-soft" aria-label="Connect Icon">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">1. Connect Sessions & Notes</h3>
                    <p className="text-body text-[var(--text-secondary)]">Securely link client notes, goals, and session data in one privacy-first hub. Your data, your control.</p>
                  </div>
                </motion.div>
                {/* Step 2 */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex items-start gap-6 text-left">
                   <div className="icon-container icon-container-soft" aria-label="AI Briefs Icon">
                    <Lightbulb className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">2. Receive Actionable Briefs</h3>
                    <p className="text-body text-[var(--text-secondary)]">Before each session, receive an AI-powered brief highlighting progress, potential blocks, and key themes.</p>
                  </div>
                </motion.div>
                {/* Step 3 */}
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex items-start gap-6 text-left">
                   <div className="icon-container icon-container-soft" aria-label="Dashboards Icon">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">3. Show Outcome Dashboards</h3>
                    <p className="text-body text-[var(--text-secondary)]">Clearly demonstrate client progress and coaching ROI to clients and sponsoring organizations.</p>
                  </div>
                </motion.div>
              </div>

            </div>
          </section>

          {/* Value Metrics */}
          <section className="bg-gradient-to-r from-[var(--bg-secondary)] to-white px-6 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-lg border border-[var(--border-color)]"
                >
                  <div className="text-4xl font-bold text-[var(--brand-primary)] mb-2">4.2</div>
                  <div className="text-[var(--text-secondary)] font-medium">Hours saved per month</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-lg border border-[var(--border-color)]"
                >
                  <div className="text-4xl font-bold text-[var(--brand-primary)] mb-2">18%</div>
                  <div className="text-[var(--text-secondary)] font-medium">Average client retention increase</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-6 rounded-xl shadow-lg border border-[var(--border-color)]"
                >
                  <div className="text-4xl font-bold text-[var(--brand-primary)] mb-2">3x</div>
                  <div className="text-[var(--text-secondary)] font-medium">Faster session preparation</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-white p-6 rounded-xl shadow-lg border border-[var(--border-color)]"
                >
                  <div className="text-4xl font-bold text-[var(--brand-primary)] mb-2">94%</div>
                  <div className="text-[var(--text-secondary)] font-medium">Coach satisfaction rate</div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <section className="section-secondary px-6 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-h2 mb-6">Ready to Transform Your Practice?</h2>
                <p className="text-body-large mb-8">
                  Join hundreds of professional coaches already using CO | HQ to deliver better outcomes with less effort.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button onClick={handleLogin} className="btn-primary">
                    <LogIn className="w-5 h-5 mr-2" />
                    Coach Login
                  </Button>
                  <Button onClick={handleRequestDemo} variant="outline" className="btn-secondary">
                    <Calendar className="w-5 h-5 mr-2" />
                    Request Demo
                  </Button>
                </div>
                <div className="mt-8 text-sm text-[var(--text-secondary)]">
                  <p>Looking for personal growth? <button onClick={() => window.location.href = createPageUrl("MyHQHome")} className="text-[var(--brand-primary)] hover:underline font-medium">Visit My | HQ →</button></p>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <PublicFooter isCoachTheme={true} />
      </div>
    </>
  );
}
