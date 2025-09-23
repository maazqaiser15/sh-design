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

  const getProgressPercentage = (status: string): number => {
    switch (status) {
      case 'PV90':
      case 'UB':
      case 'WB':
        return 0;
      case 'WIP':
        return 65;
      case 'QF':
        return 100;
      case 'Completed':
        return 100;
      default:
        return 0;
    }
  };

  const getProgressBarColor = (status: string): string => {
    switch (status) {
      case 'PV90':
        return 'bg-purple-500';
      case 'UB':
        return 'bg-blue-500';
      case 'WB':
        return 'bg-yellow-500';
      case 'WIP':
        return 'bg-green-500';
      case 'QF':
        return 'bg-orange-500';
      case 'Completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => onProjectClick(project)}
          className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
        >
          {/* Top Row: Title + Badges */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-base font-medium text-gray-900 flex-1 pr-2">
              {project.title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                {project.vinCode}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${PROJECT_STATUS_COLORS[project.status]}`}>
                {PROJECT_STATUS_DESCRIPTIONS[project.status]}
              </span>
            </div>
          </div>

          {/* Location Row */}
          <div className="flex items-center text-gray-500 mb-3">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm truncate">{project.location}</span>
          </div>

          {/* Crew & Trailer Row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
              <div className="flex items-center -space-x-1">
                {project.crew.slice(0, 3).map((member, index) => (
                  <div
                    key={member.id}
                    className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700"
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
                  <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                    +{project.crewCount - 3}
                  </div>
                )}
              </div>
              {project.crewCount === 0 && (
                <span className="text-xs text-gray-400 ml-2">No crew</span>
              )}
            </div>
            
            <div className="flex items-center text-gray-500">
              <Truck className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="text-sm truncate max-w-24">
                {project.assignedTrailer || 'Not Assigned'}
              </span>
            </div>
          </div>

          {/* Bottom Row: Progress Bar */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs text-gray-500">{getProgressPercentage(project.status)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(project.status)}`}
                style={{ width: `${getProgressPercentage(project.status)}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
