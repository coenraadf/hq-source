import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { BookOpen, FileText, Brain, Search } from 'lucide-react';

export default function ContextSelector({ isOpen, onClose, availableEntries, availableResources, availableTests, selectedContext, onSelectionChange }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggle = (type, id) => {
    onSelectionChange(prev => {
      const currentSelection = prev[type] || [];
      const newSelection = currentSelection.includes(id)
        ? currentSelection.filter(itemId => itemId !== id)
        : [...currentSelection, id];
      return { ...prev, [type]: newSelection };
    });
  };

  const filteredEntries = availableEntries.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredResources = availableResources.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredTests = availableTests.filter(item => item.test_name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  const renderList = (title, items, type, icon) => (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">{React.createElement(icon, {className: "w-5 h-5 text-[var(--brand-primary)]"})} {title}</h3>
      <div className="max-h-40 overflow-y-auto space-y-2 p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        {items.length > 0 ? items.map(item => (
          <div key={item.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-white/50">
            <Checkbox
              id={`${type}-${item.id}`}
              checked={(selectedContext[type] || []).includes(item.id)}
              onCheckedChange={() => handleToggle(type, item.id)}
            />
            <Label htmlFor={`${type}-${item.id}`} className="text-sm font-medium leading-none cursor-pointer flex-1 truncate text-[var(--text-secondary)]">
              {item.title || item.test_name}
            </Label>
          </div>
        )) : <p className="text-sm text-[var(--text-muted)] p-2">No matching {title.toLowerCase()} found.</p>}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col base-card">
        <DialogHeader>
          <DialogTitle className="text-h2">Select Context for Sage</DialogTitle>
          <DialogDescription className="text-body">
            Choose which of your private data Sage can use to answer your questions. This selection will be remembered for this conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6 flex-1 overflow-y-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
            <Input placeholder="Search context data..." className="form-input pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          {renderList('Entries', filteredEntries, 'entries', BookOpen)}
          {renderList('Resources', filteredResources, 'resources', FileText)}
          {renderList('Personality Tests', filteredTests, 'tests', Brain)}
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="btn-primary">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}