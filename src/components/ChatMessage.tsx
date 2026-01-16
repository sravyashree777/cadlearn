import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  isLoading?: boolean;
}

const ChatMessage = ({ role, content, imageUrl, isLoading }: ChatMessageProps) => {
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-2 sm:gap-3 animate-slide-up ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center ${
          isUser ? "bg-primary/20" : "bg-secondary"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        ) : (
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={`flex-1 max-w-[90%] sm:max-w-[85%] p-3 sm:p-4 ${
          isUser ? "chat-user" : "chat-assistant"
        }`}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Uploaded object"
            className="rounded-lg mb-2 sm:mb-3 max-h-40 sm:max-h-48 object-contain"
            loading="lazy"
          />
        )}
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">AI is analyzing the image...</span>
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            {content.split("\n").map((line, i) => {
              // Check if line is a bullet point (starts with * or -)
              const isBullet = /^[\*\-]\s/.test(line.trim());
              const cleanLine = isBullet ? line.trim().replace(/^[\*\-]\s/, '') : line;
              
              // Function to render text with bold formatting
              const renderFormattedText = (text: string) => {
                const parts = text.split(/(\*\*[^*]+\*\*)/g);
                return parts.map((part, idx) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={idx} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
                  }
                  return part;
                });
              };

              if (isBullet) {
                return (
                  <div key={i} className="flex gap-2 mb-1 sm:mb-1.5 last:mb-0">
                    <span className="text-primary mt-0.5 sm:mt-1">•</span>
                    <span className="text-foreground/90 leading-relaxed text-xs sm:text-sm">{renderFormattedText(cleanLine)}</span>
                  </div>
                );
              }

              return (
                <p key={i} className="mb-1.5 sm:mb-2 last:mb-0 text-foreground/90 leading-relaxed text-xs sm:text-sm">
                  {renderFormattedText(line)}
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
