import { TeamMember, Trailer, Document, Note } from '../../../types';
import { ProjectCrewMember } from '../types';

// Project Preparation Types
export interface ProjectPreparationData {
  projectId: string;
  projectName: string;
  vinCode: string;
  status: 'UB' | 'WB' | 'WIP' | 'Completed';
  location: string;
  crew: ProjectCrewMember[];
  assignedTrailer: AssignedTrailer | null;
  checklist: PreparationChecklistItem[];
  travelPlan: TravelPlanDetails;
  documents: Document[];
  notes: Note[];
}

// ProjectCrewMember is imported from the main types file

export interface AssignedTrailer {
  id: string;
  trailerName: string;
  registrationNumber: string;
  location: string;
  inventory: {
    filmSqFt: number;
    toolsSet: boolean;
  };
  requiredFilmQty: number;
  availableFilmQty: number;
}

export interface PreparationChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
}

export interface TravelPlanDetails {
  hotelBooking: boolean;
  travelRequired: boolean;
  travelMethod?: 'air' | 'road';
  numberOfPeople?: number;
  hotelManagerNotified: boolean;
  houseManagerNotified: boolean;
}

export interface TeamAssignmentModalData {
  isOpen: boolean;
  projectId: string;
  selectedMembers: string[];
  filter: 'recommended' | 'all';
}

export interface TrailerAssignmentModalData {
  isOpen: boolean;
  projectId: string;
  selectedTrailer: string | null;
  filmRequired: boolean;
  shipmentReceipt?: File;
}

export interface DocumentUploadData {
  file: File;
  label: DocumentLabel;
  projectId: string;
}

export type DocumentLabel = 
  | 'site-map' 
  | 'contract' 
  | 'excel-sheet' 
  | 'installation-guide' 
  | 'other';

export interface PreparationActionCard {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  actionType: 'assign-team' | 'assign-trailer' | 'travel' | 'documents';
  icon: string;
}

// Mock data for development
export const MOCK_PREPARATION_DATA: ProjectPreparationData = {
  projectId: 'proj-001',
  projectName: 'Downtown Office Complex Security Film Installation',
  vinCode: 'VIN-2024-001',
  status: 'WB',
  location: '123 Main Street, Downtown',
  crew: [
    {
      id: 'crew-1',
      name: 'John Smith',
      avatar: '/avatars/john.jpg',
      designation: 'Lead Installer',
      location: 'Downtown',
      phone: '+1-555-0123',
      productivity: 'Efficient in Installation',
      status: 'available'
    },
    {
      id: 'crew-2',
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      designation: 'Safety Coordinator',
      location: 'Midtown',
      phone: '+1-555-0124',
      productivity: 'Expert in Safety Protocols',
      status: 'available'
    }
  ],
  assignedTrailer: {
    id: 'trailer-001',
    trailerName: 'Alpha Trailer',
    registrationNumber: 'ABC-123',
    location: 'Warehouse A',
    inventory: {
      filmSqFt: 5000,
      toolsSet: true
    },
    requiredFilmQty: 3500,
    availableFilmQty: 5000
  },
  checklist: [
    { id: 'check-1', label: 'Team Assigned', completed: true, required: true },
    { id: 'check-2', label: 'Trailer Assigned', completed: false, required: true },
    { id: 'check-3', label: 'Logistics Planned', completed: false, required: true },
    { id: 'check-4', label: 'Travel Confirmed', completed: false, required: true },
    { id: 'check-5', label: 'Documents Added', completed: false, required: true },
    { id: 'check-6', label: 'Notes Added', completed: false, required: false }
  ],
  travelPlan: {
    hotelBooking: false,
    travelRequired: true,
    travelMethod: 'road',
    numberOfPeople: 3,
    hotelManagerNotified: false,
    houseManagerNotified: false
  },
  documents: [],
  notes: []
};

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'member-1',
    name: 'John Smith',
    designation: 'Lead Installer',
    status: 'available',
    location: 'Downtown',
    phone: '+1-555-0123',
    email: 'john@company.com',
    avatar: '/avatars/john.jpg',
    role: 'installer',
    availability: 'available',
    currentProjects: [],
    productivity: 95
  },
  {
    id: 'member-2',
    name: 'Sarah Johnson',
    designation: 'Safety Coordinator',
    status: 'available',
    location: 'Midtown',
    phone: '+1-555-0124',
    email: 'sarah@company.com',
    avatar: '/avatars/sarah.jpg',
    role: 'safety',
    availability: 'available',
    currentProjects: [],
    productivity: 90
  },
  {
    id: 'member-3',
    name: 'Mike Wilson',
    designation: 'Senior Installer',
    status: 'busy',
    location: 'Uptown',
    phone: '+1-555-0125',
    email: 'mike@company.com',
    avatar: '/avatars/mike.jpg',
    role: 'installer',
    availability: 'busy',
    currentProjects: ['proj-002'],
    productivity: 88
  }
];

export const MOCK_TRAILERS: Trailer[] = [
  {
    id: 'trailer-001',
    trailerName: 'Alpha Trailer',
    registrationNumber: 'ABC-123',
    location: 'Warehouse A',
    inventory: {
      tools: [
        { toolName: 'Installation Kit A', currentStock: 5, threshold: 2, status: 'good' },
        { toolName: 'Safety Equipment', currentStock: 3, threshold: 1, status: 'good' }
      ],
      filmSheets: [
        { sheetType: 'BR', currentStock: 5000, threshold: 1000, status: 'good' },
        { sheetType: 'Riot+', currentStock: 3000, threshold: 500, status: 'good' }
      ]
    },
    status: 'available',
    activityLogs: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'trailer-002',
    trailerName: 'Beta Trailer',
    registrationNumber: 'DEF-456',
    location: 'Warehouse B',
    inventory: {
      tools: [
        { toolName: 'Installation Kit B', currentStock: 2, threshold: 2, status: 'low' },
        { toolName: 'Safety Equipment', currentStock: 1, threshold: 1, status: 'critical' }
      ],
      filmSheets: [
        { sheetType: 'BR', currentStock: 2000, threshold: 1000, status: 'low' },
        { sheetType: 'Riot+', currentStock: 1000, threshold: 500, status: 'low' }
      ]
    },
    status: 'low',
    activityLogs: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];
