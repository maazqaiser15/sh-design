import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, CalendarDays } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { SchedulerHeaderProps, SchedulerView } from '../../types';

export const SchedulerHeader: React.FC<SchedulerHeaderProps> = ({
  currentDate,
  view,
  onDateChange,
  onViewChange,
  onTodayClick
}) => {
  const formatDateDisplay = () => {
    if (!currentDate) return 'Loading...';
    
    switch (view) {
      case 'day':
        return currentDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'week':
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'month':
        return currentDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        });
      default:
        return currentDate.toLocaleDateString();
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (!currentDate) return;
    
    const newDate = new Date(currentDate);
    
    switch (view) {
      case 'day':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    onDateChange(newDate);
  };

  const viewButtons: { view: SchedulerView; label: string }[] = [
    { view: 'day', label: 'Day' },
    { view: 'week', label: 'Week' },
    { view: 'month', label: 'Month' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Navigation and Today button */}
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
          
          <Button
            variant="outline"
            size="sm"
            onClick={onTodayClick}
            icon={CalendarDays}
          >
            Today
          </Button>
        </div>

        {/* Center - Date display */}
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <h1 className="text-xl font-semibold text-gray-900">
            {formatDateDisplay()}
          </h1>
        </div>

        {/* Right side - View toggles */}
        <div className="flex items-center space-x-1">
          {viewButtons.map(({ view: buttonView, label }) => (
            <Button
              key={buttonView}
              variant={view === buttonView ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => onViewChange(buttonView)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
