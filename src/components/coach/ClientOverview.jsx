import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, MessageSquare, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
};

export default function ClientOverview({ clients, relationships, isLoading }) {
  const getClientDisplayName = (client) => {
    if (client?.preferred_display === "username" && client?.username) {
      return `@${client.username}`;
    }
    if (client?.preferred_display === "full_name" && client?.full_name) {
      return client.full_name;
    }
    return client?.preferred_app_name || client?.full_name || `Client ${client?.id?.slice(-6) || 'Unknown'}`;
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

  if (isLoading) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Your Clients
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-4 border border-stone-200 rounded-xl">
              <Skeleton className="h-5 w-1/3 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Work with actual client data now
  const displayClients = clients || [];

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-stone-200/60 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-stone-800">
          <Users className="w-5 h-5" />
          Your Clients ({displayClients.length})
        </CardTitle>
        <Link to={createPageUrl("ClientManagement")}>
          <Button variant="outline" size="sm">
            View All <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {displayClients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-600 mb-2">No clients yet</h3>
            <p className="text-stone-500 mb-4">Start by adding your first client to begin coaching</p>
            <Link to={createPageUrl("ClientManagement")}>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                Add Client
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayClients.slice(0, 5).map((client, index) => {
              const relationship = client.relationship;
              return (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={createPageUrl(`ClientDetails?id=${client.id}`)}
                    className="block p-4 border border-stone-200/60 rounded-xl hover:shadow-md hover:border-stone-300 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                          {getClientAvatar(client)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-stone-800 group-hover:text-stone-900">
                            {getClientDisplayName(client)}
                          </h3>
                          <p className="text-stone-600 text-sm">
                            {client.email || 'Coaching relationship'}
                          </p>
                          {relationship?.start_date && (
                            <p className="text-stone-500 text-xs mt-1">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              Started {format(new Date(relationship.start_date), "MMM d, yyyy")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="secondary" 
                          className={`${statusColors[relationship?.status || 'active']} border text-xs`}
                        >
                          {relationship?.status || 'active'}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {relationship?.goals && relationship.goals.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-stone-100">
                        <p className="text-xs text-stone-500 mb-1">Current Goals</p>
                        <div className="flex flex-wrap gap-1">
                          {relationship.goals.slice(0, 2).map((goal, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {goal.title}
                            </Badge>
                          ))}
                          {relationship.goals.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{relationship.goals.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}