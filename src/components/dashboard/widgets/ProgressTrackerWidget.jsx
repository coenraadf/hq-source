import React, { useState, useEffect } from "react";
import { ProgressTracker, ProgressEntry, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Target,
  Plus,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ProgressTrackerWidget({ trackerId, isShared = false, canEdit = true }) {
  const [tracker, setTracker] = useState(null);
  const [entries, setEntries] = useState([]);
  const [todayEntry, setTodayEntry] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadTrackerData();
    loadUser();
  }, [trackerId]);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const loadTrackerData = async () => {
    if (!trackerId) return;
    
    try {
      setIsLoading(true);
      
      // Load tracker details
      const trackerData = await ProgressTracker.get(trackerId);
      setTracker(trackerData);
      
      // Load recent entries
      const recentEntries = await ProgressEntry.filter(
        { tracker_id: trackerId },
        "-date",
        30
      );
      setEntries(recentEntries);
      
      // Check if there's an entry for today
      const today = format(new Date(), 'yyyy-MM-dd');
      const todayEntryData = recentEntries.find(entry => entry.date === today);
      setTodayEntry(todayEntryData);
      
    } catch (error) {
      console.error("Error loading tracker data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!newValue.trim() || !tracker) return;
    
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const value = parseFloat(newValue);
      
      if (todayEntry) {
        // Update existing entry
        await ProgressEntry.update(todayEntry.id, { value, notes: "" });
      } else {
        // Create new entry
        await ProgressEntry.create({
          tracker_id: trackerId,
          date: today,
          value: value,
          notes: ""
        });
      }
      
      setNewValue("");
      loadTrackerData(); // Reload data
    } catch (error) {
      console.error("Error saving progress entry:", error);
    }
  };

  const calculateWeeklyProgress = () => {
    const startWeek = startOfWeek(new Date());
    const endWeek = endOfWeek(new Date());
    
    const weekEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startWeek && entryDate <= endWeek;
    });
    
    const totalValue = weekEntries.reduce((sum, entry) => sum + entry.value, 0);
    const targetValue = tracker?.target_value || 1;
    const daysInPeriod = tracker?.tracking_frequency === 'daily' ? 7 : 1;
    const weeklyTarget = targetValue * daysInPeriod;
    
    return {
      current: totalValue,
      target: weeklyTarget,
      percentage: Math.min((totalValue / weeklyTarget) * 100, 100)
    };
  };

  const getChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateString = format(date, 'yyyy-MM-dd');
      const entry = entries.find(e => e.date === dateString);
      
      return {
        date: format(date, 'MMM dd'),
        value: entry?.value || 0,
        target: tracker?.target_value || 0
      };
    });
    
    return last7Days;
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

  if (!tracker) {
    return (
      <Card className="paper-card warm-border">
        <CardContent className="p-6">
          <p className="text-warm-muted">Tracker not found</p>
        </CardContent>
      </Card>
    );
  }

  const weeklyProgress = calculateWeeklyProgress();
  const chartData = getChartData();
  const todayTarget = tracker.target_value || 1;
  const todayValue = todayEntry?.value || 0;
  const todayPercentage = Math.min((todayValue / todayTarget) * 100, 100);

  return (
    <Card className="paper-card warm-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-warm-primary text-lg">{tracker.title}</CardTitle>
            <p className="text-sm text-warm-muted mt-1">
              Target: {tracker.target_value} {tracker.metric_unit} {tracker.tracking_frequency}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isShared && (
              <Badge variant="outline" className="text-xs">
                Shared
              </Badge>
            )}
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Today's Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-warm-secondary">Today's Progress</span>
            <span className="text-sm text-warm-muted">
              {todayValue} / {todayTarget} {tracker.metric_unit}
            </span>
          </div>
          <Progress value={todayPercentage} className="h-2" />
          
          {canEdit && (
            <div className="flex gap-2 mt-3">
              <Input
                type="number"
                placeholder={`Enter ${tracker.metric_unit}`}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="flex-1 text-sm"
              />
              <Button onClick={handleAddEntry} size="sm" className="compass-gradient text-white">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Weekly Summary */}
        <div className="bg-stone-50 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-warm-secondary">This Week</span>
            <div className="flex items-center gap-1">
              {weeklyProgress.percentage >= 100 ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : weeklyProgress.percentage >= 75 ? (
                <Target className="w-4 h-4 text-orange-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <span className="text-sm font-medium">
                {Math.round(weeklyProgress.percentage)}%
              </span>
            </div>
          </div>
          <Progress value={weeklyProgress.percentage} className="h-2" />
          <p className="text-xs text-warm-muted">
            {weeklyProgress.current} / {weeklyProgress.target} {tracker.metric_unit}
          </p>
        </div>

        {/* Mini Chart */}
        {chartData.length > 0 && (
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10 }}
                  stroke="#64748b"
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fefefe',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f39576" 
                  strokeWidth={2}
                  dot={{ fill: '#f39576', strokeWidth: 2, r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#94a3b8" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Streak */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-warm-muted">Recent entries:</span>
          <div className="flex gap-1">
            {Array.from({ length: 7 }, (_, i) => {
              const date = subDays(new Date(), 6 - i);
              const dateString = format(date, 'yyyy-MM-dd');
              const hasEntry = entries.some(e => e.date === dateString);
              
              return (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    hasEntry ? 'bg-orange-500' : 'bg-stone-200'
                  }`}
                  title={format(date, 'MMM dd')}
                />
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}