import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, List, Plus, Search, X } from 'lucide-react';
import { Button } from '../../../common/components/Button';
import { ProjectListView } from '../components/ProjectListView';
import { ProjectTableView } from '../components/ProjectTableView';
import { 
  SafeHavenProject, 
  ProjectListItem, 
  ProjectFilters, 
  ProjectSortOptions, 
  ProjectViewMode,
  ProjectStatus 
} from '../types';
import { projectToListItem, filterProjects, sortProjects } from '../utils';

// Mock data for Safe Haven Defense projects
const mockProjects: SafeHavenProject[] = [
  {
    id: '1',
    title: 'Downtown Office Complex Security',
    description: 'Complete security film installation for 15-story office complex downtown',
    status: 'WIP',
    stage: 'WIP',
    startDate: '2024-12-15',
    endDate: '2024-12-30',
    location: 'Downtown Seattle, WA',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
    assignedTeam: ['1', '2', '3'],
    assignedTrailers: ['1'],
    progress: 65,
    vinCode: 'SHD-001',
    crew: [
      { id: '1', name: 'John Smith', role: 'Lead Installer', avatar: undefined },
      { id: '2', name: 'Sarah Johnson', role: 'Technician', avatar: undefined },
      { id: '3', name: 'Mike Davis', role: 'Assistant', avatar: undefined },
    ],
    assignedTrailer: 'Trailer Alpha',
  },
  {
    id: '2',
    title: 'Residential Community Protection',
    description: 'Security film installation for luxury residential community',
    status: 'WB',
    stage: 'WB',
    startDate: '2024-12-20',
    endDate: '2024-12-25',
    location: 'Bellevue, WA',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    assignedTeam: ['4', '5'],
    assignedTrailers: ['2'],
    progress: 25,
    vinCode: 'SHD-002',
    crew: [
      { id: '4', name: 'Lisa Wilson', role: 'Project Manager', avatar: undefined },
      { id: '5', name: 'Tom Brown', role: 'Installer', avatar: undefined },
    ],
    assignedTrailer: 'Trailer Beta',
  },
  {
    id: '3',
    title: 'Government Building Security',
    description: 'High-security film installation for government facility',
    status: 'UB',
    stage: 'UB',
    startDate: '2025-01-15',
    endDate: '2025-01-30',
    location: 'Olympia, WA',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    assignedTeam: [],
    assignedTrailers: [],
    progress: 0,
    vinCode: 'SHD-003',
    crew: [],
    assignedTrailer: null,
  },
  {
    id: '4',
    title: 'Retail Store Protection',
    description: 'Security film installation for retail chain stores',
    status: 'Completed',
    stage: 'Completed',
    startDate: '2024-11-01',
    endDate: '2024-11-15',
    location: 'Tacoma, WA',
    createdAt: '2024-10-15T00:00:00Z',
    updatedAt: '2024-11-15T00:00:00Z',
    assignedTeam: ['6', '7', '8'],
    assignedTrailers: ['3'],
    progress: 100,
    vinCode: 'SHD-004',
    crew: [
      { id: '6', name: 'Alex Rodriguez', role: 'Lead Installer', avatar: undefined },
      { id: '7', name: 'Emma Thompson', role: 'Technician', avatar: undefined },
      { id: '8', name: 'David Lee', role: 'Assistant', avatar: undefined },
    ],
    assignedTrailer: 'Trailer Gamma',
  },
  {
    id: '5',
    title: 'School District Safety',
    description: 'Security film installation for school district buildings',
    status: 'PV90',
    stage: 'PV90',
    startDate: '2025-02-01',
    endDate: '2025-02-20',
    location: 'Spokane, WA',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    assignedTeam: [],
    assignedTrailers: [],
    progress: 0,
    vinCode: 'SHD-005',
    crew: [],
    assignedTrailer: null,
  },
];

export const ProjectListPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ProjectViewMode>({ type: 'list' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProjectFilters>({
    status: [],
  });
  const [sortOptions, setSortOptions] = useState<ProjectSortOptions>({
    field: 'title',
    direction: 'asc',
  });

  // Convert projects to list items
  const projectListItems = useMemo(() => {
    return mockProjects.map(projectToListItem);
  }, []);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    const filtered = filterProjects(projectListItems, {
      ...filters,
      searchQuery,
    });
    
    return sortProjects(filtered, sortOptions.field, sortOptions.direction);
  }, [projectListItems, filters, searchQuery, sortOptions]);

  const handleProjectClick = (project: ProjectListItem) => {
    // Navigate to project details page
    navigate(`/projects/${project.id}`);
  };

  const handleSort = (field: ProjectSortOptions['field']) => {
    setSortOptions(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: [],
    });
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-0 py-0">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          {/* Left side - Title and count */}
          <div className="mb-4 md:mb-0">
            <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
            <p className="text-sm text-gray-500">{projectListItems.length} Projects</p>
          </div>
          
          {/* Right side - Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter Dropdown */}
            <select
              value={filters.status[0] || ''}
              onChange={(e) => {
                const status = e.target.value as ProjectStatus;
                setFilters({
                  status: status ? [status] : [],
                });
              }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              {['PV90', 'UB', 'WB', 'WIP', 'Completed'].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            {/* View Toggle - Icons Only */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode({ type: 'list' })}
                className={`p-2 rounded-md transition-colors ${
                  viewMode.type === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="List View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode({ type: 'table' })}
                className={`p-2 rounded-md transition-colors ${
                  viewMode.type === 'table'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Add Project Button */}
            <Button
              onClick={() => {
                // TODO: Implement add project functionality
                console.log('Add project clicked');
              }}
              icon={Plus}
              size="md"
            >
              New Project
            </Button>
          </div>
        </div>

        {/* Project Views */}
        {viewMode.type === 'list' ? (
          <ProjectListView
            projects={filteredAndSortedProjects}
            onProjectClick={handleProjectClick}
          />
        ) : (
          <ProjectTableView
            projects={filteredAndSortedProjects}
            onProjectClick={handleProjectClick}
            sortOptions={sortOptions}
            onSort={handleSort}
          />
        )}

      </div>
    </div>
  );
};
