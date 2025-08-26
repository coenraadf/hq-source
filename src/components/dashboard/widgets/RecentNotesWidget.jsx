import React from 'react';
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Sparkles, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function RecentNotesWidget({ entries }) {
  const recentEntries = entries?.slice(0, 3) || [];

  if (recentEntries.length === 0) {
    return (
      <div className="text-center py-6">
        <BookOpen className="w-10 h-10 text-warm-muted mx-auto mb-3" />
        <h3 className="text-base font-medium text-warm-secondary mb-2 break-words">No entries yet</h3>
        <p className="text-warm-muted mb-4 text-xs break-words">Start your journey by creating your first entry</p>
        <Link to={createPageUrl("NewEntry")}>
          <Button size="sm" className="compass-gradient hover:opacity-90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Entry
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentEntries.map((entry) => (
        <Link key={entry.id} to={createPageUrl(`EntryDetails?id=${entry.id}`)}>
          <div className="p-3 rounded-lg border warm-border hover:warm-shadow transition-shadow cursor-pointer bg-white/50">
            <div className="flex items-start justify-between mb-2 gap-2">
              <h3 className="font-medium text-warm-primary text-sm line-clamp-1 min-w-0 break-words">{entry.title}</h3>
              {entry.is_breakthrough && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 text-xs flex-shrink-0">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Breakthrough
                </Badge>
              )}
            </div>
            <p className="text-warm-secondary text-xs line-clamp-2 mb-2 break-words">
              {entry.content.substring(0, 120)}...
            </p>
            <div className="flex items-center justify-between text-xs text-warm-muted gap-2">
              <Badge variant="outline" className="text-xs warm-border text-warm-secondary flex-shrink-0">
                {entry.type}
              </Badge>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Calendar className="w-3 h-3" />
                <span className="break-words">{format(new Date(entry.created_date), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
      
      <div className="pt-2 border-t warm-border">
        <Link to={createPageUrl("Entries")}>
          <Button variant="ghost" size="sm" className="w-full text-warm-secondary hover:text-warm-primary text-xs">
            View All Entries
          </Button>
        </Link>
      </div>
    </div>
  );
}