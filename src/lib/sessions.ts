export interface WellnessSession {
  id: string;
  title: string;
  description: string;
  type: 'meditation' | 'yoga' | 'mindfulness' | 'breathing';
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructor?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
}

const SESSIONS_STORAGE_KEY = 'wellness_sessions';
const PUBLIC_SESSIONS_STORAGE_KEY = 'wellness_public_sessions';

// Mock public sessions available to everyone
const DEFAULT_PUBLIC_SESSIONS: WellnessSession[] = [
  {
    id: '1',
    title: 'Morning Mindfulness',
    description: 'Start your day with peaceful awareness and gentle breathing exercises.',
    type: 'mindfulness',
    duration: 10,
    difficulty: 'beginner',
    instructor: 'Sarah Chen',
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Deep Breathing for Stress Relief',
    description: 'Calm your mind and reduce stress with guided breathing techniques.',
    type: 'breathing',
    duration: 15,
    difficulty: 'beginner',
    instructor: 'Marcus Thompson',
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Gentle Yoga Flow',
    description: 'A soothing yoga sequence perfect for relaxation and flexibility.',
    type: 'yoga',
    duration: 30,
    difficulty: 'intermediate',
    instructor: 'Lila Patel',
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Evening Meditation',
    description: 'Wind down with this calming meditation to prepare for restful sleep.',
    type: 'meditation',
    duration: 20,
    difficulty: 'beginner',
    instructor: 'David Kim',
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Advanced Mindful Walking',
    description: 'Combine movement with mindfulness in this walking meditation practice.',
    type: 'mindfulness',
    duration: 25,
    difficulty: 'advanced',
    instructor: 'Emma Rodriguez',
    isPublic: true,
    createdBy: 'system',
    createdAt: new Date().toISOString()
  }
];

// Mock user sessions (pre-populated for first-time users)
const DEFAULT_USER_SESSIONS: WellnessSession[] = [
  {
    id: 'user-1',
    title: 'My Personal Breathing Practice',
    description: 'A customized breathing exercise I created for daily stress management.',
    type: 'breathing',
    duration: 12,
    difficulty: 'beginner',
    isPublic: false,
    createdBy: 'user',
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: 'user-2',
    title: 'Quick Mindfulness Check-in',
    description: 'A brief mindfulness session for busy days when I need to center myself.',
    type: 'mindfulness',
    duration: 5,
    difficulty: 'beginner',
    isPublic: false,
    createdBy: 'user',
    createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  }
];

export const sessionsService = {
  getPublicSessions(): WellnessSession[] {
    try {
      const stored = localStorage.getItem(PUBLIC_SESSIONS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error parsing public sessions:', error);
    }
    
    // Initialize with default sessions
    localStorage.setItem(PUBLIC_SESSIONS_STORAGE_KEY, JSON.stringify(DEFAULT_PUBLIC_SESSIONS));
    return DEFAULT_PUBLIC_SESSIONS;
  },

  getUserSessions(userId: string): WellnessSession[] {
    try {
      const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
      if (stored) {
        const allSessions = JSON.parse(stored);
        return allSessions.filter((session: WellnessSession) => session.createdBy === userId);
      }
    } catch (error) {
      console.error('Error parsing user sessions:', error);
    }
    
    // Initialize with default user sessions for first-time users
    const userSessions = DEFAULT_USER_SESSIONS.map(session => ({
      ...session,
      createdBy: userId
    }));
    
    this.saveSessions(userSessions);
    return userSessions;
  },

  createSession(session: Omit<WellnessSession, 'id' | 'createdAt'>): WellnessSession {
    const newSession: WellnessSession = {
      ...session,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };

    const existingSessions = this.getAllSessions();
    existingSessions.push(newSession);
    this.saveSessions(existingSessions);

    return newSession;
  },

  updateSession(sessionId: string, updates: Partial<WellnessSession>): WellnessSession | null {
    const sessions = this.getAllSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) return null;

    sessions[sessionIndex] = { ...sessions[sessionIndex], ...updates };
    this.saveSessions(sessions);
    
    return sessions[sessionIndex];
  },

  deleteSession(sessionId: string): boolean {
    const sessions = this.getAllSessions();
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    
    if (filteredSessions.length === sessions.length) return false;
    
    this.saveSessions(filteredSessions);
    return true;
  },

  getAllSessions(): WellnessSession[] {
    try {
      const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error parsing sessions:', error);
      return [];
    }
  },

  saveSessions(sessions: WellnessSession[]): void {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  }
};