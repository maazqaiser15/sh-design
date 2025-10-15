import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  Users,
  TrendingUp,
  Search,
  Filter,
  Mail,
  Phone,
  Eye,
  ChevronRight,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Card } from "../../common/components/Card";
import { Button } from "../../common/components/Button";
import { StatusBadge } from "../../common/components/StatusBadge";
import { TeamMember, MOCK_TEAM_MEMBERS } from "../../features/project/types/teamMembers";
import { useAuth } from "../../contexts/AuthContext";
import SearchField from "common/components/SearchField";
import SelectField from "common/components/SelectField";
import CustomDataTable from "common/components/CustomDataTable";
import { getStatusColor } from "src/features/project";

/**
 * Team Management page component
 * Enhanced with executive-level team management capabilities
 */
export const Team: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const isExecutive = user?.userType === 'executive';
  const isLeadSupervisor = user?.userType === 'lead-supervisor';
  const canManageTeam = isExecutive || isLeadSupervisor;
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredMembers = MOCK_TEAM_MEMBERS.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.status.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || member.role === roleFilter;
    const matchesStatus = statusFilter === "all" || member.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Team analytics calculations
  const teamAnalytics = useMemo(() => {
    if (!canManageTeam) return null;

    const totalMembers = MOCK_TEAM_MEMBERS.length;
    const availableMembers = MOCK_TEAM_MEMBERS.filter(m => m.status === 'Available').length;
    const unavailableMembers = MOCK_TEAM_MEMBERS.filter(m => m.status === 'Unavailable').length;
    const utilizationRate = totalMembers > 0 ? (availableMembers / totalMembers) * 100 : 0;

    const membersByRole = MOCK_TEAM_MEMBERS.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const averageExperience = MOCK_TEAM_MEMBERS.reduce((sum, member) =>
      sum + (member.experience || 0), 0) / totalMembers;

    return {
      totalMembers,
      availableMembers,
      unavailableMembers,
      utilizationRate,
      membersByRole,
      averageExperience
    };
  }, [canManageTeam]);

 

  const handleViewMember = (memberId: string) => {
    navigate(`/team/${memberId}`);
  };


  const columns = [
    {
      name: 'Name',
      selector: (row: any) => row.name,
    },
    {
      name: 'Role',
      selector: (row: any) => row.role,
    },
    {
      name: 'Status',
      selector: (row: any) => row.status,
      cell: (row: any) => (
        <div className="flex flex-col space-y-1">
          <span
            className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
              row.status
            )}`}
          >
            {row.status}
          </span>
        </div>
      )
    },
    {
      name: 'Phone',
      selector: (row: any) => row.phone,
    },
    {
      name: 'Email',
      selector: (row: any) => row.email,
    },
    {
      name: 'Actions',
      selector: (row: any) => row.action,
      cell: (row: any) => (
        <Button
          variant="secondary"
          size="sm"
          icon={Eye}
          onClick={() => handleViewMember(row.id)}
        >
          View Details
        </Button>
      )
    },
  ]


  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="rounded-3xl p-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h1 font-semibold text-text-primary">
              {canManageTeam ? 'Team Management' : 'Team Members'}
            </h1>
            <p className="text-body text-text-secondary mt-1">
              {isExecutive
                ? 'Comprehensive team management with analytics and bulk operations'
                : isLeadSupervisor
                  ? 'Team management with project coordination capabilities'
                  : 'View team members and their project assignments'
              }
            </p>
          </div>

          {/* Team Management Controls */}
          {/* {canManageTeam && (
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              size="sm"
              icon={BarChart3}
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              Analytics
            </Button>
          </div>
        )} */}
          {/* Filters & Search */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <SearchField className={""} iconSize={20} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={"Search"} inputClassName={""} />
            </div>

            <SelectField className={""} label={""} value={selectedMembers} onChange={(e) => setSelectedMembers(e.target.value)} placeholder={""} options={[
              { value: "all", label: "All Roles" },
              { value: "Lead Supervisor", label: "Lead Supervisor" },
              { value: "Crew Leader", label: "Crew Leader" },
              { value: "Installer", label: "Installer" },
              { value: "Project Coordinator", label: "Project Coordinator" },
            ]} />
            <SelectField className={""} label={""} value={""} onChange={(e) => setStatusFilter(e.target.value)} placeholder={""} options={[
              { value: "all", label: "All Status" },
              { value: "Available", label: "Available" },
              { value: "Unavailable", label: "Unavailable" }
            ]} />
          </div>
        </div>




        {/* Team Analytics Panel */}
        {/* {canManageTeam && showAnalytics && teamAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{teamAnalytics.totalMembers}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-green-600">{teamAnalytics.availableMembers}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilization Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{teamAnalytics.utilizationRate.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Experience</p>
                  <p className="text-2xl font-bold text-orange-600">{teamAnalytics.averageExperience.toFixed(1)}y</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>
        )} */}


        {/* Team Members Table */}

        <div className="overflow-x-auto mt-4">
          <CustomDataTable title={""} columns={columns} data={filteredMembers} selectableRows={undefined} pagination={true} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={10}
          />
        </div>
      </Card>
    </div>
  );
};
