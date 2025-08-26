import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default function WelcomeScreen({ onStartConversation }) {
  const quickStartPrompts = [
    "Reflect on my recent journal entries.",
    "What are the common themes in my notes about work?",
    "Based on my personality tests, what are my biggest strengths?",
    "Help me brainstorm steps for my goal to 'Learn Guitar'."
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 flex-1 bg-[var(--bg-primary)]">
        <div className="icon-container-branded w-20 h-20 mb-6 shadow-lg">
          <MessageSquare className="w-10 h-10 text-white" />
        </div>
      <h2 className="text-h2 text-[var(--text-primary)]">Meet Sage</h2>
      <p className="text-body-large text-[var(--text-secondary)] max-w-lg mb-8">
        Your AI wisdom companion. Ask questions about your journey, uncover patterns, and find clarity.
      </p>
      
      <div className="w-full max-w-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickStartPrompts.map(prompt => (
            <button 
              key={prompt}
              onClick={() => onStartConversation(prompt)}
              className="base-card p-3 text-left text-sm text-[var(--text-secondary)] hover:border-[var(--brand-primary)]"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}