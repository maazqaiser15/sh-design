import React, { useMemo } from 'react';
import { TimelineHeaderProps, TimelineCell } from '../types/ganttTypes';

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  viewMode,
  currentDate,
  onDateChange,
  searchTerm,
  onSearchChange,
  layoutMode,
  filters = { status: [], assignedUsers: [], trailerProjects: [], trailerAvailability: [] },
  onFiltersChange,
  allUsers = []
}) => {
  const handleStatusFilter = (status: string) => {
    if (!onFiltersChange) return;
    
    onFiltersChange({
      ...filters,
      status: status ? [status] : [],
    });
  };

  const handleUserFilter = (userId: string) => {
    if (!onFiltersChange) return;
    
    onFiltersChange({
      ...filters,
      assignedUsers: userId ? [userId] : [],
    });
  };

  const handleTrailerProjectFilter = (projectName: string) => {
    if (!onFiltersChange) return;
    
    onFiltersChange({
      ...filters,
      trailerProjects: projectName ? [projectName] : [],
    });
  };

  const handleTrailerAvailabilityFilter = (availability: string) => {
    if (!onFiltersChange) return;
    
    onFiltersChange({
      ...filters,
      trailerAvailability: availability ? [availability] : [],
    });
  };
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
        
        <div className="flex items-center space-x-4">
          
          {/* Status Filter - Only for Project View */}
          {layoutMode === 'project' && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <select
                value={filters.status.length > 0 ? filters.status[0] : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    handleStatusFilter(e.target.value);
                  } else {
                    onFiltersChange?.({
                      ...filters,
                      status: [],
                    });
                  }
                }}
                className="block w-48 pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">All Status</option>
                {['PV75', 'PV90', 'UB', 'WB', 'WIP', 'QF', 'QC', 'Completed'].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* User Filter - Only for Project View */}
          {layoutMode === 'project' && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <select
                value={filters.assignedUsers.length > 0 ? filters.assignedUsers[0] : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    handleUserFilter(e.target.value);
                  } else {
                    onFiltersChange?.({
                      ...filters,
                      assignedUsers: [],
                    });
                  }
                }}
                className="block w-48 pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">All Users</option>
                {allUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* All Roles Filter - Only for Team View */}
          {layoutMode === 'team' && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <select
                value={filters.status.length > 0 ? filters.status[0] : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    handleStatusFilter(e.target.value);
                  } else {
                    onFiltersChange?.({
                      ...filters,
                      status: [],
                    });
                  }
                }}
                className="block w-48 pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">All Roles</option>
                {['Lead', 'Supervisor', 'Project Coordinator', 'Crew Leader', 'Installer'].map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* All Status Filter - Only for Team View */}
          {layoutMode === 'team' && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <select
                value={filters.assignedUsers.length > 0 ? filters.assignedUsers[0] : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    handleUserFilter(e.target.value);
                  } else {
                    onFiltersChange?.({
                      ...filters,
                      assignedUsers: [],
                    });
                  }
                }}
                className="block w-48 pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">All Status</option>
                {['Available', 'Unavailable', 'Out of office', 'Inactive'].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* All Locations Filter - Only for Trailer View */}
          {layoutMode === 'trailer' && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <select
                value={filters.trailerProjects.length > 0 ? filters.trailerProjects[0] : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    handleTrailerProjectFilter(e.target.value);
                  } else {
                    onFiltersChange?.({
                      ...filters,
                      trailerProjects: [],
                    });
                  }
                }}
                className="block w-48 pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">All Locations</option>
                {['Los Angeles, CA', 'Houston, TX', 'Miami, FL', 'New York, NY', 'Chicago, IL', 'Phoenix, AZ', 'Denver, CO', 'Seattle, WA', 'Portland, OR', 'Las Vegas, NV', 'Salt Lake City, UT', 'Billings, MT'].map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}

          {/* All Availability Filter - Only for Trailer View */}
          {layoutMode === 'trailer' && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <select
                value={filters.trailerAvailability.length > 0 ? filters.trailerAvailability[0] : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    handleTrailerAvailabilityFilter(e.target.value);
                  } else {
                    onFiltersChange?.({
                      ...filters,
                      trailerAvailability: [],
                    });
                  }
                }}
                className="block w-48 pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">All Availability</option>
                {['Available', 'Unavailable'].map((availability) => (
                  <option key={availability} value={availability}>
                    {availability}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={currentDate.toISOString().split('T')[0]}
              onChange={(e) => onDateChange(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-500 text-sm">to</span>
            <input
              type="date"
              value={new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              onChange={(e) => {
                const endDate = new Date(e.target.value);
                const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
                onDateChange(startDate);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Timeline Grid Header */}
      <div className="flex">
        {/* Left Column - Projects Header */}
        <div className="w-80 px-4 py-2 bg-gray-50 border-r border-gray-200">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
            {layoutMode === 'team' ? 'Team Members' : layoutMode === 'project' ? 'Projects' : 'Trailers'}
          </div>
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={layoutMode === 'team' ? 'Search team members...' : layoutMode === 'project' ? 'Search projects...' : 'Search trailers...'}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
        
        {/* Right Column - Timeline Header */}
        <div className="flex-1">
          <div className="flex w-full">
            {timelineCells.map((cell, index) => (
              <div
                key={index}
                className={`flex-1 ${viewMode === 'month' ? 'px-1 py-1' : 'px-2 py-1'} text-center border-r border-gray-200 last:border-r-0 ${
                  cell.isToday 
                    ? 'bg-blue-50 text-blue-900' 
                    : cell.isCurrentPeriod 
                      ? 'bg-white' 
                      : 'bg-gray-50 text-gray-500'
                }`}
              >
                <div className={`${viewMode === 'month' ? 'text-xs' : 'text-sm'} font-medium ${
                  cell.isToday ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {cell.label}
                </div>
                {viewMode === 'week' && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {cell.date.getDate()}
                  </div>
                )}
                {viewMode === 'month' && (
                  <div className="text-xs text-gray-500">
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
