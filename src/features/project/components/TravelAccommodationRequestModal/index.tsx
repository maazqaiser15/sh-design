import React, { useState } from 'react';
import { Avatar } from '../../../../common/components/Avatar';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { Plane, Hotel, Car } from 'lucide-react';

export interface TravelAccommodationRequestData {
  travelRequired: boolean;
  accommodationRequired: boolean;
  rentalVehicleRequired: boolean;
  travelMethod?: 'air' | 'road';
  selectedTeamMembers: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
    location?: string;
    travelMethod?: 'air' | 'road';
  }>;
  selectedAccommodationMembers: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
    location?: string;
  }>;
  rentalVehicleDetails?: {
    fromDate: string;
    toDate: string;
    numberOfCars: number;
    pickupLocation: string;
  };
}

interface TravelAccommodationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TravelAccommodationRequestData) => void;
  assignedTeamMembers: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
    location?: string;
  }>;
  projectLocation: string;
}

export const TravelAccommodationRequestModal: React.FC<TravelAccommodationRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  assignedTeamMembers,
  projectLocation,
}) => {
  const [travelRequired, setTravelRequired] = useState(false);
  const [accommodationRequired, setAccommodationRequired] = useState(false);
  const [rentalVehicleRequired, setRentalVehicleRequired] = useState(false);
  const [travelMethod, setTravelMethod] = useState<'air' | 'road'>('air');
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
    location?: string;
    travelMethod?: 'air' | 'road';
  }>>([]);
  const [selectedAccommodationMembers, setSelectedAccommodationMembers] = useState<Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
    location?: string;
  }>>([]);
  const [rentalVehicleDetails, setRentalVehicleDetails] = useState<{
    fromDate: string;
    toDate: string;
    numberOfCars: number;
    pickupLocation: string;
  }>({
    fromDate: '',
    toDate: '',
    numberOfCars: 1,
    pickupLocation: ''
  });
  const [teamMemberToggles, setTeamMemberToggles] = useState<Record<string, boolean>>({});
  const [teamMemberTravelMethods, setTeamMemberTravelMethods] = useState<Record<string, 'air' | 'road'>>({});
  const [accommodationMemberToggles, setAccommodationMemberToggles] = useState<Record<string, boolean>>({});

  const handleSubmit = () => {
    const data: TravelAccommodationRequestData = {
      travelRequired,
      accommodationRequired,
      rentalVehicleRequired,
      travelMethod: travelRequired ? travelMethod : undefined,
      selectedTeamMembers,
      selectedAccommodationMembers,
      rentalVehicleDetails: rentalVehicleRequired ? rentalVehicleDetails : undefined,
    };
    onSubmit(data);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const isFormValid = () => {
    if (travelRequired || accommodationRequired || rentalVehicleRequired) {
      if (rentalVehicleRequired) {
        return rentalVehicleDetails.fromDate && rentalVehicleDetails.toDate && rentalVehicleDetails.numberOfCars > 0;
      }
      return true;
    }
    return false;
  };

  // Check if a team member is selected
  const isTeamMemberSelected = (memberId: string) => {
    return selectedTeamMembers.some(m => m.id === memberId);
  };

  // Handle individual team member toggle
  const handleTeamMemberToggle = (memberId: string, isEnabled: boolean) => {
    setTeamMemberToggles(prev => ({
      ...prev,
      [memberId]: isEnabled
    }));

    if (isEnabled) {
      // Add to selected members if not already there
      const member = assignedTeamMembers.find(m => m.id === memberId);
      if (member && !selectedTeamMembers.some(m => m.id === memberId)) {
        setSelectedTeamMembers(prev => [...prev, {
          ...member,
          travelMethod: teamMemberTravelMethods[memberId] || 'air'
        }]);
      }
    } else {
      // Remove from selected members
      setSelectedTeamMembers(prev => prev.filter(m => m.id !== memberId));
    }
  };

  // Handle travel method change for individual team member
  const handleTeamMemberTravelMethodChange = (memberId: string, method: 'air' | 'road') => {
    setTeamMemberTravelMethods(prev => ({
      ...prev,
      [memberId]: method
    }));

    // Update selected members if this member is already selected
    setSelectedTeamMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, travelMethod: method }
        : member
    ));
  };

  // Handle individual accommodation team member toggle
  const handleAccommodationMemberToggle = (memberId: string, isEnabled: boolean) => {
    setAccommodationMemberToggles(prev => ({
      ...prev,
      [memberId]: isEnabled
    }));

    if (isEnabled) {
      // Add to selected accommodation members if not already there
      const member = assignedTeamMembers.find(m => m.id === memberId);
      if (member && !selectedAccommodationMembers.some(m => m.id === memberId)) {
        setSelectedAccommodationMembers(prev => [...prev, member]);
      }
    } else {
      // Remove from selected accommodation members
      setSelectedAccommodationMembers(prev => prev.filter(m => m.id !== memberId));
    }
  };

  // Handle rental vehicle details changes
  const handleRentalVehicleDetailsChange = (field: 'fromDate' | 'toDate' | 'numberOfCars' | 'pickupLocation', value: string | number) => {
    setRentalVehicleDetails(prev => ({
      ...prev,
      [field]: value
    }));
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
              {/* Team Members List */}
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-3">
                  Team Members
                </label>
                <div className="space-y-3">
                  {assignedTeamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white border border-blue-200 rounded-lg p-4"
                    >
                      <div className="space-y-3">
                        {/* Member Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              <Avatar
                                src={member.avatar}
                                name={member.name}
                                size="lg"
                              />
                            </div>

                            {/* Member Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm text-gray-900 truncate">
                                  {member.name}
                                </p>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {member.role}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 1C4.34 1 3 2.34 3 4C3 6.5 6 9 6 9C6 9 9 6.5 9 4C9 2.34 7.66 1 6 1ZM6 5.25C5.45 5.25 5 4.8 5 4.25C5 3.7 5.45 3.25 6 3.25C6.55 3.25 7 3.7 7 4.25C7 4.8 6.55 5.25 6 5.25Z" fill="#6B7280"/>
                                </svg>
                                <p className="text-xs text-gray-600 truncate">
                                  {member.location} → {projectLocation}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Toggle Switch */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={teamMemberToggles[member.id] || false}
                              onChange={(e) => handleTeamMemberToggle(member.id, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>

                        {/* Travel Method Selection - Only show when member is selected */}
                        {teamMemberToggles[member.id] && (
                          <div className="border-t border-gray-100 pt-3">
                            <label className="block text-xs font-medium text-gray-700 mb-2">
                              Travel Method
                            </label>
                            <div className="flex gap-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`travelMethod-${member.id}`}
                                  value="air"
                                  checked={(teamMemberTravelMethods[member.id] || 'air') === 'air'}
                                  onChange={() => handleTeamMemberTravelMethodChange(member.id, 'air')}
                                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-xs text-gray-700">Air</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`travelMethod-${member.id}`}
                                  value="road"
                                  checked={(teamMemberTravelMethods[member.id] || 'air') === 'road'}
                                  onChange={() => handleTeamMemberTravelMethodChange(member.id, 'road')}
                                  className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-xs text-gray-700">Road</span>
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {selectedTeamMembers.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium">
                      {selectedTeamMembers.length} team member{selectedTeamMembers.length > 1 ? 's' : ''} selected for travel
                    </p>
                  </div>
                )}
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
            <div className="space-y-4 pl-2">
              {/* Team Members List */}
              <div>
                <label className="block text-sm font-medium text-green-700 mb-3">
                  Team Members
                </label>
                <div className="space-y-3">
                  {assignedTeamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white border border-green-200 rounded-lg p-4"
                    >
                      <div className="space-y-3">
                        {/* Member Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              <Avatar
                                src={member.avatar}
                                name={member.name}
                                size="lg"
                              />
                            </div>

                            {/* Member Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm text-gray-900 truncate">
                                  {member.name}
                                </p>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {member.role}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Toggle Switch */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={accommodationMemberToggles[member.id] || false}
                              onChange={(e) => handleAccommodationMemberToggle(member.id, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedAccommodationMembers.length > 0 && (
                  <div className="mt-3 p-3 bg-green-100 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      {selectedAccommodationMembers.length} team member{selectedAccommodationMembers.length > 1 ? 's' : ''} selected for accommodation
                    </p>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-green-700">
                Accommodation details can be added later after the request is approved.
              </p>
            </div>
          )}
        </div>

        {/* Rental Vehicle Section */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-orange-900">Rental Vehicle Required</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rentalVehicleRequired}
                onChange={(e) => setRentalVehicleRequired(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          {rentalVehicleRequired && (
            <div className="space-y-4 pl-2">
              {/* Rental Vehicle Details Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* From Date */}
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={rentalVehicleDetails.fromDate}
                      onChange={(e) => handleRentalVehicleDetailsChange('fromDate', e.target.value)}
                      className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>

                  {/* To Date */}
                  <div>
                    <label className="block text-sm font-medium text-orange-700 mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={rentalVehicleDetails.toDate}
                      onChange={(e) => handleRentalVehicleDetailsChange('toDate', e.target.value)}
                      className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                </div>

                {/* Number of Cars */}
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">
                    Number of Cars Needed
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={rentalVehicleDetails.numberOfCars}
                    onChange={(e) => handleRentalVehicleDetailsChange('numberOfCars', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                {/* Pickup Location */}
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">
                    Where Picking Up From
                  </label>
                  <input
                    type="text"
                    value={rentalVehicleDetails.pickupLocation}
                    onChange={(e) => handleRentalVehicleDetailsChange('pickupLocation', e.target.value)}
                    placeholder="Enter pickup location (e.g., Airport, Hotel, Office)"
                    className="w-full px-3 py-2 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>

                {/* Summary */}
                {rentalVehicleDetails.fromDate && rentalVehicleDetails.toDate && (
                  <div className="mt-3 p-3 bg-orange-100 rounded-lg">
                    <p className="text-sm text-orange-800 font-medium">
                      {rentalVehicleDetails.numberOfCars} car{rentalVehicleDetails.numberOfCars > 1 ? 's' : ''} needed from {new Date(rentalVehicleDetails.fromDate).toLocaleDateString()} to {new Date(rentalVehicleDetails.toDate).toLocaleDateString()}
                      {rentalVehicleDetails.pickupLocation && (
                        <span className="block mt-1">
                          Pickup from: {rentalVehicleDetails.pickupLocation}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
              
              <p className="text-sm text-orange-700">
                Vehicle details can be added later after the request is approved.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            variant="secondary"
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
