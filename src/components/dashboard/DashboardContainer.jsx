import React, { useRef } from 'react';
import { useResponsiveGrid } from '@/components/hooks/useResponsiveGrid';
import { getSanitizedLayout } from './gridUtils';

export default function DashboardContainer({ layout, onLayoutChange, children }) {
  const { config } = useResponsiveGrid();
  const containerRef = useRef(null);
  
  const handleLayoutUpdate = (newLayout) => {
    onLayoutChange(getSanitizedLayout(newLayout));
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full min-h-screen paper-texture p-4 md:p-6"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
        gridAutoRows: `${config.rowHeight}px`,
        gap: '16px'
      }}
    >
      {React.Children.map(children, child => {
        if (!child) return null;
        return React.cloneElement(child, {
          cols: config.cols,
          rowHeight: config.rowHeight,
          containerRef,
          onLayoutUpdate: handleLayoutUpdate,
          fullLayout: layout
        });
      })}
    </div>
  );
}