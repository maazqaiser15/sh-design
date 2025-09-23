import React from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { Card } from "../../common/components/Card";
import { Button } from "../../common/components/Button";
import { StatusBadge } from "../../common/components/StatusBadge";
import { TeamMember, MOCK_TEAM_MEMBERS } from "../../features/project/types/teamMembers";

/**
 * Team Member Detail page component
 * Shows detailed information about a specific team member
 */
export const TeamMemberDetail: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();

  const member = MOCK_TEAM_MEMBERS.find((m) => m.id === memberId);

  if (!member) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate("/team")}
          >
            Back to Team
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <Briefcase size={16} className="text-blue-600" />;
      case "status_change":
        return <Clock size={16} className="text-amber-600" />;
      case "project_update":
        return <Activity size={16} className="text-green-600" />;
      default:
        return <Activity size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="secondary"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate("/team")}
        >
          Back to Team
        </Button>
        <div>
          <h1 className="text-h1 font-semibold text-text-primary">
            Team Member Details
          </h1>
          <p className="text-body text-text-secondary mt-1">
            View detailed information and activity for {member.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="text-center">
                <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-semibold mx-auto mb-4">
                  {member.avatar}
                </div>
                <h2 className="text-h2 font-semibold text-text-primary">
                  {member.name}
                </h2>
                <p className="text-body text-text-secondary mb-3">
                  {member.role}
                </p>
                <StatusBadge status={member.status} />
                {member.status === "Unavailable" && member.unavailableUntil && (
                  <p className="text-caption text-text-muted mt-2">
                    Unavailable until {member.unavailableUntil}
                  </p>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-body font-semibold text-text-primary">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail size={16} className="text-text-muted" />
                    <span className="text-body text-text-secondary">
                      {member.email}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={16} className="text-text-muted" />
                    <span className="text-body text-text-secondary">
                      {member.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Experience & Specializations */}
              {member.experience && (
                <div className="space-y-4">
                  <h3 className="text-body font-semibold text-text-primary">
                    Experience
                  </h3>
                  <div className="flex items-center space-x-3">
                    <User size={16} className="text-text-muted" />
                    <span className="text-body text-text-secondary">
                      {member.experience} years
                    </span>
                  </div>
                </div>
              )}

              {member.specializations && member.specializations.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-body font-semibold text-text-primary">
                    Specializations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {member.specializations.map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Projects and Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projects */}
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-semibold text-text-primary">
                  Projects
                </h3>
                <span className="text-caption text-text-muted">
                  {member.projects?.length || 0} active projects
                </span>
              </div>

              {member.projects && member.projects.length > 0 ? (
                <div className="space-y-3">
                  {member.projects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-body font-medium text-text-primary mb-1">
                            {project.name}
                          </h4>
                          <div className="flex items-center space-x-4 text-caption text-text-muted">
                            <span className="flex items-center space-x-1">
                              <Briefcase size={14} />
                              <span>{project.stage}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>{project.timeline}</span>
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-text-muted" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Briefcase size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-body text-text-muted">
                    No active projects assigned
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Activity Log */}
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-h3 font-semibold text-text-primary">
                  Activity Log
                </h3>
                <span className="text-caption text-text-muted">
                  {member.activityLog?.length || 0} activities
                </span>
              </div>

              {member.activityLog && member.activityLog.length > 0 ? (
                <div className="space-y-4">
                  {member.activityLog.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body font-medium text-text-primary">
                          {activity.description}
                        </p>
                        <p className="text-caption text-text-muted mt-1">
                          {new Date(activity.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        {activity.details && (
                          <p className="text-caption text-text-secondary mt-1">
                            {activity.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity size={48} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-body text-text-muted">
                    No recent activity
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
