import { supabase } from '@/integrations/supabase/client';

export interface UserProgress {
  totalCompletedSessions: number;
  totalMinutesPracticed: number;
  currentStreak: number;
  lastCompletionDate: string | null;
}

export const completionService = {
  async markSessionCompleted(userId: string, sessionId: string, duration: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: userId,
          session_id: sessionId,
          duration_minutes: duration
        });

      if (error) {
        console.error('Error marking session completed:', error);
        throw new Error('Failed to mark session as completed');
      }
    } catch (error) {
      console.error('Error in markSessionCompleted:', error);
      throw error;
    }
  },

  async isSessionCompleted(userId: string, sessionId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('progress')
        .select('id')
        .eq('user_id', userId)
        .eq('session_id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking session completion:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in isSessionCompleted:', error);
      return false;
    }
  },

  async getUserProgress(userId: string): Promise<Record<string, { completedAt: string; duration: number }>> {
    try {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user progress:', error);
        return {};
      }

      const progress: Record<string, { completedAt: string; duration: number }> = {};
      data.forEach(record => {
        progress[record.session_id] = {
          completedAt: record.completed_at,
          duration: record.duration_minutes
        };
      });

      return progress;
    } catch (error) {
      console.error('Error in getUserProgress:', error);
      return {};
    }
  }
};