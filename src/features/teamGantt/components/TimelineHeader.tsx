import React, { useMemo } from 'react';
import { TimelineHeaderProps, TimelineCell } from '../types/ganttTypes';
import SelectField from 'common/components/SelectField';
import SearchField from 'common/components/SearchField';

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
    <div className="border-b border-gray-200">
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
            <SelectField value={filters.assignedUsers.length > 0 ? filters.assignedUsers[0] : ''} onChange={(e) => {
              if (e.target.value) {
                handleUserFilter(e.target.value);
              } else {
                onFiltersChange?.({
                  ...filters,
                  assignedUsers: [],
                });
              }
            }}
              placeholder={'All Types'} options={[{
                label: 'D75', value: 'D75'
              },
              {
                label: 'PV90', value: 'PV90'
              },
              {
                label: 'UB', value: 'UB'
              },
              {
                label: 'WB', value: 'WB'
              },
              {
                label: 'WIP', value: 'WIP'
              },
              {
                label: 'QF', value: 'QF'
              },
              {
                label: 'QC', value: 'QC'
              },
              {
                label: 'Completed', value: 'Completed'
              },
              ]} className='border border-gray-300 rounded-lg' />
          )}

  
          {/* All Roles Filter - Only for Team View */}
          {layoutMode === 'team' && (

            <SelectField value={filters.trailerProjects.length > 0 ? filters.trailerProjects[0] : ''} onChange={(e) => {
              if (e.target.value) {
                handleTrailerProjectFilter(e.target.value);
              } else {
                onFiltersChange?.({
                  ...filters,
                  trailerProjects: [],
                });
              }
            }} placeholder={'All Roles'} options={[{
              label: 'Lead', value: 'Lead'
            },
            {
              label: 'Supervisor', value: 'Supervisor'
            },
            {
              label: 'Project Coordinator', value: 'Project Coordinator'
            },
            {
              label: 'Supervisor', value: 'Supervisor'
            },
            {
              label: 'Crew Leader', value: 'Crew Leader'
            },
            {
              label: 'Installer', value: 'Installer'
            }
            ]} className='border border-gray-300 rounded-lg' />
          )}

          {/* All Status Filter - Only for Team View */}
          {layoutMode === 'team' && (
            <>
              <SelectField value={filters.trailerProjects.length > 0 ? filters.trailerProjects[0] : ''} onChange={(e) => {
                if (e.target.value) {
                  handleTrailerProjectFilter(e.target.value);
                } else {
                  onFiltersChange?.({
                    ...filters,
                    trailerProjects: [],
                  });
                }
              }} placeholder={'All Status'} options={[{
                label: 'Available', value: 'Available'
              },
              {
                label: 'Unavailable', value: 'Unavailable'
              }
              ]} className='border border-gray-300 rounded-lg' />
            </>
          )}

          {/* All Locations Filter - Only for Trailer View */}
          {layoutMode === 'trailer' && (
            <>
              <SelectField value={filters.trailerProjects.length > 0 ? filters.trailerProjects[0] : ''} onChange={(e) => {
                if (e.target.value) {
                  handleTrailerProjectFilter(e.target.value);
                } else {
                  onFiltersChange?.({
                    ...filters,
                    trailerProjects: [],
                  });
                }
              }} placeholder={'All Cities'} options={[]} className='border border-gray-300 rounded-lg' />

              <SelectField value={filters.trailerProjects.length > 0 ? filters.trailerProjects[0] : ''} onChange={(e) => {
                if (e.target.value) {
                  handleTrailerProjectFilter(e.target.value);
                } else {
                  onFiltersChange?.({
                    ...filters,
                    trailerProjects: [],
                  });
                }
              }} placeholder={'All States'} options={[]} className='border border-gray-300 rounded-lg' />
            </>

          )}

          {/* All Availability Filter - Only for Trailer View */}
          {layoutMode === 'trailer' && (
            <>
              <SelectField value={filters.trailerAvailability.length > 0 ? filters.trailerAvailability[0] : ''}
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
                placeholder={'All Availability'} options={[
                  { label: 'Available', value: 'Available' },
                  { label: 'Unavailable', value: 'Unavailable' }
                ]} className='border border-gray-300 rounded-lg' />
            </>
          )}
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
        
          <SearchField iconSize={20} value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} placeholder={layoutMode === 'team' ? 'Search team members...' : layoutMode === 'project' ? 'Search projects...' : 'Search trailers...'} className='border border-gray-300 rounded-lg'/>
        </div>

        {/* Right Column - Timeline Header */}
        <div className="flex-1">
          <div className="flex w-full">
            {timelineCells.map((cell, index) => (
              <div
                key={index}
                className={`flex-1 ${viewMode === 'month' ? 'px-1 py-1' : 'px-2 py-1'} text-center border-r border-gray-200 last:border-r-0 ${cell.isToday
                  ? 'bg-blue-50 text-blue-900'
                  : cell.isCurrentPeriod
                    ? 'bg-white'
                    : 'bg-gray-50 text-gray-500'
                  }`}
              >
                <div className={`${viewMode === 'month' ? 'text-xs' : 'text-sm'} font-medium ${cell.isToday ? 'text-blue-900' : 'text-gray-900'
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
