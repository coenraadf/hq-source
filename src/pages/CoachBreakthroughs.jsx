import React, { useState, useEffect } from "react";
import { Entry, User, CoachingRelationship } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Search, 
  Sparkles,
  Calendar,
  TrendingUp,
  Users,
  Filter,
  ArrowLeft
} from "lucide-react";
import { format, subDays, subMonths } from "date-fns";
import { motion } from "framer-motion";
import EntryCard from "../components/entries/EntryCard";

export default function CoachBreakthroughsPage() {
  const [breakthroughs, setBreakthroughs] = useState([]);
  const [filteredBreakthroughs, setFilteredBreakthroughs] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [breakthroughs, searchQuery, timeFilter, selectedClients]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const coach = await User.me();
      
      const relationships = await CoachingRelationship.filter({
        coach_id: coach.id,
        status: 'active'
      });

      const clientIds = relationships.map(r => r.client_id).filter(Boolean);
      let clientsWithDetails = [];

      if (clientIds.length > 0) {
        // Fetch all clients in a single, efficient batch call
        const clientUsers = await User.filter({ id: { "$in": clientIds } });
        const clientUsersById = clientUsers.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});

        clientsWithDetails = relationships.map(relationship => {
          const clientUser = clientUsersById[relationship.client_id];
          if (clientUser) {
            return {
              ...clientUser,
              relationship: relationship
            };
          }
          return null;
        }).filter(Boolean);
      }
      
      setClients(clientsWithDetails);

      const clientEmails = clientsWithDetails.map(client => client.email).filter(Boolean);
      
      if (clientEmails.length > 0) {
        const allClientEntries = await Entry.filter({ created_by: { "$in": clientEmails }, is_breakthrough: true });
        
        const clientBreakthroughs = allClientEntries.filter(entry => 
          (entry.visibility === "shared_with_coach" || entry.visibility === "collaborative")
        );

        setBreakthroughs(clientBreakthroughs);
      } else {
        setBreakthroughs([]);
      }
    } catch (error) {
      console.error("Error loading breakthroughs:", error);
      setBreakthroughs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getClientDisplayName = (client) => {
    if (!client) return 'Unknown Client';
    if (client.preferred_display === "username" && client.username) return `@${client.username}`;
    if (client.preferred_display === "full_name" && client.full_name) return client.full_name;
    return client.preferred_app_name || client.full_name || 'Client';
  };

  const handleClientSelection = (clientId, checked) => {
    setSelectedClients(prev => 
      checked ? [...prev, clientId] : prev.filter(id => id !== clientId)
    );
  };

  const applyFilters = () => {
    let filtered = [...breakthroughs];

    if (selectedClients.length > 0) {
      const selectedClientEmails = clients
        .filter(c => selectedClients.includes(c.id))
        .map(c => c.email);
      filtered = filtered.filter(entry => selectedClientEmails.includes(entry.created_by));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => 
        (entry.title && entry.title.toLowerCase().includes(query)) ||
        (entry.content && entry.content.toLowerCase().includes(query)) ||
        (entry.tags && entry.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    if (timeFilter !== "all") {
      const now = new Date();
      let filterDate;
      switch (timeFilter) {
        case "week": filterDate = subDays(now, 7); break;
        case "month": filterDate = subMonths(now, 1); break;
        case "quarter": filterDate = subMonths(now, 3); break;
        case "year": filterDate = subMonths(now, 12); break;
        default: filterDate = null;
      }
      if (filterDate) {
        filtered = filtered.filter(entry => new Date(entry.created_date) >= filterDate);
      }
    }

    setFilteredBreakthroughs(filtered);
  };

  const getStats = () => {
    const total = breakthroughs.length;
    const thisWeek = breakthroughs.filter(b => new Date(b.created_date) > subDays(new Date(), 7)).length;
    const thisMonth = breakthroughs.filter(b => new Date(b.created_date) > subMonths(new Date(), 1)).length;
    return { total, thisWeek, thisMonth, activeClients: clients.length };
  };

  const stats = getStats();

  const handleEntryClick = (entry) => {
    navigate(createPageUrl(`EntryDetails?id=${entry.id}`));
  };

  return (
    <div className="min-h-screen p-6 md:p-8 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("CoachDashboard")}>
              <Button variant="outline" size="icon" className="btn-secondary">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-h1 flex items-center gap-3">
                <div className="icon-container-branded w-12 h-12">
                   <Sparkles className="w-6 h-6 text-white" />
                </div>
                Client Breakthroughs
              </h1>
              <p className="text-body-large text-text-secondary">
                Significant insights and discoveries shared by your clients
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { title: 'Total Breakthroughs', value: stats.total, icon: Sparkles },
            { title: 'This Week', value: stats.thisWeek, icon: TrendingUp },
            { title: 'This Month', value: stats.thisMonth, icon: Calendar },
            { title: 'Active Clients', value: stats.activeClients, icon: Users },
          ].map((stat, index) => (
            <Card key={index} className="base-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-secondary">{stat.title}</p>
                    <p className="text-3xl font-bold text-text-primary mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${index === 0 ? 'icon-container-branded' : 'bg-gray-100'}`}>
                    <stat.icon className={`w-6 h-6 ${index === 0 ? 'text-white' : 'text-text-secondary'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-12 gap-6"
        >
          <Card className="base-card lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter by Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-48 overflow-y-auto">
              {clients.map((client) => (
                <div key={client.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`client-${client.id}`}
                    checked={selectedClients.includes(client.id)}
                    onCheckedChange={(checked) => handleClientSelection(client.id, checked)}
                  />
                  <label htmlFor={`client-${client.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                    {getClientDisplayName(client)}
                  </label>
                </div>
              ))}
              {clients.length === 0 && <p className="text-sm text-text-muted">No active clients</p>}
            </CardContent>
          </Card>

          <div className="lg:col-span-9 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
              <Input
                placeholder="Search breakthroughs by keyword or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 form-input"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "week", "month", "quarter", "year"].map((filter) => (
                <Button key={filter} variant={timeFilter === filter ? "default" : "outline"} size="sm" onClick={() => setTimeFilter(filter)} className={timeFilter === filter ? "btn-primary" : "btn-secondary"}>
                  {filter === "all" ? "All Time" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-text-secondary mb-6">
            Showing {filteredBreakthroughs.length} of {breakthroughs.length} breakthroughs
            {selectedClients.length > 0 && ` from ${selectedClients.length} selected client(s)`}
          </p>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <Card key={i} className="animate-pulse base-card h-40" />)}
            </div>
          ) : filteredBreakthroughs.length === 0 ? (
            <div className="text-center py-16 base-card">
              <Sparkles className="w-16 h-16 text-[var(--brand-primary)] opacity-50 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">No breakthroughs match your criteria</h3>
              <p className="text-text-secondary">Try adjusting your search, time filter, or client selection.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBreakthroughs.map((entry, index) => (
                <EntryCard key={entry.id} entry={entry} index={index} viewMode="grid" onClick={() => handleEntryClick(entry)} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}