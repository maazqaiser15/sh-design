import React from 'react';
import { ProjectDateSetupModal } from './ProjectDateSetupModal';
import { useProjectDateSetup } from '../hooks/useProjectDateSetup';
import { Project, requiresDateSetup } from '../utils/projectStatusUtils';

interface WithProjectDateSetupProps {
  onProjectClick?: (projectId: string) => void;
}

export function withProjectDateSetup<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithProjectDateSetupComponent(props: P & WithProjectDateSetupProps) {
    const {
      isModalOpen,
      selectedProject,
      openDateSetupModal,
      closeDateSetupModal,
      handleDateSetup,
    } = useProjectDateSetup();

    const handleProjectClick = (project: Project) => {
      if (requiresDateSetup(project.status)) {
        // Open date setup modal for PV75, PV90, UB, WB statuses
        openDateSetupModal(project.id, project.name, project.status as 'PV75' | 'PV90' | 'UB' | 'WB');
      } else {
        // Navigate directly to project details for other statuses
        if (props.onProjectClick) {
          props.onProjectClick(project.id);
        }
      }
    };

    return (
      <>
        <WrappedComponent
          {...props}
          onProjectClick={handleProjectClick}
        />
        
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
}
