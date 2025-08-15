import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { profileService, UserProfile } from '@/lib/profile';
import { completionService } from '@/lib/completion';
import { favoritesService } from '@/lib/favorites';
import { sessionsService } from '@/lib/sessions';
import { useToast } from '@/hooks/use-toast';
import { User, Calendar, Trophy, Heart, BookOpen, Edit } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');

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

  const loadProfile = () => {
    if (!user) return;
    
    let userProfile = profileService.getUserProfile(user.id);
    if (!userProfile) {
      // Create profile if it doesn't exist
      const userSessions = sessionsService.getUserSessions(user.id);
      userProfile = profileService.createOrUpdateProfile(user.id, {
        displayName: user.name,
        totalSessionsCreated: userSessions.length
      });
    }
    setProfile(userProfile);
    setEditDisplayName(userProfile.displayName);
  };

  const handleSaveProfile = () => {
    if (!user || !profile) return;
    
    profileService.updateDisplayName(user.id, editDisplayName);
    setProfile({ ...profile, displayName: editDisplayName });
    setIsEditModalOpen(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated."
    });
  };

  if (!isAuthenticated || !user || !profile) {
    return null;
  }

  const progress = completionService.getUserProgress(user.id);
  const favoriteCount = favoritesService.getFavoritesByUser(user.id).length;
  const userSessions = sessionsService.getUserSessions(user.id);

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="wellness-gradient p-4 rounded-2xl w-fit mx-auto mb-6">
            <User className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {profile.displayName}
          </h1>
          <p className="text-xl text-muted-foreground">
            Member since {new Date(profile.dateJoined).toLocaleDateString()}
          </p>
        </div>

        {/* Profile Info Card */}
        <Card className="card-gradient border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Profile Information</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                className="hover-lift wellness-transition"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
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
                  {new Date(profile.dateJoined).toLocaleDateString('en-US', {
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-gradient border-border/50 text-center">
            <CardHeader className="pb-3">
              <div className="wellness-gradient p-3 rounded-xl w-fit mx-auto">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-sm font-medium">Sessions Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{userSessions.length}</div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-border/50 text-center">
            <CardHeader className="pb-3">
              <div className="wellness-gradient p-3 rounded-xl w-fit mx-auto">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{progress.totalCompletedSessions}</div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-border/50 text-center">
            <CardHeader className="pb-3">
              <div className="wellness-gradient p-3 rounded-xl w-fit mx-auto">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-sm font-medium">Minutes Practiced</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{progress.totalMinutesPracticed}</div>
            </CardContent>
          </Card>

          <Card className="card-gradient border-border/50 text-center">
            <CardHeader className="pb-3">
              <div className="wellness-gradient p-3 rounded-xl w-fit mx-auto">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-sm font-medium">Favorite Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{favoriteCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  className="wellness-gradient border-0"
                  disabled={!editDisplayName.trim()}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;