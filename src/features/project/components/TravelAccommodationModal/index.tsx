import React, { useState } from 'react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';

export interface TravelAccommodationData {
  travel: {
    enabled: boolean;
    method: 'air' | 'road';
    teamMembers: number;
  };
  accommodation: {
    enabled: boolean;
    teamMembers: number;
  };
}

interface TravelAccommodationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TravelAccommodationData) => void;
}

export const TravelAccommodationModal: React.FC<TravelAccommodationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [travelEnabled, setTravelEnabled] = useState(false);
  const [travelMethod, setTravelMethod] = useState<'air' | 'road'>('air');
  const [travelTeamMembers, setTravelTeamMembers] = useState(1);

  const [accommodationEnabled, setAccommodationEnabled] = useState(false);
  const [accommodationTeamMembers, setAccommodationTeamMembers] = useState(1);

  const handleSubmit = () => {
    const data: TravelAccommodationData = {
      travel: {
        enabled: travelEnabled,
        method: travelMethod,
        teamMembers: travelEnabled ? travelTeamMembers : 0,
      },
      accommodation: {
        enabled: accommodationEnabled,
        teamMembers: accommodationEnabled ? accommodationTeamMembers : 0,
      },
    };
    onSubmit(data);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="w-full max-w-[540px] mx-auto p-6">
        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Request Travel & Accommodation
          </h2>
        </div>

        {/* Modal Content */}
        <div className="flex gap-6 mb-6">
          {/* Travel Details Section */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Travel Details</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={travelEnabled}
                    onChange={(e) => setTravelEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {travelEnabled && (
                <div className="space-y-3 pl-2">
                  {/* Travel Method Radio Buttons */}
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
                      <span className="ml-2 text-sm text-gray-700">Travel by Air</span>
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
                      <span className="ml-2 text-sm text-gray-700">Travel by Road</span>
                    </label>
                  </div>

                  {/* Team Members Input */}
                  <div>
                    <label htmlFor="travelTeamMembers" className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Team Members
                    </label>
                    <input
                      type="number"
                      id="travelTeamMembers"
                      value={travelTeamMembers}
                      onChange={(e) => setTravelTeamMembers(Math.max(1, Math.min(50, Number(e.target.value))))}
                      min="1"
                      max="50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Divider Line */}
          <div className="w-px bg-gray-200"></div>

          {/* Accommodation Request Section */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">Accommodation Request</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accommodationEnabled}
                    onChange={(e) => setAccommodationEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {accommodationEnabled && (
                <div className="pl-2">
                  <div>
                    <label htmlFor="accommodationTeamMembers" className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Team Members
                    </label>
                    <input
                      type="number"
                      id="accommodationTeamMembers"
                      value={accommodationTeamMembers}
                      onChange={(e) => setAccommodationTeamMembers(Math.max(1, Math.min(50, Number(e.target.value))))}
                      min="1"
                      max="50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
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
            className="px-6 py-2"
          >
            Submit Request
          </Button>
        </div>
      </div>
    </Modal>
  );
};