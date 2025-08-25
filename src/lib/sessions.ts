import { supabase } from '@/integrations/supabase/client';

export interface WellnessSession {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: number; // in minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  videoUrl?: string;
  videoType: 'youtube' | 'custom';
  customVideoFile?: string;
  createdAt: string;
  userId?: string;
  isPublic?: boolean;
}

// Default public sessions available to everyone
const DEFAULT_PUBLIC_SESSIONS: WellnessSession[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: 'Start your day with peaceful mindfulness',
    type: 'Meditation',
    duration: 10,
    difficulty: 'Beginner',
    videoUrl: 'https://www.youtube.com/watch?v=inpok4MKVLM',
    videoType: 'youtube',
    isPublic: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Stress Relief Breathing',
    description: 'Quick breathing exercises for stress relief',
    type: 'Breathing',
    duration: 5,
    difficulty: 'Beginner',
    videoUrl: 'https://www.youtube.com/watch?v=tybOi4hjZFQ',
    videoType: 'youtube',
    isPublic: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Evening Relaxation',
    description: 'Unwind with this calming evening routine',
    type: 'Relaxation',
    duration: 15,
    difficulty: 'Intermediate',
    videoUrl: 'https://www.youtube.com/watch?v=1ZYbU82GVz4',
    videoType: 'youtube',
    isPublic: true,
    createdAt: new Date().toISOString()
  }
];

// Default user sessions for new users
const DEFAULT_USER_SESSIONS = [
  {
    title: 'My First Meditation',
    description: 'A gentle introduction to meditation practice',
    type: 'Meditation',
    duration: 8,
    difficulty: 'Beginner' as const,
    videoType: 'youtube' as const,
    isPublic: false
  },
  {
    title: 'Quick Stress Relief',
    description: 'A brief session for busy moments',
    type: 'Breathing',
    duration: 3,
    difficulty: 'Beginner' as const,
    videoType: 'youtube' as const,
    isPublic: false
  }
];

export const sessionsService = {
  async getPublicSessions(): Promise<WellnessSession[]> {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching public sessions:', error);
        return DEFAULT_PUBLIC_SESSIONS;
      }

      // If no public sessions in DB, return defaults
      if (!data || data.length === 0) {
        return DEFAULT_PUBLIC_SESSIONS;
      }

      return data.map(session => ({
        id: session.id,
        title: session.title,
        description: session.description || '',
        type: session.type,
        duration: session.duration,
        difficulty: session.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        videoUrl: session.video_url || '',
        videoType: session.video_type as 'youtube' | 'custom',
        customVideoFile: session.custom_video_file || '',
        createdAt: session.created_at,
        userId: session.user_id,
        isPublic: session.is_public
      }));
    } catch (error) {
      console.error('Error in getPublicSessions:', error);
      return DEFAULT_PUBLIC_SESSIONS;
    }
  },

  async getUserSessions(userId: string): Promise<WellnessSession[]> {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user sessions:', error);
        return [];
      }

      if (!data || data.length === 0) {
        // Create default sessions for new users
        const defaultSessions = await Promise.all(
          DEFAULT_USER_SESSIONS.map(session => 
            this.createSession({
              ...session,
              userId,
              isPublic: false
            })
          )
        );
        return defaultSessions;
      }

      return data.map(session => ({
        id: session.id,
        title: session.title,
        description: session.description || '',
        type: session.type,
        duration: session.duration,
        difficulty: session.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        videoUrl: session.video_url || '',
        videoType: session.video_type as 'youtube' | 'custom',
        customVideoFile: session.custom_video_file || '',
        createdAt: session.created_at,
        userId: session.user_id,
        isPublic: session.is_public
      }));
    } catch (error) {
      console.error('Error in getUserSessions:', error);
      return [];
    }
  },

  async createSession(session: Omit<WellnessSession, 'id' | 'createdAt'>): Promise<WellnessSession> {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          user_id: session.userId!,
          title: session.title,
          description: session.description,
          type: session.type,
          duration: session.duration,
          difficulty: session.difficulty,
          video_url: session.videoUrl,
          video_type: session.videoType,
          custom_video_file: session.customVideoFile,
          is_public: session.isPublic || false
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating session:', error);
        throw new Error('Failed to create session');
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        type: data.type,
        duration: data.duration,
        difficulty: data.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        videoUrl: data.video_url || '',
        videoType: data.video_type as 'youtube' | 'custom',
        customVideoFile: data.custom_video_file || '',
        createdAt: data.created_at,
        userId: data.user_id,
        isPublic: data.is_public
      };
    } catch (error) {
      console.error('Error in createSession:', error);
      throw error;
    }
  },

  async updateSession(sessionId: string, updates: Partial<WellnessSession>): Promise<WellnessSession | null> {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .update({
          title: updates.title,
          description: updates.description,
          type: updates.type,
          duration: updates.duration,
          difficulty: updates.difficulty,
          video_url: updates.videoUrl,
          video_type: updates.videoType,
          custom_video_file: updates.customVideoFile,
          is_public: updates.isPublic
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) {
        console.error('Error updating session:', error);
        return null;
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        type: data.type,
        duration: data.duration,
        difficulty: data.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        videoUrl: data.video_url || '',
        videoType: data.video_type as 'youtube' | 'custom',
        customVideoFile: data.custom_video_file || '',
        createdAt: data.created_at,
        userId: data.user_id,
        isPublic: data.is_public
      };
    } catch (error) {
      console.error('Error in updateSession:', error);
      return null;
    }
  },

  async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        console.error('Error deleting session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteSession:', error);
      return false;
    }
  },

  async getAllSessions(): Promise<WellnessSession[]> {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all sessions:', error);
        return [];
      }

      return data.map(session => ({
        id: session.id,
        title: session.title,
        description: session.description || '',
        type: session.type,
        duration: session.duration,
        difficulty: session.difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        videoUrl: session.video_url || '',
        videoType: session.video_type as 'youtube' | 'custom',
        customVideoFile: session.custom_video_file || '',
        createdAt: session.created_at,
        userId: session.user_id,
        isPublic: session.is_public
      }));
    } catch (error) {
      console.error('Error in getAllSessions:', error);
      return [];
    }
  }
};