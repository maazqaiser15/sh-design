import { Document, Note, Trailer } from '../../../types';
import { TeamMember } from './teamMembers';
import { LogisticsTravelData } from './logisticsTravel';

// Project Stages
export type ProjectStage = 'PV75' | 'PV90' | 'UB' | 'WB' | 'WIP' | 'QF' | 'QC' | 'Completed';
export type ProjectStatus = 'PV75' | 'PV90' | 'UB' | 'WB' | 'WIP' | 'QF' | 'QC' | 'Completed';

// Project Details Types
export interface ProjectDetails {
  id: string;
  name: string;
  projectId: string;
  stage: ProjectStage;
  status: ProjectStatus;
  description?: string;
  site: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  assignedCoordinator?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  // Additional project information
  industry?: string;
  contactPerson?: {
    name: string;
    phone: string;
  };
  billingContact?: {
    name: string;
    email: string;
    phone: string;
  };
}

// Key Info Cards Data
export interface AssignedTeam {
  members: TeamMember[];
  count: number;
  leadMember?: TeamMember;
}

export interface AssignedTrailer {
  trailer: Trailer;
  inventoryStatus: 'available' | 'unavailable' | 'low';
  lastUpdated: string;
}

export interface LogisticsInfo {
  partner: string;
  eta: string;
  notes: string;
  contactPerson?: string;
  contactPhone?: string;
}

// Checklist Items
export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
  completedAt?: string;
  completedBy?: string;
}

// Project Document (extends base Document)
export interface ProjectDocument extends Document {
  projectId: string;
  category: 'contract' | 'site-map' | 'permit' | 'technical' | 'other';
}

// Project Note (extends base Note)
export interface ProjectNote extends Note {
  projectId: string;
  isInternal: boolean;
}

// Stage-specific data
export interface PreparationStageData {
  assignedTeam: AssignedTeam | null;
  assignedTrailer: AssignedTrailer | null;
  logistics: LogisticsInfo | null;
  logisticsTravel: LogisticsTravelData;
  checklist: ChecklistItem[];
  documents: ProjectDocument[];
  notes: ProjectNote[];
}

// Mock data for development
export const MOCK_PROJECT_DETAILS: ProjectDetails = {
  id: 'proj-001',
  name: 'Marriot Windows Installation',
  projectId: 'TXDA-SJ1BR1-EETUSC01-P20001',
  stage: 'PV90',
  status: 'PV90',
  description: 'Comprehensive security film installation for the new downtown office complex',
  site: '123 Main Street, Downtown',
  startDate: '2024-02-01',
  endDate: '2024-02-15',
  createdAt: '2024-01-15T00:00:00Z',
  updatedAt: '2024-01-20T00:00:00Z',
  assignedCoordinator: {
    id: 'coord-1',
    name: 'Jennifer White',
    email: 'jennifer@company.com',
    phone: '+1-555-0130'
  },
  // Additional project information
  industry: 'Hospitality',
  contactPerson: {
    name: 'Michael Rodriguez',
    phone: '+1-555-0200'
  },
  billingContact: {
    name: 'Sarah Thompson',
    email: 'billing@marriot.com',
    phone: '+1-555-0201'
  }
};

export const MOCK_PREPARATION_DATA: PreparationStageData = {
  assignedTeam: {
    members: [
      {
        id: 'tm-001',
        name: 'John Smith',
        role: 'Lead Supervisor',
        avatar: 'JS',
        site: 'Los Angeles, CA'
      },
      {
        id: 'tm-002',
        name: 'Sarah Johnson',
        role: 'Crew Leader',
        avatar: 'SJ',
        site: 'Chicago, IL'
      },
      {
        id: 'tm-003',
        name: 'Mike Wilson',
        role: 'Installer',
        avatar: 'MW',
        site: 'Houston, TX'
      }
    ],
    count: 3,
    leadMember: {
      id: 'tm-001',
      name: 'John Smith',
      role: 'Lead Supervisor',
      site: 'Los Angeles, CA'
    }
  },
  assignedTrailer: null, // Initially no trailer assigned for PV90, UB, WB stages
  logistics: {
    partner: 'LogiCorp Solutions',
    eta: '2024-01-25T08:00:00Z',
    notes: 'Equipment delivery scheduled for early morning',
    contactPerson: 'Jane Doe',
    contactPhone: '+1-555-0199'
  },
  logisticsTravel: {
    logistics: [],
    travelPlans: []
  },
  checklist: [
    { id: 'check-1', label: 'Team Assigned', completed: false, required: true },
    { id: 'check-2', label: 'Trailer Assigned', completed: false, required: true },
    { id: 'check-3', label: 'Logistics Confirmed', completed: false, required: true },
    { id: 'check-4', label: 'Travel Setup', completed: false, required: true }
  ],
  documents: [
    {
      id: 'doc-1',
      name: 'Site Map - Floor Plan.pdf',
      type: 'application/pdf',
      label: 'site-map',
      size: 2048576,
      url: '/documents/site-map.pdf',
      uploadedAt: '2024-01-15T09:00:00Z',
      uploadedBy: 'John Admin',
      projectId: 'proj-001',
      category: 'site-map'
    },
    {
      id: 'doc-2',
      name: 'Installation Contract.pdf',
      type: 'application/pdf',
      label: 'contract',
      size: 1536000,
      url: '/documents/contract.pdf',
      uploadedAt: '2024-01-16T11:30:00Z',
      uploadedBy: 'Sarah Manager',
      projectId: 'proj-001',
      category: 'contract'
    }
  ],
  notes: [
    {
      id: 'note-1',
      content: 'Client requested additional security measures for the main entrance',
      author: 'John Smith',
      timestamp: '2024-01-20T10:15:00Z',
      createdAt: '2024-01-20T10:15:00Z',
      updatedAt: '2024-01-20T10:15:00Z',
      projectId: 'proj-001',
      isInternal: true,
      attachments: [
        {
          id: 'att-1',
          name: 'security-requirements.pdf',
          type: 'application/pdf',
          size: 2048576,
          url: '/documents/security-requirements.pdf',
          uploadedAt: '2024-01-20T10:20:00Z',
          uploadedBy: 'John Smith'
        }
      ]
    },
    {
      id: 'note-2',
      content: 'Site visit completed. All measurements confirmed.',
      author: 'Sarah Johnson',
      timestamp: '2024-01-19T16:45:00Z',
      createdAt: '2024-01-19T16:45:00Z',
      updatedAt: '2024-01-19T16:45:00Z',
      projectId: 'proj-001',
      isInternal: false,
      attachments: [
        {
          id: 'att-2',
          name: 'site-photos.jpg',
          type: 'image/jpeg',
          size: 1536000,
          url: '/documents/site-photos.jpg',
          uploadedAt: '2024-01-19T16:50:00Z',
          uploadedBy: 'Sarah Johnson'
        },
        {
          id: 'att-3',
          name: 'measurements.xlsx',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          size: 512000,
          url: '/documents/measurements.xlsx',
          uploadedAt: '2024-01-19T16:52:00Z',
          uploadedBy: 'Sarah Johnson'
        }
      ]
    }
  ]
};
