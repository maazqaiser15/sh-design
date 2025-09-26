import { UserType } from '../types/auth';
import { ProjectStatus } from '../features/project/types';

/**
 * Service for filtering projects based on user role and permissions
 */

// Project statuses that Execution Team should not see
const EXECUTION_TEAM_HIDDEN_STATUSES: ProjectStatus[] = ['PV75', 'PV90', 'UB', 'WB'];

/**
 * Check if a project status should be visible to a specific user type
 */
export function isProjectStatusVisibleToUser(status: ProjectStatus, userType: UserType): boolean {
  switch (userType) {
    case 'executive':
      // Executives can see all project statuses
      return true;
    
    case 'project-coordinator':
      // Project Coordinators can see all project statuses
      return true;
    
    case 'execution-team':
      // Execution Team cannot see PV75, PV90, UB, WB statuses
      return !EXECUTION_TEAM_HIDDEN_STATUSES.includes(status);
    
    default:
      // Default to showing all statuses for unknown user types
      return true;
  }
}

/**
 * Filter projects based on user role
 */
export function filterProjectsByUserRole<T extends { status: ProjectStatus }>(
  projects: T[],
  userType: UserType
): T[] {
  return projects.filter(project => 
    isProjectStatusVisibleToUser(project.status, userType)
  );
}

/**
 * Get available project statuses for a user type
 */
export function getAvailableProjectStatuses(userType: UserType): ProjectStatus[] {
  const allStatuses: ProjectStatus[] = ['PV75', 'PV90', 'UB', 'WB', 'WIP', 'QF', 'Completed'];
  
  return allStatuses.filter(status => 
    isProjectStatusVisibleToUser(status, userType)
  );
}

/**
 * Get hidden project statuses for a user type
 */
export function getHiddenProjectStatuses(userType: UserType): ProjectStatus[] {
  switch (userType) {
    case 'execution-team':
      return EXECUTION_TEAM_HIDDEN_STATUSES;
    case 'executive':
    case 'project-coordinator':
    default:
      return [];
  }
}

/**
 * Check if user can see a specific project
 */
export function canUserSeeProject<T extends { status: ProjectStatus }>(
  project: T,
  userType: UserType
): boolean {
  return isProjectStatusVisibleToUser(project.status, userType);
}
