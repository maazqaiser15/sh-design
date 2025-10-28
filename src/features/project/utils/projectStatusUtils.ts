export type ProjectStatus = 'D75' | 'PV90' | 'UB' | 'WB' | 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED' | 'QC';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  vinCode?: string;
  site?: string; // Site name
  industry?: string; // Industry type
  // Add other project properties as needed
}

/**
 * Determines if a project with the given status requires date setup
 */
export const requiresDateSetup = (status: ProjectStatus): boolean => {
  return ['D75', 'PV90', 'UB', 'WB'].includes(status);
};

/**
 * Gets the display name for a project status
 */
export const getStatusDisplayName = (status: ProjectStatus): string => {
  switch (status) {
    case 'D75':
      return 'D75 (75% Complete)';
    case 'PV90':
      return 'PV90 (90% Complete)';
    case 'UB':
      return 'UB (Under Budget)';
    case 'WB':
      return 'WB (Within Budget)';
    case 'ACTIVE':
      return 'Active';
    case 'COMPLETED':
      return 'Completed';
    case 'ON_HOLD':
      return 'On Hold';
    case 'CANCELLED':
      return 'Cancelled';
    case 'QC':
      return 'QC (Quality Control)';
    default:
      return status;
  }
};

/**
 * Gets the color class for a project status badge
 */
export const getStatusColorClass = (status: ProjectStatus): string => {
  switch (status) {
    case 'D75':
      return 'bg-yellow-100 text-yellow-800';
    case 'PV90':
      return 'bg-orange-100 text-orange-800';
    case 'UB':
      return 'bg-green-100 text-green-800';
    case 'WB':
      return 'bg-blue-100 text-blue-800';
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'COMPLETED':
      return 'bg-gray-100 text-gray-800';
    case 'ON_HOLD':
      return 'bg-yellow-100 text-yellow-800';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800';
    case 'QC':
      return 'bg-indigo-100 text-indigo-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Validates project dates
 */
export const validateProjectDates = (startDate: string, endDate: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!startDate) {
    errors.push('Start date is required');
  }

  if (!endDate) {
    errors.push('End date is required');
  }

  if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
    errors.push('End date must be after start date');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
