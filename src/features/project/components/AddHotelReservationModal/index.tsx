import React, { useState } from 'react';
import { X, Upload, FileText, Trash2 } from 'lucide-react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';

interface HotelReservationDetails {
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfRooms: number;
  reservationSlip?: File;
}

interface AddHotelReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: HotelReservationDetails) => void;
}

export const AddHotelReservationModal: React.FC<AddHotelReservationModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [reservationDetails, setReservationDetails] = useState<HotelReservationDetails>({
    hotelName: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfRooms: 1,
    reservationSlip: undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setReservationDetails({
        hotelName: '',
        checkInDate: '',
        checkOutDate: '',
        numberOfRooms: 1,
        reservationSlip: undefined
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!reservationDetails.hotelName.trim()) {
      newErrors.hotelName = 'Hotel name is required';
    }

    if (!reservationDetails.checkInDate) {
      newErrors.checkInDate = 'Check-in date is required';
    }

    if (!reservationDetails.checkOutDate) {
      newErrors.checkOutDate = 'Check-out date is required';
    }

    if (reservationDetails.checkInDate && reservationDetails.checkOutDate) {
      const checkIn = new Date(reservationDetails.checkInDate);
      const checkOut = new Date(reservationDetails.checkOutDate);
      if (checkOut <= checkIn) {
        newErrors.checkOutDate = 'Check-out date must be after check-in date';
      }
    }

    if (reservationDetails.numberOfRooms < 1) {
      newErrors.numberOfRooms = 'At least 1 room is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(reservationDetails);
      onClose();
    }
  };

  const handleInputChange = (field: keyof HotelReservationDetails, value: string | number) => {
    setReservationDetails(prev => ({
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

  const handleFileUpload = (file: File) => {
    setReservationDetails(prev => ({
      ...prev,
      reservationSlip: file
    }));
  };

  const handleRemoveFile = () => {
    setReservationDetails(prev => ({
      ...prev,
      reservationSlip: undefined
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Hotel Reservation Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Hotel Information and Number of Rooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hotelName" className="block text-sm font-medium text-gray-700 mb-1">
                Hotel Name *
              </label>
              <input
                type="text"
                id="hotelName"
                value={reservationDetails.hotelName}
                onChange={(e) => handleInputChange('hotelName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.hotelName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter hotel name"
              />
              {errors.hotelName && (
                <p className="mt-1 text-sm text-red-600">{errors.hotelName}</p>
              )}
            </div>

            <div>
              <label htmlFor="numberOfRooms" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Rooms *
              </label>
              <input
                type="number"
                id="numberOfRooms"
                min="1"
                max="20"
                value={reservationDetails.numberOfRooms}
                onChange={(e) => handleInputChange('numberOfRooms', parseInt(e.target.value) || 1)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.numberOfRooms ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.numberOfRooms && (
                <p className="mt-1 text-sm text-red-600">{errors.numberOfRooms}</p>
              )}
            </div>
          </div>

          {/* Check-in and Check-out Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date *
              </label>
              <input
                type="date"
                id="checkInDate"
                value={reservationDetails.checkInDate}
                onChange={(e) => handleInputChange('checkInDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.checkInDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.checkInDate && (
                <p className="mt-1 text-sm text-red-600">{errors.checkInDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-1">
                Check-out Date *
              </label>
              <input
                type="date"
                id="checkOutDate"
                value={reservationDetails.checkOutDate}
                onChange={(e) => handleInputChange('checkOutDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.checkOutDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.checkOutDate && (
                <p className="mt-1 text-sm text-red-600">{errors.checkOutDate}</p>
              )}
            </div>
          </div>


          {/* Reservation Slip Upload */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reservation Slip</h3>
            
            {reservationDetails.reservationSlip ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">{reservationDetails.reservationSlip.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(reservationDetails.reservationSlip.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="reservation-slip-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                  }}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <label
                  htmlFor="reservation-slip-upload"
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
                    PDF, DOC, DOCX, PNG, JPG up to 10MB
                  </p>
                </label>
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
            Save Reservation Details
          </Button>
        </div>
      </div>
    </Modal>
  );
};
