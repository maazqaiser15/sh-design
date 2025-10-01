import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamGanttWithViews } from '../../features/teamGantt/components/TeamGanttWithViews';
import { MOCK_TEAM_MEMBERS } from '../../features/teamGantt/data/mockData';
import { ViewMode, LayoutMode, Project, TeamGanttFilters, TeamMember } from '../../features/teamGantt/types/ganttTypes';
import { useSetBreadcrumbs } from '../../contexts/BreadcrumbContext';
import { useAuth } from '../../contexts/AuthContext';

export const TeamGanttChart: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date('2025-10-01')); // Set to October 2025 when projects are scheduled
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('project'); // Default to Project View
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [filters, setFilters] = useState<TeamGanttFilters>({
    status: [],
    assignedUsers: [],
    trailerProjects: [],
    trailerAvailability: [],
  });

  // Check if user has permission to access scheduler
  if (!hasPermission('scheduler', 'view')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the Resource Planning module.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Set breadcrumbs
  useSetBreadcrumbs([
    { label: 'Resource Planning' }
  ]);

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleLayoutModeChange = (mode: LayoutMode) => {
    setLayoutMode(mode);
  };

  const handleProjectHover = (project: Project | null) => {
    setHoveredProject(project);
  };

  const handleProjectClick = (project: Project) => {
    console.log('Project clicked:', project);
    navigate(`/projects/${project.projectId}`);
  };

  return (
    <TeamGanttWithViews
      teamMembers={MOCK_TEAM_MEMBERS as TeamMember[]}
      currentDate={currentDate}
      viewMode={viewMode}
      layoutMode={layoutMode}
      onDateChange={handleDateChange}
      onViewModeChange={handleViewModeChange}
      onLayoutModeChange={handleLayoutModeChange}
      onProjectHover={handleProjectHover}
      onProjectClick={handleProjectClick}
      hoveredProject={hoveredProject}
      filters={filters}
      onFiltersChange={setFilters}
    />
  );
};
