import React, { useMemo } from 'react';
import { GanttViewMode } from './ProjectGanttView';

interface ProjectGanttTimelineHeaderProps {
  viewMode: GanttViewMode;
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

interface TimelineCell {
  date: Date;
  label: string;
  isToday?: boolean;
  isCurrentPeriod?: boolean;
}

export const ProjectGanttTimelineHeader: React.FC<ProjectGanttTimelineHeaderProps> = ({
  viewMode,
  currentDate,
  onDateChange
}) => {
  const timelineCells = useMemo(() => {
    const cells: TimelineCell[] = [];
    const today = new Date();
    
    if (viewMode === 'week') {
      // Get the start of the week (Monday)
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      
      for (let i = 0; i < 7; i++) {
        const cellDate = new Date(startOfWeek);
        cellDate.setDate(startOfWeek.getDate() + i);
        
        cells.push({
          date: cellDate,
          label: cellDate.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit' }),
          isToday: cellDate.toDateString() === today.toDateString(),
          isCurrentPeriod: true
        });
      }
    } else if (viewMode === 'month') {
      // Get the start of the month
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const daysInMonth = endOfMonth.getDate();
      
      for (let i = 1; i <= daysInMonth; i++) {
        const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        
        cells.push({
          date: cellDate,
          label: cellDate.toLocaleDateString('en-US', { day: '2-digit' }),
          isToday: cellDate.toDateString() === today.toDateString(),
          isCurrentPeriod: true
        });
      }
    } else if (viewMode === 'day') {
      const cellDate = new Date(currentDate);
      cells.push({
        date: cellDate,
        label: cellDate.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        isToday: cellDate.toDateString() === today.toDateString(),
        isCurrentPeriod: true
      });
    } else if (viewMode === 'year') {
      // Get the start of the year
      const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
      
      for (let i = 0; i < 12; i++) {
        const cellDate = new Date(currentDate.getFullYear(), i, 1);
        
        cells.push({
          date: cellDate,
          label: cellDate.toLocaleDateString('en-US', { month: 'short' }),
          isToday: cellDate.getMonth() === today.getMonth() && cellDate.getFullYear() === today.getFullYear(),
          isCurrentPeriod: true
        });
      }
    }
    
    return cells;
  }, [viewMode, currentDate]);

  const getHeaderTitle = () => {
    switch (viewMode) {
      case 'day':
        return currentDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      case 'week':
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'month':
        return currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      case 'year':
        return currentDate.getFullYear().toString();
      default:
        return '';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Header Title */}
      <div className="px-4 py-2 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">{getHeaderTitle()}</h2>
      </div>
      
      {/* Timeline Grid */}
      <div className="flex">
        {/* Left spacer to align with project info column */}
        <div className="w-72 flex-shrink-0 border-r border-gray-200"></div>
        
        {/* Timeline cells */}
        <div className="flex-1 flex">
          {timelineCells.map((cell, index) => (
            <div
              key={index}
              className={`flex-1 border-r border-gray-200 py-1 px-2 text-center ${
                cell.isToday ? 'bg-blue-50' : ''
              }`}
            >
              <div className={`text-sm font-medium ${
                cell.isToday ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {cell.label}
              </div>
              {viewMode === 'day' && (
                <div className="text-xs text-gray-500 mt-1">
                  {cell.date.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
