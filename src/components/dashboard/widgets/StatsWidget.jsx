import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  BookOpen,
  Sparkles,
  TrendingUp,
  Target,
  Calendar
} from "lucide-react";
import { format, subDays, startOfWeek } from "date-fns";

export default function StatsWidget({ entries = [], conversations = [], user }) {
  const isCoach = user?.user_type === 'coach';
  
  // Calculate various statistics
  const thisWeek = entries.filter(entry => 
    new Date(entry.created_date) >= startOfWeek(new Date())
  ).length;
  
  const breakthroughs = entries.filter(entry => entry.is_breakthrough).length;
  
  const recentBreakthroughs = entries.filter(entry => 
    entry.is_breakthrough && 
    new Date(entry.created_date) >= subDays(new Date(), 30)
  ).length;
  
  const sharedEntries = entries.filter(entry => 
    entry.visibility === 'shared_with_coach' || entry.visibility === 'collaborative'
  ).length;
  
  const stats = isCoach ? [
    {
      title: "Total Entries",
      value: entries.length,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Shared Entries",
      value: sharedEntries,
      icon: TrendingUp,
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      title: "Total Breakthroughs",
      value: breakthroughs,
      icon: Sparkles,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Recent Breakthroughs",
      value: recentBreakthroughs,
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      subtitle: "Last 30 days"
    }
  ] : [
    {
      title: "Total Entries",
      value: entries.length,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "This Week",
      value: thisWeek,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Breakthroughs",
      value: breakthroughs,
      icon: Sparkles,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Conversations",
      value: conversations.length,
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-2 gap-3 flex-1">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          
          return (
            <div
              key={index}
              className={`p-3 rounded-xl ${stat.bgColor} border border-opacity-20 flex flex-col`}
            >
              <div className="flex items-center justify-between mb-2">
                <IconComponent className={`w-4 h-4 ${stat.color} flex-shrink-0`} />
                <span className="text-lg font-bold text-warm-primary">
                  {stat.value}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-warm-secondary break-words leading-tight">
                  {stat.title}
                </p>
                {stat.subtitle && (
                  <p className="text-xs text-warm-muted mt-1 break-words leading-tight">
                    {stat.subtitle}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Progress Indicator */}
      <div className="mt-4 pt-4 border-t border-stone-100 flex-shrink-0">
        <div className="flex items-center justify-between text-sm">
          <span className="text-warm-muted text-xs break-words">
            {isCoach ? 'Client engagement this week' : 'Weekly progress'}
          </span>
          <span className="font-medium text-warm-primary text-xs">
            {thisWeek > 0 ? 'Active' : 'Quiet week'}
          </span>
        </div>
        <div className="mt-2 h-2 bg-stone-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((thisWeek / 7) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}