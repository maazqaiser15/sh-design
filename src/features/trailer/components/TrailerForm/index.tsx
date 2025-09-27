import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Card } from '../../../../common/components/Card';
import { Button } from '../../../../common/components/Button';
import { Trailer, FilmSheetType, ToolInventoryItem, FilmSheetInventoryItem } from '../../../../types';
import { 
  TOOL_INVENTORY,
  FILM_SHEET_TYPES, 
  USA_STATES,
  USA_CITIES,
  validateTrailerForm, 
  createInitialInventory,
  createActivityLog,
  formatTrailerName,
  TrailerFormData,
  updateInventoryStatus
} from '../../utils/trailerUtils';

interface TrailerFormProps {
  trailer?: Trailer | null; // If provided, it's edit mode; if null, it's create mode
  onSave: (trailer: Omit<Trailer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  existingTrailerNumbers: string[];
}

/**
 * Comprehensive trailer form for both creating and editing trailers
 * Handles all trailer data including basic info, tools, and film sheets inventory
 */
export const TrailerForm: React.FC<TrailerFormProps> = ({
  trailer,
  onSave,
  onCancel,
  existingTrailerNumbers,
}) => {
  const isEditMode = !!trailer;
  
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
      setAvailableCities(USA_CITIES[formData.state] || []);
      // Reset city when state changes
      setFormData(prev => ({ ...prev, city: '' }));
    } else {
      setAvailableCities([]);
    }
  }, [formData.state]);

  // Reset form to default state
  const resetForm = () => {
    setFormData({
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

    setToolCurrentStock(
      TOOL_INVENTORY.reduce((acc, tool) => ({ ...acc, [tool.name]: 0 }), {} as Record<string, number>)
    );

    setFilmSheetCurrentStock(
      FILM_SHEET_TYPES.reduce((acc, sheetType) => ({ ...acc, [sheetType]: 0 }), {} as Record<FilmSheetType, number>)
    );

    setErrors({});
  };

  // Initialize form data when trailer changes (edit mode) or reset when switching to create mode
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

      setFormData({
        trailerName: trailer.trailerName,
        registrationNumber: trailer.registrationNumber,
        parkingAddress: trailer.parkingAddress || '',
        state: trailer.state || '',
        city: trailer.city || '',
        toolThresholds,
        filmSheetThresholds,
      });

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
    } else {
      // Reset form when switching to create mode
      resetForm();
    }
  }, [trailer]);

  const handleInputChange = (field: keyof Omit<TrailerFormData, 'toolThresholds' | 'filmSheetThresholds'>, value: string) => {
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
    setIsSubmitting(true);

    // Validate form
    const validation = validateTrailerForm(formData);
    
    // Check for duplicate trailer name (excluding current trailer in edit mode)
    const formattedTrailerName = formData.trailerName.trim();
    const otherTrailerNames = isEditMode 
      ? existingTrailerNumbers.filter(name => name !== trailer?.trailerName)
      : existingTrailerNumbers;
      
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

      const now = new Date().toISOString();

      // Create activity logs for changes (only in edit mode)
      const activityLogs = trailer ? [...trailer.activityLogs] : [];
      
      if (isEditMode && trailer) {
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
        
        // Check for address changes
        if (trailer.parkingAddress !== formData.parkingAddress) {
          activityLogs.push(
            createActivityLog('address_changed', `Parking address changed from ${trailer.parkingAddress} to ${formData.parkingAddress}`, undefined, true)
          );
        }

        if (trailer.state !== formData.state) {
          activityLogs.push(
            createActivityLog('state_changed', `State changed from ${trailer.state} to ${formData.state}`, undefined, true)
          );
        }

        if (trailer.city !== formData.city) {
          activityLogs.push(
            createActivityLog('city_changed', `City changed from ${trailer.city} to ${formData.city}`, undefined, true)
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
      } else {
        // Create mode - add initial activity log
        activityLogs.push(
          createActivityLog('created', `Trailer ${formattedTrailerName} created`, undefined, true)
        );
      }

      const trailerData: Omit<Trailer, 'id' | 'createdAt' | 'updatedAt'> = {
        trailerName: formattedTrailerName,
        registrationNumber: formData.registrationNumber.trim(),
        parkingAddress: formData.parkingAddress.trim(),
        state: formData.state,
        city: formData.city,
        inventory: updatedInventory,
        status: 'available',
        activityLogs,
      };

      onSave(trailerData);
      
      setErrors({});
    } catch (error) {
      console.error('Error saving trailer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Actions */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? `Edit Trailer ${trailer?.trailerName}` : 'Add New Trailer'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditMode ? 'Update trailer information and inventory' : 'Create a new trailer with inventory configuration'}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
              icon={X}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="trailer-form"
              disabled={isSubmitting}
              icon={Save}
            >
              {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Trailer' : 'Create Trailer')}
            </Button>
          </div>
        </div>

        <form id="trailer-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Basic Information + Film Sheets */}
            <div className="space-y-8">
              {/* Basic Information Section */}
              <Card>
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 pb-4 border-b border-gray-200">
                    Basic Information
                  </h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="trailerName" className="block text-sm font-medium text-gray-700 mb-2">
                        Trailer Name *
                      </label>
                      <input
                        type="text"
                        id="trailerName"
                        value={formData.trailerName}
                        onChange={(e) => handleInputChange('trailerName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.trailerName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter trailer name"
                      />
                      {errors.trailerName && (
                        <p className="mt-2 text-sm text-red-600">{errors.trailerName}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Number *
                      </label>
                      <input
                        type="text"
                        id="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.registrationNumber ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter registration number"
                      />
                      {errors.registrationNumber && (
                        <p className="mt-2 text-sm text-red-600">{errors.registrationNumber}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="parkingAddress" className="block text-sm font-medium text-gray-700 mb-2">
                        Parking Address *
                      </label>
                      <input
                        type="text"
                        id="parkingAddress"
                        value={formData.parkingAddress}
                        onChange={(e) => handleInputChange('parkingAddress', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                          errors.parkingAddress ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter parking address"
                      />
                      {errors.parkingAddress && (
                        <p className="mt-2 text-sm text-red-600">{errors.parkingAddress}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <select
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.state ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select state</option>
                          {USA_STATES.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        {errors.state && (
                          <p className="mt-2 text-sm text-red-600">{errors.state}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <select
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          disabled={!formData.state}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.city ? 'border-red-300' : 'border-gray-300'
                          } ${!formData.state ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                          <option value="">Select city</option>
                          {availableCities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                        {errors.city && (
                          <p className="mt-2 text-sm text-red-600">{errors.city}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Film Sheets Section */}
              <Card>
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 pb-4 border-b border-gray-200">
                    Film Sheets Inventory
                  </h2>
                  
                  <p className="text-gray-600 text-sm">
                    Configure current stock levels and thresholds for each film sheet type.
                  </p>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {FILM_SHEET_TYPES.map((sheetType) => {
                      return (
                        <div key={sheetType} className="p-4 border border-gray-200 rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">{sheetType}</h3>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Initial Stock</label>
                              <input
                                type="number"
                                min="0"
                                value={filmSheetCurrentStock[sheetType]}
                                onChange={(e) => handleFilmSheetCurrentStockChange(sheetType, parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Inventory Left</label>
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
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column: Tools Inventory */}
            <div className="space-y-8">
              <Card>
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 pb-4 border-b border-gray-200">
                    Tools Inventory
                  </h2>
                  
                  <p className="text-gray-600 text-sm">
                    Configure current stock levels and thresholds for each tool. The system will alert when stock falls below threshold levels.
                  </p>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {TOOL_INVENTORY.map((tool) => {
                      return (
                        <div key={tool.name} className="p-4 border border-gray-200 rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">{tool.name}</h3>
                              <p className="text-xs text-gray-500">Default threshold: {tool.defaultThreshold}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Initial Stock</label>
                              <input
                                type="number"
                                min="0"
                                value={toolCurrentStock[tool.name]}
                                onChange={(e) => handleToolCurrentStockChange(tool.name, parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary focus:border-transparent"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Inventory Left</label>
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
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>
          </div>

        </form>
      </div>


    </div>
  );
};
