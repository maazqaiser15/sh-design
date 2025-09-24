import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { ProjectDetails } from '../../types/projectDetails';

interface ProjectHeaderProps {
  project: ProjectDetails;
}

/**
 * ProjectHeader - Simplified header component without stages
 * Shows project details and basic actions
 */
export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
      <div className="py-6 px-6">
        {/* Header Row */}
        <div className="flex items-center space-x-3 mb-3">
          <h1 className="text-xl font-bold text-gray-900 truncate">
            {project.name}
          </h1>
          <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full flex-shrink-0">
            {project.projectId}
          </span>
          <StatusBadge
            status={project.status}
            className="px-2 py-1 text-xs font-medium rounded-full border bg-blue-100 text-blue-700 border-blue-200 flex-shrink-0"
          />
        </div>
        
        {/* Meta Info (inline) */}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{project.location}</span>
          </div>
          <span className="mx-2 text-gray-400">•</span>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(project.startDate)} – {formatDate(project.endDate)}</span>
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-gray-500 line-clamp-1">
            {project.description}
          </p>
        )}
      </div>
    </div>
  );
};
