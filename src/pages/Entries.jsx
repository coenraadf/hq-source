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
  LayoutGrid,
  List
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

import EntryCard from "../components/entries/EntryCard";
import EntryFilters from "../components/entries/EntryFilters";
import EntryStats from "../components/entries/EntryStats";
import EditEntryModal from "../components/entries/EditEntryModal";

const typeIcons = {
  note: FileText,
  journal: BookOpen,
  insight: Lightbulb,
  breakthrough: Sparkles,
  reflection: Heart,
  coaching_session: MessageSquare,
  personality_test: Brain,
};

export default function EntriesPage() {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    mood: "all",
    visibility: "all",
    breakthrough: "all",
    dateRange: "all"
  });
  const [viewMode, setViewMode] = useState("grid");
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [entries, searchQuery, filters]);

  const loadEntries = async () => {
    setIsLoading(true);
    try {
      const data = await Entry.list("-created_date");
      setEntries(data);
    } catch (error) {
      console.error("Error loading entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...entries];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (filters.type !== "all") {
      filtered = filtered.filter(entry => entry.type === filters.type);
    }

    if (filters.mood !== "all") {
      filtered = filtered.filter(entry => entry.mood === filters.mood);
    }

    if (filters.visibility !== "all") {
      filtered = filtered.filter(entry => entry.visibility === filters.visibility);
    }

    if (filters.breakthrough === "breakthroughs") {
      filtered = filtered.filter(entry => entry.is_breakthrough);
    } else if (filters.breakthrough === "regular") {
      filtered = filtered.filter(entry => !entry.is_breakthrough);
    }

    if (filters.dateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(entry => 
        new Date(entry.created_date) >= filterDate
      );
    }

    setFilteredEntries(filtered);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      mood: "all",
      visibility: "all",
      breakthrough: "all",
      dateRange: "all"
    });
    setSearchQuery("");
  };
  
  const handleOpenEditModal = (entry) => {
    setEditingEntry(entry);
  };
  
  const handleCloseEditModal = () => {
    setEditingEntry(null);
  };

  const handleSaveChanges = async (updatedData) => {
    if (!editingEntry) return;
    try {
      await Entry.update(editingEntry.id, updatedData);
      handleCloseEditModal();
      loadEntries();
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== "all").length + (searchQuery ? 1 : 0);

  return (
    <div className="min-h-full p-4 sm:p-6 md:p-8 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6"
        >
          <div className="min-w-0 flex-1">
            <h1 className="text-h1 mb-2 break-words">My Notes</h1>
            <p className="text-body-large text-text-secondary break-words">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <EntryStats entries={entries} />
        </motion.div>

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
                className="pl-10 form-input"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={activeFiltersCount === 0}
                className="btn-secondary"
              >
                <Filter className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Clear Filters</span>
                <span className="sm:hidden">Clear</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-[rgba(var(--brand-primary-r),var(--brand-primary-g),var(--brand-primary-b),0.2)] text-[var(--brand-primary)]">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          <EntryFilters 
            filters={filters} 
            onFiltersChange={handleFilterChange}
            entries={entries}
          />
        </motion.div>

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
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}
            >
              <LayoutGrid className="w-4 h-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse bg-white/90 backdrop-blur-sm border-[var(--border-color)] h-48" />
              ))}
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-12 sm:py-16 px-4 base-card">
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
                  index={index}
                  viewMode={viewMode}
                  onClick={() => handleOpenEditModal(entry)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <EditEntryModal 
        entry={editingEntry}
        isOpen={!!editingEntry}
        onClose={handleCloseEditModal}
        onSave={handleSaveChanges}
      />
    </div>
  );
}