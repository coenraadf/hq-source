import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import ScrollToTop from "@/components/utils/ScrollToTop";
import { createPageUrl } from "@/utils";

export default function TermsOfService() {
  return (
    <>
      <ScrollToTop />
      <div className="bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] text-[var(--text-primary)]">
        <PublicHeader
          appName="CO | HQ"
          logoIcon={Users}
          logoGradientClass="coach-brand-gradient"
          onLoginClick={() => window.location.href = createPageUrl('CoachLanding')}
          aboutPageUrl={createPageUrl("AboutCoHQ")}
          pricingPageUrl={createPageUrl("CoHQPricing")}
          isCoachTheme={true}
        />

        <main className="px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-full mb-6">
                <Gavel className="w-5 h-5" />
                <span className="text-sm font-medium">Legal Information</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
                Terms of Service & Privacy Policy
              </h1>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                Our commitment to transparency and your rights.
              </p>
            </motion.div>

            <div className="grid gap-8">
              {/* Terms of Service */}
              <Card className="base-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Gavel className="w-6 h-6 text-[var(--brand-primary)]" />
                    Terms of Service
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">1. Acceptance of Terms</h3>
                    <p className="text-[var(--text-secondary)]">
                      By accessing and using CO | HQ and My | HQ (collectively, "the Services"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use the Services.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">2. Use License</h3>
                    <p className="text-[var(--text-secondary)] mb-2">
                      Permission is granted to temporarily access the Services for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
                    </p>
                    <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-1">
                      <li>modify or copy the materials</li>
                      <li>use the materials for any commercial purpose or for any public display</li>
                      <li>attempt to reverse engineer any software contained in the Services</li>
                      <li>remove any copyright or other proprietary notations from the materials</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">3. User Accounts and Data</h3>
                    <p className="text-[var(--text-secondary)]">
                      You are responsible for safeguarding the password and for maintaining the confidentiality of your account. You agree not to disclose your password to any third party and to notify us immediately if you suspect any unauthorized use of your account.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">4. Swiss Jurisdiction</h3>
                    <p className="text-[var(--text-secondary)]">
                      These terms and conditions are governed by and construed in accordance with the laws of Switzerland. You irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">5. Service Availability</h3>
                    <p className="text-[var(--text-secondary)]">
                      We strive to provide reliable access to our Services, but we do not guarantee uninterrupted availability. We reserve the right to modify, suspend, or discontinue the Services at any time with reasonable notice.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">6. Contact Information</h3>
                    <p className="text-[var(--text-secondary)]">
                      If you have any questions about these Terms of Service, please contact us through our support channels.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Policy */}
              <Card className="base-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Shield className="w-6 h-6 text-[var(--brand-primary)]" />
                    Privacy Policy
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose prose-gray max-w-none space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Information We Collect</h3>
                    <p className="text-[var(--text-secondary)] mb-2">
                      We collect information you provide directly to us, such as:
                    </p>
                    <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-1">
                      <li>Account information (name, email address, profile information)</li>
                      <li>Content you create (journal entries, notes, goals, assessments)</li>
                      <li>Communications with your coach (when explicitly shared)</li>
                      <li>Usage data to improve our Services</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Swiss Data Protection</h3>
                    <p className="text-[var(--text-secondary)]">
                      All data is hosted in Switzerland and subject to Swiss Federal Data Protection Act (FADP) and European GDPR standards. We employ end-to-end encryption and strict access controls to protect your personal information.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Data Sharing and Consent</h3>
                    <p className="text-[var(--text-secondary)]">
                      Your personal data is never shared without your explicit consent. In the coaching relationship, you control exactly what information is shared with your coach and can revoke access at any time. We do not sell, trade, or otherwise transfer your personal data to third parties.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Your Rights</h3>
                    <p className="text-[var(--text-secondary)] mb-2">
                      Under Swiss and European law, you have the right to:
                    </p>
                    <ul className="list-disc pl-6 text-[var(--text-secondary)] space-y-1">
                      <li>Access your personal data</li>
                      <li>Correct inaccurate or incomplete data</li>
                      <li>Delete your personal data</li>
                      <li>Restrict processing of your data</li>
                      <li>Data portability (export your data)</li>
                      <li>Object to processing based on legitimate interests</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Data Retention</h3>
                    <p className="text-[var(--text-secondary)]">
                      We retain your data only as long as necessary to provide our Services or as required by law. You can request deletion of your account and associated data at any time.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Contact for Privacy Concerns</h3>
                    <p className="text-[var(--text-secondary)]">
                      If you have questions about our privacy practices or wish to exercise your rights, please contact our Data Protection Officer through our support channels.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12 text-sm text-[var(--text-secondary)]">
              <p>Last updated: January 2025</p>
            </div>
          </div>
        </main>

        <PublicFooter isCoachTheme={true} />
      </div>
    </>
  );
}