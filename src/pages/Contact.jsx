import React from 'react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Compass, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ScrollToTop from "@/components/utils/ScrollToTop";

export default function ContactPage() {
  const location = useLocation();
  const isCoachRoute = location.pathname.toLowerCase().includes('coach');

  return (
    <>
      <ScrollToTop />
      <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)]">
        <PublicHeader
          appName={isCoachRoute ? "CORE COACH" : "CORE COMPASS"}
          logoIcon={isCoachRoute ? Users : Compass}
          logoGradientClass={isCoachRoute ? "coach-brand-gradient" : "client-brand-gradient"}
          onLoginClick={() => window.location.href = createPageUrl(isCoachRoute ? 'CoreCoachHome' : 'CoreCompassHome')}
          aboutPageUrl={createPageUrl(isCoachRoute ? "AboutCoreCoach" : "AboutCoreCompass")}
          pricingPageUrl={createPageUrl(isCoachRoute ? "CoachPricing" : "ClientPricing")}
          contactPageUrl={createPageUrl("Contact")}
          isCoachTheme={isCoachRoute}
        />

        <main className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <h1 className="text-display">Get in Touch</h1>
              <p className="text-body-large max-w-2xl mx-auto mt-4">
                We're here to help. Whether you have a question about features, trials, or anything else, our team is ready to answer all your questions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Card className="base-card">
                <CardHeader>
                  <CardTitle className="text-h3 flex items-center gap-3">
                    <Mail className="w-6 h-6 text-[var(--brand-primary)]" />
                    Send us a message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form action="https://formspree.io/f/your_form_id" method="POST" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-[var(--text-secondary)]">Full Name</label>
                        <Input id="name" name="name" placeholder="Your Name" className="form-input" required />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-[var(--text-secondary)]">Email Address</label>
                        <Input id="email" name="email" type="email" placeholder="you@example.com" className="form-input" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium text-[var(--text-secondary)]">Subject</label>
                      <Input id="subject" name="subject" placeholder="How can we help?" className="form-input" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium text-[var(--text-secondary)]">Message</label>
                      <Textarea id="message" name="message" placeholder="Your message..." className="form-input min-h-[150px]" required />
                    </div>
                    <div>
                      <Button type="submit" className="w-full btn-primary">
                        Send Message
                      </Button>
                    </div>
                  </form>
                  <p className="text-center text-sm text-[var(--text-muted)] mt-6">
                    Or email us directly at <a href="mailto:info@corecompass.app" className="font-medium text-[var(--brand-primary)] hover:underline">info@corecompass.app</a>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
        
        <PublicFooter 
          isCoachTheme={isCoachRoute}
          appName={isCoachRoute ? "CORE COACH" : "CORE COMPASS"}
          logoIcon={isCoachRoute ? Users : Compass}
          logoGradientClass={isCoachRoute ? "coach-brand-gradient" : "client-brand-gradient"}
        />
      </div>
    </>
  );
}