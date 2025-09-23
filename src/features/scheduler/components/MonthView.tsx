import React, { useMemo } from 'react';
import { SchedulerViewProps, SchedulerProject } from '../types';
import { PROJECT_STAGE_COLORS } from '../utils/mockData';

export const MonthView: React.FC<SchedulerViewProps> = ({
  currentDate,
  projects,
  onProjectClick,
  onProjectHover,
  hoveredProject,
}) => {
  // Generate calendar grid
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the first Sunday of the calendar
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // End at the last Saturday of the calendar
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const weeks = [];
    const currentWeek = [];
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      currentWeek.push(new Date(date));
      
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek.length = 0;
      }
    }
    
    return weeks;
  }, [currentDate]);

  // Filter projects for the month (include projects that are visible in the calendar)
  const monthProjects = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get the full calendar range (including previous/next month days shown)
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the first Sunday of the calendar
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // End at the last Saturday of the calendar
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const calendarStart = startDate.toISOString().split('T')[0];
    const calendarEnd = endDate.toISOString().split('T')[0];
    
    const filteredProjects = projects.filter(project => {
      const projectStart = project.startDate;
      const projectEnd = project.endDate;
      return projectStart <= calendarEnd && projectEnd >= calendarStart;
    });
    
    return filteredProjects;
  }, [currentDate, projects]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const formatDay = (date: Date): string => {
    return date.getDate().toString();
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
  };

  const getProjectsForDate = (date: Date): SchedulerProject[] => {
    const dateString = date.toISOString().split('T')[0];
    return monthProjects.filter(project => {
      const projectStart = project.startDate;
      const projectEnd = project.endDate;
      return dateString >= projectStart && dateString <= projectEnd;
    });
  };

  // Get projects that start on a specific date (for continuous bars)
  const getProjectsStartingOnDate = (date: Date): SchedulerProject[] => {
    const dateString = date.toISOString().split('T')[0];
    return monthProjects.filter(project => project.startDate === dateString);
  };

  // Calculate how many days a project spans
  const getProjectDuration = (project: SchedulerProject): number => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {formatDate(currentDate)}
          </h2>
          <p className="text-gray-600 mt-1">
            {monthProjects.length} project{monthProjects.length !== 1 ? 's' : ''} scheduled this month
          </p>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {weekDays.map((day) => (
              <div key={day} className="p-3 text-center bg-gray-50">
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  {day}
                </div>
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="divide-y divide-gray-200">
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 min-h-64 relative">
                {/* Render continuous project bars */}
                {week.map((date, dayIndex) => {
                  const startingProjects = getProjectsStartingOnDate(date);
                  return startingProjects.map((project, projectIndex) => {
                    const duration = getProjectDuration(project);
                    const projectRow = projectIndex; // This will be used for stacking
                    
                    return (
                      <ContinuousProjectBar
                        key={`${project.id}-${dayIndex}`}
                        project={project}
                        startDate={date}
                        duration={duration}
                        weekStart={week[0]}
                        weekEnd={week[6]}
                        row={projectRow}
                        onProjectClick={onProjectClick}
                        onProjectHover={onProjectHover}
                        isHovered={hoveredProject?.id === project.id}
                      />
                    );
                  });
                })}
                
                {/* Render day cells */}
                {week.map((date, dayIndex) => {
                  const isCurrentMonthDay = isCurrentMonth(date);
                  const isTodayDate = isToday(date);

                  return (
                    <div
                      key={dayIndex}
                      className={`border-r border-gray-200 last:border-r-0 p-2 ${
                        isCurrentMonthDay ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      {/* Date Number */}
                      <div className="mb-2">
                        <span className={`text-sm font-medium ${
                          isTodayDate 
                            ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' 
                            : isCurrentMonthDay 
                              ? 'text-gray-900' 
                              : 'text-gray-400'
                        }`}>
                          {formatDay(date)}
                        </span>
                      </div>

                      {/* Space for project bars - they will be positioned absolutely */}
                      <div className="space-y-0.5" style={{ minHeight: '200px' }}>
                        {/* This space is reserved for the absolutely positioned project bars */}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProjectBarProps {
  project: SchedulerProject;
  onProjectClick: (project: SchedulerProject) => void;
  onProjectHover: (project: SchedulerProject | null) => void;
  isHovered: boolean;
  index: number;
}

interface ContinuousProjectBarProps {
  project: SchedulerProject;
  startDate: Date;
  duration: number;
  weekStart: Date;
  weekEnd: Date;
  row: number;
  onProjectClick: (project: SchedulerProject) => void;
  onProjectHover: (project: SchedulerProject | null) => void;
  isHovered: boolean;
}

const ContinuousProjectBar: React.FC<ContinuousProjectBarProps> = ({
  project,
  startDate,
  duration,
  weekStart,
  weekEnd,
  row,
  onProjectClick,
  onProjectHover,
  isHovered,
}) => {
  const statusColors = PROJECT_STAGE_COLORS[project.stage];
  
  // Calculate the start column (0-6) within the week
  const startColumn = startDate.getDay();
  
  // Calculate how many columns the project spans within this week
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + duration - 1);
  
  const weekEndDate = new Date(weekEnd);
  weekEndDate.setHours(23, 59, 59, 999);
  
  const actualEndDate = endDate < weekEndDate ? endDate : weekEndDate;
  const actualDuration = Math.ceil((actualEndDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Calculate position and width
  const leftPercent = (startColumn / 7) * 100;
  const widthPercent = (actualDuration / 7) * 100;
  
  // Calculate top position based on row (stacking) with 2px padding between bars
  const topOffset = 24 + (row * 28); // 24px for date number + 28px per row (26px bar + 2px padding)
  
  // Format duration text
  const formatDuration = (days: number): string => {
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days < 14) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''}`;
    return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''}`;
  };
  
  return (
    <div
      className={`absolute cursor-pointer transition-all duration-200 ${
        isHovered ? 'transform scale-105 shadow-lg z-10' : 'hover:shadow-sm'
      }`}
      onClick={() => onProjectClick(project)}
      onMouseEnter={() => onProjectHover(project)}
      onMouseLeave={() => onProjectHover(null)}
      style={{
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        top: `${topOffset}px`,
        height: '26px', // Increased height for 6px padding
        zIndex: 10 - row,
      }}
    >
      <div className={`${statusColors} rounded-sm text-xs py-1.5 px-1.5 border-l-2 h-full flex items-center transition-all duration-200 ${
        isHovered ? 'border-opacity-100 shadow-sm' : 'border-opacity-60'
      }`}>
        <div className="flex items-center justify-between w-full min-w-0">
          <div className="font-medium truncate text-xs leading-tight">
            {project.name}
          </div>
          <div className="ml-1 flex-shrink-0">
            <span className={`inline-flex items-center px-1 py-0.5 rounded text-xs font-bold ${
              project.stage === 'PV90' ? 'bg-gray-200 text-gray-800' :
              project.stage === 'UB' ? 'bg-teal-200 text-teal-800' :
              project.stage === 'WB' ? 'bg-amber-200 text-amber-800' :
              project.stage === 'WIP' ? 'bg-blue-200 text-blue-800' :
              project.stage === 'QF' ? 'bg-orange-200 text-orange-800' :
              'bg-green-200 text-green-800'
            }`}>
              {project.stage}
            </span>
          </div>
        </div>
      </div>
      
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
            <div className="font-semibold text-white mb-1">{project.name}</div>
            <div className="flex items-center space-x-2 text-gray-300">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                project.stage === 'PV90' ? 'bg-gray-600 text-gray-200' :
                project.stage === 'UB' ? 'bg-teal-600 text-teal-200' :
                project.stage === 'WB' ? 'bg-amber-600 text-amber-200' :
                project.stage === 'WIP' ? 'bg-blue-600 text-blue-200' :
                project.stage === 'QF' ? 'bg-orange-600 text-orange-200' :
                'bg-green-600 text-green-200'
              }`}>
                {project.stage}
              </span>
              <span>•</span>
              <span>{formatDuration(duration)}</span>
            </div>
            <div className="text-gray-400 text-xs mt-1">
              {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            {/* Arrow pointing down */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProjectBar: React.FC<ProjectBarProps> = ({
  project,
  onProjectClick,
  onProjectHover,
  isHovered,
  index,
}) => {
  const statusColors = PROJECT_STAGE_COLORS[project.stage];
  
  // Calculate duration for tooltip
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Format duration text
  const formatDuration = (days: number): string => {
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days < 14) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''}`;
    return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''}`;
  };
  
  return (
    <div
      className={`relative group cursor-pointer transition-all duration-200 ${
        isHovered ? 'transform scale-105 shadow-lg z-10' : 'hover:shadow-sm'
      }`}
      onClick={() => onProjectClick(project)}
      onMouseEnter={() => onProjectHover(project)}
      onMouseLeave={() => onProjectHover(null)}
      style={{ zIndex: 10 - index }}
    >
      <div className={`${statusColors} rounded-sm text-xs py-0.5 px-1.5 border-l-2 transition-all duration-200 ${
        isHovered ? 'border-opacity-100 shadow-sm' : 'border-opacity-60'
      }`}>
        <div className="flex items-center justify-between">
          <div className="font-medium truncate text-xs leading-tight">
            {project.name}
          </div>
          <div className="ml-1 flex-shrink-0">
            <span className={`inline-flex items-center px-1 py-0.5 rounded text-xs font-bold ${
              project.stage === 'PV90' ? 'bg-gray-200 text-gray-800' :
              project.stage === 'UB' ? 'bg-teal-200 text-teal-800' :
              project.stage === 'WB' ? 'bg-amber-200 text-amber-800' :
              project.stage === 'WIP' ? 'bg-blue-200 text-blue-800' :
              project.stage === 'QF' ? 'bg-orange-200 text-orange-800' :
              'bg-green-200 text-green-800'
            }`}>
              {project.stage}
            </span>
          </div>
        </div>
      </div>
      
      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-nowrap">
            <div className="font-semibold text-white mb-1">{project.name}</div>
            <div className="flex items-center space-x-2 text-gray-300">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                project.stage === 'PV90' ? 'bg-gray-600 text-gray-200' :
                project.stage === 'UB' ? 'bg-teal-600 text-teal-200' :
                project.stage === 'WB' ? 'bg-amber-600 text-amber-200' :
                project.stage === 'WIP' ? 'bg-blue-600 text-blue-200' :
                project.stage === 'QF' ? 'bg-orange-600 text-orange-200' :
                'bg-green-600 text-green-200'
              }`}>
                {project.stage}
              </span>
              <span>•</span>
              <span>{formatDuration(duration)}</span>
            </div>
            <div className="text-gray-400 text-xs mt-1">
              {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            {/* Arrow pointing down */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
