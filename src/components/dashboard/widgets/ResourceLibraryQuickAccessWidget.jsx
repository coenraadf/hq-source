import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Library, FileText, Download, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Resource } from "@/api/entities";

export default function ResourceLibraryQuickAccessWidget() {
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      // Get frequently used or recent resources
      const recentResources = await Resource.filter({
        is_template: true
      }, "-created_date", 3);
      
      setResources(recentResources || []);
    } catch (error) {
      console.error("Error loading resources:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-6">
        <div className="animate-pulse">
          <Library className="w-8 h-8 text-warm-muted mx-auto mb-4" />
        </div>
        <p className="text-warm-muted text-sm">Loading resources...</p>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-6">
        <Library className="w-12 h-12 text-warm-muted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-warm-primary mb-2">No templates yet</h3>
        <p className="text-warm-muted text-sm mb-4">
          Create reusable templates for your coaching practice
        </p>
        <Link to={createPageUrl("Resources")}>
          <Button size="sm" className="coach-gradient hover:opacity-90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {resources.map((resource) => (
        <div key={resource.id} className="p-3 rounded-lg border warm-border bg-white/50">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-stone-400" />
              <h4 className="font-medium text-warm-primary text-sm truncate">{resource.title}</h4>
            </div>
            <div className="flex gap-1">
              <Badge variant="outline" className="text-xs warm-border text-warm-secondary">
                {resource.category}
              </Badge>
              {resource.is_template && (
                <Badge className="bg-blue-100 text-blue-800 text-xs">Template</Badge>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-warm-muted truncate">
              {resource.description || "No description"}
            </p>
            <a 
              href={resource.file_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2"
            >
              <Button size="icon" variant="ghost" className="h-6 w-6">
                <Download className="w-3 h-3" />
              </Button>
            </a>
          </div>
        </div>
      ))}
      
      <div className="pt-2 border-t warm-border">
        <Link to={createPageUrl("Resources")}>
          <Button variant="ghost" size="sm" className="w-full text-warm-secondary hover:text-warm-primary">
            View All Resources
          </Button>
        </Link>
      </div>
    </div>
  );
}