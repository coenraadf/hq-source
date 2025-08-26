import React, { useState, useEffect } from "react";
import { Entry, User, CoachingRelationship } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Save,
  ArrowLeft,
  Plus,
  X,
  Sparkles,
  FileText,
  BookOpen,
  Lightbulb,
  Heart,
  MessageSquare,
  Brain,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

const entryTypes = [
  { value: "note", label: "Note", icon: FileText, description: "Quick thoughts and observations" },
  { value: "journal", label: "Journal Entry", icon: BookOpen, description: "Daily reflections and experiences" },
  { value: "insight", label: "Insight", icon: Lightbulb, description: "Meaningful realizations" },
  { value: "breakthrough", label: "Breakthrough", icon: Sparkles, description: "Significant discoveries" },
  { value: "reflection", label: "Reflection", icon: Heart, description: "Deep contemplation" },
  { value: "coaching_session", label: "Coaching Session", icon: MessageSquare, description: "Notes from coaching" },
  { value: "personality_test", label: "Personality Test", icon: Brain, description: "Assessment results" },
];

const moodOptions = [
  "excited", "contemplative", "frustrated", "peaceful",
  "anxious", "confident", "curious", "grateful"
];

const visibilityOptions = [
  { value: "private", label: "Private", description: "Only visible to you" },
  { value: "shared_with_coach", label: "Shared with Coach", description: "Your coach can see this" },
  { value: "collaborative", label: "Collaborative", description: "Both you and coach can edit" },
];

export default function NewEntry() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "note",
    tags: [],
    mood: "",
    is_breakthrough: false,
    visibility: "private",
    coaching_session_date: "",
    recipient_user_id: "",
  });
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      if (currentUser.user_type === 'coach') {
        const relationships = await CoachingRelationship.filter({ 
          coach_id: currentUser.id, 
          status: 'active' 
        });
        
        if (relationships.length > 0) {
          const clientDetails = await Promise.all(relationships.map(async (rel) => {
            try {
              return await User.get(rel.client_id);
            } catch {
              return { id: rel.client_id, preferred_app_name: `Client ${rel.client_id.slice(-4)}` };
            }
          }));
          setClients(clientDetails);
        }
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const dataToSave = user.user_type === 'coach'
        ? {
            title: formData.title.trim(),
            content: formData.content.trim(),
            type: 'coach_message',
            recipient_user_id: formData.recipient_user_id,
          }
        : {
            ...formData,
            title: formData.title.trim(),
            content: formData.content.trim(),
            mood: formData.mood || undefined,
            coaching_session_date: formData.coaching_session_date || undefined,
          };

      if (!dataToSave.title || !dataToSave.content || (user.user_type === 'coach' && !dataToSave.recipient_user_id)) {
        throw new Error("Required fields are missing.");
      }
      
      await Entry.create(dataToSave);
      const destination = user.user_type === 'coach' ? "CoachDashboard" : "Entries";
      navigate(createPageUrl(destination));
    } catch (error) {
      console.error("Error creating entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getClientDisplayName = (client) => {
    return client?.preferred_app_name || client?.full_name || 'Client';
  };

  const selectedTypeData = entryTypes.find(t => t.value === formData.type);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  // Coach Form
  if (user.user_type === 'coach') {
    return (
      <div className="min-h-screen p-6 md:p-8 bg-[var(--bg-primary)]">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="icon" onClick={() => navigate(createPageUrl("CoachDashboard"))} className="btn-secondary"><ArrowLeft className="w-4 h-4" /></Button>
            <div>
              <h1 className="text-h1 text-[var(--text-primary)]">Send Message to Client</h1>
              <p className="text-body text-[var(--text-secondary)]">Post a note, insight, or message to a client's dashboard.</p>
            </div>
          </motion.div>
          <Card className="base-card">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="client" className="text-[var(--text-primary)] font-medium">Select Client</Label>
                  <Select value={formData.recipient_user_id} onValueChange={(value) => handleInputChange("recipient_user_id", value)}>
                    <SelectTrigger className="form-input"><SelectValue placeholder="Choose a client..." /></SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>{getClientDisplayName(client)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[var(--text-primary)] font-medium">Message Title</Label>
                  <Input id="title" placeholder="e.g., Follow-up from our session" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} className="form-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-[var(--text-primary)] font-medium">Message Content</Label>
                  <Textarea id="content" placeholder="Share your thoughts or instructions here..." value={formData.content} onChange={(e) => handleInputChange("content", e.target.value)} className="form-input min-h-[150px]" />
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-color)]">
                  <Button type="button" variant="outline" onClick={() => navigate(createPageUrl("CoachDashboard"))} disabled={isSubmitting} className="btn-secondary">Cancel</Button>
                  <Button type="submit" disabled={isSubmitting || !formData.recipient_user_id || !formData.title.trim() || !formData.content.trim()} className="btn-primary">
                    {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Client Form
  return (
    <div className="min-h-screen p-6 md:p-8 bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate(createPageUrl("Dashboard"))} className="btn-secondary"><ArrowLeft className="w-4 h-4" /></Button>
          <div>
            <h1 className="text-h1 text-[var(--text-primary)]">Create New Entry</h1>
            <p className="text-body text-[var(--text-secondary)]">Capture your thoughts, insights, and reflections</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="base-card">
            <CardHeader><CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">{selectedTypeData && <selectedTypeData.icon className="w-5 h-5 text-[var(--brand-primary)]" />} New {selectedTypeData?.label || "Entry"}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[var(--text-primary)] font-medium">Entry Type</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {entryTypes.map((type) => (
                      <div key={type.value} onClick={() => handleInputChange("type", type.value)} className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${formData.type === type.value ? "border-[var(--brand-primary)] bg-[rgba(var(--brand-primary-r),var(--brand-primary-g),var(--brand-primary-b),0.05)] shadow-md" : "border-[var(--border-color)] hover:border-[var(--brand-primary-light)] hover:bg-[rgba(var(--brand-primary-r),var(--brand-primary-g),var(--brand-primary-b),0.02)]"}`}>
                        <type.icon className={`w-6 h-6 mb-2 ${formData.type === type.value ? "text-[var(--brand-primary)]" : "text-[var(--text-secondary)]"}`} />
                        <h3 className="font-medium text-[var(--text-primary)] text-sm">{type.label}</h3>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[var(--text-primary)] font-medium">Title</Label>
                  <Input id="title" placeholder="Give your entry a meaningful title..." value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} className="form-input"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-[var(--text-primary)] font-medium">Content</Label>
                  <Textarea id="content" placeholder="Share your thoughts, insights, or reflections..." value={formData.content} onChange={(e) => handleInputChange("content", e.target.value)} className="form-input min-h-[200px]" />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-[var(--text-primary)] font-medium">Tags (Optional)</Label>
                    <div className="flex gap-2">
                      <Input placeholder="Add a tag..." value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} className="form-input" />
                      <Button type="button" onClick={addTag} size="icon" variant="outline" className="btn-secondary"><Plus className="w-4 h-4" /></Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]">{tag}<X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => removeTag(tag)} /></Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[var(--text-primary)] font-medium">Current Mood (Optional)</Label>
                    <Select value={formData.mood} onValueChange={(value) => handleInputChange("mood", value)}>
                      <SelectTrigger className="form-input"><SelectValue placeholder="How are you feeling?" /></SelectTrigger>
                      <SelectContent>{moodOptions.map(mood => <SelectItem key={mood} value={mood}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="breakthrough" checked={formData.is_breakthrough} onCheckedChange={(checked) => handleInputChange("is_breakthrough", checked)} />
                    <Label htmlFor="breakthrough" className="flex items-center gap-2 cursor-pointer text-[var(--text-primary)]"><Sparkles className="w-4 h-4 text-[var(--brand-primary)]" />Mark as breakthrough</Label>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[var(--text-primary)] font-medium">Visibility</Label>
                    <Select value={formData.visibility} onValueChange={(value) => handleInputChange("visibility", value)}>
                      <SelectTrigger className="form-input"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {visibilityOptions.map(option => <SelectItem key={option.value} value={option.value}><div><div className="font-medium">{option.label}</div><div className="text-xs text-[var(--text-muted)]">{option.description}</div></div></SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {formData.type === "coaching_session" && (
                  <div className="space-y-2">
                    <Label htmlFor="session_date" className="text-[var(--text-primary)] font-medium">Session Date</Label>
                    <Input id="session_date" type="date" value={formData.coaching_session_date} onChange={(e) => handleInputChange("coaching_session_date", e.target.value)} className="form-input" />
                  </div>
                )}
                <div className="flex justify-end gap-3 pt-6 border-t border-[var(--border-color)]">
                  <Button type="button" variant="outline" onClick={() => navigate(createPageUrl("Dashboard"))} disabled={isSubmitting} className="btn-secondary">Cancel</Button>
                  <Button type="submit" disabled={!formData.title.trim() || !formData.content.trim() || isSubmitting} className="btn-primary">
                    {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {isSubmitting ? "Saving..." : "Save Entry"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}