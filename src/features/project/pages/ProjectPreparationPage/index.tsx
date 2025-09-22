import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectPreparationData, MOCK_PREPARATION_DATA } from '../../types/preparation';
import { Document, Note, DocumentLabel, TeamMember, Trailer } from '../../../../types';
import { ProjectSummaryCard } from '../../components/ProjectSummaryCard';
import { ChecklistSection } from '../../components/ChecklistSection';
import { AssignTeamCard } from '../../components/AssignTeamCard';
import { AssignTrailerCard } from '../../components/AssignTrailerCard';
import { TravelCard } from '../../components/TravelCard';
import { DocumentsNotesCard } from '../../components/DocumentsNotesCard';

/**
 * ProjectPreparationPage - Main page for project preparation workflow
 * Combines all preparation components in a comprehensive layout
 */
export const ProjectPreparationPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  // State management for the preparation data
  const [preparationData, setPreparationData] = useState<ProjectPreparationData>(MOCK_PREPARATION_DATA);
  const [assignedMembers, setAssignedMembers] = useState<TeamMember[]>([]);
  const [assignedTrailer, setAssignedTrailer] = useState<Trailer | null>(null);

  // Handle checklist item toggle
  const handleToggleChecklistItem = (itemId: string) => {
    setPreparationData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  // Handle team member assignment
  const handleAssignMembers = (memberIds: string[]) => {
    // In a real app, this would fetch team member data
    const members: TeamMember[] = memberIds.map(id => ({
      id,
      name: `Member ${id}`,
      designation: 'Team Member',
      status: 'available',
      location: 'Downtown',
      phone: '+1-555-0000',
      email: `member${id}@company.com`,
      role: 'installer',
      availability: 'available',
      currentProjects: [],
      productivity: 85
    }));
    
    setAssignedMembers(members);
    
    // Update checklist
    setPreparationData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.label === 'Team Assigned' ? { ...item, completed: true } : item
      )
    }));
  };

  // Handle trailer assignment
  const handleAssignTrailer = (trailerId: string | null) => {
    if (trailerId) {
      // In a real app, this would fetch trailer data
      const trailer: Trailer = {
        id: trailerId,
        trailerNumber: 'TR-2024-001',
        registrationNumber: 'ABC-123',
        location: 'Warehouse A',
        inventory: {
          tools: [],
          filmSheets: []
        },
        status: 'available',
        activityLogs: [],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      };
      
      setAssignedTrailer(trailer);
      
      // Update checklist
      setPreparationData(prev => ({
        ...prev,
        checklist: prev.checklist.map(item =>
          item.label === 'Trailer Assigned' ? { ...item, completed: true } : item
        )
      }));
    } else {
      setAssignedTrailer(null);
    }
  };

  // Handle film not required
  const handleFilmNotRequired = () => {
    // Update checklist
    setPreparationData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.label === 'Logistics Planned' ? { ...item, completed: true } : item
      )
    }));
  };

  // Handle shipment receipt upload
  const handleUploadShipmentReceipt = (file: File) => {
    console.log('Shipment receipt uploaded:', file.name);
    // Update checklist
    setPreparationData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.label === 'Logistics Planned' ? { ...item, completed: true } : item
      )
    }));
  };

  // Handle travel plan update
  const handleUpdateTravelPlan = (travelPlan: any) => {
    setPreparationData(prev => ({
      ...prev,
      travelPlan: { ...prev.travelPlan, ...travelPlan }
    }));
    
    // Update checklist if travel is confirmed
    if (travelPlan.travelRequired || travelPlan.hotelBooking) {
      setPreparationData(prev => ({
        ...prev,
        checklist: prev.checklist.map(item =>
          item.label === 'Travel Confirmed' ? { ...item, completed: true } : item
        )
      }));
    }
  };

  // Handle document upload
  const handleUploadDocument = (file: File, label: DocumentLabel) => {
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: file.type,
      label,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User',
      projectId: projectId
    };
    
    setPreparationData(prev => ({
      ...prev,
      documents: [...prev.documents, newDocument]
    }));
    
    // Update checklist
    setPreparationData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.label === 'Documents Added' ? { ...item, completed: true } : item
      )
    }));
  };

  // Handle note addition
  const handleAddNote = (content: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      content,
      author: 'Current User',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: projectId
    };
    
    setPreparationData(prev => ({
      ...prev,
      notes: [...prev.notes, newNote]
    }));
    
    // Update checklist
    setPreparationData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.label === 'Notes Added' ? { ...item, completed: true } : item
      )
    }));
  };

  // Handle document deletion
  const handleDeleteDocument = (documentId: string) => {
    setPreparationData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }));
  };

  // Handle note deletion
  const handleDeleteNote = (noteId: string) => {
    setPreparationData(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== noteId)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Project Summary Card - Sticky */}
      <ProjectSummaryCard
        data={preparationData}
        onAssignTrailer={() => handleAssignTrailer('trailer-001')}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Checklist Section */}
        <div className="mb-8">
          <ChecklistSection
            checklist={preparationData.checklist}
            onToggleItem={handleToggleChecklistItem}
          />
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Assign Team Card */}
            <AssignTeamCard
              assignedMembers={assignedMembers}
              onAssignMembers={handleAssignMembers}
            />

            {/* Assign Trailer Card */}
            <AssignTrailerCard
              assignedTrailer={assignedTrailer}
              onAssignTrailer={handleAssignTrailer}
              onFilmNotRequired={handleFilmNotRequired}
              onUploadShipmentReceipt={handleUploadShipmentReceipt}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Travel Card */}
            <TravelCard
              travelPlan={preparationData.travelPlan}
              onUpdateTravelPlan={handleUpdateTravelPlan}
            />
          </div>
        </div>

        {/* Documents & Notes Card - Full Width */}
        <div className="mb-8">
          <DocumentsNotesCard
            documents={preparationData.documents}
            notes={preparationData.notes}
            onUploadDocument={handleUploadDocument}
            onAddNote={handleAddNote}
            onDeleteDocument={handleDeleteDocument}
            onDeleteNote={handleDeleteNote}
          />
        </div>

        {/* Preparation Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Preparation Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600 mb-1">
                {preparationData.checklist.filter(item => item.completed).length}
              </div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {assignedMembers.length}
              </div>
              <div className="text-sm text-gray-600">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600 mb-1">
                {assignedTrailer ? '1' : '0'}
              </div>
              <div className="text-sm text-gray-600">Trailers Assigned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
