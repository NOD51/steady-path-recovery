-- Create progress tracking tables for the recovery app

-- User profiles table to extend auth.users
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  streak_start_date DATE DEFAULT CURRENT_DATE,
  total_streak_days INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  tree_growth_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Daily progress entries
CREATE TABLE public.daily_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_clean_day BOOLEAN DEFAULT true,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 5),
  notes TEXT,
  completed_tasks INTEGER DEFAULT 0,
  total_tasks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Achievements system
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  unlock_criteria JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User achievements (unlocked)
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Daily tasks
CREATE TABLE public.daily_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  task_date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_progress
CREATE POLICY "Users can view their own progress" 
ON public.daily_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON public.daily_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.daily_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for achievements (public read)
CREATE POLICY "Anyone can view achievements" 
ON public.achievements 
FOR SELECT 
USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock their own achievements" 
ON public.user_achievements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_tasks
CREATE POLICY "Users can view their own tasks" 
ON public.daily_tasks 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" 
ON public.daily_tasks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
ON public.daily_tasks 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
ON public.daily_tasks 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_progress_updated_at
BEFORE UPDATE ON public.daily_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_tasks_updated_at
BEFORE UPDATE ON public.daily_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, unlock_criteria) VALUES
('First Day', 'Completed your first day of recovery', '🌱', '{"type": "streak", "days": 1}'),
('One Week Strong', 'Maintained sobriety for 7 consecutive days', '🗓️', '{"type": "streak", "days": 7}'),
('Two Weeks Milestone', 'Reached 14 days of continuous recovery', '💪', '{"type": "streak", "days": 14}'),
('One Month Hero', 'Achieved 30 days of sobriety', '🏆', '{"type": "streak", "days": 30}'),
('Three Month Champion', 'Completed 90 days of recovery', '👑', '{"type": "streak", "days": 90}'),
('Half Year Warrior', 'Reached 180 days of sobriety', '⚡', '{"type": "streak", "days": 180}'),
('One Year Legend', 'Celebrated 365 days of recovery', '🎉', '{"type": "streak", "days": 365}'),
('Task Master', 'Completed 50 daily tasks', '✅', '{"type": "tasks", "count": 50}'),
('Mood Tracker', 'Logged mood for 7 consecutive days', '😊', '{"type": "mood_tracking", "days": 7}'),
('Tree Nurturer', 'Reached 50% tree growth', '🌳', '{"type": "tree_growth", "percentage": 50}');

-- Function to calculate and update streak
CREATE OR REPLACE FUNCTION public.update_user_streak(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  current_streak INTEGER := 0;
  longest_streak INTEGER := 0;
  streak_start DATE;
  check_date DATE;
BEGIN
  -- Get current longest streak from profile
  SELECT longest_streak INTO longest_streak 
  FROM public.profiles 
  WHERE user_id = user_uuid;
  
  IF longest_streak IS NULL THEN
    longest_streak := 0;
  END IF;

  -- Calculate current streak by checking consecutive clean days
  SELECT date INTO check_date
  FROM public.daily_progress 
  WHERE user_id = user_uuid 
    AND is_clean_day = true 
  ORDER BY date DESC 
  LIMIT 1;
  
  IF check_date IS NULL THEN
    current_streak := 0;
    streak_start := CURRENT_DATE;
  ELSE
    -- Count consecutive days from most recent clean day
    WITH consecutive_days AS (
      SELECT date,
             date - ROW_NUMBER() OVER (ORDER BY date DESC) * INTERVAL '1 day' as grp
      FROM public.daily_progress 
      WHERE user_id = user_uuid 
        AND is_clean_day = true 
        AND date <= CURRENT_DATE
      ORDER BY date DESC
    ),
    streak_group AS (
      SELECT COUNT(*) as streak_length, MIN(date) as start_date
      FROM consecutive_days
      WHERE grp = (SELECT grp FROM consecutive_days LIMIT 1)
    )
    SELECT streak_length, start_date INTO current_streak, streak_start
    FROM streak_group;
    
    IF current_streak IS NULL THEN
      current_streak := 0;
      streak_start := CURRENT_DATE;
    END IF;
  END IF;

  -- Update longest streak if current is longer
  IF current_streak > longest_streak THEN
    longest_streak := current_streak;
  END IF;

  -- Update profile
  UPDATE public.profiles 
  SET total_streak_days = current_streak,
      longest_streak = longest_streak,
      streak_start_date = streak_start,
      tree_growth_percentage = LEAST(100, (current_streak * 2))
  WHERE user_id = user_uuid;

  RETURN current_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;