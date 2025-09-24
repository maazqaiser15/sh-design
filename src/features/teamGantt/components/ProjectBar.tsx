import React from 'react';
import { ProjectBarProps } from '../types';
import { PROJECT_STATUS_COLORS } from '../data/mockData';

export const ProjectBar: React.FC<ProjectBarProps> = ({
  project,
  startPosition,
  width,
  top,
  height,
  onHover,
  onClick,
  isHovered
}) => {
  const statusColors = PROJECT_STATUS_COLORS[project.status] || 'bg-gray-200 text-gray-800 border-gray-300';
  const [bgClass, textClass, borderClass] = statusColors.split(' ');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      className={`absolute rounded-md cursor-pointer transition-all duration-200 hover:shadow-lg ${bgClass} ${textClass} ${borderClass} ${
        isHovered ? 'shadow-lg z-20 scale-105' : 'z-10'
      }`}
      style={{
        left: `${startPosition}%`,
        width: `${width}%`,
        top: `${top}px`,
        height: `${height}px`,
        minWidth: '60px' // Ensure minimum width for readability
      }}
      onClick={() => onClick(project)}
      onMouseEnter={() => onHover(project)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Project Bar Content */}
      <div className="flex flex-col justify-center h-full px-3 py-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {project.projectName}
            </div>
            <div className="text-xs opacity-90 truncate">
              {project.role}
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${statusColors}`}>
              {project.status}
            </span>
          </div>
        </div>
        <div className="text-xs opacity-75 truncate">
          {formatDate(project.startDate)} - {formatDate(project.endDate)}
        </div>
      </div>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-30">
          <div className="font-semibold">{project.projectName}</div>
          <div className="opacity-90">Role: {project.role}</div>
          <div className="opacity-90">Start: {formatDate(project.startDate)}</div>
          <div className="opacity-90">End: {formatDate(project.endDate)}</div>
          <div className="opacity-90">Status: {project.status}</div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};
