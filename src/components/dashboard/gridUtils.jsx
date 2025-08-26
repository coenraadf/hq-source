export const isOverlapping = (item1, item2) => {
  if (!item1 || !item2) return false;
  return !(
    item1.x + item1.w <= item2.x ||
    item2.x + item2.w <= item1.x ||
    item1.y + item1.h <= item2.y ||
    item2.y + item2.h <= item1.y
  );
};

export const getSanitizedLayout = (layout) => {
  const sortedLayout = [...layout].sort((a, b) => a.y - b.y || a.x - b.x);
  const finalLayout = [];
  
  for (const item of sortedLayout) {
    let newItem = { ...item };
    let iterations = 0;
    const maxIterations = 1000;

    // Move item up as much as possible without collision
    while (newItem.y > 0 && !finalLayout.some(placed => isOverlapping(placed, { ...newItem, y: newItem.y - 1 }))) {
      if (iterations++ > maxIterations) { 
        console.error("Exceeded max iterations in getSanitizedLayout (moving up)"); 
        break; 
      }
      newItem.y--;
    }

    // If there's still a collision, move down until clear
    iterations = 0;
    while (finalLayout.some(placed => isOverlapping(placed, newItem))) {
      if (iterations++ > maxIterations) { 
        console.error("Exceeded max iterations in getSanitizedLayout (moving down)"); 
        break; 
      }
      newItem.y++;
    }
    
    finalLayout.push(newItem);
  }
  
  return finalLayout;
};

export const compactLayout = getSanitizedLayout;

export const moveItem = (layout, itemToMove, newX, newY, cols = 12) => {
  if (!Array.isArray(layout) || !itemToMove) return layout;
  
  const updatedLayout = layout.map(item => {
    if (item.id === itemToMove.id) {
      return { 
        ...item, 
        x: Math.max(0, Math.min(cols - itemToMove.w, newX)), 
        y: Math.max(0, newY) 
      };
    }
    return item;
  });
  
  return getSanitizedLayout(updatedLayout);
};