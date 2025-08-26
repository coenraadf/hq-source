import React, { useState } from 'react';
import PublicHeader from '@/components/layout/PublicHeader';
import PublicFooter from '@/components/layout/PublicFooter';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, Compass } from 'lucide-react';
import { User } from '@/api/entities';
import { motion } from 'framer-motion';
import ScrollToTop from "@/components/utils/ScrollToTop";
import { Link } from 'react-router-dom';
import CurrencyConverter from '@/components/pricing/CurrencyConverter';

export default function ClientPricing() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({ USD: 1 });

  const handleLogin = () => {
    sessionStorage.setItem('pendingUserType', 'client');
    const callbackUrl = `${window.location.origin}${createPageUrl("SetupProfile")}`;
    User.loginWithRedirect(callbackUrl);
  };

  const convertPrice = (usdPrice) => {
    if (selectedCurrency === 'USD' || !exchangeRates[selectedCurrency]) {
      return usdPrice;
    }
    return Math.round(usdPrice * exchangeRates[selectedCurrency]);
  };

  const getCurrencySymbol = () => {
    const symbols = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'CAD': 'C$',
      'AUD': 'A$'
    };
    return symbols[selectedCurrency] || '$';
  };

  const pricingPlans = [
    {
      name: "Free Tier",
      price: 0,
      frequency: "per month",
      features: [
        "Unlimited journaling and reflections",
        "Basic AI insights",
        "Personal goal tracking",
        "Swiss-level data security",
        "Limited personality test uploads"
      ],
      buttonText: "Start for Free",
      isPrimary: false,
    },
    {
      name: "Growth Pro",
      price: 9,
      frequency: "per month",
      features: [
        "All Free Tier features",
        "Advanced AI synthesis & patterns",
        "Unlimited personality test uploads",
        "Coach-ready sharing features",
        "Priority support",
        "Access to premium resource library"
      ],
      buttonText: "Upgrade to Pro",
      isPrimary: true,
    },
    {
      name: "Unlimited",
      price: 29,
      frequency: "per month",
      features: [
        "All Growth Pro features",
        "Dedicated personal AI assistant (Sage Pro)",
        "Advanced goal and habit tracking",
        "Private community access",
        "Exclusive workshops and content",
        "Early access to new features"
      ],
      buttonText: "Go Unlimited",
      isPrimary: false,
    },
  ];

  return (
    <>
      <ScrollToTop />
      <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)] min-h-screen">
        <PublicHeader
          appName="CORE COMPASS"
          logoIcon={Compass}
          logoGradientClass="compass-brand-gradient"
          onLoginClick={handleLogin}
          aboutPageUrl={createPageUrl("AboutCoreCompass")}
          pricingPageUrl={createPageUrl("ClientPricing")}
          isCoachTheme={false}
        />

        <main className="max-w-7xl mx-auto px-6 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-h1">
              Flexible Plans for Your Growth Journey
            </h1>
            <p className="text-body-large max-w-2xl mx-auto mt-4">
              Choose the plan that best fits your needs, from foundational self-reflection to advanced AI-powered insights.
            </p>
          </motion.div>

          {/* Currency Converter */}
          <div className="flex justify-center mb-12">
            <CurrencyConverter 
              selectedCurrency={selectedCurrency}
              onCurrencyChange={setSelectedCurrency}
              onRatesUpdate={setExchangeRates}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`base-card p-6 flex flex-col justify-between ${
                  plan.isPrimary ? 'border-[var(--brand-primary)] border-2' : ''
                }`}
              >
                <div>
                  <h3 className="text-h3 text-center mb-4">
                    {plan.name}
                  </h3>
                  <div className="text-center text-[var(--brand-primary)] mb-6">
                    <span className="text-5xl font-bold">
                      {getCurrencySymbol()}{convertPrice(plan.price)}
                    </span>
                    <span className="text-lg font-medium"> {plan.frequency}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featIndex) => (
                      <li key={featIndex} className="flex items-start text-text-secondary">
                        <CheckCircle className="w-5 h-5 text-success mr-2 flex-shrink-0 mt-1" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  onClick={handleLogin} 
                  className={`w-full ${plan.isPrimary ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.buttonText}
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16 text-text-secondary"
          >
            <p className="text-body-large">
              Questions? <Link to={createPageUrl('CompassFAQ')} className="font-semibold text-[var(--brand-primary)] hover:underline">Read our FAQ</Link> or <Link to={createPageUrl('CompassContact')} className="font-semibold text-[var(--brand-primary)] hover:underline">contact our support team</Link>.
            </p>
          </motion.div>
        </main>

        <PublicFooter isCoachTheme={false} />
      </div>
    </>
  );
}