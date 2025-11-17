import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: 'user' | 'admin';
  subscription?: {
    plan: string;
    status: 'active' | 'inactive' | 'cancelled';
    nextBilling: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Base URL for API - configurable via Vite env VITE_API_BASE
  const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000';

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<true | string> => {
    // Check for hardcoded admin credentials first
    if (email === 'admin@gmail.com' && password === 'admin#123') {
      const adminUser: User = {
        id: 'admin-1',
        email: 'admin@gmail.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      localStorage.setItem('token', 'admin-token-' + Date.now());
      return true;
    }

    // Mock authentication for demo purposes
    const mockUsers = [
      { email: 'user@example.com', password: 'user123', role: 'user', firstName: 'John', lastName: 'Doe', id: '2' }
    ];

    const mockUser = mockUsers.find(u => u.email === email && u.password === password);
    if (mockUser) {
      const userObj: User = {
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role as 'user' | 'admin'
      };
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      localStorage.setItem('token', 'mock-token-' + Date.now());
      return true;
    }

    // If not mock user, try real API
    // Build list of candidate URLs to try so we can give a helpful error when
    // environment causes mixed-content or unreachable localhosts from hosted frontends.
    const primary = `${API_BASE.replace(/\/\/$/, '')}/api/login`;

    // If frontend is running as a remote HTTPS preview (not on localhost), prefer trying
    // same-origin /api first — the preview may proxy /api to the backend. Fall back to
    // configured API_BASE afterwards.
    const attempted: string[] = [];
    try {
      if (typeof window !== 'undefined' && window.location.protocol === 'https:' && window.location.hostname !== 'localhost') {
        attempted.push('/api/login');
      }
    } catch (e) {
      // ignore
    }
    // Always push primary as a fallback
    attempted.push(primary);

    let lastNetworkError: any = null;

    for (const url of attempted) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        // Try to parse body for error message if present
        let data: any = null;
        try { data = await res.json(); } catch (e) { data = null; }

        if (!res.ok) {
          const raw = data?.message || res.statusText || 'Login failed';
          const msg = typeof raw === 'string' ? raw : JSON.stringify(raw);
          // If preview attempted same-origin and got 404, don't treat it as final — try fallback URL(s)
          if (res.status === 404 && url.startsWith('/')) {
            const advice = 'API not found on this origin (404). Your remote preview likely does not proxy /api to your local backend.';
            console.warn('Preview 404 for', url, { msg, body: data });
            lastNetworkError = new Error(`Preview 404: ${msg}`);
            // continue to next attempted URL (fallback)
            continue;
          }
          console.error('Login failed:', msg, { url, body: data });
          return msg;
        }

        const userObj: User = {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          role: data.user.role
        };

        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
        if (data.token) localStorage.setItem('token', data.token);
        
        // Add user to DataContext users list if not exists
        try {
          const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
          const userExists = existingUsers.some((u: any) => u.id === userObj.id || u.email === userObj.email);
          if (!userExists) {
            const newUser = {
              id: userObj.id,
              email: userObj.email,
              firstName: userObj.firstName,
              lastName: userObj.lastName,
              role: userObj.role,
              status: 'active',
              lastLogin: new Date().toISOString(),
              createdAt: new Date().toISOString()
            };
            existingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));
          } else {
            // Update last login for existing user
            const updatedUsers = existingUsers.map((u: any) => 
              (u.id === userObj.id || u.email === userObj.email) 
                ? { ...u, lastLogin: new Date().toISOString() }
                : u
            );
            localStorage.setItem('users', JSON.stringify(updatedUsers));
          }
        } catch (e) {
          console.warn('Failed to sync user to DataContext:', e);
        }
        
        return true;
      } catch (error: any) {
        // Keep the last network error to include in the final message
        lastNetworkError = error;
        const emsg = error && (error.message || String(error));
        console.warn('Network request failed for', url, emsg);
        // try the next candidate URL
      }
    }

    // If we get here, all attempted requests failed due to network issues.
    // Provide a clear, actionable message so the developer can fix the connectivity issue.
    const attemptedStr = attempted.join(', ');
    console.error('Login network failure. Attempted URLs:', attemptedStr, 'Last error:', lastNetworkError);

    const isLikelyMixedContent = (API_BASE.startsWith('http://') && typeof window !== 'undefined' && window.location.protocol === 'https:');

    let advice = 'Could not reach the API. Ensure the backend is running and the frontend can reach it.';
    if (isLikelyMixedContent) {
      advice = 'Possible mixed-content: frontend is served over HTTPS but API_BASE uses http://. Either run the API on HTTPS, expose it via a secure tunnel (eg. ngrok) and set VITE_API_BASE to its https:// URL, or deploy the API to a reachable HTTPS host.';
    } else if (API_BASE.includes('localhost') || API_BASE.includes('127.0.0.1')) {
      advice = 'Frontend cannot reach a localhost backend from a remote preview. Run the backend publicly or use a tunnel (eg. ngrok) and set VITE_API_BASE to the tunnel URL.';
    }

    return `Network error: ${lastNetworkError?.message || lastNetworkError || 'Failed to fetch'}. Attempted: ${attemptedStr}. ${advice}`;
  };

  const register = async (userData: RegisterData): Promise<true | string> => {
    const primary = `${API_BASE.replace(/\/\/$/, '')}/api/signup`;
    const attempted: string[] = [];
    try {
      if (typeof window !== 'undefined' && window.location.protocol === 'https:' && window.location.hostname !== 'localhost') {
        attempted.push('/api/signup');
      }
    } catch (e) {
      // ignore
    }
    attempted.push(primary);

    let lastNetworkError: any = null;

    for (const url of attempted) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        let data: any = null;
        try { data = await res.json(); } catch (e) { data = null; }
        if (!res.ok) {
          const raw = data?.message || res.statusText || 'Registration failed';
          const msg = typeof raw === 'string' ? raw : JSON.stringify(raw);
          if (res.status === 404 && url.startsWith('/')) {
            console.warn('Preview 404 for', url, { msg, body: data });
            lastNetworkError = new Error(`Preview 404: ${msg}`);
            continue;
          }
          console.error('Registration failed:', msg, { url, body: data });
          return msg;
        }
        const userObj: User = {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          role: data.user.role
        };
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
        if (data.token) localStorage.setItem('token', data.token);
        
        // Add user to DataContext users list
        try {
          const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
          const userExists = existingUsers.some((u: any) => u.id === userObj.id || u.email === userObj.email);
          if (!userExists) {
            const newUser = {
              id: userObj.id,
              email: userObj.email,
              firstName: userObj.firstName,
              lastName: userObj.lastName,
              role: userObj.role,
              status: 'active',
              lastLogin: new Date().toISOString(),
              createdAt: new Date().toISOString()
            };
            existingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));
          }
        } catch (e) {
          console.warn('Failed to sync user to DataContext:', e);
        }
        
        return true;
      } catch (error: any) {
        lastNetworkError = error;
        const emsg = error && (error.message || String(error));
        console.warn('Network request failed for', url, emsg);
      }
    }

    const attemptedStr = attempted.join(', ');
    console.error('Registration network failure. Attempted URLs:', attemptedStr, 'Last error:', lastNetworkError);

    const isLikelyMixedContent = (API_BASE.startsWith('http://') && typeof window !== 'undefined' && window.location.protocol === 'https:');

    let advice = 'Could not reach the API. Ensure the backend is running and the frontend can reach it.';
    if (isLikelyMixedContent) {
      advice = 'Possible mixed-content: frontend is served over HTTPS but API_BASE uses http://. Either run the API on HTTPS, expose it via a secure tunnel (eg. ngrok) and set VITE_API_BASE to its https:// URL, or deploy the API to a reachable HTTPS host.';
    } else if (API_BASE.includes('localhost') || API_BASE.includes('127.0.0.1')) {
      advice = 'Frontend cannot reach a localhost backend from a remote preview. Run the backend publicly or use a tunnel (eg. ngrok) and set VITE_API_BASE to the tunnel URL.';
    }

    return `Network error: ${lastNetworkError?.message || lastNetworkError || 'Failed to fetch'}. Attempted: ${attemptedStr}. ${advice}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
