import React, { useState, useEffect } from "react";
import { Entry, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Eye,
  Lock,
  Users,
  Sparkles,
  Edit3,
  Trash2,
  FileText,
  BookOpen,
  Lightbulb,
  Heart,
  MessageSquare,
  Brain,
  MessageCircle
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const typeIcons = {
  note: FileText,
  journal: BookOpen,
  insight: Lightbulb,
  breakthrough: Sparkles,
  reflection: Heart,
  coaching_session: MessageSquare,
  personality_test: Brain,
  coach_message: MessageCircle,
};

const typeColors = {
  note: "bg-blue-100 text-blue-800 border-blue-200",
  journal: "bg-purple-100 text-purple-800 border-purple-200",
  insight: "bg-amber-100 text-amber-800 border-amber-200",
  breakthrough: "bg-orange-100 text-orange-800 border-orange-200",
  reflection: "bg-green-100 text-green-800 border-green-200",
  coaching_session: "bg-indigo-100 text-indigo-800 border-indigo-200",
  personality_test: "bg-pink-100 text-pink-800 border-pink-200",
  coach_message: "bg-blue-100 text-blue-800 border-blue-200",
};

const visibilityIcons = {
  private: Lock,
  shared_with_coach: Users,
  collaborative: Eye,
};

const moodColors = {
  excited: "bg-yellow-100 text-yellow-800",
  contemplative: "bg-blue-100 text-blue-800",
  frustrated: "bg-red-100 text-red-800",
  peaceful: "bg-green-100 text-green-800",
  anxious: "bg-orange-100 text-orange-800",
  confident: "bg-purple-100 text-purple-800",
  curious: "bg-indigo-100 text-indigo-800",
  grateful: "bg-pink-100 text-pink-800",
};

export default function EntryDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [entry, setEntry] = useState(null);
  const [author, setAuthor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntry();
  }, [location]);

  const loadEntry = async () => {
    const params = new URLSearchParams(location.search);
    const entryId = params.get('id');

    if (!entryId) {
      navigate(createPageUrl("Entries"));
      return;
    }

    try {
      const entryData = await Entry.get(entryId);
      setEntry(entryData);

      // If the entry has a created_by email, try to get the author's details
      if (entryData.created_by) {
        try {
          // For coach messages, we need to find the coach by checking the creator
          if (entryData.type === 'coach_message') {
            // The created_by field contains the coach's email, but we need to find their user record
            // Since we can't list users, we'll just use the email for now
            setAuthor({ 
              email: entryData.created_by,
              preferred_app_name: "Your Coach",
              full_name: entryData.created_by 
            });
          } else {
            // For regular entries, try to get the current user (if it's their own entry)
            const currentUser = await User.me();
            if (currentUser.email === entryData.created_by) {
              setAuthor(currentUser);
            }
          }
        } catch (error) {
          console.warn("Could not load author details:", error);
        }
      }
    } catch (error) {
      console.error("Error loading entry:", error);
      navigate(createPageUrl("Entries"));
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthorDisplayName = (author) => {
    if (!author) return "Unknown";
    
    if (author?.preferred_display === "username" && author?.username) {
      return `@${author.username}`;
    }
    if (author?.preferred_display === "full_name" && author?.full_name) {
      return author.full_name;
    }
    return author?.preferred_app_name || author?.full_name || author?.email || "Unknown";
  };

  const handleDelete = async () => {
    if (!entry || !window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await Entry.delete(entry.id);
      navigate(createPageUrl("Entries"));
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("There was an error deleting the entry. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading entry...</p>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-stone-600 mb-2">Entry not found</h3>
          <p className="text-stone-500 mb-4">The entry you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate(createPageUrl("Entries"))}>
            Back to Entries
          </Button>
        </div>
      </div>
    );
  }

  const TypeIcon = typeIcons[entry.type] || FileText;
  const VisibilityIcon = visibilityIcons[entry.visibility] || Lock;

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Entries"))}
            className="border-stone-200 hover:bg-stone-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-stone-800">{entry.title}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-stone-500">
              <span>Created by: {getAuthorDisplayName(author)}</span>
              <span>•</span>
              <span>{format(new Date(entry.created_date), "MMMM d, yyyy 'at' h:mm a")}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl(`EditEntry?id=${entry.id}`))}
              className="border-stone-200 hover:bg-stone-50"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Entry Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-xl">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-stone-100">
                    <TypeIcon className="w-6 h-6 text-stone-600" />
                  </div>
                  <div>
                    <Badge
                      variant="secondary"
                      className={`${typeColors[entry.type]} border mb-2`}
                    >
                      {entry.type.replace('_', ' ')}
                    </Badge>
                    {entry.is_breakthrough && (
                      <div className="flex items-center gap-1 text-amber-600">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Breakthrough</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <VisibilityIcon className="w-4 h-4 text-stone-400" />
                  <span className="text-sm text-stone-500 capitalize">
                    {entry.visibility?.replace('_', ' ') || 'private'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="prose prose-stone max-w-none">
                <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
                  {entry.content}
                </p>
              </div>

              {/* Metadata */}
              <div className="mt-8 pt-6 border-t border-stone-200 space-y-4">
                {/* Tags */}
                {entry.tags && entry.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-stone-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mood */}
                {entry.mood && (
                  <div>
                    <h4 className="text-sm font-medium text-stone-700 mb-2">Mood</h4>
                    <Badge className={moodColors[entry.mood]}>
                      {entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)}
                    </Badge>
                  </div>
                )}

                {/* Coaching Session Date */}
                {entry.coaching_session_date && (
                  <div>
                    <h4 className="text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Session Date
                    </h4>
                    <p className="text-stone-600">
                      {format(new Date(entry.coaching_session_date), "MMMM d, yyyy")}
                    </p>
                  </div>
                )}

                {/* Coach Notes */}
                {entry.coach_notes && (
                  <div>
                    <h4 className="text-sm font-medium text-stone-700 mb-2">Coach Notes</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800">{entry.coach_notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}