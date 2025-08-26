import React, { useState } from 'react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Users, Send, Loader2, CheckCircle } from 'lucide-react';

export default function CoachContact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    // In a real app, you would send this to a backend service
    setTimeout(() => {
      if (name && email && message) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)] min-h-screen">
      <PublicHeader
        appName="CORE | COACH"
        logoIcon={Users}
        logoGradientClass="coach-brand-gradient"
        onLoginClick={() => window.location.href = createPageUrl('CoreCoachHome')}
        aboutPageUrl={createPageUrl("AboutCoreCoach")}
        pricingPageUrl={createPageUrl("CoachPricing")}
        isCoachTheme={true}
      />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">Contact Our Team</h1>
          <p className="text-lg text-[var(--text-secondary)]">
            We're here to help you elevate your coaching practice. Let's talk.
          </p>
        </div>

        <div className="base-card p-8">
          {status === 'success' ? (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Message Sent!</h2>
              <p className="text-[var(--text-secondary)]">Thank you for your interest. Our team will be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">How can we help?</label>
                <textarea
                  id="message"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="form-input w-full"
                  required
                ></textarea>
              </div>
              <div>
                <Button type="submit" className="btn-primary w-full" disabled={status === 'sending'}>
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Contact Us
                    </>
                  )}
                </Button>
              </div>
              {status === 'error' && (
                <p className="text-sm text-error text-center">Please fill out all fields.</p>
              )}
            </form>
          )}
        </div>
      </main>
      <PublicFooter isCoachTheme={true} />
    </div>
  );
}