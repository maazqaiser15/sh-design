import React, { useState, useMemo } from 'react';
import { Search, X, Check } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Modal } from '../../../../common/components/Modal';
import { TeamMember, TeamRole, TeamMemberStatus } from '../../types/teamMembers';

interface AssignTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignTeam: (selectedMembers: TeamMember[]) => void;
  availableMembers: TeamMember[];
  assignedMemberIds?: string[];
}

/**
 * AssignTeamModal - Modal for assigning team members to a project
 * Includes search, filters, and multi-select functionality
 */
export const AssignTeamModal: React.FC<AssignTeamModalProps> = ({
  isOpen,
  onClose,
  onAssignTeam,
  availableMembers,
  assignedMemberIds = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<TeamRole | ''>('');
  const [statusFilter, setStatusFilter] = useState<TeamMemberStatus | ''>('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(assignedMemberIds);

  // Filter members based on search and filters
  const filteredMembers = useMemo(() => {
    return availableMembers.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           member.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = !roleFilter || member.role === roleFilter;
      const matchesStatus = !statusFilter || member.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [availableMembers, searchQuery, roleFilter, statusFilter]);

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredMembers.map(member => member.id);
    setSelectedMembers(allFilteredIds);
  };

  const handleDeselectAll = () => {
    setSelectedMembers([]);
  };

  const handleAssign = () => {
    const selectedTeamMembers = availableMembers.filter(member => 
      selectedMembers.includes(member.id)
    );
    onAssignTeam(selectedTeamMembers);
    onClose();
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return dateString; // Already in DD/MM/YYYY format
  };

  const selectedCount = selectedMembers.length;
  const filteredCount = filteredMembers.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Team Members"
      size="lg"
    >
      <div className="p-6">
        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as TeamRole | '')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="Lead Supervisor">Lead Supervisor</option>
              <option value="Crew Leader">Crew Leader</option>
              <option value="Installer">Installer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TeamMemberStatus | '')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>

            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
              >
                Select All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeselectAll}
              >
                Deselect All
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            {filteredCount} members found • {selectedCount} selected
          </p>
        </div>

        {/* Team Members Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Efficiency Badge
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedMembers.includes(member.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleMemberToggle(member.id)}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => handleMemberToggle(member.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-medium text-gray-700">
                              {getInitials(member.name)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {member.name}
                          </div>
                          {member.phone && (
                            <div className="text-xs text-gray-500">
                              {member.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900">{member.role}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${
                          member.status === 'Available' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {member.status}
                        </span>
                        {member.availableUntil && (
                          <span className="text-xs text-gray-500">
                            until {formatDate(member.availableUntil)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {member.efficiencyBadge ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {member.efficiencyBadge}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No team members found matching your criteria.</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssign}
            disabled={selectedCount === 0}
          >
            Add Team ({selectedCount})
          </Button>
        </div>
      </div>
    </Modal>
  );
};
