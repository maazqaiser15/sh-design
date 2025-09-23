import React, { useState, useRef } from 'react';
import { Upload, Download, Trash2, File, Plus } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { ProjectDocument } from '../../types/projectDetails';

interface ProjectDocumentsProps {
  documents: ProjectDocument[];
  onUploadDocument: (file: File, category: string) => void;
  onDeleteDocument: (documentId: string) => void;
  onDownloadDocument: (document: ProjectDocument) => void;
}

/**
 * ProjectDocuments - Documents section for project files
 * Handles upload, view, and management of project documents
 */
export const ProjectDocuments: React.FC<ProjectDocumentsProps> = ({
  documents,
  onUploadDocument,
  onDeleteDocument,
  onDownloadDocument
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentCategories = [
    { value: 'contract', label: 'Contract' },
    { value: 'site-map', label: 'Site Map' },
    { value: 'permit', label: 'Permit' },
    { value: 'technical', label: 'Technical' },
    { value: 'other', label: 'Other' }
  ];

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    return '📁';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFileUpload = (file: File) => {
    // Default to 'other' category for now
    onUploadDocument(file, 'other');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Project Documents</h3>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => fileInputRef.current?.click()}
        >
          Upload Document
        </Button>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors mb-6 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop files here, or{' '}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            browse
          </button>
        </p>
        <p className="text-xs text-gray-500">
          Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
        </p>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
        />
      </div>

      {/* Documents List */}
      {documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((document) => (
            <div
              key={document.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {getFileIcon(document.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {document.name}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{formatFileSize(document.size)}</span>
                    <span>•</span>
                    <span>{formatDate(document.uploadedAt)}</span>
                    <span>•</span>
                    <span>by {document.uploadedBy}</span>
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                      {documentCategories.find(cat => cat.value === document.category)?.label}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Download}
                  onClick={() => onDownloadDocument(document)}
                  className="p-2"
                >
                  <span className="sr-only">Download</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={() => onDeleteDocument(document.id)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <File className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No documents uploaded yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Upload contracts, site maps, and other project files
          </p>
        </div>
      )}
    </Card>
  );
};
