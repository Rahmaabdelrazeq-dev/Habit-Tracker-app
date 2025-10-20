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
        "bg-card rounded-xl p-6 border-2 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden group",
        isCompletedToday ? "border-success bg-success/5" : "border-border hover:border-primary/50"
      )}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: habit.color }}
              />
              <h3 className="font-semibold text-lg">{habit.name}</h3>
            </div>
            {habit.description && (
              <p className="text-sm text-muted-foreground">{habit.description}</p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
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
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Flame className={cn(
                "w-5 h-5",
                isCompletedToday ? "text-accent animate-pulse" : "text-muted-foreground"
              )} />
              <span className={cn(
                isCompletedToday ? "text-accent" : "text-muted-foreground"
              )}>
                0 day streak
              </span>
            </div>
          </div>
          <Button
            onClick={handleToggle}
            disabled={toggling}
            size="sm"
            variant={isCompletedToday ? "default" : "outline"}
            className={cn(
              "transition-all duration-200 min-w-[80px]",
              isCompletedToday && "bg-success hover:bg-success/90 animate-check-bounce"
            )}
          >
            <Check className={cn("w-4 h-4", isCompletedToday && "mr-2")} />
            {isCompletedToday ? "Done" : ""}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
