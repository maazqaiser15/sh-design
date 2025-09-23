import React from 'react';
import { Edit, Calendar, MapPin } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { ProjectDetails } from '../../types/projectDetails';

interface ProjectDetailsHeaderProps {
  project: ProjectDetails;
  onEdit: () => void;
  onEditDates?: () => void;
  isPreparationStage?: boolean;
}

/**
 * ProjectDetailsHeader - Header section for project details
 * Shows project name, ID, stage, status, and edit button
 */
export const ProjectDetailsHeader: React.FC<ProjectDetailsHeaderProps> = ({
  project,
  onEdit,
  onEditDates,
  isPreparationStage = false
}) => {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-start justify-between">
        {/* Left side - Project Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              {project.name}
            </h1>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                {project.projectId}
              </span>
              <StatusBadge
                status={project.stage}
                className="px-3 py-1 text-xs font-medium rounded-full border bg-gray-100 text-gray-800 border-gray-200"
              />
            </div>
          </div>

          {/* Project Details */}
          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
            </div>
          </div>


          {/* Description */}
          {project.description && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">{project.description}</p>
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-3">
          {isPreparationStage && onEditDates && (
            <Button
              variant="secondary"
              size="sm"
              icon={Calendar}
              onClick={onEditDates}
            >
              Edit Dates
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={Edit}
            onClick={onEdit}
          >
            Edit Project
          </Button>
          
          {/* Future: Stage Switcher */}
          <div className="text-xs text-gray-400">
            Stage switcher (coming soon)
          </div>
        </div>
      </div>
    </div>
  );
};
