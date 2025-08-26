
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp, DollarSign, Users, Globe, Brain, Shield,
  Zap, Target, BarChart3, Lock, Award, Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ScrollToTop from "@/components/utils/ScrollToTop";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

const marketDriversData = [
  { name: 'Remote Work Revolution', value: 40 },
  { name: 'Mental Health Focus', value: 35 },
  { name: 'ROI Pressure', value: 25 },
];

const revenueStreamsData = [
    { name: 'Coach Subscriptions', 'Projected %': 60 },
    { name: 'Enterprise Licensing', 'Projected %': 35 },
    { name: 'Data Intelligence (Future)', 'Projected %': 5 },
];

const unitEconomicsData = [
    { name: 'LTV:CAC', 'Lifetime Value': 1800, 'Acquisition Cost': 50 }
];

const COLORS = ['#6D28D9', '#8B5CF6', '#A78BFA'];

export default function InvestorOpportunity() {
  const handleContactInvestor = () => {
    window.location.href = createPageUrl("CoHQContact") + "?type=investor";
  };

  const handleJoinBetaInvestor = () => {
    window.location.href = createPageUrl("BetaInvestorCircle");
  };

  return (
    <>
      <ScrollToTop />
      <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)] min-h-screen">
        <style>
          {`
            /* Investor Page Specific Purple Accent Theme */
            .investor-page {
              --investor-primary: #7C3AED; /* Purple-600 */
              --investor-primary-light: #8B5CF6; /* Purple-500 */
              --investor-primary-dark: #6D28D9; /* Purple-700 */
              --investor-primary-r: 124;
              --investor-primary-g: 58;
              --investor-primary-b: 237;
            }

            .investor-section-primary {
              background: var(--bg-primary);
            }

            .investor-section-secondary {
              background: var(--bg-secondary);
            }

            .investor-card {
              background: var(--bg-primary);
              border: 1px solid var(--border-color);
              border-radius: 0.75rem;
              padding: 2rem;
              transition: all 0.3s ease;
              box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            }

            .investor-card:hover {
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              border-color: rgba(124, 58, 237, 0.2);
              transform: translateY(-2px);
            }

            .investor-icon-container {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 3rem;
              height: 3rem;
              border-radius: 0.75rem;
              background: linear-gradient(135deg, var(--investor-primary) 0%, var(--investor-primary-dark) 100%);
              color: #FFFFFF;
              flex-shrink: 0;
            }

            .investor-btn-primary {
              background: linear-gradient(135deg, var(--investor-primary) 0%, var(--investor-primary-dark) 100%);
              color: #FFFFFF;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              font-weight: 600;
              border: none;
              transition: all 0.2s ease;
            }

            .investor-btn-primary:hover {
              background: linear-gradient(135deg, var(--investor-primary-dark) 0%, var(--investor-primary) 100%);
              transform: translateY(-1px);
              box-shadow: 0 4px 6px -1px rgba(124, 58, 237, 0.15);
            }

            .investor-btn-secondary {
              background: rgba(124, 58, 237, 0.1);
              color: var(--investor-primary);
              border: 1px solid rgba(124, 58, 237, 0.2);
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              font-weight: 600;
              transition: all 0.2s ease;
            }

            .investor-btn-secondary:hover {
              background: rgba(124, 58, 237, 0.15);
              border-color: var(--investor-primary);
            }

            .investor-text-highlight {
              background: linear-gradient(135deg, var(--investor-primary) 0%, var(--investor-primary-light) 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }

            .investor-accent {
              color: var(--investor-primary);
            }
          `}
        </style>

        <div className="investor-page">
          <PublicHeader
            appName="CO | HQ"
            logoIcon={Users}
            logoGradientClass="coach-brand-gradient"
            onLoginClick={() => window.location.href = createPageUrl('CoachLanding')}
            aboutPageUrl={createPageUrl("AboutCoHQ")}
            pricingPageUrl={createPageUrl("CoHQPricing")}
            isCoachTheme={true}
          />

          <main>
            {/* Hero Section */}
            <section className="investor-section-primary px-6 py-20 md:py-32 relative overflow-hidden">
              {/* Subtle background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-[var(--investor-primary)] to-[var(--investor-primary-dark)] opacity-5 rounded-full"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-[var(--investor-primary-light)] to-[var(--investor-primary)] opacity-8 rounded-full"></div>
              </div>

              <div className="max-w-7xl mx-auto text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[var(--investor-primary)] to-[var(--investor-primary-light)] text-white px-4 py-2 rounded-full mb-8">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">Investment Opportunity</span>
                  </div>

                  <h1 className="text-5xl sm:text-7xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
                    Building the Backbone of<br />
                    <span className="investor-text-highlight">
                      Coaching Intelligence
                    </span>
                  </h1>

                  <p className="text-xl sm:text-2xl text-[var(--text-secondary)] mb-8 max-w-4xl mx-auto leading-relaxed">
                    CO | HQ is uniquely positioned to become the infrastructure layer for privacy-conscious coaching intelligence in a $7.3B market growing at 17% CAGR.
                  </p>

                  <div className="flex gap-4 justify-center flex-wrap mb-12">
                    <Button onClick={handleContactInvestor} className="investor-btn-primary">
                      <Briefcase className="w-5 h-5 mr-2" />
                      Request Investor Deck
                    </Button>
                    <Button onClick={handleJoinBetaInvestor} className="investor-btn-secondary">
                      <Users className="w-5 h-5 mr-2" />
                      Join Beta Investor Circle
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="text-center">
                      <div className="text-3xl font-bold investor-accent mb-2">$7.3B</div>
                      <div className="text-sm text-[var(--text-secondary)]">Global coaching market</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold investor-accent mb-2">17%</div>
                      <div className="text-sm text-[var(--text-secondary)]">Annual growth rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold investor-accent mb-2">B2B2C</div>
                      <div className="text-sm text-[var(--text-secondary)]">Dual Growth Model</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Market Opportunity */}
            <section className="investor-section-secondary px-6 py-16 md:py-24">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-6">Massive Market Opportunity</h2>
                  <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
                    The professional coaching industry is experiencing unprecedented growth, driven by increasing focus on employee development, mental health, and retention.
                  </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Market Size & Growth</h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--investor-primary)] to-[var(--investor-primary-dark)] flex-shrink-0 mt-1"></div>
                        <div>
                          <div className="font-semibold text-[var(--text-primary)]">$7.3B Global Market (2024)</div>
                          <div className="text-[var(--text-secondary)]">Professional coaching industry valuation</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--investor-primary)] to-[var(--investor-primary-dark)] flex-shrink-0 mt-1"></div>
                        <div>
                          <div className="font-semibold text-[var(--text-primary)]">17% CAGR Through 2030</div>
                          <div className="text-[var(--text-secondary)]">Fastest growing segment in professional development</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--investor-primary)] to-[var(--investor-primary-dark)] flex-shrink-0 mt-1"></div>
                        <div>
                          <div className="font-semibold text-[var(--text-primary)]">500K+ Professional Coaches</div>
                          <div className="text-[var(--text-secondary)]">Worldwide, with each serving 10-50 clients</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="investor-card"
                  >
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">B2B2C Growth Model</h3>
                    <p className="text-[var(--text-secondary)] mb-6">
                      Every coach brings clients. Our dual-sided model creates compound growth where professional coaches become distribution channels for client acquisition.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 investor-accent" />
                        <span className="text-sm text-[var(--text-primary)]">1 Coach = 20-30 Clients (average)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 investor-accent" />
                        <span className="text-sm text-[var(--text-primary)]">Network effects multiply value</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 investor-accent" />
                        <span className="text-sm text-[var(--text-primary)]">Sticky enterprise relationships</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Market Drivers</h3>
                   <div className="investor-card" style={{ height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={marketDriversData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                                {marketDriversData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    </div>
                </motion.div>
              </div>
            </section>

            {/* Business Model */}
            <section className="investor-section-primary px-6 py-16 md:py-24">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-6">Scalable Business Model</h2>
                  <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
                    Multiple revenue streams with high margins, network effects, and natural expansion opportunities into adjacent markets.
                  </p>
                </motion.div>

                <div className="investor-card mb-16" style={{height: '400px'}}>
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6 text-center">Projected Revenue Streams</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={revenueStreamsData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" unit="%" />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Projected %" fill="#8B5CF6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>


                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="investor-card"
                >
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-6 text-center">Powerful Unit Economics (LTV vs. CAC)</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={unitEconomicsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => `$${value}`} />
                            <Legend />
                            <Bar dataKey="Acquisition Cost" fill="#A78BFA" />
                            <Bar dataKey="Lifetime Value" fill="#6D28D9" />
                        </BarChart>
                    </ResponsiveContainer>
                  </div>
                   <div className="grid md:grid-cols-4 gap-8 mt-8 border-t border-[var(--border-color)] pt-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold investor-accent mb-2">$150</div>
                      <div className="text-sm text-[var(--text-secondary)]">Avg. Revenue / Coach / Month</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold investor-accent mb-2">85%</div>
                      <div className="text-sm text-[var(--text-secondary)]">Gross Margin</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold investor-accent mb-2">&lt; $50</div>
                      <div className="text-sm text-[var(--text-secondary)]">Customer Acquisition Cost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold investor-accent mb-2">36:1</div>
                      <div className="text-sm text-[var(--text-secondary)]">LTV:CAC Ratio</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Competitive Advantages */}
            <section className="investor-section-secondary px-6 py-16 md:py-24">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-6">Why CO | HQ Wins</h2>
                  <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
                    Our unique positioning at the intersection of AI, privacy, and coaching creates sustainable competitive advantages.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                  >
                    <div className="flex items-start gap-6">
                      <div className="investor-icon-container w-12 h-12 flex-shrink-0">
                        <Brain className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Network Effects & Data Moat</h3>
                        <p className="text-[var(--text-secondary)]">
                          More coaches = richer qualitative dataset = better AI insights = more coach value. Our "brain grows with every new coach/client" creating a compounding advantage.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="investor-icon-container w-12 h-12 flex-shrink-0">
                        <Shield className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Privacy-First Architecture</h3>
                        <p className="text-[var(--text-secondary)]">
                          Swiss-hosted, GDPR-compliant infrastructure with proprietary consent models. Unmatched trust in an industry where privacy is paramount.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                  >
                    <div className="flex items-start gap-6">
                      <div className="investor-icon-container w-12 h-12 flex-shrink-0">
                        <Zap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Vertical-Specific AI</h3>
                        <p className="text-[var(--text-secondary)]">
                          Purpose-built for coaching workflows, not generic productivity. Deep understanding of coaching methodologies creates irreplaceable value.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="investor-icon-container w-12 h-12 flex-shrink-0">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Proven Retention Model</h3>
                        <p className="text-[var(--text-secondary)]">
                          15-20% client retention improvement creates immediate ROI for coaches, making switching costs prohibitively high.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* IP & Roadmap */}
            <section className="investor-section-primary px-6 py-16 md:py-24">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-6">Intellectual Property & Strategic Moats</h2>
                  <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
                    Building defensible technology and market position through proprietary innovations and strategic partnerships.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="investor-card"
                  >
                    <div className="investor-icon-container mb-4">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Patent Portfolio</h3>
                    <p className="text-[var(--text-secondary)]">
                      Filing patents on consent-based AI training, coaching pattern recognition, and privacy-preserving analytics methods.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="investor-card"
                  >
                    <div className="investor-icon-container mb-4">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Proprietary Consent Model</h3>
                    <p className="text-[var(--text-secondary)]">
                      Industry-leading privacy architecture that enables AI training while maintaining individual data sovereignty.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="investor-card"
                  >
                    <div className="investor-icon-container mb-4">
                      <Globe className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Swiss Enterprise Trust</h3>
                    <p className="text-[var(--text-secondary)]">
                      Leveraging Switzerland's reputation for privacy and neutrality to build trust with global enterprise clients.
                    </p>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Final CTA */}
            <section className="investor-section-secondary px-6 py-16 md:py-24">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-6">Join the Future of Coaching Intelligence</h2>
                  <p className="text-xl text-[var(--text-secondary)] mb-8">
                    Partner with us to build the infrastructure that will power the next generation of professional coaching and human development.
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Button onClick={handleContactInvestor} className="investor-btn-primary">
                      <Briefcase className="w-5 h-5 mr-2" />
                      Request Full Investor Deck
                    </Button>
                    <Button onClick={handleJoinBetaInvestor} className="investor-btn-secondary">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Join Beta Investor Circle
                    </Button>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-4">
                    Series A raising Q2 2025 • $3M target • Strategic partnerships available
                  </p>
                </motion.div>
              </div>
            </section>
          </main>

          <PublicFooter isCoachTheme={true} />
        </div>
      </div>
    </>
  );
}
