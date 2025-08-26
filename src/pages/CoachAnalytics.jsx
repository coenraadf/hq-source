
import React, { useState, useEffect } from "react";
import { Entry, User, CoachingRelationship } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Calendar,
  Sparkles,
  MessageSquare,
  Target,
  ArrowLeft,
  BookOpen
} from "lucide-react";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { motion } from "framer-motion";

export default function CoachAnalyticsPage() {
  const [clients, setClients] = useState([]);
  const [clientEntries, setClientEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const coach = await User.me();
      
      // Get coaching relationships
      const relationships = await CoachingRelationship.filter({
        coach_id: coach.id,
        status: 'active'
      });

      // Load client details efficiently in a single batch
      const clientIds = relationships.map(r => r.client_id).filter(Boolean);
      let clientsWithDetails = [];

      if (clientIds.length > 0) {
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

      // Get entries from all clients
      if (clientsWithDetails.length > 0) {
        const clientEmails = clientsWithDetails.map(client => client.email);
        const allEntries = await Entry.list("-created_date");
        const clientEntriesFiltered = allEntries.filter(entry => 
          clientEmails.includes(entry.created_by)
        );
        setClientEntries(clientEntriesFiltered);
      }
    } catch (error) {
      console.error("Error loading analytics data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate real metrics
  const calculateMetrics = () => {
    const now = new Date();
    const weekAgo = subDays(now, 7);
    const monthAgo = subMonths(now, 1);
    const startMonth = startOfMonth(now);
    const endMonth = endOfMonth(now);

    const thisWeekEntries = clientEntries.filter(entry => 
      new Date(entry.created_date) >= weekAgo
    );

    const thisMonthEntries = clientEntries.filter(entry => 
      new Date(entry.created_date) >= startMonth && new Date(entry.created_date) <= endMonth
    );

    const breakthroughs = clientEntries.filter(entry => 
      entry.is_breakthrough && 
      (entry.visibility === "shared_with_coach" || entry.visibility === "collaborative")
    );

    const sharedEntries = clientEntries.filter(entry => 
      entry.visibility === "shared_with_coach" || entry.visibility === "collaborative"
    );

    return {
      totalClients: clients.length,
      activeThisWeek: new Set(thisWeekEntries.map(e => e.created_by)).size,
      entriesThisWeek: thisWeekEntries.length,
      entriesThisMonth: thisMonthEntries.length,
      totalBreakthroughs: breakthroughs.length,
      totalSharedEntries: sharedEntries.length,
      engagementRate: clients.length > 0 ? Math.round((new Set(thisWeekEntries.map(e => e.created_by)).size / clients.length) * 100) : 0
    };
  };

  const metrics = calculateMetrics();

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 md:p-8 flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)] mx-auto mb-4"></div>
          <p className="text-text-secondary text-base font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div className="flex items-center gap-4">
            <Link to={createPageUrl("CoachDashboard")}>
              <Button
                variant="outline"
                size="icon"
                className="btn-secondary"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-h1 flex items-center gap-3">
                <BarChart3 className="w-10 h-10 text-[var(--brand-primary)]" />
                Analytics Dashboard
              </h1>
              <p className="text-body-large text-text-secondary">
                Insights into your coaching practice and client engagement
              </p>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="base-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Total Clients</p>
                  <p className="text-3xl font-bold text-text-primary mt-2">{metrics.totalClients}</p>
                </div>
                <div className="p-3 rounded-2xl icon-container-branded">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="base-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Active This Week</p>
                  <p className="text-3xl font-bold text-text-primary mt-2">{metrics.activeThisWeek}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="base-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Shared Entries</p>
                  <p className="text-3xl font-bold text-text-primary mt-2">{metrics.totalSharedEntries}</p>
                </div>
                <BookOpen className="w-8 h-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card className="base-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Breakthroughs</p>
                  <p className="text-3xl font-bold text-text-primary mt-2">{metrics.totalBreakthroughs}</p>
                </div>
                <Sparkles className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Engagement Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="base-card">
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Entries This Week</span>
                  <Badge className="bg-blue-100 text-blue-800">{metrics.entriesThisWeek}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Entries This Month</span>
                  <Badge className="bg-green-100 text-green-800">{metrics.entriesThisMonth}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Engagement Rate</span>
                  <Badge className={`${metrics.engagementRate >= 70 ? 'bg-green-100 text-green-800' : metrics.engagementRate >= 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {metrics.engagementRate}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="base-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {clientEntries.length === 0 ? (
                <p className="text-sm text-text-secondary">No client activity yet.</p>
              ) : (
                <div className="space-y-3">
                  {clientEntries.slice(0, 5).map((entry, index) => {
                    const client = clients.find(c => c.email === entry.created_by);
                    return (
                      <div key={entry.id} className="flex justify-between items-center py-2">
                        <div>
                          <p className="text-sm font-medium">{entry.title}</p>
                          <p className="text-xs text-text-secondary">
                            by {client?.preferred_app_name || client?.full_name || 'Unknown Client'}
                          </p>
                        </div>
                        <span className="text-xs text-text-secondary">
                          {format(new Date(entry.created_date), 'MMM d')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* No Data State */}
        {clients.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="base-card text-center py-12">
              <CardContent>
                <Users className="w-16 h-16 text-stone-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">No Clients Yet</h3>
                <p className="text-text-secondary mb-6 max-w-md mx-auto">
                  Start building your coaching practice by inviting clients. Analytics will appear as your clients begin their journey.
                </p>
                <Link to={createPageUrl("ClientManagement")}>
                  <Button className="btn-primary">
                    Invite Your First Client
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
