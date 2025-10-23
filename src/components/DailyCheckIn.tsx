import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Meh, Frown, Heart, Cloud, Sun, CloudRain } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DailyCheckInProps {
  onComplete: (mood: string, notes: string) => void;
  timeOfDay: "morning" | "evening";
}

const moodOptions = [
  { value: "excellent", label: "Excellent", icon: Sun, color: "text-yellow-500" },
  { value: "good", label: "Good", icon: Smile, color: "text-green-500" },
  { value: "okay", label: "Okay", icon: Cloud, color: "text-blue-400" },
  { value: "struggling", label: "Struggling", icon: Frown, color: "text-orange-500" },
  { value: "difficult", label: "Very Difficult", icon: CloudRain, color: "text-red-500" },
];

export const DailyCheckIn = ({ onComplete, timeOfDay }: DailyCheckInProps) => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!selectedMood) {
      toast({
        title: "Please select your mood",
        variant: "destructive",
      });
      return;
    }

    onComplete(selectedMood, notes);
    toast({
      title: "Check-in recorded!",
      description: "Keep up the great work tracking your progress.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <Heart className="w-12 h-12 mx-auto text-primary" />
        <h2 className="text-2xl font-bold">
          {timeOfDay === "morning" ? "Good Morning! 🌅" : "Evening Check-In 🌙"}
        </h2>
        <p className="text-muted-foreground">
          {timeOfDay === "morning"
            ? "How are you feeling as you start your day?"
            : "How did your day go?"}
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium">How are you feeling?</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {moodOptions.map((mood) => {
              const Icon = mood.icon;
              return (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedMood === mood.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${mood.color}`} />
                  <p className="text-xs font-medium">{mood.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">
            Any thoughts or reflections? (Optional)
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={
              timeOfDay === "morning"
                ? "What are you looking forward to today? Any concerns?"
                : "What went well? What was challenging?"
            }
            rows={4}
            className="resize-none"
          />
        </div>

        <Button onClick={handleSubmit} className="w-full" size="lg">
          Complete Check-In
        </Button>
      </Card>

      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground text-center">
          💡 Daily check-ins help you track patterns and stay connected with your progress
        </p>
      </Card>
    </div>
  );
};
