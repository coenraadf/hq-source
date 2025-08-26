import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { subDays, subMonths } from "date-fns";

export default function EntryStats({ entries }) {
  const thisWeekEntries = entries.filter(e =>
    new Date(e.created_date) > subDays(new Date(), 7)
  ).length;

  const thisMonthEntries = entries.filter(e =>
    new Date(e.created_date) > subMonths(new Date(), 1)
  ).length;

  const breakthroughsCount = entries.filter(e => e.is_breakthrough).length;

  const stats = [
    {
      title: "TOTAL ENTRIES",
      value: entries.length,
      icon: BookOpen,
      iconBg: "from-[#3B82F6] to-[#1E40AF]",
      link: null
    },
    {
      title: "BREAKTHROUGHS",
      value: breakthroughsCount,
      icon: Sparkles,
      iconBg: "from-[#C4895B] to-[#B8794A]",
      link: createPageUrl("Breakthroughs")
    },
    {
      title: "THIS WEEK",
      value: thisWeekEntries,
      icon: TrendingUp,
      iconBg: "from-[#10B981] to-[#059669]",
      link: null
    },
    {
      title: "THIS MONTH",
      value: thisMonthEntries,
      icon: Calendar,
      iconBg: "from-[#8B5CF6] to-[#7C3AED]",
      link: null
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {stat.link ? (
            <Link to={stat.link}>
              <Card className="bg-white/90 backdrop-blur-sm border-[#E5E0D8] shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[#2D2D2D] opacity-75 text-sm font-medium tracking-wide uppercase">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-[#1A1A1A] mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.iconBg} shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm border-[#E5E0D8] shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#2D2D2D] opacity-75 text-sm font-medium tracking-wide uppercase">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-[#1A1A1A] mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.iconBg} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      ))}
    </div>
  );
}