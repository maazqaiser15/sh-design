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
  hoveredProject
}) => {
  const timelineCells = getTimelineCells(currentDate, viewMode);
  const trailerStatusColors = {
    'available': 'bg-green-200 text-green-800 border-green-300',
    'low': 'bg-yellow-200 text-yellow-800 border-yellow-300',
    'unavailable': 'bg-red-200 text-red-800 border-red-300'
  };

  const getTrailerInitial = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const getTrailerColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-red-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  // Calculate row height based on number of assigned projects (same as TeamRow)
  const projectBarHeight = 28; // Same as TeamRow
  const projectSpacing = 32; // Same as TeamRow
  const projectsCount = trailer.assignedProjects.length;
  const calculatedHeight = Math.max(64, 32 + (projectsCount * projectSpacing));

  return (
    <div className="flex border-b border-gray-200 hover:bg-gray-50" style={{ height: `${calculatedHeight}px` }}>
      {/* Trailer Info Column */}
      <div className="w-80 flex items-center px-4 py-3 border-r border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          {/* Trailer Avatar */}
          <div className={`w-8 h-8 rounded-full ${getTrailerColor(trailer.trailerName)} flex items-center justify-center text-white text-sm font-semibold`}>
            {getTrailerInitial(trailer.trailerName)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {trailer.trailerName}
              </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${trailerStatusColors[trailer.status]}`}>
                {trailer.status.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-500">{trailer.registrationNumber}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">{trailer.location}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {trailer.assignedProjects.length} project{trailer.assignedProjects.length !== 1 ? 's' : ''} assigned
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
              const top = 4 + (index * projectSpacing); // 4px padding + 32px per project

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
