import { useState, useEffect } from 'react';
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

export interface CheckIn {
  mood: string;
  notes: string;
  timestamp: string;
  timeOfDay: "morning" | "evening";
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
  checkIns?: CheckIn[];
  created_at: string;
  updated_at: string;
}

const GUEST_USER_ID = 'guest-user';

const defaultAchievements: Achievement[] = [
  {
    id: '1',
    name: 'First Step',
    description: 'Completed your first day',
    icon: '🌱',
    unlock_criteria: { streak: 1 },
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Building Momentum',
    description: 'Reached 7 days clean',
    icon: '🚀',
    unlock_criteria: { streak: 7 },
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Strong Foundation',
    description: 'Reached 30 days clean',
    icon: '🏛️',
    unlock_criteria: { streak: 30 },
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Task Master',
    description: 'Completed all daily tasks',
    icon: '✅',
    unlock_criteria: { all_tasks_completed: true },
    created_at: new Date().toISOString(),
  },
];

const createDefaultTasks = (date: string): DailyTask[] => [
  {
    id: `task-1-${date}`,
    user_id: GUEST_USER_ID,
    title: 'Morning Reflection',
    description: 'Take 5 minutes to set intentions for the day',
    is_completed: false,
    task_date: date,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: `task-2-${date}`,
    user_id: GUEST_USER_ID,
    title: 'Physical Activity',
    description: 'Engage in at least 30 minutes of physical exercise',
    is_completed: false,
    task_date: date,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: `task-3-${date}`,
    user_id: GUEST_USER_ID,
    title: 'Mindful Break',
    description: 'Take a 10-minute mindfulness or breathing break',
    is_completed: false,
    task_date: date,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: `task-4-${date}`,
    user_id: GUEST_USER_ID,
    title: 'Connect with Support',
    description: 'Reach out to a friend, family member, or support group',
    is_completed: false,
    task_date: date,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: `task-5-${date}`,
    user_id: GUEST_USER_ID,
    title: 'Evening Journal',
    description: 'Reflect on the day and write down thoughts or gratitude',
    is_completed: false,
    task_date: date,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const useGuestProgress = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [achievements] = useState<Achievement[]>(defaultAchievements);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [todayProgress, setTodayProgress] = useState<DailyProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const initializeUserData = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get or create profile
      const savedProfile = localStorage.getItem('guest_profile');
      let profileData: UserProfile;
      
      if (savedProfile) {
        profileData = JSON.parse(savedProfile);
      } else {
        profileData = {
          id: 'guest-profile',
          user_id: GUEST_USER_ID,
          display_name: 'Guest User',
          streak_start_date: today,
          total_streak_days: 0,
          longest_streak: 0,
          tree_growth_percentage: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        localStorage.setItem('guest_profile', JSON.stringify(profileData));
      }
      
      setProfile(profileData);

      // Get or create today's progress
      const savedProgress = localStorage.getItem(`guest_progress_${today}`);
      let progressData: DailyProgress;
      
      if (savedProgress) {
        progressData = JSON.parse(savedProgress);
      } else {
        progressData = {
          id: `progress-${today}`,
          user_id: GUEST_USER_ID,
          date: today,
          is_clean_day: true,
          completed_tasks: 0,
          total_tasks: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        localStorage.setItem(`guest_progress_${today}`, JSON.stringify(progressData));
      }
      
      setTodayProgress(progressData);

      // Get or create today's tasks
      const savedTasks = localStorage.getItem(`guest_tasks_${today}`);
      let tasksData: DailyTask[];
      
      if (savedTasks) {
        tasksData = JSON.parse(savedTasks);
      } else {
        tasksData = createDefaultTasks(today);
        localStorage.setItem(`guest_tasks_${today}`, JSON.stringify(tasksData));
      }
      
      setDailyTasks(tasksData);

      // Load user achievements
      const savedUserAchievements = localStorage.getItem('guest_user_achievements');
      if (savedUserAchievements) {
        setUserAchievements(JSON.parse(savedUserAchievements));
      }

    } catch (error) {
      console.error('Error initializing guest user data:', error);
      toast({
        title: "Error",
        description: "Failed to load progress data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const completeTask = (taskId: string) => {
    try {
      const task = dailyTasks.find(t => t.id === taskId);
      if (!task) return;

      const now = new Date().toISOString();
      const isCompleting = !task.is_completed;
      const today = new Date().toISOString().split('T')[0];

      // Update task
      const updatedTasks = dailyTasks.map(t => 
        t.id === taskId 
          ? { ...t, is_completed: isCompleting, completed_at: isCompleting ? now : null, updated_at: now }
          : t
      );
      
      setDailyTasks(updatedTasks);
      localStorage.setItem(`guest_tasks_${today}`, JSON.stringify(updatedTasks));

      // Update progress
      const completedCount = updatedTasks.filter(t => t.is_completed).length;
      
      if (todayProgress) {
        const updatedProgress = {
          ...todayProgress,
          completed_tasks: completedCount,
          total_tasks: updatedTasks.length,
          updated_at: now,
        };
        
        setTodayProgress(updatedProgress);
        localStorage.setItem(`guest_progress_${today}`, JSON.stringify(updatedProgress));

        // Check for all tasks completed achievement
        if (completedCount === updatedTasks.length && completedCount > 0) {
          unlockAchievement('4'); // Task Master achievement
        }
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

  const calculateStreak = (): number => {
    let streak = 0;
    const currentDate = new Date();
    
    // Look backwards from today to find consecutive clean days
    for (let i = 0; i < 365; i++) { // Max look back of 1 year
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const progressData = localStorage.getItem(`guest_progress_${dateStr}`);
      if (progressData) {
        const progress = JSON.parse(progressData);
        if (progress.is_clean_day) {
          streak++;
        } else {
          break; // Streak broken
        }
      } else if (i === 0) {
        // No data for today means streak starts today
        streak = 0;
        break;
      } else {
        // No data for past days, assume clean but don't count
        break;
      }
    }
    
    return streak;
  };

  const unlockAchievement = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return;

    const existingAchievement = userAchievements.find(ua => ua.achievement_id === achievementId);
    if (existingAchievement) return; // Already unlocked

    const newUserAchievement: UserAchievement = {
      id: `user-achievement-${achievementId}-${Date.now()}`,
      user_id: GUEST_USER_ID,
      achievement_id: achievementId,
      unlocked_at: new Date().toISOString(),
      achievement,
    };

    const updatedUserAchievements = [...userAchievements, newUserAchievement];
    setUserAchievements(updatedUserAchievements);
    localStorage.setItem('guest_user_achievements', JSON.stringify(updatedUserAchievements));

    toast({
      title: "Achievement Unlocked! 🏆",
      description: `${achievement.icon} ${achievement.name}: ${achievement.description}`,
    });
  };

  const updateStreak = () => {
    if (!profile) return 0;

    const newStreak = calculateStreak();
    const treeGrowth = Math.min(100, newStreak * 2);
    
    const updatedProfile = {
      ...profile,
      total_streak_days: newStreak,
      longest_streak: Math.max(profile.longest_streak, newStreak),
      tree_growth_percentage: treeGrowth,
      updated_at: new Date().toISOString(),
    };
    
    setProfile(updatedProfile);
    localStorage.setItem('guest_profile', JSON.stringify(updatedProfile));

    // Check for streak achievements
    if (newStreak === 1) unlockAchievement('1');
    if (newStreak === 7) unlockAchievement('2');
    if (newStreak === 30) unlockAchievement('3');

    return newStreak;
  };

  const addCheckIn = (mood: string, notes: string, timeOfDay: "morning" | "evening") => {
    try {
      if (!todayProgress) return;

      const today = new Date().toISOString().split('T')[0];
      const checkIn: CheckIn = {
        mood,
        notes,
        timestamp: new Date().toISOString(),
        timeOfDay
      };

      const existingCheckIns = todayProgress.checkIns || [];
      const updatedCheckIns = [...existingCheckIns, checkIn];

      const updatedProgress = {
        ...todayProgress,
        checkIns: updatedCheckIns,
        updated_at: new Date().toISOString(),
      };

      setTodayProgress(updatedProgress);
      localStorage.setItem(`guest_progress_${today}`, JSON.stringify(updatedProgress));

      toast({
        title: "Check-in Recorded!",
        description: "Keep up the great work tracking your progress.",
      });
    } catch (error) {
      console.error('Error adding check-in:', error);
      toast({
        title: "Error",
        description: "Failed to save check-in",
        variant: "destructive",
      });
    }
  };

  const markCleanDay = (isClean: boolean = true) => {
    try {
      if (!todayProgress) return;

      const now = new Date().toISOString();
      const today = new Date().toISOString().split('T')[0];
      
      const updatedProgress = {
        ...todayProgress,
        is_clean_day: isClean,
        updated_at: now,
      };
      
      setTodayProgress(updatedProgress);
      localStorage.setItem(`guest_progress_${today}`, JSON.stringify(updatedProgress));

      // Update streak
      updateStreak();

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
    addCheckIn,
    initializeUserData,
  };
};