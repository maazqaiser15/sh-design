import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { Trailer } from '../../../../types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailer: Trailer | null;
  onConfirmDelete: (trailer: Trailer) => void;
}

/**
 * Confirmation modal for deleting trailers
 * Follows the design specification with clear warning and action buttons
 */
export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  trailer,
  onConfirmDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!trailer) return;

    setIsDeleting(true);
    try {
      await onConfirmDelete(trailer);
      onClose();
    } catch (error) {
      console.error('Error deleting trailer:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!trailer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Trailer?"
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
                This will permanently remove <strong>Trailer {trailer.trailerNumber}</strong> and its records. 
                This action cannot be undone.
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
              <strong>Warning:</strong> If this trailer is currently assigned to any projects, 
              you may need to reassign them to other trailers before deletion.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
          >
            {isDeleting ? 'Deleting...' : 'Delete Trailer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
