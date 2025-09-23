import { TrailerView } from '../types/ganttTypes';

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
        startDate: '2025-09-25',
        endDate: '2025-09-29',
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
        startDate: '2025-09-26',
        endDate: '2025-10-03',
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
        startDate: '2025-09-28',
        endDate: '2025-10-04',
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
        startDate: '2025-09-30',
        endDate: '2025-10-07',
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
        startDate: '2025-10-15',
        endDate: '2025-10-20',
        role: 'Primary Equipment'
      },
      {
        projectId: 'proj-13',
        projectName: 'Airport Cargo Security',
        projectStatus: 'WIP',
        startDate: '2025-10-13',
        endDate: '2025-10-22',
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
        startDate: '2025-10-18',
        endDate: '2025-10-25',
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
        startDate: '2025-09-26',
        endDate: '2025-09-30',
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
        startDate: '2025-09-26',
        endDate: '2025-10-03',
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
        startDate: '2025-09-28',
        endDate: '2025-10-04',
        role: 'Support Equipment'
      }
    ]
  }
];

export const TRAILER_STATUS_COLORS = {
  'available': 'bg-green-200 text-green-800 border-green-300',
  'low': 'bg-yellow-200 text-yellow-800 border-yellow-300',
  'unavailable': 'bg-red-200 text-red-800 border-red-300'
} as const;
