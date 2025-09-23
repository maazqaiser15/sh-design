import { TeamMemberAssignment, TeamMemberProject } from '../types/teamScheduler';
import { PROJECT_STAGE_COLORS } from './mockData';

// Generate project assignments for team members
const generateTeamMemberAssignments = (): TeamMemberAssignment[] => {
  const teamMembers: TeamMemberAssignment[] = [
    {
      id: 'member-001',
      name: 'John Smith',
      role: 'Crew Leader',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      projects: [
        {
          id: 'proj-001',
          name: 'Downtown Corporate Complex',
          stage: 'PV90',
          startDate: '2025-09-25',
          endDate: '2025-09-29',
          role: 'Lead Installer',
          color: PROJECT_STAGE_COLORS['PV90']
        },
        {
          id: 'proj-002',
          name: 'Luxury Estate Security',
          stage: 'UB',
          startDate: '2025-09-30',
          endDate: '2025-10-03',
          role: 'Lead Installer',
          color: PROJECT_STAGE_COLORS['UB']
        }
      ]
    },
    {
      id: 'member-002',
      name: 'Sarah Johnson',
      role: 'Lead',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      projects: [
        {
          id: 'proj-003',
          name: 'Warehouse Security Installation',
          stage: 'WB',
          startDate: '2025-09-28',
          endDate: '2025-10-04',
          role: 'Project Lead',
          color: PROJECT_STAGE_COLORS['WB']
        }
      ]
    },
    {
      id: 'member-003',
      name: 'Mike Wilson',
      role: 'Installer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
      projects: [
        {
          id: 'proj-001',
          name: 'Downtown Corporate Complex',
          stage: 'PV90',
          startDate: '2025-09-25',
          endDate: '2025-09-29',
          role: 'Installer',
          color: PROJECT_STAGE_COLORS['PV90']
        },
        {
          id: 'proj-004',
          name: 'House Rep Illinois Residence',
          stage: 'WIP',
          startDate: '2025-10-01',
          endDate: '2025-10-07',
          role: 'Installer',
          color: PROJECT_STAGE_COLORS['WIP']
        }
      ]
    },
    {
      id: 'member-004',
      name: 'Emily Davis',
      role: 'Project Coordinator',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
      projects: [
        {
          id: 'proj-002',
          name: 'Luxury Estate Security',
          stage: 'UB',
          startDate: '2025-09-26',
          endDate: '2025-10-03',
          role: 'Coordinator',
          color: PROJECT_STAGE_COLORS['UB']
        },
        {
          id: 'proj-005',
          name: 'Residential Security Upgrade',
          stage: 'PV90',
          startDate: '2025-10-05',
          endDate: '2025-10-12',
          role: 'Coordinator',
          color: PROJECT_STAGE_COLORS['PV90']
        }
      ]
    },
    {
      id: 'member-005',
      name: 'David Brown',
      role: 'Supervisor',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
      projects: [
        {
          id: 'proj-003',
          name: 'Warehouse Security Installation',
          stage: 'WB',
          startDate: '2025-09-28',
          endDate: '2025-10-04',
          role: 'Supervisor',
          color: PROJECT_STAGE_COLORS['WB']
        },
        {
          id: 'proj-006',
          name: 'Corporate Headquarters Security',
          stage: 'WIP',
          startDate: '2025-10-08',
          endDate: '2025-10-15',
          role: 'Supervisor',
          color: PROJECT_STAGE_COLORS['WIP']
        }
      ]
    },
    {
      id: 'member-006',
      name: 'Lisa Anderson',
      role: 'Installer',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
      projects: [] // Unassigned
    },
    {
      id: 'member-007',
      name: 'Robert Taylor',
      role: 'Crew Leader',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=32&h=32&fit=crop&crop=face',
      projects: [
        {
          id: 'proj-007',
          name: 'Medical Center Security Upgrade',
          stage: 'UB',
          startDate: '2025-10-10',
          endDate: '2025-10-17',
          role: 'Crew Lead',
          color: PROJECT_STAGE_COLORS['UB']
        }
      ]
    },
    {
      id: 'member-008',
      name: 'Jennifer Martinez',
      role: 'Installer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face',
      projects: [
        {
          id: 'proj-001',
          name: 'Downtown Corporate Complex',
          stage: 'PV90',
          startDate: '2025-09-25',
          endDate: '2025-09-29',
          role: 'Installer',
          color: PROJECT_STAGE_COLORS['PV90']
        },
        {
          id: 'proj-008',
          name: 'Financial District Security',
          stage: 'WB',
          startDate: '2025-10-12',
          endDate: '2025-10-19',
          role: 'Installer',
          color: PROJECT_STAGE_COLORS['WB']
        }
      ]
    }
  ];

  return teamMembers;
};

export const MOCK_TEAM_MEMBERS: TeamMemberAssignment[] = generateTeamMemberAssignments();
