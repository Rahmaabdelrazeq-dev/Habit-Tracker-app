import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface CreateHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHabitCreated: () => void;
}

const PRESET_COLORS = [
  "#10B981", // Emerald green (default)
  "#8B5CF6", // Purple
  "#F59E0B", // Orange
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Deep orange
];

const CreateHabitDialog = ({ open, onOpenChange, onHabitCreated }: CreateHabitDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a habit name",
        variant: "destructive",
      });
      return;
    }

    if (name.length > 50) {
      toast({
        title: "Error",
        description: "Habit name must be less than 50 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("habits").insert({
        user_id: user.id,
        name: name.trim(),
        description: description.trim() || null,
        color: selectedColor,
      });

      if (error) throw error;

      toast({
        title: "Habit created! 🎉",
        description: `${name} has been added to your habits`,
      });

      // Reset form
      setName("");
      setDescription("");
      setSelectedColor(PRESET_COLORS[0]);
      onHabitCreated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
          <DialogDescription>
            Add a new habit to track. You can customize it later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreate} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Habit Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Morning meditation"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {name.length}/50 characters
            </p>
          </div>

          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Why is this habit important to you?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label>Color</Label>
            <div className="flex gap-2 mt-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className="w-10 h-10 rounded-full border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: selectedColor === color ? color : "transparent",
                    boxShadow: selectedColor === color ? `0 0 0 2px white, 0 0 0 4px ${color}` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Habit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateHabitDialog;
