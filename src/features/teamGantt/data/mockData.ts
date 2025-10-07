import { TeamMember } from '../types';
import { TrailerView } from '../types/ganttTypes';

// Team Members Mock Data
export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-001',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'Supervisor',
    availability: 'Available',
    projects: [
      {
        projectId: 'proj-1',
        projectName: 'Marriott Windows Installation',
        status: 'PV90',
        startDate: '2025-10-01',
        endDate: '2025-10-28',
        role: 'Project Lead',
        vinCode: 'TXDA-SJ1BR1-EETUSC01-P20001'
      }
    ]
  },
  {
    id: 'tm-002',
    name: 'Alex Martin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'Installer',
    availability: 'Available',
    projects: [
      {
        projectId: 'proj-9',
        projectName: 'New Office Building Security',
        status: 'WIP',
        startDate: '2025-09-30',
        endDate: '2025-10-10',
        role: 'Installer',
        vinCode: 'TXDA-SJ1BR1-EETUSC01-P20009'
      }
    ]
  },
  {
    id: 'tm-003',
    name: 'Maria Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'Crew Leader',
    availability: 'Available',
    projects: [
      {
        projectId: 'proj-9',
        projectName: 'New Office Building Security',
        status: 'WIP',
        startDate: '2025-09-30',
        endDate: '2025-10-10',
        role: 'Crew Leader',
        vinCode: 'TXDA-SJ1BR1-EETUSC01-P20009'
      }
    ]
  },
  {
    id: 'tm-004',
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'Lead',
    availability: 'Available',
    projects: [
      {
        projectId: 'proj-4',
        projectName: 'City Mall Glass Fitting',
        status: 'QF',
        startDate: '2025-10-07',
        endDate: '2025-10-28',
        role: 'Project Manager',
        vinCode: 'TXDA-SJ1BR1-EETUSC01-P20004'
      }
    ]
  },
  {
    id: 'tm-005',
    name: 'Emily Watson',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    role: 'Project Coordinator',
    availability: 'Available',
    projects: [
      {
        projectId: 'proj-5',
        projectName: 'Downtown Tower Maintenance',
        status: 'Completed',
        startDate: '2025-10-09',
        endDate: '2025-10-30',
        role: 'Project Coordinator',
        vinCode: 'TXDA-SJ1BR1-EETUSC01-P20005'
      }
    ]
  },
  {
    id: 'tm-006',
    name: 'Michael Brown',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: 'Installer',
    availability: 'Out of office',
    outOfOfficeDuration: {
      startDate: '2024-10-15',
      endDate: '2024-10-30',
      reason: 'Vacation'
    },
    projects: []
  },
  {
    id: 'tm-007',
    name: 'Lisa Anderson',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    role: 'Supervisor',
    availability: 'Available',
    projects: [
      {
        projectId: 'proj-7',
        projectName: 'Harbor Lighting Project',
        status: 'WB',
        startDate: '2025-10-11',
        endDate: '2025-10-25',
        role: 'Site Supervisor'
      }
    ]
  },
  {
    id: 'tm-008',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    role: 'Crew Leader',
    availability: 'Unavailable',
    projects: [
      {
        projectId: 'proj-8',
        projectName: 'Tech Park Renovation',
        status: 'PV90',
        startDate: '2025-10-12',
        endDate: '2025-11-02',
        role: 'Crew Leader'
      }
    ]
  },
  {
    id: 'tm-009',
    name: 'Jennifer Taylor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    role: 'Installer',
    availability: 'Available',
    projects: [
      {
        projectId: 'proj-9',
        projectName: 'Greenwood Hotel Refurbish',
        status: 'UB',
        startDate: '2025-10-13',
        endDate: '2025-11-10',
        role: 'Installer'
      }
    ]
  },
  {
    id: 'tm-010',
    name: 'Robert Garcia',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
    role: 'Project Coordinator',
    availability: 'Available',
    projects: [
      {
        projectId: 'proj-10',
        projectName: 'Central Plaza Flooring',
        status: 'WIP',
        startDate: '2025-10-14',
        endDate: '2025-10-21',
        role: 'Project Coordinator'
      }
    ]
  },
  {
    id: 'tm-011',
    name: 'Amanda Lee',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    role: 'Lead',
    availability: 'Out of office',
    projects: [
      {
        projectId: 'proj-11',
        projectName: 'Ocean View Apartments',
        status: 'PV75',
        startDate: '2025-10-15',
        endDate: '2025-11-05',
        role: 'Project Director'
      }
    ]
  },
  {
    id: 'tm-012',
    name: 'Christopher Davis',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    role: 'Installer',
    availability: 'Available',
    projects: [
      {
        projectId: 'proj-12',
        projectName: 'City Hall Glass Replacement',
        status: 'WB',
        startDate: '2025-10-16',
        endDate: '2025-11-12',
        role: 'Lead Installer'
      },
      {
        projectId: 'proj-13',
        projectName: 'Sunset Resort Installation',
        status: 'QF',
        startDate: '2025-10-17',
        endDate: '2025-11-28',
        role: 'Senior Installer'
      }
    ]
  }
];

// Trailers Mock Data
export const MOCK_TRAILERS: TrailerView[] = [
  {
    trailerId: 'trailer-1',
    trailerName: 'Alpha Trailer',
    registrationNumber: 'TXDA-SJ1BR1-EETUSC01-P10001',
    status: 'available',
    location: 'Vancouver, WA',
    assignedProjects: [
      {
        projectId: 'proj-9',
        projectName: 'New Office Building Security',
        projectStatus: 'WIP',
        startDate: '2025-09-30',
        endDate: '2025-10-10',
        role: 'Primary Equipment',
        vinCode: 'TXDA-SJ1BR1-EETUSC01-P20009'
      }
    ]
  },
  {
    trailerId: 'trailer-2',
    trailerName: 'Beta Trailer',
    registrationNumber: 'TXDA-SJ1BR1-EETUSC01-P10002',
    status: 'low',
    location: 'Houston, TX',
    assignedProjects: [
      {
        projectId: 'proj-2',
        projectName: 'Hilton Lobby Renovation',
        projectStatus: 'UB',
        startDate: '2025-10-02',
        endDate: '2025-10-15',
        role: 'Primary Equipment',
        vinCode: 'TXDA-SJ1BR1-EETUSC01-P20002'
      }
    ]
  },
  {
    trailerId: 'trailer-3',
    trailerName: 'Gamma Trailer',
    registrationNumber: 'TXDA-SJ1BR1-EETUSC01-P10003',
    status: 'unavailable',
    unavailableUntil: '2024-12-20T00:00:00Z',
    location: 'Miami, FL',
    assignedProjects: [
      {
        projectId: 'proj-3',
        projectName: 'Safe Haven Office Setup',
        projectStatus: 'WIP',
        startDate: '2025-10-03',
        endDate: '2025-11-14',
        role: 'Primary Equipment',
        vinCode: 'TXDA-SJ1BR1-EETUSC01-P20003'
      }
    ]
  },
  {
    trailerId: 'trailer-4',
    trailerName: 'Delta Trailer',
    registrationNumber: 'TXDA-SJ1BR1-EETUSC01-P10004',
    status: 'available',
    location: 'New York, NY',
    assignedProjects: [
      {
        projectId: 'proj-4',
        projectName: 'City Mall Glass Fitting',
        projectStatus: 'QF',
        startDate: '2025-10-07',
        endDate: '2025-10-28',
        role: 'Support Equipment',
        vinCode: 'TXDA-SJ1BR1-EETUSC01-P20004'
      }
    ]
  },
  {
    trailerId: 'trailer-5',
    trailerName: 'Echo Trailer',
    registrationNumber: 'TXDA-SJ1BR1-EETUSC01-P10005',
    status: 'low',
    location: 'Chicago, IL',
    assignedProjects: [
      {
        projectId: 'proj-5',
        projectName: 'Downtown Tower Maintenance',
        projectStatus: 'Completed',
        startDate: '2025-10-09',
        endDate: '2025-10-30',
        role: 'Primary Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-6',
    trailerName: 'Foxtrot Trailer',
    registrationNumber: 'TXDA-SJ1BR1-EETUSC01-P10006',
    status: 'available',
    location: 'Phoenix, AZ',
    assignedProjects: [
      {
        projectId: 'proj-6',
        projectName: 'Airport Security Upgrade',
        projectStatus: 'PV75',
        startDate: '2025-10-10',
        endDate: '2025-10-17',
        role: 'Primary Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-7',
    trailerName: 'Golf Trailer',
    registrationNumber: 'TXDA-SJ1BR1-EETUSC01-P10007',
    status: 'low',
    location: 'Denver, CO',
    assignedProjects: [
      {
        projectId: 'proj-7',
        projectName: 'Harbor Lighting Project',
        projectStatus: 'WB',
        startDate: '2025-10-11',
        endDate: '2025-10-25',
        role: 'Primary Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-8',
    trailerName: 'Hotel Trailer',
    registrationNumber: 'TXDA-SJ1BR1-EETUSC01-P10008',
    status: 'available',
    location: 'Seattle, WA',
    assignedProjects: [
      {
        projectId: 'proj-8',
        projectName: 'Tech Park Renovation',
        projectStatus: 'PV90',
        startDate: '2025-10-12',
        endDate: '2025-11-02',
        role: 'Primary Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-9',
    trailerName: 'India Trailer',
    registrationNumber: 'TXDA-SJ1BR1-EETUSC01-P10009',
    status: 'unavailable',
    unavailableUntil: '2024-12-30T00:00:00Z',
    location: 'Portland, OR',
    assignedProjects: [
      {
        projectId: 'proj-9',
        projectName: 'Greenwood Hotel Refurbish',
        projectStatus: 'UB',
        startDate: '2025-10-13',
        endDate: '2025-11-10',
        role: 'Primary Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-10',
    trailerName: 'Juliet Trailer',
    registrationNumber: 'TXDA-SJ1BR1-EETUSC01-P10010',
    status: 'available',
    location: 'Las Vegas, NV',
    assignedProjects: [
      {
        projectId: 'proj-10',
        projectName: 'Central Plaza Flooring',
        projectStatus: 'WIP',
        startDate: '2025-10-14',
        endDate: '2025-10-21',
        role: 'Support Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-11',
    trailerName: 'Kilo Trailer',
    registrationNumber: 'TXDA-SJ1BR1-EETUSC01-P10011',
    status: 'low',
    location: 'Salt Lake City, UT',
    assignedProjects: [
      {
        projectId: 'proj-11',
        projectName: 'Ocean View Apartments',
        projectStatus: 'PV75',
        startDate: '2025-10-15',
        endDate: '2025-11-05',
        role: 'Support Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-12',
    trailerName: 'Lima Trailer',
    registrationNumber: 'TXDA-SJ1BR1-EETUSC01-P10012',
    status: 'available',
    location: 'Billings, MT',
    assignedProjects: [
      {
        projectId: 'proj-12',
        projectName: 'City Hall Glass Replacement',
        projectStatus: 'WB',
        startDate: '2025-10-16',
        endDate: '2025-11-12',
        role: 'Support Equipment'
      }
    ]
  }
];

// Status Color Mappings
export const PROJECT_STATUS_COLORS = {
  'PV90': 'bg-gray-200 text-gray-800 border-gray-300',
  'PV75': 'bg-green-200 text-green-800 border-green-300',
  'UB': 'bg-blue-200 text-blue-800 border-blue-300',
  'WB': 'bg-teal-200 text-teal-800 border-teal-300',
  'WIP': 'bg-amber-200 text-amber-800 border-amber-300',
  'QF': 'bg-red-200 text-red-800 border-red-300',
  'Completed': 'bg-green-200 text-green-800 border-green-300'
} as const;

export const ROLE_COLORS = {
  'Lead': 'bg-red-100 text-red-800 border-red-200',
  'Supervisor': 'bg-purple-100 text-purple-800 border-purple-200',
  'Project Coordinator': 'bg-green-100 text-green-800 border-green-200',
  'Crew Leader': 'bg-blue-100 text-blue-800 border-blue-200',
  'Installer': 'bg-gray-100 text-gray-800 border-gray-200'
} as const;

export const TRAILER_STATUS_COLORS = {
  'available': 'bg-green-200 text-green-800 border-green-300',
  'low': 'bg-yellow-200 text-yellow-800 border-yellow-300',
  'unavailable': 'bg-red-200 text-red-800 border-red-300'
} as const;

export const AVAILABILITY_COLORS = {
  'Available': 'bg-green-100 text-green-800 border-green-200',
  'Unavailable': 'bg-red-100 text-red-800 border-red-200',
  'Out of office': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Inactive': 'bg-gray-100 text-gray-800 border-gray-200'
} as const;