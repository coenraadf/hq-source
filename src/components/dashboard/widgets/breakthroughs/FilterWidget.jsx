import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function FilterWidget({ searchQuery, onSearchChange, activeFilter, onFilterChange }) {
  const timeFilters = [
    { key: "all", label: "All Time" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "quarter", label: "Last 3 Months" },
    { key: "year", label: "This Year" }
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-muted w-4 h-4" />
          <Input
            placeholder="Search breakthroughs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 warm-border focus:border-orange-300 focus:ring-orange-200 paper-card"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {timeFilters.map((filter) => (
          <Button
            key={filter.key}
            variant={activeFilter === filter.key ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.key)}
            className={activeFilter === filter.key 
              ? "compass-gradient hover:opacity-90 text-white" 
              : "warm-border text-warm-primary hover:bg-stone-50"
            }
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
}