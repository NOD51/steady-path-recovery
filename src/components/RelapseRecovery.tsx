import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  ArrowLeft, 
  Clock, 
  MapPin, 
  BookOpen,
  Users,
  Target,
  CheckCircle
} from "lucide-react";

const triggers = [
  "Stress/Anxiety", "Boredom", "Loneliness", "Late Night", 
  "Work Pressure", "Social Media", "Relationship Issues", "Other"
];

const resetSteps = [
  { title: "Acknowledge without judgment", description: "This is part of the journey, not a failure" },
  { title: "Learn from this moment", description: "What can this teach you about your patterns?" },
  { title: "Reconnect with your why", description: "Remember why you started this journey" },
  { title: "Plan your next 24 hours", description: "Set yourself up for success today" },
  { title: "Reach out for support", description: "You don't have to do this alone" },
];

export const RelapseRecovery = ({ onBack }: { onBack: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [context, setContext] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleTriggerToggle = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger) 
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepIndex) 
        ? prev 
        : [...prev, stepIndex]
    );
  };

  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-background p-4">
        <div className="container mx-auto max-w-3xl">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="text-center mb-8">
            <Heart className="h-16 w-16 text-compassion mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
              You're Being Brave
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Taking the time to reflect on this moment shows incredible self-awareness and courage. 
              Let's turn this into learning and growth together.
            </p>
          </div>

          <Card className="p-8 shadow-medium mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Help us understand what happened
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  What might have triggered this moment? (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {triggers.map((trigger) => (
                    <Button
                      key={trigger}
                      variant={selectedTriggers.includes(trigger) ? "default" : "outline"}
                      size="sm"
                      className="h-auto p-3 text-center"
                      onClick={() => handleTriggerToggle(trigger)}
                    >
                      {trigger}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  <Clock className="h-4 w-4 inline mr-2" />
                  What was happening around this time? (Optional)
                </label>
                <textarea
                  className="w-full p-4 border border-border rounded-lg bg-input min-h-24 resize-none"
                  placeholder="Describe your environment, mood, or what was happening..."
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button variant="outline" size="lg" className="flex-1">
                Skip This Step
              </Button>
              <Button 
                variant="hero" 
                size="lg" 
                className="flex-1"
                onClick={() => setCurrentStep(1)}
                disabled={selectedTriggers.length === 0}
              >
                Continue to Recovery
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-calm text-center">
            <p className="text-muted-foreground">
              <strong>Remember:</strong> This information helps create a personalized plan to support you better. 
              Everything you share is private and secure.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="container mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep(0)}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-8">
          <Target className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Your Recovery Reset Plan
          </h1>
          <p className="text-muted-foreground">
            These steps are designed to help you move forward with compassion and strength.
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          {resetSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            return (
              <Card 
                key={index}
                className={`p-6 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-success/10 border-success/20 shadow-soft' 
                    : 'shadow-soft hover:shadow-medium'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    isCompleted 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {step.description}
                    </p>
                    
                    {!isCompleted && (
                      <div className="flex gap-3">
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleStepComplete(index)}
                        >
                          Complete This Step
                        </Button>
                        {index === 1 && (
                          <Button variant="outline" size="sm">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Quick Journal
                          </Button>
                        )}
                        {index === 4 && (
                          <Button variant="outline" size="sm">
                            <Users className="h-4 w-4 mr-2" />
                            Contact Buddy
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {isCompleted && (
                      <Badge variant="default" className="bg-success text-success-foreground">
                        ✓ Completed
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-6 bg-gradient-healing text-center">
          <h3 className="text-lg font-semibold text-white mb-2">
            Progress: {completedSteps.length}/{resetSteps.length} Steps Complete
          </h3>
          <p className="text-white/90 mb-4">
            Each step you complete is a victory. You're already on your way back.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              Save Progress
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={onBack}
            >
              Return to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};