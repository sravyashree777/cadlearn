import { useState, useEffect } from "react";
import { MessageSquare, Plus, Trash2, Clock, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface ChatSession {
  id: string;
  cad_software: string;
  image_url: string | null;
  title: string | null;
  created_at: string;
  updated_at: string;
}

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewSession: () => void;
}

const ChatHistorySidebar = ({
  isOpen,
  onClose,
  activeSessionId,
  onSelectSession,
  onNewSession,
}: ChatHistorySidebarProps) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSessions();
    } else {
      setSessions([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data) {
      setSessions(data);
    }
    setIsLoading(false);
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    
    const { error } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("id", sessionId);

    if (!error) {
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        onNewSession();
      }
    }
  };

  const getSoftwareLabel = (software: string) => {
    return software === "fusion360" ? "Fusion 360" : "AutoDesk Inventor";
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-72 bg-background border-r border-white/10 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-display font-semibold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              My Models
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <Button 
              onClick={() => {
                onNewSession();
                onClose();
              }}
              className="w-full gap-2"
              variant="outline"
            >
              <Plus className="w-4 h-4" />
              New Model
            </Button>
          </div>

          {/* Sessions List */}
          <ScrollArea className="flex-1 px-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No saved models yet. Upload an image to start!
                </p>
              </div>
            ) : (
              <div className="space-y-1 py-2">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      onSelectSession(session.id);
                      onClose();
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors group ${
                      activeSessionId === session.id
                        ? "bg-primary/20 border border-primary/30"
                        : "hover:bg-secondary/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {session.image_url ? (
                        <img
                          src={session.image_url}
                          alt="Model thumbnail"
                          className="w-10 h-10 rounded-md object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {session.title || getSoftwareLabel(session.cad_software)}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={(e) => handleDeleteSession(e, session.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default ChatHistorySidebar;
