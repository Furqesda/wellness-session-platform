import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WellnessSession } from '@/lib/sessions';
import { Clock, User, Heart, Brain, Flower2, Wind } from 'lucide-react';

interface SessionCardProps {
  session: WellnessSession;
  onEdit?: (session: WellnessSession) => void;
  onDelete?: (sessionId: string) => void;
  showActions?: boolean;
}

const getSessionIcon = (type: WellnessSession['type']) => {
  switch (type) {
    case 'meditation':
      return <Brain className="h-5 w-5 text-primary" />;
    case 'yoga':
      return <Flower2 className="h-5 w-5 text-primary" />;
    case 'mindfulness':
      return <Heart className="h-5 w-5 text-primary" />;
    case 'breathing':
      return <Wind className="h-5 w-5 text-primary" />;
    default:
      return <Heart className="h-5 w-5 text-primary" />;
  }
};

const getDifficultyColor = (difficulty: WellnessSession['difficulty']) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case 'advanced':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onEdit,
  onDelete,
  showActions = false
}) => {
  return (
    <Card className="card-gradient border-border/50 hover-lift wellness-transition group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getSessionIcon(session.type)}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary wellness-transition">
                {session.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getDifficultyColor(session.difficulty)}>
                  {session.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {session.type}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {session.description}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{session.duration} min</span>
            </div>
            {session.instructor && (
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{session.instructor}</span>
              </div>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex items-center space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(session)}
              className="flex-1 hover-lift wellness-transition"
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete?.(session.id)}
              className="hover-lift wellness-transition"
            >
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};