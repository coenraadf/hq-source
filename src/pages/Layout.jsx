

import React, { useState, useEffect, Fragment } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  PenTool,
  MessageSquare,
  FileText,
  User as UserIcon,
  Heart,
  Library,
  Users,
  Calendar,
  BarChart3,
  Sparkles,
  TestTube,
  LogOut,
  Loader2,
  Settings,
  Menu,
  X,
  Target,
  Compass,
  Edit,
  PanelLeftClose,
  PanelLeftOpen,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MenuEditor from "./components/layout/MenuEditor";

// Navigation items for clients
const clientNavigationItems = [
  { title: "Dashboard", icon: Home, url: "Dashboard" },
  { title: "New Entry", icon: PenTool, url: "NewEntry" },
  { title: "My Notes", icon: FileText, url: "Entries" },
  { title: "Goals", icon: Target, url: "Goals" },
  { title: "Ask Yourself", icon: MessageSquare, url: "Chat" },
  { title: "My Coach", icon: Heart, url: "MyCoach" },
  { title: "Resource Library", icon: Library, url: "Resources" },
  { title: "Breakthroughs", icon: Sparkles, url: "Breakthroughs" },
  { title: "Personality Tests", icon: TestTube, url: "PersonalityTests" },
  { title: "Messages", icon: MessageSquare, url: "Messages" }
];

// Navigation items for coaches
const coachNavigationItems = [
  { title: "Coach Dashboard", icon: Home, url: "CoachDashboard" },
  { title: "Client Management", icon: Users, url: "ClientManagement" },
  { title: "Schedule", icon: Calendar, url: "CoachSchedule" },
  { title: "Analytics", icon: BarChart3, url: "CoachAnalytics" },
  { title: "Breakthroughs", icon: Sparkles, url: "CoachBreakthroughs" },
  { title: "Resources", icon: Library, url: "Resources" },
  { title: "Messages", icon: MessageSquare, url: "Messages" }
];

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuCustomizeMode, setIsMenuCustomizeMode] = useState(false);
  const [visibleMenuItems, setVisibleMenuItems] = useState([]);
  const [authCheckInProgress, setAuthCheckInProgress] = useState(false);

  // Define public pages that don't require authentication - COMPREHENSIVE LIST
  const publicPages = [
    // Home Pages
    createPageUrl("MyHQHome"),
    createPageUrl("CoachLanding"),

    // About Pages
    createPageUrl("AboutMyHQ"),
    createPageUrl("AboutCoHQ"),

    // Pricing Pages
    createPageUrl("CoHQPricing"),

    // Contact Pages
    createPageUrl("MyHQContact"),
    createPageUrl("CoHQContact"),
    createPageUrl("Contact"),

    // FAQ Pages
    createPageUrl("MyHQFAQ"),
    createPageUrl("CoHQFAQ"),

    // Legal Pages
    createPageUrl("TermsOfService"),
    createPageUrl("PrivacyPolicy"),

    // Pitch/Investor Pages
    createPageUrl("InvestorOpportunity"),
    createPageUrl("BetaInvestorCircle"),

    // Other Public Pages
    createPageUrl("EnterpriseSolutions"),
    createPageUrl("CoachFeatures"),
    createPageUrl("CoachBetaSignup"),
    createPageUrl("RequestDemo"),
    createPageUrl("ClientOnboarding"),

    // Setup (special case - accessed during onboarding)
    createPageUrl("SetupProfile")
  ];

  const isPublicPage = publicPages.includes(location.pathname);

  useEffect(() => {
    if (!isPublicPage) {
      checkAuthenticationAndSetup();
    } else {
      setIsLoading(false);
      setUser(null);
    }
  }, [location.pathname, isPublicPage]);

  useEffect(() => {
    if (user) {
      const menuKey = user.user_type === 'coach' ? 'coach_menu_items' : 'client_menu_items';

      try {
        let savedMenu = null;
        if (typeof window !== 'undefined' && window.localStorage) {
          savedMenu = window.localStorage.getItem(menuKey);
        }

        if (savedMenu) {
          const parsedMenu = JSON.parse(savedMenu);
          if (Array.isArray(parsedMenu) && parsedMenu.length > 0) {
            setVisibleMenuItems(parsedMenu);
          } else {
            const defaultItems = user.user_type === 'coach'
              ? coachNavigationItems.map(item => item.title)
              : clientNavigationItems.map(item => item.title);
            setVisibleMenuItems(defaultItems);
          }
        } else {
          const defaultItems = user.user_type === 'coach'
            ? coachNavigationItems.map(item => item.title)
            : clientNavigationItems.map(item => item.title);
          setVisibleMenuItems(defaultItems);
        }
      } catch (e) {
        console.warn('Failed to parse saved menu items:', e);
        const defaultItems = user.user_type === 'coach'
          ? coachNavigationItems.map(item => item.title)
          : clientNavigationItems.map(item => item.title);
        setVisibleMenuItems(defaultItems);
      }
    }
  }, [user]);

  const checkAuthenticationAndSetup = async () => {
    if (authCheckInProgress) {
      return;
    }

    try {
      setAuthCheckInProgress(true);
      setIsLoading(true);
      setAuthError(null);

      await new Promise(resolve => setTimeout(resolve, 200));

      const currentUser = await User.me();

      if (currentUser && !currentUser.onboarding_completed) {
        navigate(createPageUrl("SetupProfile"), { replace: true });
        return;
      }

      if (currentUser && currentUser.onboarding_completed) {
        setUser(currentUser);
      } else {
        handleAuthenticationFailure();
      }
    } catch (error) {
      console.error("Layout: Authentication check failed:", error);
      
      // Check if this is a 401/authentication error
      const isAuthError = error?.response?.status === 401 || 
                         error?.status === 401 || 
                         (typeof error.message === 'string' && (
                           error.message.includes('401') || 
                           error.message.includes('Unauthorized') ||
                           error.message.includes('Request failed with status code 401')
                         ));
      
      if (isAuthError) {
        handleAuthenticationFailure();
      } else {
        // For other errors (network, etc.), show a retry message
        setAuthError("We're having trouble connecting to our servers. Please wait a moment and try refreshing the page.");
        setUser(null);
      }
    } finally {
      setIsLoading(false);
      setAuthCheckInProgress(false);
    }
  };

  const handleAuthenticationFailure = () => {
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
    
    // Default to CoachLanding as main homepage, only redirect to MyHQHome for explicit client routes
    const isClientRoute = location.pathname.toLowerCase().includes('myhq') || 
                         location.pathname.toLowerCase().includes('compass') ||
                         location.pathname.toLowerCase().includes('client');
    const redirectUrl = isClientRoute 
      ? createPageUrl("MyHQHome")
      : createPageUrl("CoachLanding");
    
    // Use setTimeout to avoid immediate redirect during render
    setTimeout(() => {
      window.location.replace(redirectUrl);
    }, 100);
  };

  const handleLogout = async () => {
    try {
      // Clear all authentication data before calling logout
      try {
        if (typeof window !== 'undefined') {
          // Clear session storage completely
          if (window.sessionStorage) {
            window.sessionStorage.clear();
          }
          // Clear relevant localStorage items but keep dashboard layouts
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
        console.warn("Could not clear storage during logout:", storageError);
      }

      // Call the logout API
      await User.logout();
      
      // Reset component state
      setUser(null);
      setAuthError(null);
      
      // Force redirect to public landing page
      const isCoachRoute = location.pathname.toLowerCase().includes('coach') || location.pathname.toLowerCase().includes('cohq');
      const redirectUrl = isCoachRoute 
        ? createPageUrl("CoachLanding") 
        : createPageUrl("MyHQHome");
      
      // Use replace to avoid back button issues
      window.location.replace(redirectUrl);
    } catch (error) {
      console.error("Logout failed:", error);
      
      // Even if logout API fails, clear local state and redirect
      setUser(null);
      setAuthError(null);
      
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
        console.warn("Could not clear storage after logout error:", storageError);
      }
      
      window.location.replace(createPageUrl("MyHQHome"));
    }
  };

  const getUserDisplayName = (user) => {
    if (user?.preferred_display === "username" && user?.username) {
      return `@${user.username}`;
    }
    if (user?.preferred_display === "full_name" && user?.full_name) {
      return user.full_name;
    }
    return user?.preferred_app_name || user?.full_name || 'User';
  };

  const getUserAvatar = (user) => {
    if (user?.profile_photo_url) {
      return user.profile_photo_url;
    }
    return null;
  };

  const handleMenuToggleItem = (itemTitle) => {
    if (!itemTitle) return;

    const currentItems = Array.isArray(visibleMenuItems) ? visibleMenuItems : [];

    setVisibleMenuItems(
      currentItems.includes(itemTitle)
        ? currentItems.filter(title => title !== itemTitle)
        : [...currentItems, itemTitle]
    );
  };

  const handleMenuSaveLayout = () => {
    if (!user) return;

    const menuKey = user.user_type === 'coach' ? 'coach_menu_items' : 'client_menu_items';
    const itemsToSave = Array.isArray(visibleMenuItems) ? visibleMenuItems : [];

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(menuKey, JSON.stringify(itemsToSave));
      }
    } catch (storageError) {
      console.warn("Could not save to localStorage:", storageError);
    }

    setIsMenuCustomizeMode(false);
  };

  const handleMenuCancel = () => {
    if (!user) {
      setIsMenuCustomizeMode(false);
      return;
    }

    const menuKey = user.user_type === 'coach' ? 'coach_menu_items' : 'client_menu_items';

    try {
      let savedMenu = null;
      if (typeof window !== 'undefined' && window.localStorage) {
        savedMenu = window.localStorage.getItem(menuKey);
      }

      if (savedMenu) {
        const parsedMenu = JSON.parse(savedMenu);
        if (Array.isArray(parsedMenu)) {
          setVisibleMenuItems(parsedMenu);
        } else {
          const defaultItems = user.user_type === 'coach'
            ? coachNavigationItems.map(item => item.title)
            : clientNavigationItems.map(item => item.title);
          setVisibleMenuItems(defaultItems);
        }
      } else {
        const defaultItems = user.user_type === 'coach'
          ? coachNavigationItems.map(item => item.title)
          : clientNavigationItems.map(item => item.title);
        setVisibleMenuItems(defaultItems);
      }
    } catch (e) {
      console.warn('Error loading saved menu:', e);
      const defaultItems = user.user_type === 'coach'
        ? coachNavigationItems.map(item => item.title)
        : clientNavigationItems.map(item => item.title);
      setVisibleMenuItems(defaultItems);
    }

    setIsMenuCustomizeMode(false);
  };

  const handleMenuResetLayout = () => {
    if (!user) return;

    const defaultItems = user.user_type === 'coach'
      ? coachNavigationItems.map(item => item.title)
      : clientNavigationItems.map(item => item.title);
    setVisibleMenuItems(defaultItems);

    const menuKey = user.user_type === 'coach' ? 'coach_menu_items' : 'client_menu_items';

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(menuKey);
      }
    } catch (storageError) {
      console.warn("Could not remove from localStorage:", storageError);
    }
  };

  // For public pages, just return the children without layout
  if (isPublicPage) {
    const isCoachRoute = location.pathname.toLowerCase().includes('coach') || 
                         location.pathname.toLowerCase().includes('cohq') ||
                         location.pathname.toLowerCase().includes('enterprise');
    return (
      <>
        <style>
        {`
          /* Global Font Stack */
          * {
            font-family: -apple-system, BlinkMacSystemFont, "Inter", "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }

          /* NEW BRANDING SYSTEM - CSS Custom Properties */
          :root {
            /* CO | HQ Brand Colors (formerly CORE | COACH) */
            --coach-primary: #27598a;
            --coach-primary-r: 39;
            --coach-primary-g: 89;
            --coach-primary-b: 138;
            --coach-primary-light: #3a6ba3;
            --coach-primary-light-r: 58;
            --coach-primary-light-g: 107;
            --coach-primary-light-b: 163;
            --coach-primary-dark: #1e4671;
            --coach-primary-dark-r: 30;
            --coach-primary-dark-g: 70;
            --coach-primary-dark-b: 113;

            /* MY | HQ Brand Colors (formerly CORE | COMPASS) */
            --compass-primary: #53766e;
            --compass-primary-r: 83;
            --compass-primary-g: 118;
            --compass-primary-b: 110;
            --compass-primary-light: #6a9087;
            --compass-primary-light-r: 106;
            --compass-primary-light-g: 144;
            --compass-primary-light-b: 135;
            --compass-primary-dark: #425d55;
            --compass-primary-dark-r: 66;
            --compass-primary-dark-g: 93;
            --compass-primary-dark-b: 85;

            /* Dynamic Variables based on theme */
            --brand-primary: ${isCoachRoute ? 'var(--coach-primary)' : 'var(--compass-primary)'};
            --brand-primary-light: ${isCoachRoute ? 'var(--coach-primary-light)' : 'var(--compass-primary-light)'};
            --brand-primary-dark: ${isCoachRoute ? 'var(--coach-primary-dark)' : 'var(--compass-primary-dark)'};

            /* RGB components for dynamic rgba() usage */
            --brand-primary-r: ${isCoachRoute ? 'var(--coach-primary-r)' : 'var(--compass-primary-r)'};
            --brand-primary-g: ${isCoachRoute ? 'var(--coach-primary-g)' : 'var(--compass-primary-g)'};
            --brand-primary-b: ${isCoachRoute ? 'var(--coach-primary-b)' : 'var(--compass-primary-b)'};

            --brand-primary-light-r: ${isCoachRoute ? 'var(--coach-primary-light-r)' : 'var(--compass-primary-light-r)'};
            --brand-primary-light-g: ${isCoachRoute ? 'var(--coach-primary-light-g)' : 'var(--compass-primary-light-g)'};
            --brand-primary-light-b: ${isCoachRoute ? 'var(--coach-primary-light-b)' : 'var(--compass-primary-light-b)'};

            --brand-primary-dark-r: ${isCoachRoute ? 'var(--coach-primary-dark-r)' : 'var(--compass-primary-dark-r)'};
            --brand-primary-dark-g: ${isCoachRoute ? 'var(--coach-primary-dark-g)' : 'var(--compass-primary-dark-g)'};
            --brand-primary-dark-b: ${isCoachRoute ? 'var(--coach-primary-dark-b)' : 'var(--compass-primary-dark-b)'};

            /* Secondary color (opposite theme) */
            --brand-secondary: ${isCoachRoute ? 'var(--compass-primary)' : 'var(--coach-primary)'};

            /* Base Backgrounds - Alternating Section Pattern */
            --bg-primary: #FFFFFF;
            --bg-secondary: #F9FAFB;
            --border-color: #E5E7EB;
            --text-primary: #111827;
            --text-secondary: #374151;
            --text-muted: #6B7280;

            /* Functional Colors */
            --success: #10B981;
            --warning: #F59E0B;
            --error: #EF4444;
            --info: #3B82F6;
          }

          /* ========== STANDARDIZED GRADIENTS ========== */
          .brand-gradient {
            background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%);
          }

          .brand-gradient-soft {
            background: linear-gradient(135deg, rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.08) 0%, rgba(var(--brand-primary-dark-r), var(--brand-primary-dark-g), var(--brand-primary-dark-b), 0.06) 100%);
          }

          .coach-brand-gradient {
            background: linear-gradient(135deg, var(--coach-primary) 0%, var(--coach-primary-dark) 100%);
          }

          .coach-brand-gradient-soft {
            background: linear-gradient(135deg, rgba(var(--coach-primary-r), var(--coach-primary-g), var(--coach-primary-b), 0.08) 0%, rgba(var(--coach-primary-dark-r), var(--coach-primary-dark-g), var(--coach-primary-dark-b), 0.06) 100%);
          }

          .compass-brand-gradient {
            background: linear-gradient(135deg, var(--compass-primary) 0%, var(--compass-primary-dark) 100%);
          }

          .compass-brand-gradient-soft {
            background: linear-gradient(135deg, rgba(var(--compass-primary-r), var(--compass-primary-g), var(--compass-primary-b), 0.08) 0%, rgba(var(--compass-primary-dark-r), var(--compass-primary-dark-g), var(--compass-primary-dark-b), 0.06) 100%);
          }

          /* ========== STANDARDIZED BUTTON STYLES ========== */
          .btn-primary {
            background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%);
            color: #FFFFFF;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            transition: all 0.2s ease-in-out;
            border: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .btn-primary:hover {
            background: linear-gradient(135deg, var(--brand-primary-dark) 0%, var(--brand-primary) 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 6px -1px rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.15);
          }

          .btn-primary:active {
            transform: translateY(0px);
          }

          .btn-secondary {
            background: rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.1);
            color: var(--brand-primary);
            border: 1px solid rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.2);
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: all 0.2s ease-in-out;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .btn-secondary:hover {
            background: rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.15);
            border-color: var(--brand-primary);
          }

          /* ========== CARD STRUCTURES ========== */
          .base-card {
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            transition: all 0.3s ease-in-out;
          }

          .base-card:hover {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border-color: rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.2);
          }

          .feature-card {
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 0.75rem;
            padding: 2rem;
            transition: all 0.3s ease-in-out;
            text-align: center;
          }

          .feature-card:hover {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border-color: rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.2);
            transform: translateY(-2px);
          }

          /* ========== ICON CONTAINERS ========== */
          .icon-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 3rem; /* 48px */
            height: 3rem; /* 48px */
            border-radius: 0.75rem;
            flex-shrink: 0;
          }

          .icon-container-branded {
            background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%);
            color: #FFFFFF;
          }

          .icon-container-soft {
             background: rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.1);
             color: var(--brand-primary);
          }

          /* ========== FORM ELEMENTS ========== */
          .form-input {
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            font-size: 1rem;
            transition: all 0.2s ease;
            color: var(--text-primary);
          }

          .form-input:focus {
            border-color: var(--brand-primary);
            box-shadow: 0 0 0 3px rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.1);
            outline: none;
          }

          /* ========== STATUS BADGES ========== */
          .badge-success {
            background: rgba(16, 185, 129, 0.1);
            color: #059669;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
          }

          .badge-warning {
            background: rgba(245, 158, 11, 0.1);
            color: #d97706;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
          }

          .badge-info {
            background: rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.1);
            color: var(--brand-primary);
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
          }

          /* ========== NAVIGATION ITEMS ========== */
          .nav-item {
            padding: 0.75rem 1rem;
            margin: 0.5rem;
            border-radius: 0.5rem;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 500;
            color: var(--text-secondary);
          }

          .nav-item.active {
            background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%);
            color: #FFFFFF;
            box-shadow: 0 2px 4px rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.15);
          }

          .nav-item:hover:not(.active) {
            background: rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.1);
            color: var(--brand-primary);
          }

          /* ========== LOADING STATES ========== */
          .loading {
            opacity: 0.6;
            cursor: not-allowed;
            transition: opacity 0.2s ease;
          }

          .spinner {
            border: 2px solid var(--border-color);
            border-top: 2px solid var(--brand-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* ========== TYPOGRAPHY SCALE ========== */
          .text-display {
            font-size: 3.75rem;
            font-weight: 700;
            color: var(--text-primary);
            line-height: 1.2;
          }

          .text-h1 {
            font-size: 2.25rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
          }

          .text-h2 {
            font-size: 1.875rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 1rem;
          }

          .text-h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 0.75rem;
          }

          .text-body {
            font-size: 1rem;
            font-weight: 400;
            color: var(--text-secondary);
            line-height: 1.6;
          }

          .text-body-large {
            font-size: 1.25rem;
            font-weight: 400;
            color: var(--text-secondary);
            line-height: 1.6;
          }

          .text-small {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--brand-primary);
          }

          .text-micro {
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--text-muted);
          }

          /* ========== SECTION BACKGROUNDS ========== */
          .section-primary {
            background: var(--bg-primary);
          }

          .section-secondary {
            background: var(--bg-secondary);
          }

          .content-section {
            position: relative;
            z-index: 1;
          }
        `}
        </style>
        {children}
      </>
    );
  }

  // Show loading while checking authentication for protected pages
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-[#FFFFFF] to-[#F9FAFB]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#27598a]" />
          <p className="text-[#374151] text-base font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If there's a server error, show a dedicated error screen
  if (authError) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-[#FFFFFF] to-[#F9FAFB]">
            <div className="text-center max-w-md mx-auto">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-stone-800 mb-2">Server Connection Error</h2>
                <p className="text-lg text-stone-600 mb-6">{authError}</p>
                <Button onClick={() => window.location.reload()} className="btn-primary">
                    Refresh Page
                </Button>
            </div>
        </div>
    );
  }

  // If no user after auth check (and no server error), show "Redirecting..."
  if (!user) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-[#FFFFFF] to-[#F9FAFB]">
             <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#27598a]" />
                 <p className="text-[#374151] text-base font-medium">Redirecting to login...</p>
            </div>
        </div>
    );
  }

  const isCoach = user.user_type === "coach";
  const isAdmin = false;
  let allNavigationItems = isCoach ? coachNavigationItems : clientNavigationItems;

  const BrandIcon = isCoach ? Users : Compass;

  const safeVisibleMenuItems = Array.isArray(visibleMenuItems) ? visibleMenuItems : [];
  const filteredNavigationItems = allNavigationItems.filter(item =>
    item && item.title && safeVisibleMenuItems.includes(item.title)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFFF] to-[#F9FAFB] flex">
      <style>
        {`
          /* Global Font Stack */
          * {
            font-family: -apple-system, BlinkMacSystemFont, "Inter", "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }

          /* NEW BRANDING SYSTEM - CSS Custom Properties */
          :root {
            /* CO | HQ Brand Colors (formerly CORE | COACH) */
            --coach-primary: #27598a;
            --coach-primary-r: 39;
            --coach-primary-g: 89;
            --coach-primary-b: 138;
            --coach-primary-light: #3a6ba3;
            --coach-primary-light-r: 58;
            --coach-primary-light-g: 107;
            --coach-primary-light-b: 163;
            --coach-primary-dark: #1e4671;
            --coach-primary-dark-r: 30;
            --coach-primary-dark-g: 70;
            --coach-primary-dark-b: 113;

            /* MY | HQ Brand Colors (formerly CORE | COMPASS) */
            --compass-primary: #53766e;
            --compass-primary-r: 83;
            --compass-primary-g: 118;
            --compass-primary-b: 110;
            --compass-primary-light: #6a9087;
            --compass-primary-light-r: 106;
            --compass-primary-light-g: 144;
            --compass-primary-light-b: 135;
            --compass-primary-dark: #425d55;
            --compass-primary-dark-r: 66;
            --compass-primary-dark-g: 93;
            --compass-primary-dark-b: 85;

            /* Dynamic Variables based on user type */
            --brand-primary: ${isCoach ? 'var(--coach-primary)' : 'var(--compass-primary)'};
            --brand-primary-light: ${isCoach ? 'var(--coach-primary-light)' : 'var(--compass-primary-light)'};
            --brand-primary-dark: ${isCoach ? 'var(--coach-primary-dark)' : 'var(--compass-primary-dark)'};

            /* RGB components for dynamic rgba() usage */
            --brand-primary-r: ${isCoach ? 'var(--coach-primary-r)' : 'var(--compass-primary-r)'};
            --brand-primary-g: ${isCoach ? 'var(--coach-primary-g)' : 'var(--compass-primary-g)'};
            --brand-primary-b: ${isCoach ? 'var(--coach-primary-b)' : 'var(--compass-primary-b)'};

            --brand-primary-light-r: ${isCoach ? 'var(--coach-primary-light-r)' : 'var(--compass-primary-light-r)'};
            --brand-primary-light-g: ${isCoach ? 'var(--coach-primary-light-g)' : 'var(--compass-primary-light-g)'};
            --brand-primary-light-b: ${isCoach ? 'var(--coach-primary-light-b)' : 'var(--compass-primary-light-b)'};

            --brand-primary-dark-r: ${isCoach ? 'var(--coach-primary-dark-r)' : 'var(--compass-primary-dark-r)'};
            --brand-primary-dark-g: ${isCoach ? 'var(--coach-primary-dark-g)' : 'var(--compass-primary-dark-g)'};
            --brand-primary-dark-b: ${isCoach ? 'var(--coach-primary-dark-b)' : 'var(--compass-primary-dark-b)'};

            /* Secondary color (opposite theme) */
            --brand-secondary: ${isCoach ? 'var(--compass-primary)' : 'var(--coach-primary)'};

            /* Base Backgrounds - Alternating Section Pattern */
            --bg-primary: #FFFFFF;
            --bg-secondary: #F9FAFB;
            --border-color: #E5E7EB;
            --text-primary: #111827;
            --text-secondary: #374151;
            --text-muted: #6B7280;

            /* Functional Colors */
            --success: #10B981;
            --warning: #F59E0B;
            --error: #EF4444;
            --info: #3B82F6;
          }

          /* All the same CSS styles as in the public section above */
          .brand-gradient {
            background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%);
          }

          .brand-gradient-soft {
            background: linear-gradient(135deg, rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.08) 0%, rgba(var(--brand-primary-dark-r), var(--brand-primary-dark-g), var(--brand-primary-dark-b), 0.06) 100%);
          }

          .coach-brand-gradient {
            background: linear-gradient(135deg, var(--coach-primary) 0%, var(--coach-primary-dark) 100%);
          }

          .compass-brand-gradient {
            background: linear-gradient(135deg, var(--compass-primary) 0%, var(--compass-primary-dark) 100%);
          }

          .btn-primary {
            background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%);
            color: #FFFFFF;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            transition: all 0.2s ease-in-out;
            border: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .btn-primary:hover {
            background: linear-gradient(135deg, var(--brand-primary-dark) 0%, var(--brand-primary) 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.15);
          }

          .btn-secondary {
            background: rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.1);
            color: var(--brand-primary);
            border: 1px solid rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.2);
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: all 0.2s ease-in-out;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .btn-secondary:hover {
            background: rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.15);
            border-color: var(--brand-primary);
          }

          .base-card {
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 0.75rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            padding: 1.5rem;
            transition: all 0.3s ease-in-out;
          }

          .base-card:hover {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border-color: rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.2);
          }

          .feature-card {
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-radius: 0.75rem;
            padding: 2rem;
            transition: all 0.3s ease-in-out;
            text-align: center;
          }

          .feature-card:hover {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border-color: rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.2);
            transform: translateY(-2px);
          }

          /* ========== ICON CONTAINERS ========== */
          .icon-container {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 3rem; /* 48px */
            height: 3rem; /* 48px */
            border-radius: 0.75rem;
            flex-shrink: 0;
          }

          .icon-container-branded {
            background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%);
            color: #FFFFFF;
          }

          .icon-container-soft {
             background: rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.1);
             color: var(--brand-primary);
          }

          /* ========== FORM ELEMENTS ========== */
          .form-input {
            background: var(--bg-primary);
            border: 2px solid var(--border-color);
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            font-size: 1rem;
            transition: all 0.2s ease;
            color: var(--text-primary);
          }

          .form-input:focus {
            border-color: var(--brand-primary);
            box-shadow: 0 0 0 3px rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.1);
            outline: none;
          }

          .nav-item {
            padding: 0.75rem 1rem;
            margin: 0.5rem;
            border-radius: 0.5rem;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 500;
            color: var(--text-secondary);
          }

          .nav-item.active {
            background: linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%);
            color: #FFFFFF;
            box-shadow: 0 2px 4px rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.15);
          }

          .nav-item:hover:not(.active) {
            background: rgba(var(--brand-primary-r), var(--brand-primary-g), var(--brand-primary-b), 0.1);
            color: var(--brand-primary);
          }

          .text-display {
            font-size: 3.75rem;
            font-weight: 700;
            color: var(--text-primary);
            line-height: 1.2;
          }

          .text-h1 {
            font-size: 2.25rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
          }

          .text-h2 {
            font-size: 1.875rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 1rem;
          }

          .text-h3 {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 0.75rem;
          }

          .text-body {
            font-size: 1rem;
            font-weight: 400;
            color: var(--text-secondary);
            line-height: 1.6;
          }

          .text-body-large {
            font-size: 1.25rem;
            font-weight: 400;
            color: var(--text-secondary);
            line-height: 1.6;
          }

          .section-primary {
            background: var(--bg-primary);
          }

          .section-secondary {
            background: var(--bg-secondary);
          }
        `}
      </style>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Left Sidebar */}
      <div
        className={`bg-[var(--bg-primary)] border-r border-[var(--border-color)] flex flex-col z-50 transition-all duration-300 ease-in-out
                    lg:relative
                    ${isMobileMenuOpen ? "fixed top-0 left-0 h-full w-64 translate-x-0" : "fixed -translate-x-full"}
                    lg:translate-x-0 ${isSidebarOpen ? 'lg:w-64' : 'lg:w-20'}`}
      >
        {/* Menu Editor Overlay */}
        <MenuEditor
          availableItems={allNavigationItems}
          visibleItemTitles={safeVisibleMenuItems}
          onToggleItem={handleMenuToggleItem}
          onSaveLayout={handleMenuSaveLayout}
          onCancel={handleMenuCancel}
          onResetLayout={handleMenuResetLayout}
          isOpen={isMenuCustomizeMode}
          userType={user?.user_type}
        />

        {/* Brand Header */}
        <div className={`p-4 border-b border-[var(--border-color)] flex-shrink-0 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {isSidebarOpen && (
            <Link to={isCoach ? createPageUrl('CoachDashboard') : createPageUrl('Dashboard')} className="flex items-center space-x-3">
              <div className="icon-container-branded w-10 h-10 flex items-center justify-center rounded-lg">
                <BrandIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="font-bold text-[var(--text-primary)] truncate text-base">
                  {isCoach ? "CO | HQ" : "MY | HQ"}
                </h1>
              </div>
            </Link>
          )}
          {/* Collapsed Logo */}
          {!isSidebarOpen && (
             <Link to={isCoach ? createPageUrl('CoachDashboard') : createPageUrl('Dashboard')}>
               <div className="icon-container-branded w-10 h-10 flex items-center justify-center rounded-lg">
                 <BrandIcon className="w-5 h-5" />
               </div>
             </Link>
          )}
        </div>

        {/* Navigation - Scrollable */}
        <nav className={`flex-1 space-y-1 overflow-y-auto ${isSidebarOpen ? 'p-4' : 'p-2'}`}>
          {filteredNavigationItems.map((item) => {
            const isActive = location.pathname === createPageUrl(item.url);
            return (
              <Link key={item.title} to={createPageUrl(item.url)} onClick={() => setIsMobileMenuOpen(false)}>
                <motion.div
                  whileHover={{ x: isSidebarOpen ? 4 : 0 }}
                  whileTap={{ scale: 0.98 }}
                  className={`nav-item ${isActive ? 'active' : ''} ${!isSidebarOpen && 'justify-center'}`}
                  title={item.title}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {isSidebarOpen && <span className="text-sm truncate">{item.title}</span>}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Customize Menu & Toggle Button */}
        <div className={`p-4 border-t border-[var(--border-color)] flex-shrink-0 space-y-2`}>
           <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuCustomizeMode(!isMenuCustomizeMode)}
            className={`w-full text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[rgba(var(--brand-primary-r),var(--brand-primary-g),var(--brand-primary-b),0.1)] truncate ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
            title="Customize Menu"
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            {isSidebarOpen && <span className="ml-2 truncate">Customize Menu</span>}
          </Button>
           <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`w-full hidden lg:flex text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:bg-[rgba(var(--brand-primary-r),var(--brand-primary-g),var(--brand-primary-b),0.1)] truncate ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
            title={isSidebarOpen ? "Collapse Menu" : "Expand Menu"}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-4 h-4 flex-shrink-0" /> : <PanelLeftOpen className="w-4 h-4 flex-shrink-0" />}
            {isSidebarOpen && <span className="ml-2 truncate">Collapse Menu</span>}
          </Button>
        </div>

        {/* User Profile */}
        <div className={`p-2 border-t border-[var(--border-color)] flex-shrink-0 ${!isSidebarOpen && 'p-4'}`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`w-full p-2 h-auto ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
                <div className="flex items-center space-x-3 w-full">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={getUserAvatar(user)} />
                    <AvatarFallback className="text-white text-sm brand-gradient">
                      {getUserDisplayName(user).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isSidebarOpen && (
                    <div className="flex-1 text-left min-w-0">
                      <p className="font-medium text-sm text-[var(--text-primary)] truncate">{getUserDisplayName(user)}</p>
                      <p className="text-xs text-[var(--text-secondary)] truncate opacity-70">View Profile</p>
                    </div>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to={createPageUrl("Profile")} className="flex items-center">
                  <UserIcon className="w-4 h-4 mr-2" />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={createPageUrl("ProfileEditor")} className="flex items-center">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile Picture
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header and Main Content with Scroll */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <header className="lg:hidden p-4 border-b border-[var(--border-color)] bg-[rgba(255,255,255,0.9)] backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-6 h-6 text-[var(--brand-primary)]" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="icon-container-branded w-8 h-8">
                  <BrandIcon className="w-4 h-4" />
                </div>
                <h1 className="font-bold text-[var(--text-primary)] text-md">
                  {isCoach ? "CO | HQ" : "MY | HQ"}
                </h1>
              </div>
               <div className="w-10"></div>
            </div>
          </header>

          <main className="flex-1 bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)]">
            {children}
          </main>
        </div>

        {/* Footer */}
        <footer className="w-full py-4 px-6 border-t border-[var(--border-color)] bg-[rgba(255,255,255,0.8)] backdrop-blur-sm text-center text-sm text-[var(--text-secondary)] opacity-70 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <p>&copy; {new Date().getFullYear()} {isCoach ? "CO | HQ" : "MY | HQ"}. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link to={createPageUrl("TermsOfService")} className="hover:text-[var(--brand-primary)] transition-colors">Terms of Service</Link>
              <Link to={createPageUrl("MyHQFAQ")} className="hover:text-[var(--brand-primary)] transition-colors">Client FAQ</Link>
              <Link to={createPageUrl("CoHQFAQ")} className="hover:text-[var(--brand-primary)] transition-colors">Coach FAQ</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

