import { useState, useEffect } from "react";
import { LandingPage } from "@/components/LandingPage";
import { OnboardingQuiz } from "@/components/OnboardingQuiz";
import { Dashboard } from "@/components/Dashboard";
import { UrgeToolkit } from "@/components/UrgeToolkit";
import { RelapseRecovery } from "@/components/RelapseRecovery";
import { useAuth } from "@/hooks/useAuth";

type AppState = "landing" | "onboarding" | "dashboard" | "urge-toolkit" | "relapse-recovery";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const [currentState, setCurrentState] = useState<AppState>("landing");

  // Update state based on authentication
  useEffect(() => {
    if (!authLoading) {
      if (user && currentState === "landing") {
        setCurrentState("dashboard");
      } else if (!user && (currentState === "dashboard" || currentState === "urge-toolkit" || currentState === "relapse-recovery")) {
        setCurrentState("landing");
      }
    }
  }, [user, authLoading, currentState]);

  const handleStartJourney = () => {
    setCurrentState("onboarding");
  };

  const handleOnboardingComplete = () => {
    if (user) {
      setCurrentState("dashboard");
    } else {
      setCurrentState("landing");
    }
  };

  const handleUrgeToolkit = () => {
    setCurrentState("urge-toolkit");
  };

  const handleRelapseRecovery = () => {
    setCurrentState("relapse-recovery");
  };

  const handleBackToDashboard = () => {
    setCurrentState("dashboard");
  };

  const handleBackToLanding = () => {
    setCurrentState("landing");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  switch (currentState) {
    case "landing":
      return <LandingPage onStartJourney={handleStartJourney} />;
    case "onboarding":
      return <OnboardingQuiz onComplete={handleOnboardingComplete} />;
    case "dashboard":
      return user ? <Dashboard onUrgeToolkit={handleUrgeToolkit} onRelapseRecovery={handleRelapseRecovery} /> : <LandingPage onStartJourney={handleStartJourney} />;
    case "urge-toolkit":
      return user ? <UrgeToolkit onBack={handleBackToDashboard} /> : <LandingPage onStartJourney={handleStartJourney} />;
    case "relapse-recovery":
      return user ? <RelapseRecovery onBack={handleBackToDashboard} /> : <LandingPage onStartJourney={handleStartJourney} />;
    default:
      return <LandingPage onStartJourney={handleStartJourney} />;
  }
};

export default Index;
