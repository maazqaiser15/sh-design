import React, { useState, useMemo } from 'react';
import { Card } from '../../common/components/Card';
import { Button } from '../../common/components/Button';
import { MapCard } from '../../features/trailer/components/MapCard';
import { 
  BarChart3, 
  PieChart, 
  MapPin, 
  TrendingUp, 
  Users, 
  FolderOpen, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  DollarSign,
  Target,
  Activity,
  ArrowRight,
  Eye,
  Calendar,
  Filter,
  ChevronDown
} from 'lucide-react';

// Mock data for executive dashboard
const mockProjects = [
  {
    id: '1',
    name: 'Downtown Office Complex',
    status: 'PV75',
    qualityScore: 95,
    successRate: 98,
    saleEstimate: 250000,
    opsEstimate: 220000,
    warrantyClaims: 0,
    startDate: '2025-09-15',
    endDate: '2025-09-30',
    progress: 25
  },
  {
    id: '2',
    name: 'Residential Community Protection',
    status: 'UB',
    qualityScore: 92,
    successRate: 96,
    saleEstimate: 180000,
    opsEstimate: 165000,
    warrantyClaims: 1,
    startDate: '2025-09-20',
    endDate: '2025-09-25',
    progress: 60
  },
  {
    id: '3',
    name: 'Government Building Security',
    status: 'WIP',
    qualityScore: 88,
    successRate: 94,
    saleEstimate: 320000,
    opsEstimate: 295000,
    warrantyClaims: 0,
    startDate: '2025-08-15',
    endDate: '2025-09-15',
    progress: 75
  },
  {
    id: '4',
    name: 'Corporate Headquarters',
    status: 'QF',
    qualityScore: 97,
    successRate: 99,
    saleEstimate: 195000,
    opsEstimate: 180000,
    warrantyClaims: 0,
    startDate: '2025-07-01',
    endDate: '2025-08-15',
    progress: 90
  },
  {
    id: '5',
    name: 'Industrial Complex Security',
    status: 'Completed',
    qualityScore: 94,
    successRate: 97,
    saleEstimate: 450000,
    opsEstimate: 420000,
    warrantyClaims: 2,
    startDate: '2025-06-01',
    endDate: '2025-07-30',
    progress: 100
  },
  {
    id: '6',
    name: 'Retail Security Upgrade',
    status: 'PV90',
    qualityScore: 90,
    successRate: 95,
    saleEstimate: 120000,
    opsEstimate: 110000,
    warrantyClaims: 0,
    startDate: '2025-10-01',
    endDate: '2025-10-15',
    progress: 10
  }
];

const mockTrailers = [
  {
    id: '1',
    trailerName: 'Alpha Trailer',
    registrationNumber: 'TXDA-SJ1BR1-EETUSC01-P10001',
    parkingAddress: '123 Main Street',
    city: 'Los Angeles',
    state: 'California',
    status: 'available' as const,
    inventory: {
      tools: [],
      filmSheets: []
    },
    activityLogs: [],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: '2',
    trailerName: 'Beta Trailer',
    registrationNumber: 'TXDA-SJ1BR1-EETUSC01-P10002',
    parkingAddress: '456 Industrial Blvd',
    city: 'Houston',
    state: 'Texas',
    status: 'unavailable' as const,
    unavailableUntil: '2024-12-25T00:00:00Z',
    inventory: {
      tools: [],
      filmSheets: []
    },
    activityLogs: [],
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T09:15:00Z'
  },
  {
    id: '3',
    trailerName: 'Gamma Trailer',
    registrationNumber: 'TXDA-SJ1BR1-EETUSC01-P10003',
    parkingAddress: '789 Service Road',
    city: 'Chicago',
    state: 'Illinois',
    status: 'available' as const,
    inventory: {
      tools: [],
      filmSheets: []
    },
    activityLogs: [],
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-13T16:45:00Z'
  },
  {
    id: '4',
    trailerName: 'Delta Trailer',
    registrationNumber: 'TXDA-SJ1BR1-EETUSC01-P10004',
    parkingAddress: '321 Oak Avenue',
    city: 'Miami',
    state: 'Florida',
    status: 'low' as const,
    inventory: {
      tools: [],
      filmSheets: []
    },
    activityLogs: [],
    createdAt: '2024-01-12T08:30:00Z',
    updatedAt: '2024-01-12T08:30:00Z'
  }
];

const mockTeamMembers = [
  { id: '1', name: 'John Smith', status: 'Available', role: 'Lead Supervisor' },
  { id: '2', name: 'Sarah Johnson', status: 'Available', role: 'Crew Leader' },
  { id: '3', name: 'Mike Wilson', status: 'Available', role: 'Installer' },
  { id: '4', name: 'Emily Davis', status: 'Unavailable', role: 'Installer' },
  { id: '5', name: 'David Brown', status: 'Available', role: 'Crew Leader' },
  { id: '6', name: 'Lisa Garcia', status: 'Available', role: 'Installer' },
  { id: '7', name: 'Robert Taylor', status: 'Unavailable', role: 'Lead Supervisor' },
  { id: '8', name: 'Jennifer White', status: 'Available', role: 'Project Coordinator' },
  { id: '9', name: 'David Martinez', status: 'Available', role: 'Installer' },
  { id: '10', name: 'Lisa Anderson', status: 'Available', role: 'Crew Leader' },
  { id: '11', name: 'James Brown', status: 'Unavailable', role: 'Installer' },
  { id: '12', name: 'Maria Garcia', status: 'Available', role: 'Project Coordinator' },
  { id: '13', name: 'Kevin Lee', status: 'Available', role: 'Installer' },
  { id: '14', name: 'Sarah Thompson', status: 'Available', role: 'Lead Supervisor' },
  { id: '15', name: 'Michael Davis', status: 'Unavailable', role: 'Installer' }
];

const actionItems = [
  {
    id: '1',
    title: 'Need to assign project coordinator on this project',
    project: 'Downtown Office Complex',
    priority: 'High',
    dueDate: '2025-09-20',
    type: 'assignment'
  },
  {
    id: '2',
    title: 'This project is delayed from its ending time',
    project: 'Government Building Security',
    priority: 'High',
    dueDate: '2025-09-10',
    type: 'delay'
  },
  {
    id: '3',
    title: 'This project starting date is near need to finalise team allocation',
    project: 'Retail Security Upgrade',
    priority: 'Medium',
    dueDate: '2025-09-25',
    type: 'allocation'
  },
  {
    id: '4',
    title: 'This project starting date is near need to done there travel arrangements',
    project: 'Corporate Headquarters',
    priority: 'Medium',
    dueDate: '2025-09-18',
    type: 'travel'
  },
  {
    id: '5',
    title: 'Quality review required for completed project',
    project: 'Industrial Complex Security',
    priority: 'Low',
    dueDate: '2025-09-30',
    type: 'quality'
  }
];

// Date Range Filter Component
const DateRangeFilter: React.FC<{
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Calendar className="w-4 h-4 text-gray-500" />
      <div className="flex items-center space-x-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

// Project Filter Component
const ProjectFilter: React.FC<{
  selectedProject: string;
  onProjectChange: (project: string) => void;
  projects: Array<{ id: string; name: string }>;
}> = ({ selectedProject, onProjectChange, projects }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-50"
      >
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-gray-700">
          {selectedProject === 'all' ? 'All Projects' : projects.find(p => p.id === selectedProject)?.name || 'Select Project'}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => {
                onProjectChange('all');
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                selectedProject === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              All Projects
            </button>
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  onProjectChange(project.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  selectedProject === project.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                {project.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Stats Widget Component
const StatsWidget: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  trend?: { value: number; isPositive: boolean };
  color?: string;
}> = ({ title, value, subtitle, icon: Icon, trend, color = 'blue' }) => (
  <Card className="p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 bg-${color}-100 rounded-lg`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      {trend && (
        <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp className={`w-4 h-4 mr-1 ${trend.isPositive ? '' : 'rotate-180'}`} />
          <span>{trend.value}%</span>
        </div>
      )}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm text-gray-600">{title}</p>
    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
  </Card>
);

// Project Status Horizontal Bar Chart Component
const ProjectStatusChart: React.FC<{ projects: any[] }> = ({ projects }) => {
  const statusCounts = useMemo(() => {
    const counts = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return [
      { status: 'PV75', count: counts['PV75'] || 0, color: 'bg-blue-500', label: 'Pre-Planning' },
      { status: 'PV90', count: counts['PV90'] || 0, color: 'bg-teal-500', label: 'Planning' },
      { status: 'UB', count: counts['UB'] || 0, color: 'bg-amber-500', label: 'Under Review' },
      { status: 'WIP', count: counts['WIP'] || 0, color: 'bg-purple-500', label: 'Work in Progress' },
      { status: 'QF', count: counts['QF'] || 0, color: 'bg-indigo-500', label: 'Quality Review' },
      { status: 'Completed', count: counts['Completed'] || 0, color: 'bg-green-500', label: 'Completed' }
    ];
  }, [projects]);

  const maxCount = Math.max(...statusCounts.map(s => s.count), 1);

  return (
    <Card className="p-6 h-96 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
        Project Status Distribution
      </h3>
      <div className="flex-1 overflow-y-auto space-y-4">
        {statusCounts.map(({ status, count, color, label }) => (
          <div key={status} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
                <span className="text-sm font-medium text-gray-900">{status}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{count}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div 
                className={`${color} h-3 rounded-full transition-all duration-700 ease-out`}
                style={{ 
                  width: `${(count / maxCount) * 100}%`,
                  minWidth: count > 0 ? '8px' : '0px'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Project Estimates Horizontal Bar Chart Component
const ProjectEstimatesChart: React.FC<{ projects: any[] }> = ({ projects }) => {
  const projectsWithEstimates = projects.filter(p => p.saleEstimate && p.opsEstimate);
  const maxEstimate = Math.max(...projectsWithEstimates.map(p => Math.max(p.saleEstimate, p.opsEstimate)));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
        Project Estimates Comparison
      </h3>
      <div className="space-y-4">
        {projectsWithEstimates.map((project) => (
          <div key={project.id} className="space-y-2">
            <div className="text-sm font-medium text-gray-900">{project.name}</div>
            <div className="space-y-1">
              <div className="flex items-center">
                <div className="w-24 text-xs text-gray-600">Sales Estimate</div>
                <div className="flex-1 mx-2">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-500 h-4 rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium"
                      style={{ width: `${(project.saleEstimate / maxEstimate) * 100}%` }}
                    >
                      {(project.saleEstimate / 100).toFixed(0)} sq ft
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-24 text-xs text-gray-600">Ops Estimate</div>
                <div className="flex-1 mx-2">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-500 h-4 rounded-full flex items-center justify-end pr-2 text-white text-xs font-medium"
                      style={{ width: `${(project.opsEstimate / maxEstimate) * 100}%` }}
                    >
                      {(project.opsEstimate / 100).toFixed(0)} sq ft
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center mt-4 space-x-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Sales Estimate</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span className="text-sm text-gray-600">Ops Estimate</span>
        </div>
      </div>
    </Card>
  );
};


// Team Allocation Pie Chart Component
const TeamAllocationChart: React.FC = () => {
  const teamStats = useMemo(() => {
    const total = mockTeamMembers.length;
    const available = mockTeamMembers.filter(m => m.status === 'Available').length;
    const unavailable = mockTeamMembers.filter(m => m.status === 'Unavailable').length;
    const onLeave = unavailable; // Assuming unavailable means on leave
    
    return {
      total,
      available,
      unavailable,
      onLeave,
      allocated: Math.floor(available * 0.8), // 80% of available are allocated
      unallocated: Math.floor(available * 0.2) // 20% of available are unallocated
    };
  }, []);

  const pieData = [
    { label: 'Allocated', value: teamStats.allocated, color: '#3B82F6', percentage: Math.round((teamStats.allocated / teamStats.total) * 100) },
    { label: 'Unallocated', value: teamStats.unallocated, color: '#8B5CF6', percentage: Math.round((teamStats.unallocated / teamStats.total) * 100) },
    { label: 'On Leave', value: teamStats.onLeave, color: '#F59E0B', percentage: Math.round((teamStats.onLeave / teamStats.total) * 100) }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
        Team Allocation Status
      </h3>
      <div className="flex items-center justify-center mb-8">
        <div className="relative w-40 h-40">
          <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
            {pieData.map((item, index) => {
              const startAngle = pieData.slice(0, index).reduce((sum, d) => sum + (d.value / teamStats.total) * 360, 0);
              const endAngle = startAngle + (item.value / teamStats.total) * 360;
              const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
              
              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              return (
                <path
                  key={item.label}
                  d={pathData}
                  fill={item.color}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{teamStats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {pieData.map((item) => (
          <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div 
                className="w-4 h-4 rounded-full mr-3" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{item.value}</div>
              <div className="text-xs text-gray-500">{item.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Action Items Widget Component
const ActionItemsWidget: React.FC = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return Users;
      case 'delay': return Clock;
      case 'allocation': return Target;
      case 'travel': return MapPin;
      case 'quality': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  return (
    <Card className="p-6 h-96 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-orange-600" />
          Action Items
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3">
        {actionItems.slice(0, 5).map((item) => {
          const Icon = getTypeIcon(item.type);
          return (
            <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="p-2 bg-white rounded-lg">
                <Icon className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-600 mt-1">Project: {item.project}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// Main Executive Dashboard Component
export const ExecutiveDashboard: React.FC = () => {
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-12-31');
  const [selectedProject, setSelectedProject] = useState('all');

  // Filter projects based on selected project
  const filteredProjects = useMemo(() => {
    if (selectedProject === 'all') {
      return mockProjects;
    }
    return mockProjects.filter(p => p.id === selectedProject);
  }, [selectedProject]);

  // Create project options for filter
  const projectOptions = mockProjects.map(p => ({ id: p.id, name: p.name }));

  // Calculate dashboard statistics
  const stats = useMemo(() => {
    const totalProjects = filteredProjects.length;
    const avgQualityScore = filteredProjects.reduce((sum, p) => sum + p.qualityScore, 0) / totalProjects;
    const avgSuccessRate = filteredProjects.reduce((sum, p) => sum + p.successRate, 0) / totalProjects;
    const totalWarrantyClaims = filteredProjects.reduce((sum, p) => sum + p.warrantyClaims, 0);
    const associatedProjects = filteredProjects.filter(p => p.status !== 'Completed').length;

    return {
      totalProjects,
      avgQualityScore: avgQualityScore.toFixed(1),
      avgSuccessRate: avgSuccessRate.toFixed(1),
      totalWarrantyClaims,
      associatedProjects
    };
  }, [filteredProjects]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive overview of operations, performance metrics, and strategic insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <ProjectFilter
            selectedProject={selectedProject}
            onProjectChange={setSelectedProject}
            projects={projectOptions}
          />
        </div>
      </div>

      {/* Top Row: KPI, Project Status, Action Items */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Key Performance Indicators */}
        <Card className="p-6 h-96 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Projects</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalProjects}</p>
                  </div>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+12%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Avg Quality Score of team</p>
                    <p className="text-xl font-bold text-gray-900">{stats.avgQualityScore}%</p>
                  </div>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+3.2%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Projects Success Rate</p>
                    <p className="text-xl font-bold text-gray-900">{stats.avgSuccessRate}%</p>
                  </div>
                </div>
                <div className="flex items-center text-xs text-green-600">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span>+2.1%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Associated Projects</p>
                    <p className="text-xl font-bold text-gray-900">{stats.associatedProjects}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Warranty Claims</p>
                    <p className="text-xl font-bold text-gray-900">{stats.totalWarrantyClaims}</p>
                  </div>
                </div>
                <div className="flex items-center text-xs text-red-600">
                  <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                  <span>-15%</span>
                </div>
              </div>

            </div>
          </div>
        </Card>

        {/* Project Status Distribution */}
        <ProjectStatusChart projects={filteredProjects} />

        {/* Action Items */}
        <ActionItemsWidget />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectEstimatesChart projects={filteredProjects} />
        <TeamAllocationChart />
      </div>

      {/* Map Row */}
      <div className="grid grid-cols-1 gap-6">
        <MapCard 
          trailers={mockTrailers}
          onTrailerClick={(trailer) => console.log('Trailer clicked:', trailer)}
        />
      </div>
    </div>
  );
};
