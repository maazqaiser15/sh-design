import React, { useState } from 'react';
import { Package, Plane, Plus, Edit, Trash2, Calendar, MapPin, Users } from 'lucide-react';
import { Card } from '../../../../common/components/Card';
import { Button } from '../../../../common/components/Button';
import { LogisticsItem, TravelPlan, LogisticsTravelData } from '../../types/logisticsTravel';

interface LogisticsTravelCardProps {
  data: LogisticsTravelData;
  onAddLogistics: () => void;
  onEditLogistics: (logistics: LogisticsItem) => void;
  onDeleteLogistics: (id: string) => void;
  onAddTravel: () => void;
  onEditTravel: (travel: TravelPlan) => void;
  onDeleteTravel: (id: string) => void;
}

export const LogisticsTravelCard: React.FC<LogisticsTravelCardProps> = ({
  data,
  onAddLogistics,
  onEditLogistics,
  onDeleteLogistics,
  onAddTravel,
  onEditTravel,
  onDeleteTravel
}) => {
  const [expandedTravel, setExpandedTravel] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const hasData = data.logistics.length > 0 || data.travelPlans.length > 0;

  if (!hasData) {
    return (
      <Card className="p-6 mb-6">
        <div className="text-center py-8">
          <div className="flex justify-center space-x-4 mb-4">
            <Package className="w-12 h-12 text-gray-300" />
            <Plane className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No logistics or travel plans added yet
          </h3>
          <p className="text-gray-500 mb-6">
            Add logistics and travel arrangements for this project
          </p>
          <div className="flex justify-center space-x-3">
            <Button
              variant="primary"
              size="sm"
              onClick={onAddLogistics}
              icon={Package}
            >
              Add Logistics
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onAddTravel}
              icon={Plane}
            >
              Add Travel Plan
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Logistics & Travel</h3>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddLogistics}
            icon={Plus}
          >
            Add Logistics
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddTravel}
            icon={Plus}
          >
            Add Travel
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Logistics Section */}
        {data.logistics.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Package className="w-5 h-5 text-blue-600" />
              <h4 className="text-md font-medium text-gray-900">Logistics ({data.logistics.length})</h4>
            </div>
            <div className="space-y-3">
              {data.logistics.map(logistics => (
                <div
                  key={logistics.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h5 className="font-medium text-gray-900">{logistics.name}</h5>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {logistics.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{logistics.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">Qty:</span>
                        <span>{logistics.quantity}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{logistics.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(logistics.expectedDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditLogistics(logistics)}
                      icon={Edit}
                    >
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteLogistics(logistics.id)}
                      icon={Trash2}
                      className="text-red-600 hover:text-red-700"
                    >
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Travel Plans Section */}
        {data.travelPlans.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Plane className="w-5 h-5 text-green-600" />
              <h4 className="text-md font-medium text-gray-900">Travel Plans ({data.travelPlans.length})</h4>
            </div>
            <div className="space-y-3">
              {data.travelPlans.map(travel => (
                <div
                  key={travel.id}
                  className="p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h5 className="font-medium text-gray-900">
                        {travel.departureLocation} → {travel.destination}
                      </h5>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {travel.travelType}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditTravel(travel)}
                        icon={Edit}
                      >
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteTravel(travel.id)}
                        icon={Trash2}
                        className="text-red-600 hover:text-red-700"
                      >
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDate(travel.departureDate)}
                        {travel.returnDate && ` - ${formatDate(travel.returnDate)}`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{travel.assignedTeamMembers.length} team members</span>
                    </div>
                  </div>

                  {/* Team Members Details */}
                  {travel.assignedTeamMembers.length > 0 && (
                    <div className="mt-3">
                      <button
                        onClick={() => setExpandedTravel(expandedTravel === travel.id ? null : travel.id)}
                        className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700"
                      >
                        <span>
                          {expandedTravel === travel.id ? 'Hide' : 'Show'} team members
                        </span>
                        <span className={`transform transition-transform ${
                          expandedTravel === travel.id ? 'rotate-180' : ''
                        }`}>
                          ▼
                        </span>
                      </button>
                      
                      {expandedTravel === travel.id && (
                        <div className="mt-2 p-3 bg-white rounded border">
                          <div className="text-xs text-gray-600">
                            Team member details would be shown here
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
