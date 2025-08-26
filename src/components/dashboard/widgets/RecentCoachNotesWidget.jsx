import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Entry } from "@/api/entities";
import { format } from "date-fns";

export default function RecentCoachNotesWidget() {
  const [coachNotes, setCoachNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCoachNotes();
  }, []);

  const loadCoachNotes = async () => {
    try {
      // Get entries that are coach notes or coaching sessions
      const notes = await Entry.filter({
        type: "coaching_session"
      }, "-created_date", 3);
      
      setCoachNotes(notes || []);
    } catch (error) {
      console.error("Error loading coach notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-6">
        <div className="animate-pulse">
          <BookOpen className="w-8 h-8 text-warm-muted mx-auto mb-4" />
        </div>
        <p className="text-warm-muted text-sm">Loading notes...</p>
      </div>
    );
  }

  if (coachNotes.length === 0) {
    return (
      <div className="text-center py-6">
        <BookOpen className="w-12 h-12 text-warm-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-warm-primary mb-2">No notes yet</h3>
        <p className="text-warm-muted text-sm mb-4">
          Your coaching session notes will appear here
        </p>
        <Link to={createPageUrl("NewEntry")}>
          <Button size="sm" className="coach-gradient hover:opacity-90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Note
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {coachNotes.map((note) => (
        <Link key={note.id} to={createPageUrl(`EntryDetails?id=${note.id}`)}>
          <div className="p-3 rounded-lg border warm-border hover:warm-shadow transition-shadow cursor-pointer bg-white/50">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-warm-primary text-sm truncate">{note.title}</h4>
              <Badge variant="outline" className="text-xs warm-border text-warm-secondary">
                {note.type}
              </Badge>
            </div>
            <p className="text-warm-secondary text-xs line-clamp-2 mb-2">
              {note.content.substring(0, 80)}...
            </p>
            <div className="flex items-center justify-between text-xs text-warm-muted">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{format(new Date(note.created_date), "MMM d, yyyy")}</span>
              </div>
              {note.coaching_session_date && (
                <span>Session: {format(new Date(note.coaching_session_date), "MMM d")}</span>
              )}
            </div>
          </div>
        </Link>
      ))}
      
      <div className="pt-2 border-t warm-border">
        <Link to={createPageUrl("Entries")}>
          <Button variant="ghost" size="sm" className="w-full text-warm-secondary hover:text-warm-primary">
            View All Notes
          </Button>
        </Link>
      </div>
    </div>
  );
}