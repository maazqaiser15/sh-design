import React from 'react';
import { Calendar, MapPin, Edit, User } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { ProjectDetails } from '../../types/projectDetails';

interface ProjectOverviewCardProps {
  project: ProjectDetails;
  onMarkForQF?: () => void;
  onEditProject?: () => void;
  windowsSetup?: boolean;
}

/**
 * ProjectOverviewCard - Matches the exact design from the Figma image
 * Shows project header, metadata, and progress indicators with circular progress
 */
export const ProjectOverviewCard: React.FC<ProjectOverviewCardProps> = ({
  project,
  onMarkForQF,
  onEditProject,
  windowsSetup = true
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Mock data for the progress metrics
  const progressData = {
    percentage: 62,
    completed: 42,
    total: 60,
    windowsStarted: 8,
    windowsCompleted: 5,
    issuesReported: 2
  };

  return (
    <Card className="p-6 w-full">
      {/* Project Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              {project.name}
            </h1>
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm font-semibold">
              {project.status}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-md font-semibold">
              {project.projectId}
            </span>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{project.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
            </div>
            {project.assignedCoordinator && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>Coordinator: {project.assignedCoordinator.name}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={onMarkForQF}
            disabled={!windowsSetup}
            className="px-3 py-2"
            title={!windowsSetup ? "Please set up windows before marking for QF" : ""}
          >
            Mark for QF
          </Button>
          <Button
            variant="secondary"
            onClick={onEditProject}
            icon={Edit}
            className="px-3 py-2"
          >
            Edit
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-6"></div>

      {/* Progress Section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 relative">
            {/* Circular Progress Indicator */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-300 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">{progressData.percentage}%</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-semibold text-gray-700">{progressData.percentage}%</div>
            <div className="text-sm font-medium text-blue-600">
              {progressData.completed}/{progressData.total} windows completed
            </div>
          </div>
        </div>

        <div className="w-px h-16 bg-gray-200"></div>

        <div className="flex gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xl font-semibold text-gray-700">{progressData.windowsStarted}</span>
            </div>
            <span className="text-sm font-medium text-gray-600">Windows Started</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xl font-semibold text-gray-700">{progressData.windowsCompleted}</span>
            </div>
            <span className="text-sm font-medium text-gray-600">Windows Completed</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xl font-semibold text-gray-700">{progressData.issuesReported}</span>
            </div>
            <span className="text-sm font-medium text-gray-600">Layers Installed</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
