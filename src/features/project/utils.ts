import { SafeHavenProject, ProjectListItem, ProjectCrewMember } from './types';

/**
 * Convert a SafeHavenProject to ProjectListItem with additional calculated properties
 */
export const projectToListItem = (project: SafeHavenProject): ProjectListItem => {
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);
  const today = new Date();

  // Calculate days remaining
  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return {
    ...project,
    crewCount: project.crew?.length || 0,
    daysRemaining: Math.max(0, daysRemaining),
  };
};

/**
 * Filter projects based on criteria
 */
export const filterProjects = (
  projects: ProjectListItem[],
  filters: {
    status?: string[];
    searchQuery?: string;
  }
): ProjectListItem[] => {
  return projects.filter(project => {
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(project.status)) return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = [
        project.title,
        project.description,
        project.site,
        project.status,
        project.vinCode,
        project.assignedTrailer || '',
        ...project.crew.map(member => member.name),
      ].join(' ').toLowerCase();

      if (!searchableText.includes(query)) return false;
    }

    return true;
  });
};

/**
 * Sort projects based on field and direction
 */
export const sortProjects = (
  projects: ProjectListItem[],
  field: keyof ProjectListItem,
  direction: 'asc' | 'desc'
): ProjectListItem[] => {
  return [...projects].sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];

    // Handle different data types
    if (field === 'startDate' || field === 'endDate') {
      aValue = new Date(aValue as string).getTime();
      bValue = new Date(bValue as string).getTime();
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = (bValue as string).toLowerCase();
    }

    if (direction === 'asc') {
      return (aValue || '') < (bValue || '') ? -1 : (aValue || '') > (bValue || '') ? 1 : 0;
    } else {
      return (aValue || '') > (bValue || '') ? -1 : (aValue || '') < (bValue || '') ? 1 : 0;
    }
  });
};

/**
 * Get project status color for Safe Haven Defense
 */
export const getProjectStatusColor = (status: string): string => {
  switch (status) {
    case 'PV90': return 'bg-purple-100 text-purple-800';
    case 'UB': return 'bg-blue-100 text-blue-800';
    case 'WB': return 'bg-yellow-100 text-yellow-800';
    case 'WIP': return 'bg-green-100 text-green-800';
    case 'Completed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Get project stage color (same as status for Safe Haven Defense)
 */
export const getProjectStageColor = (stage: string): string => {
  return getProjectStatusColor(stage);
};

/**
 * Format project duration
 */
export const formatProjectDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return '1 day';
  if (diffDays < 7) return `${diffDays} days`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
  return `${Math.ceil(diffDays / 30)} months`;
};


export const getProgressBarColor = (status: string): string => {
  switch (status) {
    case 'D75':
      return 'bg-gray-500';
    case 'PV90':
      return 'bg-purple-500';
    case 'UB':
      return 'bg-blue-500';
    case 'WB':
      return 'bg-yellow-500';
    case 'WIP':
      return 'bg-blue-500';
    case 'QF':
      return 'bg-orange-500';
    case 'Completed':
      return 'bg-green-500';
    case 'Archived':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
};


export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "available":
      return "text-green-600 bg-green-50";
    case "unavailable":
      return "text-red-600 bg-red-50";
    case "low_stock":
      return "text-yellow-600 bg-yellow-50"
    default:
      return "text-gray-600 bg-gray-50";
  }
};


export { formatDate } from '../../utils/dateUtils';

