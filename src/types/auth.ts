// Authentication Types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export type LoginType = 'email' | 'demo' | 'sso' | 'domain-based' | 'company-based';
export type UserType = 'executive' | 'project-coordinator' | 'execution-team';
export type CompanyType = 'safehavendefense' | 'contractor' | 'client' | 'partner';
export type DepartmentType = 'operations' | 'logistics' | 'production' | 'quality' | 'safety' | 'finance' | 'hr' | 'it';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isDemo: boolean;
  permissions: Permission[];
  userType: UserType;
  company?: CompanyInfo;
  department?: DepartmentInfo;
  loginType: LoginType;
  lastLogin?: Date;
  isActive: boolean;
}

export interface CompanyInfo {
  id: string;
  name: string;
  type: CompanyType;
  domain: string;
  isVerified: boolean;
}

export interface DepartmentInfo {
  id: string;
  name: string;
  type: DepartmentType;
  permissions: Permission[];
}

export type DemoPersona = 'executive' | 'project-coordinator' | 'execution-team';

export interface DemoAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  description: string;
  permissions: Permission[];
  userType: UserType;
  company?: CompanyInfo;
  department?: DepartmentInfo;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
  userType: UserType;
  department?: DepartmentType;
}

export interface Permission {
  module: string;
  actions: ('view' | 'edit' | 'manage')[];
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  type: 'department' | 'company' | 'project' | 'time-based';
  value: string | Date;
  operator: 'equals' | 'contains' | 'before' | 'after' | 'in';
}

export interface LoginMethod {
  type: LoginType;
  name: string;
  description: string;
  icon: string;
  isEnabled: boolean;
  validationRules?: ValidationRule[];
}

export interface ValidationRule {
  field: string;
  type: 'email' | 'password' | 'domain' | 'company';
  required: boolean;
  pattern?: string;
  message?: string;
}
