import React from 'react';
import { TimelineBarProps } from '../types/teamScheduler';

export const TimelineBar: React.FC<TimelineBarProps> = ({
  project,
  startDate,
  endDate,
  weekStart,
  weekEnd,
  onProjectClick,
  onProjectHover,
  isHovered,
}) => {
  // Calculate the position and width of the bar within the week
  const weekStartTime = weekStart.getTime();
  const weekEndTime = weekEnd.getTime();
  const projectStartTime = startDate.getTime();
  const projectEndTime = endDate.getTime();
  
  // Calculate the percentage position and width
  const weekDuration = weekEndTime - weekStartTime;
  const projectStartOffset = Math.max(0, projectStartTime - weekStartTime);
  const projectEndOffset = Math.min(weekDuration, projectEndTime - weekStartTime);
  
  const leftPercent = (projectStartOffset / weekDuration) * 100;
  const widthPercent = ((projectEndOffset - projectStartOffset) / weekDuration) * 100;
  
  // Only render if the bar is visible within the week
  if (widthPercent <= 0) return null;
  
  const formatDuration = (start: Date, end: Date): string => {
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    return `${Math.ceil(days / 7)} week${Math.ceil(days / 7) > 1 ? 's' : ''}`;
  };

  return (
    <div
      className={`absolute h-6 rounded-md cursor-pointer transition-all duration-200 hover:shadow-md ${
        isHovered ? 'shadow-lg z-10' : 'z-5'
      }`}
      style={{
        left: `${leftPercent}%`,
        width: `${widthPercent}%`,
        backgroundColor: project.color.split(' ')[0], // Extract background color
        border: `1px solid ${project.color.split(' ')[2] || project.color.split(' ')[0]}`, // Extract border color
      }}
      onClick={() => onProjectClick(project)}
      onMouseEnter={() => onProjectHover(project)}
      onMouseLeave={() => onProjectHover(null)}
      title={`${project.name} (${project.stage}) - ${formatDuration(startDate, endDate)} - ${project.role}`}
    >
      <div className="flex items-center h-full px-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-900 truncate">
            {project.name}
          </div>
          <div className="text-xs text-gray-600 truncate">
            {project.role}
          </div>
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
  );
};
