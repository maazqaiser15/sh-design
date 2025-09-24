import React from 'react';
import { Plus, CheckCircle, Maximize2, Paperclip } from 'lucide-react';
import { Button } from '../../../../common/components/Button';

interface TravelAccommodationDetailsCardProps {
  travelData: {
    travelFrom: string;
    travelTo: string;
    travelDate: string;
    numberOfTeamMembers: number;
    ticketsAttachment?: File[];
  };
  accommodationData: {
    hotelName: string;
    numberOfRooms: number;
    checkInDate: string;
    checkOutDate: string;
    reservationSlipsAttachment?: File[];
  };
  onAddDetails: () => void;
  onMarkComplete?: () => void;
  onExpand?: () => void;
}

export const TravelAccommodationDetailsCard: React.FC<TravelAccommodationDetailsCardProps> = ({
  travelData,
  accommodationData,
  onAddDetails,
  onMarkComplete,
  onExpand
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} → ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const travelAttachmentCount = travelData.ticketsAttachment?.length || 0;
  const accommodationAttachmentCount = accommodationData.reservationSlipsAttachment?.length || 0;
  const totalSelected = (travelAttachmentCount > 0 ? 1 : 0) + (accommodationAttachmentCount > 0 ? 1 : 0);

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex gap-4 items-start w-full">
          <div className="flex flex-col gap-1 flex-1">
            <h3 className="font-semibold text-lg text-[#101828] leading-7">Travel & accommodation</h3>
            <p className="font-normal text-sm text-[#475467] leading-5">
              {totalSelected} selected
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {/* Mark as Complete Button */}
            <button
              onClick={onMarkComplete}
              className="bg-gray-50 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg font-semibold text-xs leading-5 flex items-center gap-1.5 hover:bg-gray-100 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Mark as Complete
            </button>

            {/* Expand Button */}
            <button
              onClick={onExpand}
              className="bg-white border border-gray-300 text-gray-700 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Add Details Button */}
            <button
              onClick={onAddDetails}
              className="bg-white border border-gray-300 border-dashed text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Travel Details Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-[#101828] text-sm mb-1">Travel details</h4>
              <p className="text-[#475467] text-sm">
                {travelData.travelFrom} → {travelData.travelTo}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {travelAttachmentCount > 0 && (
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Paperclip className="w-3 h-3" />
                  {travelAttachmentCount} attachments
                </span>
              )}
              <button
                onClick={onExpand}
                className="bg-white border border-gray-300 text-gray-700 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Hotel Reservation Details Section */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-[#101828] text-sm mb-1">Hotel Reservation Details</h4>
              <p className="text-[#475467] text-sm">
                {accommodationData.hotelName} · {formatDateRange(accommodationData.checkInDate, accommodationData.checkOutDate)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {accommodationAttachmentCount > 0 && (
                <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Paperclip className="w-3 h-3" />
                  {accommodationAttachmentCount} attachments
                </span>
              )}
              <button
                onClick={onExpand}
                className="bg-white border border-gray-300 text-gray-700 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
