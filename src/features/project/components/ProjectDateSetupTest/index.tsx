import React from 'react';
import { ProjectDateSetupModal } from '../ProjectDateSetupModal';
import { useProjectDateSetup } from '../../hooks/useProjectDateSetup';
import { Project } from '../../utils/projectStatusUtils';

// Simple test component to demonstrate the modal functionality
export const ProjectDateSetupTest: React.FC = () => {
  const {
    isModalOpen,
    selectedProject,
    openDateSetupModal,
    closeDateSetupModal,
    handleDateSetup,
  } = useProjectDateSetup();

  const testProjects: Project[] = [
    { id: '1', name: 'Test PV75 Project', status: 'PV75' },
    { id: '2', name: 'Test PV90 Project', status: 'PV90' },
    { id: '3', name: 'Test UB Project', status: 'UB' },
    { id: '4', name: 'Test WB Project', status: 'WB' },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Project Date Setup Test</h3>
      <p className="text-gray-600 mb-4">
        Click on any project below to test the date setup modal:
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {testProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => openDateSetupModal(project.id, project.name, project.status)}
            className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="font-medium">{project.name}</div>
            <div className="text-sm text-gray-600">Status: {project.status}</div>
          </button>
        ))}
      </div>

      <ProjectDateSetupModal
        isOpen={isModalOpen}
        onClose={closeDateSetupModal}
        onSave={handleDateSetup}
        projectName={selectedProject?.name || ''}
        projectStatus={selectedProject?.status || 'PV75'}
      />
    </div>
  );
};
