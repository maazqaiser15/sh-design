import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { useToast } from '../../../../contexts/ToastContext';

interface UploadRecutSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (sheet: RecutSheet) => void;
}

interface RecutSheet {
  id: string;
  fileName: string;
  uploadedAt: Date;
  processedAt: Date;
  status: string;
  recutsCreated: number;
  totalRows: number;
}

type UploadState = 'idle' | 'uploading' | 'processing' | 'completed' | 'error';

export const UploadRecutSheetModal: React.FC<UploadRecutSheetModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!validTypes.includes(file.type)) {
        setErrorMessage('Please upload a CSV or Excel file (.csv, .xls, .xlsx)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('File size must be less than 10MB');
        return;
      }

      setUploadedFile(file);
      setErrorMessage('');
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setUploadState('uploading');
    setProcessingProgress(0);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setUploadState('processing');
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create mock sheet data
      const mockSheet: RecutSheet = {
        id: `recut-sheet-${Date.now()}`,
        fileName: uploadedFile.name,
        uploadedAt: new Date(),
        processedAt: new Date(),
        status: 'Completed',
        recutsCreated: 5,
        totalRows: 5
      };

      setUploadState('completed');
      showToast('Recut sheet uploaded and processed successfully', 'success');
      
      // Close modal after a short delay
      setTimeout(() => {
        onUploadComplete(mockSheet);
        handleClose();
      }, 1500);

    } catch (error) {
      setUploadState('error');
      setErrorMessage('Failed to process the recut sheet. Please try again.');
    }
  };

  const handleClose = () => {
    setUploadState('idle');
    setUploadedFile(null);
    setProcessingProgress(0);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      setErrorMessage('');
    }
  };

  const renderContent = () => {
    if (uploadState === 'uploading' || uploadState === 'processing') {
      return (
        <div className="text-center py-8">
          <div className="mb-4">
            {uploadState === 'uploading' ? (
              <Upload className="w-12 h-12 text-blue-500 mx-auto animate-pulse" />
            ) : (
              <Loader2 className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {uploadState === 'uploading' ? 'Uploading...' : 'Processing recut sheet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {uploadState === 'uploading' 
              ? 'Uploading your file...' 
              : 'Processing recut data… Please wait'
            }
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${processingProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">{processingProgress}% complete</p>
        </div>
      );
    }

    if (uploadState === 'completed') {
      return (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Complete!
          </h3>
          <p className="text-gray-600">
            Recut sheet processed successfully
          </p>
        </div>
      );
    }

    if (uploadState === 'error') {
      return (
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Failed
          </h3>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <Button
            variant="primary"
            onClick={() => setUploadState('idle')}
          >
            Try Again
          </Button>
        </div>
      );
    }

    // Default upload state
    return (
      <div className="py-6">
        <div className="text-center mb-6">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Recut Sheet
          </h3>
          <p className="text-gray-600">
            Upload a CSV or Excel file containing recut specifications
          </p>
        </div>

        {/* File Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {uploadedFile ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <div className="text-left">
                <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedFile(null);
                  setErrorMessage('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div>
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-gray-500">
                CSV, XLS, XLSX (max 10MB)
              </p>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        {/* File Requirements */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">File Requirements:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• CSV or Excel format (.csv, .xls, .xlsx)</li>
            <li>• Maximum file size: 10MB</li>
            <li>• Required columns: Window ID, Recut Reason, New Dimensions, Notes</li>
            <li>• First row should contain column headers</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Upload Recut Sheet"
      size="lg"
    >
      {renderContent()}
      
      {uploadState === 'idle' && (
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={!uploadedFile}
          >
            Upload & Process
          </Button>
        </div>
      )}
    </Modal>
  );
};
