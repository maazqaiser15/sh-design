import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../services/authService';
import { 
  AuthUser, 
  UserRole, 
  Permission, 
  DemoPersona, 
  DemoAccount, 
  UserType, 
  LoginType,
  CompanyInfo,
  DepartmentInfo
} from '../types/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  demoLogin: (persona: DemoPersona) => void;
  logout: () => void;
  hasPermission: (module: string, action: 'view' | 'edit' | 'manage') => boolean;
  getAvailableLoginMethods: (email: string) => LoginType[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo accounts data - Simplified to 3 user types
const demoAccounts: Record<DemoPersona, DemoAccount> = {
  executive: {
    id: 'demo-executive',
    name: 'Sarah Johnson',
    email: 'admin@safehavendefense.com',
    role: {
      id: 'executive',
      name: 'Executive',
      userType: 'executive',
      permissions: [
        { module: 'dashboard', actions: ['view', 'edit', 'manage'] },
        { module: 'projects', actions: ['view', 'edit', 'manage'] },
        { module: 'team', actions: ['view', 'edit', 'manage'] },
        { module: 'trailers', actions: ['view', 'edit', 'manage'] },
        { module: 'scheduler', actions: ['view', 'edit', 'manage'] },
        { module: 'documents', actions: ['view', 'edit', 'manage'] },
        { module: 'settings', actions: ['view', 'edit', 'manage'] },
        { module: 'reports', actions: ['view', 'edit', 'manage'] },
        { module: 'analytics', actions: ['view', 'edit', 'manage'] }
      ]
    },
    avatar: 'SJ',
    description: 'Full system access with executive management capabilities',
    permissions: [
      { module: 'dashboard', actions: ['view', 'edit', 'manage'] },
      { module: 'projects', actions: ['view', 'edit', 'manage'] },
      { module: 'team', actions: ['view', 'edit', 'manage'] },
      { module: 'trailers', actions: ['view', 'edit', 'manage'] },
      { module: 'scheduler', actions: ['view', 'edit', 'manage'] },
      { module: 'documents', actions: ['view', 'edit', 'manage'] },
      { module: 'settings', actions: ['view', 'edit', 'manage'] },
      { module: 'reports', actions: ['view', 'edit', 'manage'] },
      { module: 'analytics', actions: ['view', 'edit', 'manage'] }
    ],
    userType: 'executive',
    company: {
      id: 'safehaven-1',
      name: 'SafeHavenDefense',
      type: 'safehavendefense',
      domain: 'safehavendefense.com',
      isVerified: true
    }
  },
  'project-coordinator': {
    id: 'demo-project-coordinator',
    name: 'Mike Chen',
    email: 'pm@safehavendefense.com',
    role: {
      id: 'project-coordinator',
      name: 'Project Coordinator',
      userType: 'project-coordinator',
      permissions: [
        { module: 'dashboard', actions: ['view'] },
        { module: 'projects', actions: ['view', 'edit', 'manage'] },
        { module: 'team', actions: ['view', 'edit'] },
        { module: 'trailers', actions: ['view', 'edit'] },
        { module: 'scheduler', actions: ['view', 'edit'] },
        { module: 'documents', actions: ['view', 'edit'] },
        { module: 'settings', actions: ['view'] },
        { module: 'reports', actions: ['view'] }
      ]
    },
    avatar: 'MC',
    description: 'Project coordination with team management access',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'projects', actions: ['view', 'edit', 'manage'] },
      { module: 'team', actions: ['view', 'edit'] },
      { module: 'trailers', actions: ['view', 'edit'] },
      { module: 'scheduler', actions: ['view', 'edit'] },
      { module: 'documents', actions: ['view', 'edit'] },
      { module: 'settings', actions: ['view'] },
      { module: 'reports', actions: ['view'] }
    ],
    userType: 'project-coordinator',
    company: {
      id: 'safehaven-1',
      name: 'SafeHavenDefense',
      type: 'safehavendefense',
      domain: 'safehavendefense.com',
      isVerified: true
    }
  },
  'execution-team': {
    id: 'demo-execution-team',
    name: 'Emily Rodriguez',
    email: 'crew@safehavendefense.com',
    role: {
      id: 'execution-team',
      name: 'Execution Team',
      userType: 'execution-team',
      permissions: [
        { module: 'dashboard', actions: ['view'] },
        { module: 'projects', actions: ['view'] },
        { module: 'scheduler', actions: ['view'] },
        { module: 'documents', actions: ['view'] },
        { module: 'settings', actions: [] }
      ]
    },
    avatar: 'ER',
    description: 'Operational access for task execution and field work (no team/trailer access)',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'projects', actions: ['view'] },
      { module: 'scheduler', actions: ['view'] },
      { module: 'documents', actions: ['view'] },
      { module: 'settings', actions: [] }
    ],
    userType: 'execution-team',
    company: {
      id: 'safehaven-1',
      name: 'SafeHavenDefense',
      type: 'safehavendefense',
      domain: 'safehavendefense.com',
      isVerified: true
    }
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
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate login credentials and determine user type
      const validation = AuthService.validateLogin(email, password);
      
      if (!validation.isValid) {
        throw new Error('Invalid email or password');
      }

      // Extract name from email (for demo purposes)
      const name = email.split('@')[0]
        .split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

      // Create authenticated user using the auth service
      const authUser = AuthService.createAuthUser(
        email,
        name,
        validation.userType,
        validation.loginType,
        validation.company,
        validation.department,
        false
      );

      setUser(authUser);
      
      if (rememberMe) {
        localStorage.setItem('authUser', JSON.stringify(authUser));
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
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

  const hasPermission = (module: string, action: 'view' | 'edit' | 'manage'): boolean => {
    if (!user) return false;
    return AuthService.hasPermission(user, module, action);
  };

  const getAvailableLoginMethods = (email: string): LoginType[] => {
    return AuthService.getAvailableLoginMethods(email);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    demoLogin,
    logout,
    hasPermission,
    getAvailableLoginMethods,
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
