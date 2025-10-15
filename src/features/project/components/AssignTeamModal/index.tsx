import React, { useState, useMemo } from 'react';
import { Search, X, Calendar, MapPin, Phone, User } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Modal } from '../../../../common/components/Modal';
import { TeamMember, TeamRole, TeamMemberStatus } from '../../types/teamMembers';
import { ProjectDetails } from '../../types/projectDetails';

interface AssignTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignTeam: (selectedMembers: TeamMember[]) => void;
  availableMembers: TeamMember[];
  assignedMemberIds?: string[];
  projectDetails?: ProjectDetails;
}

/**
 * AssignTeamModal - Modal for assigning team members to a project
 * Prioritizes clarity, efficiency, and accuracy in selecting crew members
 */
export const AssignTeamModal: React.FC<AssignTeamModalProps> = ({
  isOpen,
  onClose,
  onAssignTeam,
  availableMembers,
  assignedMemberIds = [],
  projectDetails
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<TeamRole | ''>('');
  const [statusFilter, setStatusFilter] = useState<TeamMemberStatus | ''>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(assignedMemberIds);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Get unique locations from available members
  const availableLocations = useMemo(() => {
    const locations = availableMembers
      .map(member => member.location)
      .filter((location, index, self) => self.indexOf(location) === index && location)
      .sort();
    return locations;
  }, [availableMembers]);

  // Filter members based on search and filters
  const filteredMembers = useMemo(() => {
    return availableMembers.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           member.phone?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = !roleFilter || member.role === roleFilter;
      const matchesStatus = !statusFilter || member.status === statusFilter;
      const matchesLocation = !locationFilter || member.location === locationFilter;
      
      return matchesSearch && matchesRole && matchesStatus && matchesLocation;
    });
  }, [availableMembers, searchQuery, roleFilter, statusFilter, locationFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  const handleMemberToggle = (memberId: string) => {
    const member = availableMembers.find(m => m.id === memberId);
    if (member && member.status === 'Available') {
      setSelectedMembers(prev => 
        prev.includes(memberId)
          ? prev.filter(id => id !== memberId)
          : [...prev, memberId]
      );
    }
  };

  const handleRemoveSelection = (memberId: string) => {
    setSelectedMembers(prev => prev.filter(id => id !== memberId));
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
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const selectedCount = selectedMembers.length;
  const filteredCount = filteredMembers.length;
  const selectedMembersData = availableMembers.filter(member => selectedMembers.includes(member.id));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Team Members"
      size="xl"
    >
      <div className="p-6 max-h-[80vh] flex flex-col">
        {/* Project Duration Card */}
        {projectDetails && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-medium text-blue-900">Project Duration</h3>
              <span className="text-sm text-blue-800">
                <span className="font-medium">{formatDate(projectDetails.startDate)}</span>
                <span className="mx-2">→</span>
                <span className="font-medium">{formatDate(projectDetails.endDate)}</span>
              </span>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex space-x-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, phone, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as TeamRole | '')}
            className="px-3 py-2 pr-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
          >
            <option value="">All Roles</option>
            <option value="Lead Supervisor">Lead Supervisor</option>
            <option value="Crew Leader">Crew Leader</option>
            <option value="Installer">Installer</option>
            <option value="Project Coordinator">Project Coordinator</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TeamMemberStatus | '')}
            className="px-3 py-2 pr-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
          >
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 pr-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
          >
            <option value="">All Locations</option>
            {availableLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Selection Summary */}
        {selectedCount > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">
                Selected Team Members ({selectedCount})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedMembersData.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center space-x-1 bg-gray-100 border border-gray-300 rounded-full px-2 py-1"
                >
                  <span className="text-sm text-gray-900">{member.name}</span>
                  <button
                    onClick={() => handleRemoveSelection(member.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            {filteredCount} members found
          </p>
        </div>

        {/* Team Members Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden flex-1">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    Select
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedMembers.map((member) => {
                  const isUnavailable = member.status === 'Unavailable';
                  const isSelected = selectedMembers.includes(member.id);
                  
                  return (
                    <tr
                      key={member.id}
                      className={`${
                        isUnavailable 
                          ? 'bg-gray-50 opacity-60' 
                          : 'hover:bg-gray-50 cursor-pointer'
                      } ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => !isUnavailable && handleMemberToggle(member.id)}
                      title={isUnavailable ? `Unavailable until ${member.unavailableUntil ? formatDate(member.unavailableUntil) : 'TBD'} — cannot assign.` : ''}
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isUnavailable}
                            onChange={() => !isUnavailable && handleMemberToggle(member.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center">
                          <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center mr-2">
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
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <span className="text-sm text-gray-900">{member.role}</span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center text-sm text-gray-900 whitespace-nowrap">
                          <Phone className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{member.phone || '—'}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-col">
                          <span className={`text-sm font-medium ${
                            member.status === 'Available' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {member.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center text-sm text-gray-900 whitespace-nowrap">
                          <MapPin className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{member.location || '—'}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCount)} of {filteredCount} results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-3 py-1 text-sm text-gray-600">
                {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members available</h3>
            <p className="text-gray-500 mb-4">
              Please adjust filters or check back later.
            </p>
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
            Add Team Members ({selectedCount})
          </Button>
        </div>
      </div>
    </Modal>
  );
};
