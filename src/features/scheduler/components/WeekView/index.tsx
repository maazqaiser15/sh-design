import React, { useState, useRef } from 'react';
import { SchedulerViewProps } from '../../types';
import { ProjectBar } from '../ProjectBar';
import { ProjectTooltip } from '../ProjectTooltip';

export const WeekView: React.FC<SchedulerViewProps> = ({
  projects,
  currentDate,
  onProjectClick,
  onProjectHover,
  hoveredProject
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get start of week (Sunday)
  const startOfWeek = currentDate ? new Date(currentDate) : new Date();
  if (currentDate) {
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  }
  
  // Get end of week (Saturday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  // Filter projects that overlap with the current week
  const weekProjects = projects.filter(project => {
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);
    
    // Check if project overlaps with the week
    return projectStart <= endOfWeek && projectEnd >= startOfWeek;
  });

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

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
    
    // Calculate which day the project starts (0-6)
    const startDayIndex = Math.max(0, Math.floor((projectStart.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24)));
    const endDayIndex = Math.min(6, Math.ceil((projectEnd.getTime() - startOfWeek.getTime()) / (1000 * 60 * 60 * 24)));
    
    const left = (startDayIndex / 7) * 100;
    const width = ((endDayIndex - startDayIndex + 1) / 7) * 100;
    
    return { left: `${left}%`, width: `${width}%` };
  };

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  // Generate time slots (8 AM to 6 PM)
  const timeSlots = Array.from({ length: 11 }, (_, i) => i + 8);

  return (
    <div 
      ref={containerRef}
      className="flex-1 bg-white overflow-auto"
      onMouseMove={handleMouseMove}
    >
      <div className="flex">
        {/* Time column */}
        <div className="w-20 flex-shrink-0 border-r border-gray-200">
          <div className="h-12 border-b border-gray-200"></div>
          {timeSlots.map(hour => (
            <div key={hour} className="h-16 border-b border-gray-100 flex items-start justify-end pr-2 pt-1">
              <span className="text-xs text-gray-500">{formatTime(hour)}</span>
            </div>
          ))}
        </div>

        {/* Week grid */}
        <div className="flex-1">
          {/* Week header */}
          <div className="h-12 border-b border-gray-200 flex">
            {weekDays.map((day, index) => (
              <div key={index} className="flex-1 border-r border-gray-200 last:border-r-0 flex flex-col items-center justify-center">
                <div className="text-sm font-medium text-gray-900">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-xs text-gray-500">
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          {/* Time grid */}
          <div className="relative">
            {timeSlots.map(hour => (
              <div key={hour} className="h-16 border-b border-gray-100 flex">
                {weekDays.map((_, dayIndex) => (
                  <div key={dayIndex} className="flex-1 border-r border-gray-100 last:border-r-0"></div>
                ))}
              </div>
            ))}

            {/* Project bars */}
            <div className="absolute inset-0 p-2">
              {weekProjects.map((project, index) => {
                const position = getProjectPosition(project);
                return (
                  <div
                    key={project.id}
                    className="absolute h-8"
                    style={{
                      ...position,
                      top: `${index * 4}rem`, // Stack projects vertically
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
          </div>
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