import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function ResultsWidget({ filteredBreakthroughs, isLoading, totalCount, searchQuery, activeFilter }) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse bg-white/50">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-full mb-4" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (totalCount === 0) {
      return (
        <div className="text-center py-12">
          <Sparkles className="mx-auto h-12 w-12 text-stone-300" />
          <h3 className="mt-2 text-lg font-medium text-warm-primary">No Breakthroughs Yet</h3>
          <p className="mt-1 text-sm text-warm-secondary">Mark entries as breakthroughs to see them here.</p>
        </div>
      );
    }

    if (filteredBreakthroughs.length === 0) {
      return (
        <div className="text-center py-12">
          <Sparkles className="mx-auto h-12 w-12 text-stone-300" />
          <h3 className="mt-2 text-lg font-medium text-warm-primary">No Results Found</h3>
          <p className="mt-1 text-sm text-warm-secondary">
            Try adjusting your search query or time filter.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBreakthroughs.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full bg-white/70 hover:bg-white transition-colors duration-200 paper-card">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs compass-soft border-orange-200 text-orange-700">
                    {entry.type}
                  </Badge>
                  <span className="text-xs text-warm-muted">{format(new Date(entry.created_date), 'MMM d, yyyy')}</span>
                </div>
                <h4 className="font-semibold text-warm-primary truncate">{entry.title}</h4>
                <p className="text-sm text-warm-secondary line-clamp-3">
                  {entry.content}
                </p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-200/50">
                  {entry.tags?.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 h-full">
      {renderContent()}
    </div>
  );
}