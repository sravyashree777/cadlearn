import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  isInitial?: boolean;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  software: string;
  imageUrl: string | null;
  title: string | null;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export const usePersistentChat = () => {
  const { user } = useAuth();
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const createSession = useCallback(async (software: string, imageUrl: string) => {
    if (!user) return null;

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from("chat_sessions")
        .insert({
          user_id: user.id,
          cad_software: software,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) throw error;

      const newSession: ChatSession = {
        id: data.id,
        software: data.cad_software,
        imageUrl: data.image_url,
        title: data.title,
        messages: [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setSession(newSession);
      return newSession;
    } catch (error) {
      console.error("Failed to create session:", error);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [user]);

  const loadSession = useCallback(async (sessionId: string) => {
    if (!user) return null;

    setIsLoading(true);
    try {
      // Fetch session
      const { data: sessionData, error: sessionError } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("id", sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });

      if (messagesError) throw messagesError;

      const loadedSession: ChatSession = {
        id: sessionData.id,
        software: sessionData.cad_software,
        imageUrl: sessionData.image_url,
        title: sessionData.title,
        messages: messagesData.map((msg) => ({
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content,
          imageUrl: msg.image_url || undefined,
          isInitial: msg.is_initial || undefined,
          createdAt: msg.created_at,
        })),
        createdAt: sessionData.created_at,
        updatedAt: sessionData.updated_at,
      };

      setSession(loadedSession);
      return loadedSession;
    } catch (error) {
      console.error("Failed to load session:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const addMessage = useCallback(async (
    message: Omit<ChatMessage, "id" | "createdAt">
  ) => {
    if (!session || !user) return null;

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          session_id: session.id,
          role: message.role,
          content: message.content,
          image_url: message.imageUrl || null,
          is_initial: message.isInitial || false,
        })
        .select()
        .single();

      if (error) throw error;

      const newMessage: ChatMessage = {
        id: data.id,
        role: data.role as "user" | "assistant",
        content: data.content,
        imageUrl: data.image_url || undefined,
        isInitial: data.is_initial || undefined,
        createdAt: data.created_at,
      };

      setSession((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: [...prev.messages, newMessage],
          updatedAt: new Date().toISOString(),
        };
      });

      // Update session title from first AI response
      if (message.role === "assistant" && session.messages.length <= 1 && !session.title) {
        const title = message.content.slice(0, 50) + (message.content.length > 50 ? "..." : "");
        await supabase
          .from("chat_sessions")
          .update({ title })
          .eq("id", session.id);
        
        setSession((prev) => prev ? { ...prev, title } : null);
      }

      return newMessage;
    } catch (error) {
      console.error("Failed to add message:", error);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [session, user]);

  const clearSession = useCallback(() => {
    setSession(null);
  }, []);

  const hasActiveSession = session !== null;
  const hasInitialAnalysis = session?.messages.some((m) => m.role === "assistant") ?? false;

  return {
    session,
    isLoading,
    isSaving,
    setIsLoading,
    createSession,
    loadSession,
    addMessage,
    clearSession,
    hasActiveSession,
    hasInitialAnalysis,
  };
};
