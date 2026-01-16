import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SoftwareSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SoftwareSelect = ({ value, onChange, disabled }: SoftwareSelectProps) => {
  return (
    <div className="space-y-2">
      <label className="text-xs sm:text-sm font-medium text-muted-foreground">
        CAD Software
      </label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="glass-card border-border/50 focus:ring-primary/30 h-11 sm:h-10 text-sm">
          <SelectValue placeholder="Select your CAD software" />
        </SelectTrigger>
        <SelectContent className="glass-card border-border/50">
          <SelectItem value="fusion360" className="focus:bg-primary/20 h-10 sm:h-9">
            Fusion 360
          </SelectItem>
          <SelectItem value="inventor" className="focus:bg-primary/20 h-10 sm:h-9">
            AutoDesk Inventor
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SoftwareSelect;
