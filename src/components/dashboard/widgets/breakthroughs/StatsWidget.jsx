import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Calendar, BookOpen } from "lucide-react";
import { subDays, subMonths, subYears } from "date-fns";

export default function StatsWidget({ breakthroughs }) {
  const getStatsForPeriod = (period) => {
    const now = new Date();
    let filterDate;
    
    switch (period) {
      case "week":
        filterDate = subDays(now, 7);
        break;
      case "month":
        filterDate = subMonths(now, 1);
        break;
      case "year":
        filterDate = subYears(now, 1);
        break;
      default:
        return breakthroughs.length;
    }
    
    return breakthroughs.filter(entry => 
      new Date(entry.created_date) > filterDate
    ).length;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="paper-card warm-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warm-muted text-sm font-medium">Total Breakthroughs</p>
              <p className="text-3xl font-bold text-warm-primary mt-2">{breakthroughs.length}</p>
            </div>
            <div className="p-3 rounded-2xl compass-soft">
              <Sparkles className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="paper-card warm-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warm-muted text-sm font-medium">This Week</p>
              <p className="text-3xl font-bold text-warm-primary mt-2">{getStatsForPeriod("week")}</p>
            </div>
            <div className="p-3 rounded-2xl compass-soft">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="paper-card warm-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warm-muted text-sm font-medium">This Month</p>
              <p className="text-3xl font-bold text-warm-primary mt-2">{getStatsForPeriod("month")}</p>
            </div>
            <div className="p-3 rounded-2xl compass-soft">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="paper-card warm-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-warm-muted text-sm font-medium">This Year</p>
              <p className="text-3xl font-bold text-warm-primary mt-2">{getStatsForPeriod("year")}</p>
            </div>
            <div className="p-3 rounded-2xl compass-soft">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}