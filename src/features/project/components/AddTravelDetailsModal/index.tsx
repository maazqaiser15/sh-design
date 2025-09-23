import React, { useState } from 'react';
import { X, Plus, Trash2, Upload, FileText } from 'lucide-react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';


interface TravelDetails {
  travelFrom: string;
  travelTo: string;
  travelDate: string;
  numberOfTickets: number;
  attachments: File[];
}

interface AddTravelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: TravelDetails) => void;
  travelType: 'road' | 'air';
  numberOfMembers: number;
}

export const AddTravelDetailsModal: React.FC<AddTravelDetailsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  travelType,
  numberOfMembers
}) => {
  const [travelDetails, setTravelDetails] = useState<TravelDetails>({
    travelFrom: '',
    travelTo: '',
    travelDate: '',
    numberOfTickets: numberOfMembers,
    attachments: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTravelDetails(prev => ({
        ...prev,
        numberOfTickets: numberOfMembers,
        attachments: []
      }));
      setErrors({});
    }
  }, [isOpen, numberOfMembers]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!travelDetails.travelFrom.trim()) {
      newErrors.travelFrom = 'Travel from location is required';
    }

    if (!travelDetails.travelTo.trim()) {
      newErrors.travelTo = 'Travel to location is required';
    }

    if (!travelDetails.travelDate) {
      newErrors.travelDate = 'Travel date is required';
    }

    if (travelDetails.numberOfTickets < 1) {
      newErrors.numberOfTickets = 'At least 1 ticket is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(travelDetails);
      onClose();
    }
  };

  const handleInputChange = (field: keyof TravelDetails, value: string | number) => {
    setTravelDetails(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setTravelDetails(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setTravelDetails(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleNumberOfTicketsChange = (value: number) => {
    const newNumberOfTickets = Math.max(1, Math.min(50, value));
    setTravelDetails(prev => ({
      ...prev,
      numberOfTickets: newNumberOfTickets
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Travel Details - {travelType === 'air' ? 'Air Travel' : 'Road Travel'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Travel Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="travelFrom" className="block text-sm font-medium text-gray-700 mb-1">
                Travel From *
              </label>
              <input
                type="text"
                id="travelFrom"
                value={travelDetails.travelFrom}
                onChange={(e) => handleInputChange('travelFrom', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.travelFrom ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter departure location"
              />
              {errors.travelFrom && (
                <p className="mt-1 text-sm text-red-600">{errors.travelFrom}</p>
              )}
            </div>

            <div>
              <label htmlFor="travelTo" className="block text-sm font-medium text-gray-700 mb-1">
                Travel To *
              </label>
              <input
                type="text"
                id="travelTo"
                value={travelDetails.travelTo}
                onChange={(e) => handleInputChange('travelTo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.travelTo ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter destination location"
              />
              {errors.travelTo && (
                <p className="mt-1 text-sm text-red-600">{errors.travelTo}</p>
              )}
            </div>
          </div>

          {/* Travel Date and Number of Tickets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="travelDate" className="block text-sm font-medium text-gray-700 mb-1">
                Travel Date *
              </label>
              <input
                type="date"
                id="travelDate"
                value={travelDetails.travelDate}
                onChange={(e) => handleInputChange('travelDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.travelDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.travelDate && (
                <p className="mt-1 text-sm text-red-600">{errors.travelDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="numberOfTickets" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Tickets *
              </label>
              <input
                type="number"
                id="numberOfTickets"
                min="1"
                max="50"
                value={travelDetails.numberOfTickets}
                onChange={(e) => handleNumberOfTicketsChange(parseInt(e.target.value) || 1)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.numberOfTickets ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.numberOfTickets && (
                <p className="mt-1 text-sm text-red-600">{errors.numberOfTickets}</p>
              )}
            </div>
          </div>

          {/* File Upload Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Travel Documents</h3>
            
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Click to upload
                  </span>
                  <span> or drag and drop</span>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX, PNG, JPG up to 10MB each
                </p>
              </label>
            </div>

            {/* Uploaded Files List */}
            {travelDetails.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                {travelDetails.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveAttachment(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
          >
            Save Travel Details
          </Button>
        </div>
      </div>
    </Modal>
  );
};
