import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  User,
  Briefcase,
  Clock,
  Activity,
  ChevronRight,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar as CalendarIcon,
  LogOut,
  LogIn,
} from "lucide-react";
import { Card } from "../../common/components/Card";
import { Button } from "../../common/components/Button";
import { StatusBadge } from "../../common/components/StatusBadge";
import { TeamMember, MOCK_TEAM_MEMBERS } from "../../features/project/types/teamMembers";

// Mock data for demonstration
const mockTimeLogs = [
  { id: 1, date: "2025-09-12", timeIn: "9:05 AM", timeOut: "6:30 PM", totalHours: "9h 25m" },
  { id: 2, date: "2025-09-11", timeIn: "8:45 AM", timeOut: "5:15 PM", totalHours: "8h 30m" },
  { id: 3, date: "2025-09-10", timeIn: "9:00 AM", timeOut: "6:00 PM", totalHours: "9h 00m" },
  { id: 4, date: "2025-09-09", timeIn: "8:30 AM", timeOut: "5:45 PM", totalHours: "9h 15m" },
];

const mockProjects = [
  { id: 1, name: "Solar Panel Mall", role: "Crew Leader", startDate: "2025-08-05", endDate: "2025-08-18", status: "Completed" },
  { id: 2, name: "City Mall Tower", role: "Lead Supervisor", startDate: "2025-09-01", endDate: null, status: "WIP" },
  { id: 3, name: "Sunset Villas", role: "Team Member", startDate: "2025-07-15", endDate: "2025-07-28", status: "Completed" },
  { id: 4, name: "Office Complex A", role: "Crew Leader", startDate: "2025-06-01", endDate: "2025-06-15", status: "Completed" },
];

const mockLeaves = [
  { id: 1, type: "Annual Leave", fromDate: "2025-09-20", toDate: "2025-09-25", status: "Approved" },
  { id: 2, type: "Sick Leave", fromDate: "2025-08-15", toDate: "2025-08-16", status: "Approved" },
  { id: 3, type: "Personal Leave", fromDate: "2025-10-10", toDate: "2025-10-12", status: "Pending" },
];

const mockActivityLog = [
  { id: 1, date: "2025-09-14", action: "Updated window size for Project 'City Mall Tower'" },
  { id: 2, date: "2025-09-15", action: "Assigned trailer to Project 'Sunset Villas'" },
  { id: 3, date: "2025-09-13", action: "Completed time log for 2025-09-12" },
  { id: 4, date: "2025-09-12", action: "Started work on Project 'City Mall Tower'" },
  { id: 5, date: "2025-09-11", action: "Updated project status to WIP" },
];

type TabType = 'time-log' | 'projects' | 'leaves' | 'activity-log';

/**
 * Team Member Detail page component
 * Shows detailed information about a specific team member with tabbed navigation
 */
export const TeamMemberDetail: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('time-log');
  const [searchTerm, setSearchTerm] = useState('');

  const member = MOCK_TEAM_MEMBERS.find((m) => m.id === memberId);

  if (!member) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            onClick={() => {
              // For role 3 (execution-team), navigate to dashboard
              // For other roles, navigate to team list
              if (user?.userType === 'execution-team') {
                navigate("/");
              } else {
                navigate("/team");
              }
            }}
          >
            Back
          </Button>
        </div>
        <Card>
          <div className="text-center py-12">
            <h2 className="text-h2 font-semibold text-text-primary mb-2">
              Team Member Not Found
            </h2>
            <p className="text-body text-text-secondary">
              The requested team member could not be found.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Completed': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'WIP': { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'PV90': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      'UB': { color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
      'WB': { color: 'bg-purple-100 text-purple-800', icon: AlertCircle },
      'Approved': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
      'Rejected': { color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Pending'];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const currentProjects = mockProjects.filter(p => p.status === 'WIP');
  const pastProjects = mockProjects.filter(p => p.status !== 'WIP');

  const filteredTimeLogs = mockTimeLogs.filter(log => 
    log.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = mockProjects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeaves = mockLeaves.filter(leave => 
    leave.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    leave.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActivityLog = mockActivityLog.filter(activity => 
    activity.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'time-log' as TabType, label: 'Time Log', icon: Clock },
    { id: 'projects' as TabType, label: 'Projects', icon: Briefcase },
    { id: 'leaves' as TabType, label: 'Leaves', icon: CalendarIcon },
    { id: 'activity-log' as TabType, label: 'Activity Log', icon: Activity },
  ];

  const renderTimeLogTab = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <h3 className="text-lg font-semibold text-gray-900">Daily Time Logs</h3>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {filteredTimeLogs.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTimeLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {new Date(log.date).toLocaleDateString('en-US', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.timeIn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.timeOut}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{log.totalHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredTimeLogs.map((log) => (
              <div key={log.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">
                    {new Date(log.date).toLocaleDateString('en-US', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </h4>
                  <span className="text-sm font-medium text-blue-600">{log.totalHours}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Time In:</span> {log.timeIn}
                  </div>
                  <div>
                    <span className="font-medium">Time Out:</span> {log.timeOut}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No time logs available for this user</p>
        </div>
      )}
    </div>
  );

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <h3 className="text-lg font-semibold text-gray-900">Project History</h3>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Current Projects */}
      {currentProjects.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            Current Projects
          </h4>
          <div className="space-y-3">
            {currentProjects.map((project) => (
              <div key={project.id} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">{project.name}</h5>
                    <p className="text-sm text-gray-600">Role: {project.role}</p>
                    <p className="text-sm text-gray-600">
                      Started: {new Date(project.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(project.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Projects */}
      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
          <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
          Past Projects
        </h4>
        {filteredProjects.filter(p => p.status !== 'WIP').length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.filter(p => p.status !== 'WIP').map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(project.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(project.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {filteredProjects.filter(p => p.status !== 'WIP').map((project) => (
                <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 truncate">{project.name}</h4>
                    {getStatusBadge(project.status)}
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Role:</span> {project.role}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">Start:</span> {new Date(project.startDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">End:</span> {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">This user hasn't worked on any projects yet</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderLeavesTab = () => {
    const futureLeaves = mockLeaves.filter(leave => 
      new Date(leave.fromDate) > new Date() && leave.status === 'Approved'
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <h3 className="text-lg font-semibold text-gray-900">Leave History</h3>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search leaves..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Future Leave Banner */}
        {futureLeaves.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800">
                <strong>Upcoming Leave:</strong> This user will be on leave from{' '}
                {new Date(futureLeaves[0].fromDate).toLocaleDateString()} to{' '}
                {new Date(futureLeaves[0].toDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {filteredLeaves.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{leave.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(leave.fromDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(leave.toDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(leave.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {filteredLeaves.map((leave) => (
                <div key={leave.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{leave.type}</h4>
                    {getStatusBadge(leave.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">From:</span> {new Date(leave.fromDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">To:</span> {new Date(leave.toDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No leave records available for this user</p>
          </div>
        )}
      </div>
    );
  };

  const renderActivityLogTab = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <h3 className="text-lg font-semibold text-gray-900">System Activity</h3>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {filteredActivityLog.length > 0 ? (
        <div className="space-y-3">
          {filteredActivityLog.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex-shrink-0 mt-1">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(activity.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No activity records available for this user</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <Button
          variant="secondary"
          size="sm"
          icon={ArrowLeft}
          onClick={() => {
            // For role 3 (execution-team), navigate to dashboard
            // For other roles, navigate to team list
            if (user?.userType === 'execution-team') {
              navigate("/");
            } else {
              navigate("/team");
            }
          }}
          className="w-fit"
        >
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-xl sm:text-h1 font-semibold text-text-primary">
            Team Member Details
          </h1>
          <p className="text-sm sm:text-body text-text-secondary mt-1">
            View detailed information and activity for {member.name}
          </p>
        </div>
      </div>

      {/* User Info Header Card */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-semibold flex-shrink-0">
              {member.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{member.name}</h2>
              <p className="text-base sm:text-lg text-gray-600 mb-2">{member.role}</p>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                <StatusBadge status={member.status} />
                {member.status === "Unavailable" && member.unavailableUntil && (
                  <span className="text-sm text-gray-500">
                    Unavailable till {member.unavailableUntil}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">{member.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-600">{member.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:text-right">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Current Assigned Projects</h3>
            {currentProjects.length > 0 ? (
              <div className="space-y-1">
                {currentProjects.map((project) => (
                  <div key={project.id} className="text-sm text-blue-600 font-medium">
                    {project.name}
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-500">No current project</span>
            )}
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex overflow-x-auto space-x-4 sm:space-x-8 px-1 scrollbar-hide">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 sm:px-1 font-medium text-sm flex items-center space-x-2 border-b-2 transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <Card className="p-4 sm:p-6">
        {activeTab === 'time-log' && renderTimeLogTab()}
        {activeTab === 'projects' && renderProjectsTab()}
        {activeTab === 'leaves' && renderLeavesTab()}
        {activeTab === 'activity-log' && renderActivityLogTab()}
      </Card>
    </div>
  );
};
