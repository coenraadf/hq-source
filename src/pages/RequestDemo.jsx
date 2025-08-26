
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, ArrowRight, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ScrollToTop from "@/components/utils/ScrollToTop";
import { createPageUrl } from "@/utils";

export default function RequestDemo() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    message: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Demo Request Submitted:", formData);
    setSubmitted(true);
  };

  return (
    <>
      <ScrollToTop />
      <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)]">
        <PublicHeader
          appName="CO | HQ"
          logoIcon={Users}
          logoGradientClass="coach-brand-gradient"
          onLoginClick={() => window.location.href = createPageUrl('CoachLanding')}
          aboutPageUrl={createPageUrl("CoachAbout")}
          pricingPageUrl={createPageUrl("CoachPricing")}
          isCoachTheme={true}
        />
        
        <main className="section-primary px-6 py-20 md:py-32">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                Request a Live Demo
              </h1>
              <p className="text-lg text-[var(--text-secondary)]">
                See how Core Compass can transform your coaching practice or organization. Get a personalized walkthrough of our AI-powered insight engine.
              </p>
            </motion.div>
            
            <Card className="base-card">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center p-8"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Thank You!</h2>
                    <p className="text-[var(--text-secondary)] mb-6">
                      Your demo request has been submitted. Our team will contact you within one business day to schedule your session.
                    </p>
                    <Button onClick={() => window.location.href = createPageUrl('CoachLanding')} variant="outline" className="btn-secondary">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Back to Homepage
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-[var(--brand-primary)]" />
                        Schedule Your Demo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-[var(--text-secondary)]">Full Name</label>
                            <Input id="name" name="name" placeholder="Alex Smith" required className="form-input" onChange={handleInputChange} value={formData.name} />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-[var(--text-secondary)]">Work Email</label>
                            <Input id="email" name="email" type="email" placeholder="alex@organization.com" required className="form-input" onChange={handleInputChange} value={formData.email} />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="company" className="text-sm font-medium text-[var(--text-secondary)]">Company / Organization</label>
                            <Input id="company" name="company" placeholder="Acme Inc." required className="form-input" onChange={handleInputChange} value={formData.company} />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="role" className="text-sm font-medium text-[var(--text-secondary)]">Your Role</label>
                            <Input id="role" name="role" placeholder="e.g., Head of L&D, Pro Coach" required className="form-input" onChange={handleInputChange} value={formData.role} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-medium text-[var(--text-secondary)]">What would you like to see in your demo?</label>
                          <Textarea id="message" name="message" placeholder="e.g., Enterprise analytics, AI brief generation..." className="form-input h-24" onChange={handleInputChange} value={formData.message} />
                        </div>
                        <Button type="submit" className="btn-primary w-full" size="lg">
                          Request My Demo
                        </Button>
                      </form>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </main>

        <PublicFooter isCoachTheme={true} />
      </div>
    </>
  );
}
