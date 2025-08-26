import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Sparkles,
  Calendar,
  ArrowRight,
  BookOpen,
  Heart,
  Lightbulb,
  MessageSquare,
  Brain
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
};

const typeColors = {
  note: "bg-blue-100 text-blue-800 border-blue-200",
  journal: "bg-purple-100 text-purple-800 border-purple-200",
  insight: "bg-amber-100 text-amber-800 border-amber-200",
  breakthrough: "bg-orange-100 text-orange-800 border-orange-200",
  reflection: "bg-green-100 text-green-800 border-green-200",
  coaching_session: "bg-indigo-100 text-indigo-800 border-indigo-200",
  personality_test: "bg-pink-100 text-pink-800 border-pink-200",
};

export default function ClientProgress({ entries, relationship, client }) {
  const recentEntries = entries.slice(0, 10);
  const breakthroughs = entries.filter(e => e.is_breakthrough);

  return (
    <div className="space-y-6">
      {/* Goals Section */}
      {relationship?.goals && relationship.goals.length > 0 && (
        <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-stone-800">Current Goals</CardTitle>
            <Button variant="outline" size="sm">
              <ArrowRight className="w-3 h-3 ml-1" />
              Manage
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {relationship.goals.map((goal, index) => (
                <div key={index} className="p-3 border border-stone-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-stone-800">{goal.title}</h4>
                      {goal.description && (
                        <p className="text-stone-600 text-sm mt-1">{goal.description}</p>
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${
                        goal.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                        goal.status === 'paused' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {goal.status}
                    </Badge>
                  </div>
                  {goal.target_date && (
                    <p className="text-xs text-stone-500 mt-2">
                      Target: {format(new Date(goal.target_date), "MMM d, yyyy")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-stone-800">Recent Shared Entries</CardTitle>
          <Button variant="outline" size="sm">
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {recentEntries.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500 text-sm">No shared entries yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentEntries.map((entry, index) => {
                const TypeIcon = typeIcons[entry.type] || FileText;
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 border border-stone-200/60 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
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
                          <span className="capitalize">{entry.visibility.replace('_', ' ')}</span>
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
        </CardContent>
      </Card>

      {/* Breakthroughs */}
      {breakthroughs.length > 0 && (
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <Sparkles className="w-5 h-5" />
              Recent Breakthroughs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {breakthroughs.slice(0, 3).map((entry) => (
                <div key={entry.id} className="p-3 bg-white/50 rounded-lg border border-amber-200/50">
                  <h4 className="font-medium text-stone-800 mb-1">{entry.title}</h4>
                  <p className="text-stone-600 text-sm line-clamp-2 mb-2">{entry.content}</p>
                  <p className="text-xs text-amber-700">
                    {format(new Date(entry.created_date), "MMM d, yyyy")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}