import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Video,
  Music,
  Image,
  Download,
  Share2,
  Plus,
  FolderOpen,
  ClipboardCopy
} from "lucide-react";
import { format } from "date-fns";

const categoryIcons = {
  worksheet: FileText,
  template: ClipboardCopy,
  document: FileText,
  video: Video,
  audio: Music,
  image: Image,
  other: FolderOpen
};

const categoryColors = {
  worksheet: "bg-blue-100 text-blue-800",
  template: "bg-purple-100 text-purple-800",
  document: "bg-green-100 text-green-800",
  video: "bg-red-100 text-red-800",
  audio: "bg-orange-100 text-orange-800",
  image: "bg-pink-100 text-pink-800",
  other: "bg-gray-100 text-gray-800"
};

export default function ClientResources({ resources, client, onShareMore }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (resource) => {
    window.open(resource.file_url, '_blank');
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-stone-800">
          <Share2 className="w-5 h-5" />
          Shared Resources
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onShareMore}>
          <Plus className="w-3 h-3 mr-1" />
          Share More
        </Button>
      </CardHeader>
      <CardContent>
        {resources.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="w-8 h-8 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500 text-sm mb-3">No shared resources yet</p>
            <Button variant="outline" size="sm" onClick={onShareMore}>
              <Share2 className="w-3 h-3 mr-1" />
              Share Resource
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((resource) => {
              const CategoryIcon = categoryIcons[resource.category] || FileText;
              return (
                <div key={resource.id} className="p-3 border border-stone-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-stone-100">
                        <CategoryIcon className="w-4 h-4 text-stone-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-stone-800 text-sm line-clamp-1">
                          {resource.title}
                        </h4>
                        <p className="text-xs text-stone-500 mt-1">
                          {formatFileSize(resource.file_size)}
                        </p>
                        {resource.description && (
                          <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                            {resource.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {resource.is_template && (
                        <ClipboardCopy className="w-3 h-3 text-purple-500" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDownload(resource)}
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <Badge className={`${categoryColors[resource.category]} text-xs`}>
                      {resource.category}
                    </Badge>
                    <p className="text-xs text-stone-400">
                      {format(new Date(resource.created_date), "MMM d")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}