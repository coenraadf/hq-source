
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, X, RotateCcw, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MenuEditor({
  availableItems = [],
  visibleItemTitles = [],
  onToggleItem,
  onSaveLayout,
  onCancel,
  onResetLayout,
  isOpen,
  userType = 'client'
}) {
  if (!isOpen) return null;

  const categorizedItems = {
    main: availableItems.filter(item => 
      ['Dashboard', 'Coach Dashboard', 'New Entry'].includes(item.title)
    ),
    content: availableItems.filter(item => 
      ['My Notes', 'Ask Yourself', 'Entries', 'Chat'].includes(item.title)
    ),
    growth: availableItems.filter(item => 
      ['My Coach', 'Breakthroughs', 'Personality Tests'].includes(item.title)
    ),
    tools: availableItems.filter(item => 
      ['Resource Library', 'Resources', 'Messages'].includes(item.title)
    ),
    coach: availableItems.filter(item => 
      ['Client Management', 'Schedule', 'Analytics', 'CoachSchedule', 'CoachAnalytics', 'CoachBreakthroughs'].includes(item.title)
    )
  };

  const visibleCount = Array.isArray(visibleItemTitles) ? visibleItemTitles.length : 0;
  const totalCount = availableItems.length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm z-50"
      >
        <motion.div
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          exit={{ x: -320 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-80 h-full bg-white border-r border-stone-200 shadow-xl flex flex-col"
        >
          <CardHeader className="border-b border-stone-200 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-text-primary">
              <Settings className="w-5 h-5" />
              Customize Menu
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Badge variant="outline" className="text-xs">
                {visibleCount}/{totalCount} visible
              </Badge>
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {Object.entries(categorizedItems).map(([category, items]) => {
                if (items.length === 0) return null;
                
                return (
                  <div key={category} className="space-y-3">
                    <h4 className="font-medium text-text-secondary text-sm uppercase tracking-wide">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </h4>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.title}
                          className="flex items-center justify-between p-3 rounded-lg border border-border-color hover:bg-bg-secondary transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="w-4 h-4 text-text-secondary" />
                            <div>
                              <Label htmlFor={`toggle-${item.title}`} className="text-sm font-medium cursor-pointer text-text-primary">
                                {item.title}
                              </Label>
                            </div>
                          </div>
                          <Switch
                            id={`toggle-${item.title}`}
                            checked={Array.isArray(visibleItemTitles) && visibleItemTitles.includes(item.title)}
                            onCheckedChange={() => onToggleItem(item.title)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          
          <div className="border-t border-border-color p-4 space-y-3 mt-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onResetLayout}
              className="w-full justify-center btn-secondary"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Default
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex-1 btn-secondary"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={onSaveLayout}
                className="flex-1 btn-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
