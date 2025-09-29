import React from 'react';
import { MapPin, Users, Truck } from 'lucide-react';
import { ProjectListItem, PROJECT_STATUS_COLORS, PROJECT_STATUS_DESCRIPTIONS } from '../types';
import { formatProjectDuration } from '../utils';

interface ProjectListViewProps {
  projects: ProjectListItem[];
  onProjectClick: (project: ProjectListItem) => void;
}

export const ProjectListView: React.FC<ProjectListViewProps> = ({
  projects,
  onProjectClick,
}) => {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getProgressPercentage = (project: ProjectListItem): number => {
    // Use actual progress value from project data if available
    if (project.progress !== undefined) {
      return project.progress;
    }
    
    // Fallback to status-based progress for backward compatibility
    switch (project.status) {
      case 'PV75':
        return 5;
      case 'PV90':
        return 15;
      case 'UB':
        return 25;
      case 'WB':
        return 40;
      case 'WIP':
        return 75;
      case 'QF':
        return 90;
      case 'Completed':
        return 100;
      default:
        return 0;
    }
  };

  const getProgressBarColor = (status: string): string => {
    switch (status) {
      case 'PV75':
        return 'bg-gray-500';
      case 'PV90':
        return 'bg-purple-500';
      case 'UB':
        return 'bg-blue-500';
      case 'WB':
        return 'bg-yellow-500';
      case 'WIP':
        return 'bg-blue-500';
      case 'QF':
        return 'bg-orange-500';
      case 'Completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="px-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => onProjectClick(project)}
          className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col min-h-[260px]"
        >
          {/* Top Row: Title and Status */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 pr-3">
              <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-1">
                {project.title}
              </h3>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {project.vinCode}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${PROJECT_STATUS_COLORS[project.status]}`}>
                  {PROJECT_STATUS_DESCRIPTIONS[project.status]}
                </span>
              </div>
            </div>
          </div>

          {/* Location Row */}
          <div className="flex items-center text-gray-500 mb-3">
            <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
            <span className="text-base truncate">{project.location}</span>
          </div>

          {/* Crew & Trailer Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0" />
              <div className="flex items-center -space-x-2">
                {project.crew.slice(0, 3).map((member, index) => (
                  <div
                    key={member.id}
                    className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-700"
                    title={member.name}
                  >
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(member.name)
                    )}
                  </div>
                ))}
                {project.crewCount > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-600">
                    +{project.crewCount - 3}
                  </div>
                )}
              </div>
              {project.crewCount === 0 && (
                <span className="text-sm text-gray-400 ml-3">No crew</span>
              )}
            </div>
            
            <div className="flex items-center text-gray-500">
              <Truck className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-base truncate max-w-32">
                {project.assignedTrailer || 'Not Assigned'}
              </span>
            </div>
          </div>

          {/* Bottom Row: Progress Bar - Only show for WIP, QF, and Completed */}
          {['WIP', 'QF', 'Completed'].includes(project.status) && (
            <div className="mt-auto">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-600">Progress</span>
                <span className="text-sm font-semibold text-gray-700">{getProgressPercentage(project)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor(project.status)}`}
                  style={{ width: `${getProgressPercentage(project)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
      </div>
    </div>
  );
};
