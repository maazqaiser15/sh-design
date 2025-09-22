import React, { useState } from "react";
import {
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Card } from "../../common/components/Card";
import { Button } from "../../common/components/Button";
import { StatusBadge } from "../../common/components/StatusBadge";
import { TeamMember } from "../../types";

// Mock team members data
const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    designation: "Project Manager",
    status: "available",
    location: "New York, NY",
    phone: "+1-555-0101",
    email: "sarah@safehavendefense.com",
    avatar: "SJ",
    role: "Project Manager",
    availability: "available",
    currentProjects: ["1", "2"],
    productivity: 92,
  },
  {
    id: "2",
    name: "Mike Chen",
    designation: "Technical Lead",
    status: "busy",
    location: "San Francisco, CA",
    phone: "+1-555-0102",
    email: "mike@safehavendefense.com",
    avatar: "MC",
    role: "Technical Lead",
    availability: "busy",
    currentProjects: ["1", "3", "4"],
    productivity: 88,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    designation: "Designer",
    status: "available",
    location: "Austin, TX",
    phone: "+1-555-0103",
    email: "emily@safehavendefense.com",
    avatar: "ER",
    role: "Designer",
    availability: "available",
    currentProjects: ["2"],
    productivity: 95,
  },
];

/**
 * Team Management page component
 * Shows team members with productivity insights and assignment capabilities
 */
export const Team: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");

  const filteredMembers = mockTeamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAvailability =
      availabilityFilter === "all" ||
      member.availability === availabilityFilter;

    return matchesSearch && matchesAvailability;
  });

  const getProductivityColor = (productivity: number): string => {
    if (productivity >= 90) return "text-green-600 bg-green-50";
    if (productivity >= 80) return "text-blue-600 bg-blue-50";
    return "text-amber-600 bg-amber-50";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-text-primary">
            Team Management
          </h1>
          <p className="text-body text-text-secondary mt-1">
            Manage team members, track productivity, and assign tasks
          </p>
        </div>
        <Button variant="primary" size="sm" icon={UserPlus}>
          Add Team Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-text-muted font-medium">
                Total Members
              </p>
              <p className="text-h2 font-semibold text-text-primary mt-1">
                {mockTeamMembers.length}
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <UserPlus size={24} className="text-primary" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-text-muted font-medium">
                Available
              </p>
              <p className="text-h2 font-semibold text-text-primary mt-1">
                {
                  mockTeamMembers.filter((m) => m.availability === "available")
                    .length
                }
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar size={24} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-text-muted font-medium">Busy</p>
              <p className="text-h2 font-semibold text-text-primary mt-1">
                {
                  mockTeamMembers.filter((m) => m.availability === "busy")
                    .length
                }
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Calendar size={24} className="text-amber-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-caption text-text-muted font-medium">
                Avg Productivity
              </p>
              <p className="text-h2 font-semibold text-text-primary mt-1">
                {Math.round(
                  mockTeamMembers.reduce((sum, m) => sum + m.productivity, 0) /
                    mockTeamMembers.length
                )}
                %
              </p>
            </div>
            <div className="p-3 bg-secondary-teal/10 rounded-lg">
              <BarChart3 size={24} className="text-secondary-teal" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Availability</option>
          <option value="available">Available</option>
          <option value="busy">Busy</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} hover className="cursor-pointer">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-lg font-semibold">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="text-body font-semibold text-text-primary">
                      {member.name}
                    </h3>
                    <p className="text-caption text-text-muted">
                      {member.designation}
                    </p>
                  </div>
                </div>
                <StatusBadge status={member.status} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-caption text-text-secondary">
                  <Mail size={14} />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-caption text-text-secondary">
                  <Phone size={14} />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-caption text-text-secondary">
                  <MapPin size={14} />
                  <span>{member.location}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-caption text-text-muted">
                    Productivity
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getProductivityColor(
                      member.productivity
                    )}`}
                  >
                    {member.productivity}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-caption text-text-muted">
                    Active Projects
                  </span>
                  <span className="text-caption font-medium text-text-primary">
                    {member.currentProjects.length}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  View Profile
                </Button>
                <Button variant="primary" size="sm" className="flex-1">
                  Assign Task
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
