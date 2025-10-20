import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Flame, CheckCircle2, TrendingUp, Calendar } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const features = [
    {
      icon: <CheckCircle2 className="w-8 h-8" />,
      title: "Simple Tracking",
      description: "One-tap check-ins make habit tracking effortless",
    },
    {
      icon: <Flame className="w-8 h-8" />,
      title: "Build Streaks",
      description: "Stay motivated by building and maintaining streaks",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Visual Progress",
      description: "See your progress with beautiful charts and calendars",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Flame className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Build Better Habits Daily
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your life with Habit Tracker. Beautiful, intuitive tracking to build 
            positive routines and achieve your goals, one day at a time.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-card border border-border mb-4">
                <div className="text-primary">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 bg-card/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Your Habits</h3>
              <p className="text-muted-foreground">
                Add the habits you want to build or break
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Check In Daily</h3>
              <p className="text-muted-foreground">
                Mark your habits complete with a single tap
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Build Streaks</h3>
              <p className="text-muted-foreground">
                Watch your streaks grow and stay motivated
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Better Habits?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of people improving their lives, one habit at a time.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="text-lg px-8 py-6"
          >
            Start Tracking Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Habit Tracker. Built with care for better habits.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
