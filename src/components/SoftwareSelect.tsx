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
      <label className="text-sm font-medium text-muted-foreground">
        CAD Software
      </label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="glass-card border-border/50 focus:ring-primary/30">
          <SelectValue placeholder="Select your CAD software" />
        </SelectTrigger>
        <SelectContent className="glass-card border-border/50">
          <SelectItem value="fusion360" className="focus:bg-primary/20">
            Fusion 360
          </SelectItem>
          <SelectItem value="inventor" className="focus:bg-primary/20">
            AutoDesk Inventor
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SoftwareSelect;
