import React from 'react';
import { ProjectListItem } from '../types';

interface ProjectGanttBarProps {
  project: ProjectListItem;
  startPosition: number; // Percentage from left
  width: number;         // Percentage width
  top: number;           // Vertical position in pixels
  height: number;        // Height in pixels
  onHover: (project: ProjectListItem | null) => void;
  onClick: (project: ProjectListItem) => void;
  isHovered: boolean;
}

export const ProjectGanttBar: React.FC<ProjectGanttBarProps> = ({
  project,
  startPosition,
  width,
  top,
  height,
  onHover,
  onClick,
  isHovered
}) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'PV90':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'UB':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'WB':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'WIP':
        return 'bg-green-500 hover:bg-green-600';
      case 'QF':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'Completed':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-gray-400 hover:bg-gray-500';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div
      className={`absolute rounded-md cursor-pointer transition-all duration-200 ${
        getStatusColor(project.status)
      } ${isHovered ? 'ring-2 ring-blue-300 ring-opacity-50' : ''}`}
      style={{
        left: `${startPosition}%`,
        width: `${width}%`,
        top: `${top}px`,
        height: `${height}px`,
      }}
      onMouseEnter={() => onHover(project)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(project)}
    >
      {/* Project bar content */}
      <div className="h-full flex items-center px-1 text-white text-xs font-medium">
        <span className="truncate">
          {project.title.length > 20 ? project.title.substring(0, 20) + '...' : project.title}
        </span>
      </div>
      
      {/* Tooltip on hover */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-md shadow-lg whitespace-nowrap z-10">
          <div className="font-medium">{project.title}</div>
          <div className="text-gray-300">
            {formatDate(project.startDate)} - {formatDate(project.endDate)}
          </div>
          <div className="text-gray-300">
            Status: {project.status} | Crew: {project.crewCount}
          </div>
          <div className="text-gray-300">
            Location: {project.location}
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};
