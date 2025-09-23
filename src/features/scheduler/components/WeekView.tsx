import React, { useMemo } from 'react';
import { SchedulerViewProps, SchedulerProject } from '../types';
import { PROJECT_STAGE_COLORS } from '../utils/mockData';

export const WeekView: React.FC<SchedulerViewProps> = ({
  currentDate,
  projects,
  onProjectClick,
  onProjectHover,
  hoveredProject,
}) => {
  // Get the week range
  const weekRange = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return { start: startOfWeek, end: endOfWeek };
  }, [currentDate]);

  // Filter projects that overlap with the week
  const weekProjects = useMemo(() => {
    const weekStart = weekRange.start.toISOString().split('T')[0];
    const weekEnd = weekRange.end.toISOString().split('T')[0];
    
    return projects.filter(project => {
      const projectStart = project.startDate;
      const projectEnd = project.endDate;
      return projectStart <= weekEnd && projectEnd >= weekStart;
    });
  }, [projects, weekRange]);

  // Generate days of the week
  const days = useMemo(() => {
    const daysArray = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekRange.start);
      day.setDate(weekRange.start.getDate() + i);
      daysArray.push(day);
    }
    return daysArray;
  }, [weekRange.start]);

  // Get projects that start on a specific date (for continuous bars)
  const getProjectsStartingOnDate = (date: Date): SchedulerProject[] => {
    const dateString = date.toISOString().split('T')[0];
    return weekProjects.filter(project => project.startDate === dateString);
  };

  // Calculate how many days a project spans
  const getProjectDuration = (project: SchedulerProject): number => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Calculate project row for stacking (avoid overlapping)
  const getProjectRow = (project: SchedulerProject, startDate: Date): number => {
    const projectEnd = new Date(project.endDate);
    const weekEnd = new Date(weekRange.end);
    
    // Find all projects that overlap with this project
    const overlappingProjects = weekProjects.filter(otherProject => {
      if (otherProject.id === project.id) return false;
      
      const otherStart = new Date(otherProject.startDate);
      const otherEnd = new Date(otherProject.endDate);
      
      // Check if projects overlap
      return (otherStart <= projectEnd && otherEnd >= startDate);
    });

    // Sort overlapping projects by start date
    const sortedOverlapping = overlappingProjects.sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    // Find the first available row
    let row = 0;
    for (const otherProject of sortedOverlapping) {
      if (otherProject.startDate <= project.startDate) {
        row++;
      }
    }
    
    return row;
  };

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
            Week of {weekRange.start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </h2>
          <p className="text-gray-600 mt-1">
            {weekProjects.length} project{weekProjects.length !== 1 ? 's' : ''} scheduled this week
          </p>
        </div>

        {/* Week Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {days.map((day, index) => (
              <div key={index} className="p-4 text-center border-r border-gray-200 last:border-r-0">
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

          {/* Projects Grid with Continuous Bars */}
          <div className="grid grid-cols-7 min-h-64 relative">
            {/* Render continuous project bars */}
            {days.map((date, dayIndex) => {
              const startingProjects = getProjectsStartingOnDate(date);
              return startingProjects.map((project, projectIndex) => {
                const duration = getProjectDuration(project);
                const row = getProjectRow(project, date);
                
                return (
                  <ContinuousProjectBar
                    key={`${project.id}-${dayIndex}`}
                    project={project}
                    startDate={date}
                    duration={duration}
                    weekStart={weekRange.start}
                    weekEnd={weekRange.end}
                    row={row}
                    onProjectClick={onProjectClick}
                    onProjectHover={onProjectHover}
                    isHovered={hoveredProject?.id === project.id}
                  />
                );
              });
            })}
            
            {/* Render day cells */}
            {days.map((date, dayIndex) => {
              const isTodayDate = isToday(date);

              return (
                <div
                  key={dayIndex}
                  className={`border-r border-gray-200 last:border-r-0 p-2 bg-white`}
                >
                  {/* Date Number */}
                  <div className="mb-2">
                    <span className={`text-sm font-medium ${
                      isTodayDate 
                        ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' 
                        : 'text-gray-900'
                    }`}>
                      {formatDate(date)}
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
        </div>
      </div>
    </div>
  );
};

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
  
  // Calculate which column this project starts in (0-6 for days of week)
  const startColumn = startDate.getDay();
  
  // Calculate how many days the project actually spans within this week
  const projectEnd = new Date(project.endDate);
  const actualDuration = Math.min(
    duration,
    7 - startColumn, // Don't go beyond the week
    Math.ceil((projectEnd.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)) + 1 - startColumn
  );
  
  // Calculate position and width
  const leftPercent = (startColumn / 7) * 100;
  const widthPercent = (actualDuration / 7) * 100;
  
  // Calculate top position based on row (stacking) with 2px padding between bars
  const topOffset = 24 + (row * 28); // 24px for date number + 28px per row (26px bar + 2px padding)
  
  // Format duration text
  const formatDuration = (days: number): string => {
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    return `${Math.ceil(days / 7)} week${Math.ceil(days / 7) > 1 ? 's' : ''}`;
  };

  return (
    <div
      className="absolute group cursor-pointer transition-all duration-200 hover:shadow-md"
      style={{
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        top: `${topOffset}px`,
        height: '26px',
        zIndex: 20 - row, // Higher z-index for projects starting earlier
      }}
      onClick={() => onProjectClick(project)}
      onMouseEnter={() => onProjectHover(project)}
      onMouseLeave={() => onProjectHover(null)}
    >
      <div
        className={`${statusColors} h-full rounded-md px-2 py-1 border transition-all duration-200 ${
          isHovered ? 'border-opacity-100 shadow-lg' : 'border-opacity-50'
        }`}
        title={`${project.name} (${project.stage}) - ${formatDuration(duration)}`}
      >
        <div className="flex items-center justify-between h-full">
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold truncate text-gray-900">
              {project.name}
            </h4>
          </div>
          <div className="flex-shrink-0 ml-1">
            <span className={`inline-flex items-center px-1 py-0.5 rounded text-xs font-medium ${
              project.stage === 'PV90' ? 'bg-gray-100 text-gray-700' :
              project.stage === 'UB' ? 'bg-teal-100 text-teal-700' :
              project.stage === 'WB' ? 'bg-amber-100 text-amber-700' :
              project.stage === 'WIP' ? 'bg-blue-100 text-blue-700' :
              project.stage === 'QF' ? 'bg-orange-100 text-orange-700' :
              'bg-green-100 text-green-700'
            }`}>
              {project.stage}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
