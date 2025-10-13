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
import FormField from 'common/components/FormField';
import FormikSelectField from 'common/components/SelectField/FormikSelectField';
import { Formik } from 'formik';
import * as Yup from 'yup';

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
  const [activeTab, setActiveTab] = useState<'cart' | 'caulking' | 'trailer' | 'film'>('cart');

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
      (trailer.inventory?.tools ?? []).forEach(item => {
        toolThresholds[item.toolName] = item.threshold;
      });

      // Initialize film sheet thresholds with defaults, then override with trailer data
      const filmSheetThresholds = FILM_SHEET_TYPES.reduce((acc, sheetType) => ({
        ...acc,
        [sheetType]: 10, // Default threshold
      }), {} as Record<FilmSheetType, number>);

      // Override with actual trailer data
      (trailer.inventory?.filmSheets ?? []).forEach(item => {
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
      (trailer.inventory?.tools ?? []).forEach(item => {
        toolCurrentStock[item.toolName] = item.currentStock;
      });

      setToolCurrentStock(toolCurrentStock);

      // Initialize film sheet current stock with defaults, then override with trailer data
      const filmSheetCurrentStock = FILM_SHEET_TYPES.reduce((acc, sheetType) => ({
        ...acc,
        [sheetType]: 0,
      }), {} as Record<FilmSheetType, number>);

      // Override with actual trailer data
      (trailer.inventory?.filmSheets ?? []).forEach(item => {
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
        const hasToolChanges = (trailer.inventory?.tools ?? []).some(tool => {
          const newTool = updatedTools.find(t => t.toolName === tool.toolName);
          return newTool && (newTool.currentStock !== tool.currentStock || newTool.threshold !== tool.threshold);
        });

        const hasFilmSheetChanges = (trailer.inventory?.filmSheets ?? []).some(sheet => {
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
    <div className="min-h-scree">
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
          {/* Basic Information Card */}
          <Card>
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 pb-4 border-b border-gray-200">
                Basic Information
              </h2>

              <Formik
                enableReinitialize
                initialValues={{
                  trailerName: formData.trailerName,
                  registrationNumber: formData.registrationNumber,
                  parkingAddress: formData.parkingAddress,
                  state: formData.state,
                  city: formData.city,
                }}
                validationSchema={Yup.object({
                  trailerName: Yup.string().trim().required('Trailer name is required'),
                  registrationNumber: Yup.string().trim().required('Registration number is required'),
                  parkingAddress: Yup.string().trim().required('Parking address is required'),
                  state: Yup.string().trim().required('State is required'),
                  city: Yup.string().trim().required('City is required'),
                })}
                onSubmit={() => { }}
              >
                {({ values, handleChange }) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      name="trailerName"
                      type='text'
                      placeholder='Enter trailer name'
                      label='Trailer Name *'
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        handleInputChange('trailerName', e.target.value);
                      }}
                      value={values.trailerName}
                    />

                    <FormField
                      name="registrationNumber"
                      type='text'
                      placeholder="Enter registration number"
                      label='Registration Number *'
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        handleInputChange('registrationNumber', e.target.value);
                      }}
                      value={values.registrationNumber}
                    />

                    <FormField
                      name="parkingAddress"
                      type='text'
                      placeholder="Enter parking address"
                      label='Parking Address *'
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleChange(e);
                        handleInputChange('parkingAddress', e.target.value);
                      }}
                      value={values.parkingAddress}
                    />

                    <FormikSelectField
                      name="state"
                      label={'State *'}
                      placeholder={'Select State'}
                      options={USA_STATES}
                      onChangeOverride={(val) => handleInputChange('state', val)}
                    />

                    <FormikSelectField
                      name="city"
                      label={'City *'}
                      placeholder={'Select City'}
                      options={availableCities}
                      onChangeOverride={(val) => handleInputChange('city', val)}
                    />
                  </div>
                )}
              </Formik>
            </div>
          </Card>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab('cart')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'cart'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Cart Item
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('caulking')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'caulking'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Caulking Supplies
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('trailer')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'trailer'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Trailer Item
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('film')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'film'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Film
            </button>
          </div>

          {/* Tab Content */}
          <Card>
            <div className="p-6 min-h-[400px]">
              {activeTab === 'cart' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Cart Item
                  </h3>
                  <p className="text-sm text-gray-600">
                    Configure current stock levels and thresholds for each cart item. The system will alert when stock falls below threshold levels.
                  </p>

                  {/* Column Headers */}
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">Item Name</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-center">
                          <span className="text-xs font-medium text-gray-500">Min Threshold</span>
                        </div>
                        <div className="w-20 text-center">
                          <span className="text-xs font-medium text-gray-500">Current Inventory</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                    {[
                      'Beer Tank W/ Hose',
                      'Hard Press',
                      'Red Card',
                      'Olfa',
                      'Olfa Blade Pack',
                      'Scrapers',
                      'Scraper Blade Pack',
                      'Pick',
                      '1 Qrt Acetone',
                      'Phillips Head SD',
                      'Window Squeegee',
                      'Sharps Containers',
                      'Headlamps',
                      'Batteries for Headlamps (Pack)'
                    ].map((item) => (
                      <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">
                            {item}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'caulking' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Caulking Supplies
                  </h3>
                  <p className="text-sm text-gray-600">
                    Configure current stock levels and thresholds for each caulking supply item. The system will alert when stock falls below threshold levels.
                  </p>

                  {/* Column Headers */}
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">Item Name</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-center">
                          <span className="text-xs font-medium text-gray-500">Min Threshold</span>
                        </div>
                        <div className="w-20 text-center">
                          <span className="text-xs font-medium text-gray-500">Current Inventory</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                    {[
                      'Rolls of Painters tape',
                      'Caulk Sausage Case',
                      'Caulk Gun (Sausage)',
                      'Pack Nitrile Gloves',
                      'Case of Blue Towels',
                      'Tub O\' Towels',
                      'Crocodile Wipes',
                      'Caulking Gun Tips'
                    ].map((item) => (
                      <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">
                            {item}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'trailer' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Trailer Item
                  </h3>
                  <p className="text-sm text-gray-600">
                    Configure current stock levels and thresholds for each trailer item. The system will alert when stock falls below threshold levels.
                  </p>

                  {/* Column Headers */}
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-700">Item Name</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-center">
                          <span className="text-xs font-medium text-gray-500">Min Threshold</span>
                        </div>
                        <div className="w-20 text-center">
                          <span className="text-xs font-medium text-gray-500">Current Inventory</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                    {[
                      'Cordless Drill',
                      'Allen Key Set',
                      'Channel Lock Pliers',
                      'Drill Bit Kit',
                      'Generator W/ Cord',
                      'Micro Fiber Package',
                      '5 Gal Gas Can',
                      'Air Compressor W/ Hose',
                      'Trash Can',
                      '55 Gal Trash Bags Case',
                      'Bath Towel',
                      'Towel Clips for hanging',
                      '5 Gal Buckets',
                      'Sharpie Pack',
                      'Dry Erase Marker Pack',
                      'Square',
                      'Non Serated Scissors',
                      'Ladders',
                      'Tank Fix Kits',
                      'Extras Spray Nozzles',
                      'Broom and Dust Pan',
                      'Scotch Brite Case',
                      'Sos Pad Box',
                      'Glass Thickness Gauge',
                      'PPE Bin/SDS Binder',
                      'Spare Cutter Blades (Box)',
                      'Tire Patch Kit',
                      'Parking Cones',
                      'Wheel Chalks',
                      'Tongue Lock'
                    ].map((item) => (
                      <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">
                            {item}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'film' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Film
                  </h3>
                  <p className="text-sm text-gray-600">
                    Configure current stock levels and thresholds for each film type. The system will alert when stock falls below threshold levels.
                  </p>

                  {/* Protective Films Section */}
                  <div className="space-y-3">

                    {/* Column Headers for Protective Films */}
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">Film Type</span>
                        </div>
                        <div className="flex items-center gap-2">

                          <div className='flex'>     <div className="w-20 text-center">
                            <span className="text-xs font-medium text-gray-500 flex">Min Threshold </span>
                          </div>
                            <span className='bg-gray-200 p-1  rounded-full w-[24px] text-xs h-[24px]'>48</span>
                            <div className="w-20 text-center">
                              <span className="text-xs font-medium text-gray-500 flex">Current Inventory </span>
                            </div> </div>

                          <div className='flex '>
                            <div className="w-20 text-center">
                              <span className="text-xs font-medium text-gray-500 flex">Min Threshold </span>
                            </div>
                            <span className='bg-gray-200 p-1 rounded-full w-[24px] text-xs h-[24px]'>60</span>
                            <div className="w-20 text-center">
                              <span className="text-xs font-medium text-gray-500 flex">Current Inventory </span>
                            </div>
                          </div>
                          <div className='flex'>
                            <div className="w-20 text-center">
                              <span className="text-xs font-medium text-gray-500 flex">Min Threshold  </span>
                            </div>
                            <span className='bg-gray-200 p-1 rounded-full w-[24px] text-xs h-[24px]'>72</span>
                            <div className="w-20 text-center">
                              <span className="text-xs font-medium text-gray-500 flex">Current Inventory </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {[
                        'SW450',
                        'SW440BR',
                        'SW600BR',
                        'CL700 EXT'
                      ].map((item) => (
                        <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-700">
                              {item}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tint Films Section */}
                  <div className="space-y-3">

                    {/* Column Headers for Tint Films */}
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-700">Film Type</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-20 text-center">
                            <span className="text-xs font-medium text-gray-500">Min Threshold</span>
                          </div>
                          <div className="w-20 text-center">
                            <span className="text-xs font-medium text-gray-500">Current Inventory</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {[
                        'Madico SG20 E Tint',
                        'Madico RS20 E Tint',
                        'Suntek SXT-20',
                        'Suntek SXT-35',
                        'Suntek IXT-20',
                        'Suntek IXT-35',
                        'Suntek Frost'
                      ].map((item) => (
                        <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-700">
                              {item}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

        </form>
      </div>


    </div>
  );
};
