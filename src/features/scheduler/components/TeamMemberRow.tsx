import React, { useMemo } from 'react';
import { TeamMemberRowProps } from '../types/teamScheduler';
import { TimelineBar } from './TimelineBar';

export const TeamMemberRow: React.FC<TeamMemberRowProps> = ({
  member,
  weekStart,
  weekEnd,
  onProjectClick,
  onProjectHover,
  hoveredProject,
}) => {
  // Filter projects that overlap with the current week
  const weekProjects = useMemo(() => {
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekEndStr = weekEnd.toISOString().split('T')[0];
    
    return member.projects.filter(project => {
      return project.startDate <= weekEndStr && project.endDate >= weekStartStr;
    });
  }, [member.projects, weekStart, weekEnd]);

  // Calculate project stacking positions to avoid overlaps
  const projectPositions = useMemo(() => {
    const positions: { project: typeof member.projects[0]; row: number }[] = [];
    
    weekProjects.forEach(project => {
      const projectStart = new Date(project.startDate);
      const projectEnd = new Date(project.endDate);
      
      // Find the first available row (0-based)
      let row = 0;
      while (positions.some(pos => {
        const posStart = new Date(pos.project.startDate);
        const posEnd = new Date(pos.project.endDate);
        
        // Check if projects overlap
        return pos.row === row && 
               posStart <= projectEnd && 
               posEnd >= projectStart;
      })) {
        row++;
      }
      
      positions.push({ project, row });
    });
    
    return positions;
  }, [weekProjects]);

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'Lead':
        return 'text-red-600 bg-red-50';
      case 'Supervisor':
        return 'text-purple-600 bg-purple-50';
      case 'Crew Leader':
        return 'text-blue-600 bg-blue-50';
      case 'Project Coordinator':
        return 'text-green-600 bg-green-50';
      case 'Installer':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Left Column - Team Member Info */}
      <div className="w-64 p-4 flex-shrink-0 border-r border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
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
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
              {member.role}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Timeline */}
      <div className="flex-1 relative">
        <div className="h-16 relative">
          {weekProjects.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Unassigned
            </div>
          ) : (
            projectPositions.map(({ project, row }) => {
              const projectStart = new Date(project.startDate);
              const projectEnd = new Date(project.endDate);
              
              return (
                <TimelineBar
                  key={project.id}
                  project={project}
                  startDate={projectStart}
                  endDate={projectEnd}
                  weekStart={weekStart}
                  weekEnd={weekEnd}
                  onProjectClick={onProjectClick}
                  onProjectHover={onProjectHover}
                  isHovered={hoveredProject?.id === project.id}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
