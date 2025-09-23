import React, { useState } from 'react';
import { X, Upload, FileText, Loader2 } from 'lucide-react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';

interface UploadTakeOffSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

export const UploadTakeOffSheetModal: React.FC<UploadTakeOffSheetModalProps> = ({
  isOpen,
  onClose,
  onUpload
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProcessingStep('Processing take-off sheet and creating windows…');

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setProcessingStep('Generating windows… Please wait');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Call the upload handler
    onUpload(selectedFile);
    
    // Reset state
    setSelectedFile(null);
    setIsProcessing(false);
    setProcessingStep('');
  };

  const handleManualEntry = () => {
    onClose();
    // Navigate to manual entry or open manual entry modal
    console.log('Manual entry clicked');
  };

  const handleClose = () => {
    if (!isProcessing) {
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-600" />
            Project Setup
          </h2>
          <div className="text-sm text-gray-500">Ready to begin</div>
        </div>

        {isProcessing ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Processing Your File</h3>
            <p className="text-gray-600 mb-4">{processingStep}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            {/* Upload Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-10 h-10 text-blue-600" />
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Upload Take-Off Sheet
            </h3>

            {/* Description */}
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Upload your take-off sheet to create window inventory and start working on the project. 
              This will help us track progress and manage the installation process.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <div className="relative">
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf,.xlsx,.xls,.csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileSelect(file);
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="primary"
                    className="flex items-center space-x-2 px-6 py-3"
                    disabled={!selectedFile}
                    onClick={handleUpload}
                  >
                    <Upload className="w-5 h-5" />
                    <span>
                      {selectedFile ? `Upload ${selectedFile.name}` : 'Upload Take-Off Sheet'}
                    </span>
                  </Button>
                </label>
              </div>

              <Button
                variant="outline"
                onClick={handleManualEntry}
                className="flex items-center space-x-2 px-6 py-3"
              >
                <FileText className="w-5 h-5" />
                <span>Enter Manually</span>
              </Button>
            </div>

            {/* Supported Formats */}
            <p className="text-sm text-gray-500 mb-4">
              Supported formats: PDF, Excel (.xlsx, .xls), CSV
            </p>

            {/* Post-Upload Message */}
            <p className="text-sm text-gray-600">
              Once uploaded, we'll automatically create your window inventory and you can begin tracking progress.
            </p>

            {/* Selected File Preview */}
            {selectedFile && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">{selectedFile.name}</p>
                    <p className="text-xs text-blue-700">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {!isProcessing && (
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
