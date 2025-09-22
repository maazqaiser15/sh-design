import React from 'react';
import { CalendarEvent } from '../../types/scheduler';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onDateClick,
}) => {
  const today = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar grid
  const calendarDays: (Date | null)[] = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    const prevDate = new Date(firstDayOfMonth);
    prevDate.setDate(prevDate.getDate() - (firstDayOfWeek - i));
    calendarDays.push(prevDate);
  }
  
  // Add days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  }
  
  // Add days from next month to fill the grid
  const remainingCells = 42 - calendarDays.length; // 6 weeks * 7 days
  for (let day = 1; day <= remainingCells; day++) {
    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
    calendarDays.push(nextDate);
  }

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventColor = (event: CalendarEvent): string => {
    if (event.color) return event.color;
    
    switch (event.type) {
      case 'project': return 'bg-blue-500';
      case 'task': return 'bg-green-500';
      case 'meeting': return 'bg-purple-500';
      case 'deadline': return 'bg-red-500';
      case 'maintenance': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const isToday = (date: Date): boolean => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border">
      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b border-border">
        {weekDays.map((day) => (
          <div key={day} className="p-3 text-center">
            <span className="text-sm font-medium text-text-secondary uppercase tracking-wider">
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((date, index) => {
          if (!date) return <div key={index} className="h-32 border-r border-b border-gray-100" />;
          
          const dayEvents = getEventsForDate(date);
          const isCurrentMonthDay = isCurrentMonth(date);
          const isTodayDate = isToday(date);

          return (
            <div
              key={index}
              className={`h-32 border-r border-b border-gray-100 p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                !isCurrentMonthDay ? 'bg-gray-50' : ''
              }`}
              onClick={() => onDateClick(date)}
            >
              {/* Date Number */}
              <div className="flex justify-between items-start mb-1">
                <span
                  className={`text-sm font-medium ${
                    isTodayDate
                      ? 'bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center'
                      : isCurrentMonthDay
                      ? 'text-text-primary'
                      : 'text-text-muted'
                  }`}
                >
                  {date.getDate()}
                </span>
              </div>

              {/* Events */}
              <div className="space-y-1 overflow-hidden">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className={`px-2 py-1 rounded text-xs text-white font-medium truncate cursor-pointer hover:opacity-80 transition-opacity ${getEventColor(event)}`}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-text-muted px-2">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
