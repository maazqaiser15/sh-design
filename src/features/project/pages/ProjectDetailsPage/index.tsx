import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Users, Truck, Package, Plane, Wrench, Search, CheckCircle2 } from 'lucide-react';
import { useBreadcrumbContext } from '../../../../contexts/BreadcrumbContext';
import { ProjectDetails, PreparationStageData, MOCK_PROJECT_DETAILS, MOCK_PREPARATION_DATA, ProjectStatus } from '../../types/projectDetails';
import { AssignTeamModal } from '../../components/AssignTeamModal';
import { AddLogisticsModal } from '../../components/AddLogisticsModal';
import { AddTravelModal } from '../../components/AddTravelModal';
import { MOCK_TEAM_MEMBERS, TeamMember } from '../../types/teamMembers';
import { LogisticsItem, TravelPlan } from '../../types/logisticsTravel';
import { ProjectHeaderWithWorkflow } from '../../components/ProjectHeaderWithWorkflow';
import { KeyInfoSection } from '../../components/KeyInfoSection';
import { ComingSoonCard } from '../../components/ComingSoonCard';
import { ProjectDocuments } from '../../components/ProjectDocuments';
import { ProjectNotes } from '../../components/ProjectNotes';
import { ProjectDateModal } from '../../components/ProjectDateModal';
import { TrailerInventoryCard } from '../../components/TrailerInventoryCard';
import { AssignTrailerModal } from '../../components/AssignTrailerModal';
import { Modal } from '../../../../common/components/Modal';
import { useToast } from '../../../../contexts/ToastContext';
import { getAvailableTrailersForAssignment } from '../../utils/trailerDataUtils';
import { TrailerForAssignment } from '../../types/trailers';

/**
 * ProjectDetailsPage - Main project details page with stage-based layout
 * Currently implements Preparation stage (PV90, UB, WB)
 */
export const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { setBreadcrumbs } = useBreadcrumbContext();
  const { showToast } = useToast();
  
  // Get stage from URL search params
  const [searchParams] = useSearchParams();
  const urlStage = searchParams.get('stage');
  
  // State management
  const [project, setProject] = useState<ProjectDetails>(MOCK_PROJECT_DETAILS);
  const [preparationData, setPreparationData] = useState<PreparationStageData>(MOCK_PREPARATION_DATA);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignTeamModal, setShowAssignTeamModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [showAddLogisticsModal, setShowAddLogisticsModal] = useState(false);
  const [showEditLogisticsModal, setShowEditLogisticsModal] = useState(false);
  const [editingLogistics, setEditingLogistics] = useState<LogisticsItem | null>(null);
  const [showAddTravelModal, setShowAddTravelModal] = useState(false);
  const [showEditTravelModal, setShowEditTravelModal] = useState(false);
  const [editingTravel, setEditingTravel] = useState<TravelPlan | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [assignedTrailer, setAssignedTrailer] = useState<TrailerForAssignment | null>(null);
  const [showAssignTrailerModal, setShowAssignTrailerModal] = useState(false);
  const [availableTrailers] = useState<TrailerForAssignment[]>(getAvailableTrailersForAssignment());
  const [selectedStage, setSelectedStage] = useState<string>(urlStage || 'preparation');

  // Set breadcrumbs when component mounts
  useEffect(() => {
    setBreadcrumbs([
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Projects', href: '/projects' },
      { label: 'Project Details', href: `/projects/${projectId}` }
    ]);
  }, [project.name, projectId]); // Removed setBreadcrumbs from dependencies

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

  const handleRemoveTeamMember = (memberId: string) => {
    if (preparationData.assignedTeam) {
      const updatedMembers = preparationData.assignedTeam.members.filter(member => member.id !== memberId);
      const updatedTeam = {
        ...preparationData.assignedTeam,
        members: updatedMembers,
        count: updatedMembers.length,
        leadMember: updatedMembers.find(member => member.role === 'Lead Supervisor') || undefined
      };

      setPreparationData(prev => ({
        ...prev,
        assignedTeam: updatedMembers.length > 0 ? updatedTeam : null
      }));
    }
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



  // Handle team view
  const handleViewTeam = () => {
    console.log('View team details');
    // In a real app, this would navigate to team details or open a modal
    alert('View Team Details - Coming Soon');
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


  // Handle edit project
  const handleEditProject = () => {
    setShowEditModal(true);
  };

  // Handle edit dates
  const handleEditDates = () => {
    setShowDateModal(true);
  };

  // Handle date confirmation
  const handleDateConfirm = (startDate: string, endDate: string) => {
    // Update project dates
    console.log('Updating project dates:', { startDate, endDate });
    // In a real app, you would update the project in the database here
    setShowDateModal(false);
  };

  // Handle trailer assignment
  const handleAssignTrailer = (trailer: TrailerForAssignment) => {
    setAssignedTrailer(trailer);
    setPreparationData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item =>
        item.label === 'Trailer Assigned' ? { ...item, completed: true } : item
      )
    }));
    setShowAssignTrailerModal(false);
  };

  // Handle opening trailer assignment modal
  const handleOpenAssignTrailerModal = () => {
    setShowAssignTrailerModal(true);
  };

  // Handle house manager notification
  const handleNotifyHouseManager = (message: string) => {
    console.log('Notifying house manager:', message);
    showToast(message);
    // In a real app, this would send a notification
  };

  // Handle receipt upload
  const handleUploadReceipt = (file: File) => {
    console.log('Uploading shipment receipt:', file.name);
    // In a real app, this would upload the file and update the database
  };

  // Handle receipt removal
  const handleRemoveReceipt = (receiptId: string) => {
    console.log('Removing receipt:', receiptId);
    // In a real app, this would remove the receipt from the database
  };

  // Handle mark inventory as completed
  const handleMarkCompleted = () => {
    console.log('Marking inventory as completed');
    // In a real app, this would update the project status in the database
  };

  // Handle preparation task updates
  const handleUpdatePreparationTask = (taskLabel: string, completed: boolean) => {
    setPreparationData(prev => {
      const updatedChecklist = prev.checklist.map(item => {
        if (item.label === taskLabel) {
          const updated = { ...item, completed };
          if (completed) {
            updated.completedAt = new Date().toISOString();
            updated.completedBy = 'Current User';
          } else {
            updated.completedAt = undefined;
            updated.completedBy = undefined;
          }
          return updated;
        }
        return item;
      });

      // Check if all preparation tasks are completed
      const allTasksCompleted = updatedChecklist.every(item => item.completed);
      
      // If all tasks are completed and project is in PV90 status, update to WB
      if (allTasksCompleted && project.status === 'PV90') {
        // Update project status to WB
        const updatedProject = { ...project, status: 'WB' as const };
        
        // Show success message
        showToast('All preparation tasks completed! Project status updated to WB. Work in Progress stage is now available.');
        
        return {
          ...prev,
          checklist: updatedChecklist,
          project: updatedProject
        };
      }

      return {
        ...prev,
        checklist: updatedChecklist
      };
    });
  };

  // Mock project film requirements
  const projectFilmRequirements = [
    { sheetType: 'BR', required: 30, available: 0, status: 'missing' as const },
    { sheetType: 'Riot+', required: 25, available: 0, status: 'missing' as const },
    { sheetType: 'Riot', required: 20, available: 0, status: 'missing' as const },
    { sheetType: 'Riot -', required: 15, available: 0, status: 'missing' as const },
    { sheetType: 'FER', required: 12, available: 0, status: 'missing' as const },
    { sheetType: 'Smash', required: 10, available: 0, status: 'missing' as const },
    { sheetType: 'Tint NI', required: 8, available: 0, status: 'missing' as const },
    { sheetType: 'Tint Incl', required: 6, available: 0, status: 'missing' as const },
    { sheetType: 'Anchoring', required: 5, available: 0, status: 'missing' as const },
    { sheetType: 'Kevlar', required: 3, available: 0, status: 'missing' as const },
    { sheetType: 'Stripping', required: 2, available: 0, status: 'missing' as const }
  ];

  // Check if project is in preparation stage
  const isPreparationStage = project.stage === 'preparation' || 
    project.status === 'PV90' || 
    project.status === 'UB' || 
    project.status === 'WB';

  // Handle stage navigation
  const handleStageClick = (stageId: string) => {
    setSelectedStage(stageId);
    
    switch (stageId) {
      case 'preparation':
        showToast('Switched to Preparation stage');
        break;
      case 'wip':
        // Update project status to WIP when switching to Work in Progress
        const updatedProject = { ...project, status: 'WIP' as const };
        setPreparationData(prev => ({
          ...prev,
          project: updatedProject
        }));
        showToast('Switched to Work in Progress stage - Project status updated to WIP');
        break;
      case 'quality':
        showToast('Switched to Quality Check stage');
        break;
      case 'completed':
        showToast('Switched to Completed stage');
        break;
      default:
        break;
    }
  };

  // Initialize stage based on URL parameter and project status
  useEffect(() => {
    if (urlStage) {
      setSelectedStage(urlStage);
      
      // Update project status based on stage
      let newStatus: ProjectStatus;
      switch (urlStage) {
        case 'preparation':
          newStatus = 'PV90'; // Default to PV90 for preparation stage
          break;
        case 'wip':
          newStatus = 'WIP';
          break;
        case 'quality':
          newStatus = 'QF';
          break;
        case 'completed':
          newStatus = 'Completed';
          break;
        default:
          newStatus = 'PV90';
      }
      
      // Update project status
      setProject(prev => ({
        ...prev,
        status: newStatus
      }));
      
      // Handle special cases based on stage
      if (urlStage === 'wip') {
        // Mark preparation stage as completed when opening WIP stage
        setPreparationData(prev => ({
          ...prev,
          checklist: prev.checklist.map(item => ({
            ...item,
            completed: true
          }))
        }));
        showToast('Work in Progress stage - Preparation tasks marked as completed');
      } else if (urlStage === 'quality') {
        showToast('Quality Check stage opened');
      } else if (urlStage === 'completed') {
        showToast('Completed stage opened');
      }
    } else {
      // If no stage in URL, determine stage based on current project status
      let stage = 'preparation';
      switch (project.status) {
        case 'PV90':
        case 'UB':
        case 'WB':
          stage = 'preparation';
          break;
        case 'WIP':
          stage = 'wip';
          break;
        case 'QF':
          stage = 'quality';
          break;
        case 'Completed':
          stage = 'completed';
          break;
        default:
          stage = 'preparation';
      }
      setSelectedStage(stage);
    }
  }, [urlStage, project.status]);

  // Handle marking project for Quality Check
  const handleMarkForQF = () => {
    showToast('Project marked for Quality Check');
    // In a real app, this would update the project status and notify relevant parties
    console.log('Project marked for Quality Check');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-6">
        {/* Project Overview Card */}
        <ProjectHeaderWithWorkflow
          project={project}
          checklist={preparationData.checklist}
          onEdit={handleEditProject}
          onEditDates={handleEditDates}
          onToggleItem={handleToggleChecklistItem}
          onStageClick={handleStageClick}
          onMarkForQF={handleMarkForQF}
          selectedStage={selectedStage}
          isPreparationStage={isPreparationStage}
        />

        {/* Key Info Section - Conditional rendering based on selected stage */}
        {selectedStage === 'preparation' ? (
          <KeyInfoSection
            assignedTeam={preparationData.assignedTeam}
            travelPlans={preparationData.logisticsTravel.travelPlans}
            assignedTrailer={assignedTrailer}
            projectFilmRequirements={projectFilmRequirements}
            onViewTeam={handleViewTeam}
            onAssignTeam={handleAssignTeam}
            onEditTeam={handleEditTeam}
            onRemoveTeamMember={handleRemoveTeamMember}
            onSetupTravel={handleSetupTravel}
            onAddTravel={handleAddTravel}
            onEditTravel={handleEditTravel}
            onDeleteTravel={handleDeleteTravel}
            onAssignTrailer={handleOpenAssignTrailerModal}
            onNotifyHouseManager={handleNotifyHouseManager}
            onUploadReceipt={handleUploadReceipt}
            onRemoveReceipt={handleRemoveReceipt}
            onMarkCompleted={handleMarkCompleted}
            onUpdatePreparationTask={handleUpdatePreparationTask}
            selectedStage={selectedStage}
          />
        ) : selectedStage === 'wip' ? (
          <KeyInfoSection
            assignedTeam={preparationData.assignedTeam}
            travelPlans={preparationData.logisticsTravel.travelPlans}
            assignedTrailer={assignedTrailer}
            projectFilmRequirements={projectFilmRequirements}
            onViewTeam={handleViewTeam}
            onAssignTeam={handleAssignTeam}
            onEditTeam={handleEditTeam}
            onRemoveTeamMember={handleRemoveTeamMember}
            onSetupTravel={handleSetupTravel}
            onAddTravel={handleAddTravel}
            onEditTravel={handleEditTravel}
            onDeleteTravel={handleDeleteTravel}
            onAssignTrailer={handleOpenAssignTrailerModal}
            onNotifyHouseManager={handleNotifyHouseManager}
            onUploadReceipt={handleUploadReceipt}
            onRemoveReceipt={handleRemoveReceipt}
            onMarkCompleted={handleMarkCompleted}
            onUpdatePreparationTask={handleUpdatePreparationTask}
            selectedStage={selectedStage}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
            <ComingSoonCard
              title="Team Management"
              description="Manage team assignments, track progress, and coordinate team activities during project execution."
              icon={<Users className="w-8 h-8 text-blue-600" />}
              stageName="Work in Progress"
            />
            <ComingSoonCard
              title="Equipment & Resources"
              description="Track equipment usage, manage resources, and monitor inventory during project execution."
              icon={<Truck className="w-8 h-8 text-amber-600" />}
              stageName="Work in Progress"
            />
            <ComingSoonCard
              title="Project Logistics"
              description="Monitor project logistics, track deliveries, and manage supply chain during execution."
              icon={<Package className="w-8 h-8 text-purple-600" />}
              stageName="Work in Progress"
            />
            <ComingSoonCard
              title="Progress Tracking"
              description="Track project milestones, monitor progress, and manage timelines during execution."
              icon={<Wrench className="w-8 h-8 text-green-600" />}
              stageName="Work in Progress"
            />
          </div>
        )}



        {/* Documents and Notes Section - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProjectDocuments
            documents={preparationData.documents}
            onUploadDocument={handleUploadDocument}
            onDeleteDocument={handleDeleteDocument}
            onDownloadDocument={handleDownloadDocument}
          />
          
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
          projectDetails={project}
        />

        {/* Edit Team Modal */}
        <AssignTeamModal
          isOpen={showEditTeamModal}
          onClose={() => setShowEditTeamModal(false)}
          onAssignTeam={handleTeamAssignment}
          availableMembers={MOCK_TEAM_MEMBERS}
          assignedMemberIds={preparationData.assignedTeam?.members.map(m => m.id) || []}
          projectDetails={project}
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

        {/* Project Date Modal */}
        <ProjectDateModal
          isOpen={showDateModal}
          onClose={() => setShowDateModal(false)}
          onConfirm={handleDateConfirm}
          projectTitle={project.name}
          projectStatus={project.status as any}
          initialStartDate={project.startDate}
          initialEndDate={project.endDate}
        />

        {/* Assign Trailer Modal */}
        <AssignTrailerModal
          isOpen={showAssignTrailerModal}
          onClose={() => setShowAssignTrailerModal(false)}
          onAssignTrailer={handleAssignTrailer}
          availableTrailers={availableTrailers}
          assignedTrailerId={assignedTrailer?.id}
        />

      </div>
    </div>
  );
};
