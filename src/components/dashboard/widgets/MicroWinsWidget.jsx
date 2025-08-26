import React, { useState, useEffect } from "react";
import { Entry, Goal, ProgressEntry } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Trophy,
  Target,
  TrendingUp,
  Star,
  Calendar,
  ChevronRight
} from "lucide-react";
import { format, subDays, isToday, isYesterday } from "date-fns";

export default function MicroWinsWidget() {
  const [wins, setWins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMicroWins();
  }, []);

  const loadMicroWins = async () => {
    try {
      setIsLoading(true);
      
      // Load breakthrough entries
      const breakthroughEntries = await Entry.filter(
        { is_breakthrough: true },
        "-created_date",
        10
      );
      
      // Load completed goals from last 30 days
      const recentGoals = await Goal.filter(
        { status: "completed" },
        "-updated_date",
        5
      );
      
      // Load recent high-value progress entries
      const recentProgress = await ProgressEntry.list("-created_date", 20);
      const significantProgress = recentProgress.filter(entry => 
        entry.is_milestone || entry.value >= 100 // Assuming 100+ is significant
      );
      
      // Combine and format all wins
      const allWins = [];
      
      // Add breakthrough entries
      breakthroughEntries.forEach(entry => {
        allWins.push({
          id: `entry-${entry.id}`,
          type: 'breakthrough',
          title: entry.title,
          description: entry.content?.substring(0, 100) + '...',
          date: entry.created_date,
          icon: Sparkles,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        });
      });
      
      // Add completed goals
      recentGoals.forEach(goal => {
        allWins.push({
          id: `goal-${goal.id}`,
          type: 'goal_completed',
          title: `Completed: ${goal.title}`,
          description: goal.description || 'Goal achieved successfully!',
          date: goal.updated_date,
          icon: Trophy,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        });
      });
      
      // Add significant progress milestones
      significantProgress.forEach(progress => {
        allWins.push({
          id: `progress-${progress.id}`,
          type: 'milestone',
          title: progress.is_milestone ? 'Milestone Reached!' : 'Great Progress!',
          description: `Achieved ${progress.value}${progress.notes ? ` - ${progress.notes}` : ''}`,
          date: progress.created_date,
          icon: Target,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        });
      });
      
      // Sort by date and take most recent
      const sortedWins = allWins
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 8);
      
      setWins(sortedWins);
    } catch (error) {
      console.error("Error loading micro wins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDateLabel = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM dd');
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'breakthrough': return 'Breakthrough';
      case 'goal_completed': return 'Goal Completed';
      case 'milestone': return 'Milestone';
      default: return 'Win';
    }
  };

  if (isLoading) {
    return (
      <Card className="paper-card warm-border">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-stone-200 rounded w-3/4"></div>
            <div className="space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-16 bg-stone-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="paper-card warm-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-warm-primary text-lg flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Recent Wins
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {wins.length} wins
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {wins.length === 0 ? (
          <div className="text-center py-8">
            <Star className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <p className="text-warm-muted text-sm">No recent wins yet</p>
            <p className="text-warm-muted text-xs mt-1">
              Breakthroughs and completed goals will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {wins.map((win) => {
              const IconComponent = win.icon;
              
              return (
                <div
                  key={win.id}
                  className={`p-3 rounded-lg border ${win.bgColor} ${win.borderColor} transition-all duration-200 hover:shadow-sm`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-lg bg-white ${win.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-warm-primary truncate">
                          {win.title}
                        </h4>
                        <span className="text-xs text-warm-muted ml-2">
                          {getDateLabel(win.date)}
                        </span>
                      </div>
                      
                      <p className="text-xs text-warm-muted line-clamp-2 mb-2">
                        {win.description}
                      </p>
                      
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${win.color} border-current`}
                      >
                        {getTypeLabel(win.type)}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {wins.length >= 8 && (
              <Button variant="ghost" size="sm" className="w-full mt-3">
                <span className="text-xs">View All Wins</span>
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}