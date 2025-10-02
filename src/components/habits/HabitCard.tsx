import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, Flame, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string | null;
  created_at: string;
}

interface HabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  onToggle: () => void;
  onUpdate: () => void;
}

const HabitCard = ({ habit, isCompletedToday, onToggle, onUpdate }: HabitCardProps) => {
  const [toggling, setToggling] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);

    const today = new Date().toISOString().split("T")[0];

    try {
      if (isCompletedToday) {
        // Remove log
        const { error } = await supabase
          .from("habit_logs")
          .delete()
          .eq("habit_id", habit.id)
          .eq("completed_at", today);

        if (error) throw error;

        toast({
          title: "Undone",
          description: `Removed check-in for ${habit.name}`,
        });
      } else {
        // Add log
        const { error } = await supabase.from("habit_logs").insert({
          habit_id: habit.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          completed_at: today,
        });

        if (error) throw error;

        toast({
          title: "Great job! 🎉",
          description: `You completed ${habit.name} today`,
        });
      }

      onToggle();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("habits")
        .delete()
        .eq("id", habit.id);

      if (error) throw error;

      toast({
        title: "Habit deleted",
        description: `${habit.name} has been removed`,
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={cn(
        "bg-card rounded-xl p-6 border-l-4 shadow-sm hover:shadow-md transition-all duration-200",
        isCompletedToday ? "border-l-success" : "border-l-muted"
      )}
      style={{
        borderLeftColor: isCompletedToday ? undefined : habit.color,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{habit.name}</h3>
          {habit.description && (
            <p className="text-sm text-muted-foreground">{habit.description}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Flame className="w-4 h-4" />
          <span>Streak: 0 days</span>
        </div>
        <Button
          onClick={handleToggle}
          disabled={toggling}
          size="sm"
          variant={isCompletedToday ? "secondary" : "default"}
          className={cn(
            "transition-all duration-200",
            isCompletedToday && "animate-check-bounce"
          )}
        >
          <Check className={cn("w-4 h-4", isCompletedToday && "mr-2")} />
          {isCompletedToday && "Done"}
        </Button>
      </div>
    </div>
  );
};

export default HabitCard;
