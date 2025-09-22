import React, { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { LogisticsItem, LogisticsType, AddLogisticsModalProps } from '../../types/logisticsTravel';

export const AddLogisticsModal: React.FC<AddLogisticsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onEdit,
  editingLogistics
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Material' as LogisticsType,
    description: '',
    quantity: 1,
    location: '',
    expectedDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditMode = !!editingLogistics;

  // Reset form when modal opens/closes or editing changes
  useEffect(() => {
    if (isOpen) {
      if (editingLogistics) {
        setFormData({
          name: editingLogistics.name,
          type: editingLogistics.type,
          description: editingLogistics.description,
          quantity: editingLogistics.quantity,
          location: editingLogistics.location,
          expectedDate: editingLogistics.expectedDate
        });
      } else {
        setFormData({
          name: '',
          type: 'Material',
          description: '',
          quantity: 1,
          location: '',
          expectedDate: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, editingLogistics]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Logistics name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.expectedDate) {
      newErrors.expectedDate = 'Expected date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const logisticsData = {
      ...formData,
      quantity: Number(formData.quantity)
    };

    if (isEditMode && onEdit) {
      onEdit(editingLogistics.id, logisticsData);
    } else {
      onSave(logisticsData);
    }

    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Logistics' : 'Add Logistics'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          {/* Logistics Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logistics Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter logistics name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value as LogisticsType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Material">Material</option>
              <option value="Equipment">Equipment</option>
              <option value="Vehicle">Vehicle</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter description"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.quantity ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter quantity"
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location / Destination *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.location ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter location or destination"
            />
            {errors.location && (
              <p className="mt-1 text-xs text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Expected Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Date *
            </label>
            <input
              type="date"
              value={formData.expectedDate}
              onChange={(e) => handleInputChange('expectedDate', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 ${
                errors.expectedDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.expectedDate && (
              <p className="mt-1 text-xs text-red-600">{errors.expectedDate}</p>
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
            icon={Package}
          >
            {isEditMode ? 'Update Logistics' : 'Add Logistics'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
