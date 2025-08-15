import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SessionCard } from '@/components/sessions/SessionCard';
import { CreateSessionForm } from '@/components/sessions/CreateSessionForm';
import { ProgressStats } from '@/components/progress/ProgressStats';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { sessionsService, WellnessSession } from '@/lib/sessions';
import { completionService } from '@/lib/completion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, BookOpen, Heart } from 'lucide-react';

const MySessions = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<WellnessSession[]>([]);
  const [editingSession, setEditingSession] = useState<WellnessSession | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userProgress, setUserProgress] = useState(completionService.getUserProgress(''));

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      const userSessions = sessionsService.getUserSessions(user.id);
      setSessions(userSessions);
      setUserProgress(completionService.getUserProgress(user.id));
    }
  }, [user]);

  const handleEdit = (session: WellnessSession) => {
    setEditingSession(session);
    setShowEditModal(true);
  };

  const handleDelete = (sessionId: string) => {
    const success = sessionsService.deleteSession(sessionId);
    if (success) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      toast({
        title: "Session Deleted",
        description: "Your session has been successfully deleted."
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete session. Please try again."
      });
    }
  };

  const handleUpdateSession = async (sessionData: Omit<WellnessSession, 'id' | 'createdAt'>) => {
    if (!editingSession || !user) return;

    try {
      const updatedSession = sessionsService.updateSession(editingSession.id, sessionData);
      if (updatedSession) {
        setSessions(prev => 
          prev.map(s => s.id === editingSession.id ? updatedSession : s)
        );
        toast({
          title: "Session Updated!",
          description: `Your session "${updatedSession.title}" has been updated successfully.`
        });
        setShowEditModal(false);
        setEditingSession(null);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update session. Please try again."
      });
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              My Wellness Sessions
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your personal collection of wellness practices and sessions.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/create')}
            className="wellness-gradient border-0 hover-lift wellness-transition mt-4 sm:mt-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Session
          </Button>
        </div>

        {/* Progress Stats */}
        <ProgressStats progress={userProgress} />

        {/* Sessions Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card card-gradient border-border/50 rounded-2xl p-6 text-center">
            <div className="wellness-gradient p-3 rounded-xl w-fit mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-foreground">{sessions.length}</div>
            <div className="text-sm text-muted-foreground">Created Sessions</div>
          </div>
          
          <div className="bg-card card-gradient border-border/50 rounded-2xl p-6 text-center">
            <div className="wellness-gradient p-3 rounded-xl w-fit mx-auto mb-3">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {sessions.filter(s => s.isPublic).length}
            </div>
            <div className="text-sm text-muted-foreground">Public Sessions</div>
          </div>
          
          <div className="bg-card card-gradient border-border/50 rounded-2xl p-6 text-center">
            <div className="wellness-gradient p-3 rounded-xl w-fit mx-auto mb-3">
              <div className="h-6 w-6 text-white flex items-center justify-center font-bold">∑</div>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {sessions.reduce((total, session) => total + session.duration, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Session Duration</div>
          </div>
        </div>

        {/* Sessions Grid */}
        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onEdit={handleEdit}
                onDelete={handleDelete}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="wellness-gradient p-4 rounded-2xl w-fit mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              No Sessions Yet
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              You haven't created any wellness sessions yet. Start by creating your first session 
              to begin building your personal wellness library.
            </p>
            <Button 
              onClick={() => navigate('/create')}
              className="wellness-gradient border-0 hover-lift wellness-transition"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Session
            </Button>
          </div>
        )}

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Session</DialogTitle>
            </DialogHeader>
            {editingSession && (
              <CreateSessionForm
                onSubmit={handleUpdateSession}
                initialData={editingSession}
                isEditing={true}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MySessions;