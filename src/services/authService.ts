import { 
  AuthUser, 
  UserType, 
  CompanyType, 
  DepartmentType, 
  LoginType, 
  CompanyInfo, 
  DepartmentInfo, 
  UserRole, 
  Permission 
} from '../types/auth';

// Company and domain configurations
const COMPANY_CONFIGS: Record<string, CompanyInfo> = {
  'safehavendefense.com': {
    id: 'safehaven-1',
    name: 'SafeHavenDefense',
    type: 'safehavendefense',
    domain: 'safehavendefense.com',
    isVerified: true
  },
  'contractor1.com': {
    id: 'contractor-1',
    name: 'Elite Security Contractors',
    type: 'contractor',
    domain: 'contractor1.com',
    isVerified: true
  },
  'client1.com': {
    id: 'client-1',
    name: 'Government Agency Alpha',
    type: 'client',
    domain: 'client1.com',
    isVerified: true
  }
};

// Department configurations
const DEPARTMENT_CONFIGS: Record<DepartmentType, DepartmentInfo> = {
  operations: {
    id: 'dept-ops',
    name: 'Operations',
    type: 'operations',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'projects', actions: ['view', 'edit', 'manage'] },
      { module: 'team', actions: ['view', 'edit'] },
      { module: 'trailers', actions: ['view', 'edit', 'manage'] },
      { module: 'scheduler', actions: ['view', 'edit', 'manage'] },
      { module: 'documents', actions: ['view', 'edit'] },
      { module: 'settings', actions: ['view'] }
    ]
  },
  logistics: {
    id: 'dept-logistics',
    name: 'Logistics',
    type: 'logistics',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'projects', actions: ['view', 'edit'] },
      { module: 'trailers', actions: ['view', 'edit', 'manage'] },
      { module: 'scheduler', actions: ['view', 'edit'] },
      { module: 'documents', actions: ['view', 'edit'] },
      { module: 'settings', actions: ['view'] }
    ]
  },
  production: {
    id: 'dept-production',
    name: 'Production',
    type: 'production',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'projects', actions: ['view', 'edit'] },
      { module: 'team', actions: ['view'] },
      { module: 'scheduler', actions: ['view', 'edit'] },
      { module: 'documents', actions: ['view'] },
      { module: 'settings', actions: [] }
    ]
  },
  quality: {
    id: 'dept-quality',
    name: 'Quality Assurance',
    type: 'quality',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'projects', actions: ['view', 'edit'] },
      { module: 'documents', actions: ['view', 'edit', 'manage'] },
      { module: 'settings', actions: ['view'] }
    ]
  },
  safety: {
    id: 'dept-safety',
    name: 'Safety',
    type: 'safety',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'projects', actions: ['view'] },
      { module: 'documents', actions: ['view', 'edit'] },
      { module: 'settings', actions: ['view'] }
    ]
  },
  finance: {
    id: 'dept-finance',
    name: 'Finance',
    type: 'finance',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'projects', actions: ['view'] },
      { module: 'documents', actions: ['view'] },
      { module: 'settings', actions: ['view', 'edit'] }
    ]
  },
  hr: {
    id: 'dept-hr',
    name: 'Human Resources',
    type: 'hr',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'team', actions: ['view', 'edit', 'manage'] },
      { module: 'documents', actions: ['view', 'edit'] },
      { module: 'settings', actions: ['view', 'edit'] }
    ]
  },
  it: {
    id: 'dept-it',
    name: 'Information Technology',
    type: 'it',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'projects', actions: ['view'] },
      { module: 'team', actions: ['view'] },
      { module: 'trailers', actions: ['view'] },
      { module: 'scheduler', actions: ['view'] },
      { module: 'documents', actions: ['view'] },
      { module: 'settings', actions: ['view', 'edit', 'manage'] }
    ]
  }
};

// User type to role mapping - Simplified to 3 main types
const USER_TYPE_ROLES: Record<UserType, UserRole> = {
  executive: {
    id: 'role-executive',
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
  'project-coordinator': {
    id: 'role-project-coordinator',
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
  'execution-team': {
    id: 'role-execution-team',
    name: 'Execution Team',
    userType: 'execution-team',
    permissions: [
      { module: 'dashboard', actions: ['view'] },
      { module: 'projects', actions: ['view'] },
      { module: 'documents', actions: ['view'] },
      { module: 'settings', actions: [] }
    ]
  },
  'lead-supervisor': {
    id: 'role-lead-supervisor',
    name: 'Lead Supervisor',
    userType: 'lead-supervisor',
    permissions: [
      { module: 'projects', actions: ['view', 'edit', 'manage'] },
      { module: 'team', actions: ['view', 'edit'] },
      { module: 'documents', actions: ['view', 'edit'] }
    ]
  }
};

// Email domain to user type mapping - Only SafeHavenDefense domain
const DOMAIN_USER_TYPE_MAP: Record<string, UserType> = {
  'safehavendefense.com': 'executive'
};

// Email patterns for role detection - Simplified to 3 types
const EMAIL_PATTERNS: Record<string, { userType: UserType; department?: DepartmentType }> = {
  // Executive level
  'admin@': { userType: 'executive' },
  'vp@': { userType: 'executive' },
  'vpops@': { userType: 'executive' },
  'ceo@': { userType: 'executive' },
  'cfo@': { userType: 'executive' },
  'cto@': { userType: 'executive' },
  'director@': { userType: 'executive' },
  
  // Project Coordinator level
  'pm@': { userType: 'project-coordinator' },
  'coordinator@': { userType: 'project-coordinator' },
  'manager@': { userType: 'project-coordinator' },
  'supervisor@': { userType: 'project-coordinator' },
  'lead@': { userType: 'project-coordinator' },
  
  // Lead Supervisor level
  'leadsupervisor@': { userType: 'lead-supervisor' },
  'lead-supervisor@': { userType: 'lead-supervisor' },
  'lead_supervisor@': { userType: 'lead-supervisor' },
  'ls@': { userType: 'lead-supervisor' },
  
  // Execution Team level
  'crew@': { userType: 'execution-team' },
  'team@': { userType: 'execution-team' },
  'field@': { userType: 'execution-team' },
  'ground@': { userType: 'execution-team' },
  'ops@': { userType: 'execution-team', department: 'operations' },
  'logistics@': { userType: 'execution-team', department: 'logistics' },
  'production@': { userType: 'execution-team', department: 'production' },
  'quality@': { userType: 'execution-team', department: 'quality' },
  'safety@': { userType: 'execution-team', department: 'safety' },
  'finance@': { userType: 'execution-team', department: 'finance' },
  'hr@': { userType: 'execution-team', department: 'hr' },
  'it@': { userType: 'execution-team', department: 'it' }
};

export class AuthService {
  /**
   * Determine user type and company based on email domain and patterns
   */
  static determineUserType(email: string): { userType: UserType; company?: CompanyInfo; department?: DepartmentInfo } {
    const domain = email.split('@')[1]?.toLowerCase();
    const localPart = email.split('@')[0]?.toLowerCase();
    
    // Check for company domain
    const company = COMPANY_CONFIGS[domain];
    
    // Check for email patterns
    for (const [pattern, config] of Object.entries(EMAIL_PATTERNS)) {
      if (localPart.startsWith(pattern)) {
        const department = config.department ? DEPARTMENT_CONFIGS[config.department] : undefined;
        return {
          userType: config.userType,
          company,
          department
        };
      }
    }
    
    // Fallback to domain-based mapping
    const userType = DOMAIN_USER_TYPE_MAP[domain] || 'crew-member';
    return {
      userType,
      company,
      department: undefined
    };
  }

  /**
   * Create user permissions based on user type, company, and department
   */
  static createUserPermissions(
    userType: UserType, 
    company?: CompanyInfo, 
    department?: DepartmentInfo
  ): Permission[] {
    const role = USER_TYPE_ROLES[userType];
    let permissions = [...role.permissions];

    // Add department-specific permissions
    if (department) {
      permissions = [...permissions, ...department.permissions];
    }

    // Modify permissions based on company type
    if (company) {
      switch (company.type) {
        case 'contractor':
          // Contractors have limited access
          permissions = permissions.filter(p => 
            !p.module.includes('settings') || p.actions.includes('view')
          );
          break;
        case 'client':
          // Clients can only view
          permissions = permissions.map(p => ({
            ...p,
            actions: p.actions.filter(action => action === 'view')
          }));
          break;
        case 'partner':
          // Partners have extended access
          permissions.push(
            { module: 'reports', actions: ['view', 'edit'] },
            { module: 'analytics', actions: ['view'] }
          );
          break;
      }
    }

    // Remove duplicates
    const uniquePermissions = permissions.reduce((acc, permission) => {
      const existing = acc.find(p => p.module === permission.module);
      if (existing) {
        existing.actions = [...new Set([...existing.actions, ...permission.actions])];
      } else {
        acc.push(permission);
      }
      return acc;
    }, [] as Permission[]);

    return uniquePermissions;
  }

  /**
   * Generate user avatar initials
   */
  static generateAvatar(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  /**
   * Validate login credentials and determine login type
   */
  static validateLogin(email: string, password: string): { 
    isValid: boolean; 
    loginType: LoginType; 
    userType: UserType;
    company?: CompanyInfo;
    department?: DepartmentInfo;
  } {
    // Basic validation
    if (!email || !password) {
      return { isValid: false, loginType: 'email', userType: 'crew-member' };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, loginType: 'email', userType: 'crew-member' };
    }

    // Determine user type and company
    const { userType, company, department } = this.determineUserType(email);
    
    // Determine login type
    let loginType: LoginType = 'email';
    if (company?.isVerified) {
      loginType = 'domain-based';
    }
    if (company?.type === 'safehavendefense') {
      loginType = 'company-based';
    }

    return {
      isValid: true,
      loginType,
      userType,
      company,
      department
    };
  }

  /**
   * Create authenticated user object
   */
  static createAuthUser(
    email: string,
    name: string,
    userType: UserType,
    loginType: LoginType,
    company?: CompanyInfo,
    department?: DepartmentInfo,
    isDemo: boolean = false
  ): AuthUser {
    const role = USER_TYPE_ROLES[userType];
    const permissions = this.createUserPermissions(userType, company, department);
    
    return {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      avatar: this.generateAvatar(name),
      isDemo,
      permissions,
      userType,
      company,
      department,
      loginType,
      lastLogin: new Date(),
      isActive: true
    };
  }

  /**
   * Check if user has permission for specific action
   */
  static hasPermission(
    user: AuthUser, 
    module: string, 
    action: 'view' | 'edit' | 'manage'
  ): boolean {
    const permission = user.permissions.find(p => p.module === module);
    return permission?.actions.includes(action) || false;
  }

  /**
   * Get available login methods for a domain
   */
  static getAvailableLoginMethods(email: string): LoginType[] {
    const domain = email.split('@')[1]?.toLowerCase();
    const company = COMPANY_CONFIGS[domain];
    
    if (company?.isVerified) {
      return ['domain-based', 'company-based', 'email'];
    }
    
    return ['email'];
  }
}
