import React, { useState } from 'react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { Trailer, FilmSheetType } from '../../../../types';
import { 
  TOOL_INVENTORY,
  FILM_SHEET_TYPES, 
  USA_STATES,
  USA_CITIES,
  validateTrailerForm, 
  createInitialInventory,
  createActivityLog,
  formatTrailerName,
  TrailerFormData
} from '../../utils/trailerUtils';

interface CreateTrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTrailer: (trailer: Omit<Trailer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  existingTrailerNumbers: string[];
}

/**
 * Modal for creating new trailers with basic info and inventory setup
 * Follows the specified design with 520px max width and 24px padding
 */
export const CreateTrailerModal: React.FC<CreateTrailerModalProps> = ({
  isOpen,
  onClose,
  onCreateTrailer,
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
      [sheetType]: 10, // Default threshold
    }), {} as Record<FilmSheetType, number>),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'cart' | 'caulking' | 'trailer' | 'film'>('cart');
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Update available cities when state changes
  React.useEffect(() => {
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

  const handleInputChange = (field: keyof Omit<TrailerFormData, 'toolThresholds' | 'filmSheetThresholds' | 'rooms' | 'totalSqFeet'>, value: string | number) => {
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
        [toolName]: Math.max(0, threshold), // Ensure non-negative
      },
    }));

    // Clear tool error
    const errorKey = `tool_${toolName}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleFilmSheetThresholdChange = (sheetType: FilmSheetType, threshold: number) => {
    setFormData(prev => ({
      ...prev,
      filmSheetThresholds: {
        ...prev.filmSheetThresholds,
        [sheetType]: Math.max(0, threshold), // Ensure non-negative
      },
    }));

    // Clear sheet error
    const errorKey = `sheet_${sheetType}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    const validation = validateTrailerForm(formData);
    
    // Check for duplicate trailer name
    const formattedTrailerName = formData.trailerName.trim();
    if (existingTrailerNumbers.includes(formattedTrailerName)) {
      validation.errors.trailerName = 'Trailer name already exists';
      validation.isValid = false;
    }

    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Create trailer data
      const inventory = createInitialInventory(formData.toolThresholds, formData.filmSheetThresholds);
      const now = new Date().toISOString();
      
      const newTrailer: Omit<Trailer, 'id' | 'createdAt' | 'updatedAt'> = {
        trailerName: formattedTrailerName,
        registrationNumber: formData.registrationNumber.trim(),
        parkingAddress: formData.parkingAddress.trim(),
        state: formData.state,
        city: formData.city,
        inventory,
        status: 'available',
        activityLogs: [
          createActivityLog('created', `Trailer ${formattedTrailerName} created`, undefined, true),
        ],
      };

      onCreateTrailer(newTrailer);
      
      // Reset form
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
      
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating trailer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
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
    setErrors({});
    setActiveTab('cart');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Create New Trailer"
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('cart')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'cart'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Cart Item
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('caulking')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'caulking'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Caulking Supplies
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trailer')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'trailer'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Trailer Item
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('film')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'film'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Film
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[400px]">
          {activeTab === 'cart' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Cart Item
              </h3>
              <p className="text-sm text-gray-600">
                Configure current stock levels and thresholds for each cart item. The system will alert when stock falls below threshold levels.
              </p>

              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
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
                      <label className="block text-sm font-medium text-gray-700">
                        {item}
                      </label>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Min Threshold</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Current Inventory</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
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

              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
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
                      <label className="block text-sm font-medium text-gray-700">
                        {item}
                      </label>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Min Threshold</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Current Inventory</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
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

              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
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
                      <label className="block text-sm font-medium text-gray-700">
                        {item}
                      </label>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Min Threshold</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Current Inventory</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'film' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                {[
                  'SW450',
                  'SW440BR',
                  'SW600BR',
                  'CL700 EXT',
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
                      <label className="block text-sm font-medium text-gray-700">
                        {item}
                      </label>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Min Threshold</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-gray-500">Current Inventory</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
            {isSubmitting ? 'Creating...' : 'Create Trailer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
