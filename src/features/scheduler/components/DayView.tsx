import React, { useMemo } from 'react';
import { SchedulerViewProps, SchedulerProject } from '../types';
import { PROJECT_STAGE_COLORS } from '../utils/mockData';

export const DayView: React.FC<SchedulerViewProps> = ({
  currentDate,
  projects,
  onProjectClick,
  onProjectHover,
  hoveredProject,
}) => {
  // Filter projects for the current day
  const dayProjects = useMemo(() => {
    const targetDate = currentDate.toISOString().split('T')[0];
    return projects.filter(project => {
      const startDate = project.startDate;
      const endDate = project.endDate;
      return targetDate >= startDate && targetDate <= endDate;
    });
  }, [currentDate, projects]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {formatDate(currentDate)}
          </h2>
          <p className="text-gray-600 mt-1">
            {dayProjects.length} project{dayProjects.length !== 1 ? 's' : ''} scheduled
          </p>
        </div>

        {/* Projects Timeline */}
        <div className="space-y-3">
          {dayProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No projects scheduled
              </h3>
              <p className="text-gray-600">
                No projects are scheduled for this day.
              </p>
            </div>
          ) : (
            dayProjects.map((project, index) => (
              <ProjectBar
                key={project.id}
                project={project}
                onProjectClick={onProjectClick}
                onProjectHover={onProjectHover}
                isHovered={hoveredProject?.id === project.id}
                index={index}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

interface ProjectBarProps {
  project: SchedulerProject;
  onProjectClick: (project: SchedulerProject) => void;
  onProjectHover: (project: SchedulerProject | null) => void;
  isHovered: boolean;
  index: number;
}

const ProjectBar: React.FC<ProjectBarProps> = ({
  project,
  onProjectClick,
  onProjectHover,
  isHovered,
  index,
}) => {
  const statusColors = PROJECT_STAGE_COLORS[project.stage];
  
  return (
    <div
      className={`relative group cursor-pointer transition-all duration-200 ${
        isHovered ? 'transform scale-105 shadow-lg' : 'hover:shadow-md'
      }`}
      onClick={() => onProjectClick(project)}
      onMouseEnter={() => onProjectHover(project)}
      onMouseLeave={() => onProjectHover(null)}
      style={{ zIndex: 10 - index }}
    >
      <div className={`${statusColors} rounded-lg p-4 border-2 transition-all duration-200 ${
        isHovered ? 'border-opacity-100' : 'border-opacity-50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">
              {project.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                project.stage === 'PV90' ? 'bg-gray-100 text-gray-700' :
                project.stage === 'UB' ? 'bg-teal-100 text-teal-700' :
                project.stage === 'WB' ? 'bg-amber-100 text-amber-700' :
                project.stage === 'WIP' ? 'bg-blue-100 text-blue-700' :
                project.stage === 'QF' ? 'bg-orange-100 text-orange-700' :
                'bg-green-100 text-green-700'
              }`}>
                {project.stage}
              </span>
            </div>
          </div>
          
          <div className="flex-shrink-0 ml-4 text-right">
            <p className="text-sm text-gray-600">
              {project.client}
            </p>
            <p className="text-xs text-gray-500">
              {project.location}
            </p>
          </div>
        </div>
        
        {project.description && (
          <p className="text-sm text-gray-700 mt-2 line-clamp-2">
            {project.description}
          </p>
        )}
      </div>
    </div>
  );
};
