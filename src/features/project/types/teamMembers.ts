// Team Member Types for Assignment
export type TeamRole = 'Lead Supervisor' | 'Crew Leader' | 'Installer';
export type TeamMemberStatus = 'Available' | 'Unavailable';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  status: TeamMemberStatus;
  availableUntil?: string; // DD/MM/YYYY format
  efficiencyBadge?: string; // e.g., "Efficient Installer"
  avatar?: string;
  phone?: string;
  email?: string;
  location?: string;
  experience?: number; // years of experience
  specializations?: string[];
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
    availableUntil: '15/03/2024',
    efficiencyBadge: 'Efficient Installer',
    avatar: '/avatars/john.jpg',
    phone: '+1-555-0123',
    email: 'john@company.com',
    location: 'Downtown',
    experience: 8,
    specializations: ['Security Film', 'Window Installation', 'Team Management']
  },
  {
    id: 'tm-002',
    name: 'Sarah Johnson',
    role: 'Crew Leader',
    status: 'Available',
    availableUntil: '20/03/2024',
    efficiencyBadge: 'Efficient Installer',
    avatar: '/avatars/sarah.jpg',
    phone: '+1-555-0124',
    email: 'sarah@company.com',
    location: 'Midtown',
    experience: 6,
    specializations: ['Quality Control', 'Safety Protocols']
  },
  {
    id: 'tm-003',
    name: 'Mike Wilson',
    role: 'Installer',
    status: 'Available',
    availableUntil: '25/03/2024',
    avatar: '/avatars/mike.jpg',
    phone: '+1-555-0125',
    email: 'mike@company.com',
    location: 'Uptown',
    experience: 4,
    specializations: ['Precision Installation']
  },
  {
    id: 'tm-004',
    name: 'Emily Davis',
    role: 'Installer',
    status: 'Unavailable',
    availableUntil: '10/03/2024',
    efficiencyBadge: 'Efficient Installer',
    avatar: '/avatars/emily.jpg',
    phone: '+1-555-0126',
    email: 'emily@company.com',
    location: 'Westside',
    experience: 5,
    specializations: ['Commercial Projects']
  },
  {
    id: 'tm-005',
    name: 'David Brown',
    role: 'Crew Leader',
    status: 'Available',
    availableUntil: '30/03/2024',
    avatar: '/avatars/david.jpg',
    phone: '+1-555-0127',
    email: 'david@company.com',
    location: 'Eastside',
    experience: 7,
    specializations: ['Large Scale Projects', 'Equipment Management']
  },
  {
    id: 'tm-006',
    name: 'Lisa Garcia',
    role: 'Installer',
    status: 'Available',
    availableUntil: '18/03/2024',
    efficiencyBadge: 'Efficient Installer',
    avatar: '/avatars/lisa.jpg',
    phone: '+1-555-0128',
    email: 'lisa@company.com',
    location: 'Northside',
    experience: 3,
    specializations: ['Residential Projects']
  },
  {
    id: 'tm-007',
    name: 'Robert Taylor',
    role: 'Lead Supervisor',
    status: 'Unavailable',
    availableUntil: '05/03/2024',
    avatar: '/avatars/robert.jpg',
    phone: '+1-555-0129',
    email: 'robert@company.com',
    location: 'Southside',
    experience: 10,
    specializations: ['Project Management', 'Client Relations']
  },
  {
    id: 'tm-008',
    name: 'Jennifer White',
    role: 'Installer',
    status: 'Available',
    availableUntil: '22/03/2024',
    avatar: '/avatars/jennifer.jpg',
    phone: '+1-555-0130',
    email: 'jennifer@company.com',
    location: 'Central',
    experience: 2,
    specializations: ['Detail Work']
  },
  {
    id: 'tm-009',
    name: 'Michael Anderson',
    role: 'Crew Leader',
    status: 'Available',
    availableUntil: '28/03/2024',
    efficiencyBadge: 'Efficient Installer',
    avatar: '/avatars/michael.jpg',
    phone: '+1-555-0131',
    email: 'michael@company.com',
    location: 'Downtown',
    experience: 9,
    specializations: ['Complex Installations', 'Training']
  },
  {
    id: 'tm-010',
    name: 'Amanda Clark',
    role: 'Installer',
    status: 'Available',
    availableUntil: '12/03/2024',
    avatar: '/avatars/amanda.jpg',
    phone: '+1-555-0132',
    email: 'amanda@company.com',
    location: 'Midtown',
    experience: 4,
    specializations: ['Safety Focus']
  },
  {
    id: 'tm-011',
    name: 'James Rodriguez',
    role: 'Lead Supervisor',
    status: 'Available',
    availableUntil: '31/03/2024',
    efficiencyBadge: 'Efficient Installer',
    avatar: '/avatars/james.jpg',
    phone: '+1-555-0133',
    email: 'james@company.com',
    location: 'Uptown',
    experience: 12,
    specializations: ['Strategic Planning', 'Team Leadership']
  },
  {
    id: 'tm-012',
    name: 'Maria Martinez',
    role: 'Installer',
    status: 'Unavailable',
    availableUntil: '08/03/2024',
    avatar: '/avatars/maria.jpg',
    phone: '+1-555-0134',
    email: 'maria@company.com',
    location: 'Westside',
    experience: 6,
    specializations: ['Quality Assurance']
  },
  {
    id: 'tm-013',
    name: 'Kevin Lee',
    role: 'Crew Leader',
    status: 'Available',
    availableUntil: '26/03/2024',
    efficiencyBadge: 'Efficient Installer',
    avatar: '/avatars/kevin.jpg',
    phone: '+1-555-0135',
    email: 'kevin@company.com',
    location: 'Eastside',
    experience: 8,
    specializations: ['Efficiency Optimization', 'Process Improvement']
  },
  {
    id: 'tm-014',
    name: 'Rachel Green',
    role: 'Installer',
    status: 'Available',
    availableUntil: '19/03/2024',
    avatar: '/avatars/rachel.jpg',
    phone: '+1-555-0136',
    email: 'rachel@company.com',
    location: 'Northside',
    experience: 3,
    specializations: ['Attention to Detail']
  },
  {
    id: 'tm-015',
    name: 'Daniel Kim',
    role: 'Installer',
    status: 'Available',
    availableUntil: '24/03/2024',
    efficiencyBadge: 'Efficient Installer',
    avatar: '/avatars/daniel.jpg',
    phone: '+1-555-0137',
    email: 'daniel@company.com',
    location: 'Southside',
    experience: 5,
    specializations: ['Technical Expertise']
  }
];
