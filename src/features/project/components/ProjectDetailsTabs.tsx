import React, { useState } from 'react';
import { ProjectDetails, PreparationStageData, ProjectDocument, ProjectNote } from '../types/projectDetails';
import { LogisticsTravelData } from '../types/logisticsTravel';
import TeamTabView from './TeamTabView';
import TravelTabView from './TravelTabView';
import DocumentTabView from './DocumentTabView';
import NotesTabView from './NotesTabView';

interface ProjectDetailsTabsProps {
  project: ProjectDetails;
  preparationData: PreparationStageData;
}

const ProjectDetailsTabs: React.FC<ProjectDetailsTabsProps> = ({
  project,
  preparationData
}) => {
  const [activeTab, setActiveTab] = useState<'job-brief' | 'team' | 'travel' | 'document' | 'notes'>('job-brief');

  const tabs = [
    { id: 'job-brief' as const, label: 'Job brief' },
    { id: 'team' as const, label: 'Team' },
    { id: 'travel' as const, label: 'Travel & Hotel' },
    { id: 'document' as const, label: 'Document' },
    { id: 'notes' as const, label: 'Notes' }
  ];

  const handleDocumentUpload = (file: File, category: string) => {
    const newDocument: ProjectDocument = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: file.type,
      label: category as any,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User',
      projectId: project.id,
      category: category as any
    };
    
    // In a real app, you would update the state here
    console.log('Uploading document:', newDocument);
  };

  const handleDocumentDelete = (documentId: string) => {
    // In a real app, you would update the state here
    console.log('Deleting document:', documentId);
  };

  const handleDocumentDownload = (document: ProjectDocument) => {
    // In a real app, this would trigger a download
    console.log('Downloading document:', document.name);
    alert(`Downloading ${document.name}`);
  };

  const handleAddNote = (content: string, isInternal: boolean) => {
    const newNote: ProjectNote = {
      id: `note-${Date.now()}`,
      content,
      author: 'Current User',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: project.id,
      isInternal
    };
    
    // In a real app, you would update the state here
    console.log('Adding note:', newNote);
  };

  const handleEditNote = (noteId: string, content: string) => {
    // In a real app, you would update the state here
    console.log('Editing note:', noteId, content);
  };

  const handleDeleteNote = (noteId: string) => {
    // In a real app, you would update the state here
    console.log('Deleting note:', noteId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'job-brief':
        return (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-semibold text-lg text-[#101828] leading-7 mb-2">Job Brief</h3>
                <p className="font-normal text-sm text-[#475467] leading-5">
                  Project overview and key information
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-sm text-[#101828] mb-2">Project Description</h4>
                  <p className="text-sm text-[#475467] leading-5">
                    {project.description || 'Comprehensive security film installation for the new downtown office complex. This project involves installing high-grade security film on all exterior windows to enhance building security and protection.'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-sm text-[#101828] mb-2">Project Details</h4>
                    <div className="space-y-2 text-sm text-[#475467]">
                      <div className="flex justify-between">
                        <span>Project ID:</span>
                        <span className="font-medium">{project.projectId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-medium">{project.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Start Date:</span>
                        <span className="font-medium">{new Date(project.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>End Date:</span>
                        <span className="font-medium">{new Date(project.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-sm text-[#101828] mb-2">Location</h4>
                    <div className="space-y-2 text-sm text-[#475467]">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{project.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'team':
        return <TeamTabView assignedTeam={preparationData.assignedTeam?.members || null} />;
      
      case 'travel':
        return <TravelTabView travelData={preparationData.logisticsTravel} />;
      
      case 'document':
        return (
          <DocumentTabView
            documents={preparationData.documents}
            onUploadDocument={handleDocumentUpload}
            onDeleteDocument={handleDocumentDelete}
            onDownloadDocument={handleDocumentDownload}
          />
        );
      
      case 'notes':
        return (
          <NotesTabView
            notes={preparationData.notes}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="py-6">
        {/* Project Header */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 items-start w-full">
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex gap-3 items-center">
                  <h1 className="font-semibold text-2xl text-gray-900 leading-9.5">{project.name}</h1>
                  <div className="bg-[#e6f4fd] flex items-center justify-center px-2 py-1 rounded-md">
                    <p className="font-semibold text-sm text-[#0d76bf] leading-5">{project.status}</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="bg-gray-50 flex items-center justify-center px-2 py-1 rounded-md">
                    <p className="font-semibold text-xs text-[#344054] leading-5">{project.projectId}</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 18.3333C10 18.3333 16.6667 12.5 16.6667 8.33333C16.6667 6.44928 15.7143 4.64236 14.0711 3.28595C12.4278 1.92954 10.2243 1.16667 8.33333 1.16667C6.44238 1.16667 4.23886 1.92954 2.59564 3.28595C0.952427 4.64236 0 6.44928 0 8.33333C0 12.5 6.66667 18.3333 10 18.3333Z" stroke="#667085" strokeWidth="1.5"/>
                      <path d="M10 10.8333C11.3807 10.8333 12.5 9.71405 12.5 8.33333C12.5 6.95262 11.3807 5.83333 10 5.83333C8.61929 5.83333 7.5 6.95262 7.5 8.33333C7.5 9.71405 8.61929 10.8333 10 10.8333Z" stroke="#667085" strokeWidth="1.5"/>
                    </svg>
                    <p className="font-normal text-xs text-[#475467] leading-5">{project.location}</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.66667 1.66667V4.16667M13.3333 1.66667V4.16667M2.91667 7.5H17.0833M17.5 7.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V7.5H17.5ZM2.5 7.5V5.83333C2.5 5.39131 2.67559 4.96738 2.98816 4.65482C3.30072 4.34226 3.72464 4.16667 4.16667 4.16667H15.8333C16.2754 4.16667 16.6993 4.34226 17.0118 4.65482C17.3244 4.96738 17.5 5.39131 17.5 5.83333V7.5H2.5Z" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="font-normal text-xs text-[#475467] leading-5">
                      {new Date(project.startDate).toLocaleDateString()} – {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm leading-5 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#0d76bf] text-[#0d76bf]'
                    : 'border-transparent text-[#475467] hover:text-[#344054]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProjectDetailsTabs;
