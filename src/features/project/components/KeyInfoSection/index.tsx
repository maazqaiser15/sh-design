import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Users, Phone, Edit, Plane, Trash2, Truck, RefreshCw, Car, Hotel, CheckCircle, Plus, FileText, X } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { AssignedTeam } from '../../types/projectDetails';
import { TeamMember } from '../../types/teamMembers';
import { TravelPlan } from '../../types/logisticsTravel';
import { LogisticsCard } from '../LogisticsCard';
import { AddTravelDetailsModal } from '../AddTravelDetailsModal';
import { AddHotelReservationModal } from '../AddHotelReservationModal';
import { UploadTakeOffSheetModal } from '../UploadTakeOffSheetModal';
import { WindowManagementPage } from '../../pages/WindowManagementPage';
import { Window } from '../../types/windows';
import { useToast } from '../../../../contexts/ToastContext';

interface KeyInfoSectionProps {
  assignedTeam: AssignedTeam | null;
  travelPlans: TravelPlan[];
  assignedTrailer: any;
  projectFilmRequirements: any[];
  onViewTeam: () => void;
  onAssignTeam: () => void;
  onEditTeam: () => void;
  onRemoveTeamMember: (memberId: string) => void;
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
  selectedStage?: string;
  windows?: Window[];
  onWindowUpdate?: (updatedWindow: Window) => void;
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
  onRemoveTeamMember,
  onSetupTravel,
  onAddTravel,
  onEditTravel,
  onDeleteTravel,
  onAssignTrailer,
  onNotifyHouseManager,
  onUploadReceipt,
  onRemoveReceipt,
  onMarkCompleted,
  onUpdatePreparationTask,
  selectedStage = 'preparation',
  windows = [],
  onWindowUpdate
}) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  
  // Travel & Accommodation state management
  const [travelSetup, setTravelSetup] = useState({
    travelRequired: false,
    travelType: null as 'road' | 'air' | null,
    airTravelMembers: 1,
    roadTravelMembers: 1,
    hotelRequired: false
  });
  const [isTravelExpanded, setIsTravelExpanded] = useState(false);
  const [isTravelEditing, setIsTravelEditing] = useState(false);
  const [isTravelSubmitted, setIsTravelSubmitted] = useState(false);
  const [showTravelDetailsModal, setShowTravelDetailsModal] = useState(false);
  const [showHotelReservationModal, setShowHotelReservationModal] = useState(false);
  const [travelDetails, setTravelDetails] = useState<{
    travelFrom: string;
    travelTo: string;
    travelDate: string;
    numberOfTickets: number;
    attachments: File[];
  } | null>(null);
  const [hotelReservationDetails, setHotelReservationDetails] = useState<{
    hotelName: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfRooms: number;
    reservationSlip?: File;
  } | null>(null);

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

  // Travel & Accommodation handlers
  const handleTravelRequired = (checked: boolean) => {
    setTravelSetup(prev => ({
      ...prev,
      travelRequired: checked,
      travelType: checked ? prev.travelType : null
    }));
    
    if (checked) {
      showToast('Travel setup initiated - please select travel type');
      setIsTravelExpanded(true);
      setIsTravelEditing(true);
    } else {
      setIsTravelExpanded(false);
    }
  };

  const handleTravelType = (type: 'road' | 'air') => {
    setTravelSetup(prev => ({
      ...prev,
      travelType: type
    }));
  };

  const handleAirTravelMembers = (count: number) => {
    setTravelSetup(prev => ({
      ...prev,
      airTravelMembers: Math.max(1, Math.min(50, count))
    }));
  };

  const handleRoadTravelMembers = (count: number) => {
    setTravelSetup(prev => ({
      ...prev,
      roadTravelMembers: Math.max(1, Math.min(50, count))
    }));
  };

  const handleHotelRequired = (checked: boolean) => {
    setTravelSetup(prev => ({
      ...prev,
      hotelRequired: checked
    }));

    if (checked) {
      showToast('Reminder sent to house manager to do arrangement');
      onNotifyHouseManager();
      onUpdatePreparationTask?.('Travel Setup', true);
      // Ensure we stay in editing mode to show the button
      setIsTravelEditing(true);
      setIsTravelExpanded(true);
    }
  };

  const handleTravelConfirm = () => {
    if (travelSetup.travelType === 'road') {
      onNotifyHouseManager();
      showToast(`Road travel arranged for ${travelSetup.roadTravelMembers} team members`);
    } else if (travelSetup.travelType === 'air') {
      onNotifyHouseManager();
      showToast(`Air travel arranged for ${travelSetup.airTravelMembers} team members`);
    }
    
    onUpdatePreparationTask?.('Travel Setup', true);
    setIsTravelSubmitted(true);
    // Keep editing mode open to show the Add Travel Details button
  };

  const handleEditTravelSetup = () => {
    setIsTravelEditing(true);
    setIsTravelExpanded(true);
  };

  const handleOpenTravelDetailsModal = () => {
    setShowTravelDetailsModal(true);
  };

  const handleCloseTravelDetailsModal = () => {
    setShowTravelDetailsModal(false);
  };

  const handleSaveTravelDetails = (details: any) => {
    setTravelDetails(details);
    showToast('Travel details saved successfully');
  };

  const handleEditTravelDetails = () => {
    setShowTravelDetailsModal(true);
  };

  const handleOpenHotelReservationModal = () => {
    setShowHotelReservationModal(true);
  };

  const handleCloseHotelReservationModal = () => {
    setShowHotelReservationModal(false);
  };

  const handleSaveHotelReservationDetails = (details: any) => {
    setHotelReservationDetails(details);
    showToast('Hotel reservation details saved successfully!');
  };

  const handleEditHotelReservationDetails = () => {
    setShowHotelReservationModal(true);
  };

  // Handle removing team member
  const handleRemoveTeamMember = (memberId: string) => {
    const member = assignedTeam?.members.find(m => m.id === memberId);
    if (member) {
      showToast(`${member.name} removed from team`);
      onRemoveTeamMember(memberId);
    }
  };

  // Upload Take-Off Sheet modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showWindowManagement, setShowWindowManagement] = useState(false);

  // Handle upload take-off sheet
  const handleUploadTakeOffSheet = (file: File) => {
    showToast(`Take-off sheet "${file.name}" uploaded successfully! Windows created.`);
    setShowUploadModal(false);
    // Navigate to window management page
    if (projectId) {
      navigate(`/projects/${projectId}/windows`);
    }
  };

  const handleOpenUploadModal = () => {
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
  };

  // Handle direct upload with loader
  const handleDirectUpload = () => {
    setIsUploading(true);
    
    // Simulate upload processing
    setTimeout(() => {
      showToast('Take-off sheet uploaded successfully! Windows created.');
      setIsUploading(false);
      // Show window management interface instead of redirecting
      setShowWindowManagement(true);
    }, 2000); // 2 second loader
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-6 items-stretch">
      {selectedStage === 'wip' ? (
        // Work in Progress stage - Show upload or window management
        <div className="lg:col-span-4">
          {showWindowManagement ? (
            // Window Management Interface
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Window Management</h3>
                </div>
              </div>
              <div className="p-0">
                <WindowManagementPage 
                  windows={windows}
                  onWindowUpdate={onWindowUpdate}
                />
              </div>
            </div>
          ) : (
            // Upload Take-Off Sheet Card
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Project Setup</h3>
                </div>
                <span className="text-sm font-medium text-gray-500">Ready to begin</span>
              </div>
              
              {isUploading ? (
                // Loading state
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Processing Take-Off Sheet
                  </h4>
                  
                  <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
                    Creating window inventory and setting up project workspace...
                  </p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    This may take a few moments
                  </p>
                </div>
              ) : (
                // Upload interface
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Take-Off Sheet
                  </h4>
                  
                  <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
                    Upload your take-off sheet to create window inventory and start working on the project. 
                    This will help us track progress and manage the installation process.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      variant="primary"
                      size="md"
                      icon={FileText}
                      onClick={handleDirectUpload}
                      className="px-6 py-2"
                    >
                      Upload Take-Off Sheet
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="md"
                      icon={Edit}
                      onClick={() => {
                        showToast('Manual window entry opened');
                        // In a real app, this would open a modal for manual entry
                      }}
                      className="px-6 py-2"
                    >
                      Enter Manually
                    </Button>
                  </div>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-2">
                      <strong>Supported formats:</strong> PDF, Excel (.xlsx, .xls), CSV
                    </p>
                    <p className="text-xs text-gray-500">
                      Once uploaded, we'll automatically create your window inventory and you can begin tracking progress.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      ) : (
        <>
      {/* Assigned Team Card */}
      <Card className="p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
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
          <div className="flex-1 flex flex-col h-full">
            {/* Team Members List - Scrollable */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-3 min-h-0">
              {assignedTeam.members.map((member) => (
                <div key={member.id} className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-sm font-medium text-blue-600">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                        <p className="text-xs text-gray-500 truncate">{member.role}</p>
                        {member.location && (
                          <p className="text-xs text-gray-400 truncate">{member.location}</p>
                )}
              </div>
              </div>
                    <button
                      onClick={() => handleRemoveTeamMember(member.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Remove team member"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Add Team Button - Fixed at bottom */}
            <div className="flex-shrink-0">
              <Button
                variant="primary"
                size="sm"
                onClick={onAssignTeam}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 flex-1 flex flex-col justify-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-500 mb-4">No team assigned yet</p>
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
      <Card className="p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
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
            <div className="p-3 bg-gray-50 rounded-lg border flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-900">
                  {assignedTrailer.trailerName}
                </h4>
                <span className="text-sm text-gray-500 font-medium">
                  {assignedTrailer.registrationNumber}
                </span>
              </div>
              
              <div className="space-y-2">
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
                <div className="mt-2">
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
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700 block mb-2">Notes:</span>
                    <p className="text-sm text-gray-600">{assignedTrailer.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 flex-1 flex flex-col justify-center">
            <Truck className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-500 mb-4">No trailer assigned yet</p>
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

      {/* Travel & Accommodation Setup Card */}
      <Card className="p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Plane className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Travel & Accommodation</h3>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col">
          {/* Checkboxes */}
          <div className="space-y-3">
            {/* Travel Required */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="travel-required"
                checked={travelSetup.travelRequired}
                onChange={(e) => handleTravelRequired(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="travel-required" className="text-sm font-medium text-gray-700">
                Travel Required
              </label>
            </div>
            
            {/* Travel Type Selection - Only show if travel details haven't been saved */}
            {travelSetup.travelRequired && !travelDetails && (
              <div className="ml-7 space-y-2 border-l-2 border-gray-200 pl-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="travel-road"
                      name="travel-type"
                      checked={travelSetup.travelType === 'road'}
                      onChange={() => handleTravelType('road')}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <label htmlFor="travel-road" className="flex items-center space-x-2 text-sm text-gray-700">
                      <Car className="w-4 h-4" />
                      <span>Travel by Road</span>
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="travel-air"
                      name="travel-type"
                      checked={travelSetup.travelType === 'air'}
                      onChange={() => handleTravelType('air')}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <label htmlFor="travel-air" className="flex items-center space-x-2 text-sm text-gray-700">
                      <Plane className="w-4 h-4" />
                      <span>Travel by Air</span>
                    </label>
                  </div>
                </div>

                {/* Road Travel Input */}
                {travelSetup.travelType === 'road' && (
                  <div className="space-y-2">
                    <div>
                      <label htmlFor="road-members" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of team members requiring road travel
                      </label>
                      <input
                        type="number"
                        id="road-members"
                        min="1"
                        max="50"
                        value={travelSetup.roadTravelMembers}
                        onChange={(e) => handleRoadTravelMembers(parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Air Travel Input */}
                {travelSetup.travelType === 'air' && (
                  <div className="space-y-2">
                    <div>
                      <label htmlFor="air-members" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of team members requiring air travel
                      </label>
                      <input
                        type="number"
                        id="air-members"
                        min="1"
                        max="50"
                        value={travelSetup.airTravelMembers}
                        onChange={(e) => handleAirTravelMembers(parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Travel Confirm Button */}
                {travelSetup.travelType && !isTravelSubmitted && (
                    <Button
                    variant="primary"
                      size="sm"
                    onClick={handleTravelConfirm}
                    className="w-full"
                    >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Travel Arrangement
                    </Button>
                )}

                {/* Add Travel Details Button - shows after travel is submitted but before details are saved */}
                {isTravelSubmitted && travelSetup.travelType && !travelDetails && (
                  <div className="mt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleOpenTravelDetailsModal}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Travel Details
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Travel Reservation Details Card - shows after travel details are saved */}
            {travelDetails && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm font-medium text-blue-900">Reservation Details Added</h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditTravelDetails}
                    className="text-blue-600 hover:text-blue-800 p-2"
                    title="Edit travel details"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Route:</span>
                    <span className="text-blue-900 font-medium">
                      {travelDetails.travelFrom} → {travelDetails.travelTo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Tickets:</span>
                    <span className="text-blue-900 font-medium">
                      {travelDetails.numberOfTickets} ticket{travelDetails.numberOfTickets !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Attachments:</span>
                    <span className="text-blue-900 font-medium">
                      {travelDetails.attachments.length} file{travelDetails.attachments.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Hotel Required */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="hotel-required"
                checked={travelSetup.hotelRequired}
                onChange={(e) => handleHotelRequired(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="hotel-required" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Hotel className="w-4 h-4" />
                <span>Hotel Reservation Required</span>
              </label>
            </div>

            {/* Add Reservation Details Button - shows when hotel is required but details not saved */}
            {travelSetup.hotelRequired && !hotelReservationDetails && (
              <div className="ml-7">
              <Button
                  variant="secondary"
                size="sm"
                  onClick={handleOpenHotelReservationModal}
                  className="w-full"
              >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Reservation Details
              </Button>
              </div>
            )}

            {/* Hotel Reservation Details Card - shows after reservation details are saved */}
            {hotelReservationDetails && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Hotel className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm font-medium text-blue-900">Hotel Reservation Details Added</h4>
                  </div>
              <Button
                variant="ghost"
                size="sm"
                    onClick={handleEditHotelReservationDetails}
                    className="text-blue-600 hover:text-blue-800 p-2"
                    title="Edit hotel reservation details"
              >
                    <Edit className="w-4 h-4" />
              </Button>
            </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Hotel:</span>
                    <span className="text-blue-900 font-medium">{hotelReservationDetails.hotelName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Check-in:</span>
                    <span className="text-blue-900 font-medium">{formatDate(hotelReservationDetails.checkInDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Check-out:</span>
                    <span className="text-blue-900 font-medium">{formatDate(hotelReservationDetails.checkOutDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Rooms:</span>
                    <span className="text-blue-900 font-medium">
                      {hotelReservationDetails.numberOfRooms} room{hotelReservationDetails.numberOfRooms !== 1 ? 's' : ''}
                    </span>
                  </div>
                  {hotelReservationDetails.reservationSlip && (
                    <div className="flex justify-between">
                      <span className="text-blue-700">Reservation Slip:</span>
                      <span className="text-blue-900 font-medium">1 file</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          </div>
      </Card>
        </>
      )}

      {/* Add Travel Details Modal */}
      <AddTravelDetailsModal
        isOpen={showTravelDetailsModal}
        onClose={handleCloseTravelDetailsModal}
        onSave={handleSaveTravelDetails}
        travelType={travelSetup.travelType || 'air'}
        numberOfMembers={travelSetup.travelType === 'air' ? travelSetup.airTravelMembers : travelSetup.roadTravelMembers}
      />

      {/* Add Hotel Reservation Modal */}
      <AddHotelReservationModal
        isOpen={showHotelReservationModal}
        onClose={handleCloseHotelReservationModal}
        onSave={handleSaveHotelReservationDetails}
      />

      {/* Upload Take-Off Sheet Modal */}
      <UploadTakeOffSheetModal
        isOpen={showUploadModal}
        onClose={handleCloseUploadModal}
        onUpload={handleUploadTakeOffSheet}
      />
    </div>
  );
};