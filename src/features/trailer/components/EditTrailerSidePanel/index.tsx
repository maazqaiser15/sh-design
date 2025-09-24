import React, { useState, useEffect } from 'react';
import { SidePanel, CollapsibleSection } from '../../../../common/components/SidePanel';
import { Button } from '../../../../common/components/Button';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { Trailer, FilmType, FilmSheetType, ToolInventoryItem, FilmSheetInventoryItem } from '../../../../types';
import { 
  FILM_TYPES, 
  FILM_SHEET_TYPES,
  TOOL_INVENTORY,
  USA_STATES,
  USA_CITIES,
  validateTrailerForm, 
  createActivityLog,
  formatTrailerName,
  updateInventoryStatus,
  calculateTrailerStatus,
  TrailerFormData
} from '../../utils/trailerUtils';

interface EditTrailerSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  trailer: Trailer | null;
  onUpdateTrailer: (updatedTrailer: Trailer) => void;
  existingTrailerNumbers: string[];
}

/**
 * Side panel for editing trailer information
 * Follows the design with full height, 24px padding, and scrollable content
 */
export const EditTrailerSidePanel: React.FC<EditTrailerSidePanelProps> = ({
  isOpen,
  onClose,
  trailer,
  onUpdateTrailer,
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
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Update available cities when state changes
  useEffect(() => {
    if (formData.state) {
      const cities = USA_CITIES[formData.state] || [];
      setAvailableCities(cities);
      // Reset city if it's not available in the new state
      if (formData.city && !cities.includes(formData.city)) {
        setFormData(prev => ({ ...prev, city: '' }));
      }
    } else {
      setAvailableCities([]);
    }
  }, [formData.state]);

  // Initialize form data when trailer changes
  useEffect(() => {
    if (trailer) {
      setFormData({
        trailerName: trailer.trailerName,
        registrationNumber: trailer.registrationNumber,
        parkingAddress: trailer.parkingAddress || '',
        state: trailer.state || '',
        city: trailer.city || '',
        toolThresholds: trailer.inventory.tools.reduce((acc, item) => ({
          ...acc,
          [item.toolName]: item.threshold,
        }), {} as Record<string, number>),
        filmSheetThresholds: trailer.inventory.filmSheets.reduce((acc, item) => ({
          ...acc,
          [item.sheetType]: item.threshold,
        }), {} as Record<FilmSheetType, number>),
      });

      setToolCurrentStock(
        trailer.inventory.tools.reduce((acc, item) => ({
          ...acc,
          [item.toolName]: item.currentStock,
        }), {} as Record<string, number>)
      );

      setFilmSheetCurrentStock(
        trailer.inventory.filmSheets.reduce((acc, item) => ({
          ...acc,
          [item.sheetType]: item.currentStock,
        }), {} as Record<FilmSheetType, number>)
      );
    }
  }, [trailer]);

  const handleInputChange = (field: keyof Omit<TrailerFormData, 'toolThresholds' | 'filmSheetThresholds'>, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

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
    if (!trailer) return;

    setIsSubmitting(true);

    // Validate form
    const validation = validateTrailerForm(formData);
    
    // Check for duplicate trailer name (excluding current trailer)
    const formattedTrailerName = formData.trailerName.trim();
    const otherTrailerNames = existingTrailerNumbers.filter(name => name !== trailer.trailerName);
    if (otherTrailerNames.includes(formattedTrailerName)) {
      validation.errors.trailerName = 'Trailer name already exists';
      validation.isValid = false;
    }

    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Create updated tools inventory
      const updatedTools: ToolInventoryItem[] = TOOL_INVENTORY.map(tool => ({
        toolName: tool.name,
        currentStock: toolCurrentStock[tool.name],
        threshold: formData.toolThresholds[tool.name],
        status: toolCurrentStock[tool.name] === 0 ? 'critical' as const :
                toolCurrentStock[tool.name] <= formData.toolThresholds[tool.name] ? 'low' as const :
                'good' as const,
      }));

      // Create updated film sheets inventory
      const updatedFilmSheets: FilmSheetInventoryItem[] = FILM_SHEET_TYPES.map(sheetType => ({
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

      const newStatus = calculateTrailerStatus(updatedInventory);
      const now = new Date().toISOString();

      // Create activity logs for changes
      const activityLogs = [...trailer.activityLogs];
      
      if (trailer.trailerName !== formattedTrailerName) {
        activityLogs.push(
          createActivityLog('updated', `Trailer name changed from ${trailer.trailerName} to ${formattedTrailerName}`, undefined, true)
        );
      }
      
      if (trailer.registrationNumber !== formData.registrationNumber) {
        activityLogs.push(
          createActivityLog('updated', `Registration number updated`, undefined, true)
        );
      }
      

      if (trailer.status !== newStatus) {
        activityLogs.push(
          createActivityLog('status_changed', `Status changed from ${trailer.status} to ${newStatus}`, undefined, true)
        );
      }

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

      const updatedTrailer: Trailer = {
        ...trailer,
        trailerName: formattedTrailerName,
        registrationNumber: formData.registrationNumber.trim(),
        parkingAddress: formData.parkingAddress.trim(),
        state: formData.state,
        city: formData.city,
        inventory: updatedInventory,
        status: newStatus,
        activityLogs,
        updatedAt: now,
      };

      onUpdateTrailer(updatedTrailer);
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error updating trailer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (trailer) {
      setFormData({
        trailerName: trailer.trailerName,
        registrationNumber: trailer.registrationNumber,
        parkingAddress: trailer.parkingAddress || '',
        state: trailer.state || '',
        city: trailer.city || '',
        toolThresholds: trailer.inventory.tools.reduce((acc, item) => ({
          ...acc,
          [item.toolName]: item.threshold,
        }), {} as Record<string, number>),
        filmSheetThresholds: trailer.inventory.filmSheets.reduce((acc, item) => ({
          ...acc,
          [item.sheetType]: item.threshold,
        }), {} as Record<FilmSheetType, number>),
      });

      setToolCurrentStock(
        trailer.inventory.tools.reduce((acc, item) => ({
          ...acc,
          [item.toolName]: item.currentStock,
        }), {} as Record<string, number>)
      );

      setFilmSheetCurrentStock(
        trailer.inventory.filmSheets.reduce((acc, item) => ({
          ...acc,
          [item.sheetType]: item.currentStock,
        }), {} as Record<FilmSheetType, number>)
      );
    }
    setErrors({});
    onClose();
  };

  if (!trailer) return null;

  // Calculate preview status
  const previewTools: ToolInventoryItem[] = TOOL_INVENTORY.map(tool => ({
    toolName: tool.name,
    currentStock: toolCurrentStock[tool.name],
    threshold: formData.toolThresholds[tool.name],
    status: toolCurrentStock[tool.name] === 0 ? 'critical' as const :
            toolCurrentStock[tool.name] <= formData.toolThresholds[tool.name] ? 'low' as const :
            'good' as const,
  }));

  const previewFilmSheets: FilmSheetInventoryItem[] = FILM_SHEET_TYPES.map(sheetType => ({
    sheetType,
    currentStock: filmSheetCurrentStock[sheetType],
    threshold: formData.filmSheetThresholds[sheetType],
    status: filmSheetCurrentStock[sheetType] === 0 ? 'critical' as const :
            filmSheetCurrentStock[sheetType] <= formData.filmSheetThresholds[sheetType] ? 'low' as const :
            'good' as const,
  }));

  const previewInventory = {
    tools: previewTools,
    filmSheets: previewFilmSheets,
  };
  const previewStatus = calculateTrailerStatus(previewInventory);

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={handleCancel}
      title={`Edit Trailer ${trailer.trailerName}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Current Status</span>
          <StatusBadge status={previewStatus} unavailableUntil={trailer?.unavailableUntil} />
        </div>

        {/* Basic Information Section */}
        <CollapsibleSection title="Basic Information" defaultExpanded={true}>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-trailerName" className="block text-sm font-medium text-gray-700 mb-1">
                Trailer Name *
              </label>
              <input
                type="text"
                id="edit-trailerName"
                value={formData.trailerName}
                onChange={(e) => handleInputChange('trailerName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.trailerName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter trailer name"
              />
              {errors.trailerName && (
                <p className="mt-1 text-sm text-red-600">{errors.trailerName}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Registration Number *
              </label>
              <input
                type="text"
                id="edit-registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.registrationNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter registration number"
              />
              {errors.registrationNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.registrationNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-parkingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Parking Address *
              </label>
              <input
                type="text"
                id="edit-parkingAddress"
                value={formData.parkingAddress}
                onChange={(e) => handleInputChange('parkingAddress', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.parkingAddress ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter parking address"
              />
              {errors.parkingAddress && (
                <p className="mt-1 text-sm text-red-600">{errors.parkingAddress}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-state" className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <select
                id="edit-state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.state ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select state</option>
                {USA_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <select
                id="edit-city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.city ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={!formData.state}
              >
                <option value="">Select city</option>
                {availableCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>
          </div>
        </CollapsibleSection>

        {/* Tools Inventory Section */}
        <CollapsibleSection title="Tools Inventory" defaultExpanded={true}>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Update current stock levels and threshold values for tools.
            </p>

            {TOOL_INVENTORY.slice(0, 5).map((tool) => {
              const previewItem = previewTools.find(item => item.toolName === tool.name);
              
              return (
                <div key={tool.name} className="p-3 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{tool.name}</span>
                    {previewItem && <StatusBadge status={previewItem.status} size="sm" />}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Current Stock</label>
                      <input
                        type="number"
                        min="0"
                        value={toolCurrentStock[tool.name]}
                        onChange={(e) => handleToolCurrentStockChange(tool.name, parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Threshold</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.toolThresholds[tool.name]}
                        onChange={(e) => handleToolThresholdChange(tool.name, parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {previewItem && (
                    <div className="text-xs text-gray-600">
                      {previewItem.currentStock > previewItem.threshold ? (
                        <span className="text-green-600">
                          +{previewItem.currentStock - previewItem.threshold} above threshold
                        </span>
                      ) : previewItem.currentStock === previewItem.threshold ? (
                        <span className="text-amber-600">At threshold</span>
                      ) : previewItem.currentStock === 0 ? (
                        <span className="text-red-600">Out of stock</span>
                      ) : (
                        <span className="text-red-600">
                          {previewItem.threshold - previewItem.currentStock} below threshold
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Film Sheets Inventory Section */}
        <CollapsibleSection title="Film Sheets Inventory" defaultExpanded={true}>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Update current stock levels and threshold values for film sheets.
            </p>

            {FILM_SHEET_TYPES.slice(0, 5).map((sheetType) => {
              const previewItem = previewFilmSheets.find(item => item.sheetType === sheetType);
              
              return (
                <div key={sheetType} className="p-3 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{sheetType}</span>
                    {previewItem && <StatusBadge status={previewItem.status} size="sm" />}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Current Stock</label>
                      <input
                        type="number"
                        min="0"
                        value={filmSheetCurrentStock[sheetType]}
                        onChange={(e) => handleFilmSheetCurrentStockChange(sheetType, parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Threshold</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.filmSheetThresholds[sheetType]}
                        onChange={(e) => handleFilmSheetThresholdChange(sheetType, parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {previewItem && (
                    <div className="text-xs text-gray-600">
                      {previewItem.currentStock > previewItem.threshold ? (
                        <span className="text-green-600">
                          +{previewItem.currentStock - previewItem.threshold} above threshold
                        </span>
                      ) : previewItem.currentStock === previewItem.threshold ? (
                        <span className="text-amber-600">At threshold</span>
                      ) : previewItem.currentStock === 0 ? (
                        <span className="text-red-600">Out of stock</span>
                      ) : (
                        <span className="text-red-600">
                          {previewItem.threshold - previewItem.currentStock} below threshold
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CollapsibleSection>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </SidePanel>
  );
};
