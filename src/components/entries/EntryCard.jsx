import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText,
  BookOpen,
  Lightbulb,
  Heart,
  MessageSquare,
  Brain,
  Sparkles,
  Calendar,
  Tag,
  Eye,
  Users,
  Lock
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

const visibilityIcons = {
  private: Lock,
  shared_with_coach: Eye,
  collaborative: Users,
};

export default function EntryCard({ entry, index, viewMode = "grid", onClick }) {
  const TypeIcon = typeIcons[entry.type] || FileText;
  const VisibilityIcon = visibilityIcons[entry.visibility] || Lock;

  const getVisibilityColor = (visibility) => {
    switch (visibility) {
      case "private": return "text-stone-500 bg-stone-100";
      case "shared_with_coach": return "text-blue-500 bg-blue-100";
      case "collaborative": return "text-green-500 bg-green-100";
      default: return "text-stone-500 bg-stone-100";
    }
  };

  const getMoodColor = (mood) => {
    const colors = {
      excited: "bg-orange-100 text-orange-800",
      contemplative: "bg-blue-100 text-blue-800",
      frustrated: "bg-red-100 text-red-800",
      peaceful: "bg-green-100 text-green-800",
      anxious: "bg-yellow-100 text-yellow-800",
      confident: "bg-purple-100 text-purple-800",
      curious: "bg-indigo-100 text-indigo-800",
      grateful: "bg-pink-100 text-pink-800",
    };
    return colors[mood] || "bg-stone-100 text-stone-800";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={viewMode === "list" ? "w-full" : ""}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] paper-card warm-border ${
          viewMode === "list" ? "flex" : ""
        }`}
        onClick={onClick}
      >
        <CardHeader className={`pb-3 ${viewMode === "list" ? "flex-shrink-0" : ""}`}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <TypeIcon className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <CardTitle className="text-warm-primary text-sm sm:text-base line-clamp-2 break-words">
                {entry.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {entry.is_breakthrough && (
                <Sparkles className="w-4 h-4 text-orange-500" />
              )}
              <VisibilityIcon className={`w-4 h-4 ${getVisibilityColor(entry.visibility).split(' ')[0]}`} />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className={`space-y-3 ${viewMode === "list" ? "flex-1" : ""}`}>
          <p className="text-stone-600 text-sm line-clamp-3 break-words">
            {entry.content}
          </p>
          
          <div className="flex items-center justify-between text-xs text-stone-500 gap-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{format(new Date(entry.created_date), 'MMM d, yyyy')}</span>
            </div>
            <Badge 
              variant="outline" 
              className={`${getVisibilityColor(entry.visibility)} text-xs px-1`}
            >
              {entry.visibility.replace('_', ' ')}
            </Badge>
          </div>
          
          {/* Tags and Mood */}
          <div className="flex flex-wrap gap-1">
            {entry.tags?.slice(0, 3).map((tag, tagIndex) => (
              <Badge key={tagIndex} variant="secondary" className="text-xs px-1 py-0 bg-stone-100 text-stone-700 truncate max-w-[80px]">
                {tag}
              </Badge>
            ))}
            {entry.tags && entry.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs px-1 py-0 bg-stone-100 text-stone-700">
                +{entry.tags.length - 3}
              </Badge>
            )}
            {entry.mood && (
              <Badge className={`text-xs px-1 py-0 ${getMoodColor(entry.mood)} truncate max-w-[80px]`}>
                {entry.mood}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}