import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { User, Entry } from "@/api/entities";

export default function CoachNotesSection() {
  const [coachNotes, setCoachNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCoachNotes();
  }, []);

  const loadCoachNotes = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      if (currentUser.user_type !== 'client') {
        setIsLoading(false);
        return;
      }
      setUser(currentUser);

      // Get notes shared by coach with this client
      const allEntries = await Entry.list("-created_date");
      const sharedNotes = allEntries.filter(entry => 
        entry.recipient_user_id === currentUser.id &&
        (entry.visibility === "shared_with_coach" || entry.visibility === "collaborative") &&
        entry.created_by !== currentUser.email // Not created by the client themselves
      );
      setCoachNotes(sharedNotes);
      
    } catch (error) {
      console.error("Error loading coach notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Notes from Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-stone-200 rounded w-3/4"></div>
            <div className="h-16 bg-stone-200 rounded"></div>
            <div className="h-4 bg-stone-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (coachNotes.length === 0) {
    return null; // Don't show the section if there are no notes
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <FileText className="w-5 h-5" />
            Notes from Your Coach ({coachNotes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {coachNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 border border-indigo-200 rounded-xl bg-white/50"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-stone-800">{note.title}</h3>
                <span className="text-xs text-indigo-700">
                  {format(new Date(note.created_date), "MMM d, h:mm a")}
                </span>
              </div>
              <div className="prose prose-sm max-w-none text-stone-600 leading-relaxed">
                <p>{note.content}</p>
              </div>
              {note.type && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                    {note.type === "coach_message" ? "Message" : "Note"}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}