import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useBreadcrumbContext } from '../../../../contexts/BreadcrumbContext';
import { ProjectDetails, PreparationStageData, MOCK_PROJECT_DETAILS, MOCK_PREPARATION_DATA } from '../../types/projectDetails';
import { AssignTeamModal } from '../../components/AssignTeamModal';
import { AssignTrailerModal } from '../../components/AssignTrailerModal';
import { AddLogisticsModal } from '../../components/AddLogisticsModal';
import { AddTravelModal } from '../../components/AddTravelModal';
import { MOCK_TEAM_MEMBERS, TeamMember } from '../../types/teamMembers';
import { TrailerForAssignment } from '../../types/trailers';
import { LogisticsItem, TravelPlan } from '../../types/logisticsTravel';
import { getAvailableTrailersForAssignment } from '../../utils/trailerDataUtils';
import { ProjectDetailsHeader } from '../../components/ProjectDetailsHeader';
import { KeyInfoSection } from '../../components/KeyInfoSection';
import { ProjectChecklist } from '../../components/ProjectChecklist';
import { ProjectDocuments } from '../../components/ProjectDocuments';
import { ProjectNotes } from '../../components/ProjectNotes';
import { Modal } from '../../../../common/components/Modal';

/**
 * ProjectDetailsPage - Main project details page with stage-based layout
 * Currently implements Preparation stage (PV90, UB, WB)
 */
export const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { setBreadcrumbs } = useBreadcrumbContext();
  
  // State management
  const [project] = useState<ProjectDetails>(MOCK_PROJECT_DETAILS);
  const [preparationData, setPreparationData] = useState<PreparationStageData>(MOCK_PREPARATION_DATA);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignTeamModal, setShowAssignTeamModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [showAssignTrailerModal, setShowAssignTrailerModal] = useState(false);
  const [showEditTrailerModal, setShowEditTrailerModal] = useState(false);
  const [showAddLogisticsModal, setShowAddLogisticsModal] = useState(false);
  const [showEditLogisticsModal, setShowEditLogisticsModal] = useState(false);
  const [editingLogistics, setEditingLogistics] = useState<LogisticsItem | null>(null);
  const [showAddTravelModal, setShowAddTravelModal] = useState(false);
  const [showEditTravelModal, setShowEditTravelModal] = useState(false);
  const [editingTravel, setEditingTravel] = useState<TravelPlan | null>(null);

  // Set breadcrumbs when component mounts
  useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Projects', href: '/projects' },
      { label: project.name, href: `/projects/${projectId}` }
    ]);
  }, [project.name, projectId, setBreadcrumbs]);

  // Handle checklist item toggle
  const handleToggleChecklistItem = (itemId: string) => {
    setPreparationData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item => {
        if (item.id === itemId) {
          const updated = { ...item, completed: !item.completed };
          if (updated.completed) {
            updated.completedAt = new Date().toISOString();
            updated.completedBy = 'Current User';
          } else {
            updated.completedAt = undefined;
            updated.completedBy = undefined;
          }
          return updated;
        }
        return item;
      })
    }));
  };

  // Handle document upload
  const handleUploadDocument = (file: File, category: string) => {
    const newDocument = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: file.type,
      label: category as any,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User',
      projectId: projectId || '',
      category: category as any
    };
    
    setPreparationData(prev => ({
      ...prev,
      documents: [...prev.documents, newDocument]
    }));
  };

  // Handle document deletion
  const handleDeleteDocument = (documentId: string) => {
    setPreparationData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }));
  };

  // Handle document download
  const handleDownloadDocument = (document: any) => {
    // In a real app, this would trigger a download
    console.log('Downloading document:', document.name);
    // For demo purposes, we'll just log it
    alert(`Downloading ${document.name}`);
  };

  // Handle note addition
  const handleAddNote = (content: string, isInternal: boolean) => {
    const newNote = {
      id: `note-${Date.now()}`,
      content,
      author: 'Current User',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: projectId || '',
      isInternal
    };
    
    setPreparationData(prev => ({
      ...prev,
      notes: [...prev.notes, newNote]
    }));
  };

  // Handle note editing
  const handleEditNote = (noteId: string, content: string) => {
    setPreparationData(prev => ({
      ...prev,
      notes: prev.notes.map(note =>
        note.id === noteId
          ? { ...note, content, updatedAt: new Date().toISOString() }
          : note
      )
    }));
  };

  // Handle note deletion
  const handleDeleteNote = (noteId: string) => {
    setPreparationData(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== noteId)
    }));
  };

  // Handle team assignment
  const handleAssignTeam = () => {
    setShowAssignTeamModal(true);
  };

  const handleEditTeam = () => {
    setShowEditTeamModal(true);
  };

  const handleTeamAssignment = (selectedMembers: TeamMember[]) => {
    const assignedTeam = {
      members: selectedMembers.map(member => ({
        ...member,
        assignedAt: new Date().toISOString(),
        assignedBy: 'Current User'
      })),
      count: selectedMembers.length,
      leadMember: selectedMembers.find(member => member.role === 'Lead Supervisor') || undefined
    };

    setPreparationData(prev => ({
      ...prev,
      assignedTeam,
      checklist: prev.checklist.map(item => 
        item.label === 'Team Assigned' 
          ? { ...item, completed: true, completedAt: new Date().toISOString(), completedBy: 'Current User' }
          : item
      )
    }));
  };

  // Handle trailer assignment
  const handleAssignTrailer = () => {
    console.log('Opening trailer assignment modal');
    const trailers = getAvailableTrailersForAssignment();
    console.log('Available trailers:', trailers);
    setShowAssignTrailerModal(true);
  };

  const handleEditTrailer = () => {
    setShowEditTrailerModal(true);
  };

  const handleTrailerAssignment = (selectedTrailer: TrailerForAssignment) => {
    console.log('Trailer assignment handler called with:', selectedTrailer);
    const assignedTrailer = {
      trailer: {
        id: selectedTrailer.id,
        trailerNumber: selectedTrailer.trailerName,
        registrationNumber: selectedTrailer.registrationNumber,
        location: selectedTrailer.currentLocation,
        status: selectedTrailer.status === 'available' ? 'available' : 'unavailable' as any,
        inventory: {
          tools: selectedTrailer.inventory.tools.map(tool => ({
            toolName: tool.toolName,
            currentStock: tool.available,
            threshold: 1,
            status: 'good' as any
          })),
          filmSheets: selectedTrailer.inventory.filmSheets.map(sheet => ({
            sheetType: sheet.sheetType,
            currentStock: sheet.available,
            threshold: sheet.required,
            status: 'good' as any
          }))
        },
        activityLogs: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      inventoryStatus: selectedTrailer.status === 'available' ? 'available' : 'unavailable' as any,
      lastUpdated: new Date().toISOString()
    };

    console.log('Setting assigned trailer:', assignedTrailer);
    setPreparationData(prev => ({
      ...prev,
      assignedTrailer: assignedTrailer as any,
      checklist: prev.checklist.map(item => 
        item.label === 'Trailer Assigned' 
          ? { ...item, completed: true, completedAt: new Date().toISOString(), completedBy: 'Current User' }
          : item
      )
    }));
  };

  // Handle team view
  const handleViewTeam = () => {
    console.log('View team details');
    // In a real app, this would navigate to team details or open a modal
    alert('View Team Details - Coming Soon');
  };

  // Handle trailer view
  const handleViewTrailer = () => {
    console.log('View trailer details');
    // In a real app, this would navigate to trailer details or open a modal
    alert('View Trailer Details - Coming Soon');
  };

  // Handle logistics view
  const handleViewLogistics = () => {
    console.log('View logistics details');
    // In a real app, this would navigate to logistics details or open a modal
    alert('View Logistics Details - Coming Soon');
  };

  // Handle logistics assignment
  const handleAssignLogistics = () => {
    // Mock logistics assignment
    const logistics = {
      partner: 'LogiCorp Solutions',
      eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      notes: 'Equipment delivery scheduled for early morning',
      contactPerson: 'Jane Doe',
      contactPhone: '+1-555-0199'
    };

    setPreparationData(prev => ({
      ...prev,
      logistics,
      checklist: prev.checklist.map(item => 
        item.label === 'Logistics Confirmed' 
          ? { ...item, completed: true, completedAt: new Date().toISOString(), completedBy: 'Current User' }
          : item
      )
    }));
  };

  // Handle travel setup
  const handleSetupTravel = () => {
    // Mock travel setup
    setPreparationData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item => 
        item.label === 'Travel Setup' 
          ? { ...item, completed: true, completedAt: new Date().toISOString(), completedBy: 'Current User' }
          : item
      )
    }));
  };

  // Handle logistics management
  const handleAddLogistics = () => {
    setEditingLogistics(null);
    setShowAddLogisticsModal(true);
  };

  const handleEditLogistics = (logistics: LogisticsItem) => {
    setEditingLogistics(logistics);
    setShowEditLogisticsModal(true);
  };

  const handleSaveLogistics = (logisticsData: Omit<LogisticsItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    const newLogistics: LogisticsItem = {
      ...logisticsData,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User'
    };

    setPreparationData(prev => ({
      ...prev,
      logisticsTravel: {
        ...prev.logisticsTravel,
        logistics: [...prev.logisticsTravel.logistics, newLogistics]
      },
      checklist: prev.checklist.map(item => 
        item.label === 'Logistics Confirmed' 
          ? { ...item, completed: true, completedAt: new Date().toISOString(), completedBy: 'Current User' }
          : item
      )
    }));
  };

  const handleUpdateLogistics = (id: string, logisticsData: Omit<LogisticsItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    setPreparationData(prev => ({
      ...prev,
      logisticsTravel: {
        ...prev.logisticsTravel,
        logistics: prev.logisticsTravel.logistics.map(item =>
          item.id === id
            ? { ...item, ...logisticsData, updatedAt: new Date().toISOString() }
            : item
        )
      }
    }));
  };

  const handleDeleteLogistics = (id: string) => {
    setPreparationData(prev => ({
      ...prev,
      logisticsTravel: {
        ...prev.logisticsTravel,
        logistics: prev.logisticsTravel.logistics.filter(item => item.id !== id)
      }
    }));
  };

  // Handle travel management
  const handleAddTravel = () => {
    setEditingTravel(null);
    setShowAddTravelModal(true);
  };

  const handleEditTravel = (travel: TravelPlan) => {
    setEditingTravel(travel);
    setShowEditTravelModal(true);
  };

  const handleSaveTravel = (travelData: Omit<TravelPlan, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    const newTravel: TravelPlan = {
      ...travelData,
      id: `travel-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User'
    };

    setPreparationData(prev => ({
      ...prev,
      logisticsTravel: {
        ...prev.logisticsTravel,
        travelPlans: [...prev.logisticsTravel.travelPlans, newTravel]
      },
      checklist: prev.checklist.map(item => 
        item.label === 'Travel Setup' 
          ? { ...item, completed: true, completedAt: new Date().toISOString(), completedBy: 'Current User' }
          : item
      )
    }));
  };

  const handleUpdateTravel = (id: string, travelData: Omit<TravelPlan, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>) => {
    setPreparationData(prev => ({
      ...prev,
      logisticsTravel: {
        ...prev.logisticsTravel,
        travelPlans: prev.logisticsTravel.travelPlans.map(item =>
          item.id === id
            ? { ...item, ...travelData, updatedAt: new Date().toISOString() }
            : item
        )
      }
    }));
  };

  const handleDeleteTravel = (id: string) => {
    setPreparationData(prev => ({
      ...prev,
      logisticsTravel: {
        ...prev.logisticsTravel,
        travelPlans: prev.logisticsTravel.travelPlans.filter(item => item.id !== id)
      }
    }));
  };

  // Handle upload shipment receipt
  const handleUploadShipmentReceipt = () => {
    console.log('Upload shipment receipt');
    // In a real app, this would open a file upload dialog
    alert('Upload Shipment Receipt - Coming Soon');
  };

  // Calculate film requirements based on assigned trailer
  const calculateFilmRequirements = () => {
    if (!preparationData.assignedTrailer) {
      return [];
    }

    // Mock project film requirements - in a real app, this would come from project data
    const projectRequirements = [
      { sheetType: 'BR', required: 30 },
      { sheetType: 'Riot+', required: 25 },
      { sheetType: 'Riot', required: 20 },
      { sheetType: 'Riot -', required: 15 },
      { sheetType: 'FER', required: 12 },
      { sheetType: 'Smash', required: 10 },
      { sheetType: 'Tint NI', required: 8 },
      { sheetType: 'Tint Incl', required: 6 },
      { sheetType: 'Anchoring', required: 5 },
      { sheetType: 'Kevlar', required: 3 },
      { sheetType: 'Stripping', required: 2 }
    ];

    return projectRequirements.map(req => {
      const availableFilm = preparationData.assignedTrailer?.trailer.inventory.filmSheets.find(
        film => film.sheetType === req.sheetType
      );
      
      const available = availableFilm?.currentStock || 0;
      const required = req.required;
      
      let status: 'sufficient' | 'low' | 'missing';
      if (available >= required) {
        status = 'sufficient';
      } else if (available > 0) {
        status = 'low';
      } else {
        status = 'missing';
      }

      return {
        sheetType: req.sheetType,
        required,
        available,
        status
      };
    });
  };

  // Handle edit project
  const handleEditProject = () => {
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <ProjectDetailsHeader
        project={project}
        onEdit={handleEditProject}
      />

      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Key Info Section */}
            <KeyInfoSection
              assignedTeam={preparationData.assignedTeam}
              assignedTrailer={preparationData.assignedTrailer}
              logistics={preparationData.logistics}
              logisticsItems={preparationData.logisticsTravel.logistics}
              travelPlans={preparationData.logisticsTravel.travelPlans}
              projectFilmRequirements={calculateFilmRequirements()}
              onViewTeam={handleViewTeam}
              onViewTrailer={handleViewTrailer}
              onViewLogistics={handleViewLogistics}
              onAssignTeam={handleAssignTeam}
              onEditTeam={handleEditTeam}
              onAssignTrailer={handleAssignTrailer}
              onEditTrailer={handleEditTrailer}
              onAssignLogistics={handleAssignLogistics}
              onSetupTravel={handleSetupTravel}
              onAddLogistics={handleAddLogistics}
              onEditLogistics={handleEditLogistics}
              onDeleteLogistics={handleDeleteLogistics}
              onAddTravel={handleAddTravel}
              onEditTravel={handleEditTravel}
              onDeleteTravel={handleDeleteTravel}
              onUploadShipmentReceipt={handleUploadShipmentReceipt}
            />

        {/* Checklist Section */}
        <ProjectChecklist
          checklist={preparationData.checklist}
          onToggleItem={handleToggleChecklistItem}
        />


        {/* Documents Section */}
        <ProjectDocuments
          documents={preparationData.documents}
          onUploadDocument={handleUploadDocument}
          onDeleteDocument={handleDeleteDocument}
          onDownloadDocument={handleDownloadDocument}
        />

        {/* Notes Section */}
        <ProjectNotes
          notes={preparationData.notes}
          onAddNote={handleAddNote}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>

      {/* Edit Project Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Project"
        size="md"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Project editing functionality will be implemented in the next phase.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Assign Team Modal */}
      <AssignTeamModal
        isOpen={showAssignTeamModal}
        onClose={() => setShowAssignTeamModal(false)}
        onAssignTeam={handleTeamAssignment}
        availableMembers={MOCK_TEAM_MEMBERS}
      />

      {/* Edit Team Modal */}
      <AssignTeamModal
        isOpen={showEditTeamModal}
        onClose={() => setShowEditTeamModal(false)}
        onAssignTeam={handleTeamAssignment}
        availableMembers={MOCK_TEAM_MEMBERS}
        assignedMemberIds={preparationData.assignedTeam?.members.map(m => m.id) || []}
      />

      {/* Assign Trailer Modal */}
      <AssignTrailerModal
        isOpen={showAssignTrailerModal}
        onClose={() => setShowAssignTrailerModal(false)}
        onAssignTrailer={handleTrailerAssignment}
        availableTrailers={getAvailableTrailersForAssignment()}
      />

          {/* Edit Trailer Modal */}
          <AssignTrailerModal
            isOpen={showEditTrailerModal}
            onClose={() => setShowEditTrailerModal(false)}
            onAssignTrailer={handleTrailerAssignment}
            availableTrailers={getAvailableTrailersForAssignment()}
            assignedTrailerId={preparationData.assignedTrailer?.trailer.id}
          />

          {/* Add Logistics Modal */}
          <AddLogisticsModal
            isOpen={showAddLogisticsModal}
            onClose={() => setShowAddLogisticsModal(false)}
            onSave={handleSaveLogistics}
          />

          {/* Edit Logistics Modal */}
          <AddLogisticsModal
            isOpen={showEditLogisticsModal}
            onClose={() => setShowEditLogisticsModal(false)}
            onSave={handleSaveLogistics}
            onEdit={handleUpdateLogistics}
            editingLogistics={editingLogistics}
          />

          {/* Add Travel Modal */}
          <AddTravelModal
            isOpen={showAddTravelModal}
            onClose={() => setShowAddTravelModal(false)}
            onSave={handleSaveTravel}
            availableTeamMembers={MOCK_TEAM_MEMBERS.map(member => ({
              id: member.id,
              name: member.name,
              role: member.role
            }))}
          />

          {/* Edit Travel Modal */}
          <AddTravelModal
            isOpen={showEditTravelModal}
            onClose={() => setShowEditTravelModal(false)}
            onSave={handleSaveTravel}
            onEdit={handleUpdateTravel}
            editingTravel={editingTravel}
            availableTeamMembers={MOCK_TEAM_MEMBERS.map(member => ({
              id: member.id,
              name: member.name,
              role: member.role
            }))}
          />
        </div>
      );
    };
