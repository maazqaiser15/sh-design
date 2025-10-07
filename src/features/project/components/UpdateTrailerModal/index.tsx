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
  const [activeTab, setActiveTab] = useState<'cart' | 'caulking' | 'trailer' | 'film'>('cart');


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
    setActiveTab('cart');
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

              {/* Column Headers */}
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">Item Name</span>
                  </div>
                  <div className="flex items-center gap-4">
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
                <h4 className="text-md font-medium text-gray-800">Protective Films</h4>
                
                {/* Column Headers for Protective Films */}
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
                        <span className="text-xs font-medium text-gray-500">48</span>
                      </div>
                      <div className="w-20 text-center">
                        <span className="text-xs font-medium text-gray-500">60</span>
                      </div>
                      <div className="w-20 text-center">
                        <span className="text-xs font-medium text-gray-500">72</span>
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tint Films Section */}
              <div className="space-y-3">
                <h4 className="text-md font-medium text-gray-800">Tint Films</h4>
                
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
