
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, GripVertical, ChevronsUpDown, ChevronRight } from "lucide-react";

// UPDATED: Sizing is now based on percentage of total columns
const WIDGET_SIZES = {
  small: 0.25,  // 25%
  medium: 0.50, // 50%
  large: 1.0    // 100%
};

export default function DashboardWidget({ 
  id,
  widget,
  layout,
  children, 
  isCustomizeMode, 
  onRemove,
  onLayoutUpdate,
  fullLayout,
  cols,
  rowHeight,
  containerRef
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizingVertical, setIsResizingVertical] = useState(false);
  const [isResizingHorizontal, setIsResizingHorizontal] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const widgetRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const resizeStartInfo = useRef({ x: 0, y: 0, w: 0, h: 0 });

  if (!layout) return null;
  
  const { x, y, w, h } = layout;

  const handleSizeChange = (sizeKey) => {
    const percentage = WIDGET_SIZES[sizeKey];
    const newWidth = Math.max(1, Math.round(cols * percentage));
    onLayoutUpdate(fullLayout.map(item => 
      item.id === id ? { ...item, w: newWidth } : item
    ));
  };

  const onDragStart = useCallback((e) => {
    if (!isCustomizeMode || !containerRef.current) return;
    const event = e.touches ? e.touches[0] : e;
    const target = e.target.closest('.drag-handle, .card-header');
    if (!target) return;
    
    e.preventDefault();
    setIsDragging(true);
    dragStartPos.current = { x: event.clientX, y: event.clientY };
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, [isCustomizeMode, containerRef]);

  const onDragMove = useCallback((e) => {
    if (!isDragging) return;
    const event = e.touches ? e.touches[0] : e;
    setDragPosition({ 
      x: event.clientX - dragStartPos.current.x, 
      y: event.clientY - dragStartPos.current.y 
    });
  }, [isDragging]);

  const onDragEnd = useCallback(() => {
    if (!isDragging || !widgetRef.current || !containerRef.current) return;

    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    const { left, top } = containerRef.current.getBoundingClientRect();
    const widgetRect = widgetRef.current.getBoundingClientRect();
    const finalX = widgetRect.left - left + dragPosition.x;
    const finalY = widgetRect.top - top + dragPosition.y;

    const colWidth = (containerRef.current.offsetWidth - (cols - 1) * 16) / cols;
    const gridX = Math.round(finalX / colWidth);
    const gridY = Math.round(finalY / (rowHeight + 16));

    const updatedLayout = fullLayout.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          x: Math.max(0, Math.min(cols - w, gridX)), 
          y: Math.max(0, gridY) 
        };
      }
      return item;
    });
    
    onLayoutUpdate(updatedLayout);
    setDragPosition({ x: 0, y: 0 });
  }, [isDragging, dragPosition, id, w, h, cols, rowHeight, fullLayout, onLayoutUpdate, containerRef]);

  // Vertical Resize Handlers
  const onVerticalResizeStart = useCallback((e) => {
    if (!isCustomizeMode) return;
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizingVertical(true);
    const event = e.touches ? e.touches[0] : e;
    resizeStartInfo.current = { x: 0, y: event.clientY, w: 0, h };
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  }, [isCustomizeMode, h]);
  
  const onVerticalResizeMove = useCallback((e) => {
    if (!isResizingVertical || !widgetRef.current) return;
    const event = e.touches ? e.touches[0] : e;
    const deltaY = event.clientY - resizeStartInfo.current.y;
    const newHeightInRows = resizeStartInfo.current.h + Math.round(deltaY / (rowHeight + 16));
    
    const updatedLayout = fullLayout.map(item =>
      item.id === id ? { ...item, h: Math.max(1, newHeightInRows) } : item
    );
    onLayoutUpdate(updatedLayout, false); // Update without compacting for live feedback
  }, [isResizingVertical, id, rowHeight, fullLayout, onLayoutUpdate]);

  const onVerticalResizeEnd = useCallback(() => {
    if (!isResizingVertical) return;
    setIsResizingVertical(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    onLayoutUpdate(fullLayout); // Final update with compaction
  }, [isResizingVertical, fullLayout, onLayoutUpdate]);

  // Horizontal Resize Handlers
  const onHorizontalResizeStart = useCallback((e) => {
    if (!isCustomizeMode || !containerRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizingHorizontal(true);
    const event = e.touches ? e.touches[0] : e;
    resizeStartInfo.current = { x: event.clientX, y: 0, w, h: 0 };
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }, [isCustomizeMode, w, containerRef]);
  
  const onHorizontalResizeMove = useCallback((e) => {
    if (!isResizingHorizontal || !widgetRef.current || !containerRef.current) return;
    const event = e.touches ? e.touches[0] : e;
    const deltaX = event.clientX - resizeStartInfo.current.x;
    const colWidth = (containerRef.current.offsetWidth - (cols - 1) * 16) / cols;
    const newWidthInCols = resizeStartInfo.current.w + Math.round(deltaX / (colWidth + 16));
    
    const updatedLayout = fullLayout.map(item =>
      item.id === id ? { 
        ...item, 
        w: Math.max(1, Math.min(cols - x, newWidthInCols)) // Ensure it doesn't go past grid bounds
      } : item
    );
    onLayoutUpdate(updatedLayout, false); // Update without compacting for live feedback
  }, [isResizingHorizontal, id, cols, x, fullLayout, onLayoutUpdate, containerRef]);

  const onHorizontalResizeEnd = useCallback(() => {
    if (!isResizingHorizontal) return;
    setIsResizingHorizontal(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    onLayoutUpdate(fullLayout); // Final update with compaction
  }, [isResizingHorizontal, fullLayout, onLayoutUpdate]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onDragMove);
      window.addEventListener('mouseup', onDragEnd);
      window.addEventListener('touchmove', onDragMove, { passive: true });
      window.addEventListener('touchend', onDragEnd);
      return () => {
        window.removeEventListener('mousemove', onDragMove);
        window.removeEventListener('mouseup', onDragEnd);
        window.removeEventListener('touchmove', onDragMove);
        window.removeEventListener('touchend', onDragEnd);
      };
    }
  }, [isDragging, onDragMove, onDragEnd]);

  useEffect(() => {
    if (isResizingVertical) {
      window.addEventListener('mousemove', onVerticalResizeMove);
      window.addEventListener('mouseup', onVerticalResizeEnd);
      window.addEventListener('touchmove', onVerticalResizeMove, { passive: true });
      window.addEventListener('touchend', onVerticalResizeEnd);
      return () => {
        window.removeEventListener('mousemove', onVerticalResizeMove);
        window.removeEventListener('mouseup', onVerticalResizeEnd);
        window.removeEventListener('touchmove', onVerticalResizeMove);
        window.removeEventListener('touchend', onVerticalResizeEnd);
      };
    }
  }, [isResizingVertical, onVerticalResizeMove, onVerticalResizeEnd]);

  useEffect(() => {
    if (isResizingHorizontal) {
      window.addEventListener('mousemove', onHorizontalResizeMove);
      window.addEventListener('mouseup', onHorizontalResizeEnd);
      window.addEventListener('touchmove', onHorizontalResizeMove, { passive: true });
      window.addEventListener('touchend', onHorizontalResizeEnd);
      return () => {
        window.removeEventListener('mousemove', onHorizontalResizeMove);
        window.removeEventListener('mouseup', onHorizontalResizeEnd);
        window.removeEventListener('touchmove', onHorizontalResizeMove);
        window.removeEventListener('touchend', onHorizontalResizeEnd);
      };
    }
  }, [isResizingHorizontal, onHorizontalResizeMove, onHorizontalResizeEnd]);

  const widgetStyle = {
    gridColumn: `${x + 1} / span ${w}`,
    gridRow: `${y + 1} / span ${h}`,
    transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)`,
    transition: isDragging || isResizingVertical || isResizingHorizontal ? 'none' : 'all 0.3s ease-in-out',
    zIndex: isDragging || isResizingVertical || isResizingHorizontal ? 1000 : 10
  };

  return (
    <div 
      ref={widgetRef} 
      style={widgetStyle} 
      className={`flex flex-col ${isDragging ? 'shadow-2xl' : ''}`}
    >
      <Card className="bg-white warm-border h-full w-full relative overflow-hidden flex flex-col">
        {isCustomizeMode && (
          <div className="absolute inset-0 bg-blue-500/10 z-20 flex items-center justify-center pointer-events-none">
            <div className="absolute top-2 right-2 flex gap-1 p-1 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-blue-200 pointer-events-auto">
              <div 
                className="drag-handle cursor-grab active:cursor-grabbing p-2 rounded-lg flex items-center justify-center hover:bg-blue-100" 
                onMouseDown={onDragStart} 
                onTouchStart={onDragStart}
              >
                <GripVertical className="w-5 h-5 text-blue-600" />
              </div>
              <Button 
                onClick={() => handleSizeChange('small')} 
                size="sm" 
                variant="outline"
                className="text-xs w-8 h-8 p-0"
              >
                S
              </Button>
              <Button 
                onClick={() => handleSizeChange('medium')} 
                size="sm" 
                variant="outline"
                className="text-xs w-8 h-8 p-0"
              >
                M
              </Button>
              <Button 
                onClick={() => handleSizeChange('large')} 
                size="sm" 
                variant="outline"
                className="text-xs w-8 h-8 p-0"
              >
                L
              </Button>
              {onRemove && (
                <Button 
                  onClick={() => onRemove(id)} 
                  size="sm" 
                  variant="destructive" 
                  className="w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {/* Vertical Resize Handle - Bottom */}
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-5 flex items-center justify-center cursor-ns-resize pointer-events-auto"
              onMouseDown={onVerticalResizeStart}
              onTouchStart={onVerticalResizeStart}
            >
              <div className="w-8 h-1.5 bg-blue-300/80 rounded-full hover:bg-blue-400 flex items-center justify-center">
                <ChevronsUpDown className="w-3 h-3 text-blue-600" />
              </div>
            </div>

            {/* Horizontal Resize Handle - Right */}
            <div 
              className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-20 flex items-center justify-center cursor-ew-resize pointer-events-auto"
              onMouseDown={onHorizontalResizeStart}
              onTouchStart={onHorizontalResizeStart}
            >
              <div className="w-1.5 h-8 bg-blue-300/80 rounded-full hover:bg-blue-400 flex items-center justify-center">
                <ChevronRight className="w-3 h-3 text-blue-600 rotate-90" />
              </div>
            </div>
          </div>
        )}
        <CardHeader 
          className="card-header pb-3 flex-shrink-0 cursor-grab active:cursor-grabbing"
          onMouseDown={onDragStart}
          onTouchStart={onDragStart}
        >
          <CardTitle className="text-warm-primary text-base sm:text-lg flex items-center gap-2 min-w-0">
            {widget?.icon && <widget.icon className="w-5 h-5 flex-shrink-0" />}
            <span className="truncate min-w-0">{widget?.title || 'Widget'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
