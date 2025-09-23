import React from 'react';
import { Users, Phone, Edit, Plane, Trash2, Truck, RefreshCw } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { AssignedTeam } from '../../types/projectDetails';
import { TeamMember } from '../../types/teamMembers';
import { TravelPlan } from '../../types/logisticsTravel';
import { LogisticsCard } from '../LogisticsCard';

interface KeyInfoSectionProps {
  assignedTeam: AssignedTeam | null;
  travelPlans: TravelPlan[];
  assignedTrailer: any;
  projectFilmRequirements: any[];
  onViewTeam: () => void;
  onAssignTeam: () => void;
  onEditTeam: () => void;
  onSetupTravel: () => void;
  onAddTravel: () => void;
  onEditTravel: (travel: TravelPlan) => void;
  onDeleteTravel: (id: string) => void;
  onAssignTrailer: () => void;
  onNotifyHouseManager: () => void;
  onUploadReceipt: (file: File) => void;
  onRemoveReceipt: (receiptId: string) => void;
  onMarkCompleted: () => void;
  onUpdatePreparationTask?: (taskLabel: string, completed: boolean) => void;
}

/**
 * KeyInfoSection - Overview cards for team, trailer, and travel
 * Shows key project information in a compact card format with three cards in one row
 */
export const KeyInfoSection: React.FC<KeyInfoSectionProps> = ({
  assignedTeam,
  travelPlans,
  assignedTrailer,
  projectFilmRequirements,
  onViewTeam,
  onAssignTeam,
  onEditTeam,
  onSetupTravel,
  onAddTravel,
  onEditTravel,
  onDeleteTravel,
  onAssignTrailer,
  onNotifyHouseManager,
  onUploadReceipt,
  onRemoveReceipt,
  onMarkCompleted,
  onUpdatePreparationTask
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTeamStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-50';
      case 'busy':
        return 'text-yellow-600 bg-yellow-50';
      case 'unavailable':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTeamStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'unavailable':
        return 'Unavailable';
      default:
        return status;
    }
  };

  // Get trailer film inventory (mock data - in real app this would come from trailer data)
  const getTrailerFilmInventory = () => {
    if (!assignedTrailer) return [];
    
    // Mock film inventory data
    const filmInventory = [
      { type: 'BR', quantity: 15 },
      { type: 'Riot+', quantity: 10 },
      { type: 'Riot', quantity: 8 },
      { type: 'Riot -', quantity: 5 },
      { type: 'FER', quantity: 3 },
      { type: 'Smash', quantity: 2 },
      { type: 'Tint NI', quantity: 1 },
      { type: 'Tint Incl', quantity: 1 }
    ];
    
    return filmInventory.filter(film => film.quantity > 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 items-stretch">
      {/* Assigned Team Card */}
      <Card className="p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Assigned Team</h3>
          </div>
          {assignedTeam && (
            <span className="text-sm font-medium text-gray-500">
              {assignedTeam.count} member{assignedTeam.count !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        {assignedTeam && assignedTeam.members.length > 0 ? (
          <div className="flex-1 flex flex-col">
            {/* Team Members Grid */}
            <div className="grid grid-cols-1 gap-3 mb-4">
              {assignedTeam.members.map((member) => (
                <div key={member.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-medium text-blue-600">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTeamStatusColor(member.availability)}`}>
                        {getTeamStatusText(member.availability)}
                      </span>
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Phone className="w-3 h-3" />
                        <span className="text-xs">{member.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        ) : (
          <div className="text-center py-8 flex-1 flex flex-col justify-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm text-gray-500 mb-6">No team assigned yet</p>
            <Button
              variant="primary"
              size="sm"
              onClick={onAssignTeam}
              className="w-full mt-auto"
            >
              Assign Team
            </Button>
          </div>
        )}
      </Card>

      {/* Assign Trailer Card */}
      <Card className="p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900">Assign Trailer</h3>
          </div>
          {assignedTrailer && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAssignTrailer}
              icon={RefreshCw}
            >
              Change
            </Button>
          )}
        </div>

        {assignedTrailer ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 bg-gray-50 rounded-lg border flex-1">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">
                  {assignedTrailer.trailerName}
                </h4>
                <span className="text-sm text-gray-500 font-medium">
                  {assignedTrailer.registrationNumber}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Location:</span>
                  <span className="text-sm text-gray-600">{assignedTrailer.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    assignedTrailer.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : assignedTrailer.status === 'in-use'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {assignedTrailer.status}
                  </span>
                </div>
                
                {/* Film Inventory */}
                <div className="mt-3">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">Films in Trailer:</span>
                  <div className="space-y-1">
                    {getTrailerFilmInventory().map((film, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{film.type}</span>
                        <span className="text-gray-500">{film.quantity} sheets</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {assignedTrailer.notes && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700 block mb-2">Notes:</span>
                    <p className="text-sm text-gray-600">{assignedTrailer.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 flex-1 flex flex-col justify-center">
            <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm text-gray-500 mb-6">No trailer assigned yet</p>
            <Button
              variant="primary"
              size="sm"
              onClick={onAssignTrailer}
              className="w-full mt-auto"
            >
              Assign Trailer
            </Button>
          </div>
        )}
      </Card>

      {/* Logistics Card */}
      <LogisticsCard
        filmRequirements={projectFilmRequirements}
        assignedTrailer={assignedTrailer}
        onUploadReceipt={onUploadReceipt}
        onRemoveReceipt={onRemoveReceipt}
        onMarkCompleted={onMarkCompleted}
        onUpdatePreparationTask={onUpdatePreparationTask}
      />

      {/* Travel Setup Card */}
      <Card className="p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Plane className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Travel Setup</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddTravel}
            icon={Edit}
          >
            Add
          </Button>
        </div>
        
        {travelPlans.length > 0 ? (
          <div className="space-y-3 flex-1">
            <div className="text-sm text-gray-600 mb-3">
              {travelPlans.length} travel plan{travelPlans.length !== 1 ? 's' : ''} created
            </div>
            
            {travelPlans.slice(0, 2).map((plan) => (
              <div key={plan.id} className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {plan.travelMethod === 'flight' ? 'Flight' : 
                     plan.travelMethod === 'road' ? 'Road Trip' : 'Other Travel'}
                  </h4>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTravel(plan)}
                      className="p-1 h-6 w-6"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTravel(plan.id)}
                      className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <p>People: {plan.numberOfPeople}</p>
                  <p>Hotel: {plan.hotelBooking ? 'Booked' : 'Not booked'}</p>
                </div>
              </div>
            ))}
            
            {travelPlans.length > 2 && (
              <p className="text-xs text-gray-500 text-center">
                +{travelPlans.length - 2} more plans
              </p>
            )}
            
            <div className="mt-auto pt-4">
              <Button
                variant="primary"
                size="sm"
                onClick={onSetupTravel}
                className="w-full"
              >
                Setup Travel
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 flex-1 flex flex-col justify-center">
            <Plane className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm text-gray-500 mb-6">No travel plans yet</p>
            <Button
              variant="primary"
              size="sm"
              onClick={onAddTravel}
              className="w-full mt-auto"
            >
              Setup Travel
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};