import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WellnessSession } from '@/lib/sessions';
import { X, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { completionService } from '@/lib/completion';
import { useToast } from '@/hooks/use-toast';

interface VideoModalProps {
  session: WellnessSession | null;
  isOpen: boolean;
  onClose: () => void;
}

const getYouTubeEmbedUrl = (url: string): string => {
  const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1` : '';
};

export const VideoModal: React.FC<VideoModalProps> = ({ session, isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (user && session) {
      setIsCompleted(completionService.isSessionCompletedToday(session.id, user.id));
    }
  }, [session, user]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && elapsedTime < session?.duration * 60) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, elapsedTime, session?.duration]);

  const handleMarkComplete = () => {
    if (!user || !session) return;
    
    completionService.markSessionComplete(session.id, user.id, session.duration);
    setIsCompleted(true);
    
    toast({
      title: "Session Completed!",
      description: `Great job completing "${session.title}"! You practiced for ${session.duration} minutes.`
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session || !session.videoUrl) return null;

  const embedUrl = getYouTubeEmbedUrl(session.videoUrl);
  const totalSeconds = session.duration * 60;
  const progress = Math.min((elapsedTime / totalSeconds) * 100, 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[85vh] p-0 bg-card border-border/50 wellness-transition">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-foreground">
              {session.title}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-muted wellness-transition"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 p-6 pt-0 space-y-4">
          {/* Video Player */}
          {embedUrl ? (
            <div className="relative w-full h-[50vh] bg-black rounded-lg overflow-hidden">
              <iframe
                src={embedUrl}
                title={session.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setIsPlaying(true)}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
              <p className="text-muted-foreground">Video not available</p>
            </div>
          )}

          {/* Timer and Progress */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {formatTime(elapsedTime)} / {formatTime(totalSeconds)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round(progress)}% complete
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full wellness-transition"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Session Details */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {session.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>{session.duration} minutes</span>
                {session.instructor && <span>Instructor: {session.instructor}</span>}
                <span className="capitalize">{session.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Completion Button */}
          {user && !isCompleted && (
            <Button
              onClick={handleMarkComplete}
              className="w-full hover-lift wellness-transition"
              size="lg"
            >
              <Check className="mr-2 h-4 w-4" />
              Mark as Completed
            </Button>
          )}

          {isCompleted && (
            <div className="flex items-center justify-center space-x-2 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                Session Completed Today!
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};