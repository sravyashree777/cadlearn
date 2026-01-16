import { useState } from "react";
import { Play, X, Video } from "lucide-react";
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
      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground/60 bg-secondary/30 px-3 py-1.5 rounded-full">
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
          className="gap-2 text-xs text-primary hover:bg-primary/10"
        >
          <Play className="w-3 h-3" />
          Watch: {videoPlaceholders[tool.toLowerCase()]}
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-card border-border/50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            {description}
          </DialogTitle>
        </DialogHeader>
        <div className="aspect-video bg-navy-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Video tutorial placeholder
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              10-30 second guide for: {tool}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoGuide;
