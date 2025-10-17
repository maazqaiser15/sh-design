import React, { useState, useMemo } from 'react';
import { Search, X, Check, AlertTriangle, Circle, Truck, MapPin, Package, Filter, Calendar, Wrench } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Modal } from '../../../../common/components/Modal';
import { TrailerForAssignment } from '../../types/trailers';
import SearchField from 'common/components/SearchField';
import SelectField from 'common/components/SelectField';
import CustomDataTable from 'common/components/CustomDataTable';
import { formatDate, getStatusColor } from '../../utils';

interface AssignTrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignTrailer: (selectedTrailer: TrailerForAssignment) => void;
  availableTrailers: TrailerForAssignment[];
  assignedTrailerId?: string;
}

/**
 * AssignTrailerModal - Modal for assigning a trailer to a project
 * Includes search, filters, and single-select functionality
 */
export const AssignTrailerModal: React.FC<AssignTrailerModalProps> = ({
  isOpen,
  onClose,
  onAssignTrailer,
  availableTrailers,
  assignedTrailerId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'available' | 'low_stock' | 'unavailable' | ''>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(assignedTrailerId || null);

  // Get unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    const locations = availableTrailers.map(trailer => trailer.currentLocation);
    return [...new Set(locations)].sort();
  }, [availableTrailers]);

  // Filter trailers based on search and filters
  const filteredTrailers = useMemo(() => {
    return availableTrailers.filter(trailer => {
      const matchesSearch = trailer.trailerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trailer.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trailer.currentLocation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || trailer.status === statusFilter;
      const matchesLocation = !locationFilter || trailer.currentLocation === locationFilter;

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [availableTrailers, searchQuery, statusFilter, locationFilter]);

  const handleTrailerSelect = (trailerId: string) => {
    setSelectedTrailer(trailerId);
  };

  const handleAssign = () => {
    const trailer = availableTrailers.find(t => t.id === selectedTrailer);
    if (trailer) {
      onAssignTrailer(trailer);
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
    setSearchQuery('');
    setStatusFilter('');
    setSelectedTrailer(assignedTrailerId || null);
  };

  const getStatusDisplay = (trailer: TrailerForAssignment) => {
    switch (trailer.status) {
      case 'available':
        return (
          <span className="text-green-600 flex items-center">
            <Check size={14} className="mr-1" />
            Available
          </span>
        );
      case 'low_stock':
        return (
          <span className="text-yellow-600 flex items-center">
            <AlertTriangle size={14} className="mr-1" />
            Low Stock
          </span>
        );
      case 'unavailable':
        return (
          <span className="text-red-600 flex items-center">
            <X size={14} className="mr-1" />
            Unavailable until {trailer.unavailableUntil}
          </span>
        );
      default:
        return <span className="text-gray-600">{trailer.status}</span>;
    }
  };

  const getInventorySummary = (trailer: TrailerForAssignment) => {
    const totalFilm = trailer.inventory.filmSheets.reduce((sum, film) => sum + film.available, 0);
    const goodTools = trailer.inventory.tools.filter(tool => tool.available > 0).length;
    const totalTools = trailer.inventory.tools.length;

    return {
      filmSqFt: totalFilm,
      toolsStatus: goodTools === totalTools ? 'good' : 'needs_attention'
    };
  };

  const isTrailerSelectable = (trailer: TrailerForAssignment) => {
    return trailer.status === 'available';
  };


  const columns = [
    {
      name: 'Select',
      selector: (row: any) => '',
      cell: (row: any) => {
        const isUnavailable = row.status === 'unavailable' || row.status === 'low_stock';
        return (
          <div className="flex items-center">
            <input
              type="radio"
              checked={selectedTrailer === row.id}
              disabled={isUnavailable}
              onChange={() => !isUnavailable && handleTrailerSelect(row.id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
            />
          </div>
        )
      },
      width: '80px'
    },
    {
      name: 'Name',
      selector: (row: any) => row.trailerName,
    },
    {
      name: 'Registration',
      selector: (row: any) => row.registrationNumber,
    },
    {
      name: 'Status',
      selector: (row: any) => row.status,
      cell: (row: any) => {
        const isUnavailable = row.status === 'unavailable' || row.status === 'low_stock';
        return (
          <div className="flex flex-col space-y-1">
            <span
              className={`inline-flex w-min px-2 py-0.5 text-xs capitalize font-medium rounded-full ${getStatusColor(
                row.status
              )}`}
            >
              {row.status}
            </span>
            <div> {isUnavailable && <p className='text-[10px] text-red-600'> Unavailable until  {formatDate(row.unavailableUntil) }</p>}</div>
          </div>
        )
      }
    },

    {
      name: 'Location',
      selector: (row: any) => row.currentLocation,
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
      onClose={handleClose}
      title="Assign Trailer to Project"
      size="xl"
    >
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-medium text-blue-900">Project Duration</h3>
          <span className="text-sm text-blue-800">
            <span className="font-medium">{formatDate(filteredTrailers[0].lastMaintenance)}</span>
            <span className="mx-2">→</span>
            <span className="font-medium">{formatDate(filteredTrailers[0].nextMaintenance)}</span>
          </span>
        </div>
      </div>

      <div className="">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-3 lg:space-y-0 lg:space-x-4 mb-6">
          {/* Search Bar */}
          <SearchField iconSize={20} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={'Search by name...'} inputClassName={'border border-gray-300'} />

          <div className='flex items-center gap-4'>
            {/* Status Filter */}
            <SelectField value={statusFilter} inputClassName={'border border-gray-300'} onChange={(e) => setStatusFilter(e.target.value as any)} placeholder={'All Status'} options={[{ value: '', label: 'All Status' }, { value: 'available', label: 'Available' }, { value: 'low_stock', label: 'Low Stock' }, { value: 'unavailable', label: 'Unavailable' }]} />

            {/* Location Filter */}
            <SelectField value={locationFilter} inputClassName={'border border-gray-300'} onChange={(e) => setLocationFilter(e.target.value)} placeholder={'Locations'} options={[uniqueLocations]} />
          </div>
        </div>

        {/* Trailer List */}
        <div className="max-h-96 overflow-y-auto">
          <CustomDataTable title={''} columns={columns} data={filteredTrailers} selectableRows={undefined} pagination={false} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={undefined} />
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssign}
            disabled={!selectedTrailer}
          >
            {assignedTrailerId ? 'Update Trailer' : 'Assign Trailer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};