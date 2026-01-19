import { useState, useRef } from "react";
import { Send, AlertCircle, RotateCcw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageUpload from "@/components/ImageUpload";
import SoftwareSelect from "@/components/SoftwareSelect";
import ChatMessage from "@/components/ChatMessage";
import { useSessionChat } from "@/hooks/useSessionChat";

const Upload = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [software, setSoftware] = useState<string>("fusion360");
  const [followUpInput, setFollowUpInput] = useState("");
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    session,
    isLoading,
    setIsLoading,
    createSession,
    addMessage,
    clearSession,
    hasActiveSession,
    hasInitialAnalysis,
  } = useSessionChat();

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage(file);
    setImagePreview(preview);
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  };

  const handleAnalyze = async () => {
    if (!selectedImage || !imagePreview) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image of a mechanical object first.",
        variant: "destructive",
      });
      return;
    }

    const softwareName = software === "fusion360" ? "Fusion 360" : "AutoDesk Inventor";
    
    setIsLoading(true);
    scrollToBottom();

    try {
      // Create new session
      const newSession = createSession(software, imagePreview);

      // Add user message with image
      addMessage({
        role: "user",
        content: `Analyze this CAD model and explain step-by-step how to create it in ${softwareName}.`,
        imageUrl: imagePreview,
      });

      scrollToBottom();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-cad`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageBase64: imagePreview,
            software: softwareName,
            isFollowUp: false,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze image");
      }

      const data = await response.json();

      if (!data.instructions) {
        throw new Error("AI did not return a response. Please try again.");
      }

      addMessage({
        role: "assistant",
        content: data.instructions,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleFollowUpSend = async () => {
    if (!followUpInput.trim() || isLoading || !session) return;

    const userMessage = followUpInput.trim();
    setFollowUpInput("");

    // Add user message
    addMessage({
      role: "user",
      content: userMessage,
    });

    setIsLoading(true);
    scrollToBottom();

    try {
      // Prepare messages for API (include full conversation history)
      const messagesForApi = [
        ...session.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          imageUrl: msg.imageUrl,
        })),
        { role: "user" as const, content: userMessage },
      ];

      const softwareName = session.software === "fusion360" ? "Fusion 360" : "AutoDesk Inventor";

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-cad`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            software: softwareName,
            messages: messagesForApi,
            isFollowUp: true,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();

      if (!data.instructions) {
        throw new Error("AI did not return a response. Please try again.");
      }

      addMessage({
        role: "assistant",
        content: data.instructions,
      });
    } catch (error) {
      console.error("Follow-up error:", error);
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      scrollToBottom();
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFollowUpSend();
    }
  };

  const handleNewSession = () => {
    clearSession();
    setSelectedImage(null);
    setImagePreview(null);
    setFollowUpInput("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 sm:pt-24 pb-6 sm:pb-8 px-3 sm:px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-xl md:text-2xl font-display font-bold">
              {hasActiveSession ? "CAD Learning Assistant" : "Upload Your Mechanical Object"}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {hasActiveSession 
                ? "Ask follow-up questions about your model"
                : "Upload an image and get step-by-step CAD instructions"
              }
            </p>
          </div>

          {/* Upload Card - Only show when no active session */}
          {!hasActiveSession && (
            <div className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6">
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                <div className="order-1">
                  <ImageUpload
                    onImageSelect={handleImageSelect}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-4 sm:space-y-6 order-2">
                  <SoftwareSelect
                    value={software}
                    onChange={setSoftware}
                    disabled={isLoading}
                  />

                  {selectedImage && (
                    <Button
                      onClick={handleAnalyze}
                      disabled={isLoading}
                      className="w-full gap-2 glow-primary h-12 sm:h-11 text-base sm:text-sm"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send / Analyze
                        </>
                      )}
                    </Button>
                  )}

                  {!selectedImage && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-secondary/30 rounded-lg p-3">
                      <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>Upload an image to start learning</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Active Session Header */}
          {hasActiveSession && (
            <div className="glass-card rounded-xl p-3 sm:p-4 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {session?.imageUrl && (
                  <img 
                    src={session.imageUrl} 
                    alt="Current model" 
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border border-white/10"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {session?.software === "fusion360" ? "Fusion 360" : "AutoDesk Inventor"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session?.messages.length} messages
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewSession}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">New Model</span>
              </Button>
            </div>
          )}

          {/* Chat Messages */}
          {(session?.messages.length ?? 0) > 0 && (
            <div className="space-y-3 sm:space-y-4 mb-4">
              {session?.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  imageUrl={message.imageUrl}
                />
              ))}
              {isLoading && (
                <ChatMessage
                  role="assistant"
                  content=""
                  isLoading={true}
                />
              )}
              <div ref={chatEndRef} />
            </div>
          )}

          {/* Follow-up Input - Show after initial analysis */}
          {hasInitialAnalysis && (
            <div className="glass-card rounded-xl p-3 sm:p-4 sticky bottom-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <MessageSquare className="w-5 h-5 text-muted-foreground flex-shrink-0 hidden sm:block" />
                <Input
                  ref={inputRef}
                  value={followUpInput}
                  onChange={(e) => setFollowUpInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a follow-up question about your model..."
                  disabled={isLoading}
                  className="flex-1 bg-secondary/50 border-white/10 h-11 sm:h-10 text-base sm:text-sm"
                />
                <Button
                  onClick={handleFollowUpSend}
                  disabled={isLoading || !followUpInput.trim()}
                  size="icon"
                  className="h-11 w-11 sm:h-10 sm:w-10 flex-shrink-0"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Upload;
