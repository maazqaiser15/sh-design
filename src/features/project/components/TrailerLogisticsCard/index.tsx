import React, { useState, useRef } from 'react';
import { Truck, Plus, Paperclip, FileText, CheckCircle } from 'lucide-react';
import { AssignTrailerModal } from '../AssignTrailerModal';
import { TrailerForAssignment } from '../../types/trailers';
import { Card } from 'common/components/Card';

interface TrailerLogisticsCardProps {
  assignedTrailer?: TrailerForAssignment | null;
  onAssignTrailer: (trailer: TrailerForAssignment) => void;
  onAddAttachment?: (files: File[]) => void;
  onMarkComplete?: () => void;
  hasReceipt?: boolean;
  isCompleted?: boolean;
  availableTrailers?: TrailerForAssignment[];
  attachedFiles?: File[];
}

export const TrailerLogisticsCard: React.FC<TrailerLogisticsCardProps> = ({
  assignedTrailer,
  onAssignTrailer,
  onAddAttachment,
  onMarkComplete,
  hasReceipt = false,
  isCompleted = false,
  availableTrailers = [],
  attachedFiles = []
}) => {
  const [showAssignTrailerModal, setShowAssignTrailerModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(attachedFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAssignTrailer = (trailer: TrailerForAssignment) => {
    onAssignTrailer(trailer);
    setShowAssignTrailerModal(false);
  };

  const handleAddAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      const newFiles = [...uploadedFiles, ...files];
      setUploadedFiles(newFiles);
      if (onAddAttachment) {
        onAddAttachment(newFiles);
      }
    }
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    if (onAddAttachment) {
      onAddAttachment(updatedFiles);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleMarkComplete = () => {
    if (onMarkComplete) {
      onMarkComplete();
    }
  };


  return (
    <>
      <Card>
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex gap-4 items-start w-full">
            <div className="flex flex-col gap-1 flex-1">
              <h3 className="font-semibold text-lg text-[#101828] leading-7">Trailer & Films</h3>
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
              {assignedTrailer ? 'Change trailer' : 'Add trailer'}
            </button>
          </div>


          {/* Receipt Attachment Section */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">
                  {uploadedFiles.length > 0 ? `${uploadedFiles.length} file(s) attached` : 'No receipt attached yet'}
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
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {/* Show attached files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Remove file"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mark as Complete Section - Only show when trailer is assigned */}
          {assignedTrailer && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`text-sm ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                  {isCompleted ? 'Trailer & Films completed' : 'Ready to mark as complete'}
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
      </Card>

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
