
import React, { useState, useEffect } from "react";
import { Entry } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { format, subDays, subMonths, subYears } from "date-fns";

import { useAutoSave } from "@/components/hooks/useAutoSave";
import { useResponsiveGrid } from "@/components/hooks/useResponsiveGrid";
import { getSanitizedLayout } from "../components/dashboard/gridUtils";

import DashboardContainer from "../components/dashboard/DashboardContainer";
import DashboardWidget from "../components/dashboard/DashboardWidget";

import HeaderWidget from "../components/dashboard/widgets/breakthroughs/HeaderWidget";
import StatsWidget from "../components/dashboard/widgets/breakthroughs/StatsWidget";
import FilterWidget from "../components/dashboard/widgets/breakthroughs/FilterWidget";
import ResultsWidget from "../components/dashboard/widgets/breakthroughs/ResultsWidget";
import { Sparkles, Filter as FilterIcon, BarChart3, Settings, Save, Undo, Redo } from "lucide-react";

const AVAILABLE_WIDGETS = [
  { id: "header", title: "Header", component: HeaderWidget, defaultSize: { w: 12, h: 2 } },
  { id: "stats", title: "Stats", icon: BarChart3, component: StatsWidget, defaultSize: { w: 12, h: 2 } },
  { id: "filters", title: "Filters", icon: FilterIcon, component: FilterWidget, defaultSize: { w: 12, h: 2 } },
  { id: "results", title: "Results", icon: Sparkles, component: ResultsWidget, defaultSize: { w: 12, h: 10 } },
];

const DEFAULT_DESKTOP_LAYOUT = [
    { id: "header", x: 0, y: 0, w: 12, h: 2, isResizable: false, isDraggable: false },
    { id: "stats", x: 0, y: 2, w: 12, h: 2, isResizable: false, isDraggable: false },
    { id: "filters", x: 0, y: 4, w: 12, h: 2, isResizable: false, isDraggable: false },
    { id: "results", x: 0, y: 6, w: 12, h: 10, isResizable: false, isDraggable: false },
];

const DEFAULT_MOBILE_LAYOUT = DEFAULT_DESKTOP_LAYOUT.map((item, index) => {
    // Calculate y position based on previous items' heights for stacking
    const yPos = DEFAULT_DESKTOP_LAYOUT.slice(0, index).reduce((acc, prev) => acc + prev.h, 0);
    return { ...item, x: 0, y: yPos, w: 12 };
});


export default function Breakthroughs() {
  const [breakthroughs, setBreakthroughs] = useState([]);
  const [filteredBreakthroughs, setFilteredBreakthroughs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [isCustomizeMode, setIsCustomizeMode] = useState(false);

  const { state: layouts, updateState: setLayouts, undo, redo, canUndo, canRedo } = useAutoSave({
    desktop: DEFAULT_DESKTOP_LAYOUT,
    mobile: DEFAULT_MOBILE_LAYOUT,
  });

  const { breakpointKey } = useResponsiveGrid();
  const isMobile = breakpointKey === 'xs';
  const activeLayoutKey = isMobile ? 'mobile' : 'desktop';

  useEffect(() => {
    loadBreakthroughs();
    try {
      const savedDesktopLayout = localStorage.getItem('breakthroughs_layout_desktop');
      const savedMobileLayout = localStorage.getItem('breakthroughs_layout_mobile');
      
      const desktopLayout = savedDesktopLayout ? JSON.parse(savedDesktopLayout) : DEFAULT_DESKTOP_LAYOUT;
      const mobileLayout = savedMobileLayout ? JSON.parse(savedMobileLayout) : DEFAULT_MOBILE_LAYOUT;
      
      setLayouts({ desktop: desktopLayout, mobile: mobileLayout });
    } catch (e) {
      console.warn("Failed to load breakthroughs layout from localStorage", e);
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [breakthroughs, searchQuery, activeFilter]);
  
  const loadBreakthroughs = async () => {
    setIsLoading(true);
    try {
      const entries = await Entry.filter({ is_breakthrough: true }, "-created_date");
      setBreakthroughs(entries);
    } catch (error) {
      console.error("Error loading breakthroughs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...breakthroughs];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    const now = new Date();
    switch (activeFilter) {
      case "week":
        filtered = filtered.filter(entry => new Date(entry.created_date) > subDays(now, 7));
        break;
      case "month":
        filtered = filtered.filter(entry => new Date(entry.created_date) > subMonths(now, 1));
        break;
      case "quarter":
        filtered = filtered.filter(entry => new Date(entry.created_date) > subMonths(now, 3));
        break;
      case "year":
        filtered = filtered.filter(entry => new Date(entry.created_date) > subYears(now, 1));
        break;
    }
    setFilteredBreakthroughs(filtered);
  };
  
  const handleSaveLayout = () => {
    setIsCustomizeMode(false);
    localStorage.setItem('breakthroughs_layout_desktop', JSON.stringify(layouts.desktop));
    localStorage.setItem('breakthroughs_layout_mobile', JSON.stringify(layouts.mobile));
  };

  const widgetProps = {
    header: {},
    stats: { breakthroughs },
    filters: { searchQuery, onSearchChange: setSearchQuery, activeFilter, onFilterChange: setActiveFilter },
    results: { filteredBreakthroughs, isLoading, totalCount: breakthroughs.length, searchQuery, activeFilter },
  };

  // On mobile, force a single-column layout for rendering.
  const finalLayout = isMobile 
    ? layouts.mobile.map((item, index) => {
        const yPos = layouts.mobile.slice(0, index).reduce((acc, prev) => acc + prev.h, 0);
        return { ...item, x: 0, y: yPos, w: 12 };
    })
    : layouts.desktop;


  return (
    <div className="min-h-full bg-[var(--bg-primary)]">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end items-center gap-4 mb-4">
             {isCustomizeMode ? (
                <>
                  <Button onClick={undo} disabled={!canUndo} variant="outline" size="sm" className="btn-secondary"><Undo className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Undo</span></Button>
                  <Button onClick={redo} disabled={!canRedo} variant="outline" size="sm" className="btn-secondary"><Redo className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Redo</span></Button>
                  <Button onClick={handleSaveLayout} className="bg-success hover:bg-green-700 text-white shadow-lg" size="sm"><Save className="w-4 h-4 mr-1"/><span className="hidden sm:inline">Save Layout</span><span className="sm:hidden">Save</span></Button>
                </>
              ) : (
                <Button onClick={() => setIsCustomizeMode(true)} variant="outline" size="sm" className="btn-secondary">
                    <Settings className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Customize Layout</span>
                </Button>
              )}
          </motion.div>
        
          <DashboardContainer
            layout={finalLayout}
            onLayoutChange={(newActiveLayout) => {
              if (isCustomizeMode) {
                setLayouts(prev => ({ ...prev, [activeLayoutKey]: newActiveLayout }));
              }
            }}
          >
            {finalLayout.map(item => {
              const widgetData = AVAILABLE_WIDGETS.find(w => w.id === item.id);
              if (!widgetData) return null;
              const WidgetComponent = widgetData.component;
              return (
                <DashboardWidget
                  key={item.id}
                  id={item.id}
                  layout={item}
                  widget={widgetData}
                  isCustomizeMode={isCustomizeMode}
                  onRemove={() => {}}
                  hideHeader={true}
                >
                  <WidgetComponent {...widgetProps[item.id]} />
                </DashboardWidget>
              );
            })}
          </DashboardContainer>
        </div>
      </div>
    </div>
  );
}
