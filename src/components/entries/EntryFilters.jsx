import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const entryTypes = [
  { value: "all", label: "All Types" },
  { value: "note", label: "Notes" },
  { value: "journal", label: "Journal Entries" },
  { value: "insight", label: "Insights" },
  { value: "breakthrough", label: "Breakthroughs" },
  { value: "reflection", label: "Reflections" },
  { value: "coaching_session", label: "Coaching Sessions" },
  { value: "personality_test", label: "Personality Tests" },
];

const moodOptions = [
  { value: "all", label: "All Moods" },
  { value: "excited", label: "Excited" },
  { value: "contemplative", label: "Contemplative" },
  { value: "frustrated", label: "Frustrated" },
  { value: "peaceful", label: "Peaceful" },
  { value: "anxious", label: "Anxious" },
  { value: "confident", label: "Confident" },
  { value: "curious", label: "Curious" },
  { value: "grateful", label: "Grateful" },
];

const visibilityOptions = [
  { value: "all", label: "All Visibility" },
  { value: "private", label: "Private" },
  { value: "shared_with_coach", label: "Shared with Coach" },
  { value: "collaborative", label: "Collaborative" },
];

const breakthroughOptions = [
  { value: "all", label: "All Entries" },
  { value: "breakthroughs", label: "Breakthroughs Only" },
  { value: "regular", label: "Regular Entries" },
];

const dateRangeOptions = [
  { value: "all", label: "All Time" },
  { value: "week", label: "Past Week" },
  { value: "month", label: "Past Month" },
  { value: "quarter", label: "Past 3 Months" },
];

export default function EntryFilters({ filters, onFiltersChange, entries }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange({ [key]: value });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-[#E5E0D8]">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <Select 
              value={filters.type} 
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger className="border-[#E5E0D8] focus:border-[#C4895B]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {entryTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select 
              value={filters.mood} 
              onValueChange={(value) => handleFilterChange("mood", value)}
            >
              <SelectTrigger className="border-[#E5E0D8] focus:border-[#C4895B]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {moodOptions.map((mood) => (
                  <SelectItem key={mood.value} value={mood.value}>
                    {mood.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select 
              value={filters.visibility} 
              onValueChange={(value) => handleFilterChange("visibility", value)}
            >
              <SelectTrigger className="border-[#E5E0D8] focus:border-[#C4895B]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {visibilityOptions.map((vis) => (
                  <SelectItem key={vis.value} value={vis.value}>
                    {vis.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select 
              value={filters.breakthrough} 
              onValueChange={(value) => handleFilterChange("breakthrough", value)}
            >
              <SelectTrigger className="border-[#E5E0D8] focus:border-[#C4895B]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {breakthroughOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select 
              value={filters.dateRange} 
              onValueChange={(value) => handleFilterChange("dateRange", value)}
            >
              <SelectTrigger className="border-[#E5E0D8] focus:border-[#C4895B]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}