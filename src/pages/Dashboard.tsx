import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Plus, LogOut, Flame, TrendingUp } from "lucide-react";
import HabitCard from "@/components/habits/HabitCard";
import CreateHabitDialog from "@/components/habits/CreateHabitDialog";

interface Habit {
  id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string | null;
  created_at: string;
}

interface HabitLog {
  id: string;
  habit_id: string;
  completed_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication and load data
    const initializeData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      await loadHabits();
      await loadTodayLogs();
      setLoading(false);
    };

    initializeData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadHabits = async () => {
    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("archived", false)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error loading habits",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setHabits(data || []);
    }
  };

  const loadTodayLogs = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("completed_at", today);

    if (error) {
      console.error("Error loading logs:", error);
    } else {
      setHabitLogs(data || []);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleHabitCreated = () => {
    loadHabits();
    setShowCreateDialog(false);
  };

  const handleHabitToggled = () => {
    loadTodayLogs();
  };

  const completedToday = habitLogs.length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Flame className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">HabitFlow</h1>
              <p className="text-sm text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold mb-2">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Progress</p>
                  <p className="text-2xl font-bold">
                    {completedToday}/{totalHabits}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-2xl font-bold">{completionRate}%</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Habits</p>
                  <p className="text-2xl font-bold">{totalHabits}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Habits Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Your Habits</h3>
          <Button onClick={() => setShowCreateDialog(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Habit
          </Button>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Plus className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No habits yet</h3>
            <p className="text-muted-foreground mb-6">
              Start building better habits by creating your first one
            </p>
            <Button onClick={() => setShowCreateDialog(true)} size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Habit
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map((habit, index) => (
              <div
                key={habit.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <HabitCard
                  habit={habit}
                  isCompletedToday={habitLogs.some(log => log.habit_id === habit.id)}
                  onToggle={handleHabitToggled}
                  onUpdate={loadHabits}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Habit Dialog */}
      <CreateHabitDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onHabitCreated={handleHabitCreated}
      />
    </div>
  );
};

export default Dashboard;
