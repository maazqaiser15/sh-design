import React from "react";
import {
  FolderOpen,
  Users,
  CheckSquare,
  Truck,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Card } from "../../common/components/Card";
import { Button } from "../../common/components/Button";
import { DashboardStats, Activity } from "../../types";

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
 */
export const Dashboard: React.FC = () => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-text-primary">Dashboard</h1>
          <p className="text-body text-text-secondary mt-1">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" size="sm">
            View Reports
          </Button>
          <Button variant="primary" size="sm" icon={Plus}>
            Create Project
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
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FolderOpen size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-body font-medium text-text-primary">
                    Create Project
                  </p>
                  <p className="text-caption text-text-muted">
                    Start a new project
                  </p>
                </div>
              </div>
              <ArrowRight size={16} className="text-text-muted" />
            </button>

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
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h3 font-medium text-text-primary">
              Recent Activity
            </h2>
            <Button variant="ghost" size="sm">
              View All
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
