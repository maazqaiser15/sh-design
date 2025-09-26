import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { Window, FilmType, FILM_TYPE_OPTIONS } from '../../types/windows';

interface EditWindowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (windowData: Omit<Window, 'id' | 'createdAt' | 'updatedAt' | 'projectId'>) => void;
  window: Window | null;
}

export const EditWindowModal: React.FC<EditWindowModalProps> = ({
  isOpen,
  onClose,
  onSave,
  window
}) => {
  const [formData, setFormData] = useState({
    windowName: '',
    filmType: 'BR' as FilmType,
    length: 0,
    width: 0,
    interiorLayers: 1,
    exteriorLayers: 0,
    status: 'Pending' as const,
    assignedTeamMembers: [] as string[],
    installationBreakdown: [] as any[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when window changes
  useEffect(() => {
    if (window) {
      // Calculate interior and exterior layers from existing layers
      const interiorLayers = window.layers.filter(layer => 
        layer.layerName.includes('Interior') || layer.layerName.includes('Middle')
      ).length;
      const exteriorLayers = window.layers.filter(layer => 
        layer.layerName.includes('Exterior')
      ).length;
      
      setFormData({
        windowName: window.windowName,
        filmType: window.filmType,
        length: window.length,
        width: window.width,
        interiorLayers,
        exteriorLayers,
        status: window.status,
        assignedTeamMembers: window.assignedTeamMembers,
        installationBreakdown: window.installationBreakdown
      });
    }
  }, [window]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.windowName.trim()) {
      newErrors.windowName = 'Window name is required';
    }

    if (formData.length <= 0) {
      newErrors.length = 'Length must be greater than 0';
    }

    if (formData.width <= 0) {
      newErrors.width = 'Width must be greater than 0';
    }

    if (formData.interiorLayers < 0 || formData.exteriorLayers < 0) {
      newErrors.layers = 'Layer counts cannot be negative';
    }
    
    if (formData.interiorLayers === 0 && formData.exteriorLayers === 0) {
      newErrors.layers = 'At least one layer (interior or exterior) is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...formData,
        status: 'Updated' // Auto-update status when edited
      });
      onClose();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
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

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!window) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Window</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Window Name */}
          <div>
            <label htmlFor="windowName" className="block text-sm font-medium text-gray-700 mb-1">
              Window Name *
            </label>
            <input
              type="text"
              id="windowName"
              value={formData.windowName}
              onChange={(e) => handleInputChange('windowName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.windowName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter window name"
            />
            {errors.windowName && (
              <p className="mt-1 text-sm text-red-600">{errors.windowName}</p>
            )}
          </div>

          {/* Film Type */}
          <div>
            <label htmlFor="filmType" className="block text-sm font-medium text-gray-700 mb-1">
              Film Type *
            </label>
            <select
              id="filmType"
              value={formData.filmType}
              onChange={(e) => handleInputChange('filmType', e.target.value as FilmType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {FILM_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Interior and Exterior Layers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="interiorLayers" className="block text-sm font-medium text-gray-700 mb-1">
                Interior Layers *
              </label>
              <input
                type="number"
                id="interiorLayers"
                min="0"
                max="10"
                value={formData.interiorLayers}
                onChange={(e) => handleInputChange('interiorLayers', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.layers ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>

            <div>
              <label htmlFor="exteriorLayers" className="block text-sm font-medium text-gray-700 mb-1">
                Exterior Layers *
              </label>
              <input
                type="number"
                id="exteriorLayers"
                min="0"
                max="10"
                value={formData.exteriorLayers}
                onChange={(e) => handleInputChange('exteriorLayers', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.layers ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
          </div>
          
          {errors.layers && (
            <p className="text-sm text-red-600">{errors.layers}</p>
          )}
          
          <p className="text-sm text-gray-500">
            At least one layer (interior or exterior) must be specified
          </p>

          {/* Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                Length (in) *
              </label>
              <input
                type="number"
                id="length"
                min="1"
                step="0.1"
                value={formData.length}
                onChange={(e) => handleInputChange('length', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.length ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter length"
              />
              {errors.length && (
                <p className="mt-1 text-sm text-red-600">{errors.length}</p>
              )}
            </div>

            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                Width (in) *
              </label>
              <input
                type="number"
                id="width"
                min="1"
                step="0.1"
                value={formData.width}
                onChange={(e) => handleInputChange('width', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.width ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter width"
              />
              {errors.width && (
                <p className="mt-1 text-sm text-red-600">{errors.width}</p>
              )}
            </div>
          </div>

          {/* Current Status Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Current Status</h4>
                <p className="text-sm text-gray-600">
                  This window will be marked as "Updated" after saving changes.
                </p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {formData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Installation Progress (if any) */}
          {formData.installationBreakdown.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Installation Progress</h4>
              <div className="space-y-2">
                {formData.installationBreakdown.map((layer, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between text-sm px-3 py-2 rounded ${
                      layer.status === 'installed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <span>{layer.layerName}</span>
                    <span className="font-medium">{layer.installerName}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-blue-700 mt-2">
                Installation progress will be preserved after editing.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};
