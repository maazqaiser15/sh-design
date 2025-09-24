import React from 'react';
import { Calendar, MapPin, CheckCircle2, Edit, Circle } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { ProjectDetails } from '../../types/projectDetails';

interface ProjectOverviewCardProps {
  project: ProjectDetails;
  onEditProject?: () => void;
  onMarkStageComplete?: () => void;
}

/**
 * ProjectOverviewCard - Matches the exact design from the image
 * Shows project header, metadata, and progress indicators
 */
export const ProjectOverviewCard: React.FC<ProjectOverviewCardProps> = ({
  project,
  onEditProject,
  onMarkStageComplete
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Define progress stages based on current state
  const progressStages = [
    {
      id: 'team-assignment',
      label: 'Team Assignment',
      status: 'completed' as const,
      icon: <CheckCircle2 className="w-5 h-5 text-green-600" />
    },
    {
      id: 'travel-accommodation',
      label: 'Travel & Accommodation',
      status: 'in-progress' as const,
      icon: <Circle className="w-5 h-5 text-gray-400" />
    },
    {
      id: 'trailer-logistics',
      label: 'Trailer & Logistics',
      status: 'in-progress' as const,
      icon: <Circle className="w-5 h-5 text-gray-400" />
    }
  ];

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in-progress':
        return 'text-gray-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="px-16 py-6">
      {/* Project Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {project.name}
          </h1>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700 border border-blue-200">
            {project.status}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="sm"
            onClick={onMarkStageComplete}
            className="px-4 py-2"
          >
            Mark Stage as Complete
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditProject}
            icon={Edit}
            className="px-3 py-2 border border-gray-300"
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Project Metadata Section */}
      <div className="flex items-center space-x-6 mb-4 pb-4 border-b border-gray-200">
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700">
          {project.projectId}
        </span>
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{project.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
        </div>
      </div>

      {/* Progress Indicators Section */}
      <div className="flex items-center space-x-8">
        {progressStages.map((stage, index) => (
          <div key={stage.id} className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-gray-200 bg-white">
              {stage.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">
                {stage.label}
              </span>
              <span className={`text-xs ${getStatusTextColor(stage.status)}`}>
                {getStatusText(stage.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
