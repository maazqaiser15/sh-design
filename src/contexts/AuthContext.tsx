import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Authentication Types
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isDemo: boolean;
  permissions: Permission[];
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  module: string;
  actions: ('view' | 'edit' | 'manage')[];
}

export type DemoPersona = 'admin' | 'project-manager' | 'crew-member';

export interface DemoAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  description: string;
  permissions: Permission[];
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  demoLogin: (persona: DemoPersona) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo accounts data
const demoAccounts: Record<DemoPersona, DemoAccount> = {
  admin: {
    id: 'demo-admin',
    name: 'Sarah Johnson',
    email: 'admin@safehavendefense.com',
    role: {
      id: 'admin',
      name: 'Administrator',
      permissions: [
        { module: 'dashboard', actions: ['view', 'edit', 'manage'] },
        { module: 'projects', actions: ['view', 'edit', 'manage'] },
        { module: 'team', actions: ['view', 'edit', 'manage'] },
        { module: 'trailers', actions: ['view', 'edit', 'manage'] },
        { module: 'scheduler', actions: ['view', 'edit', 'manage'] },
        { module: 'documents', actions: ['view', 'edit', 'manage'] },
        { module: 'settings', actions: ['view', 'edit', 'manage'] },
      ]
    },
    avatar: 'SJ',
    description: 'Full system access with administrative privileges',
    permissions: [
      { module: 'dashboard', actions: ['view', 'edit', 'manage'] },
      { module: 'projects', actions: ['view', 'edit', 'manage'] },
      { module: 'team', actions: ['view', 'edit', 'manage'] },
      { module: 'trailers', actions: ['view', 'edit', 'manage'] },
      { module: 'scheduler', actions: ['view', 'edit', 'manage'] },
      { module: 'documents', actions: ['view', 'edit', 'manage'] },
      { module: 'settings', actions: ['view', 'edit', 'manage'] },
    ]
  },
  'project-manager': {
    id: 'demo-pm',
    name: 'Mike Chen',
    email: 'pm@safehavendefense.com',
    role: {
      id: 'project-manager',
      name: 'Project Manager',
      permissions: [
        { module: 'dashboard', actions: ['view'] },
        { module: 'projects', actions: ['view', 'edit', 'manage'] },
        { module: 'team', actions: ['view', 'edit'] },
        { module: 'trailers', actions: ['view', 'edit'] },
        { module: 'scheduler', actions: ['view', 'edit'] },
        { module: 'documents', actions: ['view', 'edit'] },
        { module: 'settings', actions: ['view'] },
      ]
    },
    avatar: 'MC',
    description: 'Project management access with team coordination',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'projects', actions: ['view', 'edit', 'manage'] },
      { module: 'team', actions: ['view', 'edit'] },
      { module: 'trailers', actions: ['view', 'edit'] },
      { module: 'scheduler', actions: ['view', 'edit'] },
      { module: 'documents', actions: ['view', 'edit'] },
      { module: 'settings', actions: ['view'] },
    ]
  },
  'crew-member': {
    id: 'demo-crew',
    name: 'Emily Rodriguez',
    email: 'crew@safehavendefense.com',
    role: {
      id: 'crew-member',
      name: 'Crew Member',
      permissions: [
        { module: 'dashboard', actions: ['view'] },
        { module: 'projects', actions: ['view'] },
        { module: 'team', actions: ['view'] },
        { module: 'trailers', actions: ['view'] },
        { module: 'scheduler', actions: ['view'] },
        { module: 'documents', actions: ['view'] },
        { module: 'settings', actions: [] },
      ]
    },
    avatar: 'ER',
    description: 'Limited access to assigned tasks and schedules',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'projects', actions: ['view'] },
      { module: 'team', actions: ['view'] },
      { module: 'trailers', actions: ['view'] },
      { module: 'scheduler', actions: ['view'] },
      { module: 'documents', actions: ['view'] },
      { module: 'settings', actions: [] },
    ]
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication on app load
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('authUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any email/password combination
    const authUser: AuthUser = {
      id: 'user-1',
      name: 'John Doe',
      email: email,
      role: {
        id: 'user',
        name: 'User',
        permissions: [
          { module: 'dashboard', actions: ['view'] },
          { module: 'projects', actions: ['view', 'edit'] },
          { module: 'team', actions: ['view'] },
          { module: 'trailers', actions: ['view'] },
          { module: 'scheduler', actions: ['view'] },
          { module: 'documents', actions: ['view', 'edit'] },
          { module: 'settings', actions: ['view'] },
        ]
      },
      avatar: 'JD',
      isDemo: false,
      permissions: [
        { module: 'dashboard', actions: ['view'] },
        { module: 'projects', actions: ['view', 'edit'] },
        { module: 'team', actions: ['view'] },
        { module: 'trailers', actions: ['view'] },
        { module: 'scheduler', actions: ['view'] },
        { module: 'documents', actions: ['view', 'edit'] },
        { module: 'settings', actions: ['view'] },
      ]
    };

    setUser(authUser);
    
    if (rememberMe) {
      localStorage.setItem('authUser', JSON.stringify(authUser));
    }
    
    setIsLoading(false);
  };

  const demoLogin = (persona: DemoPersona): void => {
    const demoAccount = demoAccounts[persona];
    const authUser: AuthUser = {
      ...demoAccount,
      isDemo: true,
    };

    setUser(authUser);
    localStorage.setItem('authUser', JSON.stringify(authUser));
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    demoLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
