import React, { useState } from 'react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { Plane, Hotel, Upload, Calendar, Users, MapPin, Clock, Plus, Trash2, User, Car, Phone, DollarSign, Check, Building, FileText } from 'lucide-react';
import SelectField from 'common/components/SelectField';
import FormField from 'common/components/FormField';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';

export interface TicketDetails {
  id: string;
  passengerName: string;
  isRoundTrip: boolean;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  airline: string;
  cost: string;
  attachment?: File;
  // Return ticket details (only used when isRoundTrip is true)
  returnDate?: string;
  returnTime?: string;
  returnArrivalDate?: string;
  returnArrivalTime?: string;
  returnAirline?: string;
  returnCost?: string;
  returnAttachment?: File;
}

export interface RentalVehicleDetails {
  companyName: string;
  bookingName: string;
  bookedBy: string;
  companyContactNumber: string;
  rentalCost: number;
  fromDate: string;
  toDate: string;
  bookingSlipFiles: File[];
}

export interface HotelDetails {
  hotelName: string;
  numberOfRooms: number;
  checkInDate: string;
  checkOutDate: string;
  hotelCost: number;
  reservationSlipFiles: File[];
}

export interface TravelAccommodationData {
  tickets: TicketDetails[];
  hotelDetails: HotelDetails[];
  rentalVehicleDetails?: RentalVehicleDetails[];
}

interface TravelAccommodationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TravelAccommodationData) => void;
}

// Mock passenger data for dropdown
const MOCK_PASSENGERS = [
  { id: '1', name: 'John Smith', role: 'Project Manager' },
  { id: '2', name: 'Sarah Johnson', role: 'Site Engineer' },
  { id: '3', name: 'Mike Wilson', role: 'Safety Officer' },
  { id: '4', name: 'Lisa Brown', role: 'Quality Inspector' },
  { id: '5', name: 'David Lee', role: 'Technician' },
  { id: '6', name: 'Emma Davis', role: 'Supervisor' },
];

export const TravelAccommodationModal: React.FC<TravelAccommodationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  // Ticket form state
  const [tickets, setTickets] = useState<TicketDetails[]>([]);

  // Accommodation form state
  const [hotels, setHotels] = useState<HotelDetails[]>([]);

  // Rental Vehicle form state
  const [rentalVehicles, setRentalVehicles] = useState<RentalVehicleDetails[]>([{
    companyName: '',
    bookingName: '',
    bookedBy: '',
    companyContactNumber: '',
    rentalCost: 0,
    fromDate: '',
    toDate: '',
    bookingSlipFiles: []
  }]);

  // Ticket management functions
  const addTicket = () => {
    const newTicket: TicketDetails = {
      id: Date.now().toString(),
      passengerName: '',
      isRoundTrip: false,
      departureDate: '',
      departureTime: '',
      arrivalDate: '',
      arrivalTime: '',
      airline: '',
      cost: '',
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

  // Rental Vehicle management functions
  const addRentalVehicle = () => {
    const newVehicle: RentalVehicleDetails = {
      companyName: '',
      bookingName: '',
      bookedBy: '',
      companyContactNumber: '',
      rentalCost: 0,
      fromDate: '',
      toDate: '',
      bookingSlipFiles: []
    };
    setRentalVehicles(prev => [...prev, newVehicle]);
  };

  const removeRentalVehicle = (index: number) => {
    setRentalVehicles(prev => prev.filter((_, i) => i !== index));
  };

  const updateRentalVehicle = (index: number, field: keyof RentalVehicleDetails, value: string | File[]) => {
    setRentalVehicles(prev => prev.map((vehicle, i) =>
      i === index ? { ...vehicle, [field]: value } : vehicle
    ));
  };


  const handleRentalVehicleBookingSlipsUpload = (vehicleIndex: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    updateRentalVehicle(vehicleIndex, 'bookingSlipFiles', [...rentalVehicles[vehicleIndex].bookingSlipFiles, ...files]);
  };

  const removeRentalVehicleBookingSlipFile = (vehicleIndex: number, fileIndex: number) => {
    const updatedFiles = rentalVehicles[vehicleIndex].bookingSlipFiles.filter((_, i) => i !== fileIndex);
    updateRentalVehicle(vehicleIndex, 'bookingSlipFiles', updatedFiles);
  };

  // Hotel management functions
  const addHotel = () => {
    const newHotel: HotelDetails = {
      hotelName: '',
      numberOfRooms: 1,
      checkInDate: '',
      checkOutDate: '',
      hotelCost: 0,
      reservationSlipFiles: []
    };
    setHotels(prev => [...prev, newHotel]);
  };

  const removeHotel = (index: number) => {
    setHotels(prev => prev.filter((_, i) => i !== index));
  };

  const updateHotel = (index: number, field: keyof HotelDetails, value: string | number | File[]) => {
    setHotels(prev => prev.map((hotel, i) =>
      i === index ? { ...hotel, [field]: value } : hotel
    ));
  };

  const handleHotelReservationSlipsUpload = (hotelIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    updateHotel(hotelIndex, 'reservationSlipFiles', [...hotels[hotelIndex].reservationSlipFiles, ...files]);
  };

  const removeHotelReservationSlipFile = (hotelIndex: number, fileIndex: number) => {
    const updatedFiles = hotels[hotelIndex].reservationSlipFiles.filter((_, i) => i !== fileIndex);
    updateHotel(hotelIndex, 'reservationSlipFiles', updatedFiles);
  };

  const handleSubmit = () => {
    const data: TravelAccommodationData = {
      tickets,
      hotelDetails: hotels.filter(hotel => hotel.hotelName),
      rentalVehicleDetails: rentalVehicles.filter(vehicle => vehicle.companyName),
    };
    onSubmit(data);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const isFormValid = () => {
    const accommodationValid = hotels.length > 0 && hotels.every(hotel =>
      hotel.hotelName && hotel.checkInDate && hotel.checkOutDate
    );
    const ticketsValid = tickets.length > 0 && tickets.every(ticket => {
      const baseValid = ticket.passengerName !== '' &&
        ticket.departureDate !== '' &&
        ticket.departureTime !== '' &&
        ticket.arrivalDate !== '' &&
        ticket.arrivalTime !== '' &&
        ticket.airline.trim() !== '' &&
        ticket.cost.trim() !== '';

      if (ticket.isRoundTrip) {
        return baseValid &&
          ticket.returnDate !== '' &&
          ticket.returnTime !== '' &&
          ticket.returnArrivalDate !== '' &&
          ticket.returnArrivalTime !== '' &&
          ticket.returnAirline?.trim() !== '' &&
          ticket.returnCost?.trim() !== '';
      }

      return baseValid;
    });
    const rentalVehicleValid = rentalVehicles.every(vehicle =>
      !vehicle.companyName || (
        vehicle.companyName &&
        vehicle.bookingName &&
        vehicle.bookedBy &&
        vehicle.companyContactNumber &&
        vehicle.fromDate &&
        vehicle.toDate
      )
    );
    return accommodationValid && ticketsValid && rentalVehicleValid;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Travel & Accommodation Details" size="xl">
      <div className="space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Flight Tickets Management */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Flight Tickets</h4>
              <p className="text-sm text-gray-600">
                {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} configured
              </p>
            </div>
            <Button
              variant="primary"
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
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ticket.isRoundTrip}
                        onChange={(e) => updateTicket(ticket.id, 'isRoundTrip', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Round Trip</span>
                    </label>
                    <button
                      onClick={() => removeTicket(ticket.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <Formik initialValues={null} onSubmit={function (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>): void | Promise<any> {
                  throw new Error('Function not implemented.');
                }}>
                  <Form>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Passenger Selection */}
                      <SelectField value={ticket.passengerName} label='Passenger *' onChange={(e) => updateTicket(ticket.id, 'passengerName', e.target.value)} inputClassName={'border border-gray-300'} placeholder={'Select passenger'} options={MOCK_PASSENGERS} />


                      <FormField label={' Departure Date *'} onChange={(e) => updateTicket(ticket.id, 'departureDate', e.target.value)} value={ticket.departureDate} name={'departureDate'} type={'date'} />

                      {/* Departure Time */}
                      <FormField label={'Departure Time *'} onChange={(e) => updateTicket(ticket.id, 'departureTime', e.target.value)} value={ticket.departureTime} name={'departureTime'} type={'time'} />
                      {/* Arrival Date */}

                      <FormField label={'Arrival Date *'} onChange={(e) => updateTicket(ticket.id, 'arrivalDate', e.target.value)} value={ticket.arrivalDate} name={'arrivalDate'} type={'date'} />

                      {/* Arrival Time */}

                      <FormField label={'Arrival Time *'} onChange={(e) => updateTicket(ticket.id, 'arrivalTime', e.target.value)} value={ticket.arrivalTime} name={'arrivalTime'} type={'time'} />

                      {/* Airline */}

                      <FormField isLeftIcon={<Plane />} placeholder='Enter airline name' label={'Airline *'} onChange={(e) => updateTicket(ticket.id, 'airline', e.target.value)} value={ticket.airline} name={'airline'} type={'text'} />

                      {/* Ticket Cost */}

                      <FormField isLeftIcon={<DollarSign />} placeholder='0.00' label={'Ticket Cost *'} onChange={(e) => updateTicket(ticket.id, 'cost', e.target.value)} value={ticket.cost} name={'cost'} type={'number'} />

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
                  </Form>
                </Formik>



                {/* Return Ticket Details - Only show when round trip is checked */}
                {ticket.isRoundTrip && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <Check className="w-4 h-4 text-green-600" />
                      <h5 className="font-medium text-gray-900">Return Ticket Details</h5>
                    </div>
                    <Formik initialValues={undefined} onSubmit={function (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>): void | Promise<any> {
                      throw new Error('Function not implemented.');
                    }}>
                      <Form>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* Return Date */}
                          <FormField isLeftIcon={<Calendar />} label={'Return Date *'} onChange={(e) => updateTicket(ticket.id, 'returnDate', e.target.value)} value={ticket.returnDate} name={'returnDate'} type={'date'} />

                          {/* Return Time */}
                          <FormField isLeftIcon={<Clock />} label={'Return Time *'} onChange={(e) => updateTicket(ticket.id, 'returnTime', e.target.value)} value={ticket.returnTime} name={'returnTime'} type={'time'} />

                          {/* Return Arrival Date */}

                          <FormField isLeftIcon={<Calendar />} label={'Return Arrival Date *'} onChange={(e) => updateTicket(ticket.id, 'returnArrivalDate', e.target.value)} value={ticket.returnArrivalDate} name={'returnArrivalDate'} type={'date'} />
                          {/* Return Arrival Time */}

                          <FormField isLeftIcon={<Clock />} label={'Return Arrival Date *'} onChange={(e) => updateTicket(ticket.id, 'returnArrivalTime', e.target.value)} value={ticket.returnArrivalTime} name={'returnArrivalTime'} type={'time'} />

                          {/* Return Airline */}

                          <FormField isLeftIcon={<Plane />} label={'Return Airline *'} onChange={(e) => updateTicket(ticket.id, 'returnAirline', e.target.value)} value={ticket.returnAirline} name={'returnAirline'} type={'text'} />

                          {/* Return Cost */}

                          <FormField isLeftIcon={<DollarSign />} label={'Return Cost *'} onChange={(e) => updateTicket(ticket.id, 'returnCost', e.target.value)} value={ticket.returnCost} name={'returnCost'} type={'number'} />

                          {/* Return Ticket Upload */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Return Ticket Upload
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                id={`return-ticket-${ticket.id}`}
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    updateTicket(ticket.id, 'returnAttachment', file);
                                  }
                                }}
                                className="hidden"
                              />
                              <label
                                htmlFor={`return-ticket-${ticket.id}`}
                                className="flex items-center justify-center w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                              >
                                <Upload className="w-4 h-4 text-gray-400 mr-2" />
                                <span className="text-sm text-gray-600">
                                  {ticket.returnAttachment ? ticket.returnAttachment.name : 'Upload return ticket'}
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>

                      </Form>
                    </Formik>

                  </div>
                )}
              </div>
            ))}

            {tickets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Plane className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No flight tickets added yet. Click "Add Ticket" to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Accommodation Details Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Hotel className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Accommodation Details</h3>
            </div>
            <button
              onClick={addHotel}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Hotel
            </button>
          </div>

          {hotels.length === 0 ? (
            <div className="text-center py-8">
              <Hotel className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No hotels added yet. Click 'Add Hotel' to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {hotels.map((hotel, hotelIndex) => (
                <div key={hotelIndex} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Hotel className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-gray-900">Hotel {hotelIndex + 1}</span>
                    </div>
                    <button
                      onClick={() => removeHotel(hotelIndex)}
                      className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                  <Formik initialValues={undefined} onSubmit={function (values: FormikValues, formikHelpers: FormikHelpers<FormikValues>): void | Promise<any> {
                    throw new Error('Function not implemented.');
                  }}>

                    <Form>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Hotel Name */}
                  
                          <FormField isLeftIcon={<Hotel />} label={'Hotel Name *'} onChange={(e) => updateHotel(hotelIndex, 'hotelName', e.target.value)} value={hotel.hotelName} name={'hotelName'} type={'text'} />

                        {/* Number of Rooms */}
                        {/* <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Number of Rooms *
                          </label>
                          <input
                            type="number"
                            value={hotel.numberOfRooms}
                            onChange={(e) => updateHotel(hotelIndex, 'numberOfRooms', Math.max(1, Number(e.target.value)))}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          />
                        </div> */}
                          <FormField isLeftIcon={<Hotel />} label={'Number of Rooms *'} onChange={(e) => updateHotel(hotelIndex, 'hotelName', e.target.value)} value={hotel.numberOfRooms} name={'hotelName'} type={'text'} />

                        {/* Check-in Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Check-in Date *
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="date"
                              value={hotel.checkInDate}
                              onChange={(e) => updateHotel(hotelIndex, 'checkInDate', e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            />
                          </div>
                        </div>

                        {/* Check-out Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Check-out Date *
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="date"
                              value={hotel.checkOutDate}
                              onChange={(e) => updateHotel(hotelIndex, 'checkOutDate', e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            />
                          </div>
                        </div>

                        {/* Hotel Cost */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hotel Cost *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                            <input
                              type="number"
                              value={hotel.hotelCost}
                              onChange={(e) => updateHotel(hotelIndex, 'hotelCost', Math.max(0, Number(e.target.value)))}
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            />
                          </div>
                        </div>
                      </div>

                    </Form>
                  </Formik>


                  {/* Attach Reservation Slips */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attach Reservation Slips
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        id={`hotel-reservation-${hotelIndex}`}
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => handleHotelReservationSlipsUpload(hotelIndex, e)}
                        className="hidden"
                      />
                      <label
                        htmlFor={`hotel-reservation-${hotelIndex}`}
                        className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 rounded-lg p-4 transition-colors"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">Click to upload reservation slips or drag and drop</span>
                        <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC up to 10MB</span>
                      </label>
                    </div>

                    {/* Display uploaded files */}
                    {hotel.reservationSlipFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {hotel.reservationSlipFiles.map((file, fileIndex) => (
                          <div key={fileIndex} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md p-2">
                            <div className="flex items-center gap-2">
                              <Upload className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                            </div>
                            <button
                              onClick={() => removeHotelReservationSlipFile(hotelIndex, fileIndex)}
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
              ))}
            </div>
          )}
        </div>

        {/* Rental Vehicle Details Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Rental Vehicle Details</h3>
            </div>
            <button
              onClick={addRentalVehicle}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
            </button>
          </div>

          {rentalVehicles.map((vehicle, vehicleIndex) => (
            <div key={vehicleIndex} className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-medium text-gray-800">Vehicle {vehicleIndex + 1}</h4>
                {rentalVehicles.length > 1 && (
                  <button
                    onClick={() => removeRentalVehicle(vehicleIndex)}
                    className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={vehicle.companyName}
                      onChange={(e) => updateRentalVehicle(vehicleIndex, 'companyName', e.target.value)}
                      placeholder="Enter company name"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Booking Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking Name
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={vehicle.bookingName}
                      onChange={(e) => updateRentalVehicle(vehicleIndex, 'bookingName', e.target.value)}
                      placeholder="Enter booking name"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Booked By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booked By
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={vehicle.bookedBy}
                      onChange={(e) => updateRentalVehicle(vehicleIndex, 'bookedBy', e.target.value)}
                      placeholder="Enter booked by name"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Company Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={vehicle.companyContactNumber}
                      onChange={(e) => updateRentalVehicle(vehicleIndex, 'companyContactNumber', e.target.value)}
                      placeholder="Enter company contact number"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Rental Cost */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rental Cost
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={vehicle.rentalCost}
                      onChange={(e) => updateRentalVehicle(vehicleIndex, 'rentalCost', Math.max(0, Number(e.target.value)))}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* From Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={vehicle.fromDate}
                      onChange={(e) => updateRentalVehicle(vehicleIndex, 'fromDate', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* To Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={vehicle.toDate}
                      onChange={(e) => updateRentalVehicle(vehicleIndex, 'toDate', e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Attach Booking Slips */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attach Booking Slips
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    id={`rentalBookingSlipsUpload-${vehicleIndex}`}
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => handleRentalVehicleBookingSlipsUpload(vehicleIndex, e)}
                    className="hidden"
                  />
                  <label
                    htmlFor={`rentalBookingSlipsUpload-${vehicleIndex}`}
                    className="flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 rounded-lg p-4 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload booking slips or drag and drop</span>
                    <span className="text-xs text-gray-500 mt-1">PDF, JPG, PNG, DOC up to 10MB</span>
                  </label>
                </div>

                {/* Display uploaded files */}
                {vehicle.bookingSlipFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {vehicle.bookingSlipFiles.map((file, fileIndex) => (
                      <div key={fileIndex} className="flex items-center justify-between bg-white border border-gray-200 rounded-md p-2">
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        <button
                          onClick={() => removeRentalVehicleBookingSlipFile(vehicleIndex, fileIndex)}
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
          ))}
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