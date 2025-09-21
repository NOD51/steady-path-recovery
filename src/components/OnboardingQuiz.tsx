import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  question: string;
  type: "multiple" | "scale" | "text";
  options?: string[];
  placeholder?: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What brings you to Reclaim today?",
    type: "multiple",
    options: [
      "I want to reduce my digital consumption",
      "I'm struggling with specific content online",
      "I want to build healthier habits",
      "Someone recommended this to me",
    ],
  },
  {
    id: 2,
    question: "How would you rate your current relationship with digital media?",
    type: "scale",
  },
  {
    id: 3,
    question: "What are your main triggers or challenging moments?",
    type: "multiple",
    options: [
      "Stress and anxiety",
      "Boredom or loneliness", 
      "Late at night",
      "During work breaks",
      "Social situations",
    ],
  },
  {
    id: 4,
    question: "What does success look like for you? (Optional)",
    type: "text",
    placeholder: "Describe your goals and what you hope to achieve...",
  },
];

export const OnboardingQuiz = ({ onComplete }: { onComplete: () => void }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [scaleValue, setScaleValue] = useState(5);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const { toast } = useToast();

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answer
    }));
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Complete onboarding - store answers locally for now
      setIsCreatingAccount(true);
      try {
        // Store onboarding answers in localStorage
        localStorage.setItem('onboarding_answers', JSON.stringify(answers));
        localStorage.setItem('onboarding_completed', 'true');

        toast({
          title: "Welcome to your recovery journey!",
          description: "Let's start building your progress.",
        });

        onComplete();
      } catch (error) {
        console.error("Onboarding completion error:", error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsCreatingAccount(false);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-medium">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="mb-6" />
          
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            {question.question}
          </h2>
        </div>

        <div className="mb-8">
          {question.type === "multiple" && (
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <Button
                  key={index}
                  variant={answers[question.id] === option ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          )}

          {question.type === "scale" && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Very Unhealthy</span>
                <span>Very Healthy</span>
              </div>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                  <Button
                    key={value}
                    variant={scaleValue === value ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setScaleValue(value);
                      handleAnswer(value);
                    }}
                  >
                    {value}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {question.type === "text" && (
            <textarea
              className="w-full p-4 border border-border rounded-md bg-input min-h-32 resize-none"
              placeholder={question.placeholder}
              onChange={(e) => handleAnswer(e.target.value)}
              value={answers[question.id] || ""}
            />
          )}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={(!answers[question.id] && question.type !== "text") || isCreatingAccount}
            className="flex items-center gap-2"
            variant="hero"
          >
            {isCreatingAccount 
              ? "Creating your account..." 
              : currentQuestion === questions.length - 1 
                ? "Complete Journey" 
                : "Next"
            }
            {!isCreatingAccount && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </Card>
    </div>
  );
};