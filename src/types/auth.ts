// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isDemo: boolean;
  permissions: Permission[];
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

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  module: string;
  actions: ('view' | 'edit' | 'manage')[];
}
