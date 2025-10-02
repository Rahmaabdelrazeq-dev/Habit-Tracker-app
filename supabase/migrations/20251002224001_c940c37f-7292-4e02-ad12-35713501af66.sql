-- Create habits table
CREATE TABLE public.habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 50),
  description TEXT,
  color TEXT DEFAULT '#A0826D',
  icon TEXT,
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  target_days INTEGER[],
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  archived BOOLEAN DEFAULT false NOT NULL
);

-- Enable RLS
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for habits
CREATE POLICY "Users can view own habits"
  ON public.habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habits"
  ON public.habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON public.habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON public.habits FOR DELETE
  USING (auth.uid() = user_id);

-- Create habit_logs table
CREATE TABLE public.habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  completed_at DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(habit_id, completed_at)
);

-- Enable RLS
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for habit_logs
CREATE POLICY "Users can view own habit logs"
  ON public.habit_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own habit logs"
  ON public.habit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habit logs"
  ON public.habit_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habit logs"
  ON public.habit_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_habits_user_id ON public.habits(user_id);
CREATE INDEX idx_habit_logs_habit_id ON public.habit_logs(habit_id);
CREATE INDEX idx_habit_logs_user_id ON public.habit_logs(user_id);
CREATE INDEX idx_habit_logs_completed_at ON public.habit_logs(completed_at);