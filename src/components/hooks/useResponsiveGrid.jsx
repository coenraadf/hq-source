
import { useState, useEffect } from 'react';

const BREAKPOINTS = {
  xs: { min: 0, max: 767, cols: 1, rowHeight: 80 },      // Mobile (up to md): 1 column
  md: { min: 768, max: 1023, cols: 8, rowHeight: 70 },   // Tablet
  lg: { min: 1024, max: 1199, cols: 10, rowHeight: 75 }, // Small Desktop
  xl: { min: 1200, max: Infinity, cols: 12, rowHeight: 80 } // Desktop
};

export function useResponsiveGrid() {
  const [breakpointKey, setBreakpointKey] = useState('xl');
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newBreakpoint = Object.entries(BREAKPOINTS).find(([, config]) => 
        width >= config.min && width <= config.max
      )?.[0] || 'xl';
      setBreakpointKey(newBreakpoint);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return { breakpointKey, config: BREAKPOINTS[breakpointKey] };
}
