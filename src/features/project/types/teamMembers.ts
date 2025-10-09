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
  site?: string; // City, State format
  experience?: number; // years of experience
  specializations?: string[];
  projects?: TeamMemberProject[];
  activityLog?: TeamMemberActivity[];
  inviteStatus?: 'pending' | 'accepted' | 'declined' | 'expired'; // Invitation status
  invitedAt?: string; // ISO date string when invitation was sent
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
    site: 'Los Angeles, CA',
    experience: 8,
    specializations: ['Security Film', 'Window Installation', 'Team Management'],
    inviteStatus: 'accepted',
    invitedAt: '2024-02-15T10:00:00Z',
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
    site: 'Chicago, IL',
    experience: 6,
    specializations: ['Quality Control', 'Safety Protocols'],
    inviteStatus: 'pending',
    invitedAt: '2024-03-01T14:30:00Z',
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
    site: 'Houston, TX',
    experience: 4,
    specializations: ['Precision Installation'],
    inviteStatus: 'expired',
    invitedAt: '2024-02-20T09:15:00Z',
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
    site: 'Phoenix, AZ',
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
    site: 'Miami, FL',
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
    site: 'Seattle, WA',
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
    site: 'Denver, CO',
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
    site: 'Boston, MA',
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
  },
  {
    id: 'tm-009',
    name: 'David Martinez',
    role: 'Installer',
    status: 'Available',
    phone: '+1-555-0131',
    email: 'david@company.com',
    avatar: 'DM',
    site: 'Miami, FL',
    experience: 6,
    specializations: ['Commercial Projects', 'Security Systems'],
    projects: [],
    activityLog: []
  },
  {
    id: 'tm-010',
    name: 'Lisa Anderson',
    role: 'Crew Leader',
    status: 'Available',
    phone: '+1-555-0132',
    email: 'lisa@company.com',
    avatar: 'LA',
    site: 'Seattle, WA',
    experience: 8,
    specializations: ['Team Management', 'Quality Control'],
    projects: [],
    activityLog: []
  },
  {
    id: 'tm-011',
    name: 'James Brown',
    role: 'Installer',
    status: 'Unavailable',
    unavailableUntil: '15/03/2024',
    phone: '+1-555-0133',
    email: 'james@company.com',
    avatar: 'JB',
    site: 'Denver, CO',
    experience: 3,
    specializations: ['Residential Projects'],
    projects: [],
    activityLog: [
      {
        id: 'act-011',
        type: 'status_change',
        description: 'Status changed to unavailable',
        date: '2024-03-01',
        details: 'Personal leave until 15/03/2024'
      }
    ]
  },
  {
    id: 'tm-012',
    name: 'Maria Garcia',
    role: 'Project Coordinator',
    status: 'Available',
    phone: '+1-555-0134',
    email: 'maria@company.com',
    avatar: 'MG',
    site: 'Austin, TX',
    experience: 4,
    specializations: ['Client Relations', 'Scheduling'],
    projects: [],
    activityLog: []
  },
  {
    id: 'tm-013',
    name: 'Kevin Lee',
    role: 'Installer',
    status: 'Available',
    phone: '+1-555-0135',
    email: 'kevin@company.com',
    avatar: 'KL',
    site: 'Portland, OR',
    experience: 5,
    specializations: ['Precision Installation', 'Troubleshooting'],
    projects: [],
    activityLog: []
  },
  {
    id: 'tm-014',
    name: 'Sarah Thompson',
    role: 'Lead Supervisor',
    status: 'Available',
    phone: '+1-555-0136',
    email: 'sarah@company.com',
    avatar: 'ST',
    site: 'Nashville, TN',
    experience: 10,
    specializations: ['Project Management', 'Team Leadership'],
    projects: [],
    activityLog: []
  },
  {
    id: 'tm-015',
    name: 'Michael Davis',
    role: 'Installer',
    status: 'Unavailable',
    unavailableUntil: '20/03/2024',
    phone: '+1-555-0137',
    email: 'michael@company.com',
    avatar: 'MD',
    site: 'Las Vegas, NV',
    experience: 7,
    specializations: ['Commercial Security', 'System Integration'],
    projects: [],
    activityLog: [
      {
        id: 'act-012',
        type: 'status_change',
        description: 'Status changed to unavailable',
        date: '2024-03-05',
        details: 'Training course until 20/03/2024'
      }
    ]
  },
  {
    id: 'tm-016',
    name: 'Amanda Wilson',
    role: 'Crew Leader',
    status: 'Available',
    phone: '+1-555-0138',
    email: 'amanda@company.com',
    avatar: 'AW',
    site: 'Phoenix, AZ',
    experience: 6,
    specializations: ['Quality Assurance', 'Safety Protocols'],
    projects: [],
    activityLog: []
  },
  {
    id: 'tm-017',
    name: 'Christopher Taylor',
    role: 'Installer',
    status: 'Available',
    phone: '+1-555-0139',
    email: 'christopher@company.com',
    avatar: 'CT',
    site: 'San Diego, CA',
    experience: 4,
    specializations: ['Residential Security', 'Customer Service'],
    projects: [],
    activityLog: []
  },
  {
    id: 'tm-018',
    name: 'Jessica Miller',
    role: 'Project Coordinator',
    status: 'Available',
    phone: '+1-555-0140',
    email: 'jessica@company.com',
    avatar: 'JM',
    site: 'Tampa, FL',
    experience: 3,
    specializations: ['Documentation', 'Client Communication'],
    projects: [],
    activityLog: []
  },
  {
    id: 'tm-019',
    name: 'Daniel Rodriguez',
    role: 'Installer',
    status: 'Unavailable',
    unavailableUntil: '25/03/2024',
    phone: '+1-555-0141',
    email: 'daniel@company.com',
    avatar: 'DR',
    site: 'Orlando, FL',
    experience: 5,
    specializations: ['Commercial Projects', 'System Maintenance'],
    projects: [],
    activityLog: [
      {
        id: 'act-013',
        type: 'status_change',
        description: 'Status changed to unavailable',
        date: '2024-03-08',
        details: 'Family emergency until 25/03/2024'
      }
    ]
  },
  {
    id: 'tm-020',
    name: 'Rachel Green',
    role: 'Lead Supervisor',
    status: 'Available',
    phone: '+1-555-0142',
    email: 'rachel@company.com',
    avatar: 'RG',
    site: 'Minneapolis, MN',
    experience: 9,
    specializations: ['Project Planning', 'Resource Management'],
    projects: [],
    activityLog: []
  }
];
