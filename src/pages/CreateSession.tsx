import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateSessionForm } from '@/components/sessions/CreateSessionForm';
import { sessionsService, WellnessSession } from '@/lib/sessions';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Heart, Users } from 'lucide-react';

const CreateSession = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleCreateSession = async (sessionData: Omit<WellnessSession, 'id' | 'createdAt'>) => {
    if (!user) return;

    try {
      const newSession = await sessionsService.createSession({
        ...sessionData,
        userId: user.id
      });

      toast({
        title: "Session Created!",
        description: `Your wellness session "${newSession.title}" has been created successfully.`
      });

      navigate('/my-sessions');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create session. Please try again."
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const tips = [
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: 'Be Authentic',
      description: 'Share practices that genuinely resonate with you and your experience.'
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: 'Think Community',
      description: 'Consider what would be helpful for others on their wellness journey.'
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: 'Clear Instructions',
      description: 'Provide detailed descriptions to help others understand your session.'
    }
  ];

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Create Your Wellness Session
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Share your wellness practice with the community. Whether it's a meditation technique, 
            yoga flow, or breathing exercise, your contribution can help others find peace.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <CreateSessionForm onSubmit={handleCreateSession} />
          </div>

          {/* Tips Sidebar */}
          <div className="space-y-6">
            <Card className="card-gradient border-border/50">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Tips for Creating Great Sessions
                </h3>
                <div className="space-y-4">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex space-x-3">
                      <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                        {tip.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">
                          {tip.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient border-border/50">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  Session Guidelines
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Keep sessions between 5-60 minutes</li>
                  <li>• Choose appropriate difficulty levels</li>
                  <li>• Include clear, step-by-step instructions</li>
                  <li>• Consider accessibility for all users</li>
                  <li>• Test your session before sharing</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSession;