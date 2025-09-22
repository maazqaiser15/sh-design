import React from 'react';
import { CalendarEvent } from '../../types/scheduler';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date, hour: number) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Get the start of the week (Sunday)
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  const getEventsForDateAndHour = (date: Date, hour: number): CalendarEvent[] => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      // Check if event is on this date
      if (eventStart.toDateString() !== date.toDateString()) return false;
      
      // Check if event overlaps with this hour
      const eventStartHour = eventStart.getHours();
      const eventEndHour = eventEnd.getHours();
      
      return hour >= eventStartHour && hour < eventEndHour;
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

  const formatHour = (hour: number): string => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
      {/* Week Days Header */}
      <div className="grid grid-cols-8 border-b border-border sticky top-0 bg-white z-10">
        <div className="p-4 border-r border-border">
          <span className="text-sm font-medium text-text-secondary">Time</span>
        </div>
        {weekDays.map((date, index) => (
          <div key={index} className="p-4 text-center border-r border-border last:border-r-0">
            <div className="text-sm font-medium text-text-secondary">
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className={`text-lg font-semibold mt-1 ${
              isToday(date) ? 'text-primary' : 'text-text-primary'
            }`}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Time Grid */}
      <div className="max-h-96 overflow-y-auto">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-100">
            {/* Time Label */}
            <div className="p-3 border-r border-border text-right">
              <span className="text-sm text-text-secondary">{formatHour(hour)}</span>
            </div>
            
            {/* Day Columns */}
            {weekDays.map((date, dayIndex) => {
              const dayEvents = getEventsForDateAndHour(date, hour);
              
              return (
                <div
                  key={dayIndex}
                  className="h-16 border-r border-gray-100 last:border-r-0 p-1 cursor-pointer hover:bg-gray-50 transition-colors relative"
                  onClick={() => onTimeSlotClick(date, hour)}
                >
                  {/* Events in this time slot */}
                  {dayEvents.map((event, eventIndex) => {
                    const eventStart = new Date(event.start);
                    const eventEnd = new Date(event.end);
                    const duration = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60); // hours
                    const height = Math.max(duration * 64, 24); // minimum 24px height
                    
                    return (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className={`absolute left-1 right-1 rounded px-2 py-1 text-xs text-white font-medium cursor-pointer hover:opacity-80 transition-opacity z-10 ${getEventColor(event)}`}
                        style={{
                          top: `${eventIndex * 2}px`,
                          height: `${Math.min(height, 60)}px`,
                        }}
                        title={`${event.title}\n${eventStart.toLocaleTimeString()} - ${eventEnd.toLocaleTimeString()}`}
                      >
                        <div className="truncate">{event.title}</div>
                        {duration > 1 && (
                          <div className="text-xs opacity-75">
                            {eventStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
