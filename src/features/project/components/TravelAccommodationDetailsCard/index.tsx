import React from 'react';
import { Plus, CheckCircle, Maximize2, Paperclip, Plane, Hotel, Calendar, Clock, User, Download, Car, Phone, Check } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Card } from 'common/components/Card';
import { formatDateMMDDYYYY } from '../../../../utils/dateUtils';

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

interface TravelAccommodationDetailsCardProps {
  travelAccommodationData?: TravelAccommodationData;
  onAddDetails: () => void;
  onMarkComplete?: () => void;
  onExpand?: () => void;
  onEditDetails?: () => void;
  isCompleted?: boolean;
}

export const TravelAccommodationDetailsCard: React.FC<TravelAccommodationDetailsCardProps> = ({
  travelAccommodationData,
  onAddDetails,
  onMarkComplete,
  onExpand,
  onEditDetails,
  isCompleted = false
}) => {
  const formatDate = (dateString: string) => {
    return formatDateMMDDYYYY(dateString);
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${formatDateMMDDYYYY(startDate)} → ${formatDateMMDDYYYY(endDate)}`;
  };

  const hasData = travelAccommodationData && (
    travelAccommodationData.tickets.length > 0 || 
    travelAccommodationData.hotelDetails.length > 0 || 
    travelAccommodationData.rentalVehicleDetails?.length > 0
  );

  if (!hasData) {
    return (
      <Card className="">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex gap-4 items-start w-full">
            <div className="flex flex-col gap-1 flex-1">
              <h3 className="font-semibold text-lg text-[#101828] leading-7">Travel & Accommodation</h3>
              <p className="font-normal text-sm text-[#475467] leading-5">No details added yet</p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={onAddDetails}
                className="bg-white border border-gray-300 border-dashed text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const ticketCount = travelAccommodationData?.tickets.length || 0;
  const attachmentCount = (travelAccommodationData?.tickets.filter(t => t.attachment).length || 0) + 
                        (travelAccommodationData?.hotelDetails?.reduce((total, hotel) => total + (hotel.reservationSlipFiles?.length || 0), 0) || 0) +
                        (travelAccommodationData?.rentalVehicleDetails?.reduce((total, vehicle) => total + (vehicle.bookingSlipFiles?.length || 0), 0) || 0);

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex gap-4 items-start w-full">
          <div className="flex flex-col gap-1 flex-1">
            <h3 className="font-semibold text-lg text-[#101828] leading-7">Travel & Accommodation</h3>
            <p className="font-normal text-sm text-[#475467] leading-5">
              {ticketCount} ticket{ticketCount !== 1 ? 's' : ''} • {attachmentCount} attachment{attachmentCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2 items-center">
             {/* Mark as Complete / Completed Button */}
             {isCompleted ? (
               <div className="bg-green-600 border border-green-600 text-white px-3 py-1.5 rounded-lg font-semibold text-xs leading-5 flex items-center gap-1.5">
                 <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                   <Check className="w-3 h-3 text-white" />
                 </div>
                 Completed
               </div>
             ) : (
              <button
                onClick={onMarkComplete}
                className="bg-gray-50 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg font-semibold text-xs leading-5 flex items-center gap-1.5 hover:bg-gray-100 transition-colors"
              >
                <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                Mark as Complete
              </button>
            )}

            {/* Edit Details Button */}
            <button
              onClick={onEditDetails}
              className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg font-semibold text-xs leading-5 flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
            >
              Edit Details
            </button>

            {/* Expand Button */}
            <button
              onClick={onExpand}
              className="bg-white border border-gray-300 text-gray-700 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Travel Details Section */}
        {travelAccommodationData?.tickets && travelAccommodationData.tickets.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Plane className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-[#101828] text-base">Travel Details</h4>
            </div>
            
            <div className="space-y-3">
              {travelAccommodationData.tickets.map((ticket, index) => (
                <div key={ticket.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">Ticket {index + 1}</span>
                    </div>
                    {ticket.attachment && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Paperclip className="w-3 h-3" />
                        Attachment
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-blue-700 font-medium">Passenger:</span>
                      <p className="text-blue-900">{ticket.passengerName}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Airline:</span>
                      <p className="text-blue-900">{ticket.airline}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Departure:</span>
                      <p className="text-blue-900">
                        {formatDate(ticket.departureDate)} at {formatTime(ticket.departureTime)}
                      </p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Arrival:</span>
                      <p className="text-blue-900">
                        {formatDate(ticket.arrivalDate)} at {formatTime(ticket.arrivalTime)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accommodation Details Section */}
        {travelAccommodationData?.hotelDetails && travelAccommodationData.hotelDetails.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Hotel className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-[#101828] text-base">Accommodation Details</h4>
            </div>
            
            <div className="space-y-3">
              {travelAccommodationData.hotelDetails.map((hotel, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-green-900">Hotel {index + 1}</h5>
                    {hotel.reservationSlipFiles.length > 0 && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        {hotel.reservationSlipFiles.length} file{hotel.reservationSlipFiles.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-green-700 font-medium text-sm">Hotel Name:</span>
                      <p className="text-green-900 font-medium">{hotel.hotelName}</p>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium text-sm">Number of Rooms:</span>
                      <p className="text-green-900 font-medium">{hotel.numberOfRooms}</p>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium text-sm">Check-in:</span>
                      <p className="text-green-900 font-medium">{formatDate(hotel.checkInDate)}</p>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium text-sm">Check-out:</span>
                      <p className="text-green-900 font-medium">{formatDate(hotel.checkOutDate)}</p>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium text-sm">Hotel Cost:</span>
                      <p className="text-green-900 font-medium">${hotel.hotelCost.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  {/* Reservation Slips */}
                  {hotel.reservationSlipFiles && hotel.reservationSlipFiles.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Paperclip className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 font-medium text-sm">Reservation Slips:</span>
                      </div>
                      <div className="space-y-2">
                        {hotel.reservationSlipFiles.map((file, fileIndex) => (
                          <div key={fileIndex} className="flex items-center justify-between bg-white border border-green-200 rounded-md p-2">
                            <span className="text-green-900 text-sm truncate">{file.name}</span>
                            <button className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rental Vehicle Details Section */}
        {travelAccommodationData?.rentalVehicleDetails && travelAccommodationData.rentalVehicleDetails.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-5 h-5 text-orange-600" />
              <h4 className="font-semibold text-[#101828] text-base">Rental Vehicle Details</h4>
            </div>
            
            <div className="space-y-4">
              {travelAccommodationData.rentalVehicleDetails.map((vehicle, index) => (
                <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-orange-900">Vehicle {index + 1}</h5>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-orange-700 font-medium text-sm">Company Name:</span>
                      <p className="text-orange-900 font-medium">{vehicle.companyName}</p>
                    </div>
                    <div>
                      <span className="text-orange-700 font-medium text-sm">Booking Name:</span>
                      <p className="text-orange-900 font-medium">{vehicle.bookingName}</p>
                    </div>
                    <div>
                      <span className="text-orange-700 font-medium text-sm">Booked By:</span>
                      <p className="text-orange-900 font-medium">{vehicle.bookedBy}</p>
                    </div>
                    <div>
                      <span className="text-orange-700 font-medium text-sm">Company Contact:</span>
                      <p className="text-orange-900 font-medium">{vehicle.companyContactNumber}</p>
                    </div>
                    <div>
                      <span className="text-orange-700 font-medium text-sm">Rental Cost:</span>
                      <p className="text-orange-900 font-medium">${vehicle.rentalCost.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-orange-700 font-medium text-sm">Duration:</span>
                      <p className="text-orange-900 font-medium">
                        {formatDate(vehicle.fromDate)} → {formatDate(vehicle.toDate)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Booking Slips */}
                  {vehicle.bookingSlipFiles && vehicle.bookingSlipFiles.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Paperclip className="w-4 h-4 text-orange-600" />
                        <span className="text-orange-700 font-medium text-sm">Booking Slips:</span>
                      </div>
                      <div className="space-y-2">
                        {vehicle.bookingSlipFiles.map((file, fileIndex) => (
                          <div key={fileIndex} className="flex items-center justify-between bg-white border border-orange-200 rounded-md p-2">
                            <span className="text-orange-900 text-sm truncate">{file.name}</span>
                            <button className="text-orange-600 hover:text-orange-800 text-sm flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
