import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TreePine, Heart, Shield, Users } from "lucide-react";
import heroImage from "@/assets/hero-image.png";

export const LandingPage = ({ onStartJourney }: { onStartJourney: () => void }) => {
  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left lg:text-left">
              <TreePine className="h-16 w-16 text-primary mb-6 animate-float" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-healing bg-clip-text text-transparent mb-6">
                Reclaim Your Life
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
                A compassionate journey toward digital wellness and personal growth. 
                Start your recovery with evidence-based tools and supportive community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={onStartJourney}
                >
                  Start Your Journey
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Learn More
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Digital wellness journey illustration showing peaceful meditation and growth"
                className="w-full h-auto rounded-xl shadow-strong"
              />
              <div className="absolute inset-0 bg-gradient-healing opacity-10 rounded-xl"></div>
            </div>
          </div>
        </div>


        {/* Feature Cards */}
        <div className="mt-24">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
              <Heart className="h-12 w-12 text-compassion mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Compassionate Support</h3>
              <p className="text-muted-foreground">
                Non-judgmental tools and community designed to support your recovery journey with empathy and understanding.
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
              <Shield className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Evidence-Based Tools</h3>
              <p className="text-muted-foreground">
                Research-backed techniques including urge management, mindfulness, and personalized recovery plans.
              </p>
            </Card>

            <Card className="p-8 bg-card/50 backdrop-blur-sm border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community & Accountability</h3>
              <p className="text-muted-foreground">
                Connect with others on similar journeys through buddy systems and supportive group check-ins.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-card/30 backdrop-blur-sm py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Lives Reclaimed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-success mb-2">85%</div>
              <div className="text-muted-foreground">Report Improvement</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary-blue mb-2">30 Days</div>
              <div className="text-muted-foreground">Average to See Results</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};