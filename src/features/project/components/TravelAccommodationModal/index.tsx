import React, { useState } from 'react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { Plane, Hotel, Upload, Calendar, Users, MapPin, Clock, Plus, Trash2, User } from 'lucide-react';

export interface TicketDetails {
  id: string;
  passengerName: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  airline: string;
  attachment?: File;
}

export interface TravelAccommodationData {
  tickets: TicketDetails[];
  hotelName: string;
  numberOfRooms: number;
  checkInDate: string;
  checkOutDate: string;
  reservationSlipsFiles: File[];
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
  // Ticket form state
  const [tickets, setTickets] = useState<TicketDetails[]>([]);

  // Accommodation form state
  const [hotelName, setHotelName] = useState('');
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [reservationSlipsFiles, setReservationSlipsFiles] = useState<File[]>([]);

  // Ticket management functions
  const addTicket = () => {
    const newTicket: TicketDetails = {
      id: Date.now().toString(),
      passengerName: '',
      departureDate: '',
      departureTime: '',
      arrivalDate: '',
      arrivalTime: '',
      airline: '',
    };
    setTickets(prev => [...prev, newTicket]);
  };

  const removeTicket = (ticketId: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
  };

  const updateTicket = (ticketId: string, field: keyof TicketDetails, value: string | number | File) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, [field]: value } : ticket
    ));
  };

  const handleTicketFileUpload = (ticketId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateTicket(ticketId, 'attachment', file);
    }
  };

  const handleReservationSlipsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setReservationSlipsFiles(prev => [...prev, ...files]);
  };

  const removeReservationSlipFile = (index: number) => {
    setReservationSlipsFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const data: TravelAccommodationData = {
      tickets,
      hotelName,
      numberOfRooms,
      checkInDate,
      checkOutDate,
      reservationSlipsFiles,
    };
    onSubmit(data);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const isFormValid = () => {
    const accommodationValid = hotelName && checkInDate && checkOutDate;
    const ticketsValid = tickets.length > 0 && tickets.every(ticket => 
      ticket.passengerName.trim() !== '' &&
      ticket.departureDate !== '' &&
      ticket.departureTime !== '' &&
      ticket.arrivalDate !== '' &&
      ticket.arrivalTime !== '' &&
      ticket.airline.trim() !== ''
    );
    return accommodationValid && ticketsValid;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Travel & Accommodation Details" size="xl">
      <div className="space-y-6">
        {/* Individual Ticket Management */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Individual Tickets</h4>
              <p className="text-sm text-gray-600">
                {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} configured
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={addTicket}
              icon={Plus}
            >
              Add Ticket
            </Button>
          </div>
          
          <div className="space-y-4">
            {tickets.map((ticket, index) => (
              <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">Ticket {index + 1}</span>
                  </div>
                  <button
                    onClick={() => removeTicket(ticket.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Passenger Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Passenger Name *
                    </label>
                    <input
                      type="text"
                      value={ticket.passengerName}
                      onChange={(e) => updateTicket(ticket.id, 'passengerName', e.target.value)}
                      placeholder="Enter passenger name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Departure Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departure Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={ticket.departureDate}
                        onChange={(e) => updateTicket(ticket.id, 'departureDate', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Departure Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departure Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="time"
                        value={ticket.departureTime}
                        onChange={(e) => updateTicket(ticket.id, 'departureTime', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Arrival Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arrival Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="date"
                        value={ticket.arrivalDate}
                        onChange={(e) => updateTicket(ticket.id, 'arrivalDate', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Arrival Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arrival Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="time"
                        value={ticket.arrivalTime}
                        onChange={(e) => updateTicket(ticket.id, 'arrivalTime', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Airline */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Airline *
                    </label>
                    <div className="relative">
                      <Plane className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={ticket.airline}
                        onChange={(e) => updateTicket(ticket.id, 'airline', e.target.value)}
                        placeholder="Enter airline name"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Ticket Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ticket Upload
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id={`ticket-${ticket.id}`}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => handleTicketFileUpload(ticket.id, e)}
                        className="hidden"
                      />
                      <label
                        htmlFor={`ticket-${ticket.id}`}
                        className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {ticket.attachment ? ticket.attachment.name : 'Upload ticket'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {tickets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No tickets added yet. Click "Add Ticket" to get started.</p>
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
            Submit Details
          </Button>
        </div>
      </div>
    </Modal>
  );
};