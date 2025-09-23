import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw } from "lucide-react";

export const Timer = ({ onComplete }: { onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime] = useState(600);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setTimeout(onComplete, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((initialTime - timeLeft) / initialTime) * 100;

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-foreground">10 Minute Timer</h3>
        <p className="text-muted-foreground">
          Take these 10 minutes to pause, breathe, and let the feeling pass
        </p>
        <Progress value={progress} className="w-full" />
      </div>

      <div className="flex items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-gradient-calm border-4 border-primary/30 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-muted-foreground">
              {timeLeft === 0 ? 'Complete!' : isRunning ? 'Running...' : 'Paused'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <Button
          onClick={handleToggle}
          variant="default"
          size="lg"
          className="flex items-center gap-2"
          disabled={timeLeft === 0}
        >
          {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        
        <Button
          onClick={handleReset}
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-5 w-5" />
          Reset
        </Button>
      </div>

      <Card className="p-4 bg-muted/20">
        <p className="text-sm text-muted-foreground text-center">
          Use this time to practice breathing, mindfulness, or any coping strategy that works for you.
          Remember: urges are temporary and will pass.
        </p>
      </Card>
    </div>
  );
};