import React from 'react';
import { SchedulerProject, ProjectBarProps } from '../../types';
import { PROJECT_STAGE_COLORS } from '../../utils/mockData';

export const ProjectBar: React.FC<ProjectBarProps> = ({
  project,
  onProjectClick,
  onProjectHover,
  isHovered
}) => {
  const handleMouseEnter = () => {
    onProjectHover(project);
  };

  const handleMouseLeave = () => {
    onProjectHover(null);
  };

  const handleClick = () => {
    onProjectClick(project);
  };

  const stageColors = PROJECT_STAGE_COLORS[project.stage];

  return (
    <div
      className={`
        relative h-8 rounded-md border cursor-pointer transition-all duration-200
        ${stageColors}
        ${isHovered ? 'shadow-md scale-105 z-10' : 'hover:shadow-sm'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between h-full px-3">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <span className="text-xs font-medium truncate">
            {project.name}
          </span>
          <span className={`
            inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium
            ${PROJECT_STAGE_COLORS[project.stage]}
          `}>
            {project.stage}
          </span>
        </div>
      </div>
    </div>
  );
};
