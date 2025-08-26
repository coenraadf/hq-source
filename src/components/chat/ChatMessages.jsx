import React, { useRef, useEffect, useState } from 'react';
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import { User, Loader2, BookOpen, FileText, Brain, Bot } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const iconMap = {
  Entry: <BookOpen className="w-4 h-4" />,
  Resource: <FileText className="w-4 h-4" />,
  PersonalityTest: <Brain className="w-4 h-4" />,
}

const SourcePopover = ({ sourceId, sourceMap }) => {
  const source = sourceMap.get(sourceId);
  if (!source) return <span className="text-xs font-semibold">Unknown Source</span>;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="px-2 py-1 bg-[rgba(var(--brand-primary-r),var(--brand-primary-g),var(--brand-primary-b),0.1)] text-[var(--brand-primary)] rounded-md text-xs font-medium hover:bg-[rgba(var(--brand-primary-r),var(--brand-primary-g),var(--brand-primary-b),0.2)] transition-colors">
          Source: {source.title}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 base-card">
        <div className="flex items-center gap-3">
          <div className="icon-container-branded w-10 h-10">
            {iconMap[source.type] || <FileText className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{source.title}</p>
            <p className="text-xs text-[var(--text-muted)]">{source.type}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default function ChatMessages({ messages, isLoading, currentUser, sourceMap }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  const getUserDisplayName = (user) => {
    if (!user) return 'You';
    return user?.preferred_app_name || user?.full_name || 'You';
  };

  const getUserAvatar = (user) => {
    if (user?.profile_photo_url) {
      return (
        <img 
          src={user.profile_photo_url} 
          alt="Profile" 
          className="w-full h-full object-cover rounded-full"
        />
      );
    }
    const initial = getUserDisplayName(user).charAt(0).toUpperCase();
    return <span className="font-semibold">{initial}</span>;
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-start gap-4 max-w-3xl ${
            message.role === 'user' ? 'ml-auto flex-row-reverse' : ''
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden ${
            message.role === 'user'
              ? 'bg-[var(--brand-secondary)] text-white'
              : 'icon-container-branded'
          }`}>
            {message.role === 'user' ? (
              getUserAvatar(currentUser)
            ) : (
              <Bot className="w-6 h-6" />
            )}
          </div>
          <div className={`p-4 rounded-2xl w-full ${
            message.isError
              ? 'bg-red-50 border border-red-200 rounded-lg'
              : message.role === 'user'
                ? 'bg-white border border-[var(--border-color)] rounded-br-none'
                : 'bg-white border border-[var(--border-color)] rounded-bl-none'
          }`}>
            <p className={`text-xs mb-2 font-medium ${message.isError ? 'text-red-600' : message.role === 'user' ? 'text-[var(--text-muted)]' : 'text-[var(--brand-primary)]'}`}>
              {message.role === 'user' ? getUserDisplayName(currentUser) : 'Sage'}
            </p>
            <article className={`prose prose-sm max-w-none ${message.isError ? 'text-red-800' : 'text-[var(--text-secondary)]'}`}>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </article>
            {message.source_ids && message.source_ids.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex flex-wrap gap-2">
                {message.source_ids.map(id => (
                  <SourcePopover key={id} sourceId={id} sourceMap={sourceMap} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 max-w-3xl"
        >
          <div className="icon-container-branded w-10 h-10 animate-pulse">
            <Bot className="w-6 h-6" />
          </div>
          <div className="p-4 rounded-2xl bg-white border border-[var(--border-color)] rounded-bl-none w-full">
            <p className="text-xs text-[var(--brand-primary)] mb-2 font-medium">Sage is thinking...</p>
            <div className="space-y-2">
              <Skeleton className="h-4 w-5/6 bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-200" />
              <Skeleton className="h-4 w-3/4 bg-gray-200" />
            </div>
          </div>
        </motion.div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}