
import React, { useState, useEffect } from "react";
import { Entry } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Search,
  Filter,
  Plus,
  Calendar,
  FileText,
  BookOpen,
  Lightbulb,
  Heart,
  MessageSquare,
  Brain,
  Sparkles,
  Tag,
  Eye,
  Users,
  Lock,
  X
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

import EntryCard from "../components/entries/EntryCard";
import EntryFilters from "../components/entries/EntryFilters";
import EntryStats from "../components/entries/EntryStats";
import EditEntryModal from "../components/entries/EditEntryModal";

const typeIcons = {
  "default": FileText, // A default icon if type isn't matched
  "note": FileText,
  "idea": Lightbulb,
  "journal": BookOpen,
  "reflection": Brain,
  "insight": Sparkles,
  "memory": Heart,
  "discussion": MessageSquare,
  // Add more as needed based on defined entry types
};

export default function EntriesPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    dateRange: "all",
    tag: "all",
  });
  const [viewMode, setViewMode] = useState("grid"); // Can be 'grid' or 'list'
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  const loadEntries = async () => {
    setIsLoading(true);
    // Simulate API call with mock data
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockEntries: Entry[] = [
      { id: "1", title: "First Note on React", content: "This is a test note about React and JavaScript. It has some tags like #tech and #coding.", type: "note", tags: ["tech", "coding", "react"], createdAt: new Date("2023-01-15T10:00:00Z").toISOString() },
      { id: "2", title: "Idea for a new app", content: "A mobile app that tracks daily mood and provides insights.", type: "idea", tags: ["app-dev", "health", "innovation"], createdAt: new Date("2023-02-20T14:30:00Z").toISOString() },
      { id: "3", title: "Journal Entry: Day 1", content: "Started a new habit tracker today, feeling positive.", type: "journal", tags: ["habit", "self-improvement"], createdAt: new Date("2023-03-01T09:15:00Z").toISOString() },
      { id: "4", title: "Reflection on productivity", content: "How to stay focused for longer periods, exploring techniques like Pomodoro.", type: "reflection", tags: ["productivity", "mindset"], createdAt: new Date("2023-03-10T11:00:00Z").toISOString() },
      { id: "5", title: "Meeting Notes: Project Alpha", content: "Discussed Q2 goals and deliverables for the new project.", type: "note", tags: ["work", "project"], createdAt: new Date("2023-03-25T16:00:00Z").toISOString() },
      { id: "6", title: "Insight: The power of compound learning", content: "Small consistent efforts lead to significant gains over time.", type: "insight", tags: ["learning", "growth"], createdAt: new Date("2023-04-05T08:00:00Z").toISOString() },
      { id: "7", title: "Dream analysis", content: "Recalling last night's vivid dream and its potential meanings.", type: "memory", tags: ["dream", "psychology"], createdAt: new Date("2023-04-12T22:00:00Z").toISOString() },
      { id: "8", title: "Discussion with team about new features", content: "Brainstorming session outcomes for upcoming software features.", type: "discussion", tags: ["team", "features"], createdAt: new Date("2023-04-20T13:00:00Z").toISOString() },
      { id: "9", title: "Book Summary: Atomic Habits", content: "Key takeaways from the book on building good habits and breaking bad ones.", type: "note", tags: ["books", "habits"], createdAt: new Date("2024-05-01T10:00:00Z").toISOString() },
      { id: "10", title: "New recipe idea: Vegan lasagna", content: "Experimenting with plant-based ingredients for a healthy and delicious meal.", type: "idea", tags: ["cooking", "vegan"], createdAt: new Date("2024-05-05T18:00:00Z").toISOString() },
      { id: "11", title: "Daily gratitude journal", content: "Listing things I'm grateful for today.", type: "journal", tags: ["gratitude", "mindfulness"], createdAt: new Date("2024-05-15T08:30:00Z").toISOString() },
      { id: "12", title: "Learning Golang basics", content: "Starting with Go for backend development.", type: "note", tags: ["tech", "golang"], createdAt: new Date("2024-05-16T11:00:00Z").toISOString() },
      { id: "13", title: "Weekend plan for hiking", content: "Planning a trip to the nearest national park.", type: "reflection", tags: ["travel", "outdoor"], createdAt: new Date("2024-05-17T09:00:00Z").toISOString() },
      { id: "14", title: "Insight: Importance of rest", content: "Realizing that adequate rest significantly improves productivity.", type: "insight", tags: ["wellness", "productivity"], createdAt: new Date("2024-05-18T14:00:00Z").toISOString() },
      { id: "15", title: "Childhood memory: Summer camp", content: "Recalling fun times at summer camp.", type: "memory", tags: ["childhood", "summer"], createdAt: new Date("2024-05-19T16:00:00Z").toISOString() },
      { id: "16", title: "Interview debrief with team", content: "Discussing candidate performance after interviews.", type: "discussion", tags: ["work", "hiring"], createdAt: new Date("2024-05-20T10:00:00Z").toISOString() },
    ];
    setEntries(mockEntries);
    setIsLoading(false);
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
    setIsEditModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      type: "all",
      dateRange: "all",
      tag: "all",
    });
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchQuery === "" ||
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filters.type === "all" || entry.type === filters.type;

    const matchesDateRange = filters.dateRange === "all" || (() => {
      const entryDate = new Date(entry.createdAt);
      const now = new Date();
      if (filters.dateRange === "today") {
        return format(entryDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
      } else if (filters.dateRange === "this_week") {
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
        const endOfWeek = new Date(now.setDate(now.getDate() + 6)); // Saturday
        return entryDate >= startOfWeek && entryDate <= endOfWeek;
      } else if (filters.dateRange === "this_month") {
        return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
      } else if (filters.dateRange === "this_year") {
        return entryDate.getFullYear() === now.getFullYear();
      }
      return true; // Should not reach here for valid dateRange
    })();

    const matchesTag = filters.tag === "all" || entry.tags.includes(filters.tag);

    return matchesSearch && matchesType && matchesDateRange && matchesTag;
  });

  const availableTypes = ["all", ...new Set(entries.map(entry => entry.type))];
  const availableTags = ["all", ...new Set(entries.flatMap(entry => entry.tags))];

  const activeFiltersCount = Object.values(filters).filter(value => value !== "all").length + (searchQuery ? 1 : 0);

  return (
    <div className="min-h-full p-4 sm:p-6 md:p-8 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header - Improved responsive design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6"
        >
          <div className="min-w-0 flex-1">
            <h1 className="text-h1 text-text-primary mb-2 break-words">My Notes</h1>
            <p className="text-body text-text-secondary break-words">
              Your complete collection of thoughts, insights, and reflections
            </p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl("NewEntry")}>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="truncate">New Entry</span>
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card base-card p-4 sm:p-6"
        >
          <EntryStats entries={entries} />
        </motion.div>

        {/* Search and Filters - Improved responsive layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
              <Input
                placeholder="Search entries, tags, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={activeFiltersCount === 0}
                className="btn-secondary"
              >
                <X className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Clear Filters</span>
                <span className="sm:hidden">Clear</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-amber-100 text-amber-800">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          <EntryFilters
            filters={filters}
            setFilters={setFilters}
            availableTypes={availableTypes}
            availableTags={availableTags}
          />
        </motion.div>

        {/* Results Header - Improved responsive design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <p className="text-text-secondary break-words">
            Showing {filteredEntries.length} of {entries.length} entries
          </p>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`text-xs sm:text-sm px-2 sm:px-3 ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={`text-xs sm:text-sm px-2 sm:px-3 ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
            >
              List
            </Button>
          </div>
        </motion.div>

        {/* Entries Grid/List - Improved responsive grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse base-card">
                  <CardHeader>
                    <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-stone-200 rounded"></div>
                      <div className="h-3 bg-stone-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4">
              <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-text-muted mx-auto mb-4 sm:mb-6" />
              <h3 className="text-lg sm:text-xl font-semibold text-text-primary mb-2 break-words">
                {searchQuery || activeFiltersCount > 0 ? "No entries match your criteria" : "No entries yet"}
              </h3>
              <p className="text-text-secondary mb-4 sm:mb-6 break-words max-w-md mx-auto">
                {searchQuery || activeFiltersCount > 0
                  ? "Try adjusting your search or filters"
                  : "Start your journey by creating your first entry"
                }
              </p>
              <Link to={createPageUrl("NewEntry")}>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Entry
                </Button>
              </Link>
            </div>
          ) : (
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                : "space-y-4"
            }>
              {filteredEntries.map((entry, index) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onEdit={handleEdit}
                  viewMode={viewMode}
                  typeIcons={typeIcons}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <EditEntryModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        entry={editingEntry}
        onSave={loadEntries}
      />
    </div>
  );
}
