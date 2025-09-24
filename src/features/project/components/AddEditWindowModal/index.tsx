import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { useToast } from '../../../../contexts/ToastContext';
import { Window as WindowType, FilmType, FILM_TYPE_OPTIONS } from '../../types/windowManagement';

interface AddEditWindowModalProps {
  isOpen: boolean;
  onClose: () => void;
  windowItem?: WindowType | null;
  onSave: (windowItem: WindowType) => void;
}

export const AddEditWindowModal: React.FC<AddEditWindowModalProps> = ({
  isOpen,
  onClose,
  windowItem,
  onSave
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    windowName: '',
    filmType: 'BR' as FilmType,
    length: 120,
    width: 80,
    layers: 1
  });

  useEffect(() => {
    if (windowItem) {
      setFormData({
        windowName: windowItem.windowName,
        filmType: windowItem.filmType,
        length: windowItem.length,
        width: windowItem.width,
        layers: windowItem.layers.length
      });
    } else {
      setFormData({
        windowName: '',
        filmType: 'BR',
        length: 120,
        width: 80,
        layers: 1
      });
    }
  }, [windowItem, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateLayerInstallations = (layerCount: number) => {
    const layers = [];
    for (let i = 1; i <= layerCount; i++) {
      layers.push({
        layerNumber: i,
        layerName: i === 1 ? 'Interior Layer' : 
                  i === layerCount ? 'Exterior Layer' : 
                  `Middle Layer ${i - 1}`,
        status: 'Pending' as const
      });
    }
    return layers;
  };

  const handleSave = () => {
    // Validation
    if (!formData.windowName.trim()) {
      showToast('Window name is required', 'error');
      return;
    }

    if (formData.length <= 0 || formData.width <= 0) {
      showToast('Length and width must be greater than 0', 'error');
      return;
    }

    if (formData.layers <= 0) {
      showToast('Number of layers must be greater than 0', 'error');
      return;
    }

    const now = new Date();
    const windowData: WindowType = {
      id: windowItem?.id || `window-${Date.now()}`,
      windowName: formData.windowName.trim(),
      filmType: formData.filmType,
      length: formData.length,
      width: formData.width,
      layers: generateLayerInstallations(formData.layers),
      status: windowItem ? 'Updated' : 'Pending',
      assignedTeamMembers: windowItem?.assignedTeamMembers || [],
      createdAt: windowItem?.createdAt || now,
      updatedAt: now,
      createdFromSheet: windowItem?.createdFromSheet || false,
      sheetId: windowItem?.sheetId
    };

    onSave(windowData);
    showToast(
      windowItem ? 'Window updated successfully' : 'Window added successfully', 
      'success'
    );
    onClose();
  };

  const handleClose = () => {
    setFormData({
      windowName: '',
      filmType: 'BR',
      length: 120,
      width: 80,
      layers: 1
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={windowItem ? 'Edit Window' : 'Add New Window'}
      size="md"
    >
      <div className="p-6">
        <div className="space-y-4">
          {/* Window Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Window Name *
            </label>
            <input
              type="text"
              value={formData.windowName}
              onChange={(e) => handleInputChange('windowName', e.target.value)}
              placeholder="Enter window name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Film Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Film Type *
            </label>
            <select
              value={formData.filmType}
              onChange={(e) => handleInputChange('filmType', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {FILM_TYPE_OPTIONS.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Length (cm) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.length}
                onChange={(e) => handleInputChange('length', parseInt(e.target.value) || 120)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (cm) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.width}
                onChange={(e) => handleInputChange('width', parseInt(e.target.value) || 80)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Number of Layers */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Layers *
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={formData.layers}
              onChange={(e) => handleInputChange('layers', parseInt(e.target.value) || 1)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Layers will be automatically named (Interior Layer, Middle Layer, Exterior Layer)
            </p>
          </div>

          {/* Preview */}
          {formData.layers > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Layer Preview:</h4>
              <div className="space-y-1">
                {generateLayerInstallations(formData.layers).map((layer, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    • {layer.layerName}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
          <Button
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
          >
            {windowItem ? 'Update Window' : 'Add Window'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
