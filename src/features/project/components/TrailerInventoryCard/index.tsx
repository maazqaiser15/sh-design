import React, { useState, useEffect } from 'react';
import { Truck, Package, CheckCircle, AlertTriangle, X, RefreshCw, Bell } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { Modal } from '../../../../common/components/Modal';
import { TrailerForAssignment, TrailerStatus } from '../../types/trailers';

interface TrailerInventoryCardProps {
  assignedTrailer: TrailerForAssignment | null;
  onAssignTrailer: (trailer: TrailerForAssignment) => void;
  onNotifyHouseManager: (message: string) => void;
  projectFilmRequirements: Array<{
    sheetType: string;
    required: number;
    available: number;
    status: 'sufficient' | 'low' | 'missing';
  }>;
}

interface TrailerAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignTrailer: (trailer: TrailerForAssignment) => void;
}

// Mock trailer data
const MOCK_TRAILERS: TrailerForAssignment[] = [
  {
    id: '1',
    name: 'Trailer Alpha',
    registrationNumber: 'REG-001-2024',
    currentLocation: 'Warehouse A',
    status: 'available',
    inventory: {
      tools: [
        { name: 'CART', currentStock: 6, threshold: 6, status: 'good' },
        { name: 'BEER TANK W/ HOSE', currentStock: 4, threshold: 6, status: 'low' },
        { name: 'HARD PRESS', currentStock: 0, threshold: 6, status: 'critical' }
      ],
      filmSheets: [
        { sheetType: 'BR', currentStock: 50, threshold: 30, status: 'good' },
        { sheetType: 'Riot+', currentStock: 15, threshold: 25, status: 'low' },
        { sheetType: 'Riot', currentStock: 30, threshold: 20, status: 'good' }
      ]
    }
  },
  {
    id: '2',
    name: 'Trailer Beta',
    registrationNumber: 'REG-002-2024',
    currentLocation: 'Warehouse B',
    status: 'unavailable',
    unavailableUntil: '2024-12-25',
    inventory: {
      tools: [
        { name: 'CART', currentStock: 6, threshold: 6, status: 'good' },
        { name: 'BEER TANK W/ HOSE', currentStock: 6, threshold: 6, status: 'good' },
        { name: 'HARD PRESS', currentStock: 6, threshold: 6, status: 'good' }
      ],
      filmSheets: [
        { sheetType: 'BR', currentStock: 100, threshold: 30, status: 'good' },
        { sheetType: 'Riot+', currentStock: 50, threshold: 25, status: 'good' },
        { sheetType: 'Riot', currentStock: 40, threshold: 20, status: 'good' }
      ]
    }
  },
  {
    id: '3',
    name: 'Trailer Gamma',
    registrationNumber: 'REG-003-2024',
    currentLocation: 'Warehouse A',
    status: 'low_stock',
    inventory: {
      tools: [
        { name: 'CART', currentStock: 3, threshold: 6, status: 'low' },
        { name: 'BEER TANK W/ HOSE', currentStock: 6, threshold: 6, status: 'good' },
        { name: 'HARD PRESS', currentStock: 6, threshold: 6, status: 'good' }
      ],
      filmSheets: [
        { sheetType: 'BR', currentStock: 20, threshold: 30, status: 'low' },
        { sheetType: 'Riot+', currentStock: 10, threshold: 25, status: 'low' },
        { sheetType: 'Riot', currentStock: 15, threshold: 20, status: 'low' }
      ]
    }
  },
  {
    id: '4',
    name: 'Trailer Delta',
    registrationNumber: 'REG-004-2024',
    currentLocation: 'Warehouse C',
    status: 'available',
    inventory: {
      tools: [
        { name: 'CART', currentStock: 6, threshold: 6, status: 'good' },
        { name: 'BEER TANK W/ HOSE', currentStock: 6, threshold: 6, status: 'good' },
        { name: 'HARD PRESS', currentStock: 6, threshold: 6, status: 'good' }
      ],
      filmSheets: [
        { sheetType: 'BR', currentStock: 80, threshold: 30, status: 'good' },
        { sheetType: 'Riot+', currentStock: 40, threshold: 25, status: 'good' },
        { sheetType: 'Riot', currentStock: 35, threshold: 20, status: 'good' }
      ]
    }
  },
  {
    id: '5',
    name: 'Trailer Epsilon',
    registrationNumber: 'REG-005-2024',
    currentLocation: 'Warehouse A',
    status: 'available',
    inventory: {
      tools: [
        { name: 'CART', currentStock: 6, threshold: 6, status: 'good' },
        { name: 'BEER TANK W/ HOSE', currentStock: 6, threshold: 6, status: 'good' },
        { name: 'HARD PRESS', currentStock: 6, threshold: 6, status: 'good' }
      ],
      filmSheets: [
        { sheetType: 'BR', currentStock: 60, threshold: 30, status: 'good' },
        { sheetType: 'Riot+', currentStock: 30, threshold: 25, status: 'good' },
        { sheetType: 'Riot', currentStock: 25, threshold: 20, status: 'good' }
      ]
    }
  }
];

const TrailerAssignmentModal: React.FC<TrailerAssignmentModalProps> = ({
  isOpen,
  onClose,
  onAssignTrailer
}) => {
  const [selectedTrailer, setSelectedTrailer] = useState<TrailerForAssignment | null>(null);

  const getStatusDisplay = (trailer: TrailerForAssignment) => {
    switch (trailer.status) {
      case 'available':
        return { text: 'Available', color: 'text-green-600', icon: CheckCircle };
      case 'low_stock':
        return { text: 'Low on Inventory', color: 'text-yellow-600', icon: AlertTriangle };
      case 'unavailable':
        return { 
          text: `Unavailable till ${trailer.unavailableUntil}`, 
          color: 'text-red-600', 
          icon: X 
        };
      default:
        return { text: trailer.status, color: 'text-gray-600', icon: X };
    }
  };

  const isTrailerSelectable = (trailer: TrailerForAssignment) => {
    return trailer.status === 'available' || trailer.status === 'low_stock';
  };

  const handleAssign = () => {
    if (selectedTrailer) {
      onAssignTrailer(selectedTrailer);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Trailer" size="lg">
      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Select a trailer for this project. Unavailable trailers cannot be assigned.
          </p>
        </div>

        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trailer Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {MOCK_TRAILERS.map((trailer) => {
                const statusInfo = getStatusDisplay(trailer);
                const isSelectable = isTrailerSelectable(trailer);
                const isSelected = selectedTrailer?.id === trailer.id;
                const StatusIcon = statusInfo.icon;

                return (
                  <tr
                    key={trailer.id}
                    className={`cursor-pointer transition-colors ${
                      !isSelectable
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isSelected
                          ? 'bg-blue-50 border-l-4 border-blue-500'
                          : 'hover:bg-gray-50'
                    }`}
                    onClick={() => isSelectable && setSelectedTrailer(trailer)}
                  >
                    <td className="px-4 py-3">
                      {isSelectable ? (
                        <div className="flex items-center">
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => setSelectedTrailer(trailer)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                        </div>
                      ) : (
                        <X className="w-4 h-4 text-gray-300" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {trailer.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {trailer.registrationNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center space-x-1 ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-sm">{statusInfo.text}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {trailer.currentLocation}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssign}
            disabled={!selectedTrailer}
          >
            Assign Trailer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const TrailerInventoryCard: React.FC<TrailerInventoryCardProps> = ({
  assignedTrailer,
  onAssignTrailer,
  onNotifyHouseManager,
  projectFilmRequirements
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getStatusColor = (status: TrailerStatus) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50';
      case 'low_stock':
        return 'text-yellow-600 bg-yellow-50';
      case 'unavailable':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (trailer: TrailerForAssignment) => {
    switch (trailer.status) {
      case 'available':
        return 'Available';
      case 'low_stock':
        return 'Low on Inventory';
      case 'unavailable':
        return `Unavailable till ${trailer.unavailableUntil}`;
      default:
        return trailer.status;
    }
  };

  const handleTrailerAssignment = (trailer: TrailerForAssignment) => {
    onAssignTrailer(trailer);
    
    // Show toast notification for low stock trailers
    if (trailer.status === 'low_stock') {
      showToastNotification('House Manager notified to restock trailer inventory.');
      onNotifyHouseManager(`Trailer ${trailer.name} (${trailer.registrationNumber}) needs restocking for project assignment.`);
    }
  };

  const calculateInventoryStatus = () => {
    if (!assignedTrailer) return { sufficient: false, missingItems: [] };

    const missingItems: string[] = [];
    let sufficient = true;

    projectFilmRequirements.forEach(requirement => {
      const trailerFilm = assignedTrailer.inventory.filmSheets.find(
        film => film.sheetType === requirement.sheetType
      );
      
      if (!trailerFilm || trailerFilm.currentStock < requirement.required) {
        sufficient = false;
        missingItems.push(requirement.sheetType);
      }
    });

    return { sufficient, missingItems };
  };

  const { sufficient, missingItems } = calculateInventoryStatus();

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900">Assign Trailer</h3>
          </div>
          {assignedTrailer && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              icon={RefreshCw}
            >
              Change Trailer
            </Button>
          )}
        </div>

        {assignedTrailer ? (
          <div className="space-y-4">
            {/* Trailer Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{assignedTrailer.name}</h4>
                  <p className="text-xs text-gray-500">{assignedTrailer.registrationNumber}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assignedTrailer.status)}`}>
                  {getStatusText(assignedTrailer)}
                </span>
              </div>
              <p className="text-xs text-gray-500">Location: {assignedTrailer.currentLocation}</p>
            </div>

            {/* Project Film Requirements */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Required Films for this Project</h4>
              <div className="space-y-2">
                {projectFilmRequirements.map((film, index) => {
                  const trailerFilm = assignedTrailer.inventory.filmSheets.find(
                    f => f.sheetType === film.sheetType
                  );
                  const available = trailerFilm?.currentStock || 0;
                  const isSufficient = available >= film.required;

                  return (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{film.sheetType}</span>
                        <span className="text-xs text-gray-500">
                          Required: {film.required} | Available: {available}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {isSufficient ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-xs font-medium ${
                          isSufficient ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isSufficient ? 'Sufficient' : 'Insufficient'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200">
              {sufficient ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    showToastNotification('Project inventory marked as completed!');
                    // In a real app, this would update the project status
                  }}
                  className="w-full"
                  icon={CheckCircle}
                >
                  Mark Project Inventory Completed
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    showToastNotification('Reminder sent to House Manager for missing inventory.');
                    onNotifyHouseManager(`Project requires restocking: ${missingItems.join(', ')}`);
                  }}
                  className="w-full"
                  icon={Bell}
                >
                  Send Reminder to Ship Inventory
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-500 mb-4">No trailer assigned yet</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="w-full"
            >
              Assign Trailer
            </Button>
          </div>
        )}
      </Card>

      {/* Trailer Assignment Modal */}
      <TrailerAssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssignTrailer={handleTrailerAssignment}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}
    </>
  );
};
