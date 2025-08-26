
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign } from 'lucide-react';

const CURRENCY_RATES = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  CAD: 1.25,
  AUD: 1.35,
  CHF: 0.88,    // Swiss Franc
  ZAR: 15.50    // South African Rand
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF ',
  ZAR: 'R'
};

export default function CurrencyConverter({ currency, onCurrencyChange }) {
  
  return (
    <div className="flex items-center gap-2 mb-4">
      <Select value={currency} onValueChange={onCurrencyChange}>
        <SelectTrigger className="w-48">
           <div className="flex items-center gap-2">
             <DollarSign className="w-4 h-4 text-[var(--text-muted)]" />
             <SelectValue />
           </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD">USD - US Dollar</SelectItem>
          <SelectItem value="EUR">EUR - Euro</SelectItem>
          <SelectItem value="GBP">GBP - British Pound</SelectItem>
          <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
          <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
          <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
          <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
