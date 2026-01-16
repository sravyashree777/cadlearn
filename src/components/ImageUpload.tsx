import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  disabled?: boolean;
}

const ImageUpload = ({ onImageSelect, disabled }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onImageSelect(file, result);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile, disabled]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreview(null);
  };

  if (preview) {
    return (
      <div className="relative group">
        <div className="glass-card rounded-xl overflow-hidden">
          <img
            src={preview}
            alt="Uploaded mechanical object"
            className="w-full max-h-60 sm:max-h-80 object-contain bg-navy-900/50"
            loading="lazy"
          />
          {!disabled && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
              onClick={clearImage}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        {disabled && (
          <div className="absolute inset-0 bg-navy-900/60 flex items-center justify-center rounded-xl">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Processing...</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        glass-card rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer
        ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <label className="flex flex-col items-center justify-center p-6 sm:p-8 cursor-pointer min-h-[180px] sm:min-h-[200px]">
        <input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
        />
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
          {isDragging ? (
            <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          ) : (
            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          )}
        </div>
        <p className="text-sm sm:text-base text-foreground font-medium mb-1 text-center">
          {isDragging ? "Drop your image here" : "Upload an image"}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground text-center px-2">
          Drag & drop or tap to select a mechanical object image
        </p>
        <p className="text-xs text-muted-foreground/60 mt-2">
          Supports: JPG, PNG, WEBP
        </p>
      </label>
    </div>
  );
};

export default ImageUpload;
