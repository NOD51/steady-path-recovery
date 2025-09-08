import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Clock, 
  Heart, 
  BookOpen, 
  Users, 
  Phone,
  Zap
} from "lucide-react";

const BreathingExercise = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [seconds, setSeconds] = useState(4);
  const [cycle, setCycle] = useState(0);
  const totalCycles = 8;

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev === 1) {
          if (phase === 'inhale') {
            setPhase('hold');
            return 4;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return 6;
          } else {
            setCycle(prev => prev + 1);
            setPhase('inhale');
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    if (cycle >= totalCycles) {
      clearInterval(timer);
      setTimeout(onComplete, 1000);
    }

    return () => clearInterval(timer);
  }, [phase, cycle, onComplete]);

  const progress = (cycle / totalCycles) * 100;

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-foreground">Breathing Exercise</h3>
        <p className="text-muted-foreground">Follow the circle and breathe with the rhythm</p>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground">Cycle {cycle + 1} of {totalCycles}</p>
      </div>

      <div className="flex items-center justify-center">
        <div
          className={`w-32 h-32 rounded-full bg-gradient-calm border-4 border-primary/30 flex items-center justify-center transition-transform duration-1000 ${
            phase === 'inhale' ? 'scale-125 animate-breathe' : 
            phase === 'hold' ? 'scale-125' : 'scale-100'
          }`}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{seconds}</div>
            <div className="text-sm text-primary capitalize">{phase}</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-lg font-medium text-foreground capitalize">{phase}</p>
        <p className="text-sm text-muted-foreground">
          {phase === 'inhale' && "Breathe in slowly through your nose"}
          {phase === 'hold' && "Hold your breath gently"}
          {phase === 'exhale' && "Breathe out slowly through your mouth"}
        </p>
      </div>
    </div>
  );
};

const QuickJournal = ({ onComplete }: { onComplete: () => void }) => {
  const [entry, setEntry] = useState("");

  const prompts = [
    "What am I feeling right now?",
    "What triggered this urge?",
    "What would help me feel better?",
    "What am I grateful for today?",
    "What's one thing I can do for myself right now?"
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-semibold text-foreground">Quick Journal</h3>
        <p className="text-muted-foreground">Take a moment to reflect on your feelings</p>
      </div>

      <Card className="p-4 bg-muted/20">
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Reflection prompts:</p>
          <div className="grid grid-cols-1 gap-2">
            {prompts.map((prompt, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="justify-start text-left h-auto p-2 text-muted-foreground hover:text-foreground"
                onClick={() => setEntry(prev => prev + (prev ? "\n\n" : "") + prompt + "\n")}
              >
                • {prompt}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      <textarea
        className="w-full p-4 border border-border rounded-lg bg-input min-h-40 resize-none"
        placeholder="Write about what you're experiencing... your thoughts, feelings, or anything that comes to mind."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />

      <div className="flex gap-3">
        <Button variant="outline" size="lg" className="flex-1" onClick={onComplete}>
          Save for Later
        </Button>
        <Button variant="hero" size="lg" className="flex-1" onClick={onComplete}>
          Done Reflecting
        </Button>
      </div>
    </div>
  );
};

export const UrgeToolkit = ({ onBack }: { onBack: () => void }) => {
  const [currentTool, setCurrentTool] = useState<string | null>(null);
  const [urgencyLevel, setUrgencyLevel] = useState<number | null>(null);

  const handleToolComplete = () => {
    setCurrentTool(null);
    // Could show a completion message or navigate back
  };

  if (currentTool === 'breathing') {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8 shadow-medium">
          <Button
            variant="ghost"
            onClick={() => setCurrentTool(null)}
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Button>
          <BreathingExercise onComplete={handleToolComplete} />
        </Card>
      </div>
    );
  }

  if (currentTool === 'journal') {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 shadow-medium">
          <Button
            variant="ghost"
            onClick={() => setCurrentTool(null)}
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Button>
          <QuickJournal onComplete={handleToolComplete} />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <Zap className="h-16 w-16 text-warning mx-auto mb-4 animate-pulse-soft" />
            <h1 className="text-3xl font-bold text-foreground mb-2">
              You're Taking Control
            </h1>
            <p className="text-lg text-muted-foreground">
              This moment of pause shows your strength. Choose a tool to help you through this.
            </p>
          </div>
        </div>

        {!urgencyLevel && (
          <Card className="p-8 mb-8 shadow-medium">
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
              How intense is this feeling right now?
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant="outline"
                size="lg"
                className="h-20 flex-col"
                onClick={() => setUrgencyLevel(1)}
              >
                <span className="text-2xl mb-1">😌</span>
                <span>Mild</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-20 flex-col"
                onClick={() => setUrgencyLevel(2)}
              >
                <span className="text-2xl mb-1">😰</span>
                <span>Moderate</span>
              </Button>
              <Button
                variant="panic"
                size="lg"
                className="h-20 flex-col"
                onClick={() => setUrgencyLevel(3)}
              >
                <span className="text-2xl mb-1">🚨</span>
                <span>Intense</span>
              </Button>
            </div>
          </Card>
        )}

        {urgencyLevel && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Immediate Tools */}
            <Card className="p-6 shadow-medium">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Immediate Relief
              </h3>
              <div className="space-y-3">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full justify-start"
                  onClick={() => setCurrentTool('breathing')}
                >
                  <Heart className="h-5 w-5 mr-3" />
                  Breathing Exercise (2 min)
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start"
                >
                  <Clock className="h-5 w-5 mr-3" />
                  10 Minute Timer
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start"
                >
                  <Zap className="h-5 w-5 mr-3" />
                  Distraction Game
                </Button>
              </div>
            </Card>

            {/* Reflection Tools */}
            <Card className="p-6 shadow-medium">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-secondary-blue" />
                Reflection & Support
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start"
                  onClick={() => setCurrentTool('journal')}
                >
                  <BookOpen className="h-5 w-5 mr-3" />
                  Quick Journal
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start"
                >
                  <Users className="h-5 w-5 mr-3" />
                  Message Buddy
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full justify-start"
                >
                  <Phone className="h-5 w-5 mr-3" />
                  Crisis Support
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Encouragement */}
        <Card className="p-6 mt-8 bg-gradient-calm text-center shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Remember: This feeling will pass
          </h3>
          <p className="text-muted-foreground">
            You've made it through difficult moments before. Every moment you pause and choose a healthy response is a victory.
          </p>
        </Card>
      </div>
    </div>
  );
};