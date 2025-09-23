import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, MessageCircle, ExternalLink, Heart } from "lucide-react";

export const CrisisSupport = ({ onComplete }: { onComplete: () => void }) => {
  const emergencyContacts = [
    {
      name: "Crisis Text Line",
      description: "Text HOME to 741741",
      action: "Text 741741",
      icon: MessageCircle,
      urgent: true
    },
    {
      name: "National Suicide Prevention Lifeline",
      description: "24/7 free and confidential support",
      action: "Call 988",
      icon: Phone,
      urgent: true
    },
    {
      name: "SAMHSA National Helpline",
      description: "Substance abuse and mental health services",
      action: "Call 1-800-662-4357",
      icon: Phone,
      urgent: false
    }
  ];

  const onlineResources = [
    {
      name: "Crisis Text Line",
      url: "https://www.crisistextline.org/",
      description: "Free, 24/7 support via text message"
    },
    {
      name: "SAMHSA Treatment Locator",
      url: "https://findtreatment.samhsa.gov/",
      description: "Find treatment facilities and programs"
    },
    {
      name: "National Alliance on Mental Illness",
      url: "https://nami.org/",
      description: "Support groups and resources"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <Heart className="h-12 w-12 text-compassion animate-pulse-soft" />
        </div>
        <h3 className="text-2xl font-semibold text-foreground">You're Not Alone</h3>
        <p className="text-muted-foreground max-w-lg mx-auto">
          If you're having thoughts of self-harm or suicide, please reach out for help immediately. 
          These resources are available 24/7.
        </p>
      </div>

      <Card className="p-6 bg-destructive/10 border-destructive/20">
        <h4 className="text-lg font-semibold text-destructive mb-4">Emergency Support</h4>
        <div className="space-y-3">
          {emergencyContacts.filter(contact => contact.urgent).map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg border">
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-5 w-5 text-destructive" />
                  <div>
                    <div className="font-medium text-foreground">{contact.name}</div>
                    <div className="text-sm text-muted-foreground">{contact.description}</div>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    if (contact.action.includes('Call')) {
                      window.location.href = `tel:${contact.action.replace('Call ', '')}`;
                    } else if (contact.action.includes('Text')) {
                      window.location.href = `sms:${contact.action.replace('Text ', '')}`;
                    }
                  }}
                >
                  {contact.action}
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Additional Support</h4>
        <div className="space-y-3">
          {emergencyContacts.filter(contact => !contact.urgent).map((contact, index) => {
            const IconComponent = contact.icon;
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">{contact.name}</div>
                    <div className="text-sm text-muted-foreground">{contact.description}</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (contact.action.includes('Call')) {
                      window.location.href = `tel:${contact.action.replace('Call ', '')}`;
                    }
                  }}
                >
                  {contact.action}
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Online Resources</h4>
        <div className="space-y-3">
          {onlineResources.map((resource, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div>
                <div className="font-medium text-foreground">{resource.name}</div>
                <div className="text-sm text-muted-foreground">{resource.description}</div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(resource.url, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Visit
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-calm text-center">
        <h4 className="text-lg font-semibold text-foreground mb-2">Remember</h4>
        <p className="text-muted-foreground mb-4">
          Reaching out for help is a sign of strength, not weakness. You deserve support and care.
        </p>
        <Button onClick={onComplete} variant="default" size="lg">
          I'm Safe for Now
        </Button>
      </Card>
    </div>
  );
};