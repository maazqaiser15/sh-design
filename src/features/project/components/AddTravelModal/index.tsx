import React, { useState, useEffect } from 'react';
import { X, Plane, Users } from 'lucide-react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { TravelPlan, TravelType, AddTravelModalProps } from '../../types/logisticsTravel';

export const AddTravelModal: React.FC<AddTravelModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onEdit,
  editingTravel,
  availableTeamMembers
}) => {
  const [formData, setFormData] = useState({
    travelType: 'Flight' as TravelType,
    departureLocation: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    assignedTeamMembers: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!editingTravel;

  // Reset form when modal opens/closes or editing changes
  useEffect(() => {
    if (isOpen) {
      if (editingTravel) {
        setFormData({
          travelType: editingTravel.travelType,
          departureLocation: editingTravel.departureLocation,
          destination: editingTravel.destination,
          departureDate: editingTravel.departureDate,
          returnDate: editingTravel.returnDate || '',
          assignedTeamMembers: editingTravel.assignedTeamMembers
        });
      } else {
        setFormData({
          travelType: 'Flight',
          departureLocation: '',
          destination: '',
          departureDate: '',
          returnDate: '',
          assignedTeamMembers: []
        });
      }
      setErrors({});
    }
  }, [isOpen, editingTravel]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.departureLocation.trim()) {
      newErrors.departureLocation = 'Departure location is required';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (!formData.departureDate) {
      newErrors.departureDate = 'Departure date is required';
    }

    if (formData.assignedTeamMembers.length === 0) {
      newErrors.assignedTeamMembers = 'At least one team member must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const travelData = {
      ...formData,
      returnDate: formData.returnDate || undefined
    };

    if (isEditMode && onEdit) {
      onEdit(editingTravel.id, travelData);
    } else {
      onSave(travelData);
    }

    onClose();
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTeamMemberToggle = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      assignedTeamMembers: prev.assignedTeamMembers.includes(memberId)
        ? prev.assignedTeamMembers.filter(id => id !== memberId)
        : [...prev.assignedTeamMembers, memberId]
    }));
  };

  const getSelectedTeamMembers = () => {
    return availableTeamMembers.filter(member => 
      formData.assignedTeamMembers.includes(member.id)
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Travel Plan' : 'Add Travel Plan'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          {/* Travel Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Travel Type *
            </label>
            <select
              value={formData.travelType}
              onChange={(e) => handleInputChange('travelType', e.target.value as TravelType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Flight">Flight</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Train">Train</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Departure Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure Location *
            </label>
            <input
              type="text"
              value={formData.departureLocation}
              onChange={(e) => handleInputChange('departureLocation', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.departureLocation ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter departure location"
            />
            {errors.departureLocation && (
              <p className="mt-1 text-xs text-red-600">{errors.departureLocation}</p>
            )}
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination *
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.destination ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter destination"
            />
            {errors.destination && (
              <p className="mt-1 text-xs text-red-600">{errors.destination}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departure Date *
              </label>
              <input
                type="date"
                value={formData.departureDate}
                onChange={(e) => handleInputChange('departureDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 ${
                  errors.departureDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.departureDate && (
                <p className="mt-1 text-xs text-red-600">{errors.departureDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Return Date (Optional)
              </label>
              <input
                type="date"
                value={formData.returnDate}
                onChange={(e) => handleInputChange('returnDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Assigned Team Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Team Members *
            </label>
            
            {/* Selected Members Display */}
            {getSelectedTeamMembers().length > 0 && (
              <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-1 mb-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Selected ({getSelectedTeamMembers().length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getSelectedTeamMembers().map(member => (
                    <span
                      key={member.id}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {member.name} ({member.role})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Team Members List */}
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
              {availableTeamMembers.map(member => (
                <label
                  key={member.id}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.assignedTeamMembers.includes(member.id)}
                    onChange={() => handleTeamMemberToggle(member.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {member.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {member.role}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            
            {errors.assignedTeamMembers && (
              <p className="mt-1 text-xs text-red-600">{errors.assignedTeamMembers}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Plane}
          >
            {isEditMode ? 'Update Travel Plan' : 'Add Travel Plan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
