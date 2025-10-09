import React from 'react';
import { MapPin, Users, Truck, Calendar, Building2, Briefcase } from 'lucide-react';
import { ProjectListItem, PROJECT_STATUS_COLORS, PROJECT_STATUS_DESCRIPTIONS } from '../types';
import { formatProjectDuration } from '../utils';
import { PieChart } from '../../../common/components/PieChart';
import { Avatar } from '../../../common/components/Avatar';

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
      case 'Archived':
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
      case 'Archived':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="px-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => onProjectClick(project)}
          className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer h-full flex flex-col min-h-[320px]"
        >
          {/* Header with Title, Status, and Progress Indicator */}
          <div className="p-4 border-b border-gray-100 flex items-start gap-4">
            {/* Project Info - Left Side */}
            <div className="flex-1">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                  {project.title}
                </h3>
              </div>
              
              {/* Status Badge and VIN Code */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${PROJECT_STATUS_COLORS[project.status]}`}>
                  {PROJECT_STATUS_DESCRIPTIONS[project.status]}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {project.vinCode}
                </span>
              </div>
            </div>

            {/* Progress Indicator - Right Side */}
            {(project.status === 'WIP' || project.status === 'Completed') && (
              <div className="flex-shrink-0 flex flex-col items-end justify-center" style={{ width: '80px' }}>
                {project.status === 'WIP' && (
                  <PieChart
                    percentage={getProgressPercentage(project)}
                    size={60}
                  />
                )}
                {project.status === 'Completed' && (
                  <>
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-medium text-gray-600">Progress</span>
                      <span className="text-xs font-semibold text-gray-700">{getProgressPercentage(project)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${getProgressBarColor(project.status)}`}
                        style={{ width: `${getProgressPercentage(project)}%` }}
                      ></div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Project Overview */}
          <div className="p-4">
            {/* Project Location */}
            <div className="flex items-center text-gray-700">
              <MapPin className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
              <div>
                <div className="text-xs text-gray-500">Project Location</div>
                <div className="text-sm font-medium truncate">{project.location}</div>
              </div>
            </div>
          </div>

          {/* Additional Project Info */}
          <div className="px-4 pb-4 flex-1">
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-3">
                {/* Site */}
                <div className="flex items-center text-gray-700">
                  <Building2 className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">Site</div>
                    <div className="text-sm font-medium truncate">{project.site}</div>
                  </div>
                </div>

                {/* Project Duration */}
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">Project Duration</div>
                    <div className="text-sm font-medium">
                      <span>{new Date(project.startDate).toLocaleDateString('en-GB')}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span>{new Date(project.endDate).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {/* Industry */}
                <div className="flex items-center text-gray-700">
                  <Briefcase className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">Industry</div>
                    <div className="text-sm font-medium">{project.industry}</div>
                  </div>
                </div>

                 {/* Crew */}
                 <div className="flex items-center text-gray-700">
                   <Users className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                   <div className="flex-1">
                     <div className="text-xs text-gray-500">Crew</div>
                     <div className="flex items-center gap-1 mt-1">
                       {project.crew && project.crew.length > 0 ? (
                         <>
                           {project.crew.slice(0, 2).map((member, index) => {
                             // Use different placeholder images from the internet
                             const placeholderImages = [
                               'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
                               'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                               'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                               'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
                             ];
                             return (
                               <Avatar
                                 key={index}
                                 name={member.name || `Member ${index + 1}`}
                                 src={member.avatar || placeholderImages[index % placeholderImages.length]}
                                 size="sm"
                                 className="border border-white shadow-sm"
                               />
                             );
                           })}
                           {project.crew.length > 2 && (
                             <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center border border-white shadow-sm">
                               <span className="text-xs text-gray-600 font-medium">+{project.crew.length - 2}</span>
                             </div>
                           )}
                         </>
                       ) : (
                         <span className="text-sm text-gray-500">Not assigned</span>
                       )}
                     </div>
                   </div>
                 </div>

                {/* Trailer */}
                <div className="flex items-center text-gray-700">
                  <Truck className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">Trailer</div>
                    <div className="text-sm font-medium">
                      {project.assignedTrailer || 'Not assigned'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      ))}
      </div>
    </div>
  );
};
