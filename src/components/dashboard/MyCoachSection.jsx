import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User as UserIcon,
  Mail,
  MessageSquare,
  FileText,
  Calendar,
  Send,
  Phone,
  Building
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { User } from "@/api/entities";
import { CoachingRelationship } from "@/api/entities";
import { Entry } from "@/api/entities";
import { SendEmail } from "@/api/integrations";

export default function MyCoachSection() {
  const [coach, setCoach] = useState(null);
  const [relationship, setRelationship] = useState(null);
  const [coachNotes, setCoachNotes] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageForm, setMessageForm] = useState({ title: "", content: "" });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadCoachData();
  }, []);

  const loadCoachData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      if (currentUser.user_type !== 'client') {
        setIsLoading(false);
        return;
      }
      setUser(currentUser);

      // Get coaching relationship to find the coach
      const relationships = await CoachingRelationship.filter({
        client_id: currentUser.id
      });
      
      if (relationships.length > 0) {
        setRelationship(relationships[0]);
        
        // Get coach details
        const coachData = await User.get(relationships[0].coach_id);
        setCoach(coachData);

        // Get notes shared by coach with this client
        const allEntries = await Entry.list("-created_date");
        const sharedNotes = allEntries.filter(entry => 
          entry.created_by === coachData.email &&
          entry.recipient_user_id === currentUser.id &&
          !entry.is_private
        );
        setCoachNotes(sharedNotes);
      }
    } catch (error) {
      console.error("Error loading coach data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageForm.title.trim() || !messageForm.content.trim()) return;

    setIsSending(true);
    try {
      // Create entry as message to coach
      await Entry.create({
        title: `Message from ${user.full_name || user.email}: ${messageForm.title}`,
        content: messageForm.content.trim(),
        type: "note",
        visibility: "shared_with_coach",
        tags: ["client-message"]
      });

      // Send email notification to coach
      try {
        await SendEmail({
          to: coach.email,
          subject: `Message from your client: ${messageForm.title}`,
          body: `Hello ${coach.full_name || coach.email},

Your client ${user.full_name || user.email} has sent you a message:

"${messageForm.title}"

${messageForm.content}

You can view this message in your coach dashboard.

Best regards,
Inner Compass`,
          from_name: user.full_name || "Your Client"
        });
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
      }

      setMessageForm({ title: "", content: "" });
      setShowMessageDialog(false);
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("There was an error sending the message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const getCoachDisplayName = (coach) => {
    if (!coach) return 'Your Coach';
    return coach.custom_full_name || coach.full_name || coach.email;
  };

  const getCoachAvatar = (coach) => {
    if (coach?.profile_photo_url) {
      return (
        <img 
          src={coach.profile_photo_url} 
          alt="Coach Profile" 
          className="w-full h-full object-cover rounded-full"
        />
      );
    }
    return getCoachDisplayName(coach).charAt(0);
  };

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            My Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-stone-200 rounded w-1/2"></div>
            <div className="h-4 bg-stone-200 rounded w-3/4"></div>
            <div className="h-16 bg-stone-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!coach) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            My Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <UserIcon className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-600 mb-2">No coach assigned</p>
            <p className="text-stone-500 text-sm">Connect with a coach to get personalized guidance.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Coach Profile Card */}
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-800">
            <UserIcon className="w-5 h-5" />
            My Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold overflow-hidden">
              {getCoachAvatar(coach)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-stone-800 mb-1">
                {getCoachDisplayName(coach)}
              </h3>
              {coach.specialization && (
                <p className="text-sm text-indigo-700 mb-2">{coach.specialization}</p>
              )}
              <div className="space-y-1 text-sm text-stone-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{coach.email}</span>
                </div>
                {coach.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{coach.phone}</span>
                  </div>
                )}
                {coach.company && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>{coach.company}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {coach.bio && (
            <div className="mb-4 p-3 bg-white/50 rounded-lg">
              <p className="text-sm text-stone-700 leading-relaxed">{coach.bio}</p>
            </div>
          )}

          {relationship && (
            <div className="mb-4 p-3 bg-white/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-600">Coaching since:</span>
                <span className="font-medium text-stone-800">
                  {format(new Date(relationship.start_date), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-stone-600">Status:</span>
                <Badge className={
                  relationship.status === 'active' ? 'bg-green-100 text-green-800' :
                  relationship.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {relationship.status}
                </Badge>
              </div>
            </div>
          )}

          <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message to Coach
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Message to {getCoachDisplayName(coach)}</DialogTitle>
                <DialogDescription>
                  Your coach will receive this message and an email notification.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="message_title" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="message_title"
                    value={messageForm.title}
                    onChange={(e) => setMessageForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="What's this about?"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message_content" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message_content"
                    value={messageForm.content}
                    onChange={(e) => setMessageForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your thoughts, questions, or updates..."
                    className="min-h-[120px]"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendMessage} disabled={isSending}>
                    <Send className="w-4 h-4 mr-2" />
                    {isSending ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Coach Notes */}
      <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Notes from Coach ({coachNotes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {coachNotes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-8 h-8 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500 text-sm">No shared notes yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {coachNotes.map((note) => (
                <div key={note.id} className="p-4 border border-stone-200 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-stone-800">{note.title}</h4>
                    <span className="text-xs text-stone-500">
                      {format(new Date(note.created_date), "MMM d, h:mm a")}
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none text-stone-600">
                    <p className="leading-relaxed">{note.content}</p>
                  </div>
                  {note.type === "coach_message" && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      Coach Message
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}