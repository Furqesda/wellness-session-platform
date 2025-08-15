import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionCard } from '@/components/sessions/SessionCard';
import { sessionsService, WellnessSession } from '@/lib/sessions';
import { favoritesService } from '@/lib/favorites';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MyFavorites = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [favoriteSessions, setFavoriteSessions] = useState<WellnessSession[]>([]);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = () => {
    if (!user) return;
    
    const favoriteIds = favoritesService.getFavoritesByUser(user.id);
    const allSessions = [...sessionsService.getPublicSessions(), ...sessionsService.getUserSessions(user.id)];
    const favorites = allSessions.filter(session => favoriteIds.includes(session.id));
    setFavoriteSessions(favorites);
  };

  const handleFavoriteChange = () => {
    loadFavorites(); // Reload favorites when one is toggled
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="wellness-gradient p-4 rounded-2xl w-fit mx-auto mb-6">
            <Heart className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            My Favorite Sessions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your collection of favorited wellness sessions. These are the practices that resonate with you most.
          </p>
        </div>

        {/* Stats */}
        <div className="bg-card card-gradient border-border/50 rounded-2xl p-6 mb-8 text-center">
          <div className="wellness-gradient p-3 rounded-xl w-fit mx-auto mb-3">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-foreground">{favoriteSessions.length}</div>
          <div className="text-sm text-muted-foreground">Favorite Sessions</div>
        </div>

        {/* Favorites Grid */}
        {favoriteSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                showActions={false}
                showFavorites={true}
                showCompletion={true}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="wellness-gradient p-4 rounded-2xl w-fit mx-auto mb-6">
              <Heart className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              No Favorites Yet
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              You haven't favorited any sessions yet. Browse our collection and click the heart icon 
              to save sessions you love.
            </p>
            <Button 
              onClick={() => navigate('/browse')}
              className="wellness-gradient border-0 hover-lift wellness-transition"
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Browse Sessions
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFavorites;