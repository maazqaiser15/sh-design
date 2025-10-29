import React from 'react';
import { Card } from '../../../../common/components/Card';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { ProjectDateSetupModal } from '../ProjectDateSetupModal';
import { useProjectDateSetup } from '../../hooks/useProjectDateSetup';
import { Project, requiresDateSetup, getStatusDisplayName, getStatusColorClass } from '../../utils/projectStatusUtils';
import { Building2, Briefcase, Calendar } from 'lucide-react';
import { formatDateMMDDYYYY } from '../../../../utils/dateUtils';

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
      // Open date setup modal for D75, PV90, UB, WB statuses
      openDateSetupModal(project.id, project.name, project.status as 'D75' | 'PV90' | 'UB' | 'WB');
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
        {/* Project Name */}
        <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-3">
          {project.name}
        </h3>

        {/* VIN Code */}
        {project.vinCode && (
          <div className="mb-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              {project.vinCode}
            </span>
          </div>
        )}

        {/* Site and Industry */}
        {(project.site || project.industry) && (
          <div className="flex items-center justify-between mb-3">
            {project.site && (
              <div className="flex items-center text-gray-700">
                <Building2 className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{project.site}</span>
              </div>
            )}
            {project.industry && (
              <div className="flex items-center text-gray-600">
                <Briefcase className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                <span className="text-sm truncate">{project.industry}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Project Timeline */}
        {(project.startDate || project.endDate) && (
          <div className="mb-3">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
              <div className="text-sm">
                {project.startDate && project.endDate ? (
                  <>
                    <span className="font-medium">{formatDateMMDDYYYY(project.startDate)}</span>
                    <span className="mx-2 text-gray-400">→</span>
                    <span className="font-medium">{formatDateMMDDYYYY(project.endDate)}</span>
                  </>
                ) : (
                  <>
                    {project.startDate && (
                      <div className="flex justify-between">
                        <span>Start:</span>
                        <span className="font-medium">{formatDateMMDDYYYY(project.startDate)}</span>
                      </div>
                    )}
                    {project.endDate && (
                      <div className="flex justify-between">
                        <span>End:</span>
                        <span className="font-medium">{formatDateMMDDYYYY(project.endDate)}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}

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
        projectStatus={selectedProject?.status || 'D75'}
      />
    </>
  );
};
