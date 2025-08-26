import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Mail, Copy, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CoachInvitation } from "@/api/entities";
import { format } from "date-fns";

export default function NewClientRequestsWidget() {
  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const pendingInvites = await CoachInvitation.filter({ status: "pending" });
      setInvitations(pendingInvites.slice(0, 3)); // Show only first 3
    } catch (err) {
      console.error("Error loading invitations:", err);
      setError("Could not load invitations. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyInvitationCode = (code) => {
    navigator.clipboard.writeText(code);
    alert("Invitation code copied!");
  };

  if (isLoading) {
    return (
      <div className="text-center py-6">
        <div className="animate-pulse">
          <UserPlus className="w-8 h-8 text-warm-muted mx-auto mb-4" />
        </div>
        <p className="text-warm-muted text-sm">Loading invitations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 className="font-medium text-red-600 mb-2">Something went wrong</h3>
        <p className="text-sm text-red-500 mb-4 px-2">{error}</p>
        <Button onClick={loadInvitations} variant="destructive" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="text-center py-6">
        <UserPlus className="w-12 h-12 text-warm-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-warm-primary mb-2">No pending requests</h3>
        <p className="text-warm-muted text-sm mb-4">
          All your invitations have been responded to
        </p>
        <Link to={createPageUrl("ClientManagement")}>
          <Button size="sm" className="coach-gradient hover:opacity-90 text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Client
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => (
        <div key={invitation.id} className="p-3 rounded-lg border warm-border bg-white/50">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-stone-400" />
              <div>
                <p className="font-medium text-warm-primary text-sm">{invitation.client_email}</p>
                <p className="text-xs text-warm-muted">
                  Sent {format(new Date(invitation.created_date), "MMM d")}
                </p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => copyInvitationCode(invitation.invitation_code)}
              className="h-6 w-6"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {invitation.invitation_code}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Pending
            </Badge>
          </div>
        </div>
      ))}

      {invitations.length > 0 && (
        <div className="pt-2 border-t warm-border">
          <Link to={createPageUrl("ClientManagement")}>
            <Button variant="ghost" size="sm" className="w-full text-warm-secondary hover:text-warm-primary">
              View All Requests
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}