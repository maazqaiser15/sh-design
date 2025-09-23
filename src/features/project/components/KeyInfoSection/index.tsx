import React from 'react';
import { Users, Clock, Phone, Edit, Plane, Trash2 } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { AssignedTeam, LogisticsInfo } from '../../types/projectDetails';
import { TeamMember } from '../../types/teamMembers';
import { LogisticsItem, TravelPlan } from '../../types/logisticsTravel';

interface KeyInfoSectionProps {
  assignedTeam: AssignedTeam | null;
  logistics: LogisticsInfo | null;
  logisticsItems: LogisticsItem[];
  travelPlans: TravelPlan[];
  onViewTeam: () => void;
  onViewLogistics: () => void;
  onAssignTeam: () => void;
  onEditTeam: () => void;
  onAssignLogistics: () => void;
  onSetupTravel: () => void;
  onAddLogistics: () => void;
  onEditLogistics: (logistics: LogisticsItem) => void;
  onDeleteLogistics: (id: string) => void;
  onAddTravel: () => void;
  onEditTravel: (travel: TravelPlan) => void;
  onDeleteTravel: (id: string) => void;
}

/**
 * KeyInfoSection - Overview cards for team and logistics
 * Shows key project information in a compact card format
 */
export const KeyInfoSection: React.FC<KeyInfoSectionProps> = ({
  assignedTeam,
  logistics,
  logisticsItems,
  travelPlans,
  onViewTeam,
  onViewLogistics,
  onAssignTeam,
  onEditTeam,
  onAssignLogistics,
  onSetupTravel,
  onAddLogistics,
  onEditLogistics,
  onDeleteLogistics,
  onAddTravel,
  onEditTravel,
  onDeleteTravel
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Assigned Team Card */}
      <Card className="p-6">
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
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex -space-x-2">
                {assignedTeam.members.slice(0, 3).map((member, index) => (
                  <div
                    key={member.id}
                    className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                    title={member.name}
                  >
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                ))}
                {assignedTeam.members.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-500">
                    +{assignedTeam.members.length - 3}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {assignedTeam.leadMember?.name || assignedTeam.members[0]?.name}
                </p>
                <p className="text-xs text-gray-500">Team Lead</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {assignedTeam.members.slice(0, 2).map((member) => (
                <div key={member.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{member.name}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTeamStatusColor(member.availability)}`}>
                      {getTeamStatusText(member.availability)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Phone className="w-3 h-3" />
                    <span className="text-xs">{member.phone}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewTeam}
                className="flex-1 justify-start"
              >
                View Team Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEditTeam}
                icon={Edit}
                className="px-3"
              >
                <span className="sr-only">Edit Team</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-500 mb-3">No team assigned yet</p>
            <Button
              variant="primary"
              size="sm"
              onClick={onAssignTeam}
              className="w-full"
            >
              Assign Team
            </Button>
          </div>
        )}
      </Card>

      {/* Logistics Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Logistics</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddLogistics}
            icon={Edit}
          >
            Add
          </Button>
        </div>
        
        {logisticsItems.length > 0 ? (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-3">
              {logisticsItems.length} logistics item{logisticsItems.length !== 1 ? 's' : ''} planned
            </div>
            
            {logisticsItems.slice(0, 2).map((item) => (
              <div key={item.id} className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">{item.itemName}</h4>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditLogistics(item)}
                      className="p-1 h-6 w-6"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteLogistics(item.id)}
                      className="p-1 h-6 w-6 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <p>Quantity: {item.quantity}</p>
                  <p>ETA: {formatDate(item.eta)}</p>
                </div>
              </div>
            ))}
            
            {logisticsItems.length > 2 && (
              <p className="text-xs text-gray-500 text-center">
                +{logisticsItems.length - 2} more items
              </p>
            )}
            
            <div className="flex space-x-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewLogistics}
                className="flex-1 justify-start"
              >
                View All Logistics
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAssignLogistics}
                className="px-3"
              >
                Manage
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-500 mb-3">No logistics planned yet</p>
            <Button
              variant="primary"
              size="sm"
              onClick={onAddLogistics}
              className="w-full"
            >
              Plan Logistics
            </Button>
          </div>
        )}
      </Card>

      {/* Travel Setup Card */}
      <Card className="p-6">
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
          <div className="space-y-3">
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
            
            <div className="flex space-x-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSetupTravel}
                className="flex-1 justify-start"
              >
                View All Travel
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddTravel}
                className="px-3"
              >
                Add More
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Plane className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-500 mb-3">No travel plans yet</p>
            <Button
              variant="primary"
              size="sm"
              onClick={onAddTravel}
              className="w-full"
            >
              Setup Travel
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};