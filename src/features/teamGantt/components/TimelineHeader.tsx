import React, { useMemo } from 'react';
import { TimelineHeaderProps, TimelineCell } from '../types';

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  viewMode,
  currentDate,
  onDateChange
}) => {
  const timelineCells = useMemo(() => {
    const cells: TimelineCell[] = [];
    
    if (viewMode === 'day') {
      // Generate a single cell for the day
      cells.push({
        date: currentDate,
        label: currentDate.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'short',
          day: 'numeric'
        }),
        isToday: currentDate.toDateString() === new Date().toDateString(),
        isCurrentPeriod: true
      });
    } else if (viewMode === 'week') {
      // Generate 7 days starting from Monday
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
      startOfWeek.setDate(diff);
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        
        cells.push({
          date,
          label: date.toLocaleDateString('en-US', { weekday: 'short' }),
          isToday: date.toDateString() === new Date().toDateString(),
          isCurrentPeriod: true
        });
      }
    } else if (viewMode === 'month') {
      // Generate all days of the month
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        
        cells.push({
          date,
          label: day.toString(),
          isToday: date.toDateString() === new Date().toDateString(),
          isCurrentPeriod: true
        });
      }
    } else if (viewMode === 'year') {
      // Generate all months of the year
      const year = currentDate.getFullYear();
      
      for (let month = 0; month < 12; month++) {
        const date = new Date(year, month, 1);
        
        cells.push({
          date,
          label: date.toLocaleDateString('en-US', { month: 'short' }),
          isToday: date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear(),
          isCurrentPeriod: true
        });
      }
    }
    
    return cells;
  }, [viewMode, currentDate]);

  const formatPeriodTitle = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `Week of ${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (viewMode === 'month') {
      return currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    } else {
      return currentDate.toLocaleDateString('en-US', {
        year: 'numeric'
      });
    }
  };

  const navigatePeriod = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'year') {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
    }
    
    onDateChange(newDate);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Navigation Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigatePeriod('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => navigatePeriod('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {formatPeriodTitle()}
          </h2>
        </div>
        
        <button
          onClick={() => onDateChange(new Date())}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Today
        </button>
      </div>

      {/* Timeline Grid Header */}
      <div className="flex">
        {/* Left Column - Projects Header */}
        <div className="w-80 p-4 bg-gray-50 border-r border-gray-200">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            Projects
          </div>
        </div>
        
        {/* Right Column - Timeline Header */}
        <div className="flex-1 overflow-x-auto">
          <div className={`flex ${viewMode === 'month' ? 'min-w-max' : 'w-full'}`}>
            {timelineCells.map((cell, index) => (
              <div
                key={index}
                className={`${viewMode === 'month' ? 'flex-shrink-0' : 'flex-1'} p-3 text-center border-r border-gray-200 last:border-r-0 ${
                  cell.isToday 
                    ? 'bg-blue-50 text-blue-900' 
                    : cell.isCurrentPeriod 
                      ? 'bg-white' 
                      : 'bg-gray-50 text-gray-500'
                }`}
                style={viewMode === 'month' ? { minWidth: '60px' } : {}}
              >
                <div className={`text-sm font-medium ${
                  cell.isToday ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {cell.label}
                </div>
                {viewMode === 'week' && (
                  <div className="text-xs text-gray-500 mt-1">
                    {cell.date.getDate()}
                  </div>
                )}
                {viewMode === 'month' && (
                  <div className="text-xs text-gray-500 mt-1">
                    {cell.date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
