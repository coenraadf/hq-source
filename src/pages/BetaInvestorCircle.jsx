import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { InvestorInquiry } from '@/api/entities';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Users, TrendingUp, CheckCircle, Loader2 } from 'lucide-react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import ScrollToTop from '@/components/utils/ScrollToTop';

export default function BetaInvestorCircle() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    company_fund: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email) {
      setError('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await InvestorInquiry.create(formData);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
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
          onLoginClick={() => window.location.href = createPageUrl('CoachLanding')}
          aboutPageUrl={createPageUrl("AboutCoHQ")}
          pricingPageUrl={createPageUrl("CoHQPricing")}
          isCoachTheme={true}
        />
        <main className="py-20 md:py-32 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white px-4 py-2 rounded-full mb-6">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">Beta Investor Circle</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                Shape the Future of Coaching Intelligence
              </h1>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                Join our exclusive investor circle to get early access to pre-Series A updates, company performance data, and direct conversations with our founding team.
              </p>
            </motion.div>

            <Card className="base-card max-w-2xl mx-auto">
              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                    <p className="text-[var(--text-secondary)]">Your interest has been registered. Our team will be in touch with you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input id="full_name" value={formData.full_name} onChange={handleInputChange} className="form-input" placeholder="Your Name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" value={formData.email} onChange={handleInputChange} className="form-input" placeholder="your@email.com" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_fund">Company / Fund</Label>
                      <Input id="company_fund" value={formData.company_fund} onChange={handleInputChange} className="form-input" placeholder="Your Organization" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea id="message" value={formData.message} onChange={handleInputChange} className="form-input min-h-[100px]" placeholder="Tell us a bit about your interest..." />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" disabled={isSubmitting} className="w-full btn-primary">
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Interest'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <PublicFooter isCoachTheme={true} />
      </div>
    </>
  );
}