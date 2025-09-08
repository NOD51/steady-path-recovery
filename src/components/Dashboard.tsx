import { useState, useEffect } from "react";
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
  Zap
} from "lucide-react";

export const Dashboard = ({ onUrgeToolkit, onRelapseRecovery }: { onUrgeToolkit: () => void; onRelapseRecovery?: () => void }) => {
  const [streak, setStreak] = useState(7);
  const [treeGrowth, setTreeGrowth] = useState(35);

  // Simulate tree growth based on progress
  useEffect(() => {
    const growthTimer = setInterval(() => {
      setTreeGrowth(prev => Math.min(prev + 1, 100));
    }, 60000); // Grow 1% per minute for demo

    return () => clearInterval(growthTimer);
  }, []);

  const badges = [
    { name: "First Week", icon: Calendar, unlocked: true },
    { name: "Mindful Moments", icon: Heart, unlocked: true },
    { name: "Strong Foundation", icon: Shield, unlocked: false },
    { name: "Community Helper", icon: Users, unlocked: false },
  ];

  const dailyTasks = [
    { task: "Morning reflection", completed: true },
    { task: "Mindful breathing (5 min)", completed: true },
    { task: "Journal entry", completed: false },
    { task: "Evening check-in", completed: false },
  ];

  const completedTasks = dailyTasks.filter(task => task.completed).length;
  const taskProgress = (completedTasks / dailyTasks.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back! 
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
                Growing Strong
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
          </Card>

          {/* Daily Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <Target className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">{completedTasks}/4</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Daily Tasks</span>
                <span>{Math.round(taskProgress)}%</span>
              </div>
              <Progress value={taskProgress} />
            </div>
          </Card>

          {/* Weekly Goal */}
          <Card className="p-6 text-center">
            <Calendar className="h-12 w-12 text-secondary-blue mx-auto mb-3" />
            <div className="text-3xl font-bold text-foreground mb-1">5/7</div>
            <div className="text-sm text-muted-foreground">Days This Week</div>
          </Card>
        </div>

        {/* Badges & Achievements */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Your Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div
                key={index}
                className={`text-center p-4 rounded-lg border transition-all ${
                  badge.unlocked
                    ? 'bg-primary/10 border-primary/20 text-primary'
                    : 'bg-muted/50 border-muted text-muted-foreground'
                }`}
              >
                <badge.icon className={`h-8 w-8 mx-auto mb-2 ${badge.unlocked ? '' : 'opacity-50'}`} />
                <div className="text-sm font-medium">{badge.name}</div>
                {badge.unlocked && (
                  <Badge variant="secondary" className="mt-2 text-xs">Earned</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Today's Tasks */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Today's Tasks</h3>
          <div className="space-y-3">
            {dailyTasks.map((task, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  task.completed
                    ? 'bg-success/10 border-success/20 text-success'
                    : 'bg-card border-border'
                }`}
              >
                <span className={task.completed ? 'line-through' : ''}>{task.task}</span>
                <Badge variant={task.completed ? "default" : "secondary"}>
                  {task.completed ? "Done" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};