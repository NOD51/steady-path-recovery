import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DailyCheckIn } from "./DailyCheckIn";
import { 
  TreePine, 
  Flame, 
  Calendar, 
  Target, 
  Heart, 
  Shield,
  BookOpen,
  Users,
  Zap,
  CheckCircle,
  Circle,
  Trophy
} from "lucide-react";
import { useGuestProgress } from "@/hooks/useGuestProgress";

export const Dashboard = ({ onUrgeToolkit, onRelapseRecovery }: { onUrgeToolkit: () => void; onRelapseRecovery?: () => void }) => {
  const { 
    profile, 
    dailyTasks, 
    userAchievements, 
    todayProgress,
    loading,
    completeTask,
    markCleanDay,
    addCheckIn
  } = useGuestProgress();

  const [showCheckIn, setShowCheckIn] = useState(false);
  
  // Determine time of day for check-in
  const currentHour = new Date().getHours();
  const timeOfDay: "morning" | "evening" = currentHour < 12 ? "morning" : "evening";
  
  // Check if user has already done check-in for this time of day
  const hasCheckedInToday = todayProgress?.checkIns?.some(
    checkIn => checkIn.timeOfDay === timeOfDay
  ) || false;

  const handleCheckInComplete = (mood: string, notes: string) => {
    addCheckIn(mood, notes, timeOfDay);
    setShowCheckIn(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  const completedTasks = dailyTasks.filter(task => task.is_completed).length;
  const taskProgress = dailyTasks.length > 0 ? (completedTasks / dailyTasks.length) * 100 : 0;
  const streak = profile?.total_streak_days || 0;
  const treeGrowth = profile?.tree_growth_percentage || 0;

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back{profile?.display_name ? `, ${profile.display_name}` : ''}! 
          </h1>
          <p className="text-muted-foreground">
            You're doing great. Here's your progress today.
          </p>
        </div>

        {/* Daily Check-In Prompt */}
        {!hasCheckedInToday && (
          <Card className="p-4 mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">
                    {timeOfDay === "morning" ? "Morning Check-In" : "Evening Check-In"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Take a moment to reflect on how you're feeling
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowCheckIn(true)} variant="default">
                Check In
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Life Tree Visualization */}
          <Card className="lg:col-span-2 p-8 bg-gradient-calm shadow-medium">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Your Life Tree</h2>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                {treeGrowth >= 75 ? 'Flourishing' : treeGrowth >= 50 ? 'Growing Strong' : treeGrowth >= 25 ? 'Taking Root' : 'Planted'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <TreePine 
                  className={`h-32 w-32 transition-all duration-1000 ${
                    treeGrowth > 50 ? 'text-success' : treeGrowth > 25 ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  style={{ filter: `brightness(${Math.max(0.7, treeGrowth / 100)})` }}
                />
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold animate-pulse-soft">
                  {treeGrowth}%
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Tree Growth</span>
                <span>{treeGrowth}% Complete</span>
              </div>
              <Progress value={treeGrowth} className="h-3" />
              <p className="text-sm text-muted-foreground text-center">
                Your tree grows stronger with each positive choice you make
              </p>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            
            <Button 
              variant="panic" 
              size="lg" 
              className="w-full justify-start text-left"
              onClick={onUrgeToolkit}
            >
              <Zap className="h-5 w-5 mr-3" />
              Need Help Now
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              className="w-full justify-start"
              onClick={() => {
                const toolkit = document.createElement('div');
                toolkit.style.position = 'fixed';
                toolkit.style.top = '0';
                toolkit.style.left = '0';
                toolkit.style.right = '0';
                toolkit.style.bottom = '0';
                toolkit.style.zIndex = '9999';
                toolkit.style.backgroundColor = 'rgba(0,0,0,0.8)';
                toolkit.style.display = 'flex';
                toolkit.style.alignItems = 'center';
                toolkit.style.justifyContent = 'center';
                toolkit.innerHTML = '<div style="color: white; text-align: center;">Quick Journal feature - Click outside to close</div>';
                toolkit.onclick = () => document.body.removeChild(toolkit);
                document.body.appendChild(toolkit);
              }}
            >
              <BookOpen className="h-5 w-5 mr-3" />
              Quick Journal
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              className="w-full justify-start"
              onClick={() => {
                const breathing = document.createElement('div');
                breathing.style.position = 'fixed';
                breathing.style.top = '0';
                breathing.style.left = '0';
                breathing.style.right = '0';
                breathing.style.bottom = '0';
                breathing.style.zIndex = '9999';
                breathing.style.backgroundColor = 'rgba(0,0,0,0.8)';
                breathing.style.display = 'flex';
                breathing.style.alignItems = 'center';
                breathing.style.justifyContent = 'center';
                breathing.innerHTML = '<div style="color: white; text-align: center;">Breathing Exercise feature - Click outside to close</div>';
                breathing.onclick = () => document.body.removeChild(breathing);
                document.body.appendChild(breathing);
              }}
            >
              <Heart className="h-5 w-5 mr-3" />
              Breathing Exercise
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              className="w-full justify-start"
              onClick={() => {
                const buddy = document.createElement('div');
                buddy.style.position = 'fixed';
                buddy.style.top = '0';
                buddy.style.left = '0';
                buddy.style.right = '0';
                buddy.style.bottom = '0';
                buddy.style.zIndex = '9999';
                buddy.style.backgroundColor = 'rgba(0,0,0,0.8)';
                buddy.style.display = 'flex';
                buddy.style.alignItems = 'center';
                buddy.style.justifyContent = 'center';
                buddy.innerHTML = '<div style="color: white; text-align: center;">Connect with Buddy feature - Click outside to close</div>';
                buddy.onclick = () => document.body.removeChild(buddy);
                document.body.appendChild(buddy);
              }}
            >
              <Users className="h-5 w-5 mr-3" />
              Connect with Buddy
            </Button>

            {onRelapseRecovery && (
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full justify-start text-compassion border-compassion/20 hover:bg-compassion/10"
                onClick={onRelapseRecovery}
              >
                <Heart className="h-5 w-5 mr-3" />
                Need Support
              </Button>
            )}
          </Card>
        </div>

        {/* Stats and Progress */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Streak Counter */}
          <Card className="p-6 text-center bg-gradient-growth">
            <Flame className="h-12 w-12 text-orange-500 mx-auto mb-3 animate-pulse-soft" />
            <div className="text-3xl font-bold text-foreground mb-1">{streak}</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
            <div className="mt-3 space-y-1">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => markCleanDay(true)}
                className="mr-2"
              >
                Mark Clean Day
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => markCleanDay(false)}
              >
                Record Relapse
              </Button>
            </div>
          </Card>

          {/* Daily Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Target className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">{completedTasks}/{dailyTasks.length}</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Daily Tasks</span>
                <span>{Math.round(taskProgress)}%</span>
              </div>
              <Progress value={taskProgress} />
            </div>
          </Card>

          {/* Achievements Count */}
          <Card className="p-6 text-center">
            <Trophy className="h-12 w-12 text-secondary-blue mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-1">{userAchievements.length}</div>
            <div className="text-sm text-muted-foreground">Achievements Earned</div>
          </Card>
        </div>

        {/* Today's Tasks */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Today's Tasks</h3>
          <div className="space-y-3">
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  task.is_completed
                    ? 'bg-success/10 border-success/20'
                    : 'bg-card border-border hover:border-primary/20'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => completeTask(task.id)}
                    className="flex items-center justify-center transition-colors"
                  >
                    {task.is_completed ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    )}
                  </button>
                  <div>
                    <span className={`font-medium ${task.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.title}
                    </span>
                    {task.description && (
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    )}
                  </div>
                </div>
                <Badge variant={task.is_completed ? "default" : "secondary"}>
                  {task.is_completed ? "Done" : "Pending"}
                </Badge>
              </div>
            ))}
            {dailyTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No tasks for today. Great work staying on track!</p>
              </div>
            )}
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userAchievements.slice(0, 4).map((userAchievement) => (
              <div
                key={userAchievement.id}
                className="text-center p-4 rounded-lg border bg-primary/10 border-primary/20 text-primary transition-all hover:bg-primary/15"
              >
                <div className="text-3xl mb-2">{userAchievement.achievement.icon}</div>
                <div className="text-sm font-medium">{userAchievement.achievement.name}</div>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {new Date(userAchievement.unlocked_at).toLocaleDateString()}
                </Badge>
              </div>
            ))}
            {userAchievements.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Complete milestones to unlock achievements!</p>
                <p className="text-xs mt-1">Keep building your streak and completing tasks.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Daily Check-In Dialog */}
      <Dialog open={showCheckIn} onOpenChange={setShowCheckIn}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DailyCheckIn onComplete={handleCheckInComplete} timeOfDay={timeOfDay} />
        </DialogContent>
      </Dialog>
    </div>
  );
};