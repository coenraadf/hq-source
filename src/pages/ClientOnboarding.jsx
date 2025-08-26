import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Compass, 
  Shield, 
  Users, 
  Heart, 
  CheckCircle, 
  ArrowRight,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@/api/entities';
import { CoachInvitation } from '@/api/entities';
import { createPageUrl } from '@/utils';

export default function ClientOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [invitationCode, setInvitationCode] = useState('');
  const [invitation, setInvitation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    preferred_app_name: '',
    bio: '',
    goals: '',
    privacy_level: 'selective',
    consent_coaching: false,
    consent_data_processing: false,
    consent_analytics: false
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    // Get invitation code from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      setInvitationCode(code);
      validateInvitation(code);
    }
  }, []);

  const validateInvitation = async (code) => {
    setIsLoading(true);
    try {
      const invitations = await CoachInvitation.filter({ 
        invitation_code: code, 
        status: 'pending' 
      });
      
      if (invitations.length > 0) {
        setInvitation(invitations[0]);
        setCurrentStep(2);
      } else {
        alert('Invalid or expired invitation code. Please check with your coach.');
      }
    } catch (error) {
      console.error('Error validating invitation:', error);
      alert('Error validating invitation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Create user account
      await User.updateMyUserData({
        user_type: 'client',
        preferred_app_name: formData.preferred_app_name,
        bio: formData.bio,
        onboarding_completed: true,
        coach_id: invitation.coach_id
      });

      // Update invitation status
      await CoachInvitation.update(invitation.id, { status: 'accepted' });

      // Redirect to client dashboard
      window.location.href = createPageUrl('Dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Error completing setup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center space-y-6"
          >
            <div className="icon-container icon-container-branded w-16 h-16 mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Welcome to My | HQ</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Enter your invitation code from your coach to access your private growth portal.
              </p>
            </div>
            <div className="space-y-4">
              <Input
                placeholder="Enter invitation code..."
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value)}
                className="form-input text-center text-lg"
              />
              <Button 
                onClick={() => validateInvitation(invitationCode)}
                disabled={!invitationCode.trim() || isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'Validating...' : 'Continue'}
              </Button>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              Don't have an invitation code? Contact your coach to get started.
            </p>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="icon-container icon-container-branded w-16 h-16 mx-auto mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Coach Connection Confirmed</h2>
              <p className="text-[var(--text-secondary)]">
                You've been invited by your coach to join My | HQ. Let's set up your personal profile.
              </p>
              {invitation && (
                <div className="mt-4 p-4 bg-[var(--bg-secondary)] rounded-lg">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    Coach Message:
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {invitation.message || "Welcome to your growth journey!"}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  How would you like to be addressed in My | HQ?
                </label>
                <Input
                  placeholder="e.g., Sarah, Dr. Johnson, etc."
                  value={formData.preferred_app_name}
                  onChange={(e) => setFormData({...formData, preferred_app_name: e.target.value})}
                  className="form-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Tell us a bit about yourself (optional)
                </label>
                <Textarea
                  placeholder="Share anything that might help your coach understand your background or goals..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="form-input h-24"
                />
              </div>

              <Button 
                onClick={handleNext}
                disabled={!formData.preferred_app_name.trim()}
                className="btn-primary w-full"
              >
                Continue to Privacy Settings
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="icon-container icon-container-branded w-16 h-16 mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Privacy & Data Control</h2>
              <p className="text-[var(--text-secondary)]">
                You have complete control over what you share with your coach. Here's how it works:
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-[var(--bg-secondary)] p-4 rounded-lg">
                <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  What Your Coach Can See
                </h4>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Only content you explicitly choose to share
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Goal progress and milestones you mark as shared
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Journal entries you specifically send to them
                  </li>
                </ul>
              </div>

              <div className="bg-[var(--bg-secondary)] p-4 rounded-lg">
                <h4 className="font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                  <EyeOff className="w-4 h-4" />
                  What Stays Private
                </h4>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    All personal journal entries (unless you share them)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Private goals and reflections
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Any content you mark as "private only"
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-[var(--text-primary)]">Choose your default privacy level:</p>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy_level"
                      value="private"
                      checked={formData.privacy_level === 'private'}
                      onChange={(e) => setFormData({...formData, privacy_level: e.target.value})}
                      className="form-radio"
                    />
                    <span className="text-sm">Keep everything private by default (I'll share specific items when ready)</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy_level"
                      value="selective"
                      checked={formData.privacy_level === 'selective'}
                      onChange={(e) => setFormData({...formData, privacy_level: e.target.value})}
                      className="form-radio"
                    />
                    <span className="text-sm">Ask me before sharing each item (recommended)</span>
                  </label>
                </div>
              </div>

              <Button onClick={handleNext} className="btn-primary w-full">
                Continue to Final Step
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="icon-container icon-container-branded w-16 h-16 mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Final Consent & Setup</h2>
              <p className="text-[var(--text-secondary)]">
                Please review and confirm your consent for using My | HQ with your coach.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent_coaching"
                    checked={formData.consent_coaching}
                    onCheckedChange={(checked) => setFormData({...formData, consent_coaching: checked})}
                  />
                  <label htmlFor="consent_coaching" className="text-sm text-[var(--text-secondary)] cursor-pointer">
                    I understand that My | HQ is designed to enhance my coaching relationship and I consent to share selected content with my coach to improve our sessions.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent_data_processing"
                    checked={formData.consent_data_processing}
                    onCheckedChange={(checked) => setFormData({...formData, consent_data_processing: checked})}
                  />
                  <label htmlFor="consent_data_processing" className="text-sm text-[var(--text-secondary)] cursor-pointer">
                    I consent to secure data processing and Swiss-hosted storage of my personal content, with full control over what is shared and when.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent_analytics"
                    checked={formData.consent_analytics}
                    onCheckedChange={(checked) => setFormData({...formData, consent_analytics: checked})}
                  />
                  <label htmlFor="consent_analytics" className="text-sm text-[var(--text-secondary)] cursor-pointer">
                    I consent to anonymous usage analytics to help improve My | HQ (no personal content is included in analytics).
                  </label>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800 mb-1">Your Rights</h4>
                    <p className="text-sm text-green-700">
                      You can modify sharing permissions, revoke access to any content, export your data, or delete your account at any time from your privacy settings.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleComplete}
                disabled={!formData.consent_coaching || !formData.consent_data_processing || isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'Setting up your account...' : 'Complete Setup & Enter My | HQ'}
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="icon-container icon-container-branded w-10 h-10">
              <Compass className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">MY | HQ</h1>
          </div>
          <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-primary-dark)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">Step {currentStep} of {totalSteps}</p>
        </div>

        {/* Main Content */}
        <Card className="base-card">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentStep > 1 && currentStep < totalSteps && (
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleBack} className="btn-secondary">
              Back
            </Button>
            <div className="flex-1"></div>
          </div>
        )}
      </div>
    </div>
  );
}