import React, { useMemo } from 'react';
import { TeamSchedulerViewProps } from '../types/teamScheduler';
import { TeamMemberRow } from './TeamMemberRow';

export const TeamSchedulerView: React.FC<TeamSchedulerViewProps> = ({
  currentDate,
  teamMembers,
  onProjectClick,
  onProjectHover,
  hoveredProject,
}) => {
  // Calculate the week range
  const weekRange = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return { start: startOfWeek, end: endOfWeek };
  }, [currentDate]);

  // Generate days of the week for the header
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekRange.start);
      day.setDate(weekRange.start.getDate() + i);
      days.push(day);
    }
    return days;
  }, [weekRange.start]);

  const formatDay = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDate = (date: Date): string => {
    return date.getDate().toString();
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Team Scheduler
          </h2>
          <p className="text-gray-600 mt-1">
            Week of {weekRange.start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {weekRange.end.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Main Scheduler Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Week Header */}
          <div className="flex border-b border-gray-200">
            {/* Left Column Header */}
            <div className="w-64 p-4 bg-gray-50 border-r border-gray-200">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Team Members
              </div>
            </div>
            
            {/* Timeline Header */}
            <div className="flex-1">
              <div className="grid grid-cols-7">
                {weekDays.map((day, index) => (
                  <div key={index} className="p-3 text-center border-r border-gray-200 last:border-r-0">
                    <div className={`text-sm font-medium text-gray-500 ${
                      isToday(day) ? 'text-blue-600' : ''
                    }`}>
                      {formatDay(day)}
                    </div>
                    <div className={`text-lg font-semibold mt-1 ${
                      isToday(day) ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {formatDate(day)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team Members Rows */}
          <div className="divide-y divide-gray-200">
            {teamMembers.map((member) => (
              <TeamMemberRow
                key={member.id}
                member={member}
                weekStart={weekRange.start}
                weekEnd={weekRange.end}
                onProjectClick={onProjectClick}
                onProjectHover={onProjectHover}
                hoveredProject={hoveredProject}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Project Status Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span className="text-sm text-gray-700">PV90</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-teal-200 rounded"></div>
              <span className="text-sm text-gray-700">UB</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-amber-100 rounded"></div>
              <span className="text-sm text-gray-700">WB</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100 rounded"></div>
              <span className="text-sm text-gray-700">WIP</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <span className="text-sm text-gray-700">QF</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span className="text-sm text-gray-700">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
