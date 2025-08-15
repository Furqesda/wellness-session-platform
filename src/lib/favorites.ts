export interface FavoriteSession {
  sessionId: string;
  userId: string;
  favoritedAt: string;
}

const FAVORITES_STORAGE_KEY = 'wellness_favorites';

export const favoritesService = {
  getFavoritesByUser(userId: string): string[] {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const favorites: FavoriteSession[] = JSON.parse(stored);
        return favorites
          .filter(fav => fav.userId === userId)
          .map(fav => fav.sessionId);
      }
    } catch (error) {
      console.error('Error parsing favorites:', error);
    }
    return [];
  },

  toggleFavorite(sessionId: string, userId: string): boolean {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      let favorites: FavoriteSession[] = stored ? JSON.parse(stored) : [];
      
      const existingIndex = favorites.findIndex(
        fav => fav.sessionId === sessionId && fav.userId === userId
      );

      if (existingIndex >= 0) {
        // Remove favorite
        favorites.splice(existingIndex, 1);
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
        return false;
      } else {
        // Add favorite
        favorites.push({
          sessionId,
          userId,
          favoritedAt: new Date().toISOString()
        });
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  },

  isFavorited(sessionId: string, userId: string): boolean {
    const favorites = this.getFavoritesByUser(userId);
    return favorites.includes(sessionId);
  }
};