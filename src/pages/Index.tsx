import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { OnboardingQuiz } from "@/components/OnboardingQuiz";
import { Dashboard } from "@/components/Dashboard";
import { UrgeToolkit } from "@/components/UrgeToolkit";
import { RelapseRecovery } from "@/components/RelapseRecovery";

type AppState = "landing" | "onboarding" | "dashboard" | "urge-toolkit" | "relapse-recovery";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("landing");

  const handleStartJourney = () => {
    setCurrentState("onboarding");
  };

  const handleOnboardingComplete = () => {
    setCurrentState("dashboard");
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

  switch (currentState) {
    case "landing":
      return <LandingPage onStartJourney={handleStartJourney} />;
    case "onboarding":
      return <OnboardingQuiz onComplete={handleOnboardingComplete} />;
    case "dashboard":
      return <Dashboard onUrgeToolkit={handleUrgeToolkit} onRelapseRecovery={handleRelapseRecovery} />;
    case "urge-toolkit":
      return <UrgeToolkit onBack={handleBackToDashboard} />;
    case "relapse-recovery":
      return <RelapseRecovery onBack={handleBackToDashboard} />;
    default:
      return <LandingPage onStartJourney={handleStartJourney} />;
  }
};

export default Index;
