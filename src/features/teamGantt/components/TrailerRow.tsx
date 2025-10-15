import React from 'react';
import { TrailerRowProps, Project } from '../types/ganttTypes';
import { ProjectBar } from './ProjectBar';
import { getTimelineCells, getProjectBarPosition } from '../utils/dataTransform';

export const TrailerRow: React.FC<TrailerRowProps> = ({
  trailer,
  viewMode,
  currentDate,
  onProjectHover,
  onProjectClick,
  hoveredProject,
  onTrailerClick
}) => {
  const timelineCells = getTimelineCells(currentDate, viewMode);
  const trailerStatusDots = {
    'available': 'bg-green-500',
    'low': 'bg-orange-500',
    'unavailable': 'bg-red-500'
  };


  // Calculate row height based on number of assigned projects (same as TeamRow)
  const projectBarHeight = 60; // Reduced height for better appearance
  const projectSpacing = 32; // Same as TeamRow
  const projectsCount = trailer.assignedProjects.length;
  const calculatedHeight = Math.max(64, 32 + (projectsCount * projectSpacing));

  return (
    <div className="flex border-b border-gray-200 hover:bg-gray-50" style={{ height: `${calculatedHeight}px` }}>
      {/* Trailer Info Column */}
      <div 
        className="w-80 flex items-center px-4 py-3 border-r border-gray-200 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onTrailerClick?.(trailer)}
      >
        <div className="flex items-center space-x-3">
          {/* Status Dot */}
          <div className={`w-3 h-3 rounded-full ${trailerStatusDots[trailer.status]}`}></div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {trailer.trailerName} 
              </h3>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500">{trailer.registrationNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Column */}
      <div className="flex-1 relative bg-white">
        <div className="relative h-full">
          {/* Timeline Grid */}
          <div className="absolute inset-0 flex">
            {timelineCells.map((cell, index) => (
              <div
                key={index}
                className={`flex-1 border-r border-gray-200 ${
                  cell.isToday ? 'bg-blue-50' : ''
                }`}
              />
            ))}
          </div>

          {/* Project Bars */}
          <div className="relative h-full">
            {trailer.assignedProjects.map((project, index) => {
              const projectData: Project = {
                projectId: project.projectId,
                projectName: project.projectName,
                status: project.projectStatus,
                startDate: project.startDate,
                endDate: project.endDate,
                role: project.role
              };

              const { startPosition, width } = getProjectBarPosition(
                projectData,
                currentDate,
                viewMode
              );

              // Simple vertical positioning like TeamRow
              const top = 10; // Center vertically (80px container - 60px bar = 20px, 20px/2 = 10px)

              return (
                <ProjectBar
                  key={`${project.projectId}-${index}`}
                  project={projectData}
                  startPosition={startPosition}
                  width={width}
                  top={top}
                  height={projectBarHeight}
                  onHover={onProjectHover}
                  onClick={onProjectClick}
                  isHovered={hoveredProject?.projectId === project.projectId}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
