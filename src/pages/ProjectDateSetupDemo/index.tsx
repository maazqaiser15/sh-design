import React from 'react';
import { ProjectCard } from '../../features/project/components/ProjectCard';
import { ProjectListWithDateSetup } from '../../features/project/components/ProjectListWithDateSetup';
import { Project } from '../../features/project/utils/projectStatusUtils';

// Demo data with different project statuses
const demoProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign Project',
    status: 'PV75',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    status: 'PV90',
  },
  {
    id: '3',
    name: 'Database Migration',
    status: 'UB',
  },
  {
    id: '4',
    name: 'API Integration Project',
    status: 'WB',
  },
  {
    id: '5',
    name: 'User Testing Phase',
    status: 'ACTIVE',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
  },
  {
    id: '6',
    name: 'Documentation Update',
    status: 'COMPLETED',
    startDate: '2023-12-01',
    endDate: '2024-01-15',
  },
];

export const ProjectDateSetupDemo: React.FC = () => {
  const handleProjectClick = (projectId: string) => {
    console.log('Navigating to project:', projectId);
    // In a real app, this would navigate to the project details page
    alert(`Navigating to project details for Project VIN: ${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Project Date Setup Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Click on project cards to see the date setup modal in action. Projects with PV75, PV90, UB, and WB statuses will open a modal to set up dates.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-blue-800 mb-2">How it works:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>PV75, PV90, UB, WB</strong> projects → Opens date setup modal</li>
              <li>• <strong>Other statuses</strong> → Navigates directly to project details</li>
              <li>• Fill in start and end dates in the modal</li>
              <li>• Click "Save & Continue" to proceed to project details</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onProjectClick={handleProjectClick}
            />
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Alternative Implementation (Wrapper Component)
          </h2>
          <p className="text-gray-600 mb-4">
            This shows how you can wrap existing project lists with the date setup functionality:
          </p>
          
          <ProjectListWithDateSetup onProjectClick={handleProjectClick}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demoProjects.slice(0, 4).map((project) => (
                <div
                  key={project.id}
                  className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-md transition-shadow bg-white"
                  onClick={() => {
                    // This will be handled by the wrapper component
                    console.log('Project clicked:', project);
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      ['PV75', 'PV90', 'UB', 'WB'].includes(project.status)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {['PV75', 'PV90', 'UB', 'WB'].includes(project.status)
                      ? 'Click to set up project dates'
                      : 'Click to view project details'
                    }
                  </p>
                </div>
              ))}
            </div>
          </ProjectListWithDateSetup>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Note:</h3>
          <p className="text-sm text-yellow-700">
            This is a demo page. In a real application, the date setup would save to your backend and navigate to the actual project details page.
          </p>
        </div>
      </div>
    </div>
  );
};
