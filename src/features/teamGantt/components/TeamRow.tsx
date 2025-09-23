import React, { useMemo } from 'react';
import { TeamRowProps, Project } from '../types';
import { ProjectBar } from './ProjectBar';
import { PROJECT_STATUS_COLORS, ROLE_COLORS } from '../data/mockData';

export const TeamRow: React.FC<TeamRowProps> = ({
  member,
  viewMode,
  currentDate,
  onProjectHover,
  onProjectClick,
  hoveredProject
}) => {
  // Calculate project positions and dimensions
  const projectBars = useMemo(() => {
    const bars: Array<{
      project: Project;
      startPosition: number;
      width: number;
      top: number;
      height: number;
    }> = [];

    if (member.projects.length === 0) return bars;

    // Get the timeline range based on view mode
    let timelineStart: Date;
    let timelineEnd: Date;
    let totalCells: number;

    if (viewMode === 'day') {
      timelineStart = new Date(currentDate);
      timelineStart.setHours(0, 0, 0, 0);
      timelineEnd = new Date(currentDate);
      timelineEnd.setHours(23, 59, 59, 999);
      totalCells = 1; // Single day
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDate);
      const day = startOfWeek.getDay();
      const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      timelineStart = startOfWeek;
      timelineEnd = new Date(startOfWeek);
      timelineEnd.setDate(startOfWeek.getDate() + 6);
      totalCells = 7;
    } else if (viewMode === 'month') {
      // Month view
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      timelineStart = new Date(year, month, 1);
      timelineEnd = new Date(year, month + 1, 0);
      totalCells = timelineEnd.getDate();
    } else {
      // Year view
      const year = currentDate.getFullYear();
      timelineStart = new Date(year, 0, 1);
      timelineEnd = new Date(year, 11, 31);
      totalCells = 12; // 12 months
    }

    const timelineDuration = timelineEnd.getTime() - timelineStart.getTime();

    // Group overlapping projects and stack them vertically
    const projectGroups: Project[][] = [];
    const processedProjects = new Set<string>();

    member.projects.forEach(project => {
      if (processedProjects.has(project.projectId)) return;

      const projectStart = new Date(project.startDate);
      const projectEnd = new Date(project.endDate);

      // Check if project overlaps with current timeline
      if (projectEnd < timelineStart || projectStart > timelineEnd) return;

      const group: Project[] = [project];
      processedProjects.add(project.projectId);

      // Find overlapping projects
      member.projects.forEach(otherProject => {
        if (processedProjects.has(otherProject.projectId)) return;
        if (otherProject.projectId === project.projectId) return;

        const otherStart = new Date(otherProject.startDate);
        const otherEnd = new Date(otherProject.endDate);

        // Check if projects overlap
        if (!(otherEnd < projectStart || otherStart > projectEnd)) {
          group.push(otherProject);
          processedProjects.add(otherProject.projectId);
        }
      });

      projectGroups.push(group);
    });

    // Create bars for each group
    projectGroups.forEach((group, groupIndex) => {
      group.forEach((project, projectIndex) => {
        const projectStart = new Date(project.startDate);
        const projectEnd = new Date(project.endDate);

        // Calculate position and width
        const effectiveStart = projectStart < timelineStart ? timelineStart : projectStart;
        const effectiveEnd = projectEnd > timelineEnd ? timelineEnd : projectEnd;

        const startOffset = effectiveStart.getTime() - timelineStart.getTime();
        const endOffset = effectiveEnd.getTime() - timelineStart.getTime();

        const startPosition = (startOffset / timelineDuration) * 100;
        const width = ((endOffset - startOffset) / timelineDuration) * 100;

        // Stack projects vertically within the group
        const top = 4 + (projectIndex * 32); // 4px padding + 32px per project
        const height = 28; // Fixed height for project bars

        bars.push({
          project,
          startPosition: Math.max(0, startPosition),
          width: Math.max(2, width), // Minimum 2% width for visibility
          top,
          height
        });
      });
    });

    return bars;
  }, [member.projects, viewMode, currentDate]);

  const roleColors = ROLE_COLORS[member.role];
  const [bgClass, textClass, borderClass] = roleColors.split(' ');

  return (
    <div className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Left Column - Team Member Info */}
      <div className="w-80 p-4 flex-shrink-0 border-r border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium">
                {member.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {member.name}
            </div>
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleColors}`}>
              {member.role}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Timeline */}
      <div className="flex-1 relative">
        <div className="h-20 relative">
          {member.projects.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Unassigned
            </div>
          ) : (
            projectBars.map((bar, index) => (
              <ProjectBar
                key={`${bar.project.projectId}-${index}`}
                project={bar.project}
                startPosition={bar.startPosition}
                width={bar.width}
                top={bar.top}
                height={bar.height}
                onHover={onProjectHover}
                onClick={onProjectClick}
                isHovered={hoveredProject?.projectId === bar.project.projectId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
