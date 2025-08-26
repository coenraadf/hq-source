
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Conversation, Entry, Resource, PersonalityTest, User } from "@/api/entities";
import { InvokeLLM, UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Menu, Loader2, Save, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";

import ChatInput from "../components/chat/ChatInput";
import ChatMessages from "../components/chat/ChatMessages";
import ConversationSidebar from "../components/chat/ConversationSidebar";
import WelcomeScreen from "../components/chat/WelcomeScreen";
import ContextSelector from "../components/chat/ContextSelector";

const dataCache = {};
const CACHE_DURATION = 5 * 60 * 1000;

export default function Chat() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authError, setAuthError] = useState(null);

  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [availableEntries, setAvailableEntries] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedContext, setSelectedContext] = useState({ entries: [], resources: [], tests: [] });
  const [sourceMap, setSourceMap] = useState(new Map());

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [resourceDetails, setResourceDetails] = useState({ title: "", description: "" });
  const [isSavingResource, setIsSavingResource] = useState(false);

  const [rateLimitRetryCount, setRateLimitRetryCount] = useState(0);
  const loadingTimeoutRef = useRef(null);
  const maxRetries = 3;

  const isCacheValid = (key) => dataCache[key] && (Date.now() - dataCache[key].lastLoaded) < CACHE_DURATION;
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const loadInitialData = useCallback(async (forceReload = false) => {
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    setIsLoading(true);
    setAuthError(null);

    try {
      const cacheKey = 'chatData';
      if (!forceReload && isCacheValid(cacheKey)) {
        const cached = dataCache[cacheKey].data;
        setUser(cached.user);
        setConversations(cached.conversations);
        setAvailableEntries(cached.entries);
        setAvailableResources(cached.resources);
        setAvailableTests(cached.tests);
        setIsLoading(false);
        return;
      }

      const userData = await User.me();
      setUser(userData);

      const [conversationsData, entries, resources, tests] = await Promise.allSettled([
        Conversation.list("-updated_date", 50),
        delay(200).then(() => Entry.list("-created_date", 100)),
        delay(400).then(() => Resource.list("-created_date", 100)),
        delay(600).then(() => PersonalityTest.list("-date_taken", 50))
      ]);

      const loadedConversations = conversationsData.status === 'fulfilled' ? conversationsData.value : [];
      const loadedEntries = entries.status === 'fulfilled' ? entries.value : [];
      const loadedResources = resources.status === 'fulfilled' ? resources.value : [];
      const loadedTests = tests.status === 'fulfilled' ? tests.value : [];

      setConversations(loadedConversations);
      setAvailableEntries(loadedEntries);
      setAvailableResources(loadedResources);
      setAvailableTests(loadedTests);

      dataCache[cacheKey] = {
        data: { user: userData, conversations: loadedConversations, entries: loadedEntries, resources: loadedResources, tests: loadedTests },
        lastLoaded: Date.now()
      };
      setRateLimitRetryCount(0);
    } catch (error) {
      console.error("Error loading initial data:", error);
      if (error.message?.includes('401')) {
        setAuthError("Your session has expired. Please log in again.");
        setTimeout(() => navigate(createPageUrl("CoreCompassHome")), 2000);
      } else if (error.message?.includes('429')) {
        if (rateLimitRetryCount < maxRetries) {
          setRateLimitRetryCount(prev => prev + 1);
          const retryDelay = 2000 * Math.pow(2, rateLimitRetryCount);
          setAuthError(`Server is busy. Retrying in ${Math.ceil(retryDelay / 1000)}s...`);
          loadingTimeoutRef.current = setTimeout(() => loadInitialData(false), retryDelay);
        } else {
          setAuthError("Server is overwhelmed. Please wait a minute and refresh.");
        }
      } else {
        setAuthError("Failed to load chat data. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [rateLimitRetryCount, navigate]);

  useEffect(() => {
    loadInitialData();
    return () => { if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current); };
  }, [loadInitialData]);

  const selectConversation = (convoId) => {
    const conversation = conversations.find(c => c.id === convoId);
    if (conversation) {
      setActiveConversation(conversation);
      setSelectedContext({
        entries: conversation.context_entry_ids || [],
        resources: conversation.context_resource_ids || [],
        tests: conversation.context_personality_test_ids || [],
      });
      setIsSidebarOpen(false);
    }
  };
  
  const createNewConversation = () => {
    setActiveConversation(null);
    setSelectedContext({ entries: [], resources: [], tests: [] });
    setIsSidebarOpen(false);
  };
  
  const updateConversationTitle = async (convoId, newTitle) => {
    try {
      await Conversation.update(convoId, newTitle);
      setConversations(prev => prev.map(c => c.id === convoId ? {...c, ...newTitle} : c));
    } catch (error) {
      console.error("Failed to update title:", error);
    }
  };

  const deleteConversation = async (convoId) => {
    try {
      await Conversation.delete(convoId);
      if (activeConversation?.id === convoId) createNewConversation();
      setConversations(prev => prev.filter(c => c.id !== convoId));
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  const buildContextForLLM = useCallback(() => {
    let contextString = "";
    const newSourceMap = new Map();

    const addSource = (item, type, idField = 'id', titleField = 'title', contentField = 'content') => {
      if (item) {
        contextString += `[${type} ID: ${item[idField]}]\nTitle: ${item[titleField]}\nContent: ${item[contentField]}\n\n`;
        newSourceMap.set(item[idField], { title: item[titleField], type });
      }
    };

    (selectedContext.entries || []).forEach(id => addSource(availableEntries.find(e => e.id === id), 'Entry'));
    (selectedContext.resources || []).forEach(id => addSource(availableResources.find(r => r.id === id), 'Resource', 'id', 'title', 'description'));
    (selectedContext.tests || []).forEach(id => {
      const test = availableTests.find(test => test.id === id);
      if (test) {
        addSource(test, 'PersonalityTest', 'id', 'test_name', `Results: ${JSON.stringify(test.results)}`);
      }
    });
    
    setSourceMap(newSourceMap);
    return { contextString, sourceMap: newSourceMap };
  }, [selectedContext, availableEntries, availableResources, availableTests]);

  const handleSendMessage = async (messageContent) => {
    if (!user) { setAuthError("Authentication required."); return; }
    setIsSending(true);

    try {
      const { contextString } = buildContextForLLM();
      let currentConvo = activeConversation;

      if (!currentConvo) {
        currentConvo = await Conversation.create({
          title: messageContent.slice(0, 40) + "...",
          messages: [],
          context_entry_ids: selectedContext.entries,
          context_resource_ids: selectedContext.resources,
          context_personality_test_ids: selectedContext.tests,
        });
        setActiveConversation(currentConvo);
        setConversations(prev => [currentConvo, ...prev]);
      } else if (JSON.stringify(selectedContext.entries) !== JSON.stringify(currentConvo.context_entry_ids) ||
                 JSON.stringify(selectedContext.resources) !== JSON.stringify(currentConvo.context_resource_ids) ||
                 JSON.stringify(selectedContext.tests) !== JSON.stringify(currentConvo.context_personality_test_ids)) {
        await Conversation.update(currentConvo.id, {
          context_entry_ids: selectedContext.entries,
          context_resource_ids: selectedContext.resources,
          context_personality_test_ids: selectedContext.tests,
        });
      }

      const userMessage = { role: "user", content: messageContent, timestamp: new Date().toISOString() };
      const updatedMessages = [...(currentConvo.messages || []), userMessage];
      setActiveConversation({ ...currentConvo, messages: updatedMessages });
      
      const aiPrompt = `You are Sage, a thoughtful AI companion. Answer the user's question based on their private context provided below. When you use information from a source, cite it using its ID, like [Source: Entry ID] or [Source: Resource ID].\n\nCONTEXT:\n${contextString}\n\nUSER QUESTION: ${messageContent}`;
      
      const aiResponseContent = await InvokeLLM({ prompt: aiPrompt });
      const sourceIds = [...aiResponseContent.matchAll(/\[Source: ([^\]]+)\]/g)].map(match => match[1].trim());
      
      const aiMessage = { role: "assistant", content: aiResponseContent, timestamp: new Date().toISOString(), source_ids: sourceIds };
      const finalMessages = [...updatedMessages, aiMessage];
      
      await Conversation.update(currentConvo.id, { messages: finalMessages });
      const updatedConvo = { ...currentConvo, messages: finalMessages };
      setActiveConversation(updatedConvo);
      setConversations(prev => prev.map(c => c.id === currentConvo.id ? updatedConvo : c));
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorContent = error.message?.includes('429') 
        ? "I'm experiencing high demand. Please wait a moment and try again."
        : "I apologize, but I'm having trouble responding right now. Please try again.";
      const errorMessage = { role: "assistant", content: errorContent, timestamp: new Date().toISOString(), isError: true };
      const errorMessages = [...(activeConversation?.messages || []), errorMessage];
      setActiveConversation(prev => prev ? { ...prev, messages: errorMessages } : null);
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveChat = async () => {
    if (!activeConversation) return;
    setIsSavingResource(true);
    try {
      const chatContent = activeConversation.messages.map(msg => `${msg.role === 'user' ? 'You' : 'Sage'}: ${msg.content}`).join('\n\n');
      const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
      const file = new File([blob], `${resourceDetails.title.trim()}.txt`, { type: 'text/plain' });
      
      const { file_url } = await UploadFile({ file });
      
      const newResource = await Resource.create({
        title: resourceDetails.title.trim(),
        description: resourceDetails.description.trim() || `Summary of conversation: ${activeConversation.title}`,
        file_url,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        category: 'conversation_summary',
        visibility: 'private',
        conversation_id: activeConversation.id,
      });
      
      setAvailableResources(prev => [newResource, ...prev]);
      setIsSaveModalOpen(false);
      setResourceDetails({ title: "", description: "" });
    } catch (error) {
      console.error("Error saving chat as resource:", error);
    } finally {
      setIsSavingResource(false);
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]"><Loader2 className="h-8 w-8 animate-spin text-[var(--brand-primary)]" /></div>;
  if (authError) return <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]"><p className="text-red-500">{authError}</p></div>;

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] overflow-hidden">
      <AnimatePresence>{isSidebarOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-20 lg:hidden" />}</AnimatePresence>
      <div className={`fixed lg:relative top-0 left-0 h-full w-80 z-50 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <ConversationSidebar conversations={conversations} activeConversationId={activeConversation?.id} onSelectConversation={selectConversation} onNewConversation={createNewConversation} onDeleteConversation={deleteConversation} onUpdateConversation={updateConversationTitle} />
      </div>

      <div className="flex-1 flex flex-col relative">
        <div className="lg:hidden absolute top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm p-4 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="text-[var(--brand-primary)]"><Menu className="w-5 h-5" /></Button>
            <h2 className="font-semibold text-[var(--text-primary)]">Sage</h2>
            <div className="w-10"></div>
          </div>
        </div>

        <main className="flex-1 flex flex-col pt-20 lg:pt-0">
          {activeConversation ? (
            <>
              <header className="p-4 border-b border-[var(--border-color)] bg-white/80 backdrop-blur-sm flex-shrink-0">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-[var(--text-primary)] truncate">{activeConversation.title}</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="btn-secondary" onClick={() => setIsContextModalOpen(true)}><BookOpen className="w-4 h-4 mr-2" /> Context</Button>
                    <Button variant="outline" size="sm" className="btn-secondary" onClick={() => { setResourceDetails({ title: `Chat: ${activeConversation.title}`, description: "" }); setIsSaveModalOpen(true); }}><Save className="w-4 h-4 mr-2" /> Save Chat</Button>
                  </div>
                </div>
              </header>
              <ChatMessages messages={activeConversation.messages || []} isLoading={isSending} currentUser={user} sourceMap={sourceMap} />
              <ChatInput onSendMessage={handleSendMessage} isLoading={isSending} />
            </>
          ) : (
            <WelcomeScreen onStartConversation={handleSendMessage} />
          )}
        </main>
      </div>

      <ContextSelector isOpen={isContextModalOpen} onClose={() => setIsContextModalOpen(false)} availableEntries={availableEntries} availableResources={availableResources} availableTests={availableTests} selectedContext={selectedContext} onSelectionChange={setSelectedContext} />
      
      <Dialog open={isSaveModalOpen} onOpenChange={setIsSaveModalOpen}>
        <DialogContent className="base-card">
          <DialogHeader><DialogTitle className="text-h2">Save Conversation as Resource</DialogTitle><DialogDescription className="text-body">Give your conversation a title and description to save it for future reference.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label htmlFor="res-title">Title</Label><Input id="res-title" value={resourceDetails.title} onChange={e => setResourceDetails(p => ({...p, title: e.target.value}))} className="form-input" /></div>
            <div className="space-y-2"><Label htmlFor="res-desc">Description</Label><Textarea id="res-desc" value={resourceDetails.description} onChange={e => setResourceDetails(p => ({...p, description: e.target.value}))} className="form-input min-h-[80px]" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="btn-secondary" onClick={() => setIsSaveModalOpen(false)}>Cancel</Button>
            <Button className="btn-primary" onClick={handleSaveChat} disabled={isSavingResource || !resourceDetails.title.trim()}>
              {isSavingResource ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
