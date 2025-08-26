import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MessageSquare, 
  Sparkles, 
  FileText, 
  Lightbulb,
  Heart,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const typeIcons = {
  note: FileText,
  journal: FileText,
  insight: Lightbulb,
  breakthrough: Sparkles,
  reflection: Heart,
  coaching_session: MessageSquare,
};

const typeColors = {
  note: "bg-blue-100 text-blue-800 border-blue-200",
  journal: "bg-purple-100 text-purple-800 border-purple-200",
  insight: "bg-amber-100 text-amber-800 border-amber-200",
  breakthrough: "bg-orange-100 text-orange-800 border-orange-200",
  reflection: "bg-green-100 text-green-800 border-green-200",
  coaching_session: "bg-indigo-100 text-indigo-800 border-indigo-200",
};

export default function RecentClientActivity({ entries, clients, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="p-3 border border-stone-200 rounded-lg">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const getClientName = (createdBy) => {
    // Since we can't access full client details, we'll show the email or a generic name
    return createdBy || 'Client';
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-stone-800">
          <MessageSquare className="w-5 h-5" />
          Recent Client Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 text-sm">No recent client activity</p>
            <p className="text-stone-400 text-xs mt-1">
              Entries shared by clients will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.slice(0, 8).map((entry, index) => {
              const TypeIcon = typeIcons[entry.type] || FileText;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 border border-stone-200/60 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <TypeIcon className="w-4 h-4 mt-1 text-stone-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-sm text-stone-800 line-clamp-1">
                          {entry.title}
                          {entry.is_breakthrough && (
                            <Sparkles className="inline w-3 h-3 ml-1 text-amber-500" />
                          )}
                        </h4>
                        <Badge 
                          variant="secondary" 
                          className={`${typeColors[entry.type]} border text-xs flex-shrink-0`}
                        >
                          {entry.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-stone-600 line-clamp-2 mb-2">
                        {entry.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-stone-400">
                        <span>{getClientName(entry.created_by)}</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(entry.created_date), "MMM d")}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {entries.length > 0 && (
          <div className="mt-4 pt-3 border-t border-stone-200">
            <p className="text-xs text-stone-500 text-center">
              Showing entries your clients have shared with you
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}