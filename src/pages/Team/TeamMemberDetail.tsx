import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Clock,
  Activity,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar as CalendarIcon,
  Send,
} from "lucide-react";
import { Card } from "../../common/components/Card";
import { Button } from "../../common/components/Button";
import { StatusBadge } from "../../common/components/StatusBadge";
import { MOCK_TEAM_MEMBERS } from "../../features/project/types/teamMembers";
import CustomDataTable from "common/components/CustomDataTable";
import SearchField from "common/components/SearchField";

// Mock data for demonstration
const mockTimeLogs = [
  { id: 1, date: "2025-09-12", timeIn: "9:05 AM", timeOut: "6:30 PM", totalHours: "9h 25m", projectName: "Solar Panel Mall" },
  { id: 2, date: "2025-09-11", timeIn: "8:45 AM", timeOut: "5:15 PM", totalHours: "8h 30m", projectName: "City Mall Tower" },
  { id: 3, date: "2025-09-10", timeIn: "9:00 AM", timeOut: "6:00 PM", totalHours: "9h 00m", projectName: "Solar Panel Mall" },
  { id: 4, date: "2025-09-09", timeIn: "8:30 AM", timeOut: "5:45 PM", totalHours: "9h 15m", projectName: "Sunset Villas" },
  { id: 5, date: "2025-09-08", timeIn: "9:15 AM", timeOut: "6:45 PM", totalHours: "9h 30m", projectName: "Office Complex A" },
  { id: 6, date: "2025-09-07", timeIn: "8:00 AM", timeOut: "5:30 PM", totalHours: "9h 30m", projectName: "City Mall Tower" },
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
  const [timeLogDateFrom, setTimeLogDateFrom] = useState('');
  const [timeLogDateTo, setTimeLogDateTo] = useState('');
  const [leaveDateFrom, setLeaveDateFrom] = useState('');
  const [leaveDateTo, setLeaveDateTo] = useState('');

  const member = MOCK_TEAM_MEMBERS.find((m) => m.id === memberId);

  const handleResendInvite = () => {
    if (member) {
      // In a real application, this would make an API call to resend the invite
      console.log(`Resending invite to ${member.name} (${member.email})`);
      // You could also show a toast notification here
      alert(`Invite resent to ${member.name}!`);
    }
  };

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

  const filteredTimeLogs = mockTimeLogs.filter(log => {
    const logDate = new Date(log.date);
    const fromDate = timeLogDateFrom ? new Date(timeLogDateFrom) : null;
    const toDate = timeLogDateTo ? new Date(timeLogDateTo) : null;

    if (fromDate && toDate) {
      return logDate >= fromDate && logDate <= toDate;
    } else if (fromDate) {
      return logDate >= fromDate;
    } else if (toDate) {
      return logDate <= toDate;
    }
    return true;
  });

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeaves = mockLeaves.filter(leave => {
    const leaveFromDate = new Date(leave.fromDate);
    const leaveToDate = new Date(leave.toDate);
    const fromDate = leaveDateFrom ? new Date(leaveDateFrom) : null;
    const toDate = leaveDateTo ? new Date(leaveDateTo) : null;

    // Check if leave period overlaps with selected date range
    if (fromDate && toDate) {
      return (leaveFromDate >= fromDate && leaveFromDate <= toDate) ||
        (leaveToDate >= fromDate && leaveToDate <= toDate) ||
        (leaveFromDate <= fromDate && leaveToDate >= toDate);
    } else if (fromDate) {
      return leaveToDate >= fromDate;
    } else if (toDate) {
      return leaveFromDate <= toDate;
    }
    return true;
  });

  const filteredActivityLog = mockActivityLog.filter(activity =>
    activity.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'time-log' as TabType, label: 'Time Log', icon: Clock },
    { id: 'projects' as TabType, label: 'Projects', icon: Briefcase },
    { id: 'leaves' as TabType, label: 'Leaves', icon: CalendarIcon },
    { id: 'activity-log' as TabType, label: 'Activity Log', icon: Activity },
  ];

  const timeLogsColumns = [
    {
      name: 'Date',
      selector: (row: any) => row.date,
    },
    {
      name: 'Time In',
      selector: (row: any) => row.timeIn,
    },
    {
      name: '	Time Out',
      selector: (row: any) => row.timeOut,
    },
    {

      name: 'Total Hours',
      selector: (row: any) => row.totalHours,

    },
    {
      name: 'Project Name',
      selector: (row: any) => row.projectName,
    }
  ]

  const projectColumns = [
    {
      name: 'Project Name',
      selector: (row: any) => row.name,
    },
    {
      name: 'Role',
      selector: (row: any) => row.role,
    },
    {
      name: 'Start Date',
      selector: (row: any) => row.startDate,
    },
    {

      name: 'End Date',
      selector: (row: any) => row.endDate,

    },
    {
      name: 'Status',
      selector: (row: any) => row.status,
      cell: (row: any) => <div> {getStatusBadge(row.status)}</div>
    }
  ]

  const leaveColumns = [
    {
      name: 'Leave Type',
      selector: (row: any) => row.type,
    },
    {
      name: 'From Date',
      selector: (row: any) => row.fromDate,
    },
    {
      name: 'To Date',
      selector: (row: any) => row.toDate,
    },
    {
      name: 'Status',
      selector: (row: any) => row.status,
      cell: (row: any) => <div> {getStatusBadge(row.status)}</div>
    }
  ]
  const renderTimeLogTab = () => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <h3 className="text-lg font-semibold text-gray-900">Daily Time Logs</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                placeholder="From date"
                value={timeLogDateFrom}
                onChange={(e) => setTimeLogDateFrom(e.target.value)}
                className="w-full sm:w-40 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <span className="text-gray-500">to</span>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                placeholder="To date"
                value={timeLogDateTo}
                onChange={(e) => setTimeLogDateTo(e.target.value)}
                className="w-full sm:w-40 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {(timeLogDateFrom || timeLogDateTo) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setTimeLogDateFrom('');
                  setTimeLogDateTo('');
                }}
                className="px-3 py-2"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {filteredTimeLogs.length > 0 ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <CustomDataTable title={""} columns={timeLogsColumns} data={filteredTimeLogs} selectableRows={undefined} pagination={false} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={undefined} />
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
          <SearchField iconSize={20} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={"Search projects..."} />
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
              <CustomDataTable title={""} columns={projectColumns} data={filteredProjects} selectableRows={undefined} pagination={false} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={undefined} />
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
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  placeholder="From date"
                  value={leaveDateFrom}
                  onChange={(e) => setLeaveDateFrom(e.target.value)}
                  className="w-full sm:w-40 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <span className="text-gray-500">to</span>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  placeholder="To date"
                  value={leaveDateTo}
                  onChange={(e) => setLeaveDateTo(e.target.value)}
                  className="w-full sm:w-40 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {(leaveDateFrom || leaveDateTo) && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setLeaveDateFrom('');
                    setLeaveDateTo('');
                  }}
                  className="px-3 py-2"
                >
                  Clear
                </Button>
              )}
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

              <CustomDataTable title={""} columns={leaveColumns} data={filteredLeaves} selectableRows={undefined} pagination={false} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={undefined} />
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
          <SearchField iconSize={20} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={"Search activities..."} />
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
        {/* <Button
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
        </Button> */}

        {/* Resend Invite Button - Show for pending or expired invites */}
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
                {member.inviteStatus === 'pending' && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    Invite Pending
                  </span>
                )}
                {member.inviteStatus === 'expired' && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    Invite Expired
                  </span>
                )}
                {member.inviteStatus === 'accepted' && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Invite Accepted
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

          <div className="lg:text-right flex flex-col justify-between items-start h-full">
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
            {member && (member.inviteStatus === 'pending' || member.inviteStatus === 'expired') && (
              <Button
                variant="primary"
                size="sm"
                icon={Send}
                onClick={handleResendInvite}
                className="w-fit mt-4"
              >
                Resend Invite
              </Button>
            )}
          </div>
        </div>

      </Card>


      {/* Tab Navigation */}
      <Card>
        <nav className="flex overflow-x-auto sm:space-x-8 mb-2 px-1 scrollbar-hide  space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 sm:px-1 font-medium text-sm flex items-center space-x-2 border-b-2 transition-all duration-200 whitespace-nowrap flex-shrink-0 ${activeTab === tab.id
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


        {/* Tab Content */}

        {activeTab === 'time-log' && renderTimeLogTab()}
        {activeTab === 'projects' && renderProjectsTab()}
        {activeTab === 'leaves' && renderLeavesTab()}
        {activeTab === 'activity-log' && renderActivityLogTab()}
      </Card>
    </div>
  );
};
