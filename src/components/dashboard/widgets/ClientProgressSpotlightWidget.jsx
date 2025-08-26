import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

export default function ClientProgressSpotlightWidget({ clientEntries, clients }) {
  // Find recent breakthroughs
  const recentBreakthroughs = clientEntries?.filter(entry => 
    entry.is_breakthrough && 
    new Date(entry.created_date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).slice(0, 2) || [];

  const getClientDisplayName = (createdBy) => {
    const client = clients?.find(c => c.email === createdBy);
    return client?.preferred_app_name || client?.full_name || createdBy.split('@')[0];
  };

  if (recentBreakthroughs.length === 0) {
    return (
      <div className="text-center py-6">
        <Sparkles className="w-12 h-12 text-warm-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-warm-primary mb-2">No recent breakthroughs</h3>
        <p className="text-warm-muted text-sm mb-4">
          Client breakthroughs will appear here when they happen
        </p>
        <Link to={createPageUrl("CoachBreakthroughs")}>
          <Button size="sm" variant="outline" className="warm-border">
            View All Breakthroughs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentBreakthroughs.map((breakthrough) => (
        <div key={breakthrough.id} className="p-4 rounded-lg border warm-border bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-purple-900">Breakthrough!</h4>
            </div>
            <Badge variant="outline" className="text-xs border-purple-200 text-purple-700">
              {format(new Date(breakthrough.created_date), "MMM d")}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <h5 className="font-medium text-purple-800 text-sm">
              {breakthrough.title}
            </h5>
            
            <p className="text-purple-700 text-xs line-clamp-2">
              {breakthrough.content.substring(0, 100)}...
            </p>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-purple-600">
                by {getClientDisplayName(breakthrough.created_by)}
              </div>
              <Link to={createPageUrl(`EntryDetails?id=${breakthrough.id}`)}>
                <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700 h-6 px-2">
                  <span className="text-xs mr-1">View</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="pt-2 border-t warm-border">
        <Link to={createPageUrl("CoachBreakthroughs")}>
          <Button variant="ghost" size="sm" className="w-full text-warm-secondary hover:text-warm-primary">
            View All Breakthroughs
          </Button>
        </Link>
      </div>
    </div>
  );
}