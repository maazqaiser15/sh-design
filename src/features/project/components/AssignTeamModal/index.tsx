import React, { useState, useMemo } from 'react';
import { Search, X, Calendar, MapPin, Phone, User } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Modal } from '../../../../common/components/Modal';
import { TeamMember, TeamRole, TeamMemberStatus } from '../../types/teamMembers';
import { ProjectDetails } from '../../types/projectDetails';
import SearchField from 'common/components/SearchField';
import SelectField from 'common/components/SelectField';
import CustomDataTable from 'common/components/CustomDataTable';
import { Card } from 'common/components/Card';
import { getProjectStatusColor, getStatusColor } from '../../utils';

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

  const columns = [
    {
      name: 'Select',
      selector: (row: any) => '',
      cell: (row: any) => {
        const isUnavailable = row.status === 'Unavailable';
        const isSelected = selectedMembers.includes(row.id);
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isSelected}
              disabled={isUnavailable}
              onChange={() => !isUnavailable && handleMemberToggle(row.id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
            />
          </div>
        )
      },
      width: '80px'
    },
    {
      name: 'Name',
      selector: (row: any) => row.name,
    },
    {
      name: 'Role',
      selector: (row: any) => row.role,
    },
    {
      name: ' Phone Number',
      selector: (row: any) => row.phone,
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
      name: 'Location',
      selector: (row: any) => row.name,
      cell: (row: any) => <div>
        <div className="flex items-center text-sm text-gray-900 whitespace-nowrap">
          <MapPin className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" />
          <span className="truncate">{row.location || '—'}</span>
        </div>
      </div>
    },
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Team Members"
      size="xl"
    >
      <div className="max-h-[80vh] flex flex-col">
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
        <div className="flex justify-between space-x-4 mb-6">
          <SearchField iconSize={20} inputClassName='border border-gray-300 w-full pl-4 pr-4 py-2' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={'Search by name...'} />

          <div className='flex space-x-4'>
            <SelectField value={roleFilter} inputClassName={'border border-gray-300'} onChange={(e) => setRoleFilter(e.target.value as TeamRole | '')} placeholder={'All Roles'} options={[{
              value: '', label: 'All Roles'
            },
            {
              value: 'Lead Supervisor', label: 'Lead Supervisor'
            }
              ,
            {
              value: 'Crew Leader', label: 'Crew Leader'
            },
            {
              value: 'Installer', label: 'Installer'
            },
            {
              value: 'Project Coordinator', label: 'Project Coordinator'
            },
            ]} />

            <SelectField value={statusFilter} inputClassName={'border border-gray-300'} onChange={(e) => setStatusFilter(e.target.value as TeamMemberStatus | '')} placeholder={'All Status'} options={[{
              value: '', label: 'All Status'
            },
            {
              value: 'Available', label: 'Available'
            }
              ,
            {
              value: 'Unavailable', label: 'Unavailable'
            }
            ]} />
            <SelectField value={locationFilter} inputClassName={'border border-gray-300'} onChange={(e) => setLocationFilter(e.target.value)} placeholder={'All Locations'} options={availableLocations} />
          </div>
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

        <Card className='max-h-[60vh] overflow-y-auto'>
          <CustomDataTable title={''} columns={columns} data={paginatedMembers} selectableRows={undefined} pagination={false} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={5} />
        </Card>

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
