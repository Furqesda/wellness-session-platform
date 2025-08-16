import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WellnessSession } from '@/lib/sessions';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  if (!session || !session.videoUrl) return null;

  const embedUrl = getYouTubeEmbedUrl(session.videoUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0 bg-card border-border/50 wellness-transition">
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
        
        <div className="flex-1 p-6 pt-0">
          {embedUrl ? (
            <div className="relative w-full h-full min-h-[400px] bg-black rounded-lg overflow-hidden">
              <iframe
                src={embedUrl}
                title={session.title}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
              <p className="text-muted-foreground">Video not available</p>
            </div>
          )}
          
          <div className="mt-4 space-y-2">
            <p className="text-sm text-muted-foreground">{session.description}</p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>{session.duration} minutes</span>
              {session.instructor && <span>Instructor: {session.instructor}</span>}
              <span className="capitalize">{session.difficulty}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};