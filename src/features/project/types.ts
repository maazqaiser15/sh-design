import { Project } from '../../types';

// Safe Haven Defense Project Stages
export type ProjectStage = 'PV90' | 'UB' | 'WB' | 'WIP' | 'Completed';

// Safe Haven Defense Project Status (same as stages for this implementation)
export type ProjectStatus = ProjectStage;

// Extended project types for Safe Haven Defense
export interface SafeHavenProject extends Omit<Project, 'status' | 'stage'> {
  status: ProjectStatus;
  stage: ProjectStage;
  vinCode: string;
  crew: ProjectCrewMember[];
  assignedTrailer: string | null;
  progress: number; // 0-100
}

export interface ProjectCrewMember {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  designation: string;
  location: string;
  phone: string;
  productivity: string; // e.g., "Efficient in Installation"
  status: 'available' | 'unavailable';
}

export interface ProjectListItem extends SafeHavenProject {
  // Additional properties specific to project list view
  crewCount: number;
  daysRemaining: number;
}

export interface ProjectFilters {
  status: ProjectStatus[];
}

export interface ProjectSortOptions {
  field: 'title' | 'vinCode' | 'status' | 'location' | 'crewCount' | 'assignedTrailer' | 'startDate' | 'endDate' | 'progress';
  direction: 'asc' | 'desc';
}

export interface ProjectViewMode {
  type: 'list' | 'table';
}

// Status color mapping for Safe Haven Defense
export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  'PV90': 'bg-purple-100 text-purple-700',
  'UB': 'bg-blue-100 text-blue-700',
  'WB': 'bg-yellow-100 text-yellow-700',
  'WIP': 'bg-green-100 text-green-700',
  'Completed': 'bg-gray-100 text-gray-700',
};

// Status descriptions
export const PROJECT_STATUS_DESCRIPTIONS: Record<ProjectStatus, string> = {
  'PV90': 'PV90',
  'UB': 'UB',
  'WB': 'WB',
  'WIP': 'WIP',
  'Completed': 'Completed',
};
