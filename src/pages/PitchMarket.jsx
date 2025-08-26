
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Globe,
  ArrowRight,
  Target,
  Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import MicrositeHeader from "@/components/layout/MicrositeHeader";
import MicrositeFooter from "@/components/layout/MicrositeFooter";

export default function PitchMarket() {
  return (
    <div className="bg-white">
      <style>
        {`
          .pitch-brand-gradient {
            background: linear-gradient(135deg, #446273 0%, #5A7A8A 100%);
          }
          
          .pitch-brand-gradient-soft {
            background: linear-gradient(135deg, rgba(68, 98, 115, 0.08) 0%, rgba(90, 122, 138, 0.06) 100%);
          }
          
          .stat-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(68, 98, 115, 0.1);
            border-radius: 1.5rem;
            padding: 2rem;
            text-align: center;
            transition: all 0.3s ease-in-out;
          }
          
          .stat-card:hover {
            border-color: rgba(68, 98, 115, 0.2);
            transform: translateY(-2px);
          }
          
          .roi-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(8px);
            border: 1px solid #E5E0D8;
            border-radius: 1.5rem;
            padding: 2rem;
            transition: all 0.3s ease-in-out;
            text-align: center;
          }
          
          .roi-card:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
            transform: translateY(-2px);
          }
        `}
      </style>

      <MicrositeHeader currentPage="Market Opportunity" />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#FAF6F0] to-[#F5F1EB]">
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-[#1A1A1A] mb-6 leading-tight">
              A MASSIVE, GROWING, AND UNDERSERVED MARKET.
            </h1>
            <p className="text-lg sm:text-xl text-[#2D2D2D] mb-8 leading-relaxed max-w-4xl mx-auto">
              The global coaching industry is experiencing explosive growth across all key metrics. The technology platforms that enable and scale these services represent one of the most compelling investment opportunities in the professional development sector.
            </p>
          </motion.div>
        </section>
      </div>

      {/* Personal Development Market */}
      <div className="bg-white">
        <section className="mb-16 max-w-7xl mx-auto px-6 py-12 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                $13.2B Personal Development Market
              </h2>
              <p className="text-xl text-[#2D2D2D]">
                The personal development industry is experiencing unprecedented growth, driven by increased awareness and demand for self-improvement tools.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">13.2%</div>
                <div className="text-[#2D2D2D]">Annual Growth Rate</div>
                <div className="text-sm text-[#2D2D2D]/80 mt-1">Compound Annual Growth Rate (CAGR) 2023-2030</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">$13.2B</div>
                <div className="text-[#2D2D2D]">Current Market Size</div>
                <div className="text-sm text-[#2D2D2D]/80 mt-1">Global personal development market in 2023</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">$18.6B</div>
                <div className="text-[#2D2D2D]">Projected by 2030</div>
                <div className="text-sm text-[#2D2D2D]/80 mt-1">Expected market size with continued growth</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-100/20 to-purple-100/20 p-8 rounded-2xl border border-blue-200/20">
              <h3 className="text-2xl font-semibold mb-6 text-center text-[#1A1A1A]">Market Drivers</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-[#2D2D2D]"><strong>Mental Health Awareness:</strong> Growing focus on mental wellness and self-care</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-[#2D2D2D]"><strong>Remote Work Culture:</strong> Increased need for personal development and work-life balance</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-[#2D2D2D]"><strong>Digital Native Generation:</strong> Comfort with technology-based solutions</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-[#2D2D2D]"><strong>Career Uncertainty:</strong> Need for continuous skill development and adaptability</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-[#2D2D2D]"><strong>AI Integration:</strong> Demand for personalized, data-driven insights</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-[#2D2D2D]"><strong>Accessibility:</strong> Mobile-first solutions for on-the-go development</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* My | HQ Positioning */}
      <div className="bg-gradient-to-br from-[#FAF6F0] to-[#F5F1EB]">
        <section className="mb-16 max-w-7xl mx-auto px-6 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              My | HQ's Market Position
            </h2>
            <p className="text-xl text-[#2D2D2D] mb-8">
              My | HQ is uniquely positioned to capture significant market share by combining AI-powered insights with intuitive user experience.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-gradient-to-br from-green-900/5 to-blue-900/5 p-6 rounded-xl border border-green-500/10">
                <h3 className="text-xl font-semibold mb-4 text-[#1A1A1A]">Addressable Market</h3>
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-[#2D2D2D]">Total Addressable Market (TAM)</span>
                    <span className="text-green-600 font-semibold">$13.2B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2D2D2D]">Serviceable Addressable Market (SAM)</span>
                    <span className="text-blue-600 font-semibold">$2.8B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2D2D2D]">Serviceable Obtainable Market (SOM)</span>
                    <span className="text-purple-600 font-semibold">$140M</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-900/5 to-blue-900/5 p-6 rounded-xl border border-green-500/10">
                <h3 className="text-xl font-semibold mb-4 text-[#1A1A1A]">Competitive Advantage</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-[#2D2D2D]">AI-powered pattern recognition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-[#2D2D2D]">Unified personal data ecosystem</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-[#2D2D2D]">Professional coaching integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-[#2D2D2D]">Mobile-first, intuitive design</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Key Market Metrics */}
      <div className="bg-white">
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6">
              The Numbers Speak for Themselves
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "$7.31B",
                label: "Projected Global Coaching Market Size in 2025",
                icon: DollarSign,
                color: "text-green-600"
              },
              {
                number: "167,000+",
                label: "Projected Number of Active Coaches Worldwide in 2025",
                icon: Users,
                color: "text-blue-600"
              },
              {
                number: "17% CAGR",
                label: "Growth rate of coaching software market, projected to reach $2.4B",
                icon: TrendingUp,
                color: "text-[#446273]"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="stat-card"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <h3 className="text-4xl font-bold text-[#1A1A1A] mb-2">{stat.number}</h3>
                <p className="text-[#2D2D2D] leading-relaxed">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Market Growth Visualized */}
      <div className="bg-gradient-to-br from-[#FAF6F0] to-[#F5F1EB]">
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6">
              Dual Growth Engines: Practitioners and Platforms
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-[#2D2D2D] leading-relaxed">
                The market is driven by two powerful trends: a rapid increase in the number of professional coaches and an accelerating adoption of the software platforms they rely on. This dual growth creates a powerful flywheel effect for enabling technologies like My | HQ.
              </p>
            </div>
          </motion.div>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="flex items-center justify-center mb-8">
              <BarChart3 className="w-12 h-12 text-[#446273] mr-4" />
              <h3 className="text-2xl font-semibold text-[#1A1A1A]">Growth Trajectory 2022-2025</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <h4 className="text-xl font-semibold text-[#446273] mb-4">Practitioner Revenue</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>2022</span>
                    <span className="font-semibold">$4.2B</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2023</span>
                    <span className="font-semibold">$5.1B</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2024</span>
                    <span className="font-semibold">$6.2B</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2025</span>
                    <span className="font-semibold">$7.3B</span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-semibold text-[#446273] mb-4">Coaching Software Market</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>2022</span>
                    <span className="font-semibold">$1.2B</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2023</span>
                    <span className="font-semibold">$1.5B</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2024</span>
                    <span className="font-semibold">$1.9B</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2025</span>
                    <span className="font-semibold">$2.4B</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Regional Dynamics */}
      <div className="bg-white">
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6">
              A Global Opportunity with Key Regional Hubs
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-[#2D2D2D] leading-relaxed">
                North America represents the largest and most mature market, driven by deep corporate integration. Europe is the second-largest, distinguished by a strong emphasis on health, wellness, and a relationship-centric coaching philosophy.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { region: "North America", percentage: "45%", value: "$3.3B" },
              { region: "Western Europe", percentage: "28%", value: "$2.0B" },
              { region: "Asia-Pacific", percentage: "18%", value: "$1.3B" },
              { region: "Rest of World", percentage: "9%", value: "$0.7B" }
            ].map((region, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="stat-card"
              >
                <Globe className="w-8 h-8 text-[#446273] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">{region.region}</h3>
                <p className="text-2xl font-bold text-[#446273] mb-1">{region.percentage}</p>
                <p className="text-[#2D2D2D]">{region.value}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* ROI Section */}
      <div className="bg-gradient-to-br from-[#FAF6F0] to-[#F5F1EB]">
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6">
              Coaching is Not a Perk; It's a Strategic Investment
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-[#2D2D2D] leading-relaxed">
                The business case for coaching is exceptionally strong, with data demonstrating a powerful and quantifiable impact on key corporate metrics. This clear ROI is fueling corporate adoption and investment in coaching platforms.
              </p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                stat: "50%",
                title: "Higher Retention",
                description: "Mentored employees have significantly higher retention rates"
              },
              {
                icon: TrendingUp,
                stat: "25%",
                title: "Performance Increase",
                description: "Average improvement in individual performance metrics"
              },
              {
                icon: Briefcase,
                stat: "7x ROI",
                title: "Return on Investment",
                description: "Average ROI for companies implementing coaching programs"
              }
            ].map((roi, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="roi-card"
              >
                <div className="bg-[#446273] mb-4 mx-auto w-12 h-12 rounded-full flex items-center justify-center">
                  <roi.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-[#446273] mb-2">{roi.stat}</h3>
                <h4 className="text-lg font-semibold text-[#1A1A1A] mb-2">{roi.title}</h4>
                <p className="text-[#2D2D2D] text-sm leading-relaxed">{roi.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="text-center pitch-brand-gradient-soft rounded-3xl p-8 sm:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">
              Ready to capitalize on this opportunity?
            </h2>
            <p className="text-xl text-[#2D2D2D] mb-8 max-w-2xl mx-auto">
              Learn more about our strategic positioning and investment thesis in this rapidly growing market.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                className="pitch-brand-gradient text-white hover:opacity-90"
                asChild
              >
                <Link to={createPageUrl("PitchInvestors")}>
                  See Our Investor Thesis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#446273] text-[#446273] hover:bg-[#446273] hover:text-white"
                asChild
              >
                <Link to={createPageUrl("PitchBeta")}>
                  Join Our Beta Program
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
