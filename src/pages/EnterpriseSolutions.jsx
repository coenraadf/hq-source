
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, Building2, BarChart3, Shield, Globe, Zap, 
  CheckCircle, TrendingUp, Lock, Database, Briefcase, 
  Settings, Award, Clock, Download, SlidersHorizontal
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ScrollToTop from "@/components/utils/ScrollToTop";

export default function EnterpriseSolutions() {
  const handleRequestDemo = () => {
    window.location.href = createPageUrl("RequestDemo");
  };

  const handleContactSales = () => {
    window.location.href = createPageUrl("CoHQContact");
  };

  return (
    <>
      <ScrollToTop />
      <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)]">
        <PublicHeader
          appName="CO | HQ"
          logoIcon={Users}
          logoGradientClass="coach-brand-gradient"
          onLoginClick={handleRequestDemo}
          aboutPageUrl={createPageUrl("AboutCoHQ")}
          pricingPageUrl={createPageUrl("CoHQPricing")}
          isCoachTheme={true}
        />
        
        <main>
          {/* Hero Section */}
          <section className="bg-stone-800 text-white px-6 py-20 md:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-slate-700/30 [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]"></div>
            <div className="max-w-4xl mx-auto text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <div className="inline-flex items-center gap-2 bg-stone-700/50 px-4 py-2 rounded-full mb-6 border border-stone-600">
                  <Building2 className="w-4 h-4 text-[var(--brand-primary-light)]" />
                  <span className="text-sm font-medium text-stone-300">For Coaching Organizations & Teams</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
                  Transform Coaching at Scale for Your Organization
                </h1>
                <p className="text-lg sm:text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
                  CO | HQ brings secure, AI-driven impact and outcome reporting to every coach and client—while you maintain compliance, privacy, and control.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Key Use Cases */}
          <section className="section-secondary px-6 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <h2 className="text-h2 mb-6">Built for Enterprise. Loved by Coaches.</h2>
                  <p className="text-body-large text-[var(--text-secondary)] mb-8">
                    Deploy a world-class coaching platform that meets your security and administration needs without sacrificing the quality of the coaching experience.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span><span className="font-semibold">Organization-wide administration</span> and analytics</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span><span className="font-semibold">AI-powered progress & impact dashboards</span> for leaders</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span><span className="font-semibold">Single Sign-On (SSO)</span> and secure permissions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span><span className="font-semibold">White-labeling</span> for brand consistency</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span><span className="font-semibold">Dedicated onboarding and support</span> teams</span>
                    </li>
                     <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                      <span><span className="font-semibold">Full privacy & regulatory compliance</span> (Swiss, GDPR-ready)</span>
                    </li>
                  </ul>
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                  <Card className="base-card bg-white transform -rotate-1 overflow-hidden">
                    <CardContent className="p-0">
                       <div 
                        className="w-full h-auto aspect-video bg-cover bg-center rounded-lg shadow-xl"
                        style={{ backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/d59bb29ac_dashboard.png')` }}
                        role="img"
                        aria-label="Enterprise Dashboard"
                      >
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>
          
           {/* Compliance/Trust Section */}
          <section className="section-primary px-6 py-12">
            <div className="max-w-5xl mx-auto bg-gradient-to-r from-stone-700 to-stone-800 text-white rounded-xl p-8 shadow-2xl">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <Shield className="w-8 h-8 mb-3 text-[var(--brand-primary-light)]"/>
                  <h4 className="font-bold">Swiss-hosted. GDPR-first.</h4>
                </div>
                <div className="flex flex-col items-center">
                  <Lock className="w-8 h-8 mb-3 text-[var(--brand-primary-light)]"/>
                  <h4 className="font-bold">SSO-Ready (SAML/OAuth)</h4>
                </div>
                <div className="flex flex-col items-center">
                  <Database className="w-8 h-8 mb-3 text-[var(--brand-primary-light)]"/>
                  <h4 className="font-bold">Full Data Portability & Control</h4>
                </div>
              </div>
            </div>
          </section>


          {/* Enterprise Features */}
          <section className="section-primary px-6 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
                <h2 className="text-h2 mb-6">Designed for Security, Compliance, and Scale</h2>
                <p className="text-body-large max-w-3xl mx-auto">
                  CO | HQ provides the robust features your organization needs to manage a thriving coaching program.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  <div className="flex items-start gap-6">
                    <div className="icon-container icon-container-soft" aria-label="Multi-Coach Administration Icon">
                      <SlidersHorizontal className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Multi-Coach Administration</h3>
                      <p className="text-body text-[var(--text-secondary)] mb-4">
                        Centralized dashboard for managing multiple coaches, assigning clients, and monitoring coaching quality across your organization.
                      </p>
                      <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Role-based access controls</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Coach performance analytics</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Bulk client onboarding</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="icon-container icon-container-soft" aria-label="White-Label Platform Icon">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">White-Label Platform</h3>
                      <p className="text-body text-[var(--text-secondary)] mb-4">
                        Deploy our platform under your brand with custom domains, logos, and color schemes that match your organization's identity.
                      </p>
                      <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Custom branding and domains</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Configurable user interface</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Embedded deployment options</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  <div className="flex items-start gap-6">
                    <div className="icon-container icon-container-soft" aria-label="Executive Analytics Icon">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Executive Analytics</h3>
                      <p className="text-body text-[var(--text-secondary)] mb-4">
                        Real-time dashboards and automated reports for leadership teams, showing coaching program impact and ROI across the organization.
                      </p>
                      <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Executive summary dashboards</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Automated ROI calculations</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Department-level insights</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="icon-container icon-container-soft" aria-label="Enterprise Integrations Icon">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Enterprise Integrations</h3>
                      <p className="text-body text-[var(--text-secondary)] mb-4">
                        Seamless connections with your existing HRIS, communication tools, and business systems for smooth data flow and user management.
                      </p>
                      <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />SSO (SAML, OAuth, LDAP)</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />HRIS sync (Workday, BambooHR)</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" />Slack, Teams, Zoom integration</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
          
          {/* Social Proof */}
          <section className="section-secondary px-6 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
               <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                 <p className="text-3xl font-semibold text-[var(--text-primary)] italic leading-snug">"After 3 months, our talent retention rose by 15% using CO | HQ. The ability to see real progress, not just activity, is game-changing."</p>
                 <div className="mt-6 flex items-center justify-center gap-4">
                   <img src="https://i.pravatar.cc/150?u=jane_doe" alt="Jane Doe" className="w-12 h-12 rounded-full border-2 border-white"/>
                   <div>
                     <p className="font-semibold text-lg text-[var(--text-primary)]">Jane Doe</p>
                     <p className="text-[var(--text-secondary)]">VP of People, TechCorp</p>
                   </div>
                 </div>
              </motion.div>
            </div>
          </section>

          {/* CTA Bar */}
          <section className="bg-stone-800 text-white">
            <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to scale coaching results?</h2>
              <p className="text-stone-300 max-w-2xl mx-auto mb-8">
                Let's discuss your organization's unique needs and how CO | HQ can help you achieve your talent development goals.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button onClick={handleRequestDemo} size="lg" className="btn-primary text-lg px-8 py-4">
                  Request a Custom Demo
                </Button>
                <Button onClick={handleContactSales} variant="outline" size="lg" className="border-stone-400 text-stone-200 hover:bg-stone-700 hover:text-white text-lg px-8 py-4">
                  Contact Enterprise Sales
                </Button>
                 <Button onClick={() => alert('Download will be available soon!')} variant="outline" size="lg" className="border-stone-400 text-stone-200 hover:bg-stone-700 hover:text-white text-lg px-8 py-4">
                  <Download className="w-5 h-5 mr-2" />
                  Download Brochure
                </Button>
              </div>
            </div>
          </section>

        </main>
        
        <PublicFooter isCoachTheme={true} />
      </div>
    </>
  );
}
