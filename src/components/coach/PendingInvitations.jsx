import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Clock, Mail, Copy, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CoachInvitation } from "@/api/entities";

export default function PendingInvitations({ invitations, onInvitationDeleted }) {
  const copyInvitationCode = (code) => {
    navigator.clipboard.writeText(code);
    alert("Invitation code copied to clipboard!");
  };

  const handleDeleteInvitation = async (invitationId) => {
    try {
      await CoachInvitation.delete(invitationId);
      onInvitationDeleted(invitationId);
    } catch (error) {
      console.error("Error deleting invitation:", error);
      alert("There was an error deleting the invitation. Please try again.");
    }
  };

  if (invitations.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-stone-800">
            <Clock className="w-5 h-5 text-amber-500" />
            Pending Invitations ({invitations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invitations.map((invitation, index) => (
              <motion.div
                key={invitation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Mail className="w-4 h-4 text-stone-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-800 truncate">
                      {invitation.client_email}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-stone-500 mt-1">
                      <span>
                        Sent {format(new Date(invitation.created_date), "MMM d, yyyy")}
                      </span>
                      <span>•</span>
                      <span>
                        Expires {format(new Date(invitation.expires_at), "MMM d, yyyy")}
                      </span>
                    </div>
                    {invitation.message && (
                      <p className="text-xs text-stone-600 mt-1 line-clamp-1">
                        "{invitation.message}"
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs font-mono">
                      {invitation.invitation_code}
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => copyInvitationCode(invitation.invitation_code)}
                      title="Copy invitation code"
                      className="h-6 w-6"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Delete invitation"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Invitation</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the invitation for{" "}
                          <strong>{invitation.client_email}</strong>? This action cannot be undone 
                          and they will no longer be able to use the invitation code{" "}
                          <code className="bg-stone-100 px-1 rounded text-sm">
                            {invitation.invitation_code}
                          </code>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteInvitation(invitation.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Invitation
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}