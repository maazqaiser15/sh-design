import React, { useState, useEffect } from 'react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { Trailer, FilmSheetType } from '../../../../types';
import { 
  TOOL_INVENTORY,
  FILM_SHEET_TYPES, 
  validateTrailerForm, 
  createActivityLog,
  TrailerFormData
} from '../../../trailer/utils/trailerUtils';

interface UpdateTrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTrailer: (trailer: Omit<Trailer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  trailer: Trailer | null;
  existingTrailerNumbers: string[];
}

/**
 * Modal for updating existing trailers with basic info and inventory management
 * Follows the same design as CreateTrailerModal but for editing
 */
export const UpdateTrailerModal: React.FC<UpdateTrailerModalProps> = ({
  isOpen,
  onClose,
  onUpdateTrailer,
  trailer,
  existingTrailerNumbers,
}) => {
  const [formData, setFormData] = useState<TrailerFormData>({
    trailerName: '',
    registrationNumber: '',
    parkingAddress: '',
    state: '',
    city: '',
    toolThresholds: TOOL_INVENTORY.reduce((acc, tool) => ({
      ...acc,
      [tool.name]: tool.defaultThreshold,
    }), {} as Record<string, number>),
    filmSheetThresholds: FILM_SHEET_TYPES.reduce((acc, sheetType) => ({
      ...acc,
      [sheetType]: 10,
    }), {} as Record<FilmSheetType, number>),
  });

  const [toolCurrentStock, setToolCurrentStock] = useState<Record<string, number>>(
    TOOL_INVENTORY.reduce((acc, tool) => ({ ...acc, [tool.name]: 0 }), {} as Record<string, number>)
  );

  const [filmSheetCurrentStock, setFilmSheetCurrentStock] = useState<Record<FilmSheetType, number>>(
    FILM_SHEET_TYPES.reduce((acc, sheetType) => ({ ...acc, [sheetType]: 0 }), {} as Record<FilmSheetType, number>)
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<'tools' | 'filmSheets'>('tools');


  // Initialize inventory data when trailer changes
  useEffect(() => {
    if (trailer) {
      // Initialize tool thresholds with defaults, then override with trailer data
      const toolThresholds = TOOL_INVENTORY.reduce((acc, tool) => ({
        ...acc,
        [tool.name]: tool.defaultThreshold,
      }), {} as Record<string, number>);

      // Override with actual trailer data
      trailer.inventory.tools.forEach(item => {
        toolThresholds[item.toolName] = item.threshold;
      });

      // Initialize film sheet thresholds with defaults, then override with trailer data
      const filmSheetThresholds = FILM_SHEET_TYPES.reduce((acc, sheetType) => ({
        ...acc,
        [sheetType]: 10, // Default threshold
      }), {} as Record<FilmSheetType, number>);

      // Override with actual trailer data
      trailer.inventory.filmSheets.forEach(item => {
        filmSheetThresholds[item.sheetType] = item.threshold;
      });

      setFormData(prev => ({
        ...prev,
        toolThresholds,
        filmSheetThresholds,
      }));

      // Initialize tool current stock with defaults, then override with trailer data
      const toolCurrentStock = TOOL_INVENTORY.reduce((acc, tool) => ({
        ...acc,
        [tool.name]: 0,
      }), {} as Record<string, number>);

      // Override with actual trailer data
      trailer.inventory.tools.forEach(item => {
        toolCurrentStock[item.toolName] = item.currentStock;
      });

      setToolCurrentStock(toolCurrentStock);

      // Initialize film sheet current stock with defaults, then override with trailer data
      const filmSheetCurrentStock = FILM_SHEET_TYPES.reduce((acc, sheetType) => ({
        ...acc,
        [sheetType]: 0,
      }), {} as Record<FilmSheetType, number>);

      // Override with actual trailer data
      trailer.inventory.filmSheets.forEach(item => {
        filmSheetCurrentStock[item.sheetType] = item.currentStock;
      });

      setFilmSheetCurrentStock(filmSheetCurrentStock);
    }
  }, [trailer]);


  const handleToolThresholdChange = (toolName: string, threshold: number) => {
    setFormData(prev => ({
      ...prev,
      toolThresholds: {
        ...prev.toolThresholds,
        [toolName]: Math.max(0, threshold),
      },
    }));

    // Clear error when user starts typing
    const errorKey = `tool_${toolName}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleToolCurrentStockChange = (toolName: string, stock: number) => {
    setToolCurrentStock(prev => ({
      ...prev,
      [toolName]: Math.max(0, stock),
    }));
  };

  const handleFilmSheetThresholdChange = (sheetType: FilmSheetType, threshold: number) => {
    setFormData(prev => ({
      ...prev,
      filmSheetThresholds: {
        ...prev.filmSheetThresholds,
        [sheetType]: Math.max(0, threshold),
      },
    }));

    // Clear error when user starts typing
    const errorKey = `sheet_${sheetType}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleFilmSheetCurrentStockChange = (sheetType: FilmSheetType, stock: number) => {
    setFilmSheetCurrentStock(prev => ({
      ...prev,
      [sheetType]: Math.max(0, stock),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation - just check if we have a trailer
    if (!trailer) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Create updated tools inventory
      const updatedTools = TOOL_INVENTORY.map(tool => ({
        toolName: tool.name,
        currentStock: toolCurrentStock[tool.name],
        threshold: formData.toolThresholds[tool.name],
        status: toolCurrentStock[tool.name] === 0 ? 'critical' as const :
                toolCurrentStock[tool.name] <= formData.toolThresholds[tool.name] ? 'low' as const :
                'good' as const,
      }));

      // Create updated film sheets inventory
      const updatedFilmSheets = FILM_SHEET_TYPES.map(sheetType => ({
        sheetType,
        currentStock: filmSheetCurrentStock[sheetType],
        threshold: formData.filmSheetThresholds[sheetType],
        status: filmSheetCurrentStock[sheetType] === 0 ? 'critical' as const :
                filmSheetCurrentStock[sheetType] <= formData.filmSheetThresholds[sheetType] ? 'low' as const :
                'good' as const,
      }));

      // Create the new inventory structure
      const updatedInventory = {
        tools: updatedTools,
        filmSheets: updatedFilmSheets,
      };

      // Create activity logs for inventory changes
      const activityLogs = [...trailer.activityLogs];
      
      // Check for inventory changes
      const hasToolChanges = trailer.inventory.tools.some(tool => {
        const newTool = updatedTools.find(t => t.toolName === tool.toolName);
        return newTool && (newTool.currentStock !== tool.currentStock || newTool.threshold !== tool.threshold);
      });

      const hasFilmSheetChanges = trailer.inventory.filmSheets.some(sheet => {
        const newSheet = updatedFilmSheets.find(s => s.sheetType === sheet.sheetType);
        return newSheet && (newSheet.currentStock !== sheet.currentStock || newSheet.threshold !== sheet.threshold);
      });

      if (hasToolChanges || hasFilmSheetChanges) {
        activityLogs.push(
          createActivityLog('inventory_updated', 'Inventory levels updated', undefined, true)
        );
      }

      const trailerData: Omit<Trailer, 'id' | 'createdAt' | 'updatedAt'> = {
        trailerName: trailer.trailerName,
        registrationNumber: trailer.registrationNumber,
        parkingAddress: trailer.parkingAddress,
        state: trailer.state,
        city: trailer.city,
        inventory: updatedInventory,
        status: trailer.status,
        activityLogs,
      };

      onUpdateTrailer(trailerData);
      
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error updating trailer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setErrors({});
    setActiveSection('tools');
    onClose();
  };

  if (!trailer) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={`Update Trailer - ${trailer.trailerName}`}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveSection('tools')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeSection === 'tools'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tools Inventory
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('filmSheets')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeSection === 'filmSheets'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Film Sheets
          </button>
        </div>


        {/* Tools Inventory Section */}
        {activeSection === 'tools' && (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {TOOL_INVENTORY.map((tool) => (
              <div key={tool.name} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{tool.name}</h3>
                    <p className="text-xs text-gray-500">Default threshold: {tool.defaultThreshold}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Current Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={toolCurrentStock[tool.name]}
                      onChange={(e) => handleToolCurrentStockChange(tool.name, parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Threshold</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.toolThresholds[tool.name] || tool.defaultThreshold}
                      onChange={(e) => handleToolThresholdChange(tool.name, parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Film Sheets Section */}
        {activeSection === 'filmSheets' && (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {FILM_SHEET_TYPES.map((sheetType) => (
              <div key={sheetType} className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{sheetType}</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Current Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={filmSheetCurrentStock[sheetType]}
                      onChange={(e) => handleFilmSheetCurrentStockChange(sheetType, parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Threshold</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.filmSheetThresholds[sheetType] || 10}
                      onChange={(e) => handleFilmSheetThresholdChange(sheetType, parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Trailer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
