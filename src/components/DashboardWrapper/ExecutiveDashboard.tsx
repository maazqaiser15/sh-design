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
import { ProjectStatusChart } from './ProjectStatusChart';
import { ProjectTypeChart } from './ProjectTypeCharts';
import { TotalTrailersChart } from './TotalTrailersChart';
import { TotalUsersChart } from './TotalUsersChart';

// Mock data for executive dashboard
const mockProjects = [
  {
    id: '1',
    name: 'Downtown Office Complex',
    status: 'D75',
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

const mockAttentions = [
  {
    icon: <Users />,
    title: 'Need to Assign project coordinator on',
    btnText: 'Downtown Office Complex ',

  },
  {
    icon: <Users />,
    title: 'This project is delayed from its ending time',
    btnText: 'Ohio School building',

  },
  {
    icon: <Users />,
    title: 'QC is pending on Project',
    btnText: 'Retail Security Upgrade',

  },
  {
    icon: <Users />,
    title: 'Need to Assign project coordinator on ',
    btnText: 'Corporate Headquarters',
  },
  {
    icon: <Users />,
    title: 'Quality review required for completed project',
    btnText: 'Industrial Complex Security',
  },
  {
    icon: <Users />,
    title: 'Quality review required for completed project',
    btnText: 'Industrial Complex Security',
  },
  {
    icon: <Users />,
    title: 'Quality review required for completed project',
    btnText: 'Industrial Complex Security',
  },

]

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
        className="flex items-center space-x-2 bg-white px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-50"
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
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedProject === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
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
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${selectedProject === project.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
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


// Project Estimates Horizontal Bar Chart Component
const ProjectEstimatesChart: React.FC<{ projects: any[] }> = ({ projects }) => {
  const projectsWithEstimates = projects.filter(p => p.saleEstimate && p.opsEstimate);
  const maxEstimate = Math.max(...projectsWithEstimates.map(p => Math.max(p.saleEstimate, p.opsEstimate)));

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        {/* <BarChart3 className="w-5 h-5 mr-2 text-green-600" /> */}
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive overview of operations, performance metrics, and strategic insights.</p>
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


      <div className='grid grid-cols-3 gap-6'>

        <Card className='flex  flex-col items-start justify-center'>
          <h5 className='text-sm text-[#242424] font-normal '>Active Projects</h5>
          <h6 className='text-lg text-[#242424] font-medium'>40</h6>
        </Card>

        <Card className='flex  flex-col items-start justify-center'>
          <h5 className='text-sm text-[#242424] font-normal'>Labor Efficiency </h5>
          <div className='flex items-center gap-2'>
            <h6 className='text-lg text-[#242424] font-medium mb-0'>38%</h6>
            <div className='text-[#4B5563] text-xs border-r border-gray-300 pr-2'>3,800 Estimated Hrs</div>
            <div className='text-[#4B5563] text-xs '>
              4000 Actual Hrs
            </div>
          </div>
        </Card>

        <Card className='flex  flex-col items-start justify-center'>
          <h5 className='text-sm text-[#242424] font-normal mb-2'>Reinstallation Rate </h5>
          <div className='flex items-center gap-2'>
            <h6 className='text-lg text-[#242424] font-medium border-r border-gray-300 pr-2'>38%</h6>
            <div className='text-[#4B5563] text-xs'>3,800 Sq ft.</div>
          </div>
        </Card>
      </div>
      {/* Top Row: KPI, Project Status, Action Items */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Key Performance Indicators */}


        {/* Project Status Distribution */}
        <ProjectStatusChart projects={filteredProjects} />

        <ProjectTypeChart projects={filteredProjects} />
        <Card className=' row-span-2'>
          <h5 className='text-[#101827] text-lg font-normal mb-4'>Require Attentions</h5>
          <div>
            {mockAttentions.map((attention) => (
              <div key={attention.title} className='flex gap-3 items-center mb-6 border-b pb-4 border-gray-300'>
                <div>
                  <div className='bg-blue-50 text-blue-500 p-2 rounded-lg '>{attention.icon}</div>

                </div>
                <div>
                  <h6 className='text-sm text-[#101827] font-normal mb-2'>{attention.title}</h6>
                  <button className='border-gray-300 border text-xs text-gray-600 bg-gray-100 rounded-md py-1 px-3'>{attention.btnText}</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <TotalTrailersChart projects={filteredProjects} />
        <TotalUsersChart projects={filteredProjects} />
      </div>
    </div>
  );
};
