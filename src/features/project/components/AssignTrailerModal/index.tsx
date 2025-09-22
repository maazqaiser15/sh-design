import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, CheckCircle, AlertTriangle, Circle, Truck, MapPin, Calendar } from 'lucide-react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { TrailerForAssignment, TrailerStatus } from '../../types/trailers';

interface AssignTrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignTrailer: (selectedTrailer: TrailerForAssignment) => void;
  availableTrailers: TrailerForAssignment[];
  assignedTrailerId?: string; // Optional: for pre-selecting trailer in edit mode
}

export const AssignTrailerModal: React.FC<AssignTrailerModalProps> = ({
  isOpen,
  onClose,
  onAssignTrailer,
  availableTrailers,
  assignedTrailerId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<TrailerStatus | ''>('');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [selectedTrailer, setSelectedTrailer] = useState<TrailerForAssignment | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset filters and search when modal opens
      setSearchQuery('');
      setFilterStatus('');
      setFilterLocation('');
      // Pre-select trailer if assignedTrailerId is provided
      if (assignedTrailerId) {
        const preSelected = availableTrailers.find(trailer => trailer.id === assignedTrailerId);
        setSelectedTrailer(preSelected || null);
      } else {
        setSelectedTrailer(null);
      }
      
      // Debug: Log available trailers
      console.log('Available trailers for assignment:', availableTrailers);
    }
  }, [isOpen, availableTrailers, assignedTrailerId]);

  const filteredTrailers = useMemo(() => {
    let filtered = availableTrailers;

    if (searchQuery) {
      filtered = filtered.filter(trailer =>
        trailer.trailerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trailer.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(trailer => trailer.status === filterStatus);
    }

    if (filterLocation) {
      filtered = filtered.filter(trailer => 
        trailer.homeLocation.toLowerCase().includes(filterLocation.toLowerCase()) ||
        trailer.currentLocation.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    return filtered;
  }, [availableTrailers, searchQuery, filterStatus, filterLocation]);

  const handleSelectTrailer = (trailer: TrailerForAssignment) => {
    console.log('Trailer selected:', trailer);
    setSelectedTrailer(trailer);
  };

  const handleAssignClick = () => {
    console.log('Assign button clicked, selectedTrailer:', selectedTrailer);
    if (selectedTrailer) {
      console.log('Calling onAssignTrailer with:', selectedTrailer);
      onAssignTrailer(selectedTrailer);
      onClose();
    } else {
      console.log('No trailer selected');
    }
  };

  const getStatusDisplay = (status: TrailerStatus, unavailableUntil?: string) => {
    switch (status) {
      case 'available': 
        return <span className="text-green-600 flex items-center"><CheckCircle size={14} className="mr-1" /> Available</span>;
      case 'unavailable': 
        return <span className="text-red-600 flex items-center"><X size={14} className="mr-1" /> Unavailable {unavailableUntil ? `until ${new Date(unavailableUntil).toLocaleDateString()}` : ''}</span>;
      case 'in-use': 
        return <span className="text-blue-600 flex items-center"><AlertTriangle size={14} className="mr-1" /> In Use {unavailableUntil ? `until ${new Date(unavailableUntil).toLocaleDateString()}` : ''}</span>;
      case 'maintenance': 
        return <span className="text-amber-600 flex items-center"><AlertTriangle size={14} className="mr-1" /> Maintenance {unavailableUntil ? `until ${new Date(unavailableUntil).toLocaleDateString()}` : ''}</span>;
      default: 
        return <span className="text-gray-600">{status}</span>;
    }
  };

  const getUniqueLocations = () => {
    const locations = new Set<string>();
    availableTrailers.forEach(trailer => {
      locations.add(trailer.homeLocation);
      locations.add(trailer.currentLocation);
    });
    return Array.from(locations).sort();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Trailer"
      size="lg"
    >
      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by trailer name or registration number..."
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

          <select
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TrailerStatus | '')}
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
            <option value="in-use">In Use</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <select
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {getUniqueLocations().map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Trailer List */}
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
          {filteredTrailers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No trailers found matching your criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTrailers.map(trailer => (
                <div
                  key={trailer.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedTrailer?.id === trailer.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => handleSelectTrailer(trailer)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {selectedTrailer?.id === trailer.id ? (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {trailer.trailerName}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {trailer.registrationNumber}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>Home: {trailer.homeLocation}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>Current: {trailer.currentLocation}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm">
                        {getStatusDisplay(trailer.status, trailer.unavailableUntil)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Capacity: {trailer.currentLoad}/{trailer.capacity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssignClick}
            disabled={!selectedTrailer}
          >
            {assignedTrailerId ? 'Update Trailer' : 'Add Trailer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
