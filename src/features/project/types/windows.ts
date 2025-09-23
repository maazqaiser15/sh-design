// Window Management Types

export type WindowStatus = 'Pending' | 'Updated' | 'In Progress' | 'Complete' | 'Reinstallation Needed';

export type FilmType = 'BR' | 'Riot' | 'Riot+' | 'Security' | 'Privacy' | 'Decorative' | 'Other';

export interface LayerInstallation {
  layerNumber: number;
  layerName: string;
  installerName: string;
  installerId: string;
  installedAt: string;
  status: 'installed' | 'reinstallation_needed';
}

export interface Window {
  id: string;
  windowName: string;
  filmType: FilmType;
  length: number;
  width: number;
  layers: number;
  status: WindowStatus;
  assignedTeamMembers: string[]; // Array of team member IDs
  installationBreakdown: LayerInstallation[];
  createdAt: string;
  updatedAt: string;
  projectId: string;
}

export interface WindowFilters {
  filmType: FilmType | 'All';
  status: WindowStatus | 'All';
  assignedTeamMember: string | 'All';
}

export interface WindowViewMode {
  type: 'list' | 'grid';
}

// Mock data for development
export const MOCK_WINDOWS: Window[] = [
  // Original 3 windows
  {
    id: 'win-001',
    windowName: 'Main Office Window 1',
    filmType: 'BR',
    length: 120,
    width: 80,
    layers: 3,
    status: 'Pending',
    assignedTeamMembers: [],
    installationBreakdown: [],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    projectId: 'proj-001'
  },
  {
    id: 'win-002',
    windowName: 'Conference Room Window',
    filmType: 'Riot+',
    length: 200,
    width: 100,
    layers: 2,
    status: 'In Progress',
    assignedTeamMembers: ['tm-001', 'tm-002'],
    installationBreakdown: [
      {
        layerNumber: 1,
        layerName: 'Interior Layer',
        installerName: 'John Smith',
        installerId: 'tm-001',
        installedAt: '2024-01-16T09:00:00Z',
        status: 'installed'
      }
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T09:00:00Z',
    projectId: 'proj-001'
  },
  {
    id: 'win-003',
    windowName: 'Reception Area Window',
    filmType: 'Security',
    length: 150,
    width: 90,
    layers: 1,
    status: 'Complete',
    assignedTeamMembers: ['tm-003'],
    installationBreakdown: [
      {
        layerNumber: 1,
        layerName: 'Security Film',
        installerName: 'Mike Lee',
        installerId: 'tm-003',
        installedAt: '2024-01-16T14:30:00Z',
        status: 'installed'
      }
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    projectId: 'proj-001'
  },
  // Additional 57 windows
  ...Array.from({ length: 57 }, (_, i) => {
    const windowNumber = i + 4;
    const filmTypes: FilmType[] = ['BR', 'Riot', 'Riot+', 'Security', 'Privacy', 'Decorative', 'Other'];
    const statuses: WindowStatus[] = ['Pending', 'Updated', 'In Progress', 'Complete', 'Reinstallation Needed'];
    const teamMembers = ['tm-001', 'tm-002', 'tm-003', 'tm-004', 'tm-005'];
    
    const filmType = filmTypes[i % filmTypes.length];
    const status = statuses[i % statuses.length];
    const layers = Math.floor(Math.random() * 3) + 1;
    const hasTeamMembers = status === 'In Progress' || status === 'Complete';
    const assignedTeamMembers = hasTeamMembers ? teamMembers.slice(0, Math.floor(Math.random() * 3) + 1) : [];
    
    const installationBreakdown = status === 'Complete' || status === 'In Progress' ? 
      Array.from({ length: layers }, (_, layerIndex) => ({
        layerNumber: layerIndex + 1,
        layerName: `Layer ${layerIndex + 1}`,
        installerName: `Installer ${String.fromCharCode(65 + layerIndex)}`,
        installerId: `tm-${String(layerIndex + 1).padStart(3, '0')}`,
        installedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: Math.random() > 0.1 ? 'installed' as const : 'reinstallation_needed' as const
      })) : [];

    return {
      id: `win-${String(windowNumber).padStart(3, '0')}`,
      windowName: `Window ${windowNumber}`,
      filmType,
      length: Math.floor(Math.random() * 200) + 80,
      width: Math.floor(Math.random() * 120) + 60,
      layers,
      status,
      assignedTeamMembers,
      installationBreakdown,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      projectId: 'proj-001'
    };
  })
];

export const FILM_TYPE_OPTIONS: { value: FilmType; label: string }[] = [
  { value: 'BR', label: 'BR' },
  { value: 'Riot', label: 'Riot' },
  { value: 'Riot+', label: 'Riot+' },
  { value: 'Security', label: 'Security' },
  { value: 'Privacy', label: 'Privacy' },
  { value: 'Decorative', label: 'Decorative' },
  { value: 'Other', label: 'Other' }
];

export const WINDOW_STATUS_COLORS: Record<WindowStatus, string> = {
  'Pending': 'bg-gray-100 text-gray-800',
  'Updated': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  'Complete': 'bg-green-100 text-green-800',
  'Reinstallation Needed': 'bg-red-100 text-red-800'
};

export const WINDOW_STATUS_DESCRIPTIONS: Record<WindowStatus, string> = {
  'Pending': 'Pending',
  'Updated': 'Updated',
  'In Progress': 'In Progress',
  'Complete': 'Complete',
  'Reinstallation Needed': 'Reinstallation Needed'
};
