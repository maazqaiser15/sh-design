import React, { useState } from 'react';
import { TeamGanttProps, ViewMode } from '../types';
import { TimelineHeader } from './TimelineHeader';
import { TeamRow } from './TeamRow';

export const TeamGantt: React.FC<TeamGanttProps> = ({
  teamMembers,
  currentDate,
  viewMode,
  onDateChange,
  onViewModeChange,
  onProjectHover,
  onProjectClick,
  hoveredProject
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string>('');

  // Get unique project names for filter
  const availableProjects = React.useMemo(() => {
    const projectNames = new Set<string>();
    teamMembers.forEach(member => {
      member.projects.forEach(project => {
        projectNames.add(project.projectName);
      });
    });
    return Array.from(projectNames).sort();
  }, [teamMembers]);

  // Filter team members based on search and project filter
  const filteredTeamMembers = React.useMemo(() => {
    let filtered = teamMembers;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected project
    if (selectedProject) {
      filtered = filtered.map(member => ({
        ...member,
        projects: member.projects.filter(project => project.projectName === selectedProject)
      })).filter(member => member.projects.length > 0);
    }

    return filtered;
  }, [teamMembers, searchTerm, selectedProject]);

  const viewModeButtons: { mode: ViewMode; label: string }[] = [
    { mode: 'day', label: 'Day' },
    { mode: 'week', label: 'Week' },
    { mode: 'month', label: 'Month' }
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header with View Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Gantt Chart</h1>
            <p className="text-gray-600 mt-1">
              {filteredTeamMembers.length} team member{filteredTeamMembers.length !== 1 ? 's' : ''} scheduled
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
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

            {/* Project Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                </svg>
              </div>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="block w-48 pl-10 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
              >
                <option value="">All Projects</option>
                {availableProjects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Timeline Header */}
      <TimelineHeader
        viewMode={viewMode}
        currentDate={currentDate}
        onDateChange={onDateChange}
      />

      {/* Gantt Chart Body */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {filteredTeamMembers.length === 0 ? (
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
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Project Status Legend</h3>
          <div className="flex flex-wrap gap-4">
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
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span className="text-sm text-gray-700">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
