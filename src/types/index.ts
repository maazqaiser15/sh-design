export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  stage: ProjectStage;
  startDate: string;
  endDate: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  assignedTeam: string[];
  assignedTrailers: string[];
  progress: number;
}

export type ProjectStatus = 'UB' | 'WB' | 'WIP' | 'Completed' | 'completed' | 'on-hold';
export type ProjectStage = 'preparation' | 'execution' | 'completion';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  status: MemberStatus;
  location: string;
  phone: string;
  email: string;
  avatar?: string;
  role: string;
  availability: 'available' | 'busy' | 'unavailable';
  currentProjects: string[];
  productivity: number;
}

export type MemberStatus = 'available' | 'busy' | 'unavailable';

export interface Trailer {
  id: string;
  trailerName: string;
  registrationNumber: string;
  parkingAddress: string;
  state: string;
  city: string;
  inventory: {
    tools: ToolInventoryItem[];
    filmSheets: FilmSheetInventoryItem[];
  };
  status: TrailerStatus;
  activityLogs: ActivityLog[];
  createdAt: string;
  updatedAt: string;
}

export type TrailerStatus = 'available' | 'low' | 'unavailable';

export interface ToolInventoryItem {
  toolName: string;
  currentStock: number;
  threshold: number;
  status: FilmStockStatus;
}

export interface FilmSheetInventoryItem {
  sheetType: FilmSheetType;
  currentStock: number;
  threshold: number;
  status: FilmStockStatus;
}

export type FilmType = 
  | 'Protective Film A'
  | 'Protective Film B' 
  | 'Adhesive Film X'
  | 'Adhesive Film Y'
  | 'Transparent Film'
  | 'Matte Film'
  | 'Specialty Film 1'
  | 'Specialty Film 2';

export type FilmSheetType = 
  | 'BR'
  | 'Riot+'
  | 'Riot'
  | 'Riot -'
  | 'FER'
  | 'Smash'
  | 'Tint NI'
  | 'Tint Incl'
  | 'Anchoring'
  | 'Kevlar'
  | 'Stripping';

export type FilmStockStatus = 'good' | 'low' | 'critical';

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: ActivityLogType;
  description: string;
  user?: string;
  systemGenerated: boolean;
}

export type ActivityLogType = 
  | 'created'
  | 'updated'
  | 'inventory_updated'
  | 'location_changed'
  | 'address_changed'
  | 'state_changed'
  | 'city_changed'
  | 'status_changed'
  | 'note_added';

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  condition: 'good' | 'fair' | 'needs-repair';
}

export interface Document {
  id: string;
  name: string;
  type: string;
  label: DocumentLabel;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
  projectId?: string;
}

export type DocumentLabel = 'contract' | 'site-map' | 'excel-sheet' | 'installation-guide' | 'permit' | 'other';

export interface Note {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
}

export interface TravelPlan {
  id: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  transportation: string;
  accommodation?: string;
  notes?: string;
}

export interface DashboardStats {
  activeProjects: number;
  stagesInProgress: {
    preparation: number;
    execution: number;
    completion: number;
  };
  pendingTasks: number;
  teamUtilization: number;
  availableTrailers: number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  user: string;
  projectId?: string;
  entityId?: string;
}

export type ActivityType = 'project-created' | 'team-assigned' | 'trailer-assigned' | 'task-completed' | 'document-uploaded' | 'note-added';

export interface CalendarEvent {
  id: string;
  projectId: string;
  title: string;
  start: string;
  end: string;
  status: ProjectStatus;
  stage: ProjectStage;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  avatar?: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  module: string;
  actions: ('view' | 'edit' | 'manage')[];
}

export interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
