
import React from 'react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Compass, Mail, MessageSquare } from 'lucide-react'; // Removed Phone, MapPin as they are not used
import { motion } from 'framer-motion';
import ScrollToTop from "@/components/utils/ScrollToTop";
import { Link } from 'react-router-dom';

export default function MyHQContact() {
  return (
    <>
      <ScrollToTop />
      <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)]">
        <PublicHeader
          appName="MY | HQ"
          logoIcon={Compass}
          logoGradientClass="compass-brand-gradient"
          onLoginClick={() => window.location.href = createPageUrl('MyHQHome')}
          aboutPageUrl={createPageUrl("AboutMyHQ")}
          isCoachTheme={false}
        />

        <main className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">Contact Our Team</h1>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                Have questions about My | HQ? We're here to help you on your personal growth journey.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="base-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[var(--brand-primary)]" />
                      Send us a message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="First Name" className="form-input" />
                        <Input placeholder="Last Name" className="form-input" />
                      </div>
                      <Input type="email" placeholder="Email Address" className="form-input" />
                      <Input placeholder="Subject" className="form-input" />
                      <Textarea 
                        placeholder="Tell us how we can help you..." 
                        className="form-input h-32 resize-none"
                      />
                      <Button className="btn-primary w-full">
                        Contact Us
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-8">Get in touch</h2>
                  
                  <div className="space-y-8">
                    <div className="grid grid-cols-[48px_1fr] gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div className="pt-1">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Email</h3>
                        <p className="text-[var(--text-secondary)]">info@my-hq.app</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[48px_1fr] gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-primary-dark)] flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div className="pt-1">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Live Chat</h3>
                        <p className="text-[var(--text-secondary)]">Available 9am-6pm EST</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--bg-secondary)] rounded-lg p-6">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-4">Frequently Asked Questions</h3>
                  <p className="text-[var(--text-secondary)] mb-4">
                    Check out our FAQ section for quick answers to common questions about My | HQ.
                  </p>
                  <Link to={createPageUrl("MyHQFAQ")}>
                    <Button variant="outline" className="btn-secondary">
                      Visit FAQ
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
        
        <PublicFooter />
      </div>
    </>
  );
}
