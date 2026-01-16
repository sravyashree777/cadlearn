import { useState } from "react";
import { Play, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VideoGuideProps {
  tool: string;
  description: string;
}

// Placeholder videos - in production, these would be actual tutorial videos
const videoPlaceholders: Record<string, string> = {
  sketch: "How to start a sketch and draw basic shapes",
  extrude: "How to extrude a 2D sketch into a 3D solid",
  cut: "How to cut material from your model",
  fillet: "How to apply fillets to round edges",
  hole: "How to create holes in your model",
};

const VideoGuide = ({ tool, description }: VideoGuideProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const videoAvailable = tool.toLowerCase() in videoPlaceholders;

  if (!videoAvailable) {
    return (
      <div className="inline-flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground/60 bg-secondary/30 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
        <Video className="w-3 h-3" />
        <span>Visual guide coming soon — follow written steps</span>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 sm:gap-2 text-xs text-primary hover:bg-primary/10 h-8 sm:h-9 px-2 sm:px-3"
        >
          <Play className="w-3 h-3" />
          <span className="hidden sm:inline">Watch: {videoPlaceholders[tool.toLowerCase()]}</span>
          <span className="sm:hidden">Watch Tutorial</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border/50 max-w-[calc(100vw-2rem)] sm:max-w-2xl mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Video className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            {description}
          </DialogTitle>
        </DialogHeader>
        <div className="aspect-video bg-navy-900 rounded-lg flex items-center justify-center">
          <div className="text-center p-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Video tutorial placeholder
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground/60 mt-1">
              10-30 second guide for: {tool}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoGuide;
