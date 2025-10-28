export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: "Lead" | "Supervisor" | "Project Coordinator" | "Crew Leader" | "Installer";
  availability: "Available" | "Unavailable" | "Out of office" | "Inactive";
  projects: Project[];
}

export interface Project {
  projectId: string;
  projectName: string;
  status: "D75" | "PV90" | "UB" | "WB" | "WIP" | "QF" | "Completed";
  startDate: string; // ISO format
  endDate: string;   // ISO format
  role: string;      // Role in the project
}

export type ViewMode = 'day' | 'week' | 'month' | 'year';

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
  hoveredProject: Project | null;
}

export interface TimelineHeaderProps {
  viewMode: ViewMode;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  layoutMode: 'team' | 'project' | 'trailer';
}

export interface TeamGanttProps {
  teamMembers: TeamMember[];
  currentDate: Date;
  viewMode: ViewMode;
  onDateChange: (date: Date) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onProjectHover: (project: Project | null) => void;
  onProjectClick: (project: Project) => void;
  hoveredProject: Project | null;
}
