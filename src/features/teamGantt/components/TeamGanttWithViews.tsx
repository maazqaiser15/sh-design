import React, { useState, useMemo } from 'react';
import { TeamGanttProps, ViewMode, LayoutMode, Project, TrailerView, TeamGanttFilters } from '../types/ganttTypes';
import { TimelineHeader } from './TimelineHeader';
import { TeamRow } from './TeamRow';
import { ProjectRow } from './ProjectRow';
import { TrailerRow } from './TrailerRow';
import { transformTeamDataToProjectView, transformTrailerDataToProjectView } from '../utils/dataTransform';
import { MOCK_TRAILERS } from '../data/mockData';
import { useSidebar } from '../../../contexts/SidebarContext';
import { Filter, X } from 'lucide-react';

export const TeamGanttWithViews: React.FC<TeamGanttProps> = ({
  teamMembers,
  currentDate,
  viewMode,
  layoutMode,
  onDateChange,
  onViewModeChange,
  onLayoutModeChange,
  onProjectHover,
  onProjectClick,
  hoveredProject,
  filters = { status: [], assignedUsers: [], trailerProjects: [], trailerAvailability: [] },
  onFiltersChange
}) => {
  const { isCollapsed } = useSidebar();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Transform team data to project view
  const projectViewData = useMemo(() => {
    return transformTeamDataToProjectView(teamMembers);
  }, [teamMembers]);

  // Transform trailer data to project view
  const trailerProjectViewData = useMemo(() => {
    return transformTrailerDataToProjectView(MOCK_TRAILERS);
  }, []);

  // Get unique project names for filter
  const availableProjects = useMemo(() => {
    const projectNames = new Set<string>();
    teamMembers.forEach(member => {
      member.projects.forEach(project => {
        projectNames.add(project.projectName);
      });
    });
    MOCK_TRAILERS.forEach(trailer => {
      trailer.assignedProjects.forEach(project => {
        projectNames.add(project.projectName);
      });
    });
    return Array.from(projectNames).sort();
  }, [teamMembers]);

  // Get unique roles for filter
  const availableRoles = useMemo(() => {
    const roles = new Set<string>();
    teamMembers.forEach(member => {
      roles.add(member.role);
    });
    return Array.from(roles).sort();
  }, [teamMembers]);

  // Get unique users from all projects for filtering
  const allUsers = useMemo(() => {
    const userSet = new Set<string>();
    teamMembers.forEach(member => {
      userSet.add(member.id);
    });
    return Array.from(userSet).map(userId => {
      const member = teamMembers.find(m => m.id === userId);
      return { id: userId, name: member?.name || 'Unknown User' };
    });
  }, [teamMembers]);

  // Get unique projects from trailers for filtering
  const trailerProjects = useMemo(() => {
    const projectSet = new Set<string>();
    MOCK_TRAILERS.forEach(trailer => {
      trailer.assignedProjects.forEach(project => {
        projectSet.add(project.projectName);
      });
    });
    return Array.from(projectSet).sort();
  }, []);

  // Get unique availability options for trailers
  const trailerAvailabilityOptions = useMemo(() => {
    const availabilitySet = new Set<string>();
    MOCK_TRAILERS.forEach(trailer => {
      availabilitySet.add(trailer.status);
    });
    return Array.from(availabilitySet).sort();
  }, []);

  // Filter trailers based on search term, project filter, and new filters
  const filteredTrailers = useMemo(() => {
    let filtered = MOCK_TRAILERS;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(trailer => 
        trailer.trailerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trailer.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trailer.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected project
    if (selectedProject) {
      filtered = filtered.map(trailer => ({
        ...trailer,
        assignedProjects: trailer.assignedProjects.filter(project => project.projectName === selectedProject)
      })).filter(trailer => trailer.assignedProjects.length > 0);
    }

    // Filter by trailer projects (only apply in trailer view mode)
    if (layoutMode === 'trailer' && filters.trailerProjects.length > 0) {
      filtered = filtered.filter(trailer => 
        filters.trailerProjects.some(projectName => 
          trailer.assignedProjects.some(project => project.projectName === projectName)
        )
      );
    }

    // Filter by trailer availability (only apply in trailer view mode)
    if (layoutMode === 'trailer' && filters.trailerAvailability.length > 0) {
      filtered = filtered.filter(trailer => 
        filters.trailerAvailability.includes(trailer.status)
      );
    }

    return filtered;
  }, [searchTerm, selectedProject, layoutMode, filters]);

  // Filter team members based on search term, role filter, and availability filter
  const filteredTeamMembers = useMemo(() => {
    let filtered = teamMembers;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected role (for team view) or project (for other views)
    if (selectedProject) {
      if (layoutMode === 'team') {
        // For team view, filter by role
        filtered = filtered.filter(member => member.role === selectedProject);
      } else {
        // For other views, filter by project
        filtered = filtered.map(member => ({
          ...member,
          projects: member.projects.filter(project => project.projectName === selectedProject)
        })).filter(member => member.projects.length > 0);
      }
    }

    // Filter by availability (only for team view)
    if (layoutMode === 'team' && selectedAvailability) {
      filtered = filtered.filter(member => member.availability === selectedAvailability);
    }

    return filtered;
  }, [teamMembers, searchTerm, selectedProject, selectedAvailability, layoutMode]);

  // Filter project view data based on search term and new filters
  const filteredProjectData = useMemo(() => {
    let filtered = projectViewData;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(project => 
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status (only apply in project view mode)
    if (layoutMode === 'project' && filters.status.length > 0) {
      filtered = filtered.filter(project => filters.status.includes(project.status));
    }

    // Filter by assigned users (only apply in project view mode)
    if (layoutMode === 'project' && filters.assignedUsers.length > 0) {
      filtered = filtered.filter(project => 
        filters.assignedUsers.some(userId => 
          project.assignedMembers.some(member => member.memberId === userId)
        )
      );
    }

    return filtered;
  }, [projectViewData, searchTerm, layoutMode, filters]);



  const clearAllFilters = () => {
    if (!onFiltersChange) return;
    onFiltersChange({
      status: [],
      assignedUsers: [],
      trailerProjects: [],
      trailerAvailability: [],
    });
  };

  const viewModeButtons: { mode: ViewMode; label: string }[] = [
    { mode: 'day', label: 'Day' },
    { mode: 'week', label: 'Week' },
    { mode: 'month', label: 'Month' },
    { mode: 'year', label: 'Year' }
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header with View Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {layoutMode === 'team' ? 'Team' : layoutMode === 'project' ? 'Project' : 'Trailer'} Scheduler
            </h1>
            <p className="text-gray-600 mt-1">
              {layoutMode === 'team' 
                ? `${filteredTeamMembers.length} team member${filteredTeamMembers.length !== 1 ? 's' : ''} scheduled`
                : layoutMode === 'project'
                ? `${filteredProjectData.length} project${filteredProjectData.length !== 1 ? 's' : ''} scheduled`
                : `${filteredTrailers.length} trailer${filteredTrailers.length !== 1 ? 's' : ''} scheduled`
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Layout Mode Switcher */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onLayoutModeChange('team')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  layoutMode === 'team'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Team View
              </button>
              <button
                onClick={() => onLayoutModeChange('project')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  layoutMode === 'project'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Project View
              </button>
              <button
                onClick={() => onLayoutModeChange('trailer')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  layoutMode === 'trailer'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Trailer View
              </button>
            </div>


            {/* View Mode Switcher */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {viewModeButtons.map(({ mode, label }) => (
                <button
                  key={mode}
                  onClick={() => onViewModeChange(mode)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === mode
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>




          </div>
        </div>

      </div>


      {/* Timeline Header */}
      <TimelineHeader
        viewMode={viewMode}
        currentDate={currentDate}
        onDateChange={onDateChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        layoutMode={layoutMode}
        filters={filters}
        onFiltersChange={onFiltersChange}
        allUsers={allUsers}
      />

      {/* Scheduler Body */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pb-24">
          {layoutMode === 'team' ? (
            // Team View
            filteredTeamMembers.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No team members found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'No team members match your search criteria.' : 'No team members are available.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white">
                {filteredTeamMembers.map((member) => (
                  <TeamRow
                    key={member.id}
                    member={member}
                    viewMode={viewMode}
                    currentDate={currentDate}
                    onProjectHover={onProjectHover}
                    onProjectClick={onProjectClick}
                    hoveredProject={hoveredProject}
                  />
                ))}
              </div>
            )
          ) : layoutMode === 'project' ? (
            // Project View
            filteredProjectData.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No projects found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'No projects match your search criteria.' : 'No projects are available.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white">
                {filteredProjectData.map((project) => (
                  <ProjectRow
                    key={project.projectId}
                    project={project}
                    viewMode={viewMode}
                    currentDate={currentDate}
                    onProjectHover={onProjectHover}
                    onProjectClick={onProjectClick}
                    hoveredProject={hoveredProject}
                  />
                ))}
              </div>
            )
          ) : (
            // Trailer View
            filteredTrailers.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No trailers found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm ? 'No trailers match your search criteria.' : 'No trailers are available.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white">
                {filteredTrailers.map((trailer) => (
                  <TrailerRow
                    key={trailer.trailerId}
                    trailer={trailer}
                    viewMode={viewMode}
                    currentDate={currentDate}
                    onProjectHover={onProjectHover}
                    onProjectClick={onProjectClick}
                    hoveredProject={hoveredProject}
                  />
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Fixed Legend */}
      <div className={`fixed bottom-0 ${isCollapsed ? 'left-16' : 'left-64'} right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            {layoutMode === 'trailer' ? 'Trailer & Project Status Legend' : 'Project Status Legend'}
          </h3>
          <div className="flex flex-wrap gap-4">
            {layoutMode === 'trailer' && (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-200 rounded"></div>
                  <span className="text-sm text-gray-700">Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                  <span className="text-sm text-gray-700">Low Stock</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-200 rounded"></div>
                  <span className="text-sm text-gray-700">Unavailable</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
              </>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span className="text-sm text-gray-700">PV90</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-200 rounded"></div>
              <span className="text-sm text-gray-700">UB</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-teal-200 rounded"></div>
              <span className="text-sm text-gray-700">WB</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-amber-200 rounded"></div>
              <span className="text-sm text-gray-700">WIP</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-200 rounded"></div>
              <span className="text-sm text-gray-700">QF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
