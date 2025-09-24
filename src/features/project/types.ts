import { Project } from '../../types';

// Safe Haven Defense Project Stages
export type ProjectStage = 'PV75' | 'PV90' | 'UB' | 'WB' | 'WIP' | 'QF' | 'Completed';

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
  assignedUsers: string[];
}

export interface ProjectSortOptions {
  field: 'title' | 'vinCode' | 'status' | 'location' | 'crewCount' | 'assignedTrailer' | 'startDate' | 'endDate' | 'progress';
  direction: 'asc' | 'desc';
}

export interface ProjectViewMode {
  type: 'list' | 'table' | 'gantt';
}

// Status color mapping for Safe Haven Defense
export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  'PV75': 'bg-gray-100 text-gray-700',      // Gray for initial planning
  'PV90': 'bg-purple-100 text-purple-700',  // Purple for planning phase
  'UB': 'bg-blue-100 text-blue-700',        // Blue for unbooked
  'WB': 'bg-yellow-100 text-yellow-700',    // Yellow for waiting for booking
  'WIP': 'bg-blue-100 text-blue-700',       // Blue for work in progress
  'QF': 'bg-orange-100 text-orange-700',    // Orange for quality check
  'Completed': 'bg-green-100 text-green-700', // Green for completed
};

// Status descriptions
export const PROJECT_STATUS_DESCRIPTIONS: Record<ProjectStatus, string> = {
  'PV75': 'PV75',
  'PV90': 'PV90',
  'UB': 'UB',
  'WB': 'WB',
  'WIP': 'WIP',
  'QF': 'QF',
  'Completed': 'Completed',
};

// Status transition rules and prerequisites
export interface StatusPrerequisites {
  canAssignTeam: boolean;
  canAssignTrailer: boolean;
  canSetupLogistics: boolean;
  canSchedule: boolean;
  canEditWindows: boolean;
  canUploadQualityForm: boolean;
  requiredFields: string[];
}

export const STATUS_PREREQUISITES: Record<ProjectStatus, StatusPrerequisites> = {
  'PV75': {
    canAssignTeam: false,
    canAssignTrailer: false,
    canSetupLogistics: false,
    canSchedule: false,
    canEditWindows: false,
    canUploadQualityForm: false,
    requiredFields: ['name', 'client', 'location', 'startDate', 'endDate']
  },
  'PV90': {
    canAssignTeam: false,
    canAssignTrailer: false,
    canSetupLogistics: false,
    canSchedule: false,
    canEditWindows: false,
    canUploadQualityForm: false,
    requiredFields: ['name', 'client', 'location', 'startDate', 'endDate', 'description']
  },
  'UB': {
    canAssignTeam: false,
    canAssignTrailer: false,
    canSetupLogistics: false,
    canSchedule: false,
    canEditWindows: false,
    canUploadQualityForm: false,
    requiredFields: ['name', 'client', 'location', 'startDate', 'endDate', 'description']
  },
  'WB': {
    canAssignTeam: true,
    canAssignTrailer: true,
    canSetupLogistics: true,
    canSchedule: false,
    canEditWindows: false,
    canUploadQualityForm: false,
    requiredFields: ['name', 'client', 'location', 'startDate', 'endDate', 'description', 'assignedTeam', 'assignedTrailer']
  },
  'WIP': {
    canAssignTeam: true,
    canAssignTrailer: true,
    canSetupLogistics: true,
    canSchedule: true,
    canEditWindows: true,
    canUploadQualityForm: false,
    requiredFields: ['name', 'client', 'location', 'startDate', 'endDate', 'description', 'assignedTeam', 'assignedTrailer']
  },
  'QF': {
    canAssignTeam: true,
    canAssignTrailer: true,
    canSetupLogistics: true,
    canSchedule: true,
    canEditWindows: false,
    canUploadQualityForm: true,
    requiredFields: ['name', 'client', 'location', 'startDate', 'endDate', 'description', 'assignedTeam', 'assignedTrailer']
  },
  'Completed': {
    canAssignTeam: false,
    canAssignTrailer: false,
    canSetupLogistics: false,
    canSchedule: false,
    canEditWindows: false,
    canUploadQualityForm: false,
    requiredFields: ['name', 'client', 'location', 'startDate', 'endDate', 'description', 'assignedTeam', 'assignedTrailer', 'qualityForm']
  }
};

// Valid status transitions
export const STATUS_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  'PV75': ['PV90'],
  'PV90': ['UB'],
  'UB': ['WB'],
  'WB': ['WIP'],
  'WIP': ['QF'],
  'QF': ['Completed'],
  'Completed': [] // No transitions from completed
};

// Utility functions for status management
export const canTransitionTo = (currentStatus: ProjectStatus, targetStatus: ProjectStatus): boolean => {
  return STATUS_TRANSITIONS[currentStatus].includes(targetStatus);
};

export const getNextValidStatuses = (currentStatus: ProjectStatus): ProjectStatus[] => {
  return STATUS_TRANSITIONS[currentStatus];
};

export const getStatusPrerequisites = (status: ProjectStatus): StatusPrerequisites => {
  return STATUS_PREREQUISITES[status];
};
