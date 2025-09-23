import React, { useMemo } from 'react';
import { ProjectRowProps, Project } from '../types/ganttTypes';
import { ProjectBar } from './ProjectBar';

const PROJECT_STATUS_COLORS = {
  'PV90': 'bg-green-200 text-green-800 border-green-300',
  'UB': 'bg-amber-200 text-amber-800 border-amber-300',
  'WB': 'bg-teal-200 text-teal-800 border-teal-300',
  'WIP': 'bg-blue-200 text-blue-800 border-blue-300',
  'QF': 'bg-red-200 text-red-800 border-red-300'
} as const;

export const ProjectRow: React.FC<ProjectRowProps> = ({
  project,
  viewMode,
  currentDate,
  onProjectHover,
  onProjectClick,
  hoveredProject
}) => {
  // Calculate project bar position and dimensions
  const projectBar = useMemo(() => {
    // Get the timeline range based on view mode
    let timelineStart: Date;
    let timelineEnd: Date;

    if (viewMode === 'day') {
      timelineStart = new Date(currentDate);
      timelineStart.setHours(0, 0, 0, 0);
      timelineEnd = new Date(currentDate);
      timelineEnd.setHours(23, 59, 59, 999);
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      timelineStart = startOfWeek;
      timelineEnd = new Date(startOfWeek);
      timelineEnd.setDate(startOfWeek.getDate() + 6);
    } else if (viewMode === 'month') {
      // Month view
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      timelineStart = new Date(year, month, 1);
      timelineEnd = new Date(year, month + 1, 0);
    } else {
      // Year view
      const year = currentDate.getFullYear();
      timelineStart = new Date(year, 0, 1);
      timelineEnd = new Date(year, 11, 31);
    }

    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);

    // Check if project overlaps with current timeline
    if (projectEnd < timelineStart || projectStart > timelineEnd) {
      return null;
    }

    const timelineDuration = timelineEnd.getTime() - timelineStart.getTime();
    const effectiveStart = projectStart < timelineStart ? timelineStart : projectStart;
    const effectiveEnd = projectEnd > timelineEnd ? timelineEnd : projectEnd;

    const startOffset = effectiveStart.getTime() - timelineStart.getTime();
    const endOffset = effectiveEnd.getTime() - timelineStart.getTime();

    const startPosition = (startOffset / timelineDuration) * 100;
    const width = ((endOffset - startOffset) / timelineDuration) * 100;

    return {
      startPosition: Math.max(0, startPosition),
      width: Math.max(2, width),
      top: 4,
      height: 28
    };
  }, [project, viewMode, currentDate]);

  const statusColors = PROJECT_STATUS_COLORS[project.status];
  const [bgClass, textClass, borderClass] = statusColors.split(' ');

  return (
    <div className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Left Column - Project Info */}
      <div className="w-80 p-4 flex-shrink-0 border-r border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
            <div className={`w-8 h-8 rounded ${bgClass} flex items-center justify-center`}>
              <span className={`text-xs font-bold ${textClass}`}>
                {project.projectName.charAt(0)}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {project.projectName}
            </div>
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors}`}>
              {project.status}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {project.assignedMembers.length} member{project.assignedMembers.length !== 1 ? 's' : ''} assigned
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Timeline */}
      <div className="flex-1 relative">
        <div className="h-20 relative">
          {projectBar ? (
            <ProjectBar
              project={{
                projectId: project.projectId,
                projectName: project.projectName,
                status: project.status,
                startDate: project.startDate,
                endDate: project.endDate,
                role: `${project.assignedMembers.length} members`
              }}
              startPosition={projectBar.startPosition}
              width={projectBar.width}
              top={projectBar.top}
              height={projectBar.height}
              onHover={onProjectHover}
              onClick={onProjectClick}
              isHovered={hoveredProject?.projectId === project.projectId}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Outside timeline
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
