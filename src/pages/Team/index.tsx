import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Mail,
  Phone,
  Eye,
  ChevronRight,
  BarChart3,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Card } from "../../common/components/Card";
import { Button } from "../../common/components/Button";
import { StatusBadge } from "../../common/components/StatusBadge";
import { TeamMember, MOCK_TEAM_MEMBERS } from "../../features/project/types/teamMembers";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Team Management page component
 * Enhanced with executive-level team management capabilities
 */
export const Team: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const isExecutive = user?.userType === 'executive';
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
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

  // Executive analytics calculations
  const teamAnalytics = useMemo(() => {
    if (!isExecutive) return null;
    
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
  }, [isExecutive]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Available":
        return "text-green-600 bg-green-50";
      case "Unavailable":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const handleViewMember = (memberId: string) => {
    navigate(`/team/${memberId}`);
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers.map(m => m.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on members:`, selectedMembers);
    // Implement bulk actions here
  };

  const handleCreateMember = () => {
    console.log('Create new team member');
    // Implement create member functionality
  };

  const handleExportTeam = () => {
    console.log('Export team data');
    // Implement export functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-text-primary">
            {isExecutive ? 'Team Management' : 'Team Members'}
          </h1>
          <p className="text-body text-text-secondary mt-1">
            {isExecutive 
              ? 'Comprehensive team management with analytics and bulk operations'
              : 'View team members and their project assignments'
            }
          </p>
        </div>
        
        {/* Executive Controls */}
        {isExecutive && (
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
        )}
      </div>


      {/* Filters & Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search by name, role, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 pr-7 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Roles</option>
          <option value="Lead Supervisor">Lead Supervisor</option>
          <option value="Crew Leader">Crew Leader</option>
          <option value="Installer">Installer</option>
          <option value="Project Coordinator">Project Coordinator</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 pr-7 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>
      </div>

      {/* Executive Analytics Panel */}
      {isExecutive && showAnalytics && teamAnalytics && (
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
      )}


      {/* Team Members Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 font-medium text-text-muted">Name</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Role</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Status</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Email</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {member.avatar}
                      </div>
                      <div>
                        <p className="text-body font-medium text-text-primary">
                          {member.name}
                        </p>
                        {member.experience && (
                          <p className="text-caption text-text-muted">
                            {member.experience} years experience
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-body text-text-primary">{member.role}</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col space-y-1">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                          member.status
                        )}`}
                      >
                        {member.status}
                      </span>
                      {member.status === "Unavailable" && member.unavailableUntil && (
                        <span className="text-caption text-text-muted">
                          Until {member.unavailableUntil}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2 text-body text-text-secondary">
                      <Phone size={14} />
                      <span>{member.phone}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2 text-body text-text-secondary">
                      <Mail size={14} />
                      <span>{member.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Eye}
                      onClick={() => handleViewMember(member.id)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
