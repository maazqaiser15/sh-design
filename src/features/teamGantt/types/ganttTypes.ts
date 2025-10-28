export type ViewMode = 'day' | 'week' | 'month' | 'year';
export type LayoutMode = 'team' | 'project' | 'trailer';

export interface TeamGanttFilters {
  status: string[];
  assignedUsers: string[];
  trailerProjects: string[];
  trailerAvailability: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: "Lead" | "Supervisor" | "Project Coordinator" | "Crew Leader" | "Installer";
  availability: "Available" | "Unavailable" | "Out of office" | "Inactive";
  projects: Project[];
  outOfOfficeDuration?: {
    startDate: string;
    endDate: string;
    reason: string;
  };
}

export interface Project {
  projectId: string;
  projectName: string;
  status: "D75" | "PV90" | "UB" | "WB" | "WIP" | "QF" | "Completed";
  startDate: string; // ISO format
  endDate: string;   // ISO format
  role: string;      // Role in the project
  vinCode?: string;  // VIN code for the project
}

export interface ProjectView {
  projectId: string;
  projectName: string;
  status: "D75" | "PV90" | "UB" | "WB" | "WIP" | "QF" | "Completed";
  startDate: string;
  endDate: string;
  vinCode?: string;
  assignedMembers: {
    memberId: string;
    memberName: string;
    role: string;
    projectRole: string;
  }[];
}

export interface TrailerView {
  trailerId: string;
  trailerName: string;
  registrationNumber: string;
  status: "available" | "low" | "unavailable";
  unavailableUntil?: string; // Date string if unavailable
  location: string;
  assignedProjects: {
    projectId: string;
    projectName: string;
    projectStatus: "D75" | "PV90" | "UB" | "WB" | "WIP" | "QF" | "Completed";
    startDate: string;
    endDate: string;
    role: string;
  }[];
}

export interface TimelineCell {
  date: Date;
  label: string;
  isToday?: boolean;
  isCurrentPeriod?: boolean;
}

export interface ProjectBarProps {
  project: Project;
  startPosition: number; // Percentage from left
  width: number;         // Percentage width
  top: number;           // Vertical position in pixels
  height: number;        // Height in pixels
  onHover: (project: Project | null) => void;
  onClick: (project: Project) => void;
  isHovered: boolean;
}

export interface TeamRowProps {
  member: TeamMember;
  viewMode: ViewMode;
  currentDate: Date;
  onProjectHover: (project: Project | null) => void;
  onProjectClick: (project: Project) => void;
  onMemberClick?: (member: TeamMember) => void;
  hoveredProject: Project | null;
}

export interface ProjectRowProps {
  project: ProjectView;
  viewMode: ViewMode;
  currentDate: Date;
  onProjectHover: (project: Project | null) => void;
  onProjectClick: (project: Project) => void;
  hoveredProject: Project | null;
}

export interface TrailerRowProps {
  trailer: TrailerView;
  viewMode: ViewMode;
  currentDate: Date;
  onProjectHover: (project: Project | null) => void;
  onProjectClick: (project: Project) => void;
  hoveredProject: Project | null;
  onTrailerClick?: (trailer: TrailerView) => void;
}

export interface TimelineHeaderProps {
  viewMode: ViewMode;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  layoutMode: 'team' | 'project' | 'trailer';
  filters?: TeamGanttFilters;
  onFiltersChange?: (filters: TeamGanttFilters) => void;
  allUsers?: Array<{ id: string; name: string }>;
}

export interface TeamGanttProps {
  teamMembers: TeamMember[];
  currentDate: Date;
  viewMode: ViewMode;
  layoutMode: LayoutMode;
  onDateChange: (date: Date) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onLayoutModeChange: (mode: LayoutMode) => void;
  onProjectHover: (project: Project | null) => void;
  onProjectClick: (project: Project) => void;
  hoveredProject: Project | null;
  filters?: TeamGanttFilters;
  onFiltersChange?: (filters: TeamGanttFilters) => void;
}
