import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, List, Search, X, Calendar } from 'lucide-react';
import { ProjectListView } from '../components/ProjectListView';
import { ProjectTableView } from '../components/ProjectTableView';
import { ProjectGanttView } from '../components/ProjectGanttView';
import { ProjectDateModal } from '../components/ProjectDateModal';
import { 
  SafeHavenProject, 
  ProjectListItem, 
  ProjectFilters, 
  ProjectSortOptions, 
  ProjectViewMode,
  ProjectStatus 
} from '../types';
import { projectToListItem, filterProjects, sortProjects } from '../utils';
import { Trailer } from '../../../types';

// Mock trailer data
const mockTrailers: Trailer[] = [
  {
    id: "1",
    trailerName: "Alpha Trailer",
    registrationNumber: "TXDA-SJ1BR1-EETUSC01-P10001",
    parkingAddress: "123 Main Street",
    state: "California",
    city: "Los Angeles",
    inventory: {
      tools: [
        { toolName: "CART", currentStock: 6, threshold: 6, status: "good" },
        { toolName: "BEER TANK W/ HOSE", currentStock: 4, threshold: 6, status: "low" },
        { toolName: "HARD PRESS", currentStock: 0, threshold: 6, status: "critical" },
        { toolName: "RED CARD", currentStock: 8, threshold: 6, status: "good" },
      ],
      filmSheets: [
        { sheetType: "BR", currentStock: 25, threshold: 20, status: "good" },
        { sheetType: "Riot+", currentStock: 15, threshold: 20, status: "low" },
        { sheetType: "Riot", currentStock: 0, threshold: 15, status: "critical" },
      ],
    },
    status: "unavailable",
    activityLogs: [],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "2",
    trailerName: "Beta Trailer",
    registrationNumber: "TXDA-SJ1BR1-EETUSC01-P10002",
    parkingAddress: "456 Industrial Blvd",
    state: "Texas",
    city: "Houston",
    inventory: {
      tools: [
        { toolName: "CART", currentStock: 8, threshold: 6, status: "good" },
        { toolName: "BEER TANK W/ HOSE", currentStock: 7, threshold: 6, status: "good" },
        { toolName: "HARD PRESS", currentStock: 6, threshold: 6, status: "good" },
        { toolName: "RED CARD", currentStock: 10, threshold: 6, status: "good" },
      ],
      filmSheets: [
        { sheetType: "BR", currentStock: 35, threshold: 20, status: "good" },
        { sheetType: "Riot+", currentStock: 28, threshold: 20, status: "good" },
        { sheetType: "Riot", currentStock: 18, threshold: 15, status: "good" },
      ],
    },
    status: "available",
    activityLogs: [],
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
  },
  {
    id: "3",
    trailerName: "Gamma Trailer",
    registrationNumber: "TXDA-SJ1BR1-EETUSC01-P10003",
    parkingAddress: "789 Service Road",
    state: "Florida",
    city: "Miami",
    inventory: {
      tools: [
        { toolName: "CART", currentStock: 6, threshold: 6, status: "good" },
        { toolName: "BEER TANK W/ HOSE", currentStock: 6, threshold: 6, status: "good" },
        { toolName: "HARD PRESS", currentStock: 5, threshold: 6, status: "low" },
        { toolName: "RED CARD", currentStock: 4, threshold: 6, status: "low" },
      ],
      filmSheets: [
        { sheetType: "BR", currentStock: 20, threshold: 20, status: "good" },
        { sheetType: "Riot+", currentStock: 20, threshold: 20, status: "good" },
        { sheetType: "Riot", currentStock: 15, threshold: 15, status: "good" },
      ],
    },
    status: "low",
    activityLogs: [],
    createdAt: "2024-01-13T16:45:00Z",
    updatedAt: "2024-01-13T16:45:00Z",
  },
];

// Mock data for Safe Haven Defense projects
const mockProjects: SafeHavenProject[] = [
  {
    id: '1',
    title: 'Downtown Office Complex Security',
    description: 'Complete security film installation for 15-story office complex downtown',
    status: 'PV75',
    stage: 'PV75',
    startDate: '2025-09-15',
    endDate: '2025-09-30',
    location: 'Downtown Seattle, WA',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
    assignedTeam: ['1', '2', '3'],
    assignedTrailers: ['1'],
    progress: 5,
    vinCode: 'TXDA-SJ1BR1-EETUSC01-P20001',
    crew: [
      { 
        id: '1', 
        name: 'John Smith', 
        role: 'Lead Installer', 
        designation: 'Lead Installer',
        location: 'Seattle, WA',
        phone: '+1-555-0101',
        productivity: 'Efficient in Installation',
        status: 'available' as const,
        avatar: undefined 
      },
      { 
        id: '2', 
        name: 'Sarah Johnson', 
        role: 'Technician', 
        designation: 'Technician',
        location: 'Seattle, WA',
        phone: '+1-555-0102',
        productivity: 'Efficient in Installation',
        status: 'available' as const,
        avatar: undefined 
      },
      { 
        id: '3', 
        name: 'Mike Davis', 
        role: 'Assistant', 
        designation: 'Assistant',
        location: 'Seattle, WA',
        phone: '+1-555-0103',
        productivity: 'Efficient in Installation',
        status: 'available' as const,
        avatar: undefined 
      },
    ],
    assignedTrailer: 'Trailer Alpha',
  },
  {
    id: '2',
    title: 'Residential Community Protection',
    description: 'Security film installation for luxury residential community',
    status: 'WB',
    stage: 'WB',
    startDate: '2025-09-20',
    endDate: '2025-09-25',
    location: 'Bellevue, WA',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    assignedTeam: ['4', '5'],
    assignedTrailers: ['2'],
    progress: 40,
    vinCode: 'TXDA-SJ1BR1-EETUSC01-P20002',
    crew: [
      { 
        id: '4', 
        name: 'Lisa Wilson', 
        role: 'Project Manager', 
        designation: 'Project Manager',
        location: 'Bellevue, WA',
        phone: '+1-555-0104',
        productivity: 'Efficient in Installation',
        status: 'available' as const,
        avatar: undefined 
      },
      { 
        id: '5', 
        name: 'Tom Brown', 
        role: 'Installer', 
        designation: 'Installer',
        location: 'Bellevue, WA',
        phone: '+1-555-0105',
        productivity: 'Efficient in Installation',
        status: 'available' as const,
        avatar: undefined 
      },
    ],
    assignedTrailer: 'Trailer Beta',
  },
  {
    id: '3',
    title: 'Government Building Security',
    description: 'High-security film installation for government facility',
    status: 'UB',
    stage: 'UB',
    startDate: '2025-09-10',
    endDate: '2025-09-18',
    location: 'Olympia, WA',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    assignedTeam: [],
    assignedTrailers: [],
    progress: 25,
    vinCode: 'TXDA-SJ1BR1-EETUSC01-P20003',
    crew: [],
    assignedTrailer: null,
  },
  {
    id: '4',
    title: 'Retail Store Protection',
    description: 'Security film installation for retail chain stores',
    status: 'Completed',
    stage: 'Completed',
    startDate: '2025-09-05',
    endDate: '2025-09-12',
    location: 'Tacoma, WA',
    createdAt: '2024-10-15T00:00:00Z',
    updatedAt: '2024-11-15T00:00:00Z',
    assignedTeam: ['6', '7', '8'],
    assignedTrailers: ['3'],
    progress: 100,
    vinCode: 'TXDA-SJ1BR1-EETUSC01-P20004',
    crew: [
      { 
        id: '6', 
        name: 'Alex Rodriguez', 
        role: 'Lead Installer', 
        designation: 'Lead Installer',
        location: 'Tacoma, WA',
        phone: '+1-555-0106',
        productivity: 'Efficient in Installation',
        status: 'available' as const,
        avatar: undefined 
      },
      { 
        id: '7', 
        name: 'Emma Thompson', 
        role: 'Technician', 
        designation: 'Technician',
        location: 'Tacoma, WA',
        phone: '+1-555-0107',
        productivity: 'Efficient in Installation',
        status: 'available' as const,
        avatar: undefined 
      },
      { 
        id: '8', 
        name: 'David Lee', 
        role: 'Assistant', 
        designation: 'Assistant',
        location: 'Tacoma, WA',
        phone: '+1-555-0108',
        productivity: 'Efficient in Installation',
        status: 'available' as const,
        avatar: undefined 
      },
    ],
    assignedTrailer: 'Trailer Gamma',
  },
  {
    id: '5',
    title: 'School District Safety',
    description: 'Security film installation for school district buildings',
    status: 'PV90',
    stage: 'PV90',
    startDate: '2025-09-25',
    endDate: '2025-10-05',
    location: 'Spokane, WA',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    assignedTeam: [],
    assignedTrailers: [],
    progress: 15,
    vinCode: 'TXDA-SJ1BR1-EETUSC01-P20005',
    crew: [],
    assignedTrailer: null,
  },
  {
    id: '6',
    title: 'Hospital Security Upgrade',
    description: 'Security film installation for medical facility',
    status: 'WIP',
    stage: 'WIP',
    startDate: '2025-09-08',
    endDate: '2025-09-15',
    location: 'Portland, OR',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    assignedTeam: ['9', '10'],
    assignedTrailers: ['4'],
    progress: 75,
    vinCode: 'TXDA-SJ1BR1-EETUSC01-P20006',
    crew: [
      { 
        id: '9', 
        name: 'Jennifer Taylor', 
        role: 'Installer', 
        designation: 'Installer',
        location: 'Portland, OR',
        phone: '+1-555-0109',
        productivity: 'Efficient in Installation',
        status: 'available' as const,
        avatar: undefined 
      },
      { 
        id: '10', 
        name: 'Robert Garcia', 
        role: 'Coordinator', 
        designation: 'Coordinator',
        location: 'Portland, OR',
        phone: '+1-555-0110',
        productivity: 'Efficient in Installation',
        status: 'available' as const,
        avatar: undefined 
      },
    ],
    assignedTrailer: 'Trailer Delta',
  },
  {
    id: '7',
    title: 'Shopping Mall Protection',
    description: 'Security film installation for retail complex',
    status: 'UB',
    stage: 'UB',
    startDate: '2025-09-22',
    endDate: '2025-09-28',
    location: 'San Francisco, CA',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
    assignedTeam: ['11', '12'],
    assignedTrailers: ['5'],
    progress: 25,
    vinCode: 'TXDA-SJ1BR1-EETUSC01-P20007',
    crew: [
      { 
        id: '11', 
        name: 'Amanda Lee', 
        role: 'Lead', 
        designation: 'Lead',
        location: 'San Francisco, CA',
        phone: '+1-555-0111',
        productivity: 'Efficient in Installation',
        status: 'available' as const,
        avatar: undefined 
      },
      { 
        id: '12', 
        name: 'Christopher Davis', 
        role: 'Installer', 
        designation: 'Installer',
        location: 'San Francisco, CA',
        phone: '+1-555-0112',
        productivity: 'Efficient in Installation',
        status: 'available' as const,
        avatar: undefined 
      },
    ],
    assignedTrailer: 'Trailer Echo',
  },
  {
    id: '8',
    title: 'Quality Assurance Project',
    description: 'Security film installation ready for quality check',
    status: 'QF',
    stage: 'QF',
    startDate: '2025-09-12',
    endDate: '2025-09-18',
    location: 'Portland, OR',
    createdAt: '2024-12-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z',
    assignedTeam: ['1', '2'],
    assignedTrailers: ['1'],
    progress: 90,
    vinCode: 'TXDA-SJ1BR1-EETUSC01-P20008',
    crew: [
      { 
        id: '1', 
        name: 'John Smith', 
        role: 'Lead Installer', 
        designation: 'Lead Installer',
        location: 'Portland, OR',
        phone: '+1-555-0101',
        productivity: 'Efficient in Installation',
        status: 'available' as const,
        avatar: undefined 
      },
      { 
        id: '2', 
        name: 'Sarah Johnson', 
        role: 'Technician', 
        designation: 'Technician',
        location: 'Portland, OR',
        phone: '+1-555-0102',
        productivity: 'Efficient in Installation',
        status: 'available' as const,
        avatar: undefined 
      }
    ],
    assignedTrailer: 'Trailer Alpha',
  },
];

export const ProjectListPage: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ProjectViewMode>({ type: 'list' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProjectFilters>({
    status: [],
    assignedUsers: [],
  });
  const [sortOptions, setSortOptions] = useState<ProjectSortOptions>({
    field: 'title',
    direction: 'asc',
  });
  
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [projectForDateAssignment, setProjectForDateAssignment] = useState<ProjectListItem | null>(null);
  

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
    // Route based on project status
    switch (project.status as ProjectStatus) {
      case 'PV75':
      case 'PV90':
      case 'UB':
      case 'WB':
        // Navigate to existing project details page for preparation stages
        navigate(`/projects/${project.id}?stage=preparation`);
        break;
      case 'WIP':
      case 'QF':
      case 'Completed':
        // Navigate to coming soon page for these statuses
        navigate(`/projects/${project.id}/coming-soon?status=${project.status}&title=${encodeURIComponent(project.title)}`);
        break;
      default:
        // Default to preparation stage
        navigate(`/projects/${project.id}?stage=preparation`);
    }
  };



  const handleDateConfirm = (startDate: string, endDate: string) => {
    if (projectForDateAssignment) {
      // Update the project with new dates
      console.log(`Setting dates for project ${projectForDateAssignment.title}:`, { startDate, endDate });
      
      // In a real app, you would update the project in the database here
      // For now, we'll just navigate to the project details page
      navigate(`/projects/${projectForDateAssignment.id}`);
    }
  };

  const handleDateModalClose = () => {
    setIsDateModalOpen(false);
    setProjectForDateAssignment(null);
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
      assignedUsers: [],
    });
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-0">
        {/* First Row - Page Heading and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          {/* Left side - Title and count */}
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-lg text-gray-500 mt-1">{projectListItems.length} Projects</p>
          </div>
          
          {/* Right side - Search and View Controls */}
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
              <button
                onClick={() => setViewMode({ type: 'gantt' })}
                className={`p-2 rounded-md transition-colors ${
                  viewMode.type === 'gantt'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Gantt Chart View"
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Second Row - Status Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {['All', 'PV75', 'PV90', 'UB', 'WB', 'WIP', 'QF', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  const projectStatus = status === 'All' ? '' : status as ProjectStatus;
                  setFilters({
                    status: projectStatus ? [projectStatus] : [],
                  });
                }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  (status === 'All' && filters.status.length === 0) || 
                  (status !== 'All' && filters.status.includes(status as ProjectStatus))
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Project Views */}
        {viewMode.type === 'list' ? (
          <ProjectListView
            projects={filteredAndSortedProjects}
            onProjectClick={handleProjectClick}
          />
        ) : viewMode.type === 'table' ? (
          <ProjectTableView
            projects={filteredAndSortedProjects}
            onProjectClick={handleProjectClick}
            sortOptions={sortOptions}
            onSort={handleSort}
          />
        ) : (
          <ProjectGanttView
            projects={filteredAndSortedProjects}
            onProjectClick={handleProjectClick}
            filters={filters}
            onFiltersChange={setFilters}
          />
        )}

      {/* Project Date Modal */}
      {projectForDateAssignment && (
        <ProjectDateModal
          isOpen={isDateModalOpen}
          onClose={handleDateModalClose}
          onConfirm={handleDateConfirm}
          projectTitle={projectForDateAssignment.title}
          projectStatus={projectForDateAssignment.status}
          initialStartDate={projectForDateAssignment.startDate}
          initialEndDate={projectForDateAssignment.endDate}
        />
      )}
      </div>
    </div>
  );
};
