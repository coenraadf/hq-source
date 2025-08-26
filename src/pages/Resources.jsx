
import React, { useState, useEffect } from "react";
import { Resource, PersonalityTest, User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload,
  Search,
  ChevronDown,
  Loader2,
  FileText,
  Brain,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { UploadFile } from "@/api/integrations";

function ResourceCard({ resource }) {
  return (
    <div className="base-card h-full flex flex-col">
      <div className="flex-1">
        <h3 className="text-h3">{resource.title}</h3>
        <p className="text-body text-text-muted mt-2 line-clamp-3">
          {resource.description}
        </p>
      </div>
      <div className="mt-4 pt-4 border-t border-border-color">
        <span className="category-tag">{resource.category}</span>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [tests, setTests] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [resourcesData, testsData, userData] = await Promise.all([
        Resource.list("-created_date").catch(() => []),
        PersonalityTest.list("-date_taken").catch(() => []),
        User.me(),
      ]);
      setResources(resourcesData);
      setTests(testsData);
      setUser(userData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError(
        "Failed to load resources. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      await Resource.create({
        title: file.name,
        description: `Uploaded on ${new Date().toLocaleDateString()}`,
        file_url,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        category: "document",
      });
      await loadData(); // Refresh the list
    } catch (uploadError) {
      console.error("Error uploading file:", uploadError);
      setError("File upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const filteredResources = resources.filter((resource) => {
    const searchMatch =
      (resource.title && resource.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const categoryMatch =
      categoryFilter === "all" || resource.category === categoryFilter;
    return searchMatch && categoryMatch;
  });

  const categories = [
    ...new Set(resources.map((r) => r.category)),
  ].filter(Boolean);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-primary)]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-h1">Resource Library</h1>
              <p className="text-body-large text-text-secondary">
                Upload, organize, and share your files and documents
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              className="btn-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {isUploading ? "Uploading..." : "Upload Resource"}
            </Button>
          </div>
        </header>

        <Card className="base-card w-full">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
              <Select
                value={categoryFilter}
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="form-input">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="base-card sm:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="icon-container-branded w-10 h-10 flex items-center justify-center rounded-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-h3">Personality Center</h2>
            </div>
            <p className="text-body text-text-muted mb-4">
              Manage your personality assessments for deeper self-insight.
            </p>
            <Button
              onClick={() => navigate(createPageUrl("PersonalityTests"))}
              className="btn-secondary w-full"
            >
              Manage Tests
            </Button>
          </div>
          {/* Add other similar cards here if needed, they will flow in the grid */}
        </div>
        
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="icon-container w-16 h-16 mx-auto bg-gray-100 border-2 border-dashed border-gray-300">
               <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-h3 mt-4">No resources found</h3>
            <p className="text-body text-text-muted mt-2">
              {resources.length === 0 ? "Upload your first resource to get started." : "Try adjusting your search or filters."}
            </p>
            <Button
              className="btn-primary mt-6"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Resource
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
