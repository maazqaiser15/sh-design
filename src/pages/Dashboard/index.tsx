import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderOpen,
  Users,
  CheckSquare,
  Truck,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  BarChart3,
  Settings,
  FileText,
  Calendar,
  DollarSign,
  AlertTriangle,
  Target,
  Activity as ActivityIcon,
  Shield,
  Zap,
  PieChart,
  TrendingDown,
  Award,
  MapPin,
  Star,
  Timer,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { Card } from "../../common/components/Card";
import { Button } from "../../common/components/Button";
import { DashboardStats, Activity } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { ExecutiveDashboard } from "../../components/DashboardWrapper/ExecutiveDashboard";

// Mock data
const mockStats: DashboardStats = {
  activeProjects: 12,
  stagesInProgress: {
    preparation: 4,
    execution: 6,
    completion: 2,
  },
  pendingTasks: 23,
  teamUtilization: 85,
  availableTrailers: 8,
};

// Role 3 (Execution Team) specific data
const role3UpcomingProjects = [
  {
    id: 'upcoming-1',
    title: 'Downtown Office Complex',
    location: 'New York, NY',
    startDate: '2024-02-15',
    endDate: '2024-02-28',
    status: 'UB',
    priority: 'High',
    assignedTeam: ['John Smith', 'Sarah Johnson'],
    description: 'Security film installation for 25-story office building'
  },
  {
    id: 'upcoming-2',
    title: 'Government Building Renovation',
    location: 'Washington, DC',
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    status: 'UB',
    priority: 'High',
    assignedTeam: ['Mike Wilson', 'David Brown'],
    description: 'High-security film installation with special requirements'
  },
  {
    id: 'upcoming-3',
    title: 'Corporate Headquarters',
    location: 'Chicago, IL',
    startDate: '2024-03-20',
    endDate: '2024-04-05',
    status: 'UB',
    priority: 'Medium',
    assignedTeam: ['Lisa Garcia', 'Maria Rodriguez'],
    description: 'Standard security film installation for corporate office'
  }
];

const role3CurrentAssignment = {
  id: 'current-1',
  title: 'Financial District Tower',
  location: 'San Francisco, CA',
  startDate: '2024-01-20',
  endDate: '2024-02-10',
  status: 'WIP',
  progress: 65,
  assignedTeam: ['John Smith', 'Sarah Johnson', 'Mike Wilson'],
  description: 'Multi-layer security film installation for 30-story tower',
  currentPhase: 'Window Installation',
  nextMilestone: 'Quality Check - Floor 15-20',
  estimatedCompletion: '3 days remaining'
};

// Executive-level analytics data
const executiveAnalytics = {
  // Financial KPIs
  revenue: {
    current: 2450000,
    previous: 2100000,
    growth: 16.7,
    target: 2500000
  },
  profitMargin: {
    current: 23.5,
    previous: 21.2,
    growth: 2.3,
    target: 25.0
  },
  costPerProject: {
    current: 185000,
    previous: 195000,
    improvement: 5.1
  },
  
  // Operational KPIs
  projectCompletionRate: {
    current: 94.2,
    previous: 89.5,
    growth: 4.7,
    target: 95.0
  },
  averageProjectDuration: {
    current: 12.5,
    previous: 14.2,
    improvement: 12.0,
    target: 12.0
  },
  onTimeDelivery: {
    current: 96.8,
    previous: 92.3,
    growth: 4.5,
    target: 98.0
  },
  
  // Team Performance
  teamUtilization: {
    current: 88.5,
    previous: 85.2,
    growth: 3.3,
    target: 90.0
  },
  teamProductivity: {
    current: 92.3,
    previous: 89.1,
    growth: 3.2,
    target: 95.0
  },
  employeeSatisfaction: {
    current: 4.6,
    previous: 4.3,
    growth: 7.0,
    target: 4.8
  },
  
  // Equipment & Resources
  equipmentUtilization: {
    current: 91.2,
    previous: 87.8,
    growth: 3.4,
    target: 93.0
  },
  trailerEfficiency: {
    current: 89.7,
    previous: 86.4,
    growth: 3.3,
    target: 92.0
  },
  inventoryTurnover: {
    current: 8.2,
    previous: 7.5,
    growth: 9.3,
    target: 9.0
  },
  
  // Client & Quality
  clientSatisfaction: {
    current: 4.8,
    previous: 4.6,
    growth: 4.3,
    target: 4.9
  },
  qualityScore: {
    current: 97.2,
    previous: 95.8,
    growth: 1.4,
    target: 98.0
  },
  repeatBusiness: {
    current: 78.5,
    previous: 72.3,
    growth: 6.2,
    target: 80.0
  },
  
  // Risk & Compliance
  safetyIncidents: {
    current: 0,
    previous: 1,
    improvement: 100,
    target: 0
  },
  complianceScore: {
    current: 98.7,
    previous: 97.2,
    growth: 1.5,
    target: 99.0
  },
  riskLevel: 'low',
  budgetUtilization: 78,
  upcomingDeadlines: 5,
  criticalIssues: 2,
  
  // Market & Growth
  marketShare: {
    current: 15.2,
    previous: 13.8,
    growth: 10.1,
    target: 18.0
  },
  newClientAcquisition: {
    current: 12,
    previous: 8,
    growth: 50.0,
    target: 15
  },
  
  // Project Pipeline
  pipelineValue: {
    current: 3200000,
    previous: 2800000,
    growth: 14.3,
    target: 3500000
  },
  conversionRate: {
    current: 68.5,
    previous: 62.3,
    growth: 6.2,
    target: 75.0
  }
};

// Helper functions for metrics
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPercentage = (value: number, decimals: number = 1) => {
  return `${value.toFixed(decimals)}%`;
};

const formatNumber = (value: number, decimals: number = 1) => {
  return value.toFixed(decimals);
};

const getTrendIcon = (growth: number) => {
  if (growth > 0) return <ArrowUpRight className="w-4 h-4 text-green-500" />;
  if (growth < 0) return <ArrowDownRight className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-500" />;
};

const getTrendColor = (growth: number) => {
  if (growth > 0) return 'text-green-600';
  if (growth < 0) return 'text-red-600';
  return 'text-gray-600';
};

const getStatusColor = (current: number, target: number) => {
  if (current >= target) return 'text-green-600';
  if (current >= target * 0.9) return 'text-yellow-600';
  return 'text-red-600';
};

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "project-created",
    title: "New Project Created",
    description: "Summer Festival Setup project has been created",
    timestamp: "2 hours ago",
    user: "Sarah Johnson",
    projectId: "1",
  },
  {
    id: "2",
    type: "team-assigned",
    title: "Team Assigned",
    description: "5 team members assigned to Downtown Event",
    timestamp: "4 hours ago",
    user: "Mike Chen",
    projectId: "2",
  },
  {
    id: "3",
    type: "trailer-assigned",
    title: "Trailer Assignment",
    description: "Trailer Alpha assigned to Corporate Launch",
    timestamp: "6 hours ago",
    user: "Emily Rodriguez",
    projectId: "3",
  },
  {
    id: "4",
    type: "task-completed",
    title: "Task Completed",
    description: "Equipment delivery scheduled for Music Festival",
    timestamp: "1 day ago",
    user: "David Kim",
    projectId: "4",
  },
  {
    id: "5",
    type: "document-uploaded",
    title: "Document Uploaded",
    description: "Site map uploaded for Trade Show Setup",
    timestamp: "2 days ago",
    user: "Lisa Thompson",
    projectId: "5",
  },
];

/**
 * Main dashboard page component
 * Shows overview cards, quick actions, and recent activity feed
 * Enhanced with executive-level analytics and management features
 */
export const Dashboard: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const isExecutive = user?.userType === 'executive';
  const isExecutionTeam = user?.userType === 'execution-team';
  const isLeadSupervisor = user?.userType === 'lead-supervisor';

  // Redirect lead supervisors to projects page as they don't have dashboard access
  React.useEffect(() => {
    if (isLeadSupervisor) {
      navigate('/projects');
    }
  }, [isLeadSupervisor, navigate]);

  // Don't render anything for lead supervisors as they'll be redirected
  if (isLeadSupervisor) {
    return null;
  }

  // Render Executive Dashboard for role 1 (executive)
  if (isExecutive) {
    return <ExecutiveDashboard />;
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project-created":
        return FolderOpen;
      case "team-assigned":
        return Users;
      case "trailer-assigned":
        return Truck;
      case "task-completed":
        return CheckSquare;
      case "document-uploaded":
        return FolderOpen;
      default:
        return Clock;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Role 3 (Execution Team) specific dashboard
  if (isExecutionTeam) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-semibold text-text-primary">
              Welcome John
            </h1>
            <p className="text-body text-text-secondary mt-1">
              Your current assignment and upcoming projects
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Buttons removed for role 3 dashboard */}
          </div>
        </div>

        {/* Current Assignment Section */}
        <Card 
          className="border-l-4 border-l-blue-500 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/projects/role3-project-wip')}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h3 font-medium text-text-primary flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Current Assignment
            </h2>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {role3CurrentAssignment.status}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {role3CurrentAssignment.progress}% Complete
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-2">
                {role3CurrentAssignment.title}
              </h3>
              <p className="text-sm sm:text-base text-text-secondary mb-4">
                {role3CurrentAssignment.description}
              </p>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-text-muted mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-text-secondary truncate">{role3CurrentAssignment.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-text-muted mr-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-text-secondary">
                    {new Date(role3CurrentAssignment.startDate).toLocaleDateString()} - {new Date(role3CurrentAssignment.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-start sm:items-center">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-text-muted mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-sm sm:text-base text-text-secondary">
                    Team: {role3CurrentAssignment.assignedTeam.join(', ')}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm sm:text-base font-medium text-text-primary mb-3">Project Progress</h4>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm text-text-secondary">Overall Progress</span>
                    <span className="text-xs sm:text-sm font-medium text-text-primary">{role3CurrentAssignment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${role3CurrentAssignment.progress}%` }}
                    ></div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </Card>

        {/* Upcoming Projects Section */}
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h2 className="text-h3 font-medium text-text-primary flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Upcoming Projects
            </h2>
            <Button variant="ghost" size="sm" className="self-start sm:self-auto">
              See All
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {role3UpcomingProjects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-sm sm:text-base font-medium text-text-primary truncate">{project.title}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                          project.status === 'UB' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {project.status}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                          project.priority === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.priority}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-text-secondary mb-3 line-clamp-2">{project.description}</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-text-muted">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span>{new Date(project.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        <span>{project.assignedTeam.length} members</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="self-start sm:self-auto">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-text-primary">
            {isExecutive ? 'Executive Dashboard' : 'Project Overview'}
          </h1>
          <p className="text-body text-text-secondary mt-1">
            {isExecutive 
              ? 'Comprehensive overview of operations, performance metrics, and strategic insights.'
              : 'Welcome back! Here\'s what\'s happening with your projects.'
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" size="sm">
            View Reports
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Projects */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-text-muted font-medium">
                Active Projects
              </p>
              <p className="text-h1 font-semibold text-text-primary mt-1">
                {mockStats.activeProjects}
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <FolderOpen size={24} className="text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-caption text-secondary-teal">
            <TrendingUp size={14} className="mr-1" />
            <span>+2 this week</span>
          </div>
        </Card>

        {/* Team Utilization */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-text-muted font-medium">
                Team Utilization
              </p>
              <p className="text-h1 font-semibold text-text-primary mt-1">
                {mockStats.teamUtilization}%
              </p>
            </div>
            <div className="p-3 bg-secondary-teal/10 rounded-lg">
              <Users size={24} className="text-secondary-teal" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-caption text-secondary-teal">
            <TrendingUp size={14} className="mr-1" />
            <span>+5% from last month</span>
          </div>
        </Card>

        {/* Pending Tasks */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-text-muted font-medium">
                Pending Tasks
              </p>
              <p className="text-h1 font-semibold text-text-primary mt-1">
                {mockStats.pendingTasks}
              </p>
            </div>
            <div className="p-3 bg-secondary-amber/10 rounded-lg">
              <CheckSquare size={24} className="text-secondary-amber" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-caption text-red-500">
            <Clock size={14} className="mr-1" />
            <span>3 overdue</span>
          </div>
        </Card>

        {/* Available Trailers */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-text-muted font-medium">
                Available Trailers
              </p>
              <p className="text-h1 font-semibold text-text-primary mt-1">
                {mockStats.availableTrailers}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Truck size={24} className="text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-caption text-text-muted">
            <span>of 12 total trailers</span>
          </div>
        </Card>
      </div>

      {/* Executive Analytics Section - Simplified */}
      {isExecutive && (
        <div className="space-y-6">
          {/* Key Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Revenue */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex items-center text-sm">
                  {getTrendIcon(executiveAnalytics.revenue.growth)}
                  <span className={`ml-1 font-medium ${getTrendColor(executiveAnalytics.revenue.growth)}`}>
                    +{formatPercentage(executiveAnalytics.revenue.growth)}
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(executiveAnalytics.revenue.current)}
              </h3>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </Card>

            {/* Project Completion Rate */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center text-sm">
                  {getTrendIcon(executiveAnalytics.projectCompletionRate.growth)}
                  <span className={`ml-1 font-medium ${getTrendColor(executiveAnalytics.projectCompletionRate.growth)}`}>
                    +{formatPercentage(executiveAnalytics.projectCompletionRate.growth)}
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {formatPercentage(executiveAnalytics.projectCompletionRate.current)}
              </h3>
              <p className="text-sm text-gray-600">Completion Rate</p>
            </Card>

            {/* Team Utilization */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex items-center text-sm">
                  {getTrendIcon(executiveAnalytics.teamUtilization.growth)}
                  <span className={`ml-1 font-medium ${getTrendColor(executiveAnalytics.teamUtilization.growth)}`}>
                    +{formatPercentage(executiveAnalytics.teamUtilization.growth)}
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {formatPercentage(executiveAnalytics.teamUtilization.current)}
              </h3>
              <p className="text-sm text-gray-600">Team Utilization</p>
            </Card>

            {/* Client Satisfaction */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex items-center text-sm">
                  {getTrendIcon(executiveAnalytics.clientSatisfaction.growth)}
                  <span className={`ml-1 font-medium ${getTrendColor(executiveAnalytics.clientSatisfaction.growth)}`}>
                    +{formatPercentage(executiveAnalytics.clientSatisfaction.growth)}
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {formatNumber(executiveAnalytics.clientSatisfaction.current, 1)}/5.0
              </h3>
              <p className="text-sm text-gray-600">Client Satisfaction</p>
            </Card>
          </div>

          {/* Project Status Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-blue-600" />
                Project Status Distribution
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">PV75 (Pre-Planning)</span>
                  </div>
                  <span className="text-sm font-medium">8 projects</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-teal-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">PV90 (Planning)</span>
                  </div>
                  <span className="text-sm font-medium">12 projects</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-amber-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Active (WIP)</span>
                  </div>
                  <span className="text-sm font-medium">15 projects</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <span className="text-sm font-medium">23 projects</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Performance Trends
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue Growth</span>
                  <div className="flex items-center">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">+16.7%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Project Completion</span>
                  <div className="flex items-center">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">+4.7%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Team Utilization</span>
                  <div className="flex items-center">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">+3.3%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Client Satisfaction</span>
                  <div className="flex items-center">
                    <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-600">+4.3%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Risk & Alerts Section for Executives */}
      {isExecutive && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Risk Level Card */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 font-medium text-text-primary">
                Risk Assessment
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                executiveAnalytics.riskLevel === 'low' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {executiveAnalytics.riskLevel.toUpperCase()}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-body text-text-secondary">Budget Utilization</span>
                <span className="text-body font-medium">{executiveAnalytics.budgetUtilization}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body text-text-secondary">Upcoming Deadlines</span>
                <span className="text-body font-medium">{executiveAnalytics.upcomingDeadlines}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body text-text-secondary">Critical Issues</span>
                <span className="text-body font-medium text-red-600">{executiveAnalytics.criticalIssues}</span>
              </div>
            </div>
          </Card>

          {/* Performance Metrics Card */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 font-medium text-text-primary">
                Performance Metrics
              </h3>
              <ActivityIcon size={20} className="text-text-muted" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-body text-text-secondary">Team Productivity</span>
                <span className="text-body font-medium">{executiveAnalytics.teamProductivity.current}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body text-text-secondary">Equipment Utilization</span>
                <span className="text-body font-medium">{executiveAnalytics.equipmentUtilization.current}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body text-text-secondary">Project Success Rate</span>
                <span className="text-body font-medium">94%</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions for Executives */}
          <Card>
            <h3 className="text-h3 font-medium text-text-primary mb-4">
              Executive Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-body font-medium text-text-primary">
                      Generate Reports
                    </p>
                    <p className="text-caption text-text-muted">
                      Financial & operational reports
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-text-muted" />
              </button>

              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Settings size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-body font-medium text-text-primary">
                      System Settings
                    </p>
                    <p className="text-caption text-text-muted">
                      Configure system parameters
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-text-muted" />
              </button>

              <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FileText size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-body font-medium text-text-primary">
                      Document Center
                    </p>
                    <p className="text-caption text-text-muted">
                      Manage all documents
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-text-muted" />
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Stages Progress */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 font-medium text-text-primary">
            Project Stages
          </h2>
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-h2 font-semibold text-blue-600">
                {mockStats.stagesInProgress.preparation}
              </span>
            </div>
            <h3 className="text-body font-medium text-text-primary">
              Preparation
            </h3>
            <p className="text-caption text-text-muted">Planning & Setup</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-h2 font-semibold text-amber-600">
                {mockStats.stagesInProgress.execution}
              </span>
            </div>
            <h3 className="text-body font-medium text-text-primary">
              Execution
            </h3>
            <p className="text-caption text-text-muted">Active Projects</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-h2 font-semibold text-green-600">
                {mockStats.stagesInProgress.completion}
              </span>
            </div>
            <h3 className="text-body font-medium text-text-primary">
              Completion
            </h3>
            <p className="text-caption text-text-muted">Finishing Up</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <h2 className="text-h3 font-medium text-text-primary mb-4">
            {isExecutive ? 'Management Actions' : 'Quick Actions'}
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FolderOpen size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-body font-medium text-text-primary">
                    {isExecutive ? 'Manage Projects' : 'View Projects'}
                  </p>
                  <p className="text-caption text-text-muted">
                    {isExecutive ? 'Oversee all project operations' : 'View all projects'}
                  </p>
                </div>
              </div>
              <ArrowRight size={16} className="text-text-muted" />
            </button>

            {isExecutive ? (
              <>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-body font-medium text-text-primary">
                        Analytics Dashboard
                      </p>
                      <p className="text-caption text-text-muted">
                        View detailed performance metrics
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-text-muted" />
                </button>

                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Settings size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-body font-medium text-text-primary">
                        System Configuration
                      </p>
                      <p className="text-caption text-text-muted">
                        Configure system settings
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-text-muted" />
                </button>
              </>
            ) : (
              <>
                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-secondary-teal/10 rounded-lg">
                      <Users size={16} className="text-secondary-teal" />
                    </div>
                    <div>
                      <p className="text-body font-medium text-text-primary">
                        View Team
                      </p>
                      <p className="text-caption text-text-muted">
                        Manage team members
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-text-muted" />
                </button>

                <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-secondary-amber/10 rounded-lg">
                      <Truck size={16} className="text-secondary-amber" />
                    </div>
                    <div>
                      <p className="text-body font-medium text-text-primary">
                        Assign Trailer
                      </p>
                      <p className="text-caption text-text-muted">
                        Allocate equipment
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-text-muted" />
                </button>
              </>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h3 font-medium text-text-primary">
              Recent Activity
            </h2>
            <Button variant="ghost" size="sm">
              See All
            </Button>
          </div>
          <div className="space-y-4">
            {mockActivities.slice(0, 5).map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon size={14} className="text-text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary">
                      {activity.title}
                    </p>
                    <p className="text-caption text-text-muted">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-caption text-text-muted">
                        {activity.user}
                      </span>
                      <span className="text-caption text-text-muted">•</span>
                      <span className="text-caption text-text-muted">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
