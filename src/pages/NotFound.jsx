import React from 'react';
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <Link to={createPageUrl("CoachLanding")} className="inline-flex items-center space-x-3 mb-6">
            <div className="coach-brand-gradient w-16 h-16 rounded-2xl flex items-center justify-center">
              <Home className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="font-bold text-[var(--text-primary)] text-2xl uppercase tracking-wider">CO | HQ</h1>
              <p className="text-[var(--text-secondary)] text-sm">Professional Coaching Platform</p>
            </div>
          </Link>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-6xl font-bold text-[var(--text-primary)] mb-4">404</h2>
            <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">Page Not Found</h3>
            <p className="text-[var(--text-secondary)] mb-8">
              AI-powered coaching insights and client success platform for professional coaches.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link to={createPageUrl("CoachLanding")}>
              <Button className="btn-primary w-full text-lg py-3">
                <Home className="w-5 h-5 mr-2" />
                Go to Homepage
              </Button>
            </Link>
            
            <Link to={createPageUrl("CoachBetaSignup")}>
              <Button variant="outline" className="btn-secondary w-full text-lg py-3">
                Join Beta Program
              </Button>
            </Link>
          </div>
          
          <div className="pt-6 border-t border-[var(--border-color)]">
            <p className="text-sm text-[var(--text-muted)]">
              Questions? <Link to={createPageUrl("CoHQContact")} className="text-[var(--brand-primary)] hover:underline">Contact Support</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}