import React from 'react';
import { ProjectListWithDateSetup } from '../components/ProjectListWithDateSetup';
import { ProjectCard } from '../components/ProjectCard';
import { Project, requiresDateSetup } from '../utils/projectStatusUtils';

// Example of how to integrate the date setup functionality into your existing project list

interface ProjectListIntegrationExampleProps {
  projects: Project[];
  onProjectClick?: (projectId: string) => void;
}

export const ProjectListIntegrationExample: React.FC<ProjectListIntegrationExampleProps> = ({
  projects,
  onProjectClick,
}) => {
  return (
    <ProjectListWithDateSetup onProjectClick={onProjectClick}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onProjectClick={onProjectClick}
          />
        ))}
      </div>
    </ProjectListWithDateSetup>
  );
};

// Alternative: Direct integration without wrapper
export const DirectIntegrationExample: React.FC<ProjectListIntegrationExampleProps> = ({
  projects,
  onProjectClick,
}) => {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => {
            if (requiresDateSetup(project.status)) {
              // This would need to be handled by the parent component
              // or you'd need to use the hook directly here
              console.log('Project needs date setup:', project);
            } else {
              onProjectClick?.(project.id);
            }
          }}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{project.name}</h3>
            <span className={`px-2 py-1 rounded text-xs ${
              requiresDateSetup(project.status) 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {project.status}
            </span>
          </div>
          {requiresDateSetup(project.status) && (
            <p className="text-sm text-blue-600 mt-2">
              Click to set up project dates
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

// Example of mock data for testing
export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
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
    name: 'API Integration',
    status: 'WB',
  },
  {
    id: '5',
    name: 'User Testing',
    status: 'ACTIVE',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
  },
  {
    id: '6',
    name: 'Documentation',
    status: 'COMPLETED',
    startDate: '2023-12-01',
    endDate: '2024-01-15',
  },
];
