
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { 
  BookOpen, 
  Sparkles, 
  Calendar,
  ArrowRight,
  FileText,
  Lightbulb,
  Heart,
  MessageSquare,
  MessageCircle // Added MessageCircle import
} from "lucide-react";
import { motion } from "framer-motion";

const typeIcons = {
  note: FileText,
  journal: BookOpen,
  insight: Lightbulb,
  breakthrough: Sparkles,
  reflection: Heart,
  coaching_session: MessageSquare,
  coach_message: MessageCircle, // Added coach_message type icon
};

const typeColors = {
  note: "bg-blue-100 text-blue-800 border-blue-200",
  journal: "bg-purple-100 text-purple-800 border-purple-200",
  insight: "bg-amber-100 text-amber-800 border-amber-200",
  breakthrough: "bg-orange-100 text-orange-800 border-orange-200",
  reflection: "bg-green-100 text-green-800 border-green-200",
  coaching_session: "bg-indigo-100 text-indigo-800 border-indigo-200",
  personality_test: "bg-pink-100 text-pink-800 border-pink-200",
  coach_message: "bg-blue-100 text-blue-800 border-blue-200", // Added coach_message type color
};

export default function RecentEntries({ entries, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Recent Entries
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-4 border border-stone-200 rounded-xl">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-stone-800">
          <BookOpen className="w-5 h-5" />
          Recent Entries
        </CardTitle>
        <Link to={createPageUrl("Entries")}>
          <Badge variant="outline" className="hover:bg-stone-50 cursor-pointer">
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Badge>
        </Link>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-600 mb-2">No entries yet</h3>
            <p className="text-stone-500 mb-4">Start your inner journey by capturing your first thought</p>
            <Link to={createPageUrl("NewEntry")}>
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
                Create Your First Entry
              </Badge>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.slice(0, 5).map((entry, index) => {
              const TypeIcon = typeIcons[entry.type] || FileText;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={createPageUrl("EntryDetails", { id: entry.id })} className="block group p-4 border border-stone-200/60 rounded-xl hover:shadow-md hover:border-stone-300 transition-all duration-300">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-stone-100 group-hover:bg-stone-200 transition-colors">
                        <TypeIcon className="w-4 h-4 text-stone-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-stone-800 line-clamp-1 group-hover:text-stone-900">
                            {entry.title}
                          </h3>
                          {entry.is_breakthrough && (
                            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-stone-600 text-sm line-clamp-2 mb-3 leading-relaxed">
                          {entry.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="secondary" 
                              className={`${typeColors[entry.type]} border text-xs capitalize`}
                            >
                              {entry.type.replace(/_/g, ' ')}
                            </Badge>
                            {entry.tags?.length > 0 && (
                              <span className="text-xs text-stone-400">
                                +{entry.tags.length} tags
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-stone-400">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(entry.created_date), "MMM d")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
