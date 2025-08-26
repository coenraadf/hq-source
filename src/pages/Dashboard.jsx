
import React, { useState, useEffect } from "react";
import { Entry, Conversation, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Settings, Save, Undo, Redo, Plus, Target, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useAutoSave } from "@/components/hooks/useAutoSave";
import { useResponsiveGrid } from "@/components/hooks/useResponsiveGrid";
import { getSanitizedLayout } from "../components/dashboard/gridUtils";

import DashboardContainer from "../components/dashboard/DashboardContainer";
import DashboardWidget from "../components/dashboard/DashboardWidget";
import WidgetSelector from "../components/dashboard/WidgetSelector";

// Widget component imports
import StatsWidget from "../components/dashboard/widgets/StatsWidget";
import RecentNotesWidget from "../components/dashboard/widgets/RecentNotesWidget";
import MicroWinsWidget from "../components/dashboard/widgets/MicroWinsWidget";
import MyGoalsWidget from "../components/dashboard/widgets/MyGoalsWidget";
import QuickActionsWidget from "../components/dashboard/widgets/QuickActionsWidget";
import CoachConnectionWidget from "../components/dashboard/widgets/CoachConnectionWidget";
import MoodTrendWidget from "../components/dashboard/widgets/MoodTrendWidget";
import AIInsightPromptWidget from "../components/dashboard/widgets/AIInsightPromptWidget";
import UpcomingSessionWidget from "../components/dashboard/widgets/UpcomingSessionWidget";
import PersonalitySnapshotWidget from "../components/dashboard/widgets/PersonalitySnapshotWidget";

import {
  BarChart3, BookOpen, Zap, Heart, MessageCircle, Brain,
  Target as TargetIcon, TrendingUp, Lightbulb, Calendar, 
  User as UserIcon, Sparkles
} from "lucide-react";

const AVAILABLE_WIDGETS = [
  { id: "stats", title: "Journey Stats", description: "Your activity overview", icon: BarChart3, category: "activity", component: StatsWidget, defaultSize: { h: 4 } },
  { id: "recent_notes", title: "Recent Notes", description: "Your latest entries", icon: BookOpen, category: "activity", component: RecentNotesWidget, defaultSize: { h: 5 } },
  { id: "micro_wins", title: "Recent Wins", description: "Breakthroughs and achievements", icon: Sparkles, category: "insights", component: MicroWinsWidget, defaultSize: { h: 5 } },
  { id: "my_goals", title: "Active Goals", description: "Goal progress and milestones", icon: TargetIcon, category: "insights", component: MyGoalsWidget, defaultSize: { h: 5 } },
  { id: "quick_actions", title: "Quick Actions", description: "Common tasks", icon: Zap, category: "tools", component: QuickActionsWidget, defaultSize: { h: 4 } },
  { id: "coach_connection", title: "Coach Connection", description: "Your coaching relationship", icon: Heart, category: "coach", component: CoachConnectionWidget, defaultSize: { h: 4 } },
  { id: "mood_trend", title: "Mood Trend", description: "Your emotional patterns", icon: TrendingUp, category: "insights", component: MoodTrendWidget, defaultSize: { h: 4 } },
  { id: "ai_insight_prompt", title: "Daily Reflection", description: "AI-generated insight prompts", icon: Lightbulb, category: "insights", component: AIInsightPromptWidget, defaultSize: { h: 4 } },
  { id: "upcoming_session", title: "Upcoming Session", description: "Next coaching session", icon: Calendar, category: "coach", component: UpcomingSessionWidget, defaultSize: { h: 4 } },
  { id: "personality_snapshot", title: "Personality Snapshot", description: "Your key traits summary", icon: UserIcon, category: "insights", component: PersonalitySnapshotWidget, defaultSize: { h: 5 } }
];

const DEFAULT_DESKTOP_LAYOUT = [
  { id: "stats", x: 0, y: 0, w: 4, h: 4 },
  { id: "micro_wins", x: 4, y: 0, w: 4, h: 5 },
  { id: "recent_notes", x: 8, y: 0, w: 4, h: 5 },
  { id: "my_goals", x: 0, y: 4, w: 8, h: 5 },
  { id: "quick_actions", x: 8, y: 5, w: 4, h: 4 },
  { id: "coach_connection", x: 0, y: 9, w: 4, h: 4 },
];

const DEFAULT_MOBILE_LAYOUT = DEFAULT_DESKTOP_LAYOUT.map((item, index) => {
    const widget = AVAILABLE_WIDGETS.find(w => w.id === item.id);
    const height = widget ? widget.defaultSize.h : 4;
    const yPos = DEFAULT_DESKTOP_LAYOUT.slice(0, index).reduce((acc, prev) => {
        const prevWidget = AVAILABLE_WIDGETS.find(w => w.id === prev.id);
        return acc + (prevWidget ? prevWidget.defaultSize.h : 4);
    }, 0);
    return { ...item, x: 0, y: yPos, w: 12, h: height };
});

const sublines = {
  general: [
    "What's one thing you could get clear on today?",
    "Your next chapter is waiting. What's the first word you'll write?",
    "Let's untangle some thoughts and find a clear path forward.",
    "Clarity isn't about having all the answers, but asking the right questions.",
    "What does your ideal self want you to know today?",
    "Today is a blank page. What will you write?",
    "Let's connect some dots and see what patterns emerge.",
    "Sometimes, the most important answers are the ones we've been avoiding.",
    "What's one truth you can acknowledge today?",
    "Your inner wisdom is speaking. Are you ready to listen?",
  ],
  growth: [
    "What's one small step you can take toward a better you today?",
    "Remember the person you want to be. Today is a chance to become them.",
    "Every reflection is a step forward. Let's keep moving.",
    "Your growth journey is a marathon, not a sprint. Be kind to yourself.",
    "What's a fear you can face today, no matter how small?",
    "The best project you'll ever work on is you.",
    "Celebrate the small wins. They're the building blocks of big changes.",
    "You've already come so far. Take a moment to see the progress you've made.",
    "What's one habit you can start today that your future self will thank you for?",
    "Your potential is limitless. What part of it will you unlock today?",
  ],
  stuck: [
    "It's okay to feel stuck. The first step is simply noticing it.",
    "What if 'stuck' is just a pause before your next great move?",
    "Even on the cloudy days, the sun is still there. What's one ray of light you can find?",
    "You've navigated tough times before. You have the map within you.",
    "What's one thing you can let go of today to feel a little lighter?",
    "Sometimes, the only way out is through. Let's take the first step together.",
    "A change in perspective can change everything. What's another way to look at this?",
    "Don't let a stalled engine make you forget how far you can travel.",
    "What's one kind word you can offer yourself right now?",
    "Your journey is unique. Don't compare your chapter one to someone else's chapter twenty.",
  ],
  reflection: [
    "What did yesterday teach you that you can use today?",
    "Who are you becoming?",
    "Let's look inside. Your personal landscape is waiting to be explored.",
    "What story are you telling yourself right now?",
    "Your thoughts are powerful. What will you focus on today?",
    "Let's find the quiet space between the noise.",
    "What matters most to you, right now, in this moment?",
    "Your values are your compass. Are you pointed in the right direction?",
    "What's one thing you're grateful for today?",
    "What does your heart need to feel heard?",
  ],
  action: [
    "Clarity is the prequel to action. What will you do with your newfound insight?",
    "A single, intentional action can change your entire day.",
    "What's one promise you can make to yourself today?",
    "Let's build a bridge from thought to action.",
    "You are the author of your life. What will you do in this next scene?",
    "Don't wait for motivation. Create it.",
    "What's one decision you can make today to move forward?",
    "The future is built on the choices you make today.",
    "Let your actions be louder than your fears.",
    "Ready to move from knowing the path to walking the path?",
  ],
};

const allSublines = Object.values(sublines).flat();


export default function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [subline, setSubline] = useState(allSublines[0]);
  const [sublineKey, setSublineKey] = useState(0);

  const { state: layouts, updateState: setLayouts, undo, redo, canUndo, canRedo } = useAutoSave({
    desktop: DEFAULT_DESKTOP_LAYOUT,
    mobile: DEFAULT_MOBILE_LAYOUT,
  }, 1000, 'dashboard_layout_client');
  
  const { breakpointKey } = useResponsiveGrid();
  const isMobile = breakpointKey === 'xs';
  const activeLayoutKey = isMobile ? 'mobile' : 'desktop';

  useEffect(() => {
    loadData();
    try {
      const savedLayouts = localStorage.getItem('dashboard_layout_client');
      if (savedLayouts) {
        const parsedLayouts = JSON.parse(savedLayouts);
        const desktopLayout = parsedLayouts.desktop || DEFAULT_DESKTOP_LAYOUT;
        const mobileLayout = parsedLayouts.mobile || DEFAULT_MOBILE_LAYOUT;

        DEFAULT_DESKTOP_LAYOUT.forEach(defaultItem => {
          if (!desktopLayout.some(item => item.id === defaultItem.id)) {
              desktopLayout.push(defaultItem);
          }
          if (!mobileLayout.some(item => item.id === defaultItem.id)) {
              const mobileVersion = DEFAULT_MOBILE_LAYOUT.find(m => m.id === defaultItem.id);
              if (mobileVersion) mobileLayout.push(mobileVersion);
          }
        });
        
        setLayouts({ desktop: getSanitizedLayout(desktopLayout), mobile: getSanitizedLayout(mobileLayout) }, true); // Don't trigger save
      }
    } catch (e) {
      console.warn("Failed to load layout from localStorage", e);
    }
    
    // Initialize subline rotation
    const intervalId = setInterval(() => {
      setSublineKey(prevKey => prevKey + 1);
      const newIndex = Math.floor(Math.random() * allSublines.length);
      setSubline(allSublines[newIndex]);
    }, 8000); // Change subline every 8 seconds

    return () => clearInterval(intervalId);
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [entriesData, conversationsData, userData] = await Promise.all([
        Entry.list("-created_date", 20).catch(() => []),
        Conversation.list("-created_date", 10).catch(() => []),
        User.me()
      ]);
      
      setEntries(entriesData);
      setConversations(conversationsData);
      setUser(userData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      if (err.message && (err.message.includes('401') || err.message.includes('Unauthorized'))) {
        setError("Your session has expired. Redirecting to login...");
        setTimeout(() => {
          User.logout().finally(() => {
            window.location.replace(createPageUrl("MyHQHome"));
          });
        }, 3000);
      } else {
        setError("Failed to load dashboard data. Please check your connection and try again.");
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getUserDisplayName = (user) => {
    if (!user) return 'User';
    const nameSource = user.preferred_app_name || user.full_name || user.email;
    const firstName = nameSource ? nameSource.split(' ')[0].split('@')[0] : 'User';
    return firstName.charAt(0).toUpperCase() + firstName.slice(1);
  };

  const handleToggleWidget = (widget) => {
    const widgetExists = layouts.desktop.some(item => item.id === widget.id);
    let newDesktopLayout, newMobileLayout;

    if (widgetExists) {
        newDesktopLayout = layouts.desktop.filter(item => item.id !== widget.id);
        newMobileLayout = layouts.mobile.filter(item => item.id !== widget.id);
    } else {
        const desktopY = layouts.desktop.reduce((acc, item) => Math.max(acc, item.y + item.h), 0);
        const mobileY = layouts.mobile.reduce((acc, item) => Math.max(acc, item.y + item.h), 0);
        
        const newDesktopItem = {
            id: widget.id,
            w: 4, h: widget.defaultSize.h, x: 0, y: desktopY
        };
        const newMobileItem = {
            id: widget.id,
            w: 12, h: widget.defaultSize.h, x: 0, y: mobileY
        };
        newDesktopLayout = getSanitizedLayout([...layouts.desktop, newDesktopItem]);
        newMobileLayout = getSanitizedLayout([...layouts.mobile, newMobileItem]);
    }
    setLayouts({ desktop: newDesktopLayout, mobile: newMobileLayout });
  };
  
  const handleSaveLayout = () => {
    setIsCustomizeMode(false);
    setIsLibraryOpen(false);
    localStorage.setItem('dashboard_layout_client', JSON.stringify(layouts));
  };
  
  const handleResetLayout = () => {
    setLayouts({ desktop: DEFAULT_DESKTOP_LAYOUT, mobile: DEFAULT_MOBILE_LAYOUT });
  };

  const handleCustomizeToggle = () => {
    const nextState = !isCustomizeMode;
    setIsCustomizeMode(nextState);
    if (!nextState) {
        handleSaveLayout();
    }
  };

  const widgetProps = {
    entries: entries || [],
    conversations: conversations || [],
    user: user
  };

  const currentActiveLayout = layouts[activeLayoutKey] || [];

  const finalLayout = isMobile
    ? currentActiveLayout.map((item, index) => {
        const widget = AVAILABLE_WIDGETS.find(w => w.id === item.id);
        const height = widget ? widget.defaultSize.h : 4;
        const yPos = currentActiveLayout.slice(0, index).reduce((acc, prevItem) => {
            const prevWidget = AVAILABLE_WIDGETS.find(w => w.id === prevItem.id);
            return acc + (prevWidget ? prevWidget.defaultSize.h : 4);
        }, 0);
        return { ...item, x: 0, y: yPos, w: 12, h: height };
    })
    : currentActiveLayout;

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 md:p-8 flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)] mx-auto mb-4"></div>
          <p className="text-text-secondary text-base font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 md:p-8 flex items-center justify-center bg-[var(--bg-secondary)]">
        <div className="text-center max-w-sm mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Connection Error</h3>
          <p className="text-text-secondary text-base font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[var(--bg-secondary)]">
      <div className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-h1">Welcome back, {getUserDisplayName(user)}</h1>
              <div className="h-8 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={sublineKey}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5 }}
                    className="text-body-large text-text-secondary"
                  >
                    {subline}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              {isCustomizeMode ? (
                <>
                  <Button onClick={() => setIsLibraryOpen(true)} variant="outline" size="sm" className="btn-secondary">
                    <Plus className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Add Widget</span>
                  </Button>
                  <Button onClick={undo} disabled={!canUndo} variant="outline" size="sm" className="btn-secondary">
                    <Undo className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Undo</span>
                  </Button>
                  <Button onClick={redo} disabled={!canRedo} variant="outline" size="sm" className="btn-secondary">
                    <Redo className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Redo</span>
                  </Button>
                   <Button onClick={handleResetLayout} variant="outline" size="sm" className="btn-secondary">
                    <RotateCcw className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Reset</span>
                  </Button>
                  <Button onClick={handleSaveLayout} className="bg-green-600 hover:bg-green-700 text-white shadow-lg" size="sm">
                    <Save className="w-4 h-4 mr-1"/><span className="hidden sm:inline">Save Layout</span><span className="sm:hidden">Save</span>
                  </Button>
                </>
              ) : (
                <>
                  <Link to={createPageUrl("NewEntry")}>
                    <Button className="btn-primary">
                      <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="truncate">New Entry</span>
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleCustomizeToggle} 
                    variant="outline" 
                    className="btn-secondary"
                  >
                    <Settings className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Customize</span>
                  </Button>
                </>
              )}
            </div>
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
                  onRemove={() => handleToggleWidget(widgetData)}
                >
                  <WidgetComponent {...widgetProps} />
                </DashboardWidget>
              );
            })}
          </DashboardContainer>

          {layouts[activeLayoutKey] && layouts[activeLayoutKey].length === 0 && !isCustomizeMode && (
            <div className="text-center py-12 sm:py-16 px-4">
              <Target className="w-12 h-12 sm:w-16 sm:h-16 text-text-muted mx-auto mb-4 sm:mb-6" />
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2 break-words">Your dashboard is empty</h3>
              <p className="text-text-muted mb-4 sm:mb-6 break-words max-w-md mx-auto">Customize your dashboard by adding widgets that matter to you</p>
              <Button onClick={() => { handleCustomizeToggle(); setIsLibraryOpen(true); }} className="btn-primary">
                <Settings className="w-4 h-4 mr-2" />Add Widgets
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <WidgetSelector
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onToggleWidget={handleToggleWidget}
        availableWidgets={AVAILABLE_WIDGETS}
        activeWidgetIds={layouts.desktop.map(item => item.id)}
        userType="client"
      />
    </div>
  );
}
