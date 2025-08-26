import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Share2,
  Calendar,
  Target,
  FileText,
  Video
} from "lucide-react";
import { motion } from "framer-motion";

export default function QuickActions({ client, onSendMessage, onShareResource, onScheduleSession }) {
  const actions = [
    {
      title: "Send Message",
      description: "Send a note or insight",
      icon: MessageSquare,
      onClick: onSendMessage,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Share Resource",
      description: "Share files or templates",
      icon: Share2,
      onClick: onShareResource,
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Schedule Session",
      description: "Book a coaching session",
      icon: Calendar,
      onClick: onScheduleSession,
      color: "from-purple-500 to-indigo-600"
    },
    {
      title: "Session Notes",
      description: "Create session template",
      icon: FileText,
      onClick: () => console.log("Session notes"),
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Video Call",
      description: "Start video session",
      icon: Video,
      onClick: () => console.log("Video call"),
      color: "from-red-500 to-pink-500"
    },
    {
      title: "Set Goals",
      description: "Update client goals",
      icon: Target,
      onClick: () => console.log("Set goals"),
      color: "from-teal-500 to-cyan-600"
    }
  ];

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
      <CardHeader>
        <CardTitle className="text-stone-800">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant="outline"
                className="h-20 w-full flex-col gap-2 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                onClick={action.onClick}
              >
                <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} shadow-sm`}>
                  <action.icon className="w-4 h-4 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium text-stone-800">{action.title}</p>
                  <p className="text-xs text-stone-500">{action.description}</p>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}