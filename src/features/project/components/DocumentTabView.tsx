import React, { useState } from 'react';
import { ProjectDocument } from '../types/projectDetails';

interface DocumentTabViewProps {
  documents: ProjectDocument[];
  onUploadDocument: (file: File, category: string) => void;
  onDeleteDocument: (documentId: string) => void;
  onDownloadDocument: (document: ProjectDocument) => void;
}

const DocumentTabView: React.FC<DocumentTabViewProps> = ({
  documents,
  onUploadDocument,
  onDeleteDocument,
  onDownloadDocument
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Mock documents as requested
  const mockDocuments: ProjectDocument[] = [
    {
      id: 'doc-1',
      name: 'Site Map - Floor Plan.pdf',
      type: 'application/pdf',
      label: 'site-map',
      size: 2048576,
      url: '/documents/site-map.pdf',
      uploadedAt: '2024-01-15T09:00:00Z',
      uploadedBy: 'John Admin',
      projectId: 'proj-001',
      category: 'site-map'
    },
    {
      id: 'doc-2',
      name: 'Installation Contract.pdf',
      type: 'application/pdf',
      label: 'contract',
      size: 1536000,
      url: '/documents/contract.pdf',
      uploadedAt: '2024-01-16T11:30:00Z',
      uploadedBy: 'Sarah Manager',
      projectId: 'proj-001',
      category: 'contract'
    },
    {
      id: 'doc-3',
      name: 'Blueprint - Main Building.dwg',
      type: 'application/dwg',
      label: 'blueprint',
      size: 5120000,
      url: '/documents/blueprint.dwg',
      uploadedAt: '2024-01-17T14:15:00Z',
      uploadedBy: 'Mike Engineer',
      projectId: 'proj-001',
      category: 'technical'
    },
    {
      id: 'doc-4',
      name: 'Cut Sheet - Security Film.xlsx',
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      label: 'cut-sheet',
      size: 1024000,
      url: '/documents/cut-sheet.xlsx',
      uploadedAt: '2024-01-18T10:45:00Z',
      uploadedBy: 'Emily Tech',
      projectId: 'proj-001',
      category: 'technical'
    }
  ];

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

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) {
      return (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
    } else if (type.includes('dwg') || type.includes('cad')) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
    } else if (type.includes('excel') || type.includes('spreadsheet')) {
      return (
        <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'site-map':
        return 'Site Map';
      case 'contract':
        return 'Contract';
      case 'technical':
        return 'Technical';
      case 'permit':
        return 'Permit';
      default:
        return 'Other';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'site-map':
        return 'bg-blue-100 text-blue-800';
      case 'contract':
        return 'bg-green-100 text-green-800';
      case 'technical':
        return 'bg-purple-100 text-purple-800';
      case 'permit':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      Array.from(files).forEach(file => {
        onUploadDocument(file, 'other');
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        onUploadDocument(file, 'other');
      });
    }
    event.target.value = '';
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg text-[#101828] leading-7">Project Documents</h3>
            <p className="font-normal text-sm text-[#475467] leading-5">
              {mockDocuments.length} documents attached to this project
            </p>
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              id="document-upload"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.dwg,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="document-upload"
              className="bg-[#0d76bf] text-white px-4 py-2 rounded-lg font-semibold text-sm leading-5 flex items-center gap-2 hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Document
            </label>
          </div>
        </div>

        {/* Drag and Drop Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-gray-600 mb-2">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Supports PDF, DOC, XLS, DWG, and image files
          </p>
        </div>

        {/* Documents List */}
        <div>
          <h4 className="font-semibold text-base text-[#101828] mb-4">Attached Documents</h4>
          <div className="space-y-3">
            {mockDocuments.map((document) => (
              <div key={document.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {getFileIcon(document.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-semibold text-sm text-[#101828] truncate">
                        {document.name}
                      </h5>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(document.category)}`}>
                        {getCategoryLabel(document.category)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#475467]">
                      <span>{formatFileSize(document.size)}</span>
                      <span>•</span>
                      <span>Uploaded by {document.uploadedBy}</span>
                      <span>•</span>
                      <span>{formatDate(document.uploadedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDownloadDocument(document)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download document"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteDocument(document.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete document"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Categories Summary */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-blue-900">Document Summary</h4>
              <p className="text-xs text-blue-700">
                Site Map, Contract, Blueprint, Cut Sheet, and more documents available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTabView;
