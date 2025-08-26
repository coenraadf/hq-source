import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
    X, ChevronDown, ChevronRight, Search, Plus, Check, 
    BarChart3, Settings, BookOpen, Users
} from "lucide-react";

export const WIDGET_CATEGORIES = [
    { id: 'activity', name: 'Your Activity', icon: BarChart3 },
    { id: 'insights', name: 'Insights & Tools', icon: Settings },
    { id: 'coach', name: 'Coach Connection', icon: Users },
    { id: 'clients', name: 'Client Management', icon: Users },
];

export default function WidgetSelector({ 
    isOpen, 
    onClose, 
    onToggleWidget, 
    availableWidgets = [], 
    activeWidgetIds = [],
    userType = 'client' 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState(new Set());

  const toggleCategory = (categoryId) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const filteredWidgets = availableWidgets.filter(widget => 
    widget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    widget.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const relevantCategories = WIDGET_CATEGORIES.filter(cat => {
    if (userType === 'coach') return ['clients', 'insights', 'activity', 'tools'].includes(cat.id);
    return ['activity', 'insights', 'coach', 'tools'].includes(cat.id);
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-80 bg-gray-50 shadow-2xl z-50 flex flex-col paper-texture">
        <div className="p-4 border-b warm-border flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-warm-primary">Customize Widgets</h2>
            <Button 
              onClick={onClose} 
              variant="ghost" 
              size="sm" 
              className="hover:bg-stone-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search widgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border warm-border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {relevantCategories.map(category => {
            const categoryWidgets = filteredWidgets.filter(w => w.category === category.id);
            if (categoryWidgets.length === 0 && searchTerm) return null;
            const isCollapsed = collapsedCategories.has(category.id);
            
            return (
              <div key={category.id} className="mb-4">
                <button 
                  onClick={() => toggleCategory(category.id)} 
                  className="flex items-center justify-between w-full p-2 text-left text-sm font-medium text-warm-secondary hover:bg-stone-200/50 rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <category.icon className="w-4 h-4" />
                    {category.name}
                  </span>
                  {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {!isCollapsed && (
                  <div className="ml-2 mt-2 space-y-2">
                    {categoryWidgets.map(widget => {
                      const isActive = activeWidgetIds.includes(widget.id);
                      return (
                        <div 
                          key={widget.id}
                          className={`p-3 border rounded-lg transition-all cursor-pointer ${
                            isActive 
                              ? 'border-green-400 bg-green-50 hover:bg-green-100' 
                              : 'border-gray-200 hover:border-orange-400 hover:bg-orange-50'
                          }`}
                          onClick={() => onToggleWidget(widget)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <widget.icon className={`w-4 h-4 ${
                              isActive ? 'text-green-600' : 'text-orange-600'
                            }`} />
                            <h4 className="font-medium text-sm flex-1 text-warm-primary">
                              {widget.title}
                            </h4>
                            {isActive ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Plus className="w-4 h-4 text-orange-600" />
                            )}
                          </div>
                          <p className="text-xs text-warm-muted">{widget.description}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}