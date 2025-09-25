import React, { useState } from 'react';
import { Truck, X, Plus, Paperclip, FileText, CheckCircle } from 'lucide-react';
import { AssignTrailerModal } from '../AssignTrailerModal';
import { TrailerForAssignment } from '../../types/trailers';

interface FilmType {
  name: string;
  required: number;
  inTrailer: number;
  needToShip: number;
}

interface TrailerLogisticsCardProps {
  assignedTrailer?: TrailerForAssignment | null;
  onAssignTrailer: (trailer: TrailerForAssignment) => void;
  onAddAttachment?: () => void;
  onMarkComplete?: () => void;
  filmTypes?: FilmType[];
  hasReceipt?: boolean;
  isCompleted?: boolean;
  availableTrailers?: TrailerForAssignment[];
}

export const TrailerLogisticsCard: React.FC<TrailerLogisticsCardProps> = ({
  assignedTrailer,
  onAssignTrailer,
  onAddAttachment,
  onMarkComplete,
  filmTypes = [
    { name: 'BR', required: 30, inTrailer: 15, needToShip: 15 },
    { name: 'Riot+', required: 10, inTrailer: 5, needToShip: 5 },
    { name: 'Smash', required: 5, inTrailer: 2, needToShip: 3 },
    { name: 'FER', required: 4, inTrailer: 3, needToShip: 1 },
  ],
  hasReceipt = false,
  isCompleted = false,
  availableTrailers = []
}) => {
  const [showAssignTrailerModal, setShowAssignTrailerModal] = useState(false);

  // Calculate totals
  const totalRequired = filmTypes.reduce((sum, type) => sum + type.required, 0);
  const totalInTrailer = filmTypes.reduce((sum, type) => sum + type.inTrailer, 0);
  const totalNeedToShip = filmTypes.reduce((sum, type) => sum + type.needToShip, 0);

  const handleAssignTrailer = (trailer: TrailerForAssignment) => {
    onAssignTrailer(trailer);
    setShowAssignTrailerModal(false);
  };

  const handleAddAttachment = () => {
    if (onAddAttachment) {
      onAddAttachment();
    }
  };

  const handleMarkComplete = () => {
    if (onMarkComplete) {
      onMarkComplete();
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex gap-4 items-start w-full">
            <div className="flex flex-col gap-1 flex-1">
              <h3 className="font-semibold text-lg text-[#101828] leading-7">Trailer & Logistics</h3>
              <p className="font-normal text-sm text-[#475467] leading-5">
                {totalRequired} required • {assignedTrailer ? totalInTrailer : 0} in trailer
              </p>
            </div>
          </div>

          {/* Trailer Assignment Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">
                {assignedTrailer ? assignedTrailer.trailerName : 'No trailer assigned yet'}
              </span>
            </div>
            <button
              onClick={() => setShowAssignTrailerModal(true)}
              className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg font-semibold text-xs leading-5 flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add trailer
            </button>
          </div>

          {/* Logistics Table */}
          <div className="space-y-3">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <div>Required</div>
              <div>In Trailer</div>
              <div>Need to Ship</div>
            </div>

            {/* Table Rows */}
            <div className="space-y-2">
              {filmTypes.slice(0, 4).map((filmType, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-900">
                    {filmType.required} {filmType.required === 1 ? 'Sheet' : 'Sheets'}
                  </div>
                  <div className="text-gray-900">
                    {assignedTrailer ? `${filmType.inTrailer} sheets` : '0 sheets'}
                  </div>
                  <div className="text-gray-900">
                    {assignedTrailer ? `${filmType.needToShip} sheets` : `${filmType.required} sheets`}
                  </div>
                </div>
              ))}
            </div>

            {/* More Items Indicator */}
            {filmTypes.length > 4 && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <X className="w-4 h-4" />
                <span>{filmTypes.length - 4} more film types</span>
              </div>
            )}
          </div>

          {/* Receipt Attachment Section */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">
                {hasReceipt ? 'Receipt attached' : 'No receipt attached yet'}
              </span>
            </div>
            <button
              onClick={handleAddAttachment}
              className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg font-semibold text-xs leading-5 flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
            >
              <Paperclip className="w-4 h-4" />
              Add attachment
            </button>
          </div>

          {/* Mark as Complete Section - Only show when trailer is assigned */}
          {assignedTrailer && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`text-sm ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                  {isCompleted ? 'Trailer & Logistics completed' : 'Ready to mark as complete'}
                </span>
              </div>
              {!isCompleted && (
                <button
                  onClick={handleMarkComplete}
                  className="bg-gray-50 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg font-semibold text-xs leading-5 flex items-center gap-1.5 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-4 h-4 rounded-full border border-gray-600 flex items-center justify-center">
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 3L3 5L7 1" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  Mark as complete
                </button>
              )}
              {isCompleted && (
                <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded-lg font-semibold text-xs leading-5 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Completed
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Assign Trailer Modal */}
      <AssignTrailerModal
        isOpen={showAssignTrailerModal}
        onClose={() => setShowAssignTrailerModal(false)}
        onAssignTrailer={handleAssignTrailer}
        availableTrailers={availableTrailers}
        assignedTrailerId={assignedTrailer?.id}
      />
    </>
  );
};
