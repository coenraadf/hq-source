import React, { useState, useEffect } from "react";
import { User, CoachInvitation as CoachInvitationEntity, CoachingRelationship } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  UserCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { motion } from "framer-motion";

export default function CoachInvitation() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [invitationCode, setInvitationCode] = useState("");
  const [invitation, setInvitation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
      navigate(createPageUrl("RoleSelection"));
    }
  };

  const handleLookupInvitation = async (e) => {
    e.preventDefault();
    if (!invitationCode.trim()) return;

    setIsLoading(true);
    setMessage("");
    
    try {
      const invitations = await CoachInvitationEntity.filter({
        invitation_code: invitationCode.trim().toUpperCase(),
        status: "pending"
      });

      if (invitations.length === 0) {
        setMessage("No valid invitation found with that code. Please check the code and try again.");
        setInvitation(null);
      } else {
        const invite = invitations[0];
        
        if (new Date(invite.expires_at) < new Date()) {
          setMessage("This invitation has expired. Please contact your coach for a new invitation.");
          setInvitation(null);
        } else if (invite.client_email.toLowerCase() !== user.email.toLowerCase()) {
          setMessage("This invitation is not for your email address. Please contact your coach.");
          setInvitation(null);
        } else {
          setInvitation(invite);
          setMessage("");
        }
      }
    } catch (error) {
      console.error("Error looking up invitation:", error);
      setMessage("There was an error looking up the invitation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!invitation || !user) return;

    setIsAccepting(true);
    try {
      await CoachingRelationship.create({
        coach_id: invitation.coach_id,
        client_id: user.id,
        status: "active",
        start_date: new Date().toISOString().split('T')[0]
      });

      await CoachInvitationEntity.update(invitation.id, {
        status: "accepted"
      });

      navigate(createPageUrl("Dashboard"));
      
    } catch (error) {
      console.error("Error accepting invitation:", error);
      setMessage("There was an error accepting the invitation. Please try again.");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDeclineInvitation = async () => {
    if (!invitation) return;

    try {
      await CoachInvitationEntity.update(invitation.id, {
        status: "declined"
      });

      setInvitation(null);
      setInvitationCode("");
      setMessage("Invitation declined.");
    } catch (error) {
      console.error("Error declining invitation:", error);
      setMessage("There was an error declining the invitation.");
    }
  };

  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-[#FAF6F0] to-[#F5F1EB]">
        <div className="text-center">
          <p className="text-[#2D2D2D]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF6F0] to-[#F5F1EB] flex items-center justify-center p-6">
      <div className="max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
            className="mb-4 border-[#E5E0D8] hover:bg-[#F5F1EB]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#C4895B] to-[#B8794A] rounded-3xl flex items-center justify-center shadow-lg mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Coach Invitation</h1>
            <p className="text-[#2D2D2D]">Enter your invitation code to connect with your coach</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-[#E5E0D8] shadow-xl">
            <CardHeader>
              <CardTitle className="text-[#1A1A1A]">Connect with Your Coach</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLookupInvitation} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invitation_code" className="text-[#2D2D2D]">Invitation Code</Label>
                  <Input
                    id="invitation_code"
                    placeholder="Enter 6-digit code (e.g., ABC123)"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                    className="border-[#E5E0D8] focus:border-[#C4895B] focus:ring-[#C4895B]/20 text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading || !invitationCode.trim()}
                  className="w-full bg-gradient-to-r from-[#C4895B] to-[#B8794A] hover:from-[#B8794A] hover:to-[#A66B3F] text-white"
                >
                  {isLoading ? "Looking up..." : "Look Up Invitation"}
                </Button>
              </form>

              {message && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    <p className="text-red-700 text-sm">{message}</p>
                  </div>
                </div>
              )}

              {invitation && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-green-800 mb-2">Invitation Found!</h3>
                        <p className="text-green-700 text-sm mb-3">
                          You've been invited to work with a coach. Here are the details:
                        </p>
                        
                        {invitation.message && (
                          <div className="bg-white p-3 rounded border">
                            <p className="text-[#2D2D2D] italic">"{invitation.message}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleAcceptInvitation}
                      disabled={isAccepting}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isAccepting ? "Accepting..." : "Accept Invitation"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDeclineInvitation}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}