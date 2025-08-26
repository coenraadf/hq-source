import React from "react";
import { MessageSquare } from "lucide-react";

export default function MessagesPage() {
  return (
    <div className="min-h-screen p-6 md:p-8 flex items-center justify-center" style={{ backgroundColor: '#FCFCF9' }}>
      <div className="text-center max-w-md mx-auto">
        <MessageSquare className="w-16 h-16 text-stone-300 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-stone-600 mb-4">Messages</h2>
        <p className="text-stone-500 text-lg">Coming Soon...</p>
        <p className="text-stone-400 text-sm mt-2">
          We're working on bringing you seamless communication features.
        </p>
      </div>
    </div>
  );
}