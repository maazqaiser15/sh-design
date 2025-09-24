export type WindowStatus = 
  | 'Pending' 
  | 'Updated' 
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
}

export interface Window {
  id: string;
  windowName: string;
  filmType: FilmType;
  length: number; // in cm
  width: number; // in cm
  layers: LayerInstallation[];
  status: WindowStatus;
  assignedTeamMembers: string[];
  createdAt: Date;
  updatedAt: Date;
  createdFromSheet?: boolean;
  sheetId?: string;
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
    length: 120,
    width: 80,
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
    sheetId: 'sheet-1'
  },
  {
    id: '2',
    windowName: 'Main Office Window 2',
    filmType: 'Riot',
    length: 120,
    width: 80,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'John Smith', installedAt: new Date('2024-01-15') },
      { layerNumber: 2, layerName: 'Middle Layer', status: 'In Progress' }
    ],
    status: 'In Progress',
    assignedTeamMembers: ['John Smith', 'Ayesha Khan'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    createdFromSheet: true,
    sheetId: 'sheet-1'
  },
  {
    id: '3',
    windowName: 'Main Office Window 3',
    filmType: 'Riot +',
    length: 120,
    width: 80,
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
    sheetId: 'sheet-1'
  },
  {
    id: '4',
    windowName: 'Main Office Window 4',
    filmType: 'Riot -',
    length: 120,
    width: 80,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Pending' }
    ],
    status: 'Pending',
    assignedTeamMembers: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdFromSheet: true,
    sheetId: 'sheet-1'
  },
  {
    id: '5',
    windowName: 'Main Office Window 5',
    filmType: 'BR',
    length: 120,
    width: 80,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'John Smith', installedAt: new Date('2024-01-15') },
      { layerNumber: 2, layerName: 'Middle Layer', status: 'In Progress' }
    ],
    status: 'In Progress',
    assignedTeamMembers: ['John Smith', 'Ayesha Khan'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    createdFromSheet: true,
    sheetId: 'sheet-1'
  },
  {
    id: '6',
    windowName: 'Main Office Window 6',
    filmType: 'PER',
    length: 120,
    width: 80,
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
    sheetId: 'sheet-1'
  },
  {
    id: '7',
    windowName: 'Main Office Window 7',
    filmType: 'BR',
    length: 120,
    width: 80,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'John Smith', installedAt: new Date('2024-01-15') }
    ],
    status: 'Complete',
    assignedTeamMembers: ['John Smith'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdFromSheet: true,
    sheetId: 'sheet-1'
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
  'Updated',
  'In Progress',
  'Complete',
  'Reinstallation Needed'
];
