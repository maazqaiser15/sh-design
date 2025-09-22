import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Filter, Search } from 'lucide-react';
import { Button } from '../../common/components/Button';
import { CalendarView } from '../../types/scheduler';

interface CalendarHeaderProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onCreateEvent: () => void;
  onFilterToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  view,
  onViewChange,
  onCreateEvent,
  onFilterToggle,
  searchQuery,
  onSearchChange,
}) => {
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(view.date);
    
    switch (view.type) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    onViewChange({ ...view, date: newDate });
  };

  const goToToday = () => {
    onViewChange({ ...view, date: new Date() });
  };

  const formatDateRange = () => {
    const date = view.date;
    const options: Intl.DateTimeFormatOptions = { 
      month: 'long', 
      year: 'numeric' 
    };

    switch (view.type) {
      case 'day':
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        });
      case 'week':
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      case 'month':
        return date.toLocaleDateString('en-US', options);
      case 'agenda':
        return 'Agenda View';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Navigation */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-text-secondary" />
            </button>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-text-secondary" />
            </button>
          </div>
          
          <Button variant="secondary" size="sm" onClick={goToToday}>
            Today
          </Button>
          
          <h2 className="text-h2 font-semibold text-text-primary">
            {formatDateRange()}
          </h2>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search events, projects, or team members..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Right Section - Actions and Views */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            icon={Filter}
            onClick={onFilterToggle}
          >
            Filters
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onCreateEvent}
          >
            Create Event
          </Button>
          
          {/* View Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['month', 'week', 'day', 'agenda'] as const).map((viewType) => (
              <button
                key={viewType}
                onClick={() => onViewChange({ ...view, type: viewType })}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                  view.type === viewType
                    ? 'bg-white text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {viewType}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
