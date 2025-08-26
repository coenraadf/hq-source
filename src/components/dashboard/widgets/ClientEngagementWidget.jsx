import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MessageCircle, BookOpen, Users } from "lucide-react";

export default function ClientEngagementWidget({ clients, clientEntries }) {
  // Calculate engagement metrics
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const recentEntries = clientEntries?.filter(entry => 
    new Date(entry.created_date) >= weekAgo
  ) || [];

  const activeClients = new Set(recentEntries.map(entry => entry.created_by)).size;
  const totalClients = clients?.length || 0;
  const engagementRate = totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0;

  const stats = [
    {
      title: "Active This Week",
      value: activeClients,
      total: totalClients,
      icon: Users,
      color: "text-teal-600"
    },
    {
      title: "New Entries",
      value: recentEntries.length,
      icon: BookOpen,
      color: "text-blue-600"
    },
    {
      title: "Engagement Rate",
      value: `${engagementRate}%`,
      icon: TrendingUp,
      color: engagementRate >= 70 ? "text-green-600" : engagementRate >= 40 ? "text-yellow-600" : "text-red-600"
    }
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center justify-between p-3 rounded-lg border warm-border bg-white/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg coach-soft">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className="font-medium text-warm-primary text-sm">{stat.title}</p>
              {stat.total && (
                <p className="text-xs text-warm-muted">out of {stat.total}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-warm-primary">{stat.value}</p>
          </div>
        </div>
      ))}

      {/* Quick insights */}
      <div className="pt-2 border-t warm-border">
        <div className="flex flex-wrap gap-1">
          {engagementRate >= 70 && (
            <Badge className="bg-green-100 text-green-800 text-xs">High Engagement</Badge>
          )}
          {recentEntries.filter(e => e.is_breakthrough).length > 0 && (
            <Badge className="bg-purple-100 text-purple-800 text-xs">
              {recentEntries.filter(e => e.is_breakthrough).length} Breakthrough{recentEntries.filter(e => e.is_breakthrough).length > 1 ? 's' : ''}
            </Badge>
          )}
          {activeClients === 0 && (
            <Badge className="bg-yellow-100 text-yellow-800 text-xs">Low Activity</Badge>
          )}
        </div>
      </div>
    </div>
  );
}