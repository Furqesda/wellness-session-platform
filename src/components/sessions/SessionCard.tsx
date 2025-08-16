import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WellnessSession } from '@/lib/sessions';
import { favoritesService } from '@/lib/favorites';
import { completionService } from '@/lib/completion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { VideoModal } from './VideoModal';
import { Clock, User, Heart, Brain, Flower2, Wind, Check, Play } from 'lucide-react';

interface SessionCardProps {
  session: WellnessSession;
  onEdit?: (session: WellnessSession) => void;
  onDelete?: (sessionId: string) => void;
  showActions?: boolean;
  showFavorites?: boolean;
  showCompletion?: boolean;
  onFavoriteChange?: () => void;
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
  showActions = false,
  showFavorites = true,
  showCompletion = true,
  onFavoriteChange
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setIsFavorited(favoritesService.isFavorited(session.id, user.id));
      setIsCompleted(completionService.isSessionCompletedToday(session.id, user.id));
    }
  }, [session.id, user]);

  const handleFavoriteToggle = () => {
    if (!user) return;
    
    const newFavStatus = favoritesService.toggleFavorite(session.id, user.id);
    setIsFavorited(newFavStatus);
    onFavoriteChange?.();
    
    toast({
      title: newFavStatus ? "Added to Favorites" : "Removed from Favorites",
      description: `"${session.title}" has been ${newFavStatus ? 'added to' : 'removed from'} your favorites.`
    });
  };

  const handleMarkComplete = () => {
    if (!user) return;
    
    completionService.markSessionComplete(session.id, user.id, session.duration);
    setIsCompleted(true);
    
    toast({
      title: "Session Completed!",
      description: `Great job completing "${session.title}"! You practiced for ${session.duration} minutes.`
    });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open video if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) return;
    
    if (session.videoUrl) {
      setIsVideoModalOpen(true);
    }
  };
  return (
    <>
      <Card 
        className={`card-gradient border-border/50 hover-lift wellness-transition group ${
          session.videoUrl ? 'cursor-pointer' : ''
        }`}
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          {session.videoUrl && (
            <div className="absolute top-4 right-4 z-10 bg-black/60 rounded-full p-2 opacity-0 group-hover:opacity-100 wellness-transition">
              <Play className="h-4 w-4 text-white fill-white" />
            </div>
          )}
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
          
          {/* Favorite Button */}
          {showFavorites && user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteToggle}
              className={`p-2 hover-lift wellness-transition ${
                isFavorited ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
          )}
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

        {/* Completion Button */}
        {showCompletion && user && !isCompleted && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkComplete}
            className="w-full mt-3 hover-lift wellness-transition"
          >
            <Check className="mr-2 h-4 w-4" />
            Mark as Completed
          </Button>
        )}

        {isCompleted && (
          <div className="flex items-center justify-center space-x-2 mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              Completed Today
            </span>
          </div>
        )}

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
    
    <VideoModal
      session={session}
      isOpen={isVideoModalOpen}
      onClose={() => setIsVideoModalOpen(false)}
    />
    </>
  );
};