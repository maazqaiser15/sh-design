import React, { useState, useMemo } from 'react';
import { Search, X, Check, AlertTriangle, Circle, Truck, MapPin, Package, Filter, Calendar, Wrench } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Modal } from '../../../../common/components/Modal';
import { TrailerForAssignment } from '../../types/trailers';

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
    const totalFilm = trailer.inventory.filmSheets.reduce((sum, film) => sum + film.currentStock, 0);
    const goodTools = trailer.inventory.tools.filter(tool => tool.status === 'good').length;
    const totalTools = trailer.inventory.tools.length;

    return {
      filmSqFt: totalFilm,
      toolsStatus: goodTools === totalTools ? 'good' : 'needs_attention'
    };
  };

  const isTrailerSelectable = (trailer: TrailerForAssignment) => {
    return trailer.status === 'available';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Assign Trailer to Project"
      size="lg"
    >
      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-4 mb-6">
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by trailer name, registration, or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            className="w-full lg:w-auto px-3 py-2 pr-7 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="low_stock">Low Stock</option>
            <option value="unavailable">Unavailable</option>
          </select>

          {/* Location Filter */}
          <select
            className="w-full lg:w-auto px-3 py-2 pr-7 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            {uniqueLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Trailer List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredTrailers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No trailers found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTrailers.map(trailer => {
                const isSelectable = isTrailerSelectable(trailer);
                const isSelected = selectedTrailer === trailer.id;
                const inventory = getInventorySummary(trailer);

                return (
                  <div
                    key={trailer.id}
                    className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                      isSelectable
                        ? isSelected 
                          ? 'border-blue-500 bg-blue-50 shadow-md cursor-pointer'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm cursor-pointer'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                    }`}
                    onClick={() => isSelectable && handleTrailerSelect(trailer.id)}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Checkbox */}
                      <div className="flex-shrink-0 pt-1">
                        {isSelectable ? (
                          isSelected ? (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                          )
                        ) : (
                          <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                            <X className="w-3 h-3 text-gray-500" />
                          </div>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
                          <Truck className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>

                      {/* Trailer Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            {/* Trailer Name */}
                            <h3 className={`text-base font-semibold mb-1 ${
                              isSelectable ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {trailer.trailerName}
                            </h3>

                            {/* Registration and Location Row */}
                            <div className="flex items-center space-x-4">
                              <p className={`text-sm ${
                                isSelectable ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                {trailer.registrationNumber}
                              </p>
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{trailer.currentLocation}</span>
                              </div>
                            </div>
                          </div>

                          {/* Status Badge - Moved to right */}
                          <div className="flex-shrink-0 ml-4 flex flex-col items-end">
                            {trailer.status === 'available' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Check className="w-3 h-3 mr-1" />
                                Available
                              </span>
                            ) : trailer.status === 'low_stock' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Low Stock
                              </span>
                            ) : (
                              <div className="flex flex-col items-end">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <X className="w-3 h-3 mr-1" />
                                  Unavailable
                                </span>
                                <span className="text-xs text-red-600 mt-1">
                                  until {trailer.unavailableUntil ? new Date(trailer.unavailableUntil).toLocaleDateString() : 'TBD'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
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