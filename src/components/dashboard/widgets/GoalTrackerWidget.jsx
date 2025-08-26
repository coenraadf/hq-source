import React, { useState, useEffect } from "react";
import { Goal, ProgressEntry, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  Calendar,
  CheckCircle,
  Clock,
  Flag,
  TrendingUp,
  Circle
} from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";

export default function GoalTrackerWidget({ goalId, isShared = false, canEdit = true }) {
  const [goal, setGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadGoalData();
    loadUser();
  }, [goalId]);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadGoalData = async () => {
    if (!goalId) return;
    
    try {
      setIsLoading(true);
      const goalData = await Goal.get(goalId);
      setGoal(goalData);
    } catch (error) {
      console.error("Error loading goal data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateGoalProgress = async (newProgress) => {
    if (!goal || !canEdit) return;
    
    try {
      await Goal.update(goal.id, { progress_percentage: newProgress });
      setGoal({ ...goal, progress_percentage: newProgress });
    } catch (error) {
      console.error("Error updating goal progress:", error);
    }
  };

  const toggleMilestone = async (milestoneIndex) => {
    if (!goal || !canEdit) return;
    
    try {
      const updatedMilestones = [...(goal.milestones || [])];
      updatedMilestones[milestoneIndex] = {
        ...updatedMilestones[milestoneIndex],
        completed: !updatedMilestones[milestoneIndex].completed,
        completed_date: !updatedMilestones[milestoneIndex].completed 
          ? format(new Date(), 'yyyy-MM-dd') 
          : null
      };
      
      await Goal.update(goal.id, { milestones: updatedMilestones });
      setGoal({ ...goal, milestones: updatedMilestones });
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  const getDaysUntilTarget = () => {
    if (!goal?.target_date) return null;
    const targetDate = parseISO(goal.target_date);
    return differenceInDays(targetDate, new Date());
  };

  const getStatusColor = () => {
    const progress = goal?.progress_percentage || 0;
    const daysLeft = getDaysUntilTarget();
    
    if (progress >= 100) return "text-green-600";
    if (daysLeft !== null && daysLeft < 7) return "text-red-600";
    if (progress >= 75) return "text-orange-600";
    return "text-blue-600";
  };

  const getStatusIcon = () => {
    const progress = goal?.progress_percentage || 0;
    const daysLeft = getDaysUntilTarget();
    
    if (progress >= 100) return CheckCircle;
    if (daysLeft !== null && daysLeft < 7) return Clock;
    return Target;
  };

  if (isLoading) {
    return (
      <Card className="paper-card warm-border">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-stone-200 rounded w-3/4"></div>
            <div className="h-20 bg-stone-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!goal) {
    return (
      <Card className="paper-card warm-border">
        <CardContent className="p-6">
          <p className="text-warm-muted">Goal not found</p>
        </CardContent>
      </Card>
    );
  }

  const StatusIcon = getStatusIcon();
  const daysLeft = getDaysUntilTarget();
  const completedMilestones = (goal.milestones || []).filter(m => m.completed).length;
  const totalMilestones = (goal.milestones || []).length;

  return (
    <Card className="paper-card warm-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-warm-primary text-lg pr-4">{goal.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${getStatusColor()} border-current`}
              >
                {goal.status}
              </Badge>
              {isShared && (
                <Badge variant="outline" className="text-xs">
                  Shared
                </Badge>
              )}
            </div>
          </div>
          <StatusIcon className={`w-6 h-6 ${getStatusColor()}`} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-warm-secondary">Progress</span>
            <span className="text-sm text-warm-muted">
              {goal.progress_percentage || 0}%
            </span>
          </div>
          <Progress value={goal.progress_percentage || 0} className="h-2" />
          
          {canEdit && (
            <div className="flex gap-1 mt-2">
              {[25, 50, 75, 100].map(percent => (
                <Button
                  key={percent}
                  variant="outline"
                  size="sm"
                  onClick={() => updateGoalProgress(percent)}
                  className="text-xs px-2 py-1 h-auto"
                >
                  {percent}%
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Target Date & Days Left */}
        {goal.target_date && (
          <div className="flex items-center justify-between bg-stone-50 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-warm-muted" />
              <span className="text-sm text-warm-secondary">
                Target: {format(parseISO(goal.target_date), 'MMM dd, yyyy')}
              </span>
            </div>
            {daysLeft !== null && (
              <Badge 
                variant={daysLeft < 7 ? "destructive" : daysLeft < 30 ? "secondary" : "outline"}
                className="text-xs"
              >
                {daysLeft > 0 ? `${daysLeft} days left` : 
                 daysLeft === 0 ? 'Due today' : 
                 `${Math.abs(daysLeft)} days overdue`}
              </Badge>
            )}
          </div>
        )}

        {/* Milestones */}
        {totalMilestones > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-warm-secondary">Milestones</span>
              <span className="text-xs text-warm-muted">
                {completedMilestones} / {totalMilestones} completed
              </span>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {(goal.milestones || []).slice(0, 4).map((milestone, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded-lg border ${
                    milestone.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMilestone(index)}
                    disabled={!canEdit}
                    className="p-0 h-auto min-w-0"
                  >
                    {milestone.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-stone-400" />
                    )}
                  </Button>
                  <span 
                    className={`text-sm flex-1 ${
                      milestone.completed ? 'line-through text-warm-muted' : 'text-warm-secondary'
                    }`}
                  >
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>
            
            {totalMilestones > 4 && (
              <p className="text-xs text-warm-muted text-center">
                +{totalMilestones - 4} more milestones
              </p>
            )}
          </div>
        )}

        {/* Metrics */}
        {goal.metrics && goal.metrics.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-warm-secondary">Metrics</span>
            <div className="space-y-2">
              {goal.metrics.slice(0, 2).map((metric, index) => {
                const percentage = metric.target_value > 0 
                  ? Math.min((metric.current_value / metric.target_value) * 100, 100)
                  : 0;
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-warm-muted">{metric.name}</span>
                      <span className="text-xs text-warm-muted">
                        {metric.current_value} / {metric.target_value} {metric.unit}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-1" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Description */}
        {goal.description && (
          <div className="pt-2 border-t border-stone-100">
            <p className="text-xs text-warm-muted line-clamp-2">
              {goal.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}