// Logistics Types
export type LogisticsType = 'Material' | 'Equipment' | 'Vehicle' | 'Other';

export interface LogisticsItem {
  id: string;
  name: string;
  type: LogisticsType;
  description: string;
  quantity: number;
  location: string;
  expectedDate: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Travel Types
export type TravelType = 'Flight' | 'Vehicle' | 'Train' | 'Other';

export interface TravelPlan {
  id: string;
  travelType: TravelType;
  departureLocation: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  assignedTeamMembers: string[]; // Array of team member IDs
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Combined Management Types
export interface LogisticsTravelData {
  logistics: LogisticsItem[];
  travelPlans: TravelPlan[];
}

// Modal Props
export interface AddLogisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (logistics: Omit<LogisticsItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  onEdit?: (id: string, logistics: Omit<LogisticsItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  editingLogistics?: LogisticsItem | null;
}

export interface AddTravelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (travel: Omit<TravelPlan, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  onEdit?: (id: string, travel: Omit<TravelPlan, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => void;
  editingTravel?: TravelPlan | null;
  availableTeamMembers: Array<{ id: string; name: string; role: string }>;
}

// Mock Data
export const MOCK_LOGISTICS: LogisticsItem[] = [
  {
    id: 'log-1',
    name: 'Security Film Sheets',
    type: 'Material',
    description: 'High-grade security film for exterior windows',
    quantity: 500,
    location: 'Downtown Office Complex',
    expectedDate: '2024-12-20',
    createdAt: '2024-12-15T10:00:00Z',
    updatedAt: '2024-12-15T10:00:00Z',
    createdBy: 'Admin User'
  },
  {
    id: 'log-2',
    name: 'Installation Tools',
    type: 'Equipment',
    description: 'Complete set of professional installation tools',
    quantity: 1,
    location: 'Project Site',
    expectedDate: '2024-12-18',
    createdAt: '2024-12-15T11:00:00Z',
    updatedAt: '2024-12-15T11:00:00Z',
    createdBy: 'Admin User'
  }
];

export const MOCK_TRAVEL_PLANS: TravelPlan[] = [
  {
    id: 'travel-1',
    travelType: 'Flight',
    departureLocation: 'Seattle, WA',
    destination: 'New York, NY',
    departureDate: '2024-12-22',
    returnDate: '2024-12-28',
    assignedTeamMembers: ['member-1', 'member-2'],
    createdAt: '2024-12-15T12:00:00Z',
    updatedAt: '2024-12-15T12:00:00Z',
    createdBy: 'Admin User'
  }
];
