
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight
} from "lucide-react"; // Keeping ArrowRight as it's used in buttons
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import MicrositeHeader from "@/components/layout/MicrositeHeader";
import MicrositeFooter from "@/components/layout/MicrositeFooter";

// Simple ScrollToTop component
const ScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return null;
};

export default function PitchVision() {
  return (
    <>
      <ScrollToTop />
      {/* Main container with new gradient background */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] text-white min-h-screen">
        <MicrositeHeader /> {/* currentPage prop removed as per rebrand context */}

        <main className="container mx-auto px-6 py-16">
          {/* Hero Section */}
          {/* Removed previous background as main container now handles it */}
          <section className="max-w-7xl mx-auto py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="text-center md:text-left"
              >
                <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
                  Unleash Your Full Potential
                </h1>

                <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
                  My | HQ is an AI-powered platform that transforms how individuals approach personal growth by centralizing self-development data into a single, cohesive, and intelligent library. We are building the essential infrastructure for the future of personalized coaching and human potential.
                </p>

                <div className="flex gap-4 justify-center md:justify-start flex-wrap">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    asChild
                  >
                    <Link to={createPageUrl("PitchMarket")}>
                      Explore Market Opportunity
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-500 text-blue-300 hover:bg-blue-700 hover:text-white"
                    asChild
                  >
                    <Link to={createPageUrl("PitchInvestors")}>
                      For Investors
                    </Link>
                  </Button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                {/* Image source kept as no new image URL was provided in outline */}
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/abbc44877_COREPitch.png"
                  alt="My | HQ: Unleash Your Full Potential"
                  className="w-full max-w-lg mx-auto"
                />
              </motion.div>
            </div>
          </section>

          {/* The Problem Section */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Personal Growth Is Hard to Navigate
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Everyone wants to grow, but most people lack the tools and guidance to make meaningful progress.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">😕</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Scattered Thoughts</h3>
                  <p className="text-gray-400">People capture insights in different places but can't see patterns or connections</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Clear Direction</h3>
                  <p className="text-gray-400">Without AI-powered insights, it's hard to know what to focus on next</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Progress Stagnation</h3>
                  <p className="text-gray-400">People get stuck in the same patterns without personalized guidance</p>
                </div>
              </div>
            </div>
          </section>

          {/* The Solution Section */}
          <section className="mb-16">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  My | HQ: Your Personal Growth Command Center
                </h2>
                <p className="text-xl text-gray-300">
                  We've created an AI-powered platform that transforms how people approach personal development
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Intelligent Insight Capture</h3>
                      <p className="text-gray-300">Natural language processing helps users capture thoughts, goals, and breakthroughs in one unified system</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">AI-Powered Pattern Recognition</h3>
                      <p className="text-gray-300">Advanced algorithms identify patterns, themes, and opportunities for growth across all user data</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Personalized Growth Roadmap</h3>
                      <p className="text-gray-300">Dynamic recommendations and action items based on individual patterns and goals</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-8 rounded-2xl border border-blue-500/20">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-gray-300">Connected to My | HQ</span>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-lg">
                      <p className="text-sm text-gray-300">"I've been feeling stuck in my career lately..."</p>
                    </div>
                    <div className="bg-blue-900/50 p-4 rounded-lg">
                      <p className="text-sm text-blue-200">💡 <strong>AI Insight:</strong> You've mentioned career concerns 3 times this month. Consider exploring new skill development opportunities.</p>
                    </div>
                    <div className="bg-green-900/50 p-4 rounded-lg">
                      <p className="text-sm text-green-200">🎯 <strong>Suggested Action:</strong> Schedule a skills assessment this week</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Market Size Section */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                A Multi-Billion Dollar Market in Transformation
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-xl text-gray-300 leading-relaxed">
                  The global coaching industry is a rapidly growing multi-billion dollar market. The underlying software market is expanding at a 17% CAGR, creating a significant opportunity for a platform that addresses the core unmet needs of aggregation and privacy. We are positioned to capture the underserved mid-market where coaches and HR departments need sophisticated, white-labelable solutions.
                </p>
              </div>
            </motion.div>
          </section>

          {/* Co | HQ for Coaches */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Co | HQ: Empowering Professional Coaches
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                While My | HQ serves individuals, Co | HQ provides professional coaches with enterprise-grade tools to serve their clients better.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/20">
                  <h3 className="text-xl font-semibold mb-4">Client Management</h3>
                  <p className="text-gray-300">Advanced dashboards and insights for managing multiple coaching relationships</p>
                </div>

                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/20">
                  <h3 className="text-xl font-semibold mb-4">Collaborative Tools</h3>
                  <p className="text-gray-300">Shared goal tracking, progress monitoring, and communication features</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          {/* Removed previous background as main container now handles it */}
          <section className="max-w-7xl mx-auto py-12 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-center bg-gradient-to-br from-[#1E293B] to-[#334155] rounded-3xl p-8 sm:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to revolutionize personal growth?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join My | HQ's early access program or partner with us to shape the future of human potential.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  asChild
                >
                  <Link to={createPageUrl("PitchMarket")}>
                    Explore Market Opportunity
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-500 text-blue-300 hover:bg-blue-700 hover:text-white"
                  asChild
                >
                  <Link to={createPageUrl("PitchInvestors")}>
                    See Our Investor Thesis
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-500 text-blue-300 hover:bg-blue-700 hover:text-white"
                  asChild
                >
                  <Link to={createPageUrl("PitchBeta")}>
                    Join Our Beta Program
                  </Link>
                </Button>
              </div>
            </motion.div>
          </section>
        </main>

        <MicrositeFooter />
      </div>
    </>
  );
}
