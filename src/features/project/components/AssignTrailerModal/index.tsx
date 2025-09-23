import React, { useState, useMemo } from 'react';
import { Search, X, Check, AlertTriangle, Circle, Truck, MapPin, Package } from 'lucide-react';
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
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(assignedTrailerId || null);

  // Filter trailers based on search and filters
  const filteredTrailers = useMemo(() => {
    return availableTrailers.filter(trailer => {
      const matchesSearch = trailer.trailerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trailer.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trailer.currentLocation.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || trailer.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [availableTrailers, searchQuery, statusFilter]);

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
        <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
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

          <select
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="low_stock">Low Stock</option>
            <option value="unavailable">Unavailable</option>
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
              {filteredTrailers.map(trailer => {
                const isSelectable = isTrailerSelectable(trailer);
                const isSelected = selectedTrailer === trailer.id;
                const inventory = getInventorySummary(trailer);

                return (
                  <div
                    key={trailer.id}
                    className={`p-4 transition-colors ${
                      isSelectable
                        ? 'hover:bg-gray-50 cursor-pointer'
                        : 'bg-gray-50 cursor-not-allowed opacity-60'
                    } ${
                      isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => isSelectable && handleTrailerSelect(trailer.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {isSelectable ? (
                            isSelected ? (
                              <Check className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-300" />
                            )
                          ) : (
                            <X className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className={`text-sm font-medium ${
                              isSelectable ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {trailer.trailerName}
                            </h3>
                            <span className={`text-xs ${
                              isSelectable ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {trailer.registrationNumber}
                            </span>
                          </div>
                          <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span>{trailer.currentLocation}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-sm mb-1">
                          {getStatusDisplay(trailer)}
                        </div>
                        {isSelectable && (
                          <div className="text-xs text-gray-500">
                            <div className="flex items-center space-x-2">
                              <Package className="w-3 h-3" />
                              <span>Film: {inventory.filmSqFt} sq ft</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Inventory Details - Only show for selected trailer */}
                    {isSelected && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <div className="text-xs font-medium text-gray-700 mb-2">Inventory Details</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* Tools */}
                          <div>
                            <div className="text-xs font-medium text-gray-600 mb-1">Tools</div>
                            <div className="space-y-1">
                              {trailer.inventory.tools.map((tool, index) => (
                                <div key={index} className="flex justify-between text-xs">
                                  <span className="text-gray-600">{tool.name}</span>
                                  <span className={`font-medium ${
                                    tool.status === 'good' ? 'text-green-600' :
                                    tool.status === 'low' ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {tool.currentStock}/{tool.threshold}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Film Sheets */}
                          <div>
                            <div className="text-xs font-medium text-gray-600 mb-1">Film Sheets</div>
                            <div className="space-y-1">
                              {trailer.inventory.filmSheets.map((film, index) => (
                                <div key={index} className="flex justify-between text-xs">
                                  <span className="text-gray-600">{film.sheetType}</span>
                                  <span className={`font-medium ${
                                    film.status === 'good' ? 'text-green-600' :
                                    film.status === 'low' ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {film.currentStock} sq ft
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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