import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Lightbulb, FileText, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";

const typeIcons = {
  note: FileText,
  insight: Lightbulb,
  breakthrough: Sparkles,
  default: FileText
};

export default function SourcedEntries({ entries, isCollapsed, onToggleCollapse }) {
  const Icon = Link;

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 60 : 384 }}
      transition={{ duration: 0.2 }}
      className="border-l border-stone-200/60 flex-col bg-white/90 backdrop-blur-xl h-screen hidden lg:flex"
    >
      <div className="border-b border-stone-200/60 p-4 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-stone-800">Synthesized From</h3>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleCollapse}
          className="hover:bg-stone-100"
        >
          {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>

      <AnimatePresence>
        {isCollapsed ? (
          <div className="flex-1 overflow-y-auto p-2">
            {entries.slice(0, 5).map((entry, index) => {
              const EntryIcon = typeIcons[entry.type] || typeIcons.default;
              return (
                <motion.div
                  key={entry.id}
                  className="p-2 mb-2 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                  title={entry.title}
                >
                  <EntryIcon className="w-4 h-4 text-stone-500 mx-auto" />
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            <AnimatePresence>
              {entries.length === 0 ? (
                <div className="text-center text-stone-500 pt-10">
                  <Icon className="w-12 h-12 mx-auto mb-4 text-stone-300" />
                  <p className="text-sm">Sources used for the response will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {entries.map((entry, index) => {
                    const EntryIcon = typeIcons[entry.type] || typeIcons.default;
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="p-3 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors">
                          <div className="flex items-start gap-3">
                            <EntryIcon className="w-4 h-4 mt-1 text-stone-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm text-stone-800 truncate">{entry.title}</h4>
                              <p className="text-xs text-stone-600 line-clamp-2 mt-1">{entry.content}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}