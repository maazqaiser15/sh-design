import React, { useState, useRef } from 'react';
import { CheckCircle, Upload, FileText, X, Package } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { formatDateMMDDYYYY } from '../../../../utils/dateUtils';

interface FilmRequirement {
  sheetType: string;
  required: number;
  available: number;
  status: 'missing' | 'available' | 'completed';
}

interface ShipmentReceipt {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface LogisticsCardProps {
  filmRequirements: FilmRequirement[];
  assignedTrailer?: any;
  onUploadReceipt: (file: File) => void;
  onRemoveReceipt: (receiptId: string) => void;
  onMarkCompleted: () => void;
  onUpdatePreparationTask?: (taskLabel: string, completed: boolean) => void;
}

/**
 * LogisticsCard - Tracks and manages film shipments for the project
 * Shows required films, trailer availability, and shipment tracking
 */
export const LogisticsCard: React.FC<LogisticsCardProps> = ({
  filmRequirements,
  assignedTrailer,
  onUploadReceipt,
  onRemoveReceipt,
  onMarkCompleted,
  onUpdatePreparationTask
}) => {
  const [shipmentReceipts, setShipmentReceipts] = useState<ShipmentReceipt[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate films in trailer (mock data - in real app this would come from trailer inventory)
  const getTrailerAvailable = (filmType: string) => {
    if (!assignedTrailer) return 0;
    
    // Mock calculation based on trailer inventory
    const trailerInventory = {
      'BR': 15,
      'Riot+': 10,
      'Riot': 8,
      'Riot -': 5,
      'FER': 3,
      'Smash': 2,
      'Tint NI': 1,
      'Tint Incl': 1,
      'Anchoring': 0,
      'Kevlar': 0
    };
    
    return trailerInventory[filmType as keyof typeof trailerInventory] || 0;
  };

  // Calculate films to ship (shortfall)
  const getFilmsToShip = (required: number, trailerAvailable: number) => {
    return Math.max(0, required - trailerAvailable);
  };

  // Check if requirement is met
  const isRequirementMet = (required: number, trailerAvailable: number) => {
    return trailerAvailable >= required || shipmentReceipts.length > 0 || isCompleted;
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    const newReceipt: ShipmentReceipt = {
      id: `receipt-${Date.now()}`,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User'
    };
    
    setShipmentReceipts(prev => [...prev, newReceipt]);
    onUploadReceipt(file);
  };

  // Handle remove receipt
  const handleRemoveReceipt = (receiptId: string) => {
    setShipmentReceipts(prev => prev.filter(receipt => receipt.id !== receiptId));
    onRemoveReceipt(receiptId);
  };

  // Handle mark as completed
  const handleMarkCompleted = () => {
    setIsCompleted(true);
    onMarkCompleted();
    // Also mark Logistics Confirmed preparation task as completed
    if (onUpdatePreparationTask) {
      onUpdatePreparationTask('Logistics Confirmed', true);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <Card className="p-6 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Package className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Logistics</h3>
        </div>
        <div className="text-xs text-gray-500">
          {assignedTrailer ? `${assignedTrailer.trailerName}` : 'No trailer'}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <span className="text-gray-600">
              {filmRequirements.reduce((sum, req) => sum + req.required, 0)} required
            </span>
            <span className="text-gray-600">
              {filmRequirements.reduce((sum, req) => sum + getTrailerAvailable(req.sheetType), 0)} in trailer
            </span>
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 mb-4 pb-2 border-b border-gray-200">
        <div className="col-span-5">
          <h4 className="text-sm font-medium text-gray-700">Required</h4>
        </div>
        <div className="col-span-3">
          <h4 className="text-sm font-medium text-gray-700">In Trailer</h4>
        </div>
        <div className="col-span-4">
          <h4 className="text-sm font-medium text-gray-700">Need to Ship</h4>
        </div>
      </div>

      {/* Film Requirements Rows - Expandable with scroll */}
      <div className="flex-1 flex flex-col">
        <div className="space-y-2">
          {filmRequirements.slice(0, 4).map((requirement) => {
            const trailerAvailable = getTrailerAvailable(requirement.sheetType);
            const filmsToShip = getFilmsToShip(requirement.required, trailerAvailable);

            return (
              <div key={requirement.sheetType} className="grid grid-cols-12 gap-4 items-center py-2">
                {/* Required Films */}
                <div className="col-span-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {requirement.sheetType}
                    </span>
                    <span className="text-xs text-gray-500">
                      {requirement.required} sheets
                    </span>
                  </div>
                </div>

                {/* Films in Trailer */}
                <div className="col-span-3">
                  <span className="text-sm text-gray-600">
                    {trailerAvailable} sheets
                  </span>
                </div>

                {/* Films to Ship */}
                <div className="col-span-4">
                  <span className={`text-sm font-medium ${
                    filmsToShip > 0 ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {filmsToShip} sheets
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {filmRequirements.length > 4 && (
          <div className="text-center py-2">
            <span className="text-xs text-gray-500">
              +{filmRequirements.length - 4} more film types
            </span>
          </div>
        )}
      </div>

      {/* Overall Receipt Section */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="mb-3">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Receipt</h4>
          {shipmentReceipts.length > 0 ? (
            <div className="space-y-2">
              {shipmentReceipts.map((receipt) => (
                <div key={receipt.id} className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-800 truncate">{receipt.fileName}</span>
                    <span className="text-xs text-green-600">
                      ({formatDateMMDDYYYY(receipt.uploadedAt)})
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveReceipt(receipt.id)}
                    className="p-1 h-5 w-5 text-red-500 hover:text-red-700"
                    title="Remove attachment"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-xs">
              No attachments uploaded
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-4">
          {isCompleted ? (
            <div className="flex items-center justify-center p-2 bg-green-100 rounded-lg border border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-xs text-green-800 font-medium">Inventory Completed</span>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Add Attachment
              </Button>
              
              {shipmentReceipts.length > 0 && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleMarkCompleted}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Completed
                </Button>
              )}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

    </Card>
  );
};
