import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Loader2,
} from "lucide-react";

export default function ConversationSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onUpdateConversation,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleEditStart = (e, conversation) => {
    e.stopPropagation();
    setEditingId(conversation.id);
    setEditingTitle(conversation.title);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (editingId && editingTitle.trim()) {
      onUpdateConversation(editingId, { title: editingTitle.trim() });
      handleEditCancel();
    }
  };
  
  const handleDelete = (e, convoId) => {
    e.stopPropagation();
    onDeleteConversation(convoId);
  }

  return (
    <div className="bg-[var(--bg-secondary)] h-full flex flex-col border-r border-[var(--border-color)]">
      <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[var(--brand-primary)]" />
          <h2 className="font-semibold text-lg text-[var(--text-primary)]">Conversations</h2>
        </div>
      </div>

      <div className="p-4 flex-shrink-0">
        <Button onClick={onNewConversation} className="w-full btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {conversations.length === 0 ? (
          <div className="text-center text-sm text-[var(--text-muted)] p-4 mt-4">
            Start a new conversation to see your chat history here.
          </div>
        ) : (
          <ul className="space-y-1">
            {conversations.map((convo) => (
              <li key={convo.id}>
                <div
                  onClick={() => editingId !== convo.id && onSelectConversation(convo.id)}
                  className={`group w-full rounded-lg transition-all duration-200 flex items-center justify-between gap-2 p-2 text-left cursor-pointer nav-item ${
                    activeConversationId === convo.id ? 'active' : ''
                  }`}
                >
                  {editingId === convo.id ? (
                    <form onSubmit={handleEditSave} className="flex-1" onClick={(e) => e.stopPropagation()}>
                      <Input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="form-input w-full h-8 text-sm"
                        autoFocus
                        onBlur={handleEditCancel}
                      />
                    </form>
                  ) : (
                    <span className="text-sm truncate flex-1">{convo.title}</span>
                  )}

                  <div className="flex items-center">
                    {editingId === convo.id ? (
                      <div className="flex" onClick={(e) => e.stopPropagation()}>
                        <button type="submit" onClick={handleEditSave} className="p-1 hover:text-green-600">
                          <Check className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={handleEditCancel} className="p-1 hover:text-red-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex">
                        <button
                          onClick={(e) => handleEditStart(e, convo)}
                          className="p-1 hover:text-[var(--brand-primary)]"
                          aria-label="Edit title"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, convo.id)}
                          className="p-1 hover:text-red-600"
                          aria-label="Delete conversation"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}