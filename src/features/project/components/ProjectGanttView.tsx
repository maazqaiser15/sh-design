import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Users, Truck, MapPin, Filter, X } from 'lucide-react';
import { ProjectListItem, PROJECT_STATUS_COLORS, ProjectStatus, ProjectFilters } from '../types';
import { ProjectGanttRow } from './ProjectGanttRow';
import { ProjectGanttTimelineHeader } from './ProjectGanttTimelineHeader';

export type GanttViewMode = 'day' | 'week' | 'month' | 'year';

interface ProjectGanttViewProps {
  projects: ProjectListItem[];
  onProjectClick: (project: ProjectListItem) => void;
  filters?: ProjectFilters;
  onFiltersChange?: (filters: ProjectFilters) => void;
}

export const ProjectGanttView: React.FC<ProjectGanttViewProps> = ({
  projects,
  onProjectClick,
  filters = { status: [], assignedUsers: [] },
  onFiltersChange,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<GanttViewMode>('month');
  const [hoveredProject, setHoveredProject] = useState<ProjectListItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique users from all projects
  const allUsers = useMemo(() => {
    const userSet = new Set<string>();
    projects.forEach(project => {
      project.crew.forEach(member => {
        userSet.add(member.id);
      });
    });
    return Array.from(userSet).map(userId => {
      const project = projects.find(p => p.crew.some(member => member.id === userId));
      const member = project?.crew.find(member => member.id === userId);
      return { id: userId, name: member?.name || 'Unknown User' };
    });
  }, [projects]);

  // Filter projects that are visible in the current timeline and match filters
  const visibleProjects = useMemo(() => {
    return projects.filter(project => {
      // Timeline filter
      const projectStart = new Date(project.startDate);
      const projectEnd = new Date(project.endDate);
      
      let timelineStart: Date;
      let timelineEnd: Date;

      if (viewMode === 'day') {
        timelineStart = new Date(currentDate);
        timelineStart.setHours(0, 0, 0, 0);
        timelineEnd = new Date(currentDate);
        timelineEnd.setHours(23, 59, 59, 999);
      } else if (viewMode === 'week') {
        const startOfWeek = new Date(currentDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
        startOfWeek.setDate(diff);
        timelineStart = startOfWeek;
        timelineEnd = new Date(startOfWeek);
        timelineEnd.setDate(startOfWeek.getDate() + 6);
      } else if (viewMode === 'month') {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        timelineStart = new Date(year, month, 1);
        timelineEnd = new Date(year, month + 1, 0);
      } else {
        const year = currentDate.getFullYear();
        timelineStart = new Date(year, 0, 1);
        timelineEnd = new Date(year, 11, 31);
      }

      const isInTimeline = projectEnd >= timelineStart && projectStart <= timelineEnd;

      // Status filter
      const statusMatch = filters.status.length === 0 || filters.status.includes(project.status);

      // User filter
      const userMatch = filters.assignedUsers.length === 0 || 
        filters.assignedUsers.some(userId => 
          project.crew.some(member => member.id === userId)
        );

      return isInTimeline && statusMatch && userMatch;
    });
  }, [projects, currentDate, viewMode, filters]);

  const handleDateChange = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  const handleViewModeChange = (mode: GanttViewMode) => {
    setViewMode(mode);
  };

  const handleStatusFilter = (status: ProjectStatus) => {
    if (!onFiltersChange) return;
    
    const newStatusFilters = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    onFiltersChange({
      ...filters,
      status: newStatusFilters,
    });
  };

  const handleUserFilter = (userId: string) => {
    if (!onFiltersChange) return;
    
    const newUserFilters = filters.assignedUsers.includes(userId)
      ? filters.assignedUsers.filter(id => id !== userId)
      : [...filters.assignedUsers, userId];
    
    onFiltersChange({
      ...filters,
      assignedUsers: newUserFilters,
    });
  };

  const clearAllFilters = () => {
    if (!onFiltersChange) return;
    onFiltersChange({
      status: [],
      assignedUsers: [],
    });
  };

  const viewModeButtons: { mode: GanttViewMode; label: string }[] = [
    { mode: 'day', label: 'Day' },
    { mode: 'week', label: 'Week' },
    { mode: 'month', label: 'Month' },
    { mode: 'year', label: 'Year' }
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header with View Controls */}
      <div className="bg-white border-b border-gray-200 px-2 py-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Project Gantt Chart</h1>
            <p className="text-gray-600 mt-1">
              {visibleProjects.length} project{visibleProjects.length !== 1 ? 's' : ''} scheduled
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                (filters.status.length > 0 || filters.assignedUsers.length > 0)
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {(filters.status.length > 0 || filters.assignedUsers.length > 0) && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {filters.status.length + filters.assignedUsers.length}
                </span>
              )}
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {viewModeButtons.map(({ mode, label }) => (
                <button
                  key={mode}
                  onClick={() => handleViewModeChange(mode)}
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

            {/* Date Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  if (viewMode === 'day') {
                    newDate.setDate(newDate.getDate() - 1);
                  } else if (viewMode === 'week') {
                    newDate.setDate(newDate.getDate() - 7);
                  } else if (viewMode === 'month') {
                    newDate.setMonth(newDate.getMonth() - 1);
                  } else {
                    newDate.setFullYear(newDate.getFullYear() - 1);
                  }
                  handleDateChange(newDate);
                }}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => handleDateChange(new Date())}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                Today
              </button>
              
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  if (viewMode === 'day') {
                    newDate.setDate(newDate.getDate() + 1);
                  } else if (viewMode === 'week') {
                    newDate.setDate(newDate.getDate() + 7);
                  } else if (viewMode === 'month') {
                    newDate.setMonth(newDate.getMonth() + 1);
                  } else {
                    newDate.setFullYear(newDate.getFullYear() + 1);
                  }
                  handleDateChange(newDate);
                }}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filter Projects</h3>
            <div className="flex items-center space-x-2">
              {(filters.status.length > 0 || filters.assignedUsers.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Filter by Status</h4>
              <div className="flex flex-wrap gap-2">
                {['D75', 'PV90', 'UB', 'WB', 'WIP', 'QF', 'QC', 'Completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilter(status as ProjectStatus)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      filters.status.includes(status as ProjectStatus)
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* User Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Filter by Assigned User</h4>
              <div className="max-h-32 overflow-y-auto">
                {allUsers.length === 0 ? (
                  <p className="text-sm text-gray-500">No users assigned to projects</p>
                ) : (
                  <div className="space-y-1">
                    {allUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleUserFilter(user.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          filters.assignedUsers.includes(user.id)
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {user.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Header */}
      <ProjectGanttTimelineHeader
        viewMode={viewMode}
        currentDate={currentDate}
        onDateChange={handleDateChange}
      />

      {/* Gantt Chart Body */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {visibleProjects.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <Calendar className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-600">
                  No projects are scheduled for the selected time period.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white">
              {visibleProjects.map((project) => (
                <ProjectGanttRow
                  key={project.id}
                  project={project}
                  viewMode={viewMode}
                  currentDate={currentDate}
                  onProjectHover={setHoveredProject}
                  onProjectClick={onProjectClick}
                  hoveredProject={hoveredProject}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Legend */}
      <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 p-3 shadow-lg z-50">
        <div className="max-w-full mx-auto px-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Project Status Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-200 rounded"></div>
              <span className="text-sm text-gray-700">PV90</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-200 rounded"></div>
              <span className="text-sm text-gray-700">UB</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-200 rounded"></div>
              <span className="text-sm text-gray-700">WB</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-200 rounded"></div>
              <span className="text-sm text-gray-700">WIP</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-200 rounded"></div>
              <span className="text-sm text-gray-700">QF</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span className="text-sm text-gray-700">Completed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
