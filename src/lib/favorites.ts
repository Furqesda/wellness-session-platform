import { supabase } from '@/integrations/supabase/client';

export const favoritesService = {
  async getFavorites(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('session_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching favorites:', error);
        return [];
      }

      return data.map(fav => fav.session_id);
    } catch (error) {
      console.error('Error in getFavorites:', error);
      return [];
    }
  },

  async addFavorite(userId: string, sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: userId,
          session_id: sessionId
        });

      if (error) {
        console.error('Error adding favorite:', error);
        throw new Error('Failed to add favorite');
      }
    } catch (error) {
      console.error('Error in addFavorite:', error);
      throw error;
    }
  },

  async removeFavorite(userId: string, sessionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('session_id', sessionId);

      if (error) {
        console.error('Error removing favorite:', error);
        throw new Error('Failed to remove favorite');
      }
    } catch (error) {
      console.error('Error in removeFavorite:', error);
      throw error;
    }
  },

  async isFavorite(userId: string, sessionId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('session_id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking favorite:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error in isFavorite:', error);
      return false;
    }
  },

  async toggleFavorite(userId: string, sessionId: string): Promise<boolean> {
    try {
      const isFav = await this.isFavorite(userId, sessionId);
      
      if (isFav) {
        await this.removeFavorite(userId, sessionId);
        return false;
      } else {
        await this.addFavorite(userId, sessionId);
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }
};