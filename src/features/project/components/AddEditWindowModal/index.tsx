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
    interiorLayers: 1,
    exteriorLayers: 0
  });

  useEffect(() => {
    if (windowItem) {
      // Calculate interior and exterior layers from existing layers
      const interiorLayers = windowItem.layers.filter(layer => 
        layer.layerName.includes('Interior') || layer.layerName.includes('Middle')
      ).length;
      const exteriorLayers = windowItem.layers.filter(layer => 
        layer.layerName.includes('Exterior')
      ).length;
      
      setFormData({
        windowName: windowItem.windowName,
        filmType: windowItem.filmType,
        length: windowItem.length,
        width: windowItem.width,
        interiorLayers,
        exteriorLayers
      });
    } else {
      setFormData({
        windowName: '',
        filmType: 'BR',
        length: 120,
        width: 80,
        interiorLayers: 1,
        exteriorLayers: 0
      });
    }
  }, [windowItem, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateLayerInstallations = (interiorLayers: number, exteriorLayers: number) => {
    const layers = [];
    let layerNumber = 1;
    
    // Add interior layers
    for (let i = 1; i <= interiorLayers; i++) {
      layers.push({
        layerNumber: layerNumber++,
        layerName: interiorLayers === 1 ? 'Interior Layer' : `Interior Layer ${i}`,
        status: 'Pending' as const
      });
    }
    
    // Add exterior layers
    for (let i = 1; i <= exteriorLayers; i++) {
      layers.push({
        layerNumber: layerNumber++,
        layerName: exteriorLayers === 1 ? 'Exterior Layer' : `Exterior Layer ${i}`,
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

    if (formData.interiorLayers <= 0 && formData.exteriorLayers <= 0) {
      showToast('At least one layer (interior or exterior) must be specified', 'error');
      return;
    }

    const now = new Date();
    const windowData: WindowType = {
      id: windowItem?.id || `window-${Date.now()}`,
      windowName: formData.windowName.trim(),
      filmType: formData.filmType,
      length: formData.length,
      width: formData.width,
      layers: generateLayerInstallations(formData.interiorLayers, formData.exteriorLayers),
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
      interiorLayers: 1,
      exteriorLayers: 0
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
                Length (in) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.length}
                onChange={(e) => handleInputChange('length', parseInt(e.target.value) || 48)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width (in) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.width}
                onChange={(e) => handleInputChange('width', parseInt(e.target.value) || 32)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Interior and Exterior Layers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interior Layers *
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.interiorLayers}
                onChange={(e) => handleInputChange('interiorLayers', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exterior Layers *
              </label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.exteriorLayers}
                onChange={(e) => handleInputChange('exteriorLayers', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <p className="text-sm text-gray-500">
            At least one layer (interior or exterior) must be specified
          </p>

          {/* Preview */}
          {(formData.interiorLayers > 0 || formData.exteriorLayers > 0) && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Layer Preview:</h4>
              <div className="space-y-1">
                {generateLayerInstallations(formData.interiorLayers, formData.exteriorLayers).map((layer, index) => (
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
