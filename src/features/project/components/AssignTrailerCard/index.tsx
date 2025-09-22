import React, { useState } from 'react';
import { Trailer } from '../../../../types';
import { Button } from '../../../../common/components/Button';
import { Modal } from '../../../../common/components/Modal';
import { Card } from '../../../../common/components/Card';

interface AssignTrailerCardProps {
  assignedTrailer: Trailer | null;
  onAssignTrailer: (trailerId: string | null) => void;
  onFilmNotRequired: () => void;
  onUploadShipmentReceipt: (file: File) => void;
}

/**
 * AssignTrailerCard - Card with CTA to assign trailer and manage logistics
 * Opens modal with trailer list showing inventory and film requirements
 */
export const AssignTrailerCard: React.FC<AssignTrailerCardProps> = ({
  assignedTrailer,
  onAssignTrailer,
  onFilmNotRequired,
  onUploadShipmentReceipt
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);
  const [filmRequired, setFilmRequired] = useState(true);
  const [shipmentReceipt, setShipmentReceipt] = useState<File | null>(null);

  // Mock trailers data
  const trailers: Trailer[] = [
    {
      id: 'trailer-001',
      trailerNumber: 'TR-2024-001',
      registrationNumber: 'ABC-123',
      location: 'Warehouse A',
      inventory: {
        tools: [
          { toolName: 'Installation Kit A', currentStock: 5, threshold: 2, status: 'good' },
          { toolName: 'Safety Equipment', currentStock: 3, threshold: 1, status: 'good' }
        ],
        filmSheets: [
          { sheetType: 'BR', currentStock: 5000, threshold: 1000, status: 'good' },
          { sheetType: 'Riot+', currentStock: 3000, threshold: 500, status: 'good' }
        ]
      },
      status: 'available',
      activityLogs: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: 'trailer-002',
      trailerNumber: 'TR-2024-002',
      registrationNumber: 'DEF-456',
      location: 'Warehouse B',
      inventory: {
        tools: [
          { toolName: 'Installation Kit B', currentStock: 2, threshold: 2, status: 'low' },
          { toolName: 'Safety Equipment', currentStock: 1, threshold: 1, status: 'critical' }
        ],
        filmSheets: [
          { sheetType: 'BR', currentStock: 2000, threshold: 1000, status: 'low' },
          { sheetType: 'Riot+', currentStock: 1000, threshold: 500, status: 'low' }
        ]
      },
      status: 'low',
      activityLogs: [],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'available': 'bg-green-100 text-green-800',
      'low': 'bg-yellow-100 text-yellow-800',
      'unavailable': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getInventoryStatus = (trailer: Trailer) => {
    const totalFilm = trailer.inventory.filmSheets.reduce((sum, film) => sum + film.currentStock, 0);
    const toolsStatus = trailer.inventory.tools.every(tool => tool.status === 'good') ? 'good' : 'needs-attention';
    
    return {
      filmSqFt: totalFilm,
      toolsSet: toolsStatus === 'good',
      status: toolsStatus
    };
  };

  const handleAssign = () => {
    onAssignTrailer(selectedTrailer);
    setIsModalOpen(false);
    setSelectedTrailer(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setShipmentReceipt(file);
      onUploadShipmentReceipt(file);
    }
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Assign Trailer & Logistics</h3>
            <p className="text-sm text-gray-600 mt-1">
              Select trailer and manage film requirements
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="whitespace-nowrap"
          >
            Assign Trailer
          </Button>
        </div>

        {/* Assigned Trailer Preview */}
        {assignedTrailer ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {assignedTrailer.trailerNumber}
                </div>
                <div className="text-xs text-gray-500">
                  {assignedTrailer.registrationNumber}
                </div>
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assignedTrailer.status)}`}
              >
                {assignedTrailer.status}
              </span>
            </div>
            
            <div className="text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{assignedTrailer.location}</span>
              </div>
            </div>

            {/* Inventory Summary */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs font-medium text-gray-700 mb-2">Inventory Summary</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Film:</span>
                  <span className="ml-1 font-medium text-gray-900">
                    {getInventoryStatus(assignedTrailer).filmSqFt} sq ft
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tools:</span>
                  <span className={`ml-1 font-medium ${
                    getInventoryStatus(assignedTrailer).toolsSet ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {getInventoryStatus(assignedTrailer).toolsSet ? 'Complete' : 'Needs Attention'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <p className="text-sm">No trailer assigned yet</p>
          </div>
        )}
      </Card>

      {/* Trailer Assignment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign Trailer & Logistics"
        size="lg"
      >
        <div className="space-y-4">
          {/* Film Requirement Toggle */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Film Required?</h4>
                <p className="text-xs text-gray-600 mt-1">
                  Does this project require protective film?
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilmRequired(true)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filmRequired
                      ? 'bg-teal-100 text-teal-800 border border-teal-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setFilmRequired(false)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    !filmRequired
                      ? 'bg-teal-100 text-teal-800 border border-teal-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Trailer List */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Available Trailers</h4>
            <div className="space-y-2">
              {trailers.map((trailer) => {
                const inventory = getInventoryStatus(trailer);
                const isSelected = selectedTrailer === trailer.id;
                
                return (
                  <div
                    key={trailer.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTrailer(trailer.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={isSelected}
                          onChange={() => setSelectedTrailer(trailer.id)}
                          className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {trailer.trailerNumber}
                          </div>
                          <div className="text-xs text-gray-500">
                            {trailer.registrationNumber}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(trailer.status)}`}
                      >
                        {trailer.status}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{trailer.location}</span>
                      </div>
                    </div>

                    {/* Inventory Details */}
                    <div className="bg-white rounded border p-2">
                      <div className="text-xs font-medium text-gray-700 mb-1">Inventory</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Film:</span>
                          <span className="ml-1 font-medium text-gray-900">
                            {inventory.filmSqFt} sq ft
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Tools:</span>
                          <span className={`ml-1 font-medium ${
                            inventory.toolsSet ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {inventory.toolsSet ? 'Complete' : 'Needs Attention'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Film Requirements */}
          {filmRequired && selectedTrailer && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Film Requirements</h4>
              <div className="text-xs text-blue-800">
                <p className="mb-2">Required film quantity: 3,500 sq ft</p>
                <p className="mb-3">Available in selected trailer: 5,000 sq ft</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    onChange={handleFileUpload}
                    className="text-xs"
                  />
                  <span className="text-blue-600">Upload Shipment Receipt</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                onClick={() => onFilmNotRequired()}
                className="text-xs"
              >
                Film Not Required
              </Button>
              {shipmentReceipt && (
                <span className="text-xs text-green-600 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Receipt uploaded
                </span>
              )}
            </div>
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
                disabled={!selectedTrailer}
              >
                Assign Trailer
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
