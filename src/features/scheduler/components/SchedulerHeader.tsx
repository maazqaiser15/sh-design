import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, CalendarDays, Users, FolderOpen } from 'lucide-react';
import { Button } from '../../../common/components/Button';
import { SchedulerHeaderProps, SchedulerView, SchedulerMode } from '../types';

export const SchedulerHeader: React.FC<SchedulerHeaderProps> = ({
  currentDate,
  view,
  mode,
  onDateChange,
  onViewChange,
  onModeChange,
  onTodayClick,
}) => {
  const formatDate = (date: Date, view: SchedulerView): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
    };

    if (view === 'day') {
      options.day = 'numeric';
      return date.toLocaleDateString('en-US', options);
    } else if (view === 'week') {
      const startOfWeek = new Date(date);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day;
      startOfWeek.setDate(diff);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      return date.toLocaleDateString('en-US', options);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      default:
        // Default to day navigation if view is not recognized
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    onDateChange(newDate);
  };

  const viewButtons: { view: SchedulerView; label: string }[] = [
    { view: 'day', label: 'Day' },
    { view: 'week', label: 'Week' },
    { view: 'month', label: 'Month' },
  ];

  const modeButtons: { mode: SchedulerMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'projects', label: 'Projects', icon: <FolderOpen size={16} /> },
    { mode: 'team', label: 'Team', icon: <Users size={16} /> },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Navigation and Date */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('prev')}
              icon={ChevronLeft}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateDate('next')}
              icon={ChevronRight}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar size={20} className="text-gray-500" />
            <h1 className="text-xl font-semibold text-gray-900">
              {formatDate(currentDate, view)}
            </h1>
          </div>
        </div>

        {/* Right side - Mode, View buttons and Today */}
        <div className="flex items-center space-x-4">
          {/* Mode Switcher */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {modeButtons.map(({ mode: buttonMode, label, icon }) => (
              <button
                key={buttonMode}
                onClick={() => onModeChange(buttonMode)}
                className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  mode === buttonMode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* View Switcher */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {viewButtons.map(({ view: buttonView, label }) => (
              <button
                key={buttonView}
                onClick={() => onViewChange(buttonView)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  view === buttonView
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={onTodayClick}
            icon={CalendarDays}
          >
            Today
          </Button>
        </div>
      </div>
    </div>
  );
};
