import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb, RefreshCw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { InvokeLLM } from "@/api/integrations";

export default function AIInsightPromptWidget({ entries, user }) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);

  useEffect(() => {
    // Check if we have a cached prompt from today
    const cached = localStorage.getItem('daily_insight_prompt');
    const cacheDate = localStorage.getItem('daily_insight_prompt_date');
    const today = new Date().toDateString();
    
    if (cached && cacheDate === today) {
      setPrompt(cached);
      setLastGenerated(new Date(cacheDate));
    } else {
      generatePrompt();
    }
  }, []);

  const generatePrompt = async () => {
    setIsLoading(true);
    try {
      // Get recent entries for context
      const recentEntries = entries?.slice(0, 5) || [];
      const entryContext = recentEntries.map(entry => 
        `${entry.type}: ${entry.title} - ${entry.content.substring(0, 100)}...`
      ).join('\n');

      const llmPrompt = `
        Based on the following recent journal entries from a user, generate a thoughtful, engaging reflection prompt that encourages deeper self-discovery and insight. The prompt should be:
        - Personally relevant to their recent thoughts/experiences
        - Open-ended but focused
        - Encouraging and supportive
        - 1-2 sentences maximum
        - Designed to spark meaningful reflection

        Recent entries:
        ${entryContext || "No recent entries available"}

        ${recentEntries.length === 0 ? 
          "Since there are no recent entries, create a general but meaningful reflection prompt that encourages self-exploration." : 
          "Use patterns, themes, or emotions from these entries to craft a personalized prompt."
        }

        Return only the reflection prompt, nothing else.
      `;

      const result = await InvokeLLM({
        prompt: llmPrompt
      });

      const generatedPrompt = result.trim();
      setPrompt(generatedPrompt);
      
      // Cache the prompt for today
      const today = new Date().toDateString();
      localStorage.setItem('daily_insight_prompt', generatedPrompt);
      localStorage.setItem('daily_insight_prompt_date', today);
      setLastGenerated(new Date());
      
    } catch (error) {
      console.error("Error generating insight prompt:", error);
      // Fallback prompts
      const fallbackPrompts = [
        "What pattern in your recent thoughts or actions would you like to understand better?",
        "If you could give your past self from a week ago one piece of advice, what would it be?",
        "What's one assumption about yourself that you're ready to question?",
        "What would someone who knows you well say is your greatest strength right now?",
        "What's something you've been avoiding that might actually be worth exploring?"
      ];
      const randomPrompt = fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];
      setPrompt(randomPrompt);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-6">
        <div className="animate-spin mx-auto mb-4">
          <Lightbulb className="w-8 h-8 text-amber-500" />
        </div>
        <p className="text-warm-muted text-sm">Generating your reflection prompt...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-warm-primary text-sm leading-relaxed">
            {prompt || "Reflect on a moment today when you felt most like yourself. What were you doing, and what does that tell you?"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t warm-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={generatePrompt}
          disabled={isLoading}
          className="text-warm-muted hover:text-warm-primary"
        >
          <RefreshCw className="w-3 h-3 mr-1" />
          New Prompt
        </Button>
        
        <Link to={createPageUrl("NewEntry")}>
          <Button size="sm" className="compass-gradient hover:opacity-90 text-white">
            <span className="mr-1">Reflect</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>

      {lastGenerated && (
        <p className="text-xs text-warm-muted text-center">
          Generated {lastGenerated.toLocaleDateString()}
        </p>
      )}
    </div>
  );
}