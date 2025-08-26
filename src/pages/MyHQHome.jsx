
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Compass, ShieldCheck, HeartHandshake, Zap, BookOpen, Target, CheckCircle,
  UserCheck, NotebookPen, ArrowRight, LogIn, Shield, Users
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ScrollToTop from "@/components/utils/ScrollToTop";
import { User } from "@/api/entities";

export default function MyHQHome() {
  const [inviteCode, setInviteCode] = React.useState("");

  const handleLogin = async () => {
    try {
      // Check if user is already authenticated
      const currentUser = await User.me();
      if (currentUser && currentUser.onboarding_completed) {
        // User is already logged in, redirect to dashboard
        window.location.href = createPageUrl("Dashboard");
        return;
      }
    } catch (error) {
      // User is not authenticated, proceed with login
      console.log("User not authenticated, proceeding with login flow");
    }
    
    // Trigger the login flow - this should show a login form
    try {
      await User.loginWithRedirect(window.location.origin + createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Login failed:", error);
      // Fallback to basic login if redirect fails
      await User.login();
    }
  };

  const handleEnterCode = () => {
    if (inviteCode.trim()) {
      // This would normally validate the code and redirect to client onboarding
      window.location.href = createPageUrl("ClientOnboarding") + "?code=" + inviteCode;
    }
  };

  return (
    <>
      <ScrollToTop />
      <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)]">
        <PublicHeader
          appName="MY | HQ"
          logoIcon={Compass}
          logoGradientClass="compass-brand-gradient"
          onLoginClick={handleLogin}
          aboutPageUrl={createPageUrl("AboutMyHQ")}
          isCoachTheme={false}
        />

        <main>
          {/* Hero Section */}
          <section className="section-primary px-6 py-20 md:py-32">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--brand-primary-light)] to-[var(--brand-primary)] text-white px-4 py-2 rounded-full mb-6">
                    <Compass className="w-5 h-5" />
                    <span className="text-sm font-medium">Personal Growth Portal</span>
                  </div>
                  <h1 className="text-4xl sm:text-6xl font-bold text-[var(--text-primary)] mb-6">
                    Your private space for growth and reflection
                  </h1>
                  <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-8">
                    Capture insights, track goals, and collaborate with your coach like never before.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={handleLogin} className="btn-primary">
                      <LogIn className="w-5 h-5 mr-2" />
                      Client Login
                    </Button>
                    <Link to={createPageUrl("CoachLanding")}>
                      <Button variant="outline" className="btn-secondary">
                        Are you a coach? <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="relative"
                >
                  <div className="relative z-10">
                    <img
                      src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/8c5207b2a_2dda11515_Guywithmap.png"
                      alt="A person looking at a map, symbolizing a guided journey"
                      className="w-full h-auto max-w-md mx-auto rounded-2xl shadow-2xl"
                      loading="eager"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand-primary)]/20 to-transparent rounded-2xl -z-10 transform translate-x-4 translate-y-4"></div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* How It Works for Clients */}
          <section className="section-secondary px-6 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-h2 mb-6">Your Personal Growth Space</h2>
                <p className="text-body-large max-w-3xl mx-auto">
                  My | HQ is your private digital space to capture insights, track progress, and collaborate with your coach—all while maintaining complete control over your data.
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-8">
                {[
                  {
                    step: "1",
                    icon: HeartHandshake,
                    title: "Capture & Reflect",
                    description: "Journal your thoughts, breakthrough moments, and daily reflections in a private, secure space designed for deep self-discovery."
                  },
                  {
                    step: "2",
                    icon: Target,
                    title: "Share with Purpose",
                    description: "Choose exactly what insights to share with your coach—from journal entries to goal progress—with granular privacy controls."
                  },
                  {
                    step: "3",
                    icon: BookOpen,
                    title: "Grow Together",
                    description: "Get personalized session prep, growth dashboards, and coaching resources curated specifically for your development journey."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="text-center"
                  >
                    <div className="relative mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                        {item.step}
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-lg flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-[var(--brand-primary)]" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-h3 mb-4">{item.title}</h3>
                    <p className="text-body leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Features for Clients */}
          <section className="section-primary px-6 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-h2 mb-6">A Private Space for Your Growth</h2>
                <p className="text-body-large max-w-3xl mx-auto">
                  My | HQ provides the tools you need to find clarity and take action, with privacy and autonomy at the center.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="feature-card p-8"
                >
                  <div className="flex items-start gap-6">
                    <div className="icon-container icon-container-soft" aria-label="Private Journaling Icon">
                      <NotebookPen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Private Journaling</h3>
                      <p className="text-body text-[var(--text-secondary)] mb-4">
                        Write freely in your personal space. Share specific entries with your coach when ready, or keep them completely private.
                      </p>
                      <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Rich text editor for detailed reflections</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Mood tracking and breakthrough tagging</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Complete control over sharing permissions</li>
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
                    <div className="icon-container icon-container-soft" aria-label="Goal Collaboration Icon">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Goal Collaboration</h3>
                      <p className="text-body text-[var(--text-secondary)] mb-4">
                        Work on goals with your coach's guidance. Track progress and celebrate milestones together.
                      </p>
                      <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Visual progress tracking and analytics</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Coach-guided goal setting and refinement</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Milestone celebrations and achievements</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="feature-card p-8"
                >
                  <div className="flex items-start gap-6">
                    <div className="icon-container icon-container-soft" aria-label="Coach Collaboration Icon">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Coach Collaboration</h3>
                      <p className="text-body text-[var(--text-secondary)] mb-4">
                        Receive personalized insights, resources, and session prep materials curated by your coach.
                      </p>
                      <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Pre-session briefs and conversation starters</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Personalized resources and exercises</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Progress insights and pattern recognition</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="feature-card p-8"
                >
                  <div className="flex items-start gap-6">
                    <div className="icon-container icon-container-soft" aria-label="Swiss-Level Privacy Icon">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Swiss-Level Privacy</h3>
                      <p className="text-body text-[var(--text-secondary)] mb-4">
                        Your data belongs to you. Share only what you choose, when you choose, with complete transparency.
                      </p>
                      <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Granular consent controls for every data point</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Swiss-hosted, GDPR-compliant infrastructure</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />End-to-end encryption for all personal data</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Privacy & Consent Explanation */}
          <section className="section-secondary px-6 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-h2 mb-6">You Always Control What Your Coach Sees</h2>
                  <p className="text-body-large text-[var(--text-secondary)] mb-8">
                    My | HQ is built on a foundation of trust and transparency. Every piece of data you share is a conscious choice, not an automatic one.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-green-600" />
                      <span className="font-medium">Private by design—hosted in Switzerland</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-green-600" />
                      <span className="font-medium">Nothing is shared without your explicit consent</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-green-600" />
                      <span className="font-medium">Revoke access to any data at any time</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-green-600" />
                      <span className="font-medium">Full audit trail of what's been shared</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="feature-card p-8"
                >
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">How Consent Works</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] text-white text-sm font-bold flex items-center justify-center mt-1">1</div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">You Create Content</p>
                        <p className="text-sm text-[var(--text-secondary)]">Journal entries, goals, and reflections stay completely private initially</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] text-white text-sm font-bold flex items-center justify-center mt-1">2</div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">You Choose to Share</p>
                        <p className="text-sm text-[var(--text-secondary)]">Select specific content to share with your coach when you're ready</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] text-white text-sm font-bold flex items-center justify-center mt-1">3</div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">Coach Gets Context</p>
                        <p className="text-sm text-[var(--text-secondary)]">Your coach receives only what you've explicitly shared for better sessions</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="section-primary px-6 py-16 md:py-24">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-h2 mb-6">Questions About My | HQ?</h2>
                <p className="text-body-large">Everything you need to know about using your private growth portal.</p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">Can I use My | HQ without a coach?</h4>
                    <p className="text-[var(--text-secondary)]">No, My | HQ is designed exclusively for clients working with professional coaches. Access is only available through coach invitation.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">What happens to my data if I stop working with my coach?</h4>
                    <p className className="text-[var(--text-secondary)]">Your data remains yours. You can export everything, continue with a new coach, or maintain private access to your personal content.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">How secure is my personal information?</h4>
                    <p className="text-[var(--text-secondary)]">All data is Swiss-hosted with end-to-end encryption, GDPR compliance, and explicit consent controls for every piece of shared information.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">Can I keep some entries completely private?</h4>
                    <p className="text-[var(--text-secondary)]">Absolutely. You have granular control over what you share. Many clients keep personal reflections private while sharing goal progress with their coach.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">How do I know what my coach can see?</h4>
                    <p className="text-[var(--text-secondary)]">Your dashboard shows exactly what's been shared and when. You can review, modify, or revoke access to any content at any time.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-2">Is there a cost for clients to use My | HQ?</h4>
                    <p className="text-[var(--text-secondary)]">My | HQ access is included in your coach's CO | HQ subscription. There are no additional fees for clients.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="section-secondary px-6 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-h2 mb-6">Ready to Begin Your Growth Journey?</h2>
                <p className="text-body-large mb-8">
                  Ask your coach for your My | HQ invitation and start capturing insights in your private, secure space.
                </p>
                <div className="max-w-md mx-auto">
                  <Card className="base-card p-6">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Enter invitation code..."
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        className="form-input"
                      />
                      <Button onClick={handleEnterCode} className="btn-primary">
                        Start Journey
                      </Button>
                    </div>
                  </Card>
                </div>
                <div className="mt-8 text-sm text-[var(--text-secondary)]">
                  <p>Don't have a coach yet? <button onClick={() => { window.location.href = createPageUrl("CoachLanding"); }} className="text-[var(--brand-primary)] hover:underline font-medium">Find coaches using CO | HQ →</button></p>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <PublicFooter isCoachTheme={false} />
      </div>
    </>
  );
}
