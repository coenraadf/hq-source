import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb, Send, Loader2, Info } from "lucide-react";
import { InvokeLLM } from "@/api/integrations";
import { Card, CardContent } from '@/components/ui/card';

export default function CommonThreadsWidget({ clients, clientEntries, user }) {
  const [question, setQuestion] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const quickQuestions = [
    "What are the common themes in my clients' breakthroughs this month?",
    "What patterns do you see in client emotions?",
    "Which clients show the most growth?",
    "What are common breakthrough themes?",
    "How has client engagement changed over time?",
  ];

  const handleAskQuestion = async (q) => {
    if (!q.trim()) return;
    setIsLoading(true);
    setError(null);
    setAnalysis("");
    
    try {
      // Basic context from entries - in a real scenario, this would be more sophisticated
      const context = clientEntries
        .slice(0, 15) // Limit context size
        .map(entry => `Client ${entry.created_by} wrote on ${entry.created_date}: "${entry.title} - ${entry.content.substring(0, 100)}..."`)
        .join("\n");
        
      const prompt = `As a master coach analyzer, answer the following question based on the provided client entry snippets. Question: ${q}\n\nContext:\n${context}`;

      const result = await InvokeLLM({ prompt });
      setAnalysis(result);
    } catch (err) {
      console.error("Error analyzing threads:", err);
      setError("Failed to analyze data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-1">
      <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-[var(--brand-primary)]" />
        AI Analytics
      </h3>
      <div className="space-y-3">
        <textarea
          placeholder="Ask a question about your clients' data..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="form-input w-full text-sm"
          rows={3}
        />
        <Button 
          onClick={() => handleAskQuestion(question)} 
          disabled={isLoading || !question.trim()}
          className="btn-primary w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Analyze
            </>
          )}
        </Button>

        <div className="space-y-2">
          <p className="text-xs text-[var(--text-muted)] font-medium">Quick Questions</p>
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => { setQuestion(q); handleAskQuestion(q); }}
              className="w-full text-left p-2 text-sm text-[var(--text-secondary)] bg-[var(--bg-secondary)] rounded-md hover:bg-[rgba(var(--brand-primary-r),var(--brand-primary-g),var(--brand-primary-b),0.1)] transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        {analysis && (
          <Card className="base-card mt-4 brand-gradient-soft">
            <CardContent className="p-4">
              <h4 className="font-semibold text-[var(--brand-primary)] mb-2">Analysis Result:</h4>
              <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">{analysis}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}