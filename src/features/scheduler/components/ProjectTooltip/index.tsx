import React from 'react';
import { SchedulerProject } from '../../types';
import { PROJECT_STAGE_BADGE_COLORS } from '../../utils/mockData';

interface ProjectTooltipProps {
  project: SchedulerProject;
  position: { x: number; y: number };
  visible: boolean;
}

export const ProjectTooltip: React.FC<ProjectTooltipProps> = ({
  project,
  position,
  visible
}) => {
  if (!visible) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm"
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: 'translateY(-100%)'
      }}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {project.name}
          </h3>
          <span className={`
            inline-flex items-center px-2 py-1 rounded text-xs font-medium
            ${PROJECT_STAGE_BADGE_COLORS[project.stage]}
          `}>
            {project.stage}
          </span>
        </div>
        
        <div className="text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <span>📅</span>
            <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
          </div>
        </div>

        {project.client && (
          <div className="text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <span>🏢</span>
              <span>{project.client}</span>
            </div>
          </div>
        )}

        {project.location && (
          <div className="text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <span>📍</span>
              <span>{project.location}</span>
            </div>
          </div>
        )}

        {project.description && (
          <div className="text-xs text-gray-600 pt-1 border-t border-gray-100">
            {project.description}
          </div>
        )}
      </div>
    </div>
  );
};
