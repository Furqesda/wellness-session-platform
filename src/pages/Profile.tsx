import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { profileService, UserProfile } from '@/lib/profile';
import { completionService } from '@/lib/completion';
import { favoritesService } from '@/lib/favorites';
import { sessionsService } from '@/lib/sessions';
import { useToast } from '@/hooks/use-toast';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { User, Calendar, Trophy, Heart, BookOpen, Edit, Target, TrendingUp } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      let userProfile = await profileService.getUserProfile(user.id);
      if (!userProfile) {
        // Create profile if it doesn't exist
        userProfile = await profileService.createOrUpdateProfile(user.id, {
          displayName: user.email?.split('@')[0] || 'User'
        });
      }
      setProfile(userProfile);

      // Load stats
      const userStats = await profileService.getUserStats(user.id);
      setStats(userStats);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  const renderAvatar = () => {
    if (profile?.avatarType === 'emoji' && profile.avatarValue) {
      return (
        <div className="wellness-gradient p-4 rounded-2xl w-fit mx-auto mb-6 text-4xl">
          {profile.avatarValue}
        </div>
      );
    } else if (profile?.avatarType === 'image' && profile.avatarValue) {
      return (
        <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-6 border-4 border-primary/20">
          <img
            src={profile.avatarValue}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      );
    } else {
      return (
        <div className="wellness-gradient p-4 rounded-2xl w-fit mx-auto mb-6">
          <User className="h-12 w-12 text-white" />
        </div>
      );
    }
  };

  if (!isAuthenticated || !user || !profile || !stats) {
    return null;
  }

  // Calculate progress percentages for visual representation
  const maxSessions = Math.max(stats.sessionsCreated, 10);
  const maxCompletedSessions = Math.max(stats.completedSessions, 10);
  const maxMinutes = Math.max(stats.minutesPracticed, 60);
  const maxFavorites = Math.max(stats.favoriteSessions, 5);

  const statsCards = [
    {
      title: 'Sessions Created',
      value: stats.sessionsCreated,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      progress: Math.min((stats.sessionsCreated / maxSessions) * 100, 100),
      description: `${stats.sessionsCreated} wellness sessions shared`
    },
    {
      title: 'Completed Sessions',
      value: stats.completedSessions,
      icon: Trophy,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      progress: Math.min((stats.completedSessions / maxCompletedSessions) * 100, 100),
      description: `${stats.completedSessions} sessions completed`
    },
    {
      title: 'Minutes Practiced',
      value: stats.minutesPracticed,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      progress: Math.min((stats.minutesPracticed / maxMinutes) * 100, 100),
      description: `${Math.floor(stats.minutesPracticed / 60)}h ${stats.minutesPracticed % 60}m total`
    },
    {
      title: 'Favorite Sessions',
      value: stats.favoriteSessions,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      progress: Math.min((stats.favoriteSessions / maxFavorites) * 100, 100),
      description: `${stats.favoriteSessions} sessions in favorites`
    }
  ];

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          {renderAvatar()}
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl font-bold text-foreground">
              {profile.displayName}
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="hover-lift wellness-transition"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xl text-muted-foreground">
            Member since {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Motivational Message */}
        {stats.completedSessions === 0 && (
          <Card className="card-gradient border-border/50 mb-8 text-center">
            <CardContent className="pt-6">
              <div className="wellness-gradient p-3 rounded-xl w-fit mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Ready to Begin Your Wellness Journey?
              </h3>
              <p className="text-muted-foreground mb-4">
                Take the first step on your wellness journey – choose a session to begin!
              </p>
              <Button
                onClick={() => navigate('/browse')}
                className="wellness-gradient border-0 hover-lift wellness-transition"
              >
                Browse Sessions
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Statistics Dashboard */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Your Wellness Stats</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="card-gradient border-border/50 hover-lift wellness-transition">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`${stat.bgColor} p-3 rounded-xl w-fit`}>
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(stat.progress)}%
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold">{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    </div>
                    <Progress value={stat.progress} className="h-2" />
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Profile Info Card */}
        <Card className="card-gradient border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Display Name</Label>
                <p className="text-lg font-semibold text-foreground">{profile.displayName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <p className="text-lg font-semibold text-foreground">{user.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date Joined</Label>
                <p className="text-lg font-semibold text-foreground">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
                <p className="text-sm font-mono text-muted-foreground">{user.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Modal */}
        {profile && (
          <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;