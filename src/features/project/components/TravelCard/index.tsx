import React, { useState } from 'react';
import { TravelPlanDetails } from '../../types/preparation';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';

interface TravelCardProps {
  travelPlan: TravelPlanDetails;
  onUpdateTravelPlan: (plan: TravelPlanDetails) => void;
}

/**
 * TravelCard - Card with checkboxes and conditional fields for travel planning
 * Handles hotel booking, travel requirements, and manager notifications
 */
export const TravelCard: React.FC<TravelCardProps> = ({
  travelPlan,
  onUpdateTravelPlan
}) => {
  const [showToast, setShowToast] = useState<{ type: 'hotel' | 'travel'; message: string } | null>(null);

  const handleHotelBookingChange = (checked: boolean) => {
    const updatedPlan = { ...travelPlan, hotelBooking: checked };
    onUpdateTravelPlan(updatedPlan);
    
    if (checked) {
      setShowToast({
        type: 'hotel',
        message: 'Informed House Manager about hotel booking'
      });
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  const handleTravelRequiredChange = (checked: boolean) => {
    const updatedPlan = { 
      ...travelPlan, 
      travelRequired: checked,
      travelMethod: checked ? travelPlan.travelMethod : undefined,
      numberOfPeople: checked ? travelPlan.numberOfPeople : undefined
    };
    onUpdateTravelPlan(updatedPlan);
    
    if (checked) {
      setShowToast({
        type: 'travel',
        message: 'Notified House Manager about travel requirements'
      });
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  const handleTravelMethodChange = (method: 'air' | 'road') => {
    onUpdateTravelPlan({ ...travelPlan, travelMethod: method });
  };

  const handleNumberOfPeopleChange = (count: number) => {
    onUpdateTravelPlan({ ...travelPlan, numberOfPeople: count });
  };

  return (
    <div className="relative">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Travel</h3>
            <p className="text-sm text-gray-600 mt-1">
              Plan travel and accommodation
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Hotel Booking */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hotel-booking"
                checked={travelPlan.hotelBooking}
                onChange={(e) => handleHotelBookingChange(e.target.checked)}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="hotel-booking" className="text-sm font-medium text-gray-900">
                Hotel Booking?
              </label>
            </div>
            {travelPlan.hotelBooking && (
              <div className="flex items-center space-x-2 text-xs text-green-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>House Manager Notified</span>
              </div>
            )}
          </div>

          {/* Travel Required */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="travel-required"
                  checked={travelPlan.travelRequired}
                  onChange={(e) => handleTravelRequiredChange(e.target.checked)}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="travel-required" className="text-sm font-medium text-gray-900">
                  Travel Required?
                </label>
              </div>
              {travelPlan.travelRequired && (
                <div className="flex items-center space-x-2 text-xs text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>House Manager Notified</span>
                </div>
              )}
            </div>

            {/* Travel Details - Only show if travel is required */}
            {travelPlan.travelRequired && (
              <div className="ml-7 space-y-3 p-4 bg-white border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Travel Method
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="travel-method"
                        value="air"
                        checked={travelPlan.travelMethod === 'air'}
                        onChange={() => handleTravelMethodChange('air')}
                        className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700">By Air</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="travel-method"
                        value="road"
                        checked={travelPlan.travelMethod === 'road'}
                        onChange={() => handleTravelMethodChange('road')}
                        className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700">By Road</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of People
                  </label>
                  <select
                    value={travelPlan.numberOfPeople || 1}
                    onChange={(e) => handleNumberOfPeopleChange(parseInt(e.target.value))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                {/* Travel Summary */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-blue-900 mb-1">Travel Summary</div>
                  <div className="text-xs text-blue-800">
                    <div>Method: {travelPlan.travelMethod === 'air' ? '✈️ By Air' : '🚗 By Road'}</div>
                    <div>People: {travelPlan.numberOfPeople} person(s)</div>
                    <div>Status: House Manager notified ✅</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-900 mb-2">Travel Status</div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  travelPlan.hotelBooking ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <span className="text-gray-600">Hotel Booking</span>
                <span className={`font-medium ${
                  travelPlan.hotelBooking ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {travelPlan.hotelBooking ? 'Confirmed' : 'Not Required'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  travelPlan.travelRequired ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
                <span className="text-gray-600">Travel</span>
                <span className={`font-medium ${
                  travelPlan.travelRequired ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {travelPlan.travelRequired ? 'Required' : 'Not Required'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Toast Notifications */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
            showToast.type === 'hotel' 
              ? 'bg-blue-100 text-blue-800 border border-blue-200'
              : 'bg-green-100 text-green-800 border border-green-200'
          }`}>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>{showToast.message}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
