// Team Member Types for Team Management Module
export type TeamRole = 'Lead Supervisor' | 'Crew Leader' | 'Installer' | 'Project Coordinator';
export type TeamMemberStatus = 'Available' | 'Unavailable';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  status: TeamMemberStatus;
  unavailableUntil?: string; // DD/MM/YYYY format for unavailable status
  phone: string;
  email: string;
  avatar?: string;
  experience?: number; // years of experience
  specializations?: string[];
  projects?: TeamMemberProject[];
  activityLog?: TeamMemberActivity[];
}

export interface TeamMemberProject {
  id: string;
  name: string;
  stage: string;
  timeline: string;
  assignedDate: string;
}

export interface TeamMemberActivity {
  id: string;
  type: 'assignment' | 'status_change' | 'project_update' | 'other';
  description: string;
  date: string;
  details?: string;
}

export interface AssignedTeamMember extends TeamMember {
  assignedAt: string;
  assignedBy: string;
}

// Mock data for team members
export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-001',
    name: 'John Smith',
    role: 'Lead Supervisor',
    status: 'Available',
    phone: '+1-555-0123',
    email: 'john@company.com',
    avatar: 'JS',
    experience: 8,
    specializations: ['Security Film', 'Window Installation', 'Team Management'],
    projects: [
      {
        id: 'proj-001',
        name: 'Downtown Office Complex',
        stage: 'Installation',
        timeline: 'Mar 15 - Mar 25, 2024',
        assignedDate: '2024-03-01'
      },
      {
        id: 'proj-002',
        name: 'Residential Security Upgrade',
        stage: 'Planning',
        timeline: 'Apr 1 - Apr 15, 2024',
        assignedDate: '2024-03-10'
      }
    ],
    activityLog: [
      {
        id: 'act-001',
        type: 'assignment',
        description: 'Assigned to Downtown Office Complex',
        date: '2024-03-01',
        details: 'Lead supervisor role for 10-day installation project'
      },
      {
        id: 'act-002',
        type: 'project_update',
        description: 'Project status updated to Installation phase',
        date: '2024-03-05',
        details: 'All planning completed, installation started'
      }
    ]
  },
  {
    id: 'tm-002',
    name: 'Sarah Johnson',
    role: 'Crew Leader',
    status: 'Available',
    phone: '+1-555-0124',
    email: 'sarah@company.com',
    avatar: 'SJ',
    experience: 6,
    specializations: ['Quality Control', 'Safety Protocols'],
    projects: [
      {
        id: 'proj-003',
        name: 'Midtown Retail Security',
        stage: 'Quality Check',
        timeline: 'Mar 20 - Mar 30, 2024',
        assignedDate: '2024-03-15'
      }
    ],
    activityLog: [
      {
        id: 'act-003',
        type: 'assignment',
        description: 'Assigned to Midtown Retail Security',
        date: '2024-03-15',
        details: 'Crew leader for quality control phase'
      }
    ]
  },
  {
    id: 'tm-003',
    name: 'Mike Wilson',
    role: 'Installer',
    status: 'Available',
    phone: '+1-555-0125',
    email: 'mike@company.com',
    avatar: 'MW',
    experience: 4,
    specializations: ['Precision Installation'],
    projects: [
      {
        id: 'proj-001',
        name: 'Downtown Office Complex',
        stage: 'Installation',
        timeline: 'Mar 15 - Mar 25, 2024',
        assignedDate: '2024-03-01'
      }
    ],
    activityLog: [
      {
        id: 'act-004',
        type: 'assignment',
        description: 'Assigned to Downtown Office Complex',
        date: '2024-03-01',
        details: 'Installation team member'
      }
    ]
  },
  {
    id: 'tm-004',
    name: 'Emily Davis',
    role: 'Installer',
    status: 'Unavailable',
    unavailableUntil: '10/03/2024',
    phone: '+1-555-0126',
    email: 'emily@company.com',
    avatar: 'ED',
    experience: 5,
    specializations: ['Commercial Projects'],
    projects: [],
    activityLog: [
      {
        id: 'act-005',
        type: 'status_change',
        description: 'Status changed to unavailable',
        date: '2024-03-01',
        details: 'Personal leave until 10/03/2024'
      }
    ]
  },
  {
    id: 'tm-005',
    name: 'David Brown',
    role: 'Crew Leader',
    status: 'Available',
    phone: '+1-555-0127',
    email: 'david@company.com',
    avatar: 'DB',
    experience: 7,
    specializations: ['Large Scale Projects', 'Equipment Management'],
    projects: [
      {
        id: 'proj-004',
        name: 'Industrial Complex Security',
        stage: 'Planning',
        timeline: 'Apr 1 - May 15, 2024',
        assignedDate: '2024-03-20'
      }
    ],
    activityLog: [
      {
        id: 'act-006',
        type: 'assignment',
        description: 'Assigned to Industrial Complex Security',
        date: '2024-03-20',
        details: 'Crew leader for large-scale project'
      }
    ]
  },
  {
    id: 'tm-006',
    name: 'Lisa Garcia',
    role: 'Installer',
    status: 'Available',
    phone: '+1-555-0128',
    email: 'lisa@company.com',
    avatar: 'LG',
    experience: 3,
    specializations: ['Residential Projects'],
    projects: [
      {
        id: 'proj-005',
        name: 'Residential Security Upgrade',
        stage: 'Installation',
        timeline: 'Mar 18 - Mar 28, 2024',
        assignedDate: '2024-03-10'
      }
    ],
    activityLog: [
      {
        id: 'act-007',
        type: 'assignment',
        description: 'Assigned to Residential Security Upgrade',
        date: '2024-03-10',
        details: 'Installation team member for residential project'
      }
    ]
  },
  {
    id: 'tm-007',
    name: 'Robert Taylor',
    role: 'Lead Supervisor',
    status: 'Unavailable',
    unavailableUntil: '05/03/2024',
    phone: '+1-555-0129',
    email: 'robert@company.com',
    avatar: 'RT',
    experience: 10,
    specializations: ['Project Management', 'Client Relations'],
    projects: [],
    activityLog: [
      {
        id: 'act-008',
        type: 'status_change',
        description: 'Status changed to unavailable',
        date: '2024-02-25',
        details: 'Medical leave until 05/03/2024'
      }
    ]
  },
  {
    id: 'tm-008',
    name: 'Jennifer White',
    role: 'Project Coordinator',
    status: 'Available',
    phone: '+1-555-0130',
    email: 'jennifer@company.com',
    avatar: 'JW',
    experience: 2,
    specializations: ['Project Coordination', 'Client Communication'],
    projects: [
      {
        id: 'proj-001',
        name: 'Downtown Office Complex',
        stage: 'Installation',
        timeline: 'Mar 15 - Mar 25, 2024',
        assignedDate: '2024-03-01'
      },
      {
        id: 'proj-002',
        name: 'Residential Security Upgrade',
        stage: 'Planning',
        timeline: 'Apr 1 - Apr 15, 2024',
        assignedDate: '2024-03-10'
      }
    ],
    activityLog: [
      {
        id: 'act-009',
        type: 'assignment',
        description: 'Assigned to Downtown Office Complex',
        date: '2024-03-01',
        details: 'Project coordinator for installation phase'
      },
      {
        id: 'act-010',
        type: 'assignment',
        description: 'Assigned to Residential Security Upgrade',
        date: '2024-03-10',
        details: 'Project coordinator for planning phase'
      }
    ]
  }
];
