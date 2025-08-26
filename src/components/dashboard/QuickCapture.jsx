
import React, { useState } from 'react';
import { Entry } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles, Send, MessageCircle } from "lucide-react"; // MessageCircle added here
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom'; // Import Link

export default function QuickCapture({ onEntryCreated }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedType, setSelectedType] = useState("note");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const entryTypes = [
    { value: "note", label: "Note", color: "bg-blue-100 text-blue-800" },
    { value: "journal", label: "Journal", color: "bg-purple-100 text-purple-800" },
    { value: "insight", label: "Insight", color: "bg-amber-100 text-amber-800" },
    { value: "reflection", label: "Reflection", color: "bg-green-100 text-green-800" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await Entry.create({
        title: title.trim(),
        content: content.trim(),
        type: selectedType,
        tags: [],
        visibility: "private"
      });
      
      setTitle("");
      setContent("");
      setSelectedType("note");
      setIsExpanded(false);
      onEntryCreated?.();
    } catch (error) {
      console.error("Error creating entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createPageUrl = (pageName) => {
    // This is a placeholder function; in a real app, you'd use a router's
    // utility or a defined route map to generate URLs.
    // For this context, assuming 'Chat' maps to '/chat'.
    switch (pageName) {
      case "Chat":
        return "/chat";
      default:
        return "/";
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-stone-800">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Quick Capture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                onClick={() => setIsExpanded(true)}
                variant="outline"
                className="w-full h-16 text-stone-600 hover:text-stone-800 hover:bg-stone-50 border-dashed border-2 border-stone-200 hover:border-stone-300 transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Capture a thought, insight, or reflection...
              </Button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="flex gap-2 flex-wrap">
                {entryTypes.map((type) => (
                  <Badge
                    key={type.value}
                    variant={selectedType === type.value ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedType === type.value 
                        ? type.color 
                        : "hover:bg-stone-100"
                    }`}
                    onClick={() => setSelectedType(type.value)}
                  >
                    {type.label}
                  </Badge>
                ))}
              </div>
              
              <Input
                placeholder="Give your entry a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-stone-200 focus:border-amber-300 focus:ring-amber-200"
              />
              
              <Textarea
                placeholder="What's on your mind? Share your thoughts, insights, or reflections..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] border-stone-200 focus:border-amber-300 focus:ring-amber-200"
                autoFocus
              />
              
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsExpanded(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!title.trim() || !content.trim() || isSubmitting}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save Entry"}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* New "Ask Sage" button added here, outside the AnimatePresence block for consistent visibility */}
        <div className="mt-4 pt-4 border-t border-stone-200">
          <Link to={createPageUrl("Chat")}>
            <Button className="w-full compass-gradient hover:opacity-90 text-white shadow-lg transform hover:scale-105 transition-all duration-200">
              <MessageCircle className="w-4 h-4 mr-2" />
              Ask Sage
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
