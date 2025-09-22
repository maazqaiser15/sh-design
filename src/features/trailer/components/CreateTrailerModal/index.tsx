import React, { useState } from 'react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { Trailer, FilmSheetType } from '../../../../types';
import { 
  TOOL_INVENTORY,
  FILM_SHEET_TYPES, 
  TRAILER_LOCATIONS, 
  validateTrailerForm, 
  createInitialInventory,
  createActivityLog,
  formatTrailerNumber,
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
    trailerNumber: '',
    registrationNumber: '',
    location: '',
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
  const [activeSection, setActiveSection] = useState<'basic' | 'tools' | 'sheets'>('basic');

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
    
    // Check for duplicate trailer number
    const formattedTrailerNumber = formatTrailerNumber(formData.trailerNumber);
    if (existingTrailerNumbers.includes(formattedTrailerNumber)) {
      validation.errors.trailerNumber = 'Trailer number already exists';
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
        trailerNumber: formattedTrailerNumber,
        registrationNumber: formData.registrationNumber.trim(),
        location: formData.location,
        inventory,
        activityLogs: [
          createActivityLog('created', `Trailer ${formattedTrailerNumber} created`, undefined, true),
        ],
      };

      onCreateTrailer(newTrailer);
      
      // Reset form
      setFormData({
        trailerNumber: '',
        registrationNumber: '',
        location: '',
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
      trailerNumber: '',
      registrationNumber: '',
      location: '',
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
    setActiveSection('basic');
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
        {/* Section Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveSection('basic')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeSection === 'basic'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Basic Info
          </button>
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
            onClick={() => setActiveSection('sheets')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeSection === 'sheets'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Film Sheets
          </button>
        </div>

        {/* Section 1: Basic Information */}
        {activeSection === 'basic' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="trailerNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Trailer Name *
                </label>
                <input
                  type="text"
                  id="trailerNumber"
                  value={formData.trailerNumber}
                  onChange={(e) => handleInputChange('trailerNumber', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.trailerNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter trailer number"
                />
                {errors.trailerNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.trailerNumber}</p>
                )}
              </div>

              <div>
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number *
                </label>
                <input
                  type="text"
                  id="registrationNumber"
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
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <select
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.location ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select location</option>
                {TRAILER_LOCATIONS.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>
          </div>
        )}

        {/* Section 2: Tools Inventory */}
        {activeSection === 'tools' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
              Tools Inventory (with default thresholds)
            </h3>
            
            <p className="text-sm text-gray-600">
              Set the minimum threshold for each tool. The system will alert when stock falls below these levels.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {TOOL_INVENTORY.map((tool) => (
                <div key={tool.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {tool.name}
                    </label>
                    <span className="text-xs text-gray-500">Default: {tool.defaultThreshold}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={formData.toolThresholds[tool.name] || tool.defaultThreshold}
                      onChange={(e) => handleToolThresholdChange(tool.name, parseInt(e.target.value) || 0)}
                      className={`w-20 px-2 py-1 border rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors[`tool_${tool.name}`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <span className="text-sm text-gray-500">units</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Film Sheets */}
        {activeSection === 'sheets' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 pb-2 border-b border-gray-200">
              Film Sheets Configuration
            </h3>
            

            <p className="text-sm text-gray-600">
              Set the minimum threshold for each film sheet type. The system will alert when stock falls below these levels.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {FILM_SHEET_TYPES.map((sheetType) => (
                <div key={sheetType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {sheetType}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={formData.filmSheetThresholds[sheetType] || 10}
                      onChange={(e) => handleFilmSheetThresholdChange(sheetType, parseInt(e.target.value) || 0)}
                      className={`w-20 px-2 py-1 border rounded-md text-center focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors[`sheet_${sheetType}`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <span className="text-sm text-gray-500">units</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            {activeSection !== 'basic' && (
              <Button
                type="button"
                variant="secondary"
                onClick={() => setActiveSection(activeSection === 'tools' ? 'basic' : 'tools')}
              >
                Previous
              </Button>
            )}
            {activeSection !== 'sheets' && (
              <Button
                type="button"
                variant="primary"
                onClick={() => setActiveSection(activeSection === 'basic' ? 'tools' : 'sheets')}
              >
                Next
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
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
        </div>
      </form>
    </Modal>
  );
};
