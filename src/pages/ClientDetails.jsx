
import React, { useState, useEffect } from "react";
import { User, Entry, CoachingRelationship } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  MessageSquare,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  FileText,
  TrendingUp,
  Heart,
  Target,
  Send // New import for the Send icon
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

// New imports for the Dialog and form components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ClientDetailsPage() { // Renamed component from ClientDetails
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [relationship, setRelationship] = useState(null);
  const [clientEntries, setClientEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // New state variables for the message dialog
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageForm, setMessageForm] = useState({ title: "", content: "" });
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    setIsLoading(true);
    try {
      // Get client ID from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const clientId = urlParams.get('id');
      
      if (!clientId) {
        navigate(createPageUrl("ClientManagement"));
        return;
      }

      // Load client details
      const clientData = await User.get(clientId);
      setClient(clientData);

      // Load coaching relationship
      const coach = await User.me();
      const relationships = await CoachingRelationship.filter({
        coach_id: coach.id,
        client_id: clientId
      });
      
      if (relationships.length > 0) {
        setRelationship(relationships[0]);
      }

      // Load client's shared entries
      const entries = await Entry.filter({
        created_by: clientData.email,
        visibility: "shared_with_coach"
      }, "-created_date", 50);
      
      setClientEntries(entries);

    } catch (error) {
      console.error("Error loading client data:", error);
      navigate(createPageUrl("ClientManagement"));
    } finally {
      setIsLoading(false);
    }
  };

  const getClientDisplayName = (client) => {
    if (client?.preferred_display === "username" && client?.username) {
      return `@${client.username}`;
    }
    if (client?.preferred_display === "full_name" && client?.full_name) {
      return client.full_name;
    }
    return client?.preferred_app_name || client?.full_name || 'Client';
  };

  const getClientAvatar = (client) => {
    if (client?.profile_photo_url) {
      return (
        <img 
          src={client.profile_photo_url} 
          alt="Profile" 
          className="w-full h-full object-cover rounded-full"
        />
      );
    }
    return getClientDisplayName(client).charAt(0).toUpperCase();
  };

  // New function to handle sending messages
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageForm.title.trim() || !messageForm.content.trim()) return;

    if (!client?.id) {
      alert("Client data not loaded. Cannot send message.");
      return;
    }

    setIsSendingMessage(true);
    try {
      await Entry.create({
        title: messageForm.title.trim(),
        content: messageForm.content.trim(),
        type: 'coach_message',
        recipient_user_id: client.id, // Use client.id as recipient
      });

      setMessageForm({ title: "", content: "" });
      setShowMessageDialog(false);
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("There was an error sending your message. Please try again.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen p-6 md:p-8 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <p className="text-stone-600 mb-4">Client not found</p>
            <Button onClick={() => navigate(createPageUrl("ClientManagement"))}>
              Back to Client Management
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl("ClientManagement"))}
              className="warm-border hover:bg-stone-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden coach-gradient flex items-center justify-center text-white text-2xl font-semibold">
                {getClientAvatar(client)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-warm-primary">{getClientDisplayName(client)}</h1>
                <p className="text-warm-secondary">{client?.email}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
              <DialogTrigger asChild>
                <Button className="coach-gradient hover:opacity-90 text-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Send Message to {getClientDisplayName(client)}</DialogTitle>
                  <DialogDescription>
                    Send a coaching message or insight to your client.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message_title">Message Title</Label>
                    <Input
                      id="message_title"
                      placeholder="e.g., Follow-up from our session"
                      value={messageForm.title}
                      onChange={(e) => setMessageForm(prev => ({ ...prev, title: e.target.value }))}
                      className="border-stone-200 focus:border-amber-300"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message_content">Message Content</Label>
                    <Textarea
                      id="message_content"
                      placeholder="Share your thoughts or instructions here..."
                      value={messageForm.content}
                      onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
                      className="min-h-[120px] border-stone-200 focus:border-amber-300"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowMessageDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSendingMessage}>
                      <Send className="w-4 h-4 mr-2" />
                      {isSendingMessage ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Client Overview and Actions */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Client Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Client Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-stone-500">Email</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-stone-400" />
                        <span className="text-stone-800">{client.email}</span>
                      </div>
                    </div>
                    
                    {client.phone && (
                      <div>
                        <label className="text-sm font-medium text-stone-500">Phone</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4 text-stone-400" />
                          <span className="text-stone-800">{client.phone}</span>
                        </div>
                      </div>
                    )}
                    
                    {client.company && (
                      <div>
                        <label className="text-sm font-medium text-stone-500">Company</label>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4 text-stone-400" />
                          <span className="text-stone-800">{client.company}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {relationship && (
                      <>
                        <div>
                          <label className="text-sm font-medium text-stone-500">Started</label>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-stone-400" />
                            <span className="text-stone-800">
                              {format(new Date(relationship.start_date), "MMM d, yyyy")}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-stone-500">Status</label>
                          <div className="mt-1">
                            <Badge className={`${
                              relationship.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                              relationship.status === 'paused' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-gray-100 text-gray-800 border-gray-200'
                            } border`}>
                              {relationship.status}
                            </Badge>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {relationship?.notes && (
                  <div>
                    <label className="text-sm font-medium text-stone-500">Notes</label>
                    <p className="text-stone-800 mt-1 p-3 bg-stone-50 rounded-lg">
                      {relationship.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions and Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-stone-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* The "Send Message" button is now handled by the Dialog in the header */}
                <Button variant="outline" className="w-full border-stone-200 hover:bg-stone-50">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
                <Button variant="outline" className="w-full border-stone-200 hover:bg-stone-50">
                  <FileText className="w-4 h-4 mr-2" />
                  Session Notes
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-stone-800">Activity Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-stone-600">Shared Entries</span>
                  </div>
                  <span className="font-semibold text-stone-800">{clientEntries.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-stone-600">Breakthroughs</span>
                  </div>
                  <span className="font-semibold text-stone-800">
                    {clientEntries.filter(e => e.is_breakthrough).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span className="text-sm text-stone-600">Reflections</span>
                  </div>
                  <span className="font-semibold text-stone-800">
                    {clientEntries.filter(e => e.type === 'reflection').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Shared Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-stone-800">
                <FileText className="w-5 h-5" />
                Recent Shared Entries ({clientEntries.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clientEntries.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-stone-600 mb-2">No shared entries yet</h3>
                  <p className="text-stone-500">
                    Entries your client shares with you will appear here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clientEntries.slice(0, 10).map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-stone-800 flex items-center gap-2">
                          {entry.title}
                          {entry.is_breakthrough && (
                            <Sparkles className="w-4 h-4 text-amber-500" />
                          )}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {entry.type}
                        </Badge>
                      </div>
                      <p className="text-stone-600 text-sm line-clamp-2 mb-2">
                        {entry.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-stone-500">
                        <span>{formatDistanceToNow(new Date(entry.created_date), { addSuffix: true })}</span>
                        {entry.mood && (
                          <Badge variant="secondary" className="text-xs">
                            {entry.mood}
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
