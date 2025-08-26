
import React, { useState, useEffect } from "react";
import { User, CoachingRelationship, ClientGroup, CoachInvitation } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Plus,
  Mail,
  MessageCircle,
  Calendar,
  Edit,
  Trash2,
  Copy,
  Check,
  UserPlus,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { SendEmail } from "@/api/integrations";

export default function ClientManagement() {
  const navigate = useNavigate();
  const [coach, setCoach] = useState(null);
  const [clients, setClients] = useState([]);
  const [clientGroups, setClientGroups] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isNewGroupDialogOpen, setIsNewGroupDialogOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    clientEmail: "",
    message: ""
  });
  const [newGroupForm, setNewGroupForm] = useState({
    name: "",
    description: "",
    color: "blue",
    company: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const coachUser = await User.me();
      
      // Verify user is actually a coach
      if (coachUser.user_type !== 'coach') {
        console.log("ClientManagement: User is not a coach, redirecting to client dashboard");
        navigate(createPageUrl("Dashboard"));
        return;
      }
      
      setCoach(coachUser);

      const groups = await ClientGroup.filter({ coach_id: coachUser.id });
      setClientGroups(groups);

      const coachRelationships = await CoachingRelationship.filter({
        coach_id: coachUser.id
      });
      setRelationships(coachRelationships);

      const clientIds = coachRelationships.map(r => r.client_id).filter(Boolean);
      let clientUsers = [];
      if (clientIds.length > 0) {
        try {
          // Fetch all clients in a single, more efficient call to avoid the User.get() bug
          clientUsers = await User.filter({ id: { "$in": clientIds } });
        } catch (error) {
          console.warn(`Could not fetch clients with IDs [${clientIds.join(', ')}]:`, error);
        }
      }
      
      const clientUsersById = clientUsers.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});

      const clientsWithDetails = coachRelationships.map(relationship => {
        const clientUser = clientUsersById[relationship.client_id];
        const displayName = clientUser?.preferred_app_name 
          || clientUser?.full_name 
          || relationship.client_name // Fallback to name stored on relationship
          || (relationship.client_email ? relationship.client_email.split('@')[0] : `Client`);

        return {
          id: relationship.client_id,
          email: clientUser?.email || relationship.client_email,
          preferred_app_name: displayName,
          full_name: clientUser?.full_name || displayName,
          profile_photo_url: clientUser?.profile_photo_url || null,
          username: clientUser?.username || null,
          preferred_display: clientUser?.preferred_display || "preferred_app_name",
          relationship: relationship
        };
      });
      
      setClients(clientsWithDetails);

      const pendingInvites = await CoachInvitation.filter({
        coach_id: coachUser.id,
        status: "pending"
      });
      setInvitations(pendingInvites);

    } catch (err) {
      console.error("Error loading client data:", err);
      
      if (err.message && (err.message.includes('401') || err.message.includes('Unauthorized'))) {
        console.log("ClientManagement: Authentication failed - redirecting to login");
        setError("Your session has expired. Please log in again.");
        
        // Clear any stored authentication data
        try {
          if (typeof window !== 'undefined') {
            if (window.sessionStorage) window.sessionStorage.clear();
            if (window.localStorage) {
              // Clear only auth-related items, keep layout preferences
              const keysToRemove = [];
              for (let i = 0; i < window.localStorage.length; i++) {
                const key = window.localStorage.key(i);
                if (key && !key.includes('dashboard_layout') && !key.includes('menu_items')) {
                  keysToRemove.push(key);
                }
              }
              keysToRemove.forEach(key => window.localStorage.removeItem(key));
            }
          }
        } catch (storageError) {
          console.warn("Could not clear storage:", storageError);
        }
        
        // Redirect to coach login after a brief delay
        setTimeout(() => {
          window.location.replace(createPageUrl("CoreCoachHome"));
        }, 2000);
        return;
      }
      
      if (err.message && err.message.includes('429')) {
        setError("Too many requests. Please wait a moment and try again.");
        setTimeout(() => {
          if (!coach) {
            console.log("ClientManagement: Retrying after rate limit");
            loadData();
          }
        }, 5000);
        return;
      }
      
      // For other errors, show a generic message
      setError("Failed to load client data. Please check your connection and try again.");
      setClients([]);
      setClientGroups([]);
      setRelationships([]);
      setInvitations([]);
      setCoach(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvitation = async () => {
    if (!inviteForm.clientEmail.trim()) return;

    try {
      const invitationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      await CoachInvitation.create({
        coach_id: coach.id,
        client_email: inviteForm.clientEmail.trim(),
        invitation_code: invitationCode,
        message: inviteForm.message.trim(),
        status: "pending", // Ensure status is explicitly set
        expires_at: expiresAt.toISOString()
      });

      // Send email invitation
      const emailBody = `
Hello!

${coach.preferred_app_name || coach.full_name} has invited you to start a coaching relationship through Core Compass.

${inviteForm.message ? `Personal message: "${inviteForm.message}"` : ''}

To accept this invitation, please visit: ${window.location.origin}/coach-invitation?code=${invitationCode}

This invitation expires on ${format(expiresAt, 'PPP')}.

Best regards,
The Core Compass Team
      `.trim();

      await SendEmail({
        to: inviteForm.clientEmail.trim(),
        subject: `Coaching Invitation from ${coach.preferred_app_name || coach.full_name}`,
        body: emailBody,
        from_name: "Core Compass"
      });

      setIsInviteDialogOpen(false);
      setInviteForm({ clientEmail: "", message: "" });
      loadData(); // Refresh to show new pending invitation
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("There was an error sending the invitation. Please try again.");
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupForm.name.trim()) return;

    try {
      await ClientGroup.create({
        name: newGroupForm.name.trim(),
        description: newGroupForm.description.trim(),
        color: newGroupForm.color,
        company: newGroupForm.company.trim(),
        coach_id: coach.id
      });

      setIsNewGroupDialogOpen(false);
      setNewGroupForm({ name: "", description: "", color: "blue", company: "" });
      loadData(); // Refresh to show new group
    } catch (error) {
      console.error("Error creating group:", error);
      alert("There was an error creating the group. Please try again.");
    }
  };

  const getClientDisplayName = (client) => {
    return client?.preferred_app_name || client?.full_name || client?.email || 'Client';
  };

  const getClientAvatar = (client) => {
    if (client?.profile_photo_url) {
      return client.profile_photo_url;
    }
    return null;
  };

  const filteredClients = clients.filter(client => {
    if (selectedGroup === "all") return true;
    if (selectedGroup === "ungrouped") return !client.relationship?.client_group_id;
    return client.relationship?.client_group_id === selectedGroup;
  });

  const ungroupedCount = clients.filter(c => !c.relationship?.client_group_id).length;

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)] mx-auto mb-4" />
          <p className="text-text-secondary">Loading your clients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6 md:p-8 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 mx-auto mb-4">
            <Users className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">Connection Error</h3>
          <p className="text-text-secondary text-base font-medium mb-4">{error}</p>
          {error.includes('session has expired') ? (
            <p className="text-sm text-text-muted">Redirecting to login page...</p>
          ) : (
            <Button onClick={loadData} className="btn-primary">
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-h1">Client Management</h1>
            <p className="text-body-large text-text-secondary">
              Manage your coaching relationships and organize clients into groups
            </p>
          </div>
          <div className="flex gap-3">
            <Dialog open={isNewGroupDialogOpen} onOpenChange={setIsNewGroupDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="btn-secondary">
                  <Users className="w-4 h-4 mr-2" />
                  New Group
                </Button>
              </DialogTrigger>
              <DialogContent className="base-card">
                <DialogHeader>
                  <DialogTitle>Create Client Group</DialogTitle>
                  <DialogDescription>
                    Organize your clients into groups for better management
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="group-name">Group Name</Label>
                    <Input
                      id="group-name"
                      value={newGroupForm.name}
                      onChange={(e) => setNewGroupForm(prev => ({...prev, name: e.target.value}))}
                      placeholder="e.g., Executive Coaching, Life Coaching"
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="group-desc">Description</Label>
                    <Textarea
                      id="group-desc"
                      value={newGroupForm.description}
                      onChange={(e) => setNewGroupForm(prev => ({...prev, description: e.target.value}))}
                      placeholder="Optional description for this group"
                      className="form-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="group-color">Color</Label>
                      <Select 
                        value={newGroupForm.color} 
                        onValueChange={(value) => setNewGroupForm(prev => ({...prev, color: value}))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="orange">Orange</SelectItem>
                          <SelectItem value="red">Red</SelectItem>
                          <SelectItem value="pink">Pink</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="group-company">Company</Label>
                      <Input
                        id="group-company"
                        value={newGroupForm.company}
                        onChange={(e) => setNewGroupForm(prev => ({...prev, company: e.target.value}))}
                        placeholder="Optional"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewGroupDialogOpen(false)} className="btn-secondary">
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGroup} className="btn-primary" disabled={!newGroupForm.name.trim()}>
                    Create Group
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-primary">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Client
                </Button>
              </DialogTrigger>
              <DialogContent className="base-card">
                <DialogHeader>
                  <DialogTitle>Invite New Client</DialogTitle>
                  <DialogDescription>
                    Send an invitation to start a coaching relationship
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="client-email">Client Email</Label>
                    <Input
                      id="client-email"
                      type="email"
                      value={inviteForm.clientEmail}
                      onChange={(e) => setInviteForm(prev => ({...prev, clientEmail: e.target.value}))}
                      placeholder="client@example.com"
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-message">Personal Message (Optional)</Label>
                    <Textarea
                      id="invite-message"
                      value={inviteForm.message}
                      onChange={(e) => setInviteForm(prev => ({...prev, message: e.target.value}))}
                      placeholder="Add a personal message to your invitation..."
                      className="form-input"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)} className="btn-secondary">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSendInvitation} 
                    className="btn-primary"
                    disabled={!inviteForm.clientEmail.trim()}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.header>

        {/* Group Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-2"
        >
          <Button
            variant={selectedGroup === "all" ? "default" : "outline"}
            onClick={() => setSelectedGroup("all")}
            className={selectedGroup === "all" ? "btn-primary" : "btn-secondary"}
          >
            All Clients ({clients.length})
          </Button>
          <Button
            variant={selectedGroup === "ungrouped" ? "default" : "outline"}
            onClick={() => setSelectedGroup("ungrouped")}
            className={selectedGroup === "ungrouped" ? "btn-primary" : "btn-secondary"}
          >
            Ungrouped ({ungroupedCount})
          </Button>
          {clientGroups.map((group) => {
            const groupCount = clients.filter(c => c.relationship?.client_group_id === group.id).length;
            return (
              <Button
                key={group.id}
                variant={selectedGroup === group.id ? "default" : "outline"}
                onClick={() => setSelectedGroup(group.id)}
                className={selectedGroup === group.id ? "btn-primary" : "btn-secondary"}
              >
                {group.name} ({groupCount})
              </Button>
            );
          })}
        </motion.div>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="base-card border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Pending Invitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invitations.map((invitation) => (
                    <div key={invitation.id} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-text-primary">{invitation.client_email}</p>
                        <p className="text-sm text-text-muted">
                          Sent {format(new Date(invitation.created_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-amber-700 border-amber-300">
                        Pending
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Client List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-text-secondary" />
            <h2 className="text-xl font-semibold text-text-primary">
              {selectedGroup === "all" ? "All Clients" :
               selectedGroup === "ungrouped" ? "Ungrouped Clients" :
               clientGroups.find(g => g.id === selectedGroup)?.name || "Clients"} ({filteredClients.length})
            </h2>
          </div>

          {filteredClients.length === 0 ? (
            <Card className="base-card">
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-secondary mb-2">
                  {clients.length === 0 ? "No clients yet" : "No clients in this group"}
                </h3>
                <p className="text-text-muted mb-4">
                  {clients.length === 0 
                    ? "Start building your coaching practice by inviting your first client."
                    : "All your clients are in other groups or ungrouped."
                  }
                </p>
                {clients.length === 0 && (
                  <Button onClick={() => setIsInviteDialogOpen(true)} className="btn-primary">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Your First Client
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredClients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ClientCard component
function ClientCard({ client }) {
  const getClientDisplayName = (client) => {
    return client?.preferred_app_name || client?.full_name || client?.email || 'Client';
  };

  const getClientAvatar = (client) => {
    if (client?.profile_photo_url) {
      return client.profile_photo_url;
    }
    return null;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Link
      to={createPageUrl(`ClientDetails?id=${client.id}`)}
      className="block"
    >
      <Card className="base-card hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-[var(--brand-primary)]">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={getClientAvatar(client)} />
                <AvatarFallback className="brand-gradient text-white font-semibold">
                  {getClientDisplayName(client).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-text-primary">
                  {getClientDisplayName(client)}
                </h3>
                <p className="text-sm text-text-muted">{client.email}</p>
                {client.relationship?.start_date && (
                  <p className="text-xs text-text-muted flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    Started {format(new Date(client.relationship.start_date), 'MMM d, yyyy')}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(client.relationship?.status || 'active')}>
                {client.relationship?.status || 'active'}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="text-text-muted hover:text-[var(--brand-primary)]"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle message client action
                }}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
