export interface CompletedSession {
  sessionId: string;
  userId: string;
  completedAt: string;
  duration: number; // minutes practiced
}

export interface UserProgress {
  totalCompletedSessions: number;
  totalMinutesPracticed: number;
  currentStreak: number;
  lastCompletionDate: string | null;
}

const COMPLETIONS_STORAGE_KEY = 'wellness_completions';

export const completionService = {
  getCompletionsByUser(userId: string): CompletedSession[] {
    try {
      const stored = localStorage.getItem(COMPLETIONS_STORAGE_KEY);
      if (stored) {
        const completions: CompletedSession[] = JSON.parse(stored);
        return completions.filter(comp => comp.userId === userId);
      }
    } catch (error) {
      console.error('Error parsing completions:', error);
    }
    return [];
  },

  markSessionComplete(sessionId: string, userId: string, duration: number): void {
    try {
      const stored = localStorage.getItem(COMPLETIONS_STORAGE_KEY);
      let completions: CompletedSession[] = stored ? JSON.parse(stored) : [];
      
      completions.push({
        sessionId,
        userId,
        completedAt: new Date().toISOString(),
        duration
      });

      localStorage.setItem(COMPLETIONS_STORAGE_KEY, JSON.stringify(completions));
    } catch (error) {
      console.error('Error marking session complete:', error);
    }
  },

  getUserProgress(userId: string): UserProgress {
    const completions = this.getCompletionsByUser(userId);
    
    const totalCompletedSessions = completions.length;
    const totalMinutesPracticed = completions.reduce((sum, comp) => sum + comp.duration, 0);
    
    // Calculate current streak
    let currentStreak = 0;
    let lastCompletionDate: string | null = null;

    if (completions.length > 0) {
      // Sort by completion date (newest first)
      const sortedCompletions = completions
        .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
      
      lastCompletionDate = sortedCompletions[0].completedAt;
      
      // Group completions by date
      const completionsByDate = new Map<string, CompletedSession[]>();
      sortedCompletions.forEach(comp => {
        const date = new Date(comp.completedAt).toDateString();
        if (!completionsByDate.has(date)) {
          completionsByDate.set(date, []);
        }
        completionsByDate.get(date)!.push(comp);
      });

      // Calculate streak from today backwards
      const today = new Date();
      let checkDate = new Date(today);
      
      while (true) {
        const dateStr = checkDate.toDateString();
        if (completionsByDate.has(dateStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          // If it's today and no completion, that's okay for streak
          if (checkDate.toDateString() === today.toDateString()) {
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
          }
          break;
        }
      }
    }

    return {
      totalCompletedSessions,
      totalMinutesPracticed,
      currentStreak,
      lastCompletionDate
    };
  },

  isSessionCompletedToday(sessionId: string, userId: string): boolean {
    const completions = this.getCompletionsByUser(userId);
    const today = new Date().toDateString();
    
    return completions.some(comp => 
      comp.sessionId === sessionId && 
      new Date(comp.completedAt).toDateString() === today
    );
  }
};