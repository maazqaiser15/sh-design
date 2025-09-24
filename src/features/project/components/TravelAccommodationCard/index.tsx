import React, { useState } from 'react';
import { Plane, Hotel, CheckCircle, Plus, Edit } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { TravelPlan } from '../../types/logisticsTravel';

interface TravelAccommodationCardProps {
  travelPlans: TravelPlan[];
  onAddTravel?: () => void;
  onEditTravel?: (travel: TravelPlan) => void;
  onDeleteTravel?: (id: string) => void;
  onMarkComplete?: () => void;
}

/**
 * TravelAccommodationCard - Matches the design from the image
 * Shows travel and accommodation setup with checkboxes and details
 */
export const TravelAccommodationCard: React.FC<TravelAccommodationCardProps> = ({
  travelPlans,
  onAddTravel,
  onEditTravel,
  onDeleteTravel,
  onMarkComplete
}) => {
  const [travelSetup, setTravelSetup] = useState({
    travelRequired: false,
    hotelRequired: false
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Plane className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Travel & Accommodation</h3>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="travel-required"
            checked={travelSetup.travelRequired}
            onChange={(e) => setTravelSetup(prev => ({ ...prev, travelRequired: e.target.checked }))}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="travel-required" className="text-sm font-medium text-gray-700">
            Travel Required
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="hotel-required"
            checked={travelSetup.hotelRequired}
            onChange={(e) => setTravelSetup(prev => ({ ...prev, hotelRequired: e.target.checked }))}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="hotel-required" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Hotel className="w-4 h-4" />
            <span>Hotel Reservation Required</span>
          </label>
        </div>
      </div>

      {/* Travel Details */}
      {travelPlans.length > 0 && (
        <div className="mt-4 space-y-3">
          {travelPlans.map((travel) => (
            <div key={travel.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-blue-900">Travel Details</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditTravel?.(travel)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Route:</span>
                  <span className="text-blue-900 font-medium">
                    {travel.departureLocation} → {travel.arrivalLocation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Date:</span>
                  <span className="text-blue-900 font-medium">
                    {formatDate(travel.departureDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Attachments:</span>
                  <span className="text-blue-900 font-medium underline cursor-pointer">
                    attachment
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mark as Complete Button */}
      <div className="mt-4">
        <Button
          variant="primary"
          size="sm"
          onClick={onMarkComplete}
          className="w-full"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark as Complete
        </Button>
      </div>
    </Card>
  );
};
