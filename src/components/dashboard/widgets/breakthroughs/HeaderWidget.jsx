
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Sparkles } from "lucide-react";

export default function HeaderWidget() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl shadow-lg bg-[var(--brand-primary)]">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-text-primary mb-2">My Breakthroughs</h1>
          <p className="text-body text-text-secondary">
            Your collection of significant insights and discoveries
          </p>
        </div>
      </div>
      <div className="flex gap-3">
        <Link to={createPageUrl("NewEntry")}>
          <Button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            New Entry
          </Button>
        </Link>
      </div>
    </div>
  );
}
