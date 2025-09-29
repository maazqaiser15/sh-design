export type WindowStatus = 
  | 'Pending' 
  | 'In Progress' 
  | 'Complete' 
  | 'Reinstallation Needed';

export type FilmType = 
  | 'BR' 
  | 'Riot' 
  | 'Riot +' 
  | 'Riot -' 
  | 'PER' 
  | 'Smash' 
  | 'FER' 
  | 'Custom';

export interface LayerInstallation {
  layerNumber: number;
  layerName: string;
  status: 'Pending' | 'In Progress' | 'Installed' | 'Reinstallation Needed';
  installedBy?: string;
  installedAt?: Date;
  notes?: string;
  reinstallationMarkedBy?: string;
  reinstallationMarkedAt?: Date;
  reinstallationCompletedBy?: string;
  reinstallationCompletedAt?: Date;
}

export interface Window {
  id: string;
  windowName: string;
  filmType: FilmType;
  length: number; // in inches
  width: number; // in inches
  layers: LayerInstallation[];
  status: WindowStatus;
  assignedTeamMembers: string[];
  createdAt: Date;
  updatedAt: Date;
  createdFromSheet?: boolean;
  sheetId?: string;
  interiorCount?: number; // Count of interior layers
  exteriorCount?: number; // Count of exterior layers
  color?: string; // Window color
  tint?: string; // Window tint
  stripping?: boolean; // Whether stripping is required
  buildingName?: string; // Building name for filtering
}

export interface TakeOffSheet {
  id: string;
  fileName: string;
  uploadedAt: Date;
  processedAt?: Date;
  status: 'Processing' | 'Completed' | 'Failed';
  windowsCreated: number;
  totalRows: number;
  errors?: string[];
}

export interface WindowFilters {
  search: string;
  filmType: FilmType | 'All';
  status: WindowStatus | 'All';
  layers: number | 'All';
  assignedMember: string | 'All';
}

export interface WindowViewMode {
  type: 'list' | 'grid';
}

// Mock data for development
export const MOCK_WINDOWS: Window[] = [
  {
    id: '1',
    windowName: 'Main Office Window 1',
    filmType: 'BR',
    length: 48,
    width: 32,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'John Smith', installedAt: new Date('2024-01-15') },
      { layerNumber: 2, layerName: 'Middle Layer', status: 'Installed', installedBy: 'Ayesha Khan', installedAt: new Date('2024-01-16') },
      { layerNumber: 3, layerName: 'Exterior Layer', status: 'Installed', installedBy: 'Mike Lee', installedAt: new Date('2024-01-17') }
    ],
    status: 'Complete',
    assignedTeamMembers: ['John Smith', 'Ayesha Khan', 'Mike Lee'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-17'),
    createdFromSheet: true,
    sheetId: 'sheet-1',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'Black',
    tint: 'None',
    stripping: false
  },
  {
    id: '2',
    windowName: 'Main Office Window 2',
    filmType: 'Riot',
    length: 48,
    width: 32,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'John Smith', installedAt: new Date('2024-01-15') },
      { layerNumber: 2, layerName: 'Middle Layer', status: 'In Progress' }
    ],
    status: 'In Progress',
    assignedTeamMembers: ['John Smith', 'Ayesha Khan'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    createdFromSheet: true,
    sheetId: 'sheet-1',
    interiorCount: 1,
    exteriorCount: 0,
    color: 'White',
    tint: 'Light',
    stripping: true
  },
  {
    id: '3',
    windowName: 'Main Office Window 3',
    filmType: 'Riot +',
    length: 48,
    width: 32,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'John Smith', installedAt: new Date('2024-01-15') },
      { layerNumber: 2, layerName: 'Middle Layer', status: 'Installed', installedBy: 'Ayesha Khan', installedAt: new Date('2024-01-16') },
      { layerNumber: 3, layerName: 'Exterior Layer', status: 'Reinstallation Needed', installedBy: 'Mike Lee', installedAt: new Date('2024-01-17'), notes: 'Quality issue detected' }
    ],
    status: 'Reinstallation Needed',
    assignedTeamMembers: ['John Smith', 'Ayesha Khan', 'Mike Lee'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18'),
    createdFromSheet: true,
    sheetId: 'sheet-1',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'Black',
    tint: 'Dark',
    stripping: false
  },
  {
    id: '4',
    windowName: 'Main Office Window 4',
    filmType: 'Riot -',
    length: 48,
    width: 32,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Pending' }
    ],
    status: 'Pending',
    assignedTeamMembers: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdFromSheet: true,
    sheetId: 'sheet-1',
    interiorCount: 1,
    exteriorCount: 0
  },
  {
    id: '5',
    windowName: 'Main Office Window 5',
    filmType: 'BR',
    length: 48,
    width: 32,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'John Smith', installedAt: new Date('2024-01-15') },
      { layerNumber: 2, layerName: 'Middle Layer', status: 'In Progress' }
    ],
    status: 'In Progress',
    assignedTeamMembers: ['John Smith', 'Ayesha Khan'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    createdFromSheet: true,
    sheetId: 'sheet-1',
    interiorCount: 1,
    exteriorCount: 0
  },
  {
    id: '6',
    windowName: 'Main Office Window 6',
    filmType: 'PER',
    length: 48,
    width: 32,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'John Smith', installedAt: new Date('2024-01-15') },
      { layerNumber: 2, layerName: 'Middle Layer', status: 'Installed', installedBy: 'Ayesha Khan', installedAt: new Date('2024-01-16') },
      { layerNumber: 3, layerName: 'Exterior Layer', status: 'Installed', installedBy: 'Mike Lee', installedAt: new Date('2024-01-17') }
    ],
    status: 'Complete',
    assignedTeamMembers: ['John Smith', 'Ayesha Khan', 'Mike Lee'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-17'),
    createdFromSheet: true,
    sheetId: 'sheet-1',
    interiorCount: 1,
    exteriorCount: 1
  },
  {
    id: '7',
    windowName: 'Main Office Window 7',
    filmType: 'BR',
    length: 48,
    width: 32,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'John Smith', installedAt: new Date('2024-01-15') }
    ],
    status: 'Complete',
    assignedTeamMembers: ['John Smith'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdFromSheet: true,
    sheetId: 'sheet-1',
    interiorCount: 1,
    exteriorCount: 0
  }
];

export const MOCK_TEAM_MEMBERS = [
  'John Smith',
  'Ayesha Khan', 
  'Mike Lee',
  'Sarah Johnson',
  'David Chen',
  'Emily Rodriguez'
];

export const FILM_TYPE_OPTIONS: FilmType[] = [
  'BR',
  'Riot',
  'Riot +',
  'Riot -',
  'PER',
  'Smash',
  'FER',
  'Custom'
];

export const WINDOW_STATUS_OPTIONS: WindowStatus[] = [
  'Pending',
  'In Progress',
  'Complete',
  'Reinstallation Needed'
];
