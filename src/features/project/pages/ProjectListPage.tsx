import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, List, Search, X, Calendar, Plus, BarChart3, Filter, MoreHorizontal } from 'lucide-react';
import { ProjectListView } from '../components/ProjectListView';
import { ProjectTableView } from '../components/ProjectTableView';
import { ProjectGanttView } from '../components/ProjectGanttView';
import { ProjectDateModal } from '../components/ProjectDateModal';
import { ProjectCoordinatorModal } from '../components/ProjectCoordinatorModal';
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
import { useAuth } from '../../../contexts/AuthContext';
import { useSidebar } from '../../../contexts/SidebarContext';
import { filterProjectsByUserRole, getAvailableProjectStatuses } from '../../../services/projectFilterService';
import { Button } from '../../../common/components/Button';
import { Card } from '../../../common/components/Card';

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
    assignedTeam: [],
    assignedTrailers: [],
    progress: 5,
    vinCode: 'TXDA-SJ1BR1-EETUSC01-P20001',
    crew: [],
    assignedTrailer: null,
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
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' 
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
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' 
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
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' 
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
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' 
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
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' 
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
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face' 
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
        avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face' 
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
        avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face' 
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
        avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face' 
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
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face' 
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
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' 
      }
    ],
    assignedTrailer: 'Trailer Alpha',
  },
];

export const ProjectListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const { isMobile } = useSidebar();
  const isExecutive = user?.userType === 'executive';
  const [viewMode, setViewMode] = useState<ProjectViewMode>({ type: 'list' });
  const [searchQuery, setSearchQuery] = useState('');

  // Force list view on mobile when table is selected
  useEffect(() => {
    if (isMobile && viewMode.type === 'table') {
      setViewMode({ type: 'list' });
    }
  }, [isMobile, viewMode.type]);
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
  const [showExecutiveAnalytics, setShowExecutiveAnalytics] = useState(false);
  const [isCoordinatorModalOpen, setIsCoordinatorModalOpen] = useState(false);
  const [projectForCoordinatorAssignment, setProjectForCoordinatorAssignment] = useState<ProjectListItem | null>(null);
  

  // Convert projects to list items
  const projectListItems = useMemo(() => {
    return mockProjects.map(projectToListItem);
  }, []);

  // Executive analytics calculations
  const executiveAnalytics = useMemo(() => {
    if (!isExecutive) return null;
    
    const totalProjects = projectListItems.length;
    const activeProjects = projectListItems.filter(p => ['PV75', 'PV90', 'UB', 'WB', 'WIP', 'QF'].includes(p.status)).length;
    const completedProjects = projectListItems.filter(p => p.status === 'Completed').length;
    const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;
    
    const projectsByStatus = projectListItems.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const averageProgress = projectListItems.reduce((sum, project) => sum + (project.progress || 0), 0) / totalProjects;
    
    return {
      totalProjects,
      activeProjects,
      completedProjects,
      completionRate,
      projectsByStatus,
      averageProgress
    };
  }, [projectListItems, isExecutive]);

  // Filter projects by user role first, then apply other filters
  const filteredAndSortedProjects = useMemo(() => {
    // First filter by user role (hide certain statuses for Execution Team)
    const roleFilteredProjects = user?.userType 
      ? filterProjectsByUserRole(projectListItems, user.userType)
      : projectListItems;
    
    // Then apply other filters (search, status, assigned users)
    const filtered = filterProjects(roleFilteredProjects, {
      ...filters,
      searchQuery,
    });
    
    return sortProjects(filtered, sortOptions.field, sortOptions.direction);
  }, [projectListItems, filters, searchQuery, sortOptions, user?.userType]);

  const handleProjectClick = (project: ProjectListItem) => {
    // Check if user is executive and project status requires coordinator assignment
    if (isExecutive && ['PV75', 'PV90', 'UB', 'WB'].includes(project.status)) {
      setProjectForCoordinatorAssignment(project);
      setIsCoordinatorModalOpen(true);
    } else {
      // Route based on project status - all statuses now go to the same route
      // The ProjectDetailsRouter will handle showing the appropriate layout
      navigate(`/projects/${project.id}?status=${project.status}&title=${encodeURIComponent(project.title)}`);
    }
  };

  const handleAssignCoordinator = (projectId: string, coordinatorId: string) => {
    console.log(`Assigning coordinator ${coordinatorId} to project ${projectId}`);
    // Here you would typically make an API call to assign the coordinator
    // In a real app, you would update the project data with coordinator information
    // and store it in state or make an API call to persist the assignment
  };

  const handleCloseCoordinatorModal = () => {
    setIsCoordinatorModalOpen(false);
    setProjectForCoordinatorAssignment(null);
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
      <div className="w-full py-0">
        {/* First Row - Page Heading and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 px-2">
          {/* Left side - Title and count */}
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">
              {isExecutive ? 'Project Management' : 'Projects'}
            </h1>
            <p className="text-base text-gray-500">
              {projectListItems.length} Projects
              {isExecutive && executiveAnalytics && (
                <span className="ml-2 text-sm text-green-600">
                  • {executiveAnalytics.completionRate.toFixed(1)}% Completion Rate
                </span>
              )}
            </p>
          </div>
          
          {/* Right side - Search and View Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* Executive Controls */}
            {isExecutive && (
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={BarChart3}
                  onClick={() => setShowExecutiveAnalytics(!showExecutiveAnalytics)}
                >
                  Analytics
                </Button>
              </div>
            )}

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

            {/* Create Project Button for Executives */}
            {isExecutive && hasPermission('projects', 'manage') && (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => console.log('Create new project')}
              >
                Create Project
              </Button>
            )}

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
        <div className="mb-4 px-2">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {['All', ...(user?.userType ? getAvailableProjectStatuses(user.userType) : ['PV75', 'PV90', 'UB', 'WB', 'WIP', 'QF', 'Completed'])].map((status) => (
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

        {/* Executive Analytics Panel */}
        {isExecutive && showExecutiveAnalytics && executiveAnalytics && (
          <div className="mb-6 px-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Project Analytics</h3>
                <button
                  onClick={() => setShowExecutiveAnalytics(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Projects */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{executiveAnalytics.totalProjects}</div>
                  <div className="text-sm text-gray-600">Total Projects</div>
                </div>
                
                {/* Active Projects */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{executiveAnalytics.activeProjects}</div>
                  <div className="text-sm text-gray-600">Active Projects</div>
                </div>
                
                {/* Completion Rate */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{executiveAnalytics.completionRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Completion Rate</div>
                </div>
                
                {/* Average Progress */}
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{executiveAnalytics.averageProgress.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Avg Progress</div>
                </div>
              </div>
              
              {/* Projects by Status Breakdown */}
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Projects by Status</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(executiveAnalytics.projectsByStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{status}</span>
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Project Views */}
        {viewMode.type === 'list' ? (
          <ProjectListView
            projects={filteredAndSortedProjects}
            onProjectClick={handleProjectClick}
          />
        ) : viewMode.type === 'table' && !isMobile ? (
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

      {/* Project Coordinator Assignment Modal */}
      <ProjectCoordinatorModal
        isOpen={isCoordinatorModalOpen}
        onClose={handleCloseCoordinatorModal}
        project={projectForCoordinatorAssignment}
        onAssignCoordinator={handleAssignCoordinator}
      />
      </div>
    </div>
  );
};
