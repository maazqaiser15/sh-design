import { SchedulerProject } from '../types';

export const MOCK_SCHEDULER_PROJECTS: SchedulerProject[] = [
  {
    id: 'proj-001',
    name: 'Hilton Downtown Renovation',
    stage: 'UB',
    startDate: '2024-09-10',
    endDate: '2024-09-12',
    description: 'Complete renovation of downtown Hilton hotel lobby and guest areas',
    client: 'Hilton Hotels',
    location: 'Downtown, New York'
  },
  {
    id: 'proj-002',
    name: 'Tesla Fremont Expansion',
    stage: 'WIP',
    startDate: '2024-09-11',
    endDate: '2024-09-14',
    description: 'Security system upgrade for Tesla Fremont manufacturing facility',
    client: 'Tesla Inc.',
    location: 'Fremont, California'
  },
  {
    id: 'proj-003',
    name: 'Google NYC Office Fit-Out',
    stage: 'PV90',
    startDate: '2024-09-13',
    endDate: '2024-09-15',
    description: 'Protective film installation for Google NYC office building',
    client: 'Google LLC',
    location: 'New York, NY'
  },
  {
    id: 'proj-004',
    name: 'Walmart Distribution Center Upgrade',
    stage: 'Completed',
    startDate: '2024-09-18',
    endDate: '2024-09-22',
    description: 'Security enhancement project for Walmart distribution center',
    client: 'Walmart Inc.',
    location: 'Bentonville, Arkansas'
  },
  {
    id: 'proj-005',
    name: 'Marriott Resort Facade Project',
    stage: 'WB',
    startDate: '2024-09-20',
    endDate: '2024-09-24',
    description: 'Protective film installation for resort facade windows',
    client: 'Marriott International',
    location: 'Miami, Florida'
  },
  {
    id: 'proj-006',
    name: 'Amazon Seattle HQ Retrofit',
    stage: 'UB',
    startDate: '2024-09-25',
    endDate: '2024-09-28',
    description: 'Security system retrofit for Amazon Seattle headquarters',
    client: 'Amazon.com Inc.',
    location: 'Seattle, Washington'
  },
  {
    id: 'proj-007',
    name: 'Microsoft Redmond Campus',
    stage: 'WIP',
    startDate: '2024-09-26',
    endDate: '2024-09-30',
    description: 'Protective film installation for Microsoft campus buildings',
    client: 'Microsoft Corporation',
    location: 'Redmond, Washington'
  },
  {
    id: 'proj-008',
    name: 'Apple Park Security Upgrade',
    stage: 'PV90',
    startDate: '2024-10-01',
    endDate: '2024-10-03',
    description: 'Security system enhancement for Apple Park campus',
    client: 'Apple Inc.',
    location: 'Cupertino, California'
  },
  {
    id: 'proj-009',
    name: 'Facebook Menlo Park Office',
    stage: 'WB',
    startDate: '2024-10-02',
    endDate: '2024-10-05',
    description: 'Protective film installation for Facebook office complex',
    client: 'Meta Platforms Inc.',
    location: 'Menlo Park, California'
  },
  {
    id: 'proj-010',
    name: 'Netflix Los Gatos HQ',
    stage: 'Completed',
    startDate: '2024-10-07',
    endDate: '2024-10-10',
    description: 'Security system upgrade for Netflix headquarters',
    client: 'Netflix Inc.',
    location: 'Los Gatos, California'
  }
];

export const PROJECT_STAGE_COLORS = {
  'PV90': 'bg-gray-100 text-gray-800 border-gray-200',
  'UB': 'bg-blue-50 text-blue-800 border-blue-200',
  'WB': 'bg-teal-200 text-teal-800 border-teal-300',
  'WIP': 'bg-amber-100 text-amber-800 border-amber-200',
  'Completed': 'bg-green-200 text-green-800 border-green-300'
} as const;

export const PROJECT_STAGE_BADGE_COLORS = {
  'PV90': 'bg-gray-100 text-gray-700',
  'UB': 'bg-blue-100 text-blue-700',
  'WB': 'bg-teal-100 text-teal-700',
  'WIP': 'bg-amber-100 text-amber-700',
  'Completed': 'bg-green-100 text-green-700'
} as const;
