import React from 'react';
import { Edit, Calendar, MapPin } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { ProjectDetails } from '../../types/projectDetails';

interface ProjectDetailsHeaderProps {
  project: ProjectDetails;
  onEdit: () => void;
}

/**
 * ProjectDetailsHeader - Header section for project details
 * Shows project name, ID, stage, status, and edit button
 */
export const ProjectDetailsHeader: React.FC<ProjectDetailsHeaderProps> = ({
  project,
  onEdit
}) => {
  const getStageDisplay = (stage: string) => {
    const stageMap = {
      'preparation': 'Preparation',
      'wip': 'Work in Progress',
      'fer': 'Finishing & Execution',
      'completed': 'Completed'
    };
    return stageMap[stage as keyof typeof stageMap] || stage;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-green-100 text-green-800 border-green-200',
      'on-hold': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'completed': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

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
                className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(project.status)}`}
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

          {/* Stage and Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Stage:</span>
              <span className="text-sm text-gray-900">{getStageDisplay(project.stage)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className="text-sm text-gray-900 capitalize">{project.status.replace('-', ' ')}</span>
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
