import { TeamMember } from '../types';
import { TrailerView } from '../types/ganttTypes';

// Team Members Mock Data
export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    role: 'Supervisor',
    projects: [
      {
        projectId: 'proj-1',
        projectName: 'Downtown Corporate Complex',
        status: 'PV90',
        startDate: '2025-09-25',
        endDate: '2025-09-29',
        role: 'Project Lead'
      },
      {
        projectId: 'proj-2',
        projectName: 'Corporate Headquarters Security',
        status: 'WIP',
        startDate: '2025-10-03',
        endDate: '2025-10-10',
        role: 'Supervisor'
      }
    ]
  },
  {
    id: '2',
    name: 'Alex Martin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    role: 'Installer',
    projects: [
      {
        projectId: 'proj-3',
        projectName: 'Luxury Estate Security',
        status: 'UB',
        startDate: '2025-09-26',
        endDate: '2025-10-03',
        role: 'Lead Installer'
      },
      {
        projectId: 'proj-4',
        projectName: 'Tech Park Surveillance',
        status: 'UB',
        startDate: '2025-10-10',
        endDate: '2025-10-14',
        role: 'Senior Installer'
      }
    ]
  },
  {
    id: '3',
    name: 'Maria Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    role: 'Crew Leader',
    projects: [
      {
        projectId: 'proj-5',
        projectName: 'Warehouse Security Installation',
        status: 'WB',
        startDate: '2025-09-28',
        endDate: '2025-10-04',
        role: 'Crew Leader'
      },
      {
        projectId: 'proj-6',
        projectName: 'Financial District Security',
        status: 'WB',
        startDate: '2025-10-07',
        endDate: '2025-10-14',
        role: 'Team Lead'
      }
    ]
  },
  {
    id: '4',
    name: 'David Chen',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    role: 'Lead',
    projects: [
      {
        projectId: 'proj-7',
        projectName: 'House Rep Illinois Residence',
        status: 'WIP',
        startDate: '2025-09-30',
        endDate: '2025-10-07',
        role: 'Project Manager'
      },
      {
        projectId: 'proj-8',
        projectName: 'Stadium Security Reinforcement',
        status: 'WIP',
        startDate: '2025-10-08',
        endDate: '2025-10-18',
        role: 'Project Director'
      }
    ]
  },
  {
    id: '5',
    name: 'Emily Watson',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    role: 'Coordinator',
    projects: [
      {
        projectId: 'proj-9',
        projectName: 'Residential Security Upgrade',
        status: 'PV90',
        startDate: '2025-10-01',
        endDate: '2025-10-05',
        role: 'Project Coordinator'
      },
      {
        projectId: 'proj-10',
        projectName: 'University Campus Security',
        status: 'PV90',
        startDate: '2025-10-12',
        endDate: '2025-10-19',
        role: 'Site Coordinator'
      }
    ]
  },
  {
    id: '6',
    name: 'Michael Brown',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    role: 'Installer',
    projects: [
      {
        projectId: 'proj-11',
        projectName: 'Medical Center Security Upgrade',
        status: 'UB',
        startDate: '2025-10-05',
        endDate: '2025-10-12',
        role: 'Senior Installer'
      },
      {
        projectId: 'proj-12',
        projectName: 'Harbor Freight Security',
        status: 'UB',
        startDate: '2025-10-15',
        endDate: '2025-10-20',
        role: 'Lead Installer'
      }
    ]
  },
  {
    id: '7',
    name: 'Lisa Anderson',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    role: 'Supervisor',
    projects: [
      {
        projectId: 'proj-13',
        projectName: 'Airport Cargo Security',
        status: 'WIP',
        startDate: '2025-10-13',
        endDate: '2025-10-22',
        role: 'Site Supervisor'
      }
    ]
  },
  {
    id: '8',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    role: 'Crew Leader',
    projects: [
      {
        projectId: 'proj-14',
        projectName: 'Embassy Security Upgrade',
        status: 'WB',
        startDate: '2025-10-18',
        endDate: '2025-10-25',
        role: 'Crew Leader'
      }
    ]
  },
  {
    id: '9',
    name: 'Jennifer Taylor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    role: 'Installer',
    projects: [] // Unassigned
  },
  {
    id: '10',
    name: 'Robert Garcia',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
    role: 'Coordinator',
    projects: [
      {
        projectId: 'proj-15',
        projectName: 'Downtown Corporate Complex',
        status: 'PV90',
        startDate: '2025-09-25',
        endDate: '2025-09-29',
        role: 'Project Coordinator'
      }
    ]
  },
  {
    id: '11',
    name: 'Amanda Lee',
    avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
    role: 'Lead',
    projects: [
      {
        projectId: 'proj-16',
        projectName: 'Luxury Estate Security',
        status: 'UB',
        startDate: '2025-09-26',
        endDate: '2025-10-03',
        role: 'Project Director'
      }
    ]
  },
  {
    id: '12',
    name: 'Christopher Davis',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    role: 'Installer',
    projects: [
      {
        projectId: 'proj-17',
        projectName: 'Warehouse Security Installation',
        status: 'WB',
        startDate: '2025-09-28',
        endDate: '2025-10-04',
        role: 'Lead Installer'
      },
      {
        projectId: 'proj-18',
        projectName: 'House Rep Illinois Residence',
        status: 'WIP',
        startDate: '2025-09-30',
        endDate: '2025-10-07',
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
    registrationNumber: 'REG-001-2024',
    status: 'available',
    location: 'Los Angeles, CA',
    assignedProjects: [
      {
        projectId: 'proj-1',
        projectName: 'Downtown Corporate Complex',
        projectStatus: 'PV90',
        startDate: '2025-10-02',
        endDate: '2025-10-06',
        role: 'Primary Equipment'
      },
      {
        projectId: 'proj-2',
        projectName: 'Corporate Headquarters Security',
        projectStatus: 'WIP',
        startDate: '2025-10-03',
        endDate: '2025-10-10',
        role: 'Support Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-2',
    trailerName: 'Beta Trailer',
    registrationNumber: 'REG-002-2024',
    status: 'low',
    location: 'Houston, TX',
    assignedProjects: [
      {
        projectId: 'proj-3',
        projectName: 'Luxury Estate Security',
        projectStatus: 'UB',
        startDate: '2025-10-01',
        endDate: '2025-10-08',
        role: 'Primary Equipment'
      },
      {
        projectId: 'proj-4',
        projectName: 'Tech Park Surveillance',
        projectStatus: 'UB',
        startDate: '2025-10-10',
        endDate: '2025-10-14',
        role: 'Primary Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-3',
    trailerName: 'Gamma Trailer',
    registrationNumber: 'REG-003-2024',
    status: 'unavailable',
    location: 'Miami, FL',
    assignedProjects: [
      {
        projectId: 'proj-5',
        projectName: 'Warehouse Security Installation',
        projectStatus: 'WB',
        startDate: '2025-10-05',
        endDate: '2025-10-11',
        role: 'Primary Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-4',
    trailerName: 'Delta Trailer',
    registrationNumber: 'REG-004-2024',
    status: 'available',
    location: 'New York, NY',
    assignedProjects: [
      {
        projectId: 'proj-6',
        projectName: 'Financial District Security',
        projectStatus: 'WB',
        startDate: '2025-10-07',
        endDate: '2025-10-14',
        role: 'Primary Equipment'
      },
      {
        projectId: 'proj-7',
        projectName: 'House Rep Illinois Residence',
        projectStatus: 'WIP',
        startDate: '2025-10-01',
        endDate: '2025-10-08',
        role: 'Support Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-5',
    trailerName: 'Echo Trailer',
    registrationNumber: 'REG-005-2024',
    status: 'low',
    location: 'Chicago, IL',
    assignedProjects: [
      {
        projectId: 'proj-8',
        projectName: 'Stadium Security Reinforcement',
        projectStatus: 'WIP',
        startDate: '2025-10-08',
        endDate: '2025-10-18',
        role: 'Primary Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-6',
    trailerName: 'Foxtrot Trailer',
    registrationNumber: 'REG-006-2024',
    status: 'available',
    location: 'Phoenix, AZ',
    assignedProjects: [
      {
        projectId: 'proj-9',
        projectName: 'Residential Security Upgrade',
        projectStatus: 'PV90',
        startDate: '2025-10-01',
        endDate: '2025-10-05',
        role: 'Primary Equipment'
      },
      {
        projectId: 'proj-10',
        projectName: 'University Campus Security',
        projectStatus: 'PV90',
        startDate: '2025-10-12',
        endDate: '2025-10-19',
        role: 'Primary Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-7',
    trailerName: 'Golf Trailer',
    registrationNumber: 'REG-007-2024',
    status: 'low',
    location: 'Denver, CO',
    assignedProjects: [
      {
        projectId: 'proj-11',
        projectName: 'Medical Center Security Upgrade',
        projectStatus: 'UB',
        startDate: '2025-10-05',
        endDate: '2025-10-12',
        role: 'Primary Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-8',
    trailerName: 'Hotel Trailer',
    registrationNumber: 'REG-008-2024',
    status: 'available',
    location: 'Seattle, WA',
    assignedProjects: [
      {
        projectId: 'proj-12',
        projectName: 'Harbor Freight Security',
        projectStatus: 'UB',
        startDate: '2025-11-05',
        endDate: '2025-11-10',
        role: 'Primary Equipment'
      },
      {
        projectId: 'proj-13',
        projectName: 'Airport Cargo Security',
        projectStatus: 'WIP',
        startDate: '2025-11-15',
        endDate: '2025-11-25',
        role: 'Support Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-9',
    trailerName: 'India Trailer',
    registrationNumber: 'REG-009-2024',
    status: 'unavailable',
    location: 'Portland, OR',
    assignedProjects: [
      {
        projectId: 'proj-14',
        projectName: 'Embassy Security Upgrade',
        projectStatus: 'WB',
        startDate: '2025-12-01',
        endDate: '2025-12-08',
        role: 'Primary Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-10',
    trailerName: 'Juliet Trailer',
    registrationNumber: 'REG-010-2024',
    status: 'available',
    location: 'Las Vegas, NV',
    assignedProjects: [
      {
        projectId: 'proj-15',
        projectName: 'Downtown Corporate Complex',
        projectStatus: 'PV90',
        startDate: '2025-10-15',
        endDate: '2025-10-19',
        role: 'Support Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-11',
    trailerName: 'Kilo Trailer',
    registrationNumber: 'REG-011-2024',
    status: 'low',
    location: 'Salt Lake City, UT',
    assignedProjects: [
      {
        projectId: 'proj-16',
        projectName: 'Luxury Estate Security',
        projectStatus: 'UB',
        startDate: '2025-10-20',
        endDate: '2025-10-27',
        role: 'Support Equipment'
      }
    ]
  },
  {
    trailerId: 'trailer-12',
    trailerName: 'Lima Trailer',
    registrationNumber: 'REG-012-2024',
    status: 'available',
    location: 'Billings, MT',
    assignedProjects: [
      {
        projectId: 'proj-17',
        projectName: 'Warehouse Security Installation',
        projectStatus: 'WB',
        startDate: '2025-10-25',
        endDate: '2025-10-31',
        role: 'Support Equipment'
      }
    ]
  }
];

// Status Color Mappings
export const PROJECT_STATUS_COLORS = {
  'PV90': 'bg-gray-200 text-gray-800 border-gray-300',
  'UB': 'bg-blue-200 text-blue-800 border-blue-300',
  'WB': 'bg-teal-200 text-teal-800 border-teal-300',
  'WIP': 'bg-amber-200 text-amber-800 border-amber-300',
  'Completed': 'bg-green-200 text-green-800 border-green-300'
} as const;

export const ROLE_COLORS = {
  'Lead': 'bg-red-100 text-red-800 border-red-200',
  'Supervisor': 'bg-purple-100 text-purple-800 border-purple-200',
  'Crew Leader': 'bg-blue-100 text-blue-800 border-blue-200',
  'Installer': 'bg-gray-100 text-gray-800 border-gray-200',
  'Coordinator': 'bg-green-100 text-green-800 border-green-200'
} as const;

export const TRAILER_STATUS_COLORS = {
  'available': 'bg-green-200 text-green-800 border-green-300',
  'low': 'bg-yellow-200 text-yellow-800 border-yellow-300',
  'unavailable': 'bg-red-200 text-red-800 border-red-300'
} as const;