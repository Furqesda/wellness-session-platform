export interface UserProfile {
  userId: string;
  displayName: string;
  profilePicture?: string;
  emojiAvatar?: string;
  dateJoined: string;
  totalSessionsCreated: number;
}

const PROFILE_STORAGE_KEY = 'wellness_profiles';
const FIRST_LOGIN_KEY = 'wellness_first_login';
const TAKEN_AVATARS_KEY = 'wellness_taken_avatars';
const TAKEN_NAMES_KEY = 'wellness_taken_names';

export const AVAILABLE_EMOJIS = [
  '😊', '😌', '🧘', '🌱', '🌸', '🌺', '🌼', '🌻', '🌷', '🌹',
  '🦋', '🐝', '🌙', '⭐', '✨', '🌟', '💫', '🌈', '☀️', '🌞',
  '🎋', '🍃', '🌿', '🌾', '🪴', '🌳', '🌲', '🎍', '🌵', '🌴',
  '🧚', '🦄', '🐚', '🪨', '💎', '🔮', '🕯️', '🪔', '🧿', '🪬',
  '🎨', '🎭', '🎪', '🎠', '🎡', '🎢', '🎯', '🎲', '🧩', '🃏',
  '🎸', '🎹', '🎺', '🎻', '🥁', '🎤', '🎧', '🎵', '🎶', '🎼'
];

export const profileService = {
  getAllProfiles(): UserProfile[] {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing profiles:', error);
      return [];
    }
  },

  getUserProfile(userId: string): UserProfile | null {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) {
        const profiles: UserProfile[] = JSON.parse(stored);
        return profiles.find(profile => profile.userId === userId) || null;
      }
    } catch (error) {
      console.error('Error parsing profiles:', error);
    }
    return null;
  },

  createOrUpdateProfile(userId: string, updates: Partial<UserProfile>): UserProfile {
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      let profiles: UserProfile[] = stored ? JSON.parse(stored) : [];
      
      const existingIndex = profiles.findIndex(profile => profile.userId === userId);
      
      // Get or set first login date
      let dateJoined = updates.dateJoined;
      if (!dateJoined) {
        const firstLoginStored = localStorage.getItem(`${FIRST_LOGIN_KEY}_${userId}`);
        if (firstLoginStored) {
          dateJoined = firstLoginStored;
        } else {
          dateJoined = new Date().toISOString();
          localStorage.setItem(`${FIRST_LOGIN_KEY}_${userId}`, dateJoined);
        }
      }

      const profile: UserProfile = {
        userId,
        displayName: updates.displayName || 'Wellness User',
        profilePicture: updates.profilePicture,
        emojiAvatar: updates.emojiAvatar,
        dateJoined: dateJoined,
        totalSessionsCreated: updates.totalSessionsCreated || 0
      };

      if (existingIndex >= 0) {
        profiles[existingIndex] = { ...profiles[existingIndex], ...profile };
      } else {
        profiles.push(profile);
      }

      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles));
      return profiles[existingIndex >= 0 ? existingIndex : profiles.length - 1];
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        userId,
        displayName: 'Wellness User',
        dateJoined: new Date().toISOString(),
        totalSessionsCreated: 0
      };
    }
  },

  updateDisplayName(userId: string, displayName: string): void {
    const profile = this.getUserProfile(userId);
    if (profile) {
      this.createOrUpdateProfile(userId, { ...profile, displayName });
    }
  },

  updateProfilePicture(userId: string, profilePicture: string): void {
    const profile = this.getUserProfile(userId);
    if (profile) {
      this.createOrUpdateProfile(userId, { ...profile, profilePicture, emojiAvatar: undefined });
    }
  },

  updateEmojiAvatar(userId: string, emojiAvatar: string): boolean {
    if (this.isEmojiTaken(emojiAvatar)) {
      return false; // Emoji already taken
    }
    
    const profile = this.getUserProfile(userId);
    if (profile) {
      // Remove old emoji from taken list if exists
      if (profile.emojiAvatar) {
        this.releaseEmoji(profile.emojiAvatar);
      }
      
      // Mark new emoji as taken
      this.markEmojiAsTaken(emojiAvatar);
      
      this.createOrUpdateProfile(userId, { ...profile, emojiAvatar, profilePicture: undefined });
      return true;
    }
    return false;
  },

  isDisplayNameTaken(displayName: string, excludeUserId?: string): boolean {
    const profiles = this.getAllProfiles();
    return profiles.some(profile => 
      profile.displayName.toLowerCase() === displayName.toLowerCase() && 
      profile.userId !== excludeUserId
    );
  },

  isEmojiTaken(emoji: string): boolean {
    try {
      const taken = localStorage.getItem(TAKEN_AVATARS_KEY);
      const takenEmojis: string[] = taken ? JSON.parse(taken) : [];
      return takenEmojis.includes(emoji);
    } catch (error) {
      console.error('Error checking taken emojis:', error);
      return false;
    }
  },

  markEmojiAsTaken(emoji: string): void {
    try {
      const taken = localStorage.getItem(TAKEN_AVATARS_KEY);
      const takenEmojis: string[] = taken ? JSON.parse(taken) : [];
      if (!takenEmojis.includes(emoji)) {
        takenEmojis.push(emoji);
        localStorage.setItem(TAKEN_AVATARS_KEY, JSON.stringify(takenEmojis));
      }
    } catch (error) {
      console.error('Error marking emoji as taken:', error);
    }
  },

  releaseEmoji(emoji: string): void {
    try {
      const taken = localStorage.getItem(TAKEN_AVATARS_KEY);
      const takenEmojis: string[] = taken ? JSON.parse(taken) : [];
      const filteredEmojis = takenEmojis.filter(e => e !== emoji);
      localStorage.setItem(TAKEN_AVATARS_KEY, JSON.stringify(filteredEmojis));
    } catch (error) {
      console.error('Error releasing emoji:', error);
    }
  },

  getAvailableEmojis(): string[] {
    try {
      const taken = localStorage.getItem(TAKEN_AVATARS_KEY);
      const takenEmojis: string[] = taken ? JSON.parse(taken) : [];
      return AVAILABLE_EMOJIS.filter(emoji => !takenEmojis.includes(emoji));
    } catch (error) {
      console.error('Error getting available emojis:', error);
      return AVAILABLE_EMOJIS;
    }
  },

  // Initialize taken emojis from existing profiles
  initializeTakenEmojis(): void {
    const profiles = this.getAllProfiles();
    const takenEmojis = profiles
      .filter(p => p.emojiAvatar)
      .map(p => p.emojiAvatar!)
      .filter((emoji, index, arr) => arr.indexOf(emoji) === index); // Remove duplicates
    
    localStorage.setItem(TAKEN_AVATARS_KEY, JSON.stringify(takenEmojis));
  }
};