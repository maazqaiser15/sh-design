import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeamGanttWithViews } from '../../features/teamGantt/components/TeamGanttWithViews';
import { MOCK_TEAM_MEMBERS } from '../../features/teamGantt/data/mockData';
import { ViewMode, LayoutMode, Project, TeamGanttFilters, TeamMember } from '../../features/teamGantt/types/ganttTypes';
import { useSetBreadcrumbs } from '../../contexts/BreadcrumbContext';

export const TeamGanttChart: React.FC = () => {
  const navigate = useNavigate();
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

  // Set breadcrumbs
  useSetBreadcrumbs([
    { label: 'Team Gantt Chart' }
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
