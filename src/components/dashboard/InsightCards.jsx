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

export default function InsightCards({ stats }) {
  const cards = [
    {
      title: "Total Entries",
      value: stats.totalEntries,
      icon: BookOpen,
      gradient: "from-blue-400 to-blue-600",
      link: createPageUrl("Entries")
    },
    {
      title: "Breakthroughs",
      value: stats.breakthroughs,
      icon: Sparkles,
      gradient: "from-amber-400 to-orange-500",
      link: createPageUrl("Breakthroughs")
    },
    {
      title: "This Week",
      value: stats.thisWeek,
      icon: TrendingUp,
      gradient: "from-green-400 to-emerald-500",
      link: createPageUrl("Entries")
    },
    {
      title: "This Month",
      value: stats.thisMonth,
      icon: Calendar,
      gradient: "from-purple-400 to-indigo-500",
      link: createPageUrl("Entries")
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link to={card.link}>
            <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-stone-500 text-sm font-medium tracking-wide uppercase">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold text-stone-800 mt-2">
                      {card.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}