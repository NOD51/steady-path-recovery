import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
    markCleanDay 
  } = useGuestProgress();

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

            <Button variant="outline" size="lg" className="w-full justify-start">
              <BookOpen className="h-5 w-5 mr-3" />
              Quick Journal
            </Button>

            <Button variant="outline" size="lg" className="w-full justify-start">
              <Heart className="h-5 w-5 mr-3" />
              Breathing Exercise
            </Button>

            <Button variant="outline" size="lg" className="w-full justify-start">
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
    </div>
  );
};