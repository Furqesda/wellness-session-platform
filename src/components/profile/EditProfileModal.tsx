import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { profileService, UserProfile, AVAILABLE_EMOJIS } from '@/lib/profile';
import { useToast } from '@/hooks/use-toast';
import { Upload, User, Smile, AlertCircle } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onProfileUpdate: (updatedProfile: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onProfileUpdate
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [avatarType, setAvatarType] = useState<'emoji' | 'custom'>(
    profile.emojiAvatar ? 'emoji' : 'custom'
  );
  const [selectedEmoji, setSelectedEmoji] = useState(profile.emojiAvatar || '');
  const [customImage, setCustomImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(profile.profilePicture || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const availableEmojis = profileService.getAvailableEmojis();
  // Add current user's emoji back to available list if they have one
  const currentUserEmojis = profile.emojiAvatar && !availableEmojis.includes(profile.emojiAvatar) 
    ? [profile.emojiAvatar, ...availableEmojis] 
    : availableEmojis;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }

      setCustomImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
        setErrors(prev => ({ ...prev, image: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validate display name
    if (!displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (profileService.isDisplayNameTaken(displayName.trim(), profile.userId)) {
      newErrors.displayName = 'This display name is already in use. Please choose a different one.';
    }

    // Validate avatar selection
    if (avatarType === 'emoji') {
      if (!selectedEmoji) {
        newErrors.avatar = 'Please select an emoji avatar';
      } else if (selectedEmoji !== profile.emojiAvatar && profileService.isEmojiTaken(selectedEmoji)) {
        newErrors.avatar = 'This emoji is already taken by another user';
      }
    } else {
      if (!customImage && !imagePreview) {
        newErrors.avatar = 'Please upload a profile picture or select an emoji avatar';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      let updatedProfile: UserProfile = {
        ...profile,
        displayName: displayName.trim()
      };

      if (avatarType === 'emoji') {
        const success = profileService.updateEmojiAvatar(profile.userId, selectedEmoji);
        if (!success) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Selected emoji is no longer available. Please choose another."
          });
          return;
        }
        updatedProfile = {
          ...updatedProfile,
          emojiAvatar: selectedEmoji,
          profilePicture: undefined
        };
      } else {
        if (customImage) {
          // In a real app, you'd upload to a server. Here we'll use a data URL
          updatedProfile = {
            ...updatedProfile,
            profilePicture: imagePreview,
            emojiAvatar: undefined
          };
        }
        
        // Release old emoji if switching from emoji to custom
        if (profile.emojiAvatar) {
          profileService.releaseEmoji(profile.emojiAvatar);
        }
        
        profileService.createOrUpdateProfile(profile.userId, updatedProfile);
      }

      onProfileUpdate(updatedProfile);
      onClose();
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again."
      });
    }
  };

  const handleClose = () => {
    setDisplayName(profile.displayName);
    setAvatarType(profile.emojiAvatar ? 'emoji' : 'custom');
    setSelectedEmoji(profile.emojiAvatar || '');
    setImagePreview(profile.profilePicture || '');
    setCustomImage(null);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[75vh] pr-4">
          <div className="space-y-6">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                className={errors.displayName ? "border-destructive" : ""}
              />
              {errors.displayName && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.displayName}
                </p>
              )}
            </div>

            {/* Avatar Selection */}
            <div className="space-y-4">
              <Label>Profile Avatar</Label>
              <RadioGroup value={avatarType} onValueChange={(value: 'emoji' | 'custom') => setAvatarType(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="emoji" id="emoji" />
                  <Label htmlFor="emoji" className="flex items-center gap-2 cursor-pointer">
                    <Smile className="h-4 w-4" />
                    Select Emoji Avatar
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom" className="flex items-center gap-2 cursor-pointer">
                    <Upload className="h-4 w-4" />
                    Upload Custom Picture
                  </Label>
                </div>
              </RadioGroup>
              
              {errors.avatar && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.avatar}
                </p>
              )}
            </div>

            {/* Emoji Selection */}
            {avatarType === 'emoji' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Choose an Emoji</Label>
                      <Badge variant="outline">
                        {currentUserEmojis.length} available
                      </Badge>
                    </div>
                    <div className="grid grid-cols-8 md:grid-cols-12 gap-2 max-h-32 overflow-y-auto">
                      {currentUserEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setSelectedEmoji(emoji)}
                          className={`p-2 text-2xl rounded-lg transition-all hover:bg-muted hover:scale-110 ${
                            selectedEmoji === emoji 
                              ? 'bg-primary text-primary-foreground' 
                              : 'hover:bg-muted'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                    {currentUserEmojis.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No emojis available. All emojis are currently taken by other users.
                      </p>
                    )}
                    {selectedEmoji && (
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <span className="text-2xl">{selectedEmoji}</span>
                        <span className="text-sm text-muted-foreground">Selected avatar</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Custom Image Upload */}
            {avatarType === 'custom' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Choose Image File
                      </Button>
                    </div>
                    
                    {errors.image && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.image}
                      </p>
                    )}
                    
                    {imagePreview && (
                      <div className="flex justify-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border">
                          <img
                            src={imagePreview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="wellness-gradient border-0">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};