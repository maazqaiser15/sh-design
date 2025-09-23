export type ProjectStage = 'PV90' | 'UB' | 'WB' | 'WIP' | 'QF' | 'Completed';

export type SchedulerView = 'day' | 'week' | 'month';
export type SchedulerMode = 'projects' | 'team';

export interface SchedulerProject {
  id: string;
  name: string;
  stage: ProjectStage;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  description?: string;
  client?: string;
  location?: string;
}

export interface SchedulerDateRange {
  start: Date;
  end: Date;
}

export interface ProjectBarProps {
  project: SchedulerProject;
  onProjectClick: (project: SchedulerProject) => void;
  onProjectHover: (project: SchedulerProject | null) => void;
  isHovered: boolean;
}

export interface SchedulerViewProps {
  projects: SchedulerProject[];
  currentDate: Date;
  onProjectClick: (project: SchedulerProject) => void;
  onProjectHover: (project: SchedulerProject | null) => void;
  hoveredProject: SchedulerProject | null;
}

export interface SchedulerHeaderProps {
  currentDate: Date;
  view: SchedulerView;
  mode: SchedulerMode;
  onDateChange: (date: Date) => void;
  onViewChange: (view: SchedulerView) => void;
  onModeChange: (mode: SchedulerMode) => void;
  onTodayClick: () => void;
}