
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X, Plus, Save } from "lucide-react";

const moodOptions = [
  "excited", "contemplative", "frustrated", "peaceful",
  "anxious", "confident", "curious", "grateful"
];

const visibilityOptions = [
  { value: "private", label: "Private", description: "Only visible to you" },
  { value: "shared_with_coach", label: "Shared with Coach", description: "Your coach can see this" },
  { value: "collaborative", label: "Collaborative", description: "Both you and coach can edit" },
];

export default function EditEntryModal({ entry, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [],
    mood: "",
    is_breakthrough: false,
    visibility: "private",
  });
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (entry) {
      setFormData({
        title: entry.title || "",
        content: entry.content || "",
        tags: entry.tags || [],
        mood: entry.mood || "",
        is_breakthrough: entry.is_breakthrough || false,
        visibility: entry.visibility || "private",
      });
    }
  }, [entry]);

  if (!isOpen) {
    return null;
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange("tags", [...(formData.tags || []), newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    handleInputChange("tags", formData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleSaveClick = async () => {
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-white/90 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Edit Entry</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-stone-700">Title</Label>
            <Input id="title" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content" className="text-stone-700">Content</Label>
            <Textarea id="content" value={formData.content} onChange={(e) => handleInputChange("content", e.target.value)} className="min-h-[150px]" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-stone-700">Tags</Label>
              <div className="flex gap-2">
                <Input placeholder="Add a tag..." value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                <Button type="button" onClick={addTag} size="icon" variant="outline"><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-stone-100 text-stone-700">
                    {tag} <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-stone-700">Mood</Label>
              <Select value={formData.mood} onValueChange={(value) => handleInputChange("mood", value)}>
                <SelectTrigger><SelectValue placeholder="How are you feeling?" /></SelectTrigger>
                <SelectContent>
                  {moodOptions.map((mood) => <SelectItem key={mood} value={mood}>{mood}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="breakthrough" checked={formData.is_breakthrough} onCheckedChange={(checked) => handleInputChange("is_breakthrough", checked)} />
              <Label htmlFor="breakthrough" className="flex items-center gap-2 cursor-pointer">
                <Sparkles className="w-4 h-4 text-amber-500" /> Mark as breakthrough
              </Label>
            </div>
            <div className="space-y-2">
              <Label className="text-stone-700">Visibility</Label>
              <Select value={formData.visibility} onValueChange={(value) => handleInputChange("visibility", value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {visibilityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-stone-500">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSaveClick} disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
