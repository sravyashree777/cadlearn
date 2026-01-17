import { useState, useEffect, useCallback } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  isInitial?: boolean;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  software: string;
  imagePreview: string | null;
  messages: ChatMessage[];
  createdAt: number;
}

const STORAGE_KEY = "cad-chat-session";

export const useChatSession = () => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatSession;
        // Only restore if session is less than 24 hours old
        if (Date.now() - parsed.createdAt < 24 * 60 * 60 * 1000) {
          setSession(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Failed to load chat session:", error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Save session to localStorage whenever it changes
  useEffect(() => {
    if (session) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } catch (error) {
        console.error("Failed to save chat session:", error);
      }
    }
  }, [session]);

  const startNewSession = useCallback((software: string, imagePreview: string) => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      software,
      imagePreview,
      messages: [],
      createdAt: Date.now(),
    };
    setSession(newSession);
    return newSession;
  }, []);

  const addMessage = useCallback((message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    
    setSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, newMessage],
      };
    });
    
    return newMessage;
  }, []);

  const updateLastAssistantMessage = useCallback((content: string) => {
    setSession((prev) => {
      if (!prev) return null;
      const messages = [...prev.messages];
      const lastIndex = messages.length - 1;
      if (lastIndex >= 0 && messages[lastIndex].role === "assistant") {
        messages[lastIndex] = { ...messages[lastIndex], content };
      }
      return { ...prev, messages };
    });
  }, []);

  const clearSession = useCallback(() => {
    setSession(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasActiveSession = session !== null && session.messages.length > 0;
  const hasInitialAnalysis = session?.messages.some(m => m.role === "assistant") ?? false;

  return {
    session,
    isLoading,
    setIsLoading,
    startNewSession,
    addMessage,
    updateLastAssistantMessage,
    clearSession,
    hasActiveSession,
    hasInitialAnalysis,
  };
};
