import React, { useState, useEffect } from "react";
import { User, CoachingRelationship } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User as UserIcon,
  Mail,
  Linkedin,
  Globe,
  Loader2,
  MessageSquarePlus,
} from "lucide-react";

export default function MyCoachPage() {
  const [coach, setCoach] = useState(null);
  const [relationship, setRelationship] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = await User.me();
      const relationships = await CoachingRelationship.filter({
        client_id: currentUser.id,
        status: "active",
      });

      if (relationships.length > 0) {
        setRelationship(relationships[0]);
        const coachData = await User.get(relationships[0].coach_id);
        setCoach(coachData);
      }
    } catch (err) {
      console.error("Error loading coach data:", err);
      setError("Failed to load your coach's information.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-primary)]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-h1">My Coach</h1>
          <p className="text-body-large text-text-secondary">
            Your personal guide on your growth journey
          </p>
        </header>

        {coach ? (
          <div className="base-card p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-center flex-shrink-0">
                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-white shadow-lg">
                  <AvatarImage src={coach.profile_photo_url} alt={coach.preferred_app_name} />
                  <AvatarFallback className="text-4xl coach-brand-gradient text-white">
                    {coach.preferred_app_name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-text-primary">
                  {coach.preferred_app_name}
                </h2>
                <p className="text-text-secondary">{coach.specialization}</p>
              </div>
              <div className="flex-1">
                <p className="text-body text-text-secondary text-center md:text-left">
                  {coach.bio}
                </p>
                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                  {coach.email && (
                    <a href={`mailto:${coach.email}`} className="btn-secondary">
                      <Mail className="w-4 h-4 mr-2" /> Email
                    </a>
                  )}
                  {coach.website_url && (
                    <a href={coach.website_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                      <Globe className="w-4 h-4 mr-2" /> Website
                    </a>
                  )}
                   {coach.linkedin_url && (
                    <a href={coach.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                      <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="base-card p-8 text-center h-full flex flex-col justify-center items-center">
                <div className="icon-container-branded w-16 h-16 mb-6">
                   <UserIcon className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-h2">Connect with a Coach</h2>
                <p className="text-body text-text-secondary mb-6">
                  Ready to take your journey to the next level? Connect with a coach who can provide personalized guidance and support.
                </p>
                <Button onClick={() => navigate(createPageUrl("CoachInvitation"))} className="btn-primary w-full">
                  Find a Coach
                </Button>
              </div>
            </div>
            <div className="md:col-span-2">
                <div className="base-card p-8 text-center h-full flex flex-col justify-center items-center brand-gradient-soft">
                     <div className="icon-container-branded w-16 h-16 mb-6">
                       <MessageSquarePlus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-h2">Shared Notes & Messages</h2>
                    <p className="text-body text-text-secondary max-w-md">
                        Once you connect with a coach, this space will show your shared notes, messages from your coach, and collaborative entries.
                    </p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}