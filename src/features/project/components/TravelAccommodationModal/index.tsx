import React, { useState } from 'react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { Plane, Hotel, Upload, Calendar, Users, MapPin } from 'lucide-react';

export interface TravelAccommodationData {
  travel: {
    travelFrom: string;
    travelTo: string;
    travelDate: string;
    numberOfTeamMembers: number;
    ticketsAttachment?: File[];
  };
  accommodation: {
    hotelName: string;
    numberOfRooms: number;
    checkInDate: string;
    checkOutDate: string;
    reservationSlipsAttachment?: File[];
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
  // Travel form state
  const [travelFrom, setTravelFrom] = useState('');
  const [travelTo, setTravelTo] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [numberOfTeamMembers, setNumberOfTeamMembers] = useState(1);
  const [ticketsFiles, setTicketsFiles] = useState<File[]>([]);

  // Accommodation form state
  const [hotelName, setHotelName] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [reservationSlipsFiles, setReservationSlipsFiles] = useState<File[]>([]);

  const handleTicketsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setTicketsFiles(prev => [...prev, ...files]);
  };

  const handleReservationSlipsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setReservationSlipsFiles(prev => [...prev, ...files]);
  };

  const removeTicketFile = (index: number) => {
    setTicketsFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeReservationSlipFile = (index: number) => {
    setReservationSlipsFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const data: TravelAccommodationData = {
      travel: {
        travelFrom,
        travelTo,
        travelDate,
        numberOfTeamMembers,
        ticketsAttachment: ticketsFiles,
      },
      accommodation: {
        hotelName,
        numberOfRooms,
        checkInDate,
        checkOutDate,
        reservationSlipsAttachment: reservationSlipsFiles,
      },
    };
    onSubmit(data);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const isFormValid = () => {
    return travelFrom && travelTo && travelDate && hotelName && checkInDate && checkOutDate;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Travel & Accommodation Details" size="xl">
      <div className="space-y-6">
        {/* Travel Details Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Plane className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Travel Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Travel From */}
            <div>
              <label htmlFor="travelFrom" className="block text-sm font-medium text-gray-700 mb-1">
                Travel From
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  id="travelFrom"
                  value={travelFrom}
                  onChange={(e) => setTravelFrom(e.target.value)}
                  placeholder="Enter departure location"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Travel To */}
            <div>
              <label htmlFor="travelTo" className="block text-sm font-medium text-gray-700 mb-1">
                Travel To
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  id="travelTo"
                  value={travelTo}
                  onChange={(e) => setTravelTo(e.target.value)}
                  placeholder="Enter destination"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Travel Date */}
            <div>
              <label htmlFor="travelDate" className="block text-sm font-medium text-gray-700 mb-1">
                Travel Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  id="travelDate"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Number of Team Members */}
            <div>
              <label htmlFor="numberOfTeamMembers" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Team Members
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  id="numberOfTeamMembers"
                  value={numberOfTeamMembers}
                  onChange={(e) => setNumberOfTeamMembers(Math.max(1, Number(e.target.value)))}
                  min="1"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Attach Tickets */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attach Tickets
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                id="ticketsUpload"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleTicketsUpload}
                className="hidden"
              />
              <label
                htmlFor="ticketsUpload"
                className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 rounded-lg p-4 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Click to upload tickets or drag and drop</span>
                <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC up to 10MB</span>
              </label>
            </div>
            
            {/* Display uploaded files */}
            {ticketsFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {ticketsFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-md p-2">
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    <button
                      onClick={() => removeTicketFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Accommodation Details Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Hotel className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Accommodation Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Hotel Name */}
            <div>
              <label htmlFor="hotelName" className="block text-sm font-medium text-gray-700 mb-1">
                Hotel Name
              </label>
              <div className="relative">
                <Hotel className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  id="hotelName"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  placeholder="Enter hotel name"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Number of Rooms */}
            <div>
              <label htmlFor="numberOfRooms" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Rooms
              </label>
              <input
                type="number"
                id="numberOfRooms"
                value={numberOfRooms}
                onChange={(e) => setNumberOfRooms(Math.max(1, Number(e.target.value)))}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Check-in Date */}
            <div>
              <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  id="checkInDate"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Check-out Date */}
            <div>
              <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700 mb-1">
                Check-out Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  id="checkOutDate"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Attach Reservation Slips */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attach Reservation Slips
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                id="reservationSlipsUpload"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleReservationSlipsUpload}
                className="hidden"
              />
              <label
                htmlFor="reservationSlipsUpload"
                className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 rounded-lg p-4 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">Click to upload reservation slips or drag and drop</span>
                <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC up to 10MB</span>
              </label>
            </div>
            
            {/* Display uploaded files */}
            {reservationSlipsFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {reservationSlipsFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-md p-2">
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    <button
                      onClick={() => removeReservationSlipFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            disabled={!isFormValid()}
            className="px-6 py-2"
          >
            Submit Details
          </Button>
        </div>
      </div>
    </Modal>
  );
};