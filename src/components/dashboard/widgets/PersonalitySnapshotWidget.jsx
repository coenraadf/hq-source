import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Brain, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { PersonalityTest } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";

export default function PersonalitySnapshotWidget({ user }) {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [personalityTests, setPersonalityTests] = useState([]);

  useEffect(() => {
    loadPersonalityData();
  }, []);

  const loadPersonalityData = async () => {
    try {
      const tests = await PersonalityTest.list();
      setPersonalityTests(tests);
      
      if (tests.length > 0) {
        // Check if we have a cached summary
        const cached = localStorage.getItem('personality_summary');
        const cacheDate = localStorage.getItem('personality_summary_date');
        const daysSinceCache = cacheDate ? 
          (Date.now() - new Date(cacheDate).getTime()) / (1000 * 60 * 60 * 24) : 999;
        
        if (cached && daysSinceCache < 7) {
          setSummary(JSON.parse(cached));
        } else {
          generateSummary(tests);
        }
      }
    } catch (error) {
      console.error("Error loading personality data:", error);
    }
  };

  const generateSummary = async (tests) => {
    setIsLoading(true);
    try {
      const testContext = tests.map(test => 
        `${test.test_name} (${test.test_type}): ${JSON.stringify(test.results)}`
      ).join('\n');

      const result = await InvokeLLM({
        prompt: `
          Based on the following personality test results, create a concise, insightful summary of this person's key traits and characteristics. Focus on the most meaningful insights that would be valuable for self-understanding.

          Personality test data:
          ${testContext}

          Provide a summary that includes:
          1. A brief, engaging one-sentence personality snapshot
          2. 2-3 key strengths or traits
          3. 1-2 areas for potential growth or development
          
          Keep it positive, actionable, and under 200 words total.
        `,
        response_json_schema: {
          type: "object",
          properties: {
            snapshot: { type: "string", description: "One-sentence personality summary" },
            key_traits: { type: "array", items: { type: "string" }, description: "2-3 key strengths or traits" },
            growth_areas: { type: "array", items: { type: "string" }, description: "1-2 areas for growth" },
            archetype: { type: "string", description: "A simple archetype or role that captures their essence" }
          },
          required: ["snapshot", "key_traits"]
        }
      });

      setSummary(result);
      
      // Cache the summary
      localStorage.setItem('personality_summary', JSON.stringify(result));
      localStorage.setItem('personality_summary_date', new Date().toISOString());
      
    } catch (error) {
      console.error("Error generating personality summary:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (personalityTests.length === 0) {
    return (
      <div className="text-center py-6">
        <Brain className="w-12 h-12 text-warm-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-warm-primary mb-2">No personality data yet</h3>
        <p className="text-warm-muted text-sm mb-4">
          Take personality tests to unlock AI insights about yourself
        </p>
        <Link to={createPageUrl("PersonalityTests")}>
          <Button size="sm" className="compass-gradient hover:opacity-90 text-white">
            <Brain className="w-4 h-4 mr-2" />
            Take Tests
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-6">
        <div className="animate-pulse">
          <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-4" />
        </div>
        <p className="text-warm-muted text-sm">Generating your personality insights...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-6">
        <Button onClick={() => generateSummary(personalityTests)} size="sm">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate Insights
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Archetype */}
      {summary.archetype && (
        <div className="text-center">
          <Badge className="compass-gradient text-white mb-2">
            {summary.archetype}
          </Badge>
        </div>
      )}

      {/* Snapshot */}
      <div className="text-center">
        <p className="text-warm-primary text-sm leading-relaxed italic">
          "{summary.snapshot}"
        </p>
      </div>

      {/* Key Traits */}
      {summary.key_traits && summary.key_traits.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-warm-secondary mb-2 uppercase tracking-wide">
            Key Strengths
          </h5>
          <div className="flex flex-wrap gap-1">
            {summary.key_traits.map((trait, index) => (
              <Badge key={index} variant="outline" className="text-xs warm-border text-warm-secondary">
                {trait}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Growth Areas */}
      {summary.growth_areas && summary.growth_areas.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-warm-secondary mb-2 uppercase tracking-wide">
            Growth Areas
          </h5>
          <div className="space-y-1">
            {summary.growth_areas.map((area, index) => (
              <p key={index} className="text-xs text-warm-muted">• {area}</p>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-2 border-t warm-border">
        <div className="grid grid-cols-2 gap-2">
          <Link to={createPageUrl("PersonalityTests")}>
            <Button variant="outline" size="sm" className="w-full text-xs warm-border">
              <Brain className="w-3 h-3 mr-1" />
              View Tests
            </Button>
          </Link>
          <Button 
            onClick={() => generateSummary(personalityTests)}
            variant="outline" 
            size="sm" 
            className="w-full text-xs warm-border"
            disabled={isLoading}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-warm-muted">
          Based on {personalityTests.length} test{personalityTests.length > 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}