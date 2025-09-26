import { AuthService } from '../services/authService';
import { UserType, LoginType, CompanyType, DepartmentType } from '../types/auth';

/**
 * Test scenarios for different login types and user roles
 * This file demonstrates all the different login logic implementations
 */

export interface LoginTestScenario {
  email: string;
  password: string;
  expectedUserType: UserType;
  expectedLoginType: LoginType;
  expectedCompany?: CompanyType;
  expectedDepartment?: DepartmentType;
  description: string;
}

export const LOGIN_TEST_SCENARIOS: LoginTestScenario[] = [
  // SafeHavenDefense Company Accounts
  {
    email: 'admin@safehavendefense.com',
    password: 'password123',
    expectedUserType: 'admin',
    expectedLoginType: 'company-based',
    expectedCompany: 'safehavendefense',
    description: 'Administrator with full system access'
  },
  {
    email: 'vp@safehavendefense.com',
    password: 'password123',
    expectedUserType: 'vp',
    expectedLoginType: 'company-based',
    expectedCompany: 'safehavendefense',
    description: 'Vice President with executive access'
  },
  {
    email: 'vpops@safehavendefense.com',
    password: 'password123',
    expectedUserType: 'vp-ops',
    expectedLoginType: 'company-based',
    expectedCompany: 'safehavendefense',
    description: 'VP of Operations with operational management access'
  },
  {
    email: 'pm@safehavendefense.com',
    password: 'password123',
    expectedUserType: 'project-manager',
    expectedLoginType: 'company-based',
    expectedCompany: 'safehavendefense',
    description: 'Project Manager with project coordination access'
  },
  {
    email: 'coordinator@safehavendefense.com',
    password: 'password123',
    expectedUserType: 'project-coordinator',
    expectedLoginType: 'company-based',
    expectedCompany: 'safehavendefense',
    description: 'Project Coordinator with team coordination access'
  },

  // Department-based Accounts
  {
    email: 'ops@safehavendefense.com',
    password: 'password123',
    expectedUserType: 'project-manager',
    expectedLoginType: 'domain-based',
    expectedCompany: 'safehavendefense',
    expectedDepartment: 'operations',
    description: 'Operations team member with operational access'
  },
  {
    email: 'logistics@safehavendefense.com',
    password: 'password123',
    expectedUserType: 'project-coordinator',
    expectedLoginType: 'domain-based',
    expectedCompany: 'safehavendefense',
    expectedDepartment: 'logistics',
    description: 'Logistics team member with logistics management access'
  },
  {
    email: 'production@safehavendefense.com',
    password: 'password123',
    expectedUserType: 'crew-member',
    expectedLoginType: 'domain-based',
    expectedCompany: 'safehavendefense',
    expectedDepartment: 'production',
    description: 'Production team member with production access'
  },
  {
    email: 'quality@safehavendefense.com',
    password: 'password123',
    expectedUserType: 'crew-member',
    expectedLoginType: 'domain-based',
    expectedCompany: 'safehavendefense',
    expectedDepartment: 'quality',
    description: 'Quality Assurance team member with QA access'
  },
  {
    email: 'safety@safehavendefense.com',
    password: 'password123',
    expectedUserType: 'crew-member',
    expectedLoginType: 'domain-based',
    expectedCompany: 'safehavendefense',
    expectedDepartment: 'safety',
    description: 'Safety team member with safety management access'
  },
  {
    email: 'finance@safehavendefense.com',
    password: 'password123',
    expectedUserType: 'project-coordinator',
    expectedLoginType: 'domain-based',
    expectedCompany: 'safehavendefense',
    expectedDepartment: 'finance',
    description: 'Finance team member with financial access'
  },
  {
    email: 'hr@safehavendefense.com',
    password: 'password123',
    expectedUserType: 'project-coordinator',
    expectedLoginType: 'domain-based',
    expectedCompany: 'safehavendefense',
    expectedDepartment: 'hr',
    description: 'HR team member with human resources access'
  },
  {
    email: 'it@safehavendefense.com',
    password: 'password123',
    expectedUserType: 'project-coordinator',
    expectedLoginType: 'domain-based',
    expectedCompany: 'safehavendefense',
    expectedDepartment: 'it',
    description: 'IT team member with technical access'
  },

  // Field Team Accounts
  {
    email: 'crew@safehavendefense.com',
    password: 'password123',
    expectedUserType: 'crew-member',
    expectedLoginType: 'domain-based',
    expectedCompany: 'safehavendefense',
    description: 'Crew member with basic operational access'
  },
  {
    email: 'ground@safehavendefense.com',
    password: 'password123',
    expectedUserType: 'ground-team',
    expectedLoginType: 'domain-based',
    expectedCompany: 'safehavendefense',
    description: 'Ground team member with field operations access'
  },

  // External Company Accounts
  {
    email: 'contractor@contractor1.com',
    password: 'password123',
    expectedUserType: 'contractor',
    expectedLoginType: 'domain-based',
    expectedCompany: 'contractor',
    description: 'Contractor account with limited project access'
  },
  {
    email: 'client@client1.com',
    password: 'password123',
    expectedUserType: 'client',
    expectedLoginType: 'domain-based',
    expectedCompany: 'client',
    description: 'Client account with read-only project access'
  },

  // Generic Email Accounts
  {
    email: 'john.doe@gmail.com',
    password: 'password123',
    expectedUserType: 'crew-member',
    expectedLoginType: 'email',
    description: 'Generic email account with basic access'
  },
  {
    email: 'jane.smith@company.com',
    password: 'password123',
    expectedUserType: 'crew-member',
    expectedLoginType: 'email',
    description: 'Unknown domain account with basic access'
  }
];

/**
 * Test all login scenarios and return results
 */
export function testAllLoginScenarios(): Array<{
  scenario: LoginTestScenario;
  result: {
    isValid: boolean;
    userType: UserType;
    loginType: LoginType;
    company?: CompanyType;
    department?: DepartmentType;
    success: boolean;
    error?: string;
  };
}> {
  return LOGIN_TEST_SCENARIOS.map(scenario => {
    try {
      const validation = AuthService.validateLogin(scenario.email, scenario.password);
      
      if (!validation.isValid) {
        return {
          scenario,
          result: {
            isValid: false,
            userType: 'crew-member',
            loginType: 'email',
            success: false,
            error: 'Invalid email or password'
          }
        };
      }

      const success = 
        validation.userType === scenario.expectedUserType &&
        validation.loginType === scenario.expectedLoginType &&
        (!scenario.expectedCompany || validation.company?.type === scenario.expectedCompany) &&
        (!scenario.expectedDepartment || validation.department?.type === scenario.expectedDepartment);

      return {
        scenario,
        result: {
          isValid: validation.isValid,
          userType: validation.userType,
          loginType: validation.loginType,
          company: validation.company?.type,
          department: validation.department?.type,
          success,
          error: success ? undefined : 'User type or permissions mismatch'
        }
      };
    } catch (error) {
      return {
        scenario,
        result: {
          isValid: false,
          userType: 'crew-member',
          loginType: 'email',
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  });
}

/**
 * Get user permissions for a specific scenario
 */
export function getUserPermissionsForScenario(scenario: LoginTestScenario): string[] {
  try {
    const validation = AuthService.validateLogin(scenario.email, scenario.password);
    if (!validation.isValid) return [];

    const authUser = AuthService.createAuthUser(
      scenario.email,
      'Test User',
      validation.userType,
      validation.loginType,
      validation.company,
      validation.department,
      false
    );

    return authUser.permissions.map(p => 
      `${p.module}: ${p.actions.join(', ')}`
    );
  } catch (error) {
    return [];
  }
}

/**
 * Print test results in a formatted way
 */
export function printTestResults(): void {
  console.log('🧪 Testing Different Login Logic Scenarios\n');
  console.log('=' .repeat(80));
  
  const results = testAllLoginScenarios();
  
  results.forEach(({ scenario, result }, index) => {
    console.log(`\n${index + 1}. ${scenario.description}`);
    console.log(`   Email: ${scenario.email}`);
    console.log(`   Expected: ${scenario.expectedUserType} (${scenario.expectedLoginType})`);
    console.log(`   Actual: ${result.userType} (${result.loginType})`);
    console.log(`   Status: ${result.success ? '✅ PASS' : '❌ FAIL'}`);
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    
    if (result.company) {
      console.log(`   Company: ${result.company}`);
    }
    
    if (result.department) {
      console.log(`   Department: ${result.department}`);
    }
  });
  
  const passed = results.filter(r => r.result.success).length;
  const total = results.length;
  
  console.log('\n' + '=' .repeat(80));
  console.log(`📊 Test Results: ${passed}/${total} scenarios passed (${Math.round(passed/total*100)}%)`);
}
