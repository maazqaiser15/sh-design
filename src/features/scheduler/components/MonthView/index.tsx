import React, { useState, useRef } from 'react';
import { SchedulerViewProps } from '../../types';
import { ProjectBar } from '../ProjectBar';
import { ProjectTooltip } from '../ProjectTooltip';

export const MonthView: React.FC<SchedulerViewProps> = ({
  projects,
  currentDate,
  onProjectClick,
  onProjectHover,
  hoveredProject
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get first day of the month
  const firstDayOfMonth = currentDate ? new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) : new Date();
  
  // Get last day of the month
  const lastDayOfMonth = currentDate ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0) : new Date();
  
  // Get start of the week for the first day (Sunday)
  const startOfCalendar = new Date(firstDayOfMonth);
  startOfCalendar.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());
  
  // Get end of the week for the last day (Saturday)
  const endOfCalendar = new Date(lastDayOfMonth);
  endOfCalendar.setDate(lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()));

  // Filter projects that overlap with the current month
  const monthProjects = projects.filter(project => {
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);
    
    // Check if project overlaps with the month
    return projectStart <= lastDayOfMonth && projectEnd >= firstDayOfMonth;
  });

  // Generate calendar days
  const calendarDays = [];
  const currentDay = new Date(startOfCalendar);
  
  while (currentDay <= endOfCalendar) {
    calendarDays.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }

  const handleProjectHover = (project: any) => {
    onProjectHover(project);
    if (project) {
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hoveredProject) {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const getProjectPosition = (project: any) => {
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);
    
    // Calculate which day the project starts
    const startDayIndex = Math.max(0, Math.floor((projectStart.getTime() - startOfCalendar.getTime()) / (1000 * 60 * 60 * 24)));
    const endDayIndex = Math.min(calendarDays.length - 1, Math.ceil((projectEnd.getTime() - startOfCalendar.getTime()) / (1000 * 60 * 60 * 24)));
    
    const left = (startDayIndex / 7) * 100;
    const width = ((endDayIndex - startDayIndex + 1) / 7) * 100;
    
    return { left: `${left}%`, width: `${width}%` };
  };

  const isCurrentMonth = (day: Date) => {
    return currentDate ? day.getMonth() === currentDate.getMonth() : false;
  };

  const isToday = (day: Date) => {
    const today = new Date();
    return day.getDate() === today.getDate() && 
           day.getMonth() === today.getMonth() && 
           day.getFullYear() === today.getFullYear();
  };

  // Group projects by week for better layout
  const projectsByWeek: any[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    const weekDays = calendarDays.slice(i, i + 7);
    const weekProjects = monthProjects.filter(project => {
      const projectStart = new Date(project.startDate);
      const projectEnd = new Date(project.endDate);
      const weekStart = weekDays[0];
      const weekEnd = weekDays[6];
      return projectStart <= weekEnd && projectEnd >= weekStart;
    });
    projectsByWeek.push(weekProjects);
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 bg-white overflow-auto"
      onMouseMove={handleMouseMove}
    >
      {/* Month header */}
      <div className="h-12 border-b border-gray-200 flex">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="flex-1 border-r border-gray-200 last:border-r-0 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-900">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="relative">
        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                h-24 border-r border-b border-gray-200 last:border-r-0 p-1
                ${isCurrentMonth(day) ? 'bg-white' : 'bg-gray-50'}
                ${isToday(day) ? 'bg-blue-50' : ''}
              `}
            >
              <div className={`
                text-sm font-medium
                ${isCurrentMonth(day) ? 'text-gray-900' : 'text-gray-400'}
                ${isToday(day) ? 'text-blue-600' : ''}
              `}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Project bars */}
        <div className="absolute inset-0 p-1">
          {projectsByWeek.map((weekProjects, weekIndex) => (
            <div key={weekIndex} className="relative h-24">
              {weekProjects.map((project, projectIndex) => {
                const position = getProjectPosition(project);
                return (
                  <div
                    key={project.id}
                    className="absolute h-6"
                    style={{
                      ...position,
                      top: `${projectIndex * 1.75}rem`, // Stack projects vertically
                    }}
                  >
                    <ProjectBar
                      project={project}
                      onProjectClick={onProjectClick}
                      onProjectHover={handleProjectHover}
                      isHovered={hoveredProject?.id === project.id}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      <ProjectTooltip
        project={hoveredProject!}
        position={tooltipPosition}
        visible={showTooltip && !!hoveredProject}
      />
    </div>
  );
};
