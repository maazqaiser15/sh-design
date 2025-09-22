import React, { useState, useRef } from 'react';
import { SchedulerViewProps } from '../../types';
import { ProjectBar } from '../ProjectBar';
import { ProjectTooltip } from '../ProjectTooltip';

export const DayView: React.FC<SchedulerViewProps> = ({
  projects,
  currentDate,
  onProjectClick,
  onProjectHover,
  hoveredProject
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter projects for the current day
  const dayProjects = projects.filter(project => {
    if (!currentDate) return false;
    
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);
    const currentDay = new Date(currentDate);
    
    // Check if the current day falls within the project's date range
    return currentDay >= projectStart && currentDay <= projectEnd;
  });

  // Sort projects by start time (assuming all start at 9 AM for simplicity)
  const sortedProjects = dayProjects.sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

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

        {/* Main content area */}
        <div className="flex-1 relative">
          {/* Day header */}
          <div className="h-12 border-b border-gray-200 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-900">
              {currentDate ? currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Loading...'}
            </span>
          </div>

          {/* Time grid */}
          <div className="relative">
            {timeSlots.map(hour => (
              <div key={hour} className="h-16 border-b border-gray-100"></div>
            ))}

            {/* Project bars */}
            <div className="absolute inset-0 p-2">
              <div className="space-y-2">
                {sortedProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="relative"
                    style={{ 
                      top: `${index * 4}rem`, // Stack projects vertically
                      height: '3rem'
                    }}
                  >
                    <ProjectBar
                      project={project}
                      onProjectClick={onProjectClick}
                      onProjectHover={handleProjectHover}
                      isHovered={hoveredProject?.id === project.id}
                    />
                  </div>
                ))}
              </div>
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
