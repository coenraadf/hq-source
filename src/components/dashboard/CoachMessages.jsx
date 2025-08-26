import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function CoachMessages({ messages }) {
  if (!messages || messages.length === 0) return null;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <MessageSquare className="w-5 h-5" />
          Messages from your Coach
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border border-blue-200 rounded-xl bg-white/50"
          >
            <h3 className="font-semibold text-stone-800 mb-2">{message.title}</h3>
            <p className="text-stone-600 text-sm leading-relaxed mb-3">{message.content}</p>
            <div className="flex items-center justify-end text-xs text-blue-700">
              <Calendar className="w-3 h-3 mr-1" />
              {format(new Date(message.created_date), "MMM d, yyyy")}
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}