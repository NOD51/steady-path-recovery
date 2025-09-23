import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Send, Users, MessageCircle, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MessageBuddy = ({ onComplete }: { onComplete: () => void }) => {
  const [customMessage, setCustomMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const messageTemplates = [
    {
      id: "support",
      title: "Need Support",
      message: "Hi! I'm having a tough moment right now and could use some encouragement. Are you available to chat?"
    },
    {
      id: "checkin",
      title: "Check-in",
      message: "Hey! Just wanted to check in and let you know I'm thinking about you. How are you doing today?"
    },
    {
      id: "craving",
      title: "Managing Cravings",
      message: "I'm dealing with some strong urges right now. Can we talk? It would really help to have someone to talk through this with."
    },
    {
      id: "victory",
      title: "Share Victory",
      message: "I wanted to share some good news with you! I've been making great progress and wanted to celebrate with someone who understands."
    },
    {
      id: "gratitude",
      title: "Express Gratitude",
      message: "I just wanted to say thank you for being such an important part of my recovery journey. Your support means everything to me."
    }
  ];

  const handleCopyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Message Copied!",
      description: "You can now paste this message in your preferred messaging app.",
    });
  };

  const handleSendMessage = () => {
    const message = selectedTemplate 
      ? messageTemplates.find(t => t.id === selectedTemplate)?.message 
      : customMessage;
    
    if (message) {
      handleCopyMessage(message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <Users className="h-12 w-12 text-secondary-blue" />
        </div>
        <h3 className="text-2xl font-semibold text-foreground">Connect with Your Support Network</h3>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Reach out to someone you trust. Choose a template or write your own message.
        </p>
      </div>

      <Card className="p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Message Templates
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {messageTemplates.map((template) => (
            <div
              key={template.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'bg-primary/10 border-primary'
                  : 'bg-muted/20 border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant={selectedTemplate === template.id ? "default" : "secondary"}>
                  {template.title}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{template.message}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">Custom Message</h4>
        <Textarea
          placeholder="Write your own message..."
          value={customMessage}
          onChange={(e) => {
            setCustomMessage(e.target.value);
            setSelectedTemplate(null);
          }}
          className="min-h-24"
        />
      </Card>

      {(selectedTemplate || customMessage.trim()) && (
        <Card className="p-6 bg-gradient-calm">
          <h4 className="text-lg font-semibold text-foreground mb-3">Preview Message</h4>
          <div className="p-4 bg-background rounded-lg border mb-4">
            <p className="text-foreground">
              {selectedTemplate 
                ? messageTemplates.find(t => t.id === selectedTemplate)?.message 
                : customMessage
              }
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleSendMessage}
              className="flex-1 flex items-center gap-2"
              variant="default"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Message'}
            </Button>
            <Button 
              onClick={onComplete}
              variant="outline"
              className="flex-1"
            >
              Done
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-4 bg-muted/20">
        <p className="text-sm text-muted-foreground text-center">
          After copying your message, you can paste it into your preferred messaging app 
          (SMS, WhatsApp, email, etc.) to send to your support person.
        </p>
      </Card>
    </div>
  );
};