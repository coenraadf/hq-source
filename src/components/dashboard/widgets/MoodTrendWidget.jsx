import React from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MoodTrendWidget({ entries }) {
  // Process mood data from entries
  const moodEntries = entries?.filter(entry => entry.mood) || [];
  const last7Days = moodEntries
    .filter(entry => {
      const entryDate = new Date(entry.created_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    })
    .slice(0, 7);

  // Mood scoring for trend calculation
  const moodScores = {
    "excited": 9,
    "confident": 8,
    "grateful": 8,
    "peaceful": 7,
    "curious": 6,
    "contemplative": 5,
    "anxious": 3,
    "frustrated": 2
  };

  if (last7Days.length === 0) {
    return (
      <div className="text-center py-6">
        <TrendingUp className="w-12 h-12 text-warm-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-warm-primary mb-2">No mood data yet</h3>
        <p className="text-warm-muted text-sm">
          Start tracking your mood in your journal entries
        </p>
      </div>
    );
  }

  // Calculate trend
  const scores = last7Days.map(entry => moodScores[entry.mood] || 5);
  const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const firstHalf = scores.slice(0, Math.ceil(scores.length / 2));
  const secondHalf = scores.slice(Math.ceil(scores.length / 2));
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const trend = secondAvg > firstAvg ? "up" : secondAvg < firstAvg ? "down" : "stable";
  const trendDiff = Math.abs(secondAvg - firstAvg);

  // Most recent mood
  const latestMood = last7Days[0]?.mood;
  const latestMoodCapitalized = latestMood?.charAt(0).toUpperCase() + latestMood?.slice(1);

  // Mood frequency
  const moodCounts = {};
  last7Days.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });
  const dominantMood = Object.entries(moodCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-stone-500" />;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-stone-500";
  };

  return (
    <div className="space-y-4">
      {/* Current Mood */}
      <div className="text-center">
        <h4 className="text-lg font-semibold text-warm-primary mb-1">
          {latestMoodCapitalized || "No recent mood"}
        </h4>
        <p className="text-xs text-warm-muted">Your latest recorded mood</p>
      </div>

      {/* Trend Indicator */}
      <div className="flex items-center justify-center gap-2">
        {getTrendIcon()}
        <span className={`text-sm font-medium ${getTrendColor()}`}>
          {trend === "up" && "Trending upward"}
          {trend === "down" && "Trending downward"}
          {trend === "stable" && "Stable mood"}
        </span>
      </div>

      {/* Simple Mood Visualization */}
      <div className="flex justify-center gap-1">
        {scores.slice(-5).map((score, index) => (
          <div
            key={index}
            className={`w-2 rounded-full ${
              score >= 7 ? 'bg-green-400 h-6' :
              score >= 5 ? 'bg-yellow-400 h-4' :
              'bg-red-400 h-3'
            }`}
            title={`Score: ${score}`}
          />
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div>
          <p className="text-xs text-warm-muted">Avg Score</p>
          <p className="font-semibold text-warm-primary">{averageScore.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-xs text-warm-muted">Entries</p>
          <p className="font-semibold text-warm-primary">{last7Days.length}</p>
        </div>
      </div>

      {dominantMood && (
        <div className="pt-2 border-t warm-border text-center">
          <Badge variant="outline" className="text-xs warm-border text-warm-secondary">
            Most frequent: {dominantMood}
          </Badge>
        </div>
      )}
    </div>
  );
}