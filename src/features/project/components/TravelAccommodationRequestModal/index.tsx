import React, { useState } from 'react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { Plane, Hotel } from 'lucide-react';

export interface TravelAccommodationRequestData {
  travelRequired: boolean;
  accommodationRequired: boolean;
  travelMethod?: 'air' | 'road';
  numberOfTeamMembers: number;
}

interface TravelAccommodationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TravelAccommodationRequestData) => void;
}

export const TravelAccommodationRequestModal: React.FC<TravelAccommodationRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [travelRequired, setTravelRequired] = useState(false);
  const [accommodationRequired, setAccommodationRequired] = useState(false);
  const [travelMethod, setTravelMethod] = useState<'air' | 'road'>('air');
  const [numberOfTeamMembers, setNumberOfTeamMembers] = useState(1);

  const handleSubmit = () => {
    const data: TravelAccommodationRequestData = {
      travelRequired,
      accommodationRequired,
      travelMethod: travelRequired ? travelMethod : undefined,
      numberOfTeamMembers,
    };
    onSubmit(data);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const isFormValid = () => {
    return travelRequired || accommodationRequired;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Travel & Accommodation" size="lg">
      <div className="space-y-6">
        <p className="text-gray-600 text-sm">
          Please specify your travel and accommodation requirements. You can add detailed information later.
        </p>

        {/* Travel Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Travel Required</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={travelRequired}
                onChange={(e) => setTravelRequired(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {travelRequired && (
            <div className="space-y-4 pl-2">
              {/* Travel Method Selection */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">
                  Travel Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="travelMethod"
                      value="air"
                      checked={travelMethod === 'air'}
                      onChange={() => setTravelMethod('air')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-blue-700">Travel by Air</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="travelMethod"
                      value="road"
                      checked={travelMethod === 'road'}
                      onChange={() => setTravelMethod('road')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-blue-700">Travel by Road</span>
                  </label>
                </div>
              </div>

              {/* Number of Team Members */}
              <div>
                <label htmlFor="teamMembers" className="block text-sm font-medium text-blue-700 mb-1">
                  Number of Team Members
                </label>
                <input
                  type="number"
                  id="teamMembers"
                  value={numberOfTeamMembers}
                  onChange={(e) => setNumberOfTeamMembers(Math.max(1, Number(e.target.value)))}
                  min="1"
                  className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Accommodation Section */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Hotel className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">Accommodation Required</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={accommodationRequired}
                onChange={(e) => setAccommodationRequired(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          {accommodationRequired && (
            <div className="pl-2">
              <p className="text-sm text-green-700">
                Accommodation details can be added later after the request is approved.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid()}
            className="px-6 py-2"
          >
            Submit Request
          </Button>
        </div>
      </div>
    </Modal>
  );
};
