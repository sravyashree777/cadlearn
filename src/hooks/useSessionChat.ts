import { useState, useCallback } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  software: string;
  imageUrl: string | null;
  messages: ChatMessage[];
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useSessionChat = () => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createSession = useCallback((software: string, imageUrl: string): ChatSession => {
    const newSession: ChatSession = {
      id: generateId(),
      software,
      imageUrl,
      messages: [],
    };
    setSession(newSession);
    return newSession;
  }, []);

  const addMessage = useCallback((
    message: Omit<ChatMessage, "id" | "createdAt">
  ): ChatMessage => {
    const newMessage: ChatMessage = {
      id: generateId(),
      ...message,
      createdAt: new Date().toISOString(),
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

  const clearSession = useCallback(() => {
    setSession(null);
  }, []);

  const hasActiveSession = session !== null;
  const hasInitialAnalysis = session?.messages.some((m) => m.role === "assistant") ?? false;

  return {
    session,
    isLoading,
    setIsLoading,
    createSession,
    addMessage,
    clearSession,
    hasActiveSession,
    hasInitialAnalysis,
  };
};
