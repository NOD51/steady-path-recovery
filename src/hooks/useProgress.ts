import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  streak_start_date: string;
  total_streak_days: number;
  longest_streak: number;
  tree_growth_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface DailyTask {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  task_date: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlock_criteria: any;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement: Achievement;
}

export interface DailyProgress {
  id: string;
  user_id: string;
  date: string;
  is_clean_day: boolean;
  mood_rating?: number;
  notes?: string;
  completed_tasks: number;
  total_tasks: number;
  created_at: string;
  updated_at: string;
}

export const useProgress = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [todayProgress, setTodayProgress] = useState<DailyProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Initialize user profile and data
  const initializeUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get or create user profile
      let { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            display_name: user.email?.split('@')[0] || 'User',
          })
          .select()
          .single();

        if (createError) throw createError;
        profileData = newProfile;
      } else if (profileError) {
        throw profileError;
      }

      setProfile(profileData);

      // Get today's progress
      const today = new Date().toISOString().split('T')[0];
      let { data: progressData, error: progressError } = await supabase
        .from('daily_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (progressError && progressError.code === 'PGRST116') {
        // No progress for today, create it
        const { data: newProgress, error: createProgressError } = await supabase
          .from('daily_progress')
          .insert({
            user_id: user.id,
            date: today,
            is_clean_day: true,
          })
          .select()
          .single();

        if (createProgressError) throw createProgressError;
        progressData = newProgress;
      } else if (progressError) {
        throw progressError;
      }

      setTodayProgress(progressData);

      // Load today's tasks
      await loadTodayTasks(user.id);

      // Load achievements
      await loadAchievements();
      await loadUserAchievements(user.id);

    } catch (error) {
      console.error('Error initializing user data:', error);
      toast({
        title: "Error",
        description: "Failed to load progress data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTodayTasks = async (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    let { data: tasks, error } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', userId)
      .eq('task_date', today)
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!tasks || tasks.length === 0) {
      // Create default tasks for today
      const defaultTasks = [
        { title: 'Morning Reflection', description: 'Take 5 minutes to set intentions for the day' },
        { title: 'Physical Activity', description: 'Engage in at least 30 minutes of physical exercise' },
        { title: 'Mindful Break', description: 'Take a 10-minute mindfulness or breathing break' },
        { title: 'Connect with Support', description: 'Reach out to a friend, family member, or support group' },
        { title: 'Evening Journal', description: 'Reflect on the day and write down thoughts or gratitude' },
      ];

      const { data: newTasks, error: insertError } = await supabase
        .from('daily_tasks')
        .insert(
          defaultTasks.map(task => ({
            user_id: userId,
            title: task.title,
            description: task.description,
            task_date: today,
          }))
        )
        .select();

      if (insertError) throw insertError;
      tasks = newTasks || [];
    }

    setDailyTasks(tasks);
  };

  const loadAchievements = async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    setAchievements(data || []);
  };

  const loadUserAchievements = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    setUserAchievements(data || []);
  };

  const completeTask = async (taskId: string) => {
    try {
      const task = dailyTasks.find(t => t.id === taskId);
      if (!task) return;

      const now = new Date().toISOString();
      const isCompleting = !task.is_completed;

      const { error } = await supabase
        .from('daily_tasks')
        .update({
          is_completed: isCompleting,
          completed_at: isCompleting ? now : null,
        })
        .eq('id', taskId);

      if (error) throw error;

      // Update local state
      setDailyTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, is_completed: isCompleting, completed_at: isCompleting ? now : null }
          : t
      ));

      // Update today's progress
      const completedCount = dailyTasks.filter(t => 
        t.id === taskId ? isCompleting : t.is_completed
      ).length;

      if (todayProgress) {
        const { error: progressError } = await supabase
          .from('daily_progress')
          .update({
            completed_tasks: completedCount,
            total_tasks: dailyTasks.length,
          })
          .eq('id', todayProgress.id);

        if (progressError) throw progressError;

        setTodayProgress(prev => prev ? {
          ...prev,
          completed_tasks: completedCount,
          total_tasks: dailyTasks.length,
        } : null);
      }

      toast({
        title: isCompleting ? "Task Completed!" : "Task Marked Incomplete",
        description: `"${task.title}" ${isCompleting ? 'completed' : 'marked as incomplete'}`,
      });

    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const updateStreak = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.rpc('update_user_streak', {
        user_uuid: user.id
      });

      if (error) throw error;

      // Reload profile to get updated streak info
      const { data: updatedProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(updatedProfile);

      return data;
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  };

  const markCleanDay = async (isClean: boolean = true) => {
    try {
      if (!todayProgress) return;

      const { error } = await supabase
        .from('daily_progress')
        .update({ is_clean_day: isClean })
        .eq('id', todayProgress.id);

      if (error) throw error;

      setTodayProgress(prev => prev ? { ...prev, is_clean_day: isClean } : null);

      // Update streak calculation
      await updateStreak();

      toast({
        title: isClean ? "Clean Day Recorded" : "Relapse Recorded",
        description: isClean 
          ? "Great job maintaining your recovery!" 
          : "Tomorrow is a new opportunity. You've got this!",
        variant: isClean ? "default" : "destructive",
      });

    } catch (error) {
      console.error('Error marking clean day:', error);
      toast({
        title: "Error",
        description: "Failed to update daily progress",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    initializeUserData();
  }, []);

  return {
    profile,
    dailyTasks,
    achievements,
    userAchievements,
    todayProgress,
    loading,
    completeTask,
    updateStreak,
    markCleanDay,
    initializeUserData,
  };
};