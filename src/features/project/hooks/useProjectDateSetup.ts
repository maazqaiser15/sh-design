import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProjectDateSetupState {
  isModalOpen: boolean;
  selectedProject: {
    id: string;
    name: string;
    status: 'PV75' | 'PV90' | 'UB' | 'WB';
  } | null;
}

export const useProjectDateSetup = () => {
  const [state, setState] = useState<ProjectDateSetupState>({
    isModalOpen: false,
    selectedProject: null,
  });
  const navigate = useNavigate();

  const openDateSetupModal = (projectId: string, projectName: string, projectStatus: 'PV75' | 'PV90' | 'UB' | 'WB') => {
    setState({
      isModalOpen: true,
      selectedProject: {
        id: projectId,
        name: projectName,
        status: projectStatus,
      },
    });
  };

  const closeDateSetupModal = () => {
    setState({
      isModalOpen: false,
      selectedProject: null,
    });
  };

  const handleDateSetup = (startDate: string, endDate: string) => {
    if (state.selectedProject) {
      // Here you would typically save the dates to your backend/state management
      console.log('Setting up project dates:', {
        projectId: state.selectedProject.id,
        projectName: state.selectedProject.name,
        status: state.selectedProject.status,
        startDate,
        endDate,
      });

      // Close the modal
      closeDateSetupModal();

      // Navigate to project details page
      navigate(`/projects/${state.selectedProject.id}`);
    }
  };

  return {
    isModalOpen: state.isModalOpen,
    selectedProject: state.selectedProject,
    openDateSetupModal,
    closeDateSetupModal,
    handleDateSetup,
  };
};
