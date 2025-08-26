
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Send, Loader2, Users } from "lucide-react";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ScrollToTop from "@/components/utils/ScrollToTop";
import { createPageUrl } from "@/utils";
import { User } from '@/api/entities';
import { useLocation } from 'react-router-dom';

export default function CoHQContact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const contactType = searchParams.get('type') || 'general'; // general, investor, enterprise

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    // Here you would typically send the data to a backend endpoint
    // For now, we'll just simulate a delay and success
    setTimeout(() => {
      console.log('Form data submitted:', formData);
      setFormData({ name: '', email: '', message: '' });
      setStatus('success');
    }, 1500);
  };

  const getTitle = () => {
    switch (contactType) {
      case 'investor':
        return "Investor Relations";
      case 'enterprise':
        return "Enterprise Solutions Inquiry";
      default:
        return "Get in Touch";
    }
  };

  const getSubtitle = () => {
    switch (contactType) {
      case 'investor':
        return "We're excited to discuss how you can be part of our growth story.";
      case 'enterprise':
        return "Let's explore how CO | HQ can empower your organization's coaching culture.";
      default:
        return "Have questions about our platform or want to learn more? We'd love to hear from you.";
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
        
        <main className="px-6 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-6xl font-bold text-[var(--text-primary)] mb-4">{getTitle()}</h1>
              <p className="text-lg text-[var(--text-secondary)]">{getSubtitle()}</p>
            </div>
            
            {status === 'success' ? (
              <div className="base-card text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
                <p>Your message has been sent. Our team will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="base-card space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input w-full"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Message</label>
                  <textarea
                    id="message"
                    rows="6"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-input w-full"
                    required
                  ></textarea>
                </div>
                <div>
                  <Button type="submit" disabled={status === 'sending'} className="w-full btn-primary text-lg">
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </main>
        
        <PublicFooter appName="CO | HQ" isCoachTheme={true} />
      </div>
    </>
  );
}
