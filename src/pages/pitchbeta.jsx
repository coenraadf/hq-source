
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Zap,
  Users,
  Shield,
  CheckCircle,
  ArrowRight,
  Mail,
  User,
  Briefcase,
  FlaskConical, // New import
  MessageSquare, // New import
  Star, // New import
  UserPlus // New import
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import MicrositeHeader from "@/components/layout/MicrositeHeader";
import MicrositeFooter from "@/components/layout/MicrositeFooter";
import ScrollToTop from "@/components/utils/ScrollToTop"; // New import

export default function PitchBeta() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    userType: "",
    experience: "",
    interests: "",
    commitment: ""
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
    <>
      <ScrollToTop />
      <div className="bg-white">
        <style>
          {`
            .pitch-brand-gradient {
              background: linear-gradient(135deg, #446273 0%, #5A7A8A 100%);
            }
            
            .pitch-brand-gradient-soft {
              background: linear-gradient(135deg, rgba(68, 98, 115, 0.08) 0%, rgba(90, 122, 138, 0.06) 100%);
            }
            
            .benefit-card {
              background: rgba(255, 255, 255, 0.8);
              backdrop-filter: blur(8px);
              border: 1px solid #E5E0D8;
              border-radius: 1.5rem;
              padding: 2rem;
              transition: all 0.3s ease-in-out;
              text-align: center;
            }
            
            .benefit-card:hover {
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
              transform: translateY(-2px);
            }
          `}
        </style>

        <MicrositeHeader currentPage="Beta Program" />

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#FAF6F0] to-[#F5F1EB]">
          <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl sm:text-6xl font-bold text-[#1A1A1A] mb-6 leading-tight">
                SHAPE THE FUTURE OF HUMAN POTENTIAL.
              </h1>
              <p className="text-lg sm:text-xl text-[#2D2D2D] mb-8 leading-relaxed max-w-4xl mx-auto">
                Join our exclusive beta program and be among the first to experience the revolutionary platform that will transform how we understand and develop ourselves. Your feedback will directly shape the future of personal development technology.
              </p>
            </motion.div>
          </section>
        </div>

        {/* Beta Benefits */}
        <div className="bg-white">
          <section className="max-w-7xl mx-auto px-6 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6">
                Exclusive Beta Benefits
              </h2>
              <p className="text-xl text-[#2D2D2D] leading-relaxed max-w-3xl mx-auto">
                As a beta participant, you'll receive privileged access and unique advantages.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Early Access",
                  description: "Be the first to experience cutting-edge features before public release"
                },
                {
                  icon: Users,
                  title: "Direct Influence",
                  description: "Your feedback directly shapes product development and feature prioritization"
                },
                {
                  icon: Shield,
                  title: "Lifetime Benefits",
                  description: "Lock in exclusive pricing and premium features as a founding user"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="benefit-card"
                >
                  <div className="bg-[#446273] mb-4 mx-auto w-12 h-12 rounded-full flex items-center justify-center">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{benefit.title}</h3>
                  <p className="text-[#2D2D2D] leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Application Form */}
        <div className="bg-gradient-to-br from-[#FAF6F0] to-[#F5F1EB]">
          <section className="max-w-4xl mx-auto px-6 py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6">
                Apply for Beta Access
              </h2>
              <p className="text-xl text-[#2D2D2D] leading-relaxed">
                Help us build the future of personal development technology.
              </p>
            </motion.div>

            <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#446273]">
                  <User className="w-5 h-5" />
                  Beta Application
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Application Submitted!</h3>
                    <p className="text-[#2D2D2D] mb-4">
                      Thank you for your interest in our beta program. We'll review your application and be in touch soon.
                    </p>
                    <Button
                      variant="outline"
                      className="border-[#446273] text-[#446273] hover:bg-[#446273] hover:text-white"
                      asChild
                    >
                      <Link to={createPageUrl("pitchvision")}>
                        Explore Our Vision
                      </Link>
                    </Button>
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
                        <label className="text-sm font-medium text-[#1A1A1A]">Company/Organization</label>
                        <Input
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          className="border-stone-200 focus:border-[#446273] focus:ring-[#446273]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-[#1A1A1A]">Current Role</label>
                        <Input
                          value={formData.role}
                          onChange={(e) => handleInputChange("role", e.target.value)}
                          className="border-stone-200 focus:border-[#446273] focus:ring-[#446273]"
                          placeholder="e.g., Coach, HR Manager, Individual"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">I would use Core Compass as a... *</label>
                      <Select value={formData.userType} onValueChange={(value) => handleInputChange("userType", value)}>
                        <SelectTrigger className="border-stone-200 focus:border-[#446273]">
                          <SelectValue placeholder="Select your primary use case" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">Individual seeking personal growth</SelectItem>
                          <SelectItem value="coach">Professional coach</SelectItem>
                          <SelectItem value="hr">HR professional</SelectItem>
                          <SelectItem value="researcher">Researcher or academic</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">Experience with Personal Development Tools</label>
                      <Textarea
                        value={formData.experience}
                        onChange={(e) => handleInputChange("experience", e.target.value)}
                        placeholder="Tell us about your experience with coaching platforms, personality tests, journaling apps, or other personal development tools..."
                        className="min-h-[100px] border-stone-200 focus:border-[#446273] focus:ring-[#446273]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">What interests you most about Core Compass?</label>
                      <Textarea
                        value={formData.interests}
                        onChange={(e) => handleInputChange("interests", e.target.value)}
                        placeholder="What specific features or capabilities are you most excited about?"
                        className="min-h-[100px] border-stone-200 focus:border-[#446273] focus:ring-[#446273]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#1A1A1A]">Beta Commitment *</label>
                      <Select value={formData.commitment} onValueChange={(value) => handleInputChange("commitment", value)}>
                        <SelectTrigger className="border-stone-200 focus:border-[#446273]">
                          <SelectValue placeholder="How much time can you commit to testing?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light usage (1-2 hours per week)</SelectItem>
                          <SelectItem value="moderate">Moderate usage (3-5 hours per week)</SelectItem>
                          <SelectItem value="heavy">Heavy usage (5+ hours per week)</SelectItem>
                          <SelectItem value="power">Power user (Daily usage, detailed feedback)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !formData.name || !formData.email || !formData.userType || !formData.commitment}
                        className="pitch-brand-gradient text-white hover:opacity-90 px-8"
                      >
                        {isSubmitting ? "Submitting..." : "Apply for Beta Access"}
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
        <div className="bg-white">
          <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-center pitch-brand-gradient-soft rounded-3xl p-8 sm:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">
                Questions About Our Beta Program?
              </h2>
              <p className="text-xl text-[#2D2D2D] mb-8 max-w-2xl mx-auto">
                Learn more about our vision and investment opportunity.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#446273] text-[#446273] hover:bg-[#446273] hover:text-white"
                  asChild
                >
                  <Link to={createPageUrl("pitchvision")}>
                    Our Vision
                  </Link>
                </Button>
                <Button
                  size="lg"
                  className="pitch-brand-gradient text-white hover:opacity-90"
                  asChild
                >
                  <Link to={createPageUrl("pitchinvestors")}>
                    For Investors
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </section>
        </div>

        <MicrositeFooter />
      </div>
    </>
  );
}
