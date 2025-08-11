interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const AUTH_STORAGE_KEY = 'wellness_auth';

export const authService = {
  getAuthState(): AuthState {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          user: parsed.user,
          isAuthenticated: !!parsed.user
        };
      }
    } catch (error) {
      console.error('Error parsing auth state:', error);
    }
    return { user: null, isAuthenticated: false };
  },

  login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    // Mock authentication - accept any email/password
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0] // Use email prefix as name
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user }));
    return { success: true, user };
  },

  signup(email: string, password: string, name: string): { success: boolean; user?: User; error?: string } {
    // Mock signup - accept any email/password/name
    if (!email || !password || !name) {
      return { success: false, error: 'All fields are required' };
    }

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user }));
    return { success: true, user };
  },

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};