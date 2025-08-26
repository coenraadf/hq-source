import React from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageSquare, 
  UserCheck, 
  Calendar,
  BookOpen,
  UserPlus
} from "lucide-react";

export default function CoachConnectionWidget({ user, coachMessages = [] }) {
  const hasCoach = user?.coach_id;

  if (!hasCoach) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 compass-gradient rounded-full flex items-center justify-center mx-auto mb-3 warm-shadow">
          <UserCheck className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-base font-medium text-warm-primary mb-2 break-words">Connect with a Coach</h3>
        <p className="text-warm-muted text-xs mb-3 break-words px-2">
          Get personalized guidance on your growth journey
        </p>
        <Link to={createPageUrl("CoachInvitation")}>
          <Button className="compass-gradient hover:opacity-90 text-white warm-shadow border-0 text-xs px-3 py-2">
            <UserPlus className="w-3 h-3 mr-1" />
            Find a Coach
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 compass-gradient rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            <Heart className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-warm-primary text-sm break-words">Your Coach</h3>
            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
              Connected
            </Badge>
          </div>
        </div>
      </div>

      {coachMessages.length > 0 ? (
        <div className="space-y-2">
          {coachMessages.slice(0, 2).map((message) => (
            <div key={message.id} className="p-2 rounded-lg bg-orange-50 warm-border border">
              <h4 className="font-medium text-orange-800 text-xs mb-1 line-clamp-1 break-words">{message.title}</h4>
              <p className="text-orange-700 text-xs line-clamp-2 break-words">
                {message.content.substring(0, 80)}...
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-3">
          <MessageSquare className="w-6 h-6 text-warm-muted mx-auto mb-2" />
          <p className="text-warm-muted text-xs break-words">No recent messages</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 pt-2 border-t warm-border">
        <Link to={createPageUrl("Messages")}>
          <Button variant="outline" size="sm" className="w-full text-xs warm-border min-w-0">
            <MessageSquare className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">Message</span>
          </Button>
        </Link>
        <Link to={createPageUrl("MyCoach")}>
          <Button variant="outline" size="sm" className="w-full text-xs warm-border min-w-0">
            <BookOpen className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">View Coach</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}