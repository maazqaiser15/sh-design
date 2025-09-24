import React from 'react';
import { Card } from '../../../../common/components/Card';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { ProjectDateSetupModal } from '../ProjectDateSetupModal';
import { useProjectDateSetup } from '../../hooks/useProjectDateSetup';
import { Project, requiresDateSetup, getStatusDisplayName, getStatusColorClass } from '../../utils/projectStatusUtils';

interface ProjectCardProps {
  project: Project;
  onProjectClick?: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onProjectClick }) => {
  const {
    isModalOpen,
    selectedProject,
    openDateSetupModal,
    closeDateSetupModal,
    handleDateSetup,
  } = useProjectDateSetup();

  const handleCardClick = () => {
    if (requiresDateSetup(project.status)) {
      // Open date setup modal for PV75, PV90, UB, WB statuses
      openDateSetupModal(project.id, project.name, project.status as 'PV75' | 'PV90' | 'UB' | 'WB');
    } else {
      // Navigate directly to project details for other statuses
      if (onProjectClick) {
        onProjectClick(project.id);
      }
    }
  };

  return (
    <>
      <Card 
        className="cursor-pointer hover:shadow-lg transition-shadow duration-200 p-4"
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {project.name}
            </h3>
            {project.vinCode && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 mt-1">
                {project.vinCode}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          
          {project.startDate && (
            <div className="flex justify-between">
              <span>Start Date:</span>
              <span>{new Date(project.startDate).toLocaleDateString()}</span>
            </div>
          )}
          
          {project.endDate && (
            <div className="flex justify-between">
              <span>End Date:</span>
              <span>{new Date(project.endDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {requiresDateSetup(project.status) && (
          <div className="mt-3 p-2 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-700">
              Click to set up project dates
            </p>
          </div>
        )}
      </Card>

      <ProjectDateSetupModal
        isOpen={isModalOpen}
        onClose={closeDateSetupModal}
        onSave={handleDateSetup}
        projectName={selectedProject?.name || ''}
        projectStatus={selectedProject?.status || 'PV75'}
      />
    </>
  );
};
