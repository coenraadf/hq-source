import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function UpcomingSessionWidget({ user }) {
  // Mock session data - in real implementation, this would come from a scheduling system
  const mockSession = {
    date: "2025-01-30",
    time: "2:00 PM",
    duration: 60,
    type: "video_call",
    topic: "Goal Setting & Progress Review",
    coach_name: "Sarah Wilson"
  };

  const hasCoach = user?.coach_id;
  const hasUpcomingSession = hasCoach && mockSession;

  if (!hasCoach) {
    return (
      <div className="text-center py-6">
        <Calendar className="w-12 h-12 text-warm-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-warm-primary mb-2">No coach connected</h3>
        <p className="text-warm-muted text-sm mb-4">
          Connect with a coach to schedule sessions
        </p>
        <Link to={createPageUrl("CoachInvitation")}>
          <Button size="sm" className="compass-gradient hover:opacity-90 text-white">
            Find a Coach
          </Button>
        </Link>
      </div>
    );
  }

  if (!hasUpcomingSession) {
    return (
      <div className="text-center py-6">
        <Calendar className="w-12 h-12 text-warm-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-warm-primary mb-2">No upcoming sessions</h3>
        <p className="text-warm-muted text-sm mb-4">
          Schedule your next coaching session
        </p>
        <Link to={createPageUrl("MyCoach")}>
          <Button size="sm" className="compass-gradient hover:opacity-90 text-white">
            Schedule Session
          </Button>
        </Link>
      </div>
    );
  }

  const sessionDate = new Date(mockSession.date);
  const isToday = sessionDate.toDateString() === new Date().toDateString();
  const isTomorrow = sessionDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
  
  const getDateLabel = () => {
    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";
    return sessionDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border warm-border bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Next Session</h4>
          </div>
          <Badge variant={isToday ? "default" : "secondary"} className="text-xs">
            {getDateLabel()}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-blue-800">
            <Clock className="w-4 h-4" />
            <span>{mockSession.time} ({mockSession.duration} min)</span>
          </div>
          
          {mockSession.type === "video_call" && (
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Video className="w-4 h-4" />
              <span>Video Call</span>
            </div>
          )}
          
          <div className="text-sm text-blue-700 font-medium">
            {mockSession.topic}
          </div>
          
          <div className="text-xs text-blue-600">
            with {mockSession.coach_name}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Link to={createPageUrl("Messages")}>
          <Button variant="outline" size="sm" className="w-full text-xs warm-border">
            <MessageSquare className="w-3 h-3 mr-1" />
            Message
          </Button>
        </Link>
        <Link to={createPageUrl("MyCoach")}>
          <Button variant="outline" size="sm" className="w-full text-xs warm-border">
            <Calendar className="w-3 h-3 mr-1" />
            Reschedule
          </Button>
        </Link>
      </div>
    </div>
  );
}