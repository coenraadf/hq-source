
import React, { useState, useEffect } from "react";
import { User, Entry, CoachingRelationship } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Settings, Save, X, RotateCcw, Target, Users, Undo, Redo, Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { useAutoSave } from "@/components/hooks/useAutoSave";
import { useResponsiveGrid } from "@/components/hooks/useResponsiveGrid";
import { getSanitizedLayout } from "../components/dashboard/gridUtils";

import DashboardContainer from "../components/dashboard/DashboardContainer";
import DashboardWidget from "../components/dashboard/DashboardWidget";
import WidgetSelector from "../components/dashboard/WidgetSelector";

// Widget components
import NewClientRequestsWidget from "../components/dashboard/widgets/NewClientRequestsWidget";
import ClientEngagementWidget from "../components/dashboard/widgets/ClientEngagementWidget";
import ClientProgressSpotlightWidget from "../components/dashboard/widgets/ClientProgressSpotlightWidget";
import RecentCoachNotesWidget from "../components/dashboard/widgets/RecentCoachNotesWidget";
import ResourceLibraryQuickAccessWidget from "../components/dashboard/widgets/ResourceLibraryQuickAccessWidget";
import CommonThreadsWidget from "../components/dashboard/widgets/CommonThreadsWidget";

import {
  Users as UsersIcon, BarChart3, Lightbulb, FileText, BookOpen,
  Target as TargetIcon
} from "lucide-react";

// List of inspiring sublines for coaches
const coachSublines = [
  "Let's unlock some incredible potential today.",
  "Who are we helping move forward today?",
  "Here's to another day of inspiring growth.",
  "What new insight will you discover today?",
  "Remember, your guidance is shaping tomorrow's leaders.",
  "Ready to use your coaching superpowers?",
  "You're not just changing a game, you're changing a life.",
  "Let's help someone see their own strength today.",
  "Ready to build a bridge to a new possibility?",
  "A single session can start a whole new journey.",
  "Your role today: listen, challenge, and champion.",
  "The greatness is already there. Let's help them see it.",
  "Every client has a story. What will the next chapter be?",
  "Let's turn an \"I can't\" into an \"I can\" today.",
  "Be the brain to pick, the ear to listen, and the push they need.",
  "Your wisdom is the spark. Who will you inspire today?",
  "Look for the potential, not just the performance.",
  "Let's build some confidence and see what happens.",
  "Ready to unlock someone's potential and maximize their growth?",
  "Let's help someone get out of their own way.",
  "What question will you ask today to unlock a new door?",
  "You're more than a coach today; you're a catalyst for change.",
  "One conversation at a time, you're fostering growth.",
  "Coaching is an act of discovery. What will you find today?",
  "Today's mission: make progress, not excuses.",
  "Ready to help someone see what they've been missing?",
  "The best answers are the ones they find themselves.",
  "Your belief in them can become their belief in themselves.",
  "Let's help someone move forward with purpose.",
  "Today is about guiding the journey from potential to performance.",
  "The best view comes after the hardest climb. Time to guide the ascent.",
  "Your impact is measured by the growth of others. Let's make an impact.",
  "Ready to challenge some assumptions and create a breakthrough?",
  "Here's where your listening meets your leadership.",
  "Let's help someone design a life they truly love.",
  "Time to hold up the mirror and let your clients see their own greatness.",
  "Let's cultivate some curiosity and courage today.",
  "Every session is another step toward transformation.",
  "You are an architect of empowerment. What will you build today?",
  "Let's guide someone to become the hero of their own story.",
  "Who are we inspiring to take action today?",
  "Your goal is to empower them so much they no longer need you.",
  "Let's help someone see the path forward.",
  "Your partnership is what creates momentum.",
  "Today is about building clarity and creating change.",
  "You have the power to help someone see a future they couldn't imagine.",
  "Your work creates a ripple effect of positive change.",
  "Ready to turn an obstacle into a stepping stone?",
  "Today's focus: empowering real, tangible progress."
];


const AVAILABLE_WIDGETS = [
  { id: "new_client_requests", title: "New Client Requests", description: "Pending invitations", icon: UsersIcon, category: "clients", component: NewClientRequestsWidget, defaultSize: { w: 4, h: 4 } },
  { id: "client_engagement", title: "Client Engagement", description: "Weekly activity overview", icon: BarChart3, category: "clients", component: ClientEngagementWidget, defaultSize: { w: 8, h: 5 } },
  { id: "client_progress_spotlight", title: "Client Progress", description: "Recent goals and wins", icon: TargetIcon, category: "clients", component: ClientProgressSpotlightWidget, defaultSize: { w: 8, h: 5 } },
  { id: "common_threads", title: "Common Threads", description: "AI analysis of client themes", icon: Lightbulb, category: "insights", component: CommonThreadsWidget, defaultSize: { w: 4, h: 4 } },
  { id: "recent_coach_notes", title: "Your Recent Notes", description: "Notes you've sent to clients", icon: FileText, category: "activity", component: RecentCoachNotesWidget, defaultSize: { w: 8, h: 5 } },
  { id: "resource_library_quick_access", title: "Resource Library", description: "Quick access to your files", icon: BookOpen, category: "tools", component: ResourceLibraryQuickAccessWidget, defaultSize: { w: 4, h: 4 } },
];

const DEFAULT_DESKTOP_LAYOUT = [
  { id: "new_client_requests", x: 0, y: 0, w: 4, h: 4 },
  { id: "client_engagement", x: 4, y: 0, w: 8, h: 5 },
  { id: "client_progress_spotlight", x: 4, y: 5, w: 8, h: 5 },
  { id: "common_threads", x: 0, y: 4, w: 4, h: 6 },
  { id: "recent_coach_notes", x: 0, y: 10, w: 8, h: 5 },
  { id: "resource_library_quick_access", x: 8, y: 10, w: 4, h: 5 },
].map(item => {
    const widget = AVAILABLE_WIDGETS.find(w => w.id === item.id);
    return widget ? { ...item, h: widget.defaultSize.h } : item;
});

const DEFAULT_MOBILE_LAYOUT = DEFAULT_DESKTOP_LAYOUT.map((item, index) => {
    const widget = AVAILABLE_WIDGETS.find(w => w.id === item.id);
    const height = widget ? widget.defaultSize.h : 4;
    const yPos = DEFAULT_DESKTOP_LAYOUT.slice(0, index).reduce((acc, prev) => {
        const prevWidget = AVAILABLE_WIDGETS.find(w => w.id === prev.id);
        return acc + (prevWidget ? prevWidget.defaultSize.h : 4);
    }, 0);
    return { ...item, x: 0, y: yPos, w: 12, h: height };
});


export default function CoachDashboard() {
  const [clients, setClients] = useState([]);
  const [clientEntries, setClientEntries] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [subline, setSubline] = useState("Here's what's happening with your clients.");

  const navigate = useNavigate();

  const { state: layouts, updateState: setLayouts, undo, redo, canUndo, canRedo } = useAutoSave({
    desktop: DEFAULT_DESKTOP_LAYOUT,
    mobile: DEFAULT_MOBILE_LAYOUT,
  }, 1000, 'coach_dashboard_layout_coach');
  
  const { breakpointKey } = useResponsiveGrid();
  const isMobile = breakpointKey === 'xs';
  const activeLayoutKey = isMobile ? 'mobile' : 'desktop';

  useEffect(() => {
    loadCoachData();
    setSubline(coachSublines[Math.floor(Math.random() * coachSublines.length)]);
    try {
      const savedLayouts = localStorage.getItem('coach_dashboard_layout_coach');
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
        
        setLayouts({ desktop: getSanitizedLayout(desktopLayout), mobile: getSanitizedLayout(mobileLayout) }, true);
      }
    } catch (e) {
      console.warn("Failed to load coach layout from localStorage", e);
    }
  }, []);

  const loadCoachData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const coach = await User.me();
      
      if (coach.user_type !== 'coach') {
        console.log("CoachDashboard: User is not a coach, redirecting to client dashboard");
        navigate(createPageUrl("Dashboard"));
        return;
      }
      
      setUser(coach);
      
      const relationships = await CoachingRelationship.filter({ coach_id: coach.id, status: 'active' });

      const clientIds = relationships.map(r => r.client_id).filter(Boolean);
      let clientUsers = [];
      if (clientIds.length > 0) {
        try {
          // Fetch all clients in a single, more efficient call to avoid the User.get() bug
          clientUsers = await User.filter({ id: { "$in": clientIds } });
        } catch (error) {
          console.warn(`Could not fetch clients with IDs [${clientIds.join(', ')}]:`, error);
        }
      }
      
      const clientUsersById = clientUsers.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});
      
      const clientsFromRelationships = relationships.map(relationship => {
        const clientUser = clientUsersById[relationship.client_id];
        const displayName = clientUser?.preferred_app_name 
          || clientUser?.full_name 
          || relationship.client_name
          || (relationship.client_email ? relationship.client_email.split('@')[0] : `Client`);
        
        return {
          id: relationship.client_id,
          email: clientUser?.email || relationship.client_email,
          preferred_app_name: displayName,
          full_name: clientUser?.full_name || displayName,
          relationship: relationship
        };
      });
      
      setClients(clientsFromRelationships);
      
      const clientEmails = clientsFromRelationships.map(c => c.email).filter(Boolean);
      
      if (clientEmails.length > 0) {
        const allClientEntries = await Entry.filter({ created_by: { "$in": clientEmails } }, "-created_date", 50);
        setClientEntries(allClientEntries);
      } else {
        setClientEntries([]);
      }
      
    } catch (err) {
      console.error("Error loading coach dashboard data:", err);
      
      if (err.message && (err.message.includes('401') || err.message.includes('Unauthorized'))) {
        console.log("CoachDashboard: Authentication failed - redirecting to login");
        setError("Your session has expired. Please log in again.");
        
        try {
          if (typeof window !== 'undefined') {
            if (window.sessionStorage) window.sessionStorage.clear();
            if (window.localStorage) {
              const keysToRemove = [];
              for (let i = 0; i < window.localStorage.length; i++) {
                const key = window.localStorage.key(i);
                if (key && !key.includes('dashboard_layout') && !key.includes('menu_items')) {
                  keysToRemove.push(key);
                }
              }
              keysToRemove.forEach(key => window.localStorage.removeItem(key));
            }
          }
        } catch (storageError) {
          console.warn("Could not clear storage:", storageError);
        }
        
        setTimeout(() => {
          window.location.replace(createPageUrl("CoreCoachHome"));
        }, 2000);
        return;
      }
      
      if (err.message && err.message.includes('429')) {
        setError("Too many requests. Please wait a moment and try again.");
        setTimeout(() => {
          if (!user) {
            console.log("CoachDashboard: Retrying after rate limit");
            loadCoachData();
          }
        }, 5000);
        return;
      }
      
      setError("Failed to load dashboard data. Please check your connection and try again.");
      setClients([]);
      setClientEntries([]);
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
  
  const handleRemoveWidget = (id) => {
    const newDesktopLayout = layouts.desktop.filter(item => item.id !== id);
    const newMobileLayout = layouts.mobile.filter(item => item.id !== id);
    setLayouts({ desktop: newDesktopLayout, mobile: newMobileLayout });
  };
  
  const handleResetLayout = () => {
    setLayouts({ desktop: DEFAULT_DESKTOP_LAYOUT, mobile: DEFAULT_MOBILE_LAYOUT });
  };
  
  const handleSaveLayout = () => {
    setIsCustomizeMode(false);
    setIsLibraryOpen(false);
    localStorage.setItem('coach_dashboard_layout_coach', JSON.stringify(layouts));
  }

  const activeWidgetIds = layouts.desktop.map(item => item.id);
  const widgetsForSelector = AVAILABLE_WIDGETS.map(w => ({ ...w, isActive: activeWidgetIds.includes(w.id) }));

  const finalLayout = isMobile
    ? (layouts.mobile || []).map((item, index) => {
        const widget = AVAILABLE_WIDGETS.find(w => w.id === item.id);
        const height = widget ? widget.defaultSize.h : 4;
        const yPos = (layouts.mobile || []).slice(0, index).reduce((acc, prev) => {
            const prevWidget = AVAILABLE_WIDGETS.find(w => w.id === prev.id);
            return acc + (prevWidget ? prevWidget.defaultSize.h : 4);
        }, 0);
        return { ...item, x: 0, y: yPos, w: 12, h: height };
    })
    : layouts.desktop;

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 md:p-8 flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)] mx-auto mb-4" />
          <p className="text-text-secondary">Loading your coach dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 md:p-8 flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center max-w-md mx-auto">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
            <X className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Connection Error</h3>
          <p className="text-body-large text-text-secondary font-medium mb-4">{error}</p>
          {error.includes('session has expired') ? (
            <p className="text-sm text-text-muted">Redirecting to login page...</p>
          ) : (
            <Button onClick={loadCoachData} className="btn-primary">
              Try Again
            </Button>
          )}
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
                    <h1 className="text-h1">Welcome, {getUserDisplayName(user)}</h1>
                    <p className="text-body-large text-text-secondary">{subline}</p>
                </div>
                 <div className="flex gap-2 flex-wrap items-center">
                    {isCustomizeMode ? (
                        <>
                            <Button onClick={undo} disabled={!canUndo} variant="outline" size="sm" className="btn-secondary"><Undo className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Undo</span></Button>
                            <Button onClick={redo} disabled={!canRedo} variant="outline" size="sm" className="btn-secondary"><Redo className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Redo</span></Button>
                            <Button onClick={handleResetLayout} variant="outline" size="sm" className="btn-secondary"><RotateCcw className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Reset</span></Button>
                            <Button onClick={() => setIsLibraryOpen(true)} className="btn-primary" size="sm"><Plus className="w-4 h-4 mr-1"/><span className="hidden sm:inline">Add Widget</span></Button>
                            <Button onClick={handleSaveLayout} className="bg-green-600 hover:bg-green-700 text-white" size="sm"><Save className="w-4 h-4 mr-1"/><span className="hidden sm:inline">Save Layout</span><span className="sm:hidden">Save</span></Button>
                        </>
                    ) : (
                        <>
                           <Link to={createPageUrl("ClientManagement")}><Button className="btn-primary"><UsersIcon className="w-4 h-4 mr-1 sm:mr-2" /><span className="truncate">Manage Clients</span></Button></Link>
                           <Button variant="outline" onClick={() => setIsCustomizeMode(true)} className="btn-secondary"><Settings className="w-4 h-4 sm:mr-2" /><span className="hidden sm:inline">Customize</span></Button>
                        </>
                    )}
                </div>
            </motion.div>

            <DashboardContainer
              layout={finalLayout}
              onLayoutChange={(newActiveLayout) => {
                if(isCustomizeMode) {
                  setLayouts(prev => ({...prev, [activeLayoutKey]: newActiveLayout}));
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
                    onRemove={handleRemoveWidget}
                  >
                    <WidgetComponent 
                        clients={clients}
                        clientEntries={clientEntries}
                        user={user}
                    />
                  </DashboardWidget>
                );
              })}
            </DashboardContainer>

             {finalLayout && finalLayout.length === 0 && !isCustomizeMode && (
              <div className="text-center py-12 sm:py-16 px-4">
                <Target className="w-12 h-12 sm:w-16 sm:h-16 text-text-muted mx-auto mb-4 sm:mb-6" />
                <h3 className="text-lg sm:text-xl font-semibold text-text-secondary mb-2 break-words">Your dashboard is empty</h3>
                <p className="text-text-muted mb-4 sm:mb-6 break-words max-w-md mx-auto">Customize your dashboard by adding widgets that matter to you</p>
                <Button onClick={() => setIsCustomizeMode(true)} className="btn-primary"><Settings className="w-4 h-4 mr-2" />Add Widgets</Button>
              </div>
            )}
        </div>
      </div>
       <WidgetSelector
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onToggleWidget={handleToggleWidget}
        availableWidgets={widgetsForSelector}
        userType="coach"
      />
    </div>
  );
}
