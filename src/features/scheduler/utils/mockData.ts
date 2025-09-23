import { SchedulerProject } from '../types';

// Get current date for dynamic date generation
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const currentDay = today.getDate();

// Create projects for current month and next month
const getNextMonth = (date: Date) => {
  const nextMonth = new Date(date);
  nextMonth.setMonth(date.getMonth() + 1);
  return nextMonth;
};

const currentMonthStr = String(currentMonth + 1).padStart(2, '0');
const nextMonth = getNextMonth(today);
const nextMonthStr = String(nextMonth.getMonth() + 1).padStart(2, '0');


// Mock projects with specific dates for current and next month
export const MOCK_SCHEDULER_PROJECTS: SchedulerProject[] = [
  {
    id: 'proj-001',
    name: 'Downtown Corporate Complex',
    stage: 'PV90',
    startDate: `${currentYear}-${currentMonthStr}-25`,
    endDate: `${currentYear}-${currentMonthStr}-29`,
    description: 'Security film installation for downtown corporate building',
    client: 'Corporate Client',
    location: 'Downtown District'
  },
  {
    id: 'proj-002',
    name: 'Luxury Estate Security',
    stage: 'UB',
    startDate: `${currentYear}-${currentMonthStr}-26`,
    endDate: `${currentYear}-${nextMonthStr}-03`,
    description: 'High-end security installation for luxury residential estate',
    client: 'Private Client',
    location: 'Residential Area'
  },
  {
    id: 'proj-003',
    name: 'Warehouse Security Installation',
    stage: 'WB',
    startDate: `${currentYear}-${currentMonthStr}-28`,
    endDate: `${currentYear}-${nextMonthStr}-04`,
    description: 'Comprehensive security system for industrial warehouse',
    client: 'Industrial Client',
    location: 'Industrial Zone'
  },
  {
    id: 'proj-004',
    name: 'House Rep Illinois Residence',
    stage: 'WIP',
    startDate: `${currentYear}-${currentMonthStr}-30`,
    endDate: `${currentYear}-${nextMonthStr}-07`,
    description: 'Security film installation for Illinois state representative residence',
    client: 'Government',
    location: 'Springfield, IL'
  },
  {
    id: 'proj-005',
    name: 'Residential Security Upgrade',
    stage: 'PV90',
    startDate: `${currentYear}-${nextMonthStr}-01`,
    endDate: `${currentYear}-${nextMonthStr}-05`,
    description: 'Security upgrade for residential complex',
    client: 'Property Management',
    location: 'Residential Area'
  },
  {
    id: 'proj-006',
    name: 'Corporate Headquarters Security',
    stage: 'WIP',
    startDate: `${currentYear}-${nextMonthStr}-03`,
    endDate: `${currentYear}-${nextMonthStr}-10`,
    description: 'Security system installation for corporate headquarters',
    client: 'Fortune 500 Company',
    location: 'Business District'
  },
  {
    id: 'proj-007',
    name: 'Medical Center Security Upgrade',
    stage: 'UB',
    startDate: `${currentYear}-${nextMonthStr}-05`,
    endDate: `${currentYear}-${nextMonthStr}-12`,
    description: 'Security upgrade for medical center',
    client: 'Healthcare System',
    location: 'Medical District'
  },
  {
    id: 'proj-008',
    name: 'Financial District Security',
    stage: 'WB',
    startDate: `${currentYear}-${nextMonthStr}-07`,
    endDate: `${currentYear}-${nextMonthStr}-14`,
    description: 'Security installation for financial district buildings',
    client: 'Banking Consortium',
    location: 'Financial District'
  },
  {
    id: 'proj-009',
    name: 'Stadium Security Reinforcement',
    stage: 'WIP',
    startDate: `${currentYear}-${nextMonthStr}-08`,
    endDate: `${currentYear}-${nextMonthStr}-18`,
    description: 'Security reinforcement for sports stadium',
    client: 'Stadium Authority',
    location: 'Sports Complex'
  },
  {
    id: 'proj-010',
    name: 'Tech Park Surveillance',
    stage: 'UB',
    startDate: `${currentYear}-${nextMonthStr}-10`,
    endDate: `${currentYear}-${nextMonthStr}-14`,
    description: 'Surveillance system for technology park',
    client: 'Tech Corporation',
    location: 'Technology District'
  },
  {
    id: 'proj-011',
    name: 'University Campus Security',
    stage: 'PV90',
    startDate: `${currentYear}-${nextMonthStr}-12`,
    endDate: `${currentYear}-${nextMonthStr}-19`,
    description: 'Security system for university campus',
    client: 'State University',
    location: 'Education District'
  },
  {
    id: 'proj-012',
    name: 'Airport Cargo Security',
    stage: 'WIP',
    startDate: `${currentYear}-${nextMonthStr}-13`,
    endDate: `${currentYear}-${nextMonthStr}-22`,
    description: 'Security system for airport cargo facility',
    client: 'Airport Authority',
    location: 'Airport'
  },
  {
    id: 'proj-013',
    name: 'Harbor Freight Security',
    stage: 'UB',
    startDate: `${currentYear}-${nextMonthStr}-15`,
    endDate: `${currentYear}-${nextMonthStr}-20`,
    description: 'Security installation for harbor freight facility',
    client: 'Logistics Company',
    location: 'Port Area'
  },
  {
    id: 'proj-014',
    name: 'Embassy Security Upgrade',
    stage: 'WB',
    startDate: `${currentYear}-${nextMonthStr}-18`,
    endDate: `${currentYear}-${nextMonthStr}-25`,
    description: 'Security upgrade for embassy building',
    client: 'Diplomatic Mission',
    location: 'Diplomatic Quarter'
  }
];

export const PROJECT_STAGE_COLORS = {
  'PV90': 'bg-gray-300 text-gray-800 border-gray-400',
  'UB': 'bg-teal-200 text-teal-800 border-teal-300',
  'WB': 'bg-amber-100 text-amber-800 border-amber-200',
  'WIP': 'bg-blue-100 text-blue-800 border-blue-200',
  'QF': 'bg-orange-400 text-orange-800 border-orange-500',
  'Completed': 'bg-green-200 text-green-800 border-green-300'
} as const;

export const PROJECT_STAGE_BADGE_COLORS = {
  'PV90': 'bg-gray-100 text-gray-700',
  'UB': 'bg-teal-100 text-teal-700',
  'WB': 'bg-amber-100 text-amber-700',
  'WIP': 'bg-blue-100 text-blue-700',
  'QF': 'bg-orange-100 text-orange-700',
  'Completed': 'bg-green-100 text-green-700'
} as const;