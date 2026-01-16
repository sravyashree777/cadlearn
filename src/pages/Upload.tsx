import { useState, useRef } from "react";
import { Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import ImageUpload from "@/components/ImageUpload";
import SoftwareSelect from "@/components/SoftwareSelect";
import ChatMessage from "@/components/ChatMessage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
}

const Upload = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [software, setSoftware] = useState<string>("fusion360");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage(file);
    setImagePreview(preview);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!selectedImage || !imagePreview) {
      toast({
        title: "No image uploaded",
        description: "Please upload an image of a mechanical object first.",
        variant: "destructive",
      });
      return;
    }

    // Add user message with image
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Please analyze this mechanical object and provide CAD modeling steps for ${
        software === "fusion360" ? "Fusion 360" : "AutoDesk Inventor"
      }.`,
      imageUrl: imagePreview,
    };

    setMessages((prev) => [...prev, userMessage]);
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
            software: software === "fusion360" ? "Fusion 360" : "AutoDesk Inventor",
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

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.instructions || "Unable to generate instructions. Please try again.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 sm:pt-24 pb-6 sm:pb-8 px-3 sm:px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-2">
              Upload Your Mechanical Object
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground px-2">
              Upload an image and get step-by-step CAD instructions
            </p>
          </div>

          {/* Upload Card */}
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

                {/* Send Button - only visible after image upload */}
                {selectedImage && (
                  <Button
                    onClick={handleSend}
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
                        Send for Analysis
                      </>
                    )}
                  </Button>
                )}

                {!selectedImage && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-secondary/30 rounded-lg p-3">
                    <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>Upload an image to enable the Send button</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          {messages.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-base sm:text-lg font-semibold text-muted-foreground">
                AI Response
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {messages.map((message) => (
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
              </div>
              <div ref={chatEndRef} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Upload;
