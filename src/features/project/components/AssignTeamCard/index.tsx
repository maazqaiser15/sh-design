import React, { useState } from 'react';
import { TeamMember } from '../../../../types';
import { Button } from '../../../../common/components/Button';
import { Modal } from '../../../../common/components/Modal';
import { Card } from '../../../../common/components/Card';

interface AssignTeamCardProps {
  assignedMembers: TeamMember[];
  onAssignMembers: (memberIds: string[]) => void;
}

/**
 * AssignTeamCard - Card with CTA to assign team members
 * Opens modal with searchable table of available team members
 */
export const AssignTeamCard: React.FC<AssignTeamCardProps> = ({
  assignedMembers,
  onAssignMembers
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [filter, setFilter] = useState<'recommended' | 'all'>('recommended');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock team members data
  const allTeamMembers: TeamMember[] = [
    {
      id: 'member-1',
      name: 'John Smith',
      designation: 'Lead Installer',
      status: 'available',
      location: 'Downtown',
      phone: '+1-555-0123',
      email: 'john@company.com',
      avatar: '/avatars/john.jpg',
      role: 'installer',
      availability: 'available',
      currentProjects: [],
      productivity: 95
    },
    {
      id: 'member-2',
      name: 'Sarah Johnson',
      designation: 'Safety Coordinator',
      status: 'available',
      location: 'Midtown',
      phone: '+1-555-0124',
      email: 'sarah@company.com',
      avatar: '/avatars/sarah.jpg',
      role: 'safety',
      availability: 'available',
      currentProjects: [],
      productivity: 90
    },
    {
      id: 'member-3',
      name: 'Mike Wilson',
      designation: 'Senior Installer',
      status: 'busy',
      location: 'Uptown',
      phone: '+1-555-0125',
      email: 'mike@company.com',
      avatar: '/avatars/mike.jpg',
      role: 'installer',
      availability: 'busy',
      currentProjects: ['proj-002'],
      productivity: 88
    },
    {
      id: 'member-4',
      name: 'Lisa Chen',
      designation: 'Quality Inspector',
      status: 'available',
      location: 'Downtown',
      phone: '+1-555-0126',
      email: 'lisa@company.com',
      avatar: '/avatars/lisa.jpg',
      role: 'quality',
      availability: 'available',
      currentProjects: [],
      productivity: 92
    }
  ];

  const getFilteredMembers = () => {
    let filtered = allTeamMembers;

    // Apply filter
    if (filter === 'recommended') {
      filtered = filtered.filter(member => 
        member.availability === 'available' && 
        member.location === 'Downtown' && 
        member.productivity > 85
      );
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleAssign = () => {
    onAssignMembers(selectedMembers);
    setIsModalOpen(false);
    setSelectedMembers([]);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'available': 'bg-green-100 text-green-800',
      'busy': 'bg-yellow-100 text-yellow-800',
      'unavailable': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getProductivityBadge = (productivity: number) => {
    if (productivity >= 90) return 'Excellent';
    if (productivity >= 80) return 'Efficient';
    if (productivity >= 70) return 'Good';
    return 'Average';
  };

  const getProductivityColor = (productivity: number) => {
    if (productivity >= 90) return 'text-green-600';
    if (productivity >= 80) return 'text-blue-600';
    if (productivity >= 70) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Assign Team</h3>
            <p className="text-sm text-gray-600 mt-1">
              Select team members for this project
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="whitespace-nowrap"
          >
            Assign Team
          </Button>
        </div>

        {/* Assigned Members Preview */}
        {assignedMembers.length > 0 ? (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900">
              Assigned Members ({assignedMembers.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {assignedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      member.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {member.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {member.designation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-sm">No team members assigned yet</p>
          </div>
        )}
      </Card>

      {/* Team Assignment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign Team Members"
        size="lg"
      >
        <div className="space-y-4">
          {/* Filters and Search */}
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('recommended')}
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === 'recommended'
                    ? 'bg-teal-100 text-teal-800 border border-teal-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Recommended
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded-full ${
                  filter === 'all'
                    ? 'bg-teal-100 text-teal-800 border border-teal-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Members
              </button>
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, designation, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Team Members Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-12 px-4 py-3"></th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Designation
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Productivity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredMembers().map((member) => (
                    <tr
                      key={member.id}
                      className={`hover:bg-gray-50 ${
                        selectedMembers.includes(member.id) ? 'bg-teal-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => handleMemberToggle(member.id)}
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              member.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {member.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {member.designation}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(member.availability)}`}
                        >
                          {member.availability}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {member.location}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {member.phone}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium ${getProductivityColor(member.productivity)}`}
                        >
                          {getProductivityBadge(member.productivity)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Count */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {selectedMembers.length} member(s) selected
            </span>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAssign}
                disabled={selectedMembers.length === 0}
              >
                Assign Selected ({selectedMembers.length})
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
