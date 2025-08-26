
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Brain,
  BarChart3,
  TrendingUp,
  Shield,
  Zap,
  Users,
  Calendar,
  CreditCard,
  FolderOpen,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ScrollToTop from "@/components/utils/ScrollToTop";

export default function CoachFeatures() {
  const handleJoinBeta = () => {
    window.location.href = createPageUrl("CoachBetaSignup");
  };

  return (
    <>
      <ScrollToTop />
      <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)]">
        <PublicHeader
          appName="CO | HQ"
          logoIcon={Users}
          logoGradientClass="coach-brand-gradient"
          onLoginClick={handleJoinBeta}
          aboutPageUrl={createPageUrl("AboutCoHQ")}
          pricingPageUrl={createPageUrl("CoHQPricing")}
          isCoachTheme={true}
        />

        <main>
          {/* Hero Section */}
          <section className="section-primary px-6 py-20 md:py-32">
            <div className="max-w-7xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="text-4xl sm:text-6xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
                  Build Your Practice's<br />
                  <span className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] bg-clip-text text-transparent">
                    "Second Brain"
                  </span>
                </h1>

                <p className="text-xl sm:text-2xl text-[var(--text-secondary)] mb-8 max-w-4xl mx-auto leading-relaxed">
                  Focus on your clients, not admin. Our AI handles the synthesis, pattern recognition, and insights—so you can focus on transformation.
                </p>

                <Button onClick={handleJoinBeta} size="lg" className="btn-primary">
                  <Users className="w-5 h-5 mr-2" />
                  Join Beta Program
                </Button>
              </motion.div>
            </div>
          </section>

          {/* Core Features */}
          <section className="section-secondary px-6 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-h2 mb-6">The Complete Coaching Intelligence Platform</h2>
                <p className="text-body-large max-w-3xl mx-auto">
                  Every feature designed to save you time, increase client satisfaction, and prove your coaching ROI.
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-8 mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="lg:col-span-2"
                >
                  <Card className="feature-card h-full p-8">
                    <div className="flex items-start gap-6">
                      <div className="icon-container icon-container-branded">
                        <Brain className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">AI-Generated Session Briefs</h3>
                        <p className="text-body-large text-[var(--text-secondary)] mb-6">
                          Arrive prepared for every session with AI-synthesized insights from client journals, assessments, and previous conversations.
                        </p>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span>Pattern recognition across all client data</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span>Suggested conversation starters and focus areas</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span>Breakthrough moment alerts and progress tracking</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  <Card className="feature-card p-6">
                    <Clock className="w-8 h-8 text-[var(--brand-primary)] mb-4" />
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">Save 4+ Hours Weekly</h4>
                    <p className="text-sm text-[var(--text-secondary)]">Automated prep work and insight synthesis</p>
                  </Card>
                  <Card className="feature-card p-6">
                    <Target className="w-8 h-8 text-[var(--brand-primary)] mb-4" />
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">20% Better Outcomes</h4>
                    <p className="text-sm text-[var(--text-secondary)]">Data-driven insights lead to breakthrough moments</p>
                  </Card>
                </motion.div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="feature-card p-8"
                >
                  <div className="flex items-start gap-6">
                    <div className="icon-container icon-container-branded">
                      <BarChart3 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Outcome & ROI Reporting</h3>
                      <p className="text-body text-[var(--text-secondary)] mb-4">
                        Beautiful, shareable reports that prove your coaching impact. Perfect for corporate clients and contract renewals.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Progress visualization and goal tracking
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Client satisfaction and engagement metrics
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Branded reports for corporate stakeholders
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="feature-card p-8"
                >
                  <div className="flex items-start gap-6">
                    <div className="icon-container icon-container-branded">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Retention & Churn Alerts</h3>
                      <p className="text-body text-[var(--text-secondary)] mb-4">
                        Spot at-risk clients early and intervene proactively. Increase retention rates by 15-20%.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Early warning system for disengagement
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Suggested intervention strategies
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Automated check-in reminders
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Deep Synthesis Section */}
          <section className="section-primary px-6 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-h2 mb-6">Deep Synthesis Across All Client Data</h2>
                <p className="text-body-large max-w-3xl mx-auto">
                  Our AI analyzes patterns across journals, assessments, session notes, and goals to surface insights you might miss.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-4 gap-6">
                {[
                  {
                    icon: MessageSquare,
                    title: "Session Notes",
                    description: "AI processes conversation themes and breakthrough moments"
                  },
                  {
                    icon: FolderOpen,
                    title: "Client Journals",
                    description: "Pattern recognition across personal reflections and insights"
                  },
                  {
                    icon: BarChart3,
                    title: "Assessments",
                    description: "Personality tests, evaluations, and progress measurements"
                  },
                  {
                    icon: Target,
                    title: "Goal Tracking",
                    description: "Progress analysis and milestone achievement patterns"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="icon-container icon-container-branded mx-auto mb-4">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">{item.title}</h4>
                    <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Integrations Section */}
          <section className="section-secondary px-6 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-h2 mb-6">Connect the Tools You Already Use</h2>
                <p className="text-body-large max-w-3xl mx-auto">
                  Seamless integrations with your existing workflow. No need to change how you work—just enhance it.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="feature-card"
                >
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-orange-100 rounded-lg">
                    <span className="text-orange-600 font-bold text-xl">C</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Calendly</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Sync scheduling and session management</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="feature-card"
                >
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" alt="Stripe" className="h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Stripe</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Payment processing and subscription management</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="feature-card"
                >
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Google Drive" className="w-12 h-12" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Google Drive</h3>
                  <p className="text-[var(--text-secondary)] text-sm">File sharing and document collaboration</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="feature-card"
                >
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <img src="https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg" alt="Slack" className="w-12 h-12" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Slack</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Team communication and client updates</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Privacy & Security */}
          <section className="section-primary px-6 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-h2 mb-6">Swiss-Hosted, Privacy-First Platform</h2>
                  <p className="text-body-large text-[var(--text-secondary)] mb-8">
                    Your clients' data is sacred. We built Core Compass with Swiss-level privacy standards, GDPR compliance, and client-owned data principles.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-green-600" />
                      <span className="font-medium">End-to-end encryption for all data</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-green-600" />
                      <span className="font-medium">Client consent controls for every data point</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-green-600" />
                      <span className="font-medium">GDPR & HIPAA compliant infrastructure</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-green-600" />
                      <span className="font-medium">Swiss data hosting with European privacy laws</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="feature-card p-8"
                >
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 text-left">How Data Consent Works</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] text-white text-base font-bold flex items-center justify-center flex-shrink-0">1</div>
                      <div className="text-left">
                        <p className="font-medium text-[var(--text-primary)] text-left">Client Invitation</p>
                        <p className="text-sm text-[var(--text-secondary)] text-left">You invite clients to share specific data for coaching insights</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] text-white text-base font-bold flex items-center justify-center flex-shrink-0">2</div>
                      <div className="text-left">
                        <p className="font-medium text-[var(--text-primary)] text-left">Explicit Consent</p>
                        <p className="text-sm text-[var(--text-secondary)] text-left">Clients control exactly what data is shared and when</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] text-white text-base font-bold flex items-center justify-center flex-shrink-0">3</div>
                      <div className="text-left">
                        <p className="font-medium text-[var(--text-primary)] text-left">Secure Analysis</p>
                        <p className="text-sm text-[var(--text-secondary)] text-left">AI processes only consented data for coaching insights</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="section-secondary px-6 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-h2 mb-6">Ready to Transform Your Coaching Practice?</h2>
                <p className="text-body-large mb-8">
                  Join our founding coach beta and help shape the future of AI-powered coaching.
                </p>
                <Button onClick={handleJoinBeta} size="lg" className="btn-primary">
                  <Users className="w-5 h-5 mr-2" />
                  Apply for Beta Access
                </Button>
                <p className="text-sm text-[var(--text-secondary)] mt-4">
                  90-day free pilot • No commitment • Full feature access
                </p>
              </motion.div>
            </div>
          </section>
        </main>

        <PublicFooter isCoachTheme={true} />
      </div>
    </>
  );
}
