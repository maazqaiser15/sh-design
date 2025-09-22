// Scheduler and Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  projectId?: string;
  assignedTo?: string[];
  type: EventType;
  status: EventStatus;
  color?: string;
  location?: string;
  resources?: string[];
}

export type EventType = 'project' | 'task' | 'meeting' | 'deadline' | 'maintenance';
export type EventStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';

export interface CalendarView {
  type: 'month' | 'week' | 'day' | 'agenda';
  date: Date;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
  events: CalendarEvent[];
}

export interface CalendarFilter {
  projects: string[];
  teams: string[];
  eventTypes: EventType[];
  statuses: EventStatus[];
}

export interface Assignment {
  id: string;
  eventId: string;
  userId: string;
  role: string;
  status: 'assigned' | 'accepted' | 'declined';
  assignedAt: Date;
  assignedBy: string;
}
