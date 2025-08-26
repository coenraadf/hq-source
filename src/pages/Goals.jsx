
import React, { useState, useEffect } from "react";
import { Goal } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
// Removed Tabs, TabsContent, TabsList, TabsTrigger as they are replaced by custom filter buttons
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Target, Calendar, CheckCircle, AlertCircle, Clock, TrendingUp, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { createPageUrl } from "@/utils"; // Unused in this file, but kept as per original
import { Link } from "react-router-dom"; // Unused in this file, but kept as per original

const priorityColors = {
  low: "bg-[#F5F1EB] text-[#6B7A5A] border-[#E5E0D8]",
  medium: "bg-[#F59E0B] bg-opacity-10 text-[#F59E0B] border-[#F59E0B] border-opacity-20",
  high: "bg-[#EF4444] bg-opacity-10 text-[#EF4444] border-[#EF4444] border-opacity-20",
  critical: "bg-[#DC2626] bg-opacity-10 text-[#DC2626] border-[#DC2626] border-opacity-20"
};

const statusColors = {
  active: "bg-[#10B981] bg-opacity-10 text-[#10B981] border-[#10B981] border-opacity-20",
  completed: "bg-[#6B7A5A] bg-opacity-10 text-[#6B7A5A] border-[#6B7A5A] border-opacity-20",
  paused: "bg-[#F59E0B] bg-opacity-10 text-[#F59E0B] border-[#F59E0B] border-opacity-20",
  cancelled: "bg-[#EF4444] bg-opacity-10 text-[#EF4444] border-[#EF4444] border-opacity-20"
};

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("active"); // Renamed from activeTab and default changed
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "personal",
    target_date: "",
    priority: "medium",
    status: "active"
  });

  useEffect(() => {
    loadGoals(); // Renamed from loadData
  }, []);

  const loadGoals = async () => { // Renamed from loadData
    setIsLoading(true);
    try {
      const [goalsData, userData] = await Promise.all([
        Goal.list("-created_date"),
        User.me()
      ]);
      setGoals(goalsData);
      setUser(userData);
    } catch (error) {
      console.error("Error loading goals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      await Goal.create(newGoal);
      setNewGoal({
        title: "",
        description: "",
        category: "personal",
        target_date: "",
        priority: "medium",
        status: "active"
      });
      setShowNewGoalDialog(false);
      loadGoals(); // Call loadGoals after creation
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  const handleUpdateGoal = async (goalId, updates) => {
    try {
      await Goal.update(goalId, updates);
      loadGoals(); // Call loadGoals after update
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (activeFilter === "all") return true;
    return goal.status === activeFilter; // Filter based on activeFilter
  });

  const filterButtons = [
    { label: "All Goals", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
    { label: "Paused", value: "paused" },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "active":
        return <Target className="w-4 h-4" />;
      case "paused":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 md:p-8 flex items-center justify-center bg-gradient-to-br from-[#FAF6F0] to-[#F5F1EB]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6B7A5A] mx-auto mb-4"></div>
          <p className="text-[#2D2D2D] text-base font-medium">Loading your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[var(--bg-primary)] p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="min-w-0 flex-1">
            <h1 className="text-h1 text-text-primary mb-2">My Goals</h1>
            <p className="text-body text-text-secondary">
              Track your progress and achieve your aspirations
            </p>
          </div>
          <Dialog open={showNewGoalDialog} onOpenChange={setShowNewGoalDialog}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" /> New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border-[#E5E0D8]">
              <DialogHeader>
                <DialogTitle className="text-[#1A1A1A]">Create New Goal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#1A1A1A] font-medium">Goal Title</Label>
                  <Input
                    id="title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    placeholder="What do you want to achieve?"
                    className="bg-white/80 border-[#E5E0D8] focus:border-[#6B7A5A] focus:ring-[#6B7A5A] focus:ring-opacity-20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#1A1A1A] font-medium">Description</Label>
                  <Textarea
                    id="description"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                    placeholder="Describe your goal in detail..."
                    className="bg-white/80 border-[#E5E0D8] focus:border-[#6B7A5A] focus:ring-[#6B7A5A] focus:ring-opacity-20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#1A1A1A] font-medium">Category</Label>
                    <Select value={newGoal.category} onValueChange={(value) => setNewGoal({...newGoal, category: value})}>
                      <SelectTrigger className="bg-white/80 border-[#E5E0D8] focus:border-[#6B7A5A] focus:ring-[#6B7A5A] focus:ring-opacity-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="relationships">Relationships</SelectItem>
                        <SelectItem value="learning">Learning</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="career">Career</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#1A1A1A] font-medium">Priority</Label>
                    <Select value={newGoal.priority} onValueChange={(value) => setNewGoal({...newGoal, priority: value})}>
                      <SelectTrigger className="bg-white/80 border-[#E5E0D8] focus:border-[#6B7A5A] focus:ring-[#6B7A5A] focus:ring-opacity-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target_date" className="text-[#1A1A1A] font-medium">Target Date</Label>
                  <Input
                    id="target_date"
                    type="date"
                    value={newGoal.target_date}
                    onChange={(e) => setNewGoal({...newGoal, target_date: e.target.value})}
                    className="bg-white/80 border-[#E5E0D8] focus:border-[#6B7A5A] focus:ring-[#6B7A5A] focus:ring-opacity-20"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowNewGoalDialog(false)} className="border-[#E5E0D8] text-[#2D2D2D]">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#6B7A5A] hover:bg-[#5A6B49] text-white">
                    Create Goal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="border-b border-[var(--border-color)]">
            <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2">
              {filterButtons.map(button => (
                <Button
                  key={button.value}
                  variant={activeFilter === button.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter(button.value)}
                  className={`flex-shrink-0 ${activeFilter === button.value ? 'btn-primary' : 'text-text-secondary hover:bg-[rgba(107,122,90,0.1)]'}`}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          </div>
            
          {/* Goal List Content */}
          <AnimatePresence>
            {filteredGoals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16"
              >
                <Target className="w-16 h-16 text-[#2D2D2D] opacity-40 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">No goals yet</h3>
                <p className="text-[#2D2D2D] opacity-60 mb-6">Create your first goal to start tracking your progress</p>
                <Button onClick={() => setShowNewGoalDialog(true)} className="bg-[#6B7A5A] hover:bg-[#5A6B49] text-white shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Goal
                </Button>
              </motion.div>
            ) : (
              <div className="grid gap-6 pt-6"> {/* Added pt-6 for spacing from filter buttons */}
                {filteredGoals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white/90 backdrop-blur-sm border-[#E5E0D8] hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${statusColors[goal.status]}`}>
                              {getStatusIcon(goal.status)}
                            </div>
                            <div>
                              <CardTitle className="text-[#1A1A1A] text-xl leading-tight">{goal.title}</CardTitle>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={`${priorityColors[goal.priority]} text-xs`}>
                                  {goal.priority} priority
                                </Badge>
                                <Badge className={`${statusColors[goal.status]} text-xs`}>
                                  {goal.status.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline" className="text-xs border-[#E5E0D8] text-[#2D2D2D]">
                                  {goal.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {goal.target_date && (
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-[#2D2D2D] text-sm">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(goal.target_date), "MMM d, yyyy")}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {goal.description && (
                          <p className="text-[#2D2D2D] leading-relaxed mb-4">{goal.description}</p>
                        )}
                        {goal.progress_percentage !== undefined && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-[#2D2D2D]">Progress</span>
                              <span className="text-[#6B7A5A] font-medium">{goal.progress_percentage}%</span>
                            </div>
                            <Progress value={goal.progress_percentage} className="h-2" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
