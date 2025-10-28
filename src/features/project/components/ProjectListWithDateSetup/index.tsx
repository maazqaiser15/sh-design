import React from 'react';
import { ProjectDateSetupModal } from '../ProjectDateSetupModal';
import { useProjectDateSetup } from '../../hooks/useProjectDateSetup';
import { Project, requiresDateSetup } from '../../utils/projectStatusUtils';

interface ProjectListWithDateSetupProps {
  children: React.ReactNode;
  onProjectClick?: (projectId: string) => void;
}

export const ProjectListWithDateSetup: React.FC<ProjectListWithDateSetupProps> = ({
  children,
  onProjectClick,
}) => {
  const {
    isModalOpen,
    selectedProject,
    openDateSetupModal,
    closeDateSetupModal,
    handleDateSetup,
  } = useProjectDateSetup();

  // This function can be passed to child components to handle project clicks
  const handleProjectClick = (project: Project) => {
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
      {React.cloneElement(children as React.ReactElement, {
        onProjectClick: handleProjectClick,
      })}

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
