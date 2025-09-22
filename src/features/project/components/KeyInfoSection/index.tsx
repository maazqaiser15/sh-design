import React from 'react';
import { Users, Truck, Package, Clock, Phone, Edit, Plane, Trash2 } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { AssignedTeam, AssignedTrailer, LogisticsInfo } from '../../types/projectDetails';
import { TeamMember } from '../../types/teamMembers';
import { TrailerForAssignment } from '../../types/trailers';
import { LogisticsItem, TravelPlan } from '../../types/logisticsTravel';
import { Trailer } from '../../../../types';

interface KeyInfoSectionProps {
  assignedTeam: AssignedTeam | null;
  assignedTrailer: AssignedTrailer | null;
  logistics: LogisticsInfo | null;
  logisticsItems: LogisticsItem[];
  travelPlans: TravelPlan[];
  projectFilmRequirements: Array<{
    sheetType: string;
    required: number;
    available: number;
    status: 'sufficient' | 'low' | 'missing';
  }>;
  onViewTeam: () => void;
  onViewTrailer: () => void;
  onViewLogistics: () => void;
  onAssignTeam: () => void;
  onEditTeam: () => void;
  onAssignTrailer: () => void;
  onEditTrailer: () => void;
  onAssignLogistics: () => void;
  onSetupTravel: () => void;
  onAddLogistics: () => void;
  onEditLogistics: (logistics: LogisticsItem) => void;
  onDeleteLogistics: (id: string) => void;
  onAddTravel: () => void;
  onEditTravel: (travel: TravelPlan) => void;
  onDeleteTravel: (id: string) => void;
  onUploadShipmentReceipt: () => void;
}

/**
 * KeyInfoSection - Overview cards for team, trailer, and logistics
 * Shows key project information in a compact card format
 */
export const KeyInfoSection: React.FC<KeyInfoSectionProps> = ({
  assignedTeam,
  assignedTrailer,
  logistics,
  logisticsItems,
  travelPlans,
  projectFilmRequirements,
  onViewTeam,
  onViewTrailer,
  onViewLogistics,
  onAssignTeam,
  onEditTeam,
  onAssignTrailer,
  onEditTrailer,
  onAssignLogistics,
  onSetupTravel,
  onAddLogistics,
  onEditLogistics,
  onDeleteLogistics,
  onAddTravel,
  onEditTravel,
  onDeleteTravel,
  onUploadShipmentReceipt
}) => {
  const getInventoryStatusColor = (status: string) => {
    const colors = {
      'available': 'text-green-600',
      'unavailable': 'text-red-600',
      'low': 'text-yellow-600'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  const getInventoryStatusText = (status: string) => {
    const texts = {
      'available': 'Available',
      'unavailable': 'Unavailable',
      'low': 'Low Stock'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getFilmStatusColor = (status: 'sufficient' | 'low' | 'missing') => {
    const colors = {
      'sufficient': 'text-green-600',
      'low': 'text-yellow-600',
      'missing': 'text-red-600'
    };
    return colors[status];
  };

  const getFilmStatusIcon = (status: 'sufficient' | 'low' | 'missing') => {
    const icons = {
      'sufficient': '✓',
      'low': '⚠',
      'missing': '✗'
    };
    return icons[status];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Assigned Team Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Assigned Team</h3>
          </div>
          {assignedTeam && (
            <span className="text-2xl font-bold text-blue-600">{assignedTeam.count}</span>
          )}
        </div>
        
        {assignedTeam ? (
          <div className="space-y-3">
            {/* Lead Supervisor */}
            {assignedTeam.leadMember && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">
                    {assignedTeam.leadMember.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{assignedTeam.leadMember.name}</p>
                  <p className="text-xs text-gray-500">{assignedTeam.leadMember.role}</p>
                </div>
              </div>
            )}

            {/* Crew Leader */}
            {assignedTeam.members.find(member => member.role === 'Crew Leader') && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">
                    {assignedTeam.members.find(member => member.role === 'Crew Leader')?.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {assignedTeam.members.find(member => member.role === 'Crew Leader')?.name}
                  </p>
                  <p className="text-xs text-gray-500">Crew Leader</p>
                </div>
              </div>
            )}

            {/* Additional members count */}
            {assignedTeam.count > 2 && (
              <div className="text-sm text-gray-500">
                +{assignedTeam.count - 2} more members
              </div>
            )}
            
            <div className="flex space-x-2">
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
          <div className="text-center py-6">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-500 mb-4">No team assigned yet.</p>
            <Button
              variant="primary"
              size="sm"
              onClick={onAssignTeam}
              className="w-full"
            >
              Assign Crew Members
            </Button>
          </div>
        )}
      </Card>

      {/* Assigned Trailer Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900">Assigned Trailer</h3>
          </div>
          {assignedTrailer && (
            <span className={`text-sm font-medium ${getInventoryStatusColor(assignedTrailer.inventoryStatus)}`}>
              {getInventoryStatusText(assignedTrailer.inventoryStatus)}
            </span>
          )}
        </div>
        
        {assignedTrailer ? (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{assignedTrailer.trailer.trailerNumber}</p>
              <p className="text-xs text-gray-500">{assignedTrailer.trailer.registrationNumber}</p>
            </div>
            
            <div className="text-xs text-gray-500">
              <p>Location: {assignedTrailer.trailer.location}</p>
              <p>Updated: {formatDate(assignedTrailer.lastUpdated)}</p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewTrailer}
                className="flex-1 justify-start"
              >
                View Trailer Details
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEditTrailer}
                icon={Edit}
                className="px-3"
              >
                <span className="sr-only">Edit Trailer</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-500 mb-4">No trailer assigned yet.</p>
            <Button
              variant="primary"
              size="sm"
              onClick={onAssignTrailer}
              className="w-full"
            >
              Assign Trailer
            </Button>
          </div>
        )}
      </Card>

      {/* Logistics Card - Film Requirements */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Film Requirements</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onUploadShipmentReceipt}
            icon={Package}
          >
            Upload Receipt
          </Button>
        </div>
        
        {assignedTrailer ? (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 mb-3">
              Required vs Available in Trailer
            </div>
            {projectFilmRequirements.map((film, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900">{film.sheetType}</h4>
                    <span className={`text-sm font-medium ${getFilmStatusColor(film.status)}`}>
                      {getFilmStatusIcon(film.status)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {film.available}/{film.required}
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>Required: {film.required}</span>
                  <span>Available: {film.available}</span>
                  <span className={`font-medium ${getFilmStatusColor(film.status)}`}>
                    {film.status === 'sufficient' ? 'Sufficient' : 
                     film.status === 'low' ? 'Low Stock' : 'Missing'}
                  </span>
                </div>
                {film.status !== 'sufficient' && (
                  <div className="mt-2 text-xs text-amber-600">
                    {film.status === 'missing' 
                      ? 'Film needs to be ordered and shipped'
                      : 'Consider ordering additional film'
                    }
                  </div>
                )}
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Shipment Status</span>
              </div>
              <p className="text-xs text-blue-700 mb-2">
                Upload shipment receipt to confirm film delivery
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={onUploadShipmentReceipt}
                className="w-full"
              >
                Upload Shipment Receipt
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-500 mb-3">No trailer assigned yet</p>
            <p className="text-xs text-gray-400 mb-3">
              Assign a trailer to view film requirements
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={onAssignTrailer}
              className="w-full"
            >
              Assign Trailer First
            </Button>
          </div>
        )}
      </Card>

      {/* Travel Setup Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Plane className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Travel Setup</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddTravel}
            icon={Plane}
          >
            Add
          </Button>
        </div>
        
        {travelPlans.length > 0 ? (
          <div className="space-y-3">
            {travelPlans.map(plan => (
              <div key={plan.id} className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {plan.departureLocation} → {plan.destination}
                    </h4>
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {plan.travelType}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTravel(plan)}
                      icon={Edit}
                    >
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTravel(plan.id)}
                      icon={Trash2}
                      className="text-red-600 hover:text-red-700"
                    >
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>
                    {formatDate(plan.departureDate)}
                    {plan.returnDate && ` - ${formatDate(plan.returnDate)}`}
                  </span>
                  <span>{plan.assignedTeamMembers.length} team members</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Plane className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-500 mb-3">No travel plans added yet</p>
            <Button
              variant="primary"
              size="sm"
              onClick={onAddTravel}
              className="w-full"
            >
              Add Travel Plan
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
