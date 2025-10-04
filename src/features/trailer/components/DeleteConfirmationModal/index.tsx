import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { Trailer } from '../../../../types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailer: Trailer | null;
  onConfirmArchive: (trailer: Trailer) => void;
}

/**
 * Confirmation modal for archiving trailers
 * Follows the design specification with clear warning and action buttons
 */
export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  trailer,
  onConfirmArchive,
}) => {
  const [isArchiving, setIsArchiving] = useState(false);

  const handleConfirmArchive = async () => {
    if (!trailer) return;

    setIsArchiving(true);
    try {
      await onConfirmArchive(trailer);
      onClose();
    } catch (error) {
      console.error('Error archiving trailer:', error);
    } finally {
      setIsArchiving(false);
    }
  };

  if (!trailer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Archive Trailer?"
      size="sm"
    >
      <div className="space-y-6">
        {/* Warning Icon and Message */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
          </div>
          <div className="flex-1">
            <div className="space-y-2">
              <p className="text-sm text-gray-900">
                This will archive <strong>Trailer {trailer.trailerName}</strong> and move it to archived status. 
                The trailer will no longer be available for new assignments but records will be preserved.
              </p>
              
              {/* Trailer Details */}
              <div className="p-3 bg-gray-50 rounded-lg space-y-1">
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Registration:</span> {trailer.registrationNumber}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Location:</span> {trailer.location}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Inventory Items:</span> {trailer.inventory.length} film types
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Activity Logs:</span> {trailer.activityLogs.length} entries
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Note */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <strong>Note:</strong> If this trailer is currently assigned to any projects, 
              it will remain assigned but marked as archived.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isArchiving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirmArchive}
            disabled={isArchiving}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
          >
            {isArchiving ? 'Archiving...' : 'Archive Trailer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
