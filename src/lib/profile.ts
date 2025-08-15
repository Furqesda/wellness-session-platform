export interface UserProfile {
  userId: string;
  displayName: string;
  profilePicture?: string;
  dateJoined: string;
  totalSessionsCreated: number;
}

const PROFILE_STORAGE_KEY = 'wellness_profiles';
const FIRST_LOGIN_KEY = 'wellness_first_login';

export const profileService = {
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
      this.createOrUpdateProfile(userId, { ...profile, profilePicture });
    }
  }
};