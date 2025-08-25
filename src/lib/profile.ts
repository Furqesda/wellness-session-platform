import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  displayName: string;
  avatarType: 'emoji' | 'image';
  avatarValue: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  sessionsCreated: number;
  completedSessions: number;
  minutesPracticed: number;
  favoriteSessions: number;
}

// Available emojis for avatar selection
export const AVAILABLE_EMOJIS = [
  '😊', '😎', '🤗', '😄', '😆', '😉', '🙂', '😊', '😇', '🤩',
  '😍', '🥰', '😘', '😗', '😙', '😚', '🤪', '😜', '😝', '🤭',
  '🧐', '🤓', '😏', '😒', '🙄', '😬', '🤥', '😶', '😐', '😑',
  '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '🧚‍♂️', '🧚‍♀️', '🧛‍♂️', '🧛‍♀️', '🧜‍♂️', '🧜‍♀️',
  '🎯', '🎪', '🎨', '🎭', '🎪', '🎵', '🎶', '🎸', '🎹', '🎺',
  '🌟', '⭐', '✨', '💫', '🌙', '☀️', '🌈', '🔥', '⚡', '💎',
  '🍀', '🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🦋', '🐝', '🐞'
];

export const profileService = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.user_id,
        displayName: data.display_name || 'User',
        avatarType: (data.avatar_type as 'emoji' | 'image') || 'emoji',
        avatarValue: data.avatar_value || '😊',
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  async createOrUpdateProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: userId,
          display_name: profileData.displayName,
          avatar_type: profileData.avatarType,
          avatar_value: profileData.avatarValue
        })
        .select()
        .single();

      if (error) {
        throw new Error('Failed to update profile');
      }

      return {
        id: data.user_id,
        displayName: data.display_name || 'User',
        avatarType: (data.avatar_type as 'emoji' | 'image') || 'emoji',
        avatarValue: data.avatar_value || '😊',
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async isDisplayNameTaken(displayName: string, currentUserId?: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id')
        .ilike('display_name', displayName);

      if (error) {
        console.error('Error checking display name:', error);
        return false;
      }

      return data.some(profile => profile.user_id !== currentUserId);
    } catch (error) {
      console.error('Error in isDisplayNameTaken:', error);
      return false;
    }
  },

  async isEmojiTaken(emoji: string, currentUserId?: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id')
        .eq('avatar_type', 'emoji')
        .eq('avatar_value', emoji);

      if (error) {
        console.error('Error checking emoji:', error);
        return false;
      }

      return data.some(profile => profile.user_id !== currentUserId);
    } catch (error) {
      console.error('Error in isEmojiTaken:', error);
      return false;
    }
  },

  async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Get sessions created count
      const { count: sessionsCreated } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get completed sessions count
      const { count: completedSessions } = await supabase
        .from('progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get total minutes practiced
      const { data: progressData } = await supabase
        .from('progress')
        .select('duration_minutes')
        .eq('user_id', userId);

      const minutesPracticed = progressData?.reduce((total, record) => 
        total + (record.duration_minutes || 0), 0) || 0;

      // Get favorite sessions count
      const { count: favoriteSessions } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      return {
        sessionsCreated: sessionsCreated || 0,
        completedSessions: completedSessions || 0,
        minutesPracticed,
        favoriteSessions: favoriteSessions || 0
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        sessionsCreated: 0,
        completedSessions: 0,
        minutesPracticed: 0,
        favoriteSessions: 0
      };
    }
  }
};