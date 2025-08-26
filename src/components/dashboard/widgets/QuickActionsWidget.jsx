import React from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  MessageCircle, 
  Library, 
  UserCheck, 
  Brain,
  Sparkles
} from "lucide-react";

export default function QuickActionsWidget({ user }) {
  const actions = [
    {
      title: "New Entry",
      icon: Plus,
      url: createPageUrl("NewEntry"),
      description: "Capture thoughts"
    },
    {
      title: "Ask Yourself",
      icon: MessageCircle,
      url: createPageUrl("Chat"),
      description: "Explore patterns"
    },
    {
      title: "Resource Library",
      icon: Library,
      url: createPageUrl("Resources"),
      description: "Manage files"
    },
    {
      title: "Personality Tests",
      icon: Brain,
      url: createPageUrl("PersonalityTests"),
      description: "View assessments"
    }
  ];

  // Add coach-specific action for clients
  if (user?.user_type === 'client') {
    actions.push({
      title: "Connect Coach",
      icon: UserCheck,
      url: createPageUrl("CoachInvitation"),
      description: "Find guidance"
    });
  }

  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      {actions.map((action, index) => (
        <Link key={index} to={action.url}>
          <Button 
            variant="outline" 
            className="h-auto min-h-[5rem] p-3 flex flex-col w-full warm-border hover:bg-stone-50 text-warm-primary hover:warm-shadow transition-all"
          >
            <action.icon className="w-4 h-4 mb-2 text-warm-secondary flex-shrink-0" />
            <span className="text-xs font-medium text-center line-clamp-1 mb-1 break-words leading-tight">{action.title}</span>
            <span className="text-[0.6rem] text-warm-muted text-center line-clamp-2 leading-tight break-words">{action.description}</span>
          </Button>
        </Link>
      ))}
    </div>
  );
}