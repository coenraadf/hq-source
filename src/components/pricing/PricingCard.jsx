import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export default function PricingCard({
  title,
  description,
  price,
  priceNote,
  features,
  isPopular,
  ctaText = "Get Started",
  onCtaClick,
  theme = 'compass'
}) {
  const themeStyles = {
    compass: {
      gradient: "bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)]",
      text: "text-[var(--brand-primary)]",
      popularRing: "ring-[var(--brand-primary)] ring-opacity-50",
      popularBadge: "text-[var(--brand-primary)] bg-[var(--brand-primary)] bg-opacity-10",
    },
    coach: {
      gradient: "bg-gradient-to-r from-[#6B7A5A] to-[#5A6B49]",
      text: "text-[#6B7A5A]",
      popularRing: "ring-[#6B7A5A] ring-opacity-50",
      popularBadge: "text-[#6B7A5A] bg-[#6B7A5A] bg-opacity-10",
    }
  };
  
  const currentTheme = themeStyles[theme];

  return (
    <div className={`relative flex flex-col bg-white/90 backdrop-blur-sm border border-stone-200/60 shadow-xl rounded-2xl p-8 h-full transition-all duration-300 hover:shadow-2xl ${isPopular ? `ring-2 ${currentTheme.popularRing}` : ''}`}>
      {isPopular && (
        <div className={`absolute top-0 right-8 -translate-y-1/2 px-3 py-1 text-xs font-semibold tracking-wide uppercase rounded-full ${currentTheme.popularBadge}`}>
          Most Popular
        </div>
      )}
      <div className="flex-grow">
        <h3 className="text-xl font-semibold text-[#1A1A1A]">{title}</h3>
        <p className="mt-2 text-sm text-[#2D2D2D]">{description}</p>
        <div className="mt-6">
          <span className="text-4xl font-bold text-[#1A1A1A]">{price}</span>
          <span className="ml-2 text-[#2D2D2D] opacity-70">{priceNote}</span>
        </div>
        <ul className="mt-8 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${currentTheme.text}`} />
              <span className="text-sm text-[#2D2D2D]">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <Button
          onClick={onCtaClick}
          className={`w-full text-white ${isPopular ? currentTheme.gradient : currentTheme.gradient} hover:opacity-90 transition-opacity`}
          size="lg"
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
}