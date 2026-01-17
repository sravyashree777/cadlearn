import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle, RotateCcw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImageUpload from "@/components/ImageUpload";
import SoftwareSelect from "@/components/SoftwareSelect";
import ChatMessage from "@/components/ChatMessage";
import { useChatSession } from "@/hooks/useChatSession";

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
    startNewSession,
    addMessage,
    clearSession,
    hasActiveSession,
    hasInitialAnalysis,
  } = useChatSession();

  // Restore image preview from session
  useEffect(() => {
    if (session?.imagePreview && !imagePreview) {
      setImagePreview(session.imagePreview);
      setSoftware(session.software);
    }
  }, [session, imagePreview]);

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage(file);
    setImagePreview(preview);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleInitialSend = async () => {
    if (!selectedImage || !imagePreview) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image of a mechanical object first.",
        variant: "destructive",
      });
      return;
    }

    const softwareName = software === "fusion360" ? "Fusion 360" : "AutoDesk Inventor";
    
    // Start new session
    startNewSession(software, imagePreview);

    // Add user message with image
    addMessage({
      role: "user",
      content: `Please analyze this mechanical object and provide CAD modeling steps for ${softwareName}.`,
      imageUrl: imagePreview,
      isInitial: true,
    });

    setIsLoading(true);
    scrollToBottom();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-cad`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            imageBase64: imagePreview,
            software: softwareName,
            isFollowUp: false,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in a moment.");
        }
        if (response.status === 402) {
          throw new Error("AI service quota exceeded. Please try again later.");
        }
        throw new Error("Failed to analyze image");
      }

      const data = await response.json();

      addMessage({
        role: "assistant",
        content: data.instructions || "Unable to generate instructions. Please try again.",
      });
    } catch (error) {
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
          isInitial: msg.isInitial,
        })),
        { role: "user" as const, content: userMessage, imageUrl: undefined, isInitial: undefined },
      ];

      const softwareName = session.software === "fusion360" ? "Fusion 360" : "AutoDesk Inventor";

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-cad`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            software: softwareName,
            messages: messagesForApi,
            isFollowUp: true,
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again in a moment.");
        }
        if (response.status === 402) {
          throw new Error("AI service quota exceeded. Please try again later.");
        }
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      addMessage({
        role: "assistant",
        content: data.instructions || "Unable to generate response. Please try again.",
      });
    } catch (error) {
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
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-2">
              {hasActiveSession ? "CAD Learning Assistant" : "Upload Your Mechanical Object"}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
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
                      onClick={handleInitialSend}
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
                          Start Analysis
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
                {session?.imagePreview && (
                  <img 
                    src={session.imagePreview} 
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
              {isLoading && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  AI is typing...
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Upload;
