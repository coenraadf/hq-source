import React, { useState, useEffect } from "react";
import { Goal, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Plus,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function MyGoalsWidget() {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadGoals();
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadGoals = async () => {
    try {
      setIsLoading(true);
      const activeGoals = await Goal.filter(
        { status: "active" },
        "-created_date",
        6
      );
      setGoals(activeGoals);
    } catch (error) {
      console.error("Error loading goals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoalProgress = async (goalId, newProgress) => {
    try {
      await Goal.update(goalId, { progress_percentage: newProgress });
      loadGoals();
    } catch (error) {
      console.error("Error updating goal progress:", error);
    }
  };

  const getDaysUntilTarget = (targetDate) => {
    if (!targetDate) return null;
    return differenceInDays(parseISO(targetDate), new Date());
  };

  const getGoalStatusInfo = (goal) => {
    const progress = goal.progress_percentage || 0;
    const daysLeft = getDaysUntilTarget(goal.target_date);
    
    if (progress >= 100) {
      return {
        status: 'completed',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: CheckCircle
      };
    }
    
    if (daysLeft !== null && daysLeft < 7) {
      return {
        status: 'urgent',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: AlertTriangle
      };
    }
    
    if (progress >= 75) {
      return {
        status: 'on_track',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        icon: TrendingUp
      };
    }
    
    return {
      status: 'active',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: Target
    };
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4 h-full">
        <div className="h-4 bg-stone-200 rounded w-3/4"></div>
        <div className="space-y-3 flex-1">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-16 bg-stone-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const priorityGoals = goals
    .sort((a, b) => {
      const aDays = getDaysUntilTarget(a.target_date);
      const bDays = getDaysUntilTarget(b.target_date);
      const aProgress = a.progress_percentage || 0;
      const bProgress = b.progress_percentage || 0;
      
      if (aDays !== null && aDays < 7 && (bDays === null || bDays >= 7)) return -1;
      if (bDays !== null && bDays < 7 && (aDays === null || aDays >= 7)) return 1;
      
      if (aProgress !== bProgress) return aProgress - bProgress;
      
      if (aDays !== null && bDays !== null) return aDays - bDays;
      
      return 0;
    })
    .slice(0, 4);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <h3 className="text-base font-semibold text-warm-primary">Active Goals</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {goals.length} active
            </Badge>
            <Link to={createPageUrl("Goals")}>
              <Button variant="ghost" size="sm" className="p-1">
                <Plus className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {goals.length === 0 ? (
        <div className="text-center py-6 flex-1 flex flex-col justify-center">
          <Target className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-warm-muted text-sm mb-2">No active goals</p>
          <p className="text-warm-muted text-xs mb-4 break-words">
            Set your first goal to start tracking progress
          </p>
          <Link to={createPageUrl("Goals")}>
            <Button size="sm" className="compass-gradient text-white">
              <Plus className="w-4 h-4 mr-1" />
              Create Goal
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto">
          {priorityGoals.map((goal) => {
            const statusInfo = getGoalStatusInfo(goal);
            const StatusIcon = statusInfo.icon;
            const daysLeft = getDaysUntilTarget(goal.target_date);
            const completedMilestones = (goal.milestones || []).filter(m => m.completed).length;
            const totalMilestones = (goal.milestones || []).length;
            
            return (
              <div
                key={goal.id}
                className={`p-3 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor} flex-shrink-0`}
              >
                <div className="flex items-start gap-3">
                  <StatusIcon className={`w-4 h-4 ${statusInfo.color} mt-0.5 flex-shrink-0`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-warm-primary truncate pr-2 min-w-0 break-words">
                        {goal.title}
                      </h4>
                      {daysLeft !== null && (
                        <Badge 
                          variant={daysLeft < 7 ? "destructive" : "outline"}
                          className="text-xs ml-2 flex-shrink-0"
                        >
                          {daysLeft > 0 ? `${daysLeft}d` : 
                           daysLeft === 0 ? 'Due' : 
                           `${Math.abs(daysLeft)}d over`}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-warm-muted">Progress</span>
                        <span className="text-xs text-warm-muted">
                          {goal.progress_percentage || 0}%
                        </span>
                      </div>
                      <Progress value={goal.progress_percentage || 0} className="h-1.5" />
                      
                      <div className="flex gap-1">
                        {[25, 50, 75, 100].map(percent => (
                          <Button
                            key={percent}
                            variant="ghost"
                            size="sm"
                            onClick={() => updateGoalProgress(goal.id, percent)}
                            className="text-[0.6rem] px-1 py-0.5 h-5 hover:bg-white/50 min-w-0"
                            disabled={goal.progress_percentage >= percent}
                          >
                            {percent}%
                          </Button>
                        ))}
                      </div>
                      
                      {totalMilestones > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-warm-muted">Milestones</span>
                          <span className="text-xs text-warm-secondary">
                            {completedMilestones}/{totalMilestones}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {goals.length > 4 && (
            <Link to={createPageUrl("Goals")} className="block mt-3 flex-shrink-0">
              <Button variant="ghost" size="sm" className="w-full">
                <span className="text-xs">View All Goals ({goals.length})</span>
                <Target className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}