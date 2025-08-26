import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  Sparkles, 
  TrendingUp, 
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

export default function CoachStats({ stats }) {
  const statCards = [
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: Users,
      gradient: "from-blue-400 to-blue-600",
      description: "All clients",
      link: null
    },
    {
      title: "Active Clients",
      value: stats.activeClients,
      icon: TrendingUp,
      gradient: "from-green-400 to-emerald-500",
      description: "Currently coaching",
      link: null
    },
    {
      title: "Client Breakthroughs",
      value: stats.recentBreakthroughs,
      icon: Sparkles,
      gradient: "from-amber-400 to-orange-500",
      description: "This week",
      link: createPageUrl("CoachBreakthroughs")
    },
    {
      title: "Shared Entries",
      value: stats.thisWeekEntries,
      icon: Calendar,
      gradient: "from-purple-400 to-indigo-500",
      description: "This week",
      link: null
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {stat.link ? (
            <Link to={stat.link}>
              <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-stone-500 text-sm font-medium tracking-wide uppercase">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-stone-800 mt-2">
                        {stat.value}
                      </p>
                      <p className="text-stone-400 text-xs mt-1">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ) : (
            <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-stone-500 text-sm font-medium tracking-wide uppercase">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-stone-800 mt-2">
                      {stat.value}
                    </p>
                    <p className="text-stone-400 text-xs mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
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