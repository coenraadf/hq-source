
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle,
  ArrowRight,
  Mail
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import MicrositeHeader from "@/components/layout/MicrositeHeader";
import MicrositeFooter from "@/components/layout/MicrositeFooter";

export default function PitchInvestors() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    title: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white">
      <style>
        {`
          .pitch-brand-gradient {
            background: linear-gradient(135deg, #446273 0%, #5A7A8A 100%);
          }
        `}
      </style>

      <MicrositeHeader currentPage="For Investors" />

      {/* Investment Opportunity */}
      <div className="bg-gradient-to-br from-gray-950 to-gray-800 text-white">
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
              Join the Personal Growth Revolution
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              My | HQ is positioned to become the leading platform for AI-powered personal development, targeting a $13.2B growing market.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 p-6 rounded-xl border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-400 mb-2">$13.2B</div>
                <div className="text-gray-300 font-medium">Market Size</div>
                <div className="text-sm text-gray-400 mt-1">Growing at 13.2% CAGR</div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-green-900/30 to-blue-900/30 p-6 rounded-xl border border-green-500/20">
                <div className="text-3xl font-bold text-green-400 mb-2">AI-First</div>
                <div className="text-gray-300 font-medium">Technology Edge</div>
                <div className="text-sm text-gray-400 mt-1">Advanced pattern recognition</div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6 rounded-xl border border-purple-500/20">
                <div className="text-3xl font-bold text-purple-400 mb-2">2-Sided</div>
                <div className="text-gray-300 font-medium">Revenue Model</div>
                <div className="text-sm text-gray-400 mt-1">Individual + Coach platform</div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-gradient-to-br from-red-900/30 to-yellow-900/30 p-6 rounded-xl border border-red-500/20">
                <div className="text-3xl font-bold text-red-400 mb-2">Scalable</div>
                <div className="text-gray-300 font-medium">Business Model</div>
                <div className="text-sm text-gray-400 mt-1">SaaS with network effects</div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Why My | HQ */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-850 text-white">
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Why My | HQ Will Win
            </h2>

            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">🧠</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Intelligence</h3>
                  <p className="text-gray-300">Unlike traditional journaling or goal-tracking apps, My | HQ uses advanced AI to identify patterns, suggest actions, and provide personalized insights that actually drive growth.</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }} className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Unified Personal Growth Ecosystem</h3>
                  <p className="text-gray-300">My | HQ consolidates journaling, goal tracking, mood monitoring, and coaching into one seamless platform, eliminating the fragmentation that plagues current solutions.</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }} className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">👥</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Professional Coach Integration</h3>
                  <p className="text-gray-300">Co | HQ creates a two-sided marketplace where professional coaches can better serve their clients, creating network effects and higher retention rates.</p>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }} className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">📈</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Scalable Technology Architecture</h3>
                  <p className="text-gray-300">Built on modern cloud infrastructure with AI capabilities that improve with scale, creating competitive moats through better data and insights.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Business Model */}
      <div className="bg-gradient-to-br from-[#FAF6F0] to-[#F5F1EB]">
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6">
              Multiple Revenue Streams, Exponential Growth
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-[#2D2D2D] leading-relaxed">
                Our business model is designed for rapid scaling with multiple revenue streams and high customer lifetime value.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "SaaS Subscriptions",
                description: "Recurring revenue from individual users and coaching professionals",
                revenue: "$7-99/month"
              },
              {
                title: "Enterprise Licensing",
                description: "White-label solutions for corporations and HR departments",
                revenue: "$10K-100K/year"
              },
              {
                title: "Data Insights",
                description: "Anonymized, aggregated insights for research and development",
                revenue: "Revenue share"
              }
            ].map((stream, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-center"
              >
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{stream.title}</h3>
                <p className="text-[#2D2D2D] mb-4">{stream.description}</p>
                <div className="text-2xl font-bold text-[#446273]">{stream.revenue}</div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Contact Form */}
      <div className="bg-white">
        <section className="max-w-4xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6">
              Ready to Invest in the Future?
            </h2>
            <p className="text-xl text-[#2D2D2D] leading-relaxed">
              Join us in building the essential infrastructure for human potential.
            </p>
          </motion.div>

          <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#446273]">
                <Mail className="w-5 h-5" />
                Investment Inquiry
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Thank You!</h3>
                  <p className="text-[#2D2D2D]">
                    We've received your inquiry and will be in touch within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">Full Name *</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="border-stone-200 focus:border-[#446273] focus:ring-[#446273]"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">Email Address *</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="border-stone-200 focus:border-[#446273] focus:ring-[#446273]"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">Company/Fund</label>
                      <Input
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className="border-stone-200 focus:border-[#446273] focus:ring-[#446273]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">Title</label>
                      <Input
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="border-stone-200 focus:border-[#446273] focus:ring-[#446273]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#1A1A1A]">Message</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell us about your investment thesis and what you'd like to learn more about..."
                      className="min-h-[120px] border-stone-200 focus:border-[#446273] focus:ring-[#446273]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="pitch-brand-gradient text-white hover:opacity-90 px-8"
                    >
                      {isSubmitting ? "Sending..." : "Send Inquiry"}
                      {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            className="text-center rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to unlock your full potential?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-200">
              My | HQ is building the future of personalized growth. Explore our vision and join our exclusive beta program.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900"
                asChild
              >
                <Link to={createPageUrl("PitchVision")}>
                  Our Vision
                </Link>
              </Button>
              <Button
                size="lg"
                className="pitch-brand-gradient text-white hover:opacity-90"
                asChild
              >
                <Link to={createPageUrl("PitchBeta")}>
                  Join Beta Program
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>

      <MicrositeFooter />
    </div>
  );
}
