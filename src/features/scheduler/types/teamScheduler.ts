import { ProjectStage } from '../types';

export interface TeamMemberAssignment {
  id: string;
  name: string;
  role: 'Lead' | 'Supervisor' | 'Crew Leader' | 'Installer' | 'Project Coordinator';
  avatar?: string;
  projects: TeamMemberProject[];
}

export interface TeamMemberProject {
  id: string;
  name: string;
  stage: ProjectStage;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  role: string; // Role in this specific project
  color: string; // Color for the bar
}

export interface TeamSchedulerViewProps {
  currentDate: Date;
  teamMembers: TeamMemberAssignment[];
  onProjectClick: (project: TeamMemberProject) => void;
  onProjectHover: (project: TeamMemberProject | null) => void;
  hoveredProject: TeamMemberProject | null;
}

export interface TimelineBarProps {
  project: TeamMemberProject;
  startDate: Date;
  endDate: Date;
  weekStart: Date;
  weekEnd: Date;
  onProjectClick: (project: TeamMemberProject) => void;
  onProjectHover: (project: TeamMemberProject | null) => void;
  isHovered: boolean;
}

export interface TeamMemberRowProps {
  member: TeamMemberAssignment;
  weekStart: Date;
  weekEnd: Date;
  onProjectClick: (project: TeamMemberProject) => void;
  onProjectHover: (project: TeamMemberProject | null) => void;
  hoveredProject: TeamMemberProject | null;
}
