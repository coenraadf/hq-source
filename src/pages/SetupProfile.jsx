import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, Sparkles, UserCheck, Users, Camera, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function SetupProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    preferred_app_name: "",
    username: "",
    user_type: "",
    specialization: "",
    bio: "",
    phone: "",
    timezone: "America/New_York",
    company: "",
    preferred_display: "preferred_app_name",
    profile_photo_url: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [authCheckInProgress, setAuthCheckInProgress] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    // Prevent multiple simultaneous requests
    if (authCheckInProgress) {
      console.log("SetupProfile: Auth check already in progress, waiting");
      return;
    }

    setIsLoading(true);
    try {
      setAuthCheckInProgress(true);
      
      // Add delay to prevent rapid requests
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const userData = await User.me();
      console.log("SetupProfile: User data loaded successfully", userData);

      setUser(userData);

      // Check if user has already completed setup
      if (userData.onboarding_completed && userData.preferred_app_name && userData.user_type) {
        const dashboardUrl = userData.user_type === "coach" 
          ? createPageUrl("CoachDashboard") 
          : createPageUrl("Dashboard");
        navigate(dashboardUrl);
        return;
      }

      // Get the selected user type from session storage (from landing page selection)
      let selectedUserType = null;
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          selectedUserType = window.sessionStorage.getItem('pendingUserType');
        }
      } catch (storageError) {
        console.warn("Could not access sessionStorage:", storageError);
      }
      
      // Generate default username from email
      const defaultUsername = userData.email 
        ? userData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_')
        : '';

      // Pre-fill form with existing data and OAuth info
      setFormData({
        preferred_app_name: userData.preferred_app_name || userData.full_name || "",
        username: userData.username || defaultUsername,
        user_type: userData.user_type || selectedUserType || "",
        specialization: userData.specialization || "",
        bio: userData.bio || "",
        phone: userData.phone || "",
        timezone: userData.timezone || "America/New_York",
        company: userData.company || "",
        preferred_display: userData.preferred_display || "preferred_app_name",
        profile_photo_url: userData.profile_photo_url || ""
      });

      // Clear the session storage
      if (selectedUserType) {
        try {
          if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.removeItem('pendingUserType');
          }
        } catch (storageError) {
          console.warn("Could not clear sessionStorage:", storageError);
        }
      }
    } catch (error) {
      console.error("SetupProfile: Error loading user data:", error);
      
      // Handle 401 authentication errors specifically
      if (error.message && (error.message.includes('401') || error.message.includes('Unauthorized'))) {
        console.log("SetupProfile: 401 authentication failed, redirecting to login");
        
        // Clear storage safely
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.clear();
          }
          if (typeof window !== 'undefined' && window.sessionStorage) {
            window.sessionStorage.clear();
          }
        } catch (storageError) {
          console.warn("Could not clear storage:", storageError);
        }
        
        // Redirect to appropriate login page
        window.location.replace(createPageUrl("MyHQHome"));
        return;
      }
      
      // Handle rate limiting specifically
      if (error.message && error.message.includes('429')) {
        console.log("SetupProfile: Rate limited, will retry");
        setTimeout(() => {
          setAuthCheckInProgress(false);
          loadUserData();
        }, 3000);
        return;
      }
      
      // For other errors, redirect to home
      console.log("SetupProfile: Other error detected, redirecting to home");
      window.location.replace(createPageUrl("MyHQHome"));
    } finally {
      setIsLoading(false);
      setAuthCheckInProgress(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const result = await UploadFile({ file });
      setFormData(prev => ({ ...prev, profile_photo_url: result.file_url }));
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("There was an error uploading your photo. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.preferred_app_name.trim() || !formData.user_type || isSaving) return;

    setIsSaving(true);
    
    try {
      // Prepare data for update
      const updateData = {
        preferred_app_name: formData.preferred_app_name.trim(),
        username: formData.username.trim(),
        user_type: formData.user_type,
        phone: formData.phone.trim(),
        timezone: formData.timezone,
        company: formData.company.trim(),
        preferred_display: formData.preferred_display,
        profile_photo_url: formData.profile_photo_url,
        onboarding_completed: true
      };

      // Only include coach-specific fields if user is a coach
      if (formData.user_type === 'coach') {
        updateData.specialization = formData.specialization.trim();
        updateData.bio = formData.bio.trim();
      }

      // Update the user data
      await User.updateMyUserData(updateData);
      
      // Navigate to appropriate dashboard
      const dashboardUrl = formData.user_type === "coach" 
        ? createPageUrl("CoachDashboard") 
        : createPageUrl("Dashboard");
      navigate(dashboardUrl);
    } catch (error) {
      console.error("Error updating profile:", error);
      
      if (error.message && error.message.includes('429')) {
        alert("Too many requests. Please wait a moment and try again.");
      } else {
        alert("There was an error saving your profile. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToLanding = () => {
    const landingUrl = formData.user_type === "coach" 
      ? createPageUrl("CoHQHome") 
      : createPageUrl("MyHQHome");
    navigate(landingUrl);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-stone-50 via-neutral-50 to-amber-50/30">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto" />
          <p className="text-stone-600">
            {authCheckInProgress ? 'Retrying connection...' : 'Loading your profile...'}
          </p>
        </div>
      </div>
    );
  }

  const isCoach = formData.user_type === "coach";
  const themeColors = isCoach 
    ? "from-purple-500 to-indigo-600" 
    : "from-amber-500 to-orange-500";

  return (
    <div className={`min-h-screen ${isCoach ? 'bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50/30' : 'bg-gradient-to-br from-stone-50 via-neutral-50 to-amber-50/30'} flex items-center justify-center p-6`}>
      <div className="max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Back Button */}
          <div className="flex justify-start mb-6">
            <Button
              variant="outline"
              onClick={handleBackToLanding}
              className="border-stone-200 hover:bg-stone-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {isCoach ? 'Co | HQ' : 'My | HQ'}
            </Button>
          </div>

          <div className="text-center">
            <div className={`w-16 h-16 bg-gradient-to-br ${themeColors} rounded-3xl flex items-center justify-center shadow-lg mx-auto mb-6`}>
              {isCoach ? <Users className="w-8 h-8 text-white" /> : <Sparkles className="w-8 h-8 text-white" />}
            </div>
            <h1 className="text-4xl font-bold text-stone-800 mb-2">Complete Your Profile</h1>
            <p className="text-lg text-stone-600">
              Let's set up your {isCoach ? 'Co | HQ' : 'My | HQ'} experience
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isCoach ? <UserCheck className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                {isCoach ? "Coach" : "Personal"} Profile Setup
              </CardTitle>
              <CardDescription>
                {isCoach 
                  ? "Set up your coaching profile to start helping clients" 
                  : "Create your profile to begin your inner journey"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Photo */}
                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br ${themeColors} flex items-center justify-center`}>
                      {formData.profile_photo_url ? (
                        <img 
                          src={formData.profile_photo_url} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-xl font-semibold">
                          {formData.preferred_app_name?.charAt(0) || formData.username?.charAt(0) || '?'}
                        </span>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload">
                        <Button
                          type="button"
                          variant="outline"
                          className="cursor-pointer"
                          disabled={isUploadingPhoto}
                          asChild
                        >
                          <span>
                            {isUploadingPhoto ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Camera className="w-4 h-4 mr-2" />
                            )}
                            {isUploadingPhoto ? "Uploading..." : "Upload Photo"}
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Account Type Selection */}
                <div className="space-y-2">
                  <Label htmlFor="user_type">Account Type *</Label>
                  <Select 
                    value={formData.user_type} 
                    onValueChange={(value) => handleInputChange("user_type", value)}
                  >
                    <SelectTrigger className="border-stone-200 focus:border-amber-300">
                      <SelectValue placeholder="Select your account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client (My | HQ User)</SelectItem>
                      <SelectItem value="coach">Coach (Co | HQ User)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                {/* Preferred App Name */}
                <div className="space-y-2">
                  <Label htmlFor="preferred_app_name">Your Name *</Label>
                  <Input
                    id="preferred_app_name"
                    value={formData.preferred_app_name}
                    onChange={(e) => handleInputChange("preferred_app_name", e.target.value)}
                    placeholder="How you'd like to be called"
                    className="border-stone-200 focus:border-amber-300 focus:ring-amber-200"
                    required
                  />
                  <p className="text-xs text-stone-500">This is how you'll appear throughout the app</p>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500">@</span>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="your_username"
                      className="pl-8 border-stone-200 focus:border-amber-300 focus:ring-amber-200"
                    />
                  </div>
                  <p className="text-xs text-stone-500">This will be your unique identifier on the platform</p>
                </div>

                {/* Display how their full name from OAuth appears */}
                {user?.full_name && (
                  <div className="space-y-2">
                    <Label>Full Name (from your account)</Label>
                    <Input
                      value={user.full_name}
                      disabled
                      className="border-stone-200 bg-stone-50 text-stone-500"
                    />
                    <p className="text-xs text-stone-500">This comes from your login account and cannot be changed here</p>
                  </div>
                )}

                {/* Email Display */}
                {user?.email && (
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      value={user.email}
                      disabled
                      className="border-stone-200 bg-stone-50 text-stone-500"
                    />
                    <p className="text-xs text-stone-500">Email cannot be changed</p>
                  </div>
                )}

                {/* Basic Info Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="e.g., +1 555-123-4567"
                      className="border-stone-200 focus:border-amber-300 focus:ring-amber-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="Optional"
                      className="border-stone-200 focus:border-amber-300 focus:ring-amber-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={formData.timezone} 
                    onValueChange={(value) => handleInputChange("timezone", value)}
                  >
                    <SelectTrigger className="border-stone-200 focus:border-amber-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Coach-specific fields */}
                {formData.user_type === 'coach' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => handleInputChange("specialization", e.g.target.value)}
                        placeholder="e.g., Life Coaching, Leadership, Mindfulness"
                        className="border-stone-200 focus:border-amber-300 focus:ring-amber-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        placeholder="Tell your clients about your background and approach..."
                        className="min-h-[100px] border-stone-200 focus:border-amber-300 focus:ring-amber-200"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end pt-6 border-t border-stone-200">
                  <Button
                    type="submit"
                    disabled={!formData.preferred_app_name.trim() || !formData.user_type || isSaving}
                    className={`bg-gradient-to-r ${themeColors} hover:from-purple-600 hover:to-indigo-700 text-white px-8`}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isSaving ? "Setting up..." : "Complete Setup"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}