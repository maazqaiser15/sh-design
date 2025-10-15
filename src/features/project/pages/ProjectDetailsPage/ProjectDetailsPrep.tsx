import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Hotel, User, Edit, Building, Phone, Mail, MapPin, Calendar, CheckCheck } from 'lucide-react';
import { ProjectDetails, PreparationStageData, MOCK_PROJECT_DETAILS, MOCK_PREPARATION_DATA, ProjectNote } from '../../types/projectDetails';
import { NoteAttachment } from '../../../../types';
import { AssignTeamModal } from '../../components/AssignTeamModal';
import { AddLogisticsModal } from '../../components/AddLogisticsModal';
import { AddTravelModal } from '../../components/AddTravelModal';
import { MOCK_TEAM_MEMBERS, TeamMember } from '../../types/teamMembers';
import { LogisticsItem, TravelPlan } from '../../types/logisticsTravel';
import { ProjectDateModal } from '../../components/ProjectDateModal';
import { AssignTrailerModal } from '../../components/AssignTrailerModal';
import { TrailerLogisticsCard } from '../../components/TrailerLogisticsCard';
import { AssignedTeamCard } from '../../components/AssignedTeamCard';
import { TravelAccommodationModal, TravelAccommodationData } from '../../components/TravelAccommodationModal';
import { TravelAccommodationRequestModal, TravelAccommodationRequestData } from '../../components/TravelAccommodationRequestModal';
import { TravelAccommodationDetailsCard } from '../../components/TravelAccommodationDetailsCard';
import { ProjectNotes } from '../../components/ProjectNotes';
import { EditProjectDetailsModal } from '../../components/EditProjectDetailsModal';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { useToast } from '../../../../contexts/ToastContext';
import { getAvailableTrailersForAssignment } from '../../utils/trailerDataUtils';
import { TrailerForAssignment } from '../../types/trailers';
import { Window, MOCK_WINDOWS } from '../../types/windows';
import { ProjectDetailsWIP } from './ProjectDetailsWIP';
import { Card } from 'common/components/Card';
import { SetupInventoryModal } from '../../components/SetupInventoryModal';

// Icons from Figma design


const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333Z" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 8L7.33333 9.33333L10.6667 6" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DotIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="4" cy="4" r="4" fill="#667085" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3333 6.66667C13.3333 8.50761 11.841 10 10 10C8.15905 10 6.66667 8.50761 6.66667 6.66667C6.66667 4.82572 8.15905 3.33333 10 3.33333C11.841 3.33333 13.3333 4.82572 13.3333 6.66667Z" stroke="#0D76BF" strokeWidth="1.5" />
    <path d="M10 12.5C7.23858 12.5 5 14.7386 5 17.5H15C15 14.7386 12.7614 12.5 10 12.5Z" stroke="#0D76BF" strokeWidth="1.5" />
    <path d="M15.8333 6.66667C15.8333 7.58714 15.4542 8.47052 14.7791 9.14559C14.104 9.82066 13.2206 10.2 12.3 10.2" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17.5 12.5C17.5 13.4205 17.1209 14.3039 16.4458 14.9789C15.7707 15.654 14.8873 16.0333 13.9667 16.0333" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ExpandIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
  >
    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 1V11M1 6H11" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.66667 12.5H13.3333V4.16667H1.66667V12.5Z" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.3333 8.33333H15.8333L18.3333 10.8333V12.5H13.3333" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="5" cy="15" r="1.66667" stroke="#0D76BF" strokeWidth="1.5" />
    <circle cx="15" cy="15" r="1.66667" stroke="#0D76BF" strokeWidth="1.5" />
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3333 1.66667H5C4.55797 1.66667 4.13405 1.84226 3.82149 2.15482C3.50893 2.46738 3.33333 2.89131 3.33333 3.33333V16.6667C3.33333 17.1087 3.50893 17.5326 3.82149 17.8452C4.13405 18.1577 4.55797 18.3333 5 18.3333H15C15.442 18.3333 15.866 18.1577 16.1785 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V6.66667L13.3333 1.66667Z" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.3333 1.66667V6.66667H16.6667" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StickerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 2.5H5C4.17157 2.5 3.5 3.17157 3.5 4V16C3.5 16.8284 4.17157 17.5 5 17.5H15C15.8284 17.5 16.5 16.8284 16.5 16V4C16.5 3.17157 15.8284 2.5 15 2.5Z" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.33333 7.5H11.6667" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.33333 10.8333H11.6667" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1.33333V10.6667M8 1.33333L5.33333 4M8 1.33333L10.6667 4M2.66667 10.6667H13.3333" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3L3 9M3 3L9 9" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PaperclipIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.6667 4.66667L5.33333 10C4.59695 10.7364 4.59695 11.9302 5.33333 12.6667C6.06971 13.403 7.26362 13.403 8 12.6667L13.3333 7.33333C14.8061 5.86056 14.8061 3.47278 13.3333 2C11.8606 0.527241 9.47278 0.527241 8 2L2.66667 7.33333" stroke="#344054" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Progress Step Component
interface ProgressStepProps {
  title: string;
  status: 'completed' | 'current' | 'incomplete';
  description: string;
}

const ProgressStep: React.FC<ProgressStepProps> = ({ title, status, description }) => {
  const getStepIcon = () => {
    if (status === 'completed') {
    return (
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333Z" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 8L7.33333 9.33333L10.6667 6" stroke="#e5e7eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
    }
    return (
      <div className="bg-white border-2 border-gray-300 rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      </div>
    );
  };

  const getStatusColor = () => {
    if (status === 'completed') {
      return 'text-green-600';
    }
    return 'text-gray-500';
  };

  return (
    <div className="flex gap-3 items-start flex-1">
      <div className="flex flex-col items-center pt-0.5">
        {getStepIcon()}
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <p className="font-semibold text-xs text-gray-800 leading-4">{title}</p>
        <p className={`font-medium text-xs leading-3 ${getStatusColor()}`}>{description}</p>
      </div>
    </div>
  );
};

// Empty State Component
interface EmptyStateProps {
  icon: React.ReactNode;
  message: string;
  actionButton?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, message, actionButton }) => (
  <div className="flex flex-col items-center gap-1.5">
    {icon}
    <p className="font-normal text-xs text-[#475467] text-center leading-4">{message}</p>
    {actionButton}
  </div>
);

// Section Header Component
interface SectionHeaderProps {
  title: string;
  subtitle: string;
  actionButton?: React.ReactNode;
  secondaryButton?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, actionButton, secondaryButton }) => (
  <div className="flex gap-4 items-start w-full">
    <div className="flex flex-col gap-1 flex-1">
      <h3 className="font-semibold text-lg text-[#101828] leading-7">{title}</h3>
      <p className="font-normal text-sm text-[#475467] leading-5">{subtitle}</p>
    </div>
    <div className="flex gap-2 items-center">
      {actionButton}
      {secondaryButton}
    </div>
  </div>
);

/**
 * ProjectDetailsPage - Main project details page
 * Shows project information, team assignments, logistics, and documents
 */
export const ProjectDetailsPrep: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { showToast } = useToast();
  const navigate = useNavigate();

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
  const [isTrailerCompleted, setIsTrailerCompleted] = useState(false);
  const [isTravelAccommodationCompleted, setIsTravelAccommodationCompleted] = useState(false);
  const [isAssignedTeamCompleted, setIsAssignedTeamCompleted] = useState(false);
  const [showTravelAccommodationRequestModal, setShowTravelAccommodationRequestModal] = useState(false);
  const [showSetupInventoryModal, setShowSetupInventoryModal] = useState(false);
  const [showTravelAccommodationDetailsModal, setShowTravelAccommodationDetailsModal] = useState(false);
  const [travelAccommodationRequestSubmitted, setTravelAccommodationRequestSubmitted] = useState(false);
  const [travelAccommodationNotRequired, setTravelAccommodationNotRequired] = useState(false);
  const [travelAccommodationDetailsAdded, setTravelAccommodationDetailsAdded] = useState(false);
  const [travelAccommodationRequestData, setTravelAccommodationRequestData] = useState<TravelAccommodationRequestData | null>(null);
  const [travelAccommodationDetailsData, setTravelAccommodationDetailsData] = useState<TravelAccommodationData | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [availableTrailers] = useState<TrailerForAssignment[]>(getAvailableTrailersForAssignment());
  const [windows, setWindows] = useState<Window[]>(MOCK_WINDOWS);
  const [showContractRequiredModal, setShowContractRequiredModal] = useState(false);

  // Notes State
  const [notes, setNotes] = useState<ProjectNote[]>([]);

  // Check if all stages are completed
  const allStagesCompleted = isAssignedTeamCompleted && isTravelAccommodationCompleted && isTrailerCompleted;

  // Trailer & Films State
  const [inventoryItems, setInventoryItems] = useState([
    { id: 'sw600br', name: 'SW600BR', required: 1, inTrailer: 0, needToShip: 1 },
    { id: 'sw600rc-plus', name: 'SW600RC+', required: 2, inTrailer: 0, needToShip: 2 },
    { id: 'sw600rc', name: 'SW600RC', required: 3, inTrailer: 0, needToShip: 3 },
    { id: 'sw440rc', name: 'SW440RC', required: 1, inTrailer: 0, needToShip: 1 },
    { id: 'sw600fe', name: 'SW600FE', required: 2, inTrailer: 0, needToShip: 2 },
    { id: 'sw450sr', name: 'SW450SR', required: 1, inTrailer: 0, needToShip: 1 },
    { id: 'tint-only', name: 'Tint Only', required: 2, inTrailer: 0, needToShip: 2 },
    { id: 'kevlar', name: 'Kevlar', required: 1, inTrailer: 0, needToShip: 1 }
  ]);
  const [showAllFilmTypes, setShowAllFilmTypes] = useState(false);
  const [uploadedReceipts, setUploadedReceipts] = useState<File[]>([]);
  const [showReceiptUploadModal, setShowReceiptUploadModal] = useState(false);



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
  const handleAddNote = (content: string, isInternal: boolean, attachments?: NoteAttachment[]) => {
    const newNote = {
      id: `note-${Date.now()}`,
      content,
      author: 'Current User',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: projectId || '',
      isInternal,
      attachments: attachments || []
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

  // Handle attachment addition to existing note
  const handleAddAttachment = (noteId: string, file: File) => {
    const newAttachment: NoteAttachment = {
      id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User'
    };

    setPreparationData(prev => ({
      ...prev,
      notes: prev.notes.map(note =>
        note.id === noteId
          ? { ...note, attachments: [...(note.attachments || []), newAttachment] }
          : note
      )
    }));
  };

  // Handle attachment removal from existing note
  const handleRemoveAttachment = (noteId: string, attachmentId: string) => {
    setPreparationData(prev => ({
      ...prev,
      notes: prev.notes.map(note =>
        note.id === noteId
          ? { ...note, attachments: (note.attachments || []).filter(att => att.id !== attachmentId) }
          : note
      )
    }));
  };

  // Handle attachment download
  const handleDownloadAttachment = (attachment: NoteAttachment) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle team assignment
  const handleAssignTeam = () => {
    setShowAssignTeamModal(true);
  };

  const handleRemoveTeamMember = (memberId: string) => {
    setPreparationData(prev => {
      if (!prev.assignedTeam) return prev;

      const updatedMembers = prev.assignedTeam.members.filter(member => member.id !== memberId);
      const updatedLeadMember = prev.assignedTeam.leadMember?.id === memberId ? undefined : prev.assignedTeam.leadMember;

      return {
        ...prev,
        assignedTeam: updatedMembers.length > 0 ? {
          members: updatedMembers,
          count: updatedMembers.length,
          leadMember: updatedLeadMember
        } : null
      };
    });
  };

  const handleResendInvite = (memberId: string) => {
    setPreparationData(prev => {
      if (!prev.assignedTeam) return prev;

      const updatedMembers = prev.assignedTeam.members.map(member => {
        if (member.id === memberId) {
          return {
            ...member,
            inviteStatus: 'pending' as const,
            invitedAt: new Date().toISOString()
          };
        }
        return member;
      });

      return {
        ...prev,
        assignedTeam: {
          ...prev.assignedTeam,
          members: updatedMembers
        }
      };
    });

    // Show success message
    console.log(`Invite resent to team member ${memberId}`);
  };

  const handleSaveProjectDetails = (updatedProject: ProjectDetails) => {
    setProject(updatedProject);
    showToast('Project details updated successfully!');
  };

  // Handle travel accommodation request modal
  const handleOpenTravelAccommodationRequestModal = () => {
    setShowTravelAccommodationRequestModal(true);
  };

  const handleTravelAccommodationRequestSubmit = (data: TravelAccommodationRequestData) => {
    console.log('Travel & Accommodation Request:', data);
    setTravelAccommodationRequestData(data);
    setTravelAccommodationRequestSubmitted(true);
    showToast('Request submitted to logistics manager successfully!');
    // Here you would typically save the data to your backend
  };

  // Handle travel accommodation details modal
  const handleOpenTravelAccommodationDetailsModal = () => {
    setShowTravelAccommodationDetailsModal(true);
  };

  const handleTravelAccommodationDetailsSubmit = (data: TravelAccommodationData) => {
    console.log('Travel & Accommodation Details:', data);
    setTravelAccommodationDetailsData(data);
    setTravelAccommodationDetailsAdded(true);
    setIsTravelAccommodationCompleted(true);
    showToast('Travel details added successfully!');
    // Here you would typically save the data to your backend
  };

  // Handle marking travel as not required
  const handleMarkTravelNotRequired = () => {
    setTravelAccommodationNotRequired(true);
    setIsTravelAccommodationCompleted(true);
    showToast('Travel marked as not required for this project');
  };

  // Handle marking trailer as complete
  const handleMarkTrailerComplete = () => {
    setIsTrailerCompleted(true);
    showToast('Trailer & Films marked as complete');
  };

  // Handle assigned team completion
  const handleAssignedTeamComplete = () => {
    setIsAssignedTeamCompleted(true);
    showToast('Assigned team marked as complete');
  };

  // Handle travel accommodation details completion
  const handleTravelAccommodationComplete = () => {
    setIsTravelAccommodationCompleted(true);
    showToast('Travel & Accommodation marked as complete');
  };

  // Handle travel accommodation details expansion
  const handleTravelAccommodationExpand = () => {
    // Could open a detailed view modal or navigate to a dedicated page
    console.log('Expand travel accommodation details');
  };


  // Handle trailer assignment
  const handleOpenAssignTrailerModal = () => {
    setShowAssignTrailerModal(true);
  };


  // Handle receipt upload
  const handleOpenReceiptUploadModal = () => {
    setShowReceiptUploadModal(true);
  };

  // Handle file attachment
  const handleFileAttachment = (files: File[]) => {
    setUploadedReceipts(files);
  };

  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedReceipts(prev => [...prev, ...newFiles]);
      showToast(`${newFiles.length} receipt(s) uploaded successfully!`);
    }
    event.target.value = '';
  };

  const handleRemoveReceipt = (index: number) => {
    setUploadedReceipts(prev => prev.filter((_, i) => i !== index));
    showToast('Receipt removed successfully!');
  };

  // Handle inventory updates
  const handleUpdateInventoryItem = (itemId: string, field: 'required' | 'inTrailer', value: number) => {
    setInventoryItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };
        updated.needToShip = Math.max(0, updated.required - updated.inTrailer);
        return updated;
      }
      return item;
    }));
  };

  // Calculate totals
  const totalRequired = inventoryItems.reduce((sum, item) => sum + item.required, 0);
  const totalInTrailer = inventoryItems.reduce((sum, item) => sum + item.inTrailer, 0);
  const totalNeedToShip = inventoryItems.reduce((sum, item) => sum + item.needToShip, 0);

  // Get visible film types
  const visibleFilmTypes = showAllFilmTypes ? inventoryItems : inventoryItems.slice(0, 4);
  const hiddenFilmTypesCount = inventoryItems.length - 4;

  const handleEditTeam = () => {
    setShowEditTeamModal(true);
  };

  // Handle document upload
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedDocuments(prev => [...prev, ...newFiles]);
      showToast(`${newFiles.length} document(s) uploaded successfully!`);
    }
    // Reset the input value so the same file can be uploaded again if needed
    event.target.value = '';
  };

  // Handle drag and drop
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
      const newFiles = Array.from(files);
      setUploadedDocuments(prev => [...prev, ...newFiles]);
      showToast(`${newFiles.length} document(s) uploaded successfully!`);
    }
  };

  // Handle document removal
  const handleRemoveDocument = (index: number) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
    showToast('Document removed successfully!');
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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


  // Handle mark inventory as completed
  const handleMarkCompleted = () => {
    console.log('Marking inventory as completed');
    // In a real app, this would update the project status in the database
  };



  const handleWindowUpdate = (updatedWindow: Window) => {
    setWindows(prev => prev.map(w => w.id === updatedWindow.id ? updatedWindow : w));
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





  const handleMarkStageComplete = () => {
    setShowContractRequiredModal(true);
  };

  // If project status is WIP, render the WIP status page
  if (project.status === 'WIP') {
    return <ProjectDetailsWIP projectStatus="WIP" />;
  }

  return (
    <div className=" min-h-screen">

      {/* Main Content */}
      <div className="py-6">
        {/* Project Header Card */}
        <Card className="mb-6 ">
          <div className="flex flex-col gap-2">
            {/* Project Title and Actions */}
            <div className="">
              {/* Project Name, Status, and Action Buttons */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3 items-center">
                  <h1 className="font-bold text-2xl text-gray-900 leading-tight">Marriot Windows Installation</h1>
                  <div className="font-bold text-sm text-blue-700 leading-5 px-2 py-1.5 rounded-full  bg-blue-100">
                    <p>PV90</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 items-center">
                  <Button
                    variant='primary'
                    onClick={handleMarkStageComplete}
                    disabled={!allStagesCompleted}
                    className={`px-3 py-1.5 rounded-md font-semibold text-sm leading-5 shadow-sm transition-all duration-200 ${allStagesCompleted
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-blue-200'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-300'
                      }`}
                  >
                    Mark Stage as Complete
                  </Button>
                  <Button
                    onClick={() => setShowEditModal(true)}
                    variant="ghost"
                    size="sm"
                    icon={Edit}
                    className="px-3 py-1.5 rounded-md font-semibold text-sm leading-5 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  >
                    Edit
                  </Button>

                </div>
              </div>

              {/* Single Row with All Project Information */}
              <div className="flex flex-wrap  items-start justify-between mb-0">
                {/* VIN Code */}
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">VIN Code</p>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      TXDA-SJ1BR1-EETUSC01-P20001
                    </span>
                  </div>
                </div>

                {/* Site */}
                {project.site && (
                  <div className="flex items-start gap-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Site</p>
                      <p className="text-sm text-gray-900 font-medium">{project.site}</p>
                    </div>
                  </div>
                )}

                {/* Duration */}
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Duration</p>
                    <p className="text-sm text-gray-900 font-medium">Feb 1, 2024 – Feb 15, 2024</p>
                  </div>
                </div>

                {/* Industry */}
                {project.industry && (
                  <div className="flex items-start gap-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Industry</p>
                      <p className="text-sm text-gray-900 font-medium">{project.industry}</p>
                    </div>
                  </div>
                )}

                {/* Coordinator */}
                {project.assignedCoordinator && (
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Coordinator</p>
                      <p className="text-sm text-gray-900 font-medium">{project.assignedCoordinator.name}</p>
                    </div>
                  </div>
                )}
                {/* Contact Person */}
                {project.contactPerson && (
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Contact Person</p>
                      <p className="text-sm text-gray-900 font-medium">{project.contactPerson.name}</p>
                      {project.contactPerson.phone && <p className="text-xs text-gray-700">{project.contactPerson.phone}</p>}
                      {project.contactPerson.email && <p className="text-xs text-gray-700">{project.contactPerson.email}</p>}
                    </div>
                  </div>
                )}

         


              </div>
            </div>


            {/* Progress Steps */}
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Project Progress</h3>
              <div className="flex items-center w-full">
                <ProgressStep
                  title="Team Assignment"
                  status={isAssignedTeamCompleted ? "completed" : "incomplete"}
                  description={isAssignedTeamCompleted ? "Completed" : "In Progress"}
                />
                <ProgressStep
                  title="Travel & Accommodation"
                  status={isTravelAccommodationCompleted ? "completed" : "incomplete"}
                  description={isTravelAccommodationCompleted ? "Completed" : "In Progress"}
                />
                <ProgressStep
                  title="Trailer & Films"
                  status={isTrailerCompleted ? "completed" : "incomplete"}
                  description={isTrailerCompleted ? "Completed" : "In Progress"}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="flex gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6 flex-1">
            {/* Assigned Team Card */}
            <AssignedTeamCard
              assignedTeam={preparationData.assignedTeam}
              onAddMember={handleAssignTeam}
              onRemoveMember={handleRemoveTeamMember}
              onResendInvite={handleResendInvite}
              onMarkComplete={handleAssignedTeamComplete}
              isCompleted={isAssignedTeamCompleted}
              showActions={true}
            />

            {/* Travel & Accommodation Card */}
            {travelAccommodationDetailsAdded ? (
              /* Details Added State - Show comprehensive travel details using TravelAccommodationDetailsCard */
              <TravelAccommodationDetailsCard
                travelAccommodationData={travelAccommodationDetailsData}
                onAddDetails={handleOpenTravelAccommodationDetailsModal}
                onMarkComplete={handleTravelAccommodationComplete}
                onExpand={handleTravelAccommodationExpand}
                onEditDetails={handleOpenTravelAccommodationDetailsModal}
                isCompleted={isTravelAccommodationCompleted}
              />
            ) : (
              /* All Other States - Use original card structure */
              <Card>
                <div className="flex flex-col gap-5">
                  <div className="flex gap-4 items-start w-full">
                    <div className="flex flex-col gap-1 flex-1">
                      <h3 className="font-semibold text-lg text-[#101828] leading-7">Travel & Accommodation</h3>
                      <p className="font-normal text-sm text-[#475467] leading-5">
                        {travelAccommodationNotRequired
                          ? 'Travel not required for this project'
                          : travelAccommodationRequestSubmitted
                            ? 'Request submitted to logistics manager'
                            : 'Assign travel & accommodation'
                        }
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      {travelAccommodationNotRequired ? (
                        /* Not Required State - Allow changing mind */
                        <Button
                          onClick={() => {
                            setTravelAccommodationNotRequired(false);
                            showToast('You can now add travel requirements');
                          }}
                          className="bg-[#0d76bf] text-white px-3 py-1.5 rounded-md font-semibold text-sm leading-5 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          Add Travel
                        </Button>
                      ) : travelAccommodationRequestSubmitted ? (
                        /* Request Submitted State - Add Details Button */
                        <Button
                          onClick={handleOpenTravelAccommodationDetailsModal}
                          className="bg-[#0d76bf] text-white px-3 py-1.5 rounded-md font-semibold text-sm leading-5 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex items-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          Add Details
                        </Button>
                      ) : (
                        /* Initial State - Not Required and Add Buttons */
                        <>
                          {/* Not Required Button */}
                          <button
                            onClick={handleMarkTravelNotRequired}
                            className="bg-white border border-[#d0d5dd] text-[#475467] px-3 py-1.5 rounded-lg font-semibold text-xs leading-5 flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
                          >
                            <CheckCircleIcon />
                            Not Required
                          </button>

                          {/* Add Request Button */}
                          <button
                            onClick={handleOpenTravelAccommodationRequestModal}
                            className="bg-white border border-[#d0d5dd] border-dashed text-[#475467] w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <PlusIcon />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {travelAccommodationNotRequired ? (
                    /* Not Required State */
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon />
                        <span className="text-sm font-medium text-gray-800">
                          Travel not required for this project
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        You can add travel requirements later if needed
                      </p>
                    </div>
                  ) : travelAccommodationRequestSubmitted ? (
                    /* Request Submitted State */
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircleIcon />
                        <span className="text-sm font-medium text-green-800">
                          Request submitted successfully
                        </span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        Logistics manager will review and provide details
                      </p>
                      {travelAccommodationRequestData && (
                        <div className="mt-3 text-xs text-green-700">
                          <p><strong>Travel Required:</strong> {travelAccommodationRequestData.travelRequired ? 'Yes' : 'No'}</p>
                          <p><strong>Accommodation Required:</strong> {travelAccommodationRequestData.accommodationRequired ? 'Yes' : 'No'}</p>
                          <p><strong>Rental Vehicle Required:</strong> {travelAccommodationRequestData.rentalVehicleRequired ? 'Yes' : 'No'}</p>
                          {travelAccommodationRequestData.travelMethod && (
                            <p><strong>Travel Method:</strong> {travelAccommodationRequestData.travelMethod === 'air' ? 'Air' : 'Road'}</p>
                          )}

                          {/* Travel Team Members */}
                          {travelAccommodationRequestData.travelRequired && (
                            <div className="mt-2">
                              <p><strong>Travel Team Members:</strong> {travelAccommodationRequestData.selectedTeamMembers.length} selected</p>
                              {travelAccommodationRequestData.selectedTeamMembers.length > 0 && (
                                <div className="mt-1">
                                  <div className="space-y-1">
                                    {travelAccommodationRequestData.selectedTeamMembers.map((member) => (
                                      <div key={member.id} className="flex items-center gap-2 text-sm">
                                        <div className="w-7 h-7 bg-blue-100 p rounded-full flex items-center justify-center">
                                          <span className="text-xs font-medium text-blue-700">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                          </span>
                                        </div>
                                        <span className="text-gray-700">{member.name}</span>
                                        <span className="text-gray-500">({member.role})</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Accommodation Team Members */}
                          {travelAccommodationRequestData.accommodationRequired && (
                            <div className="mt-2">
                              <p><strong>Accommodation Team Members:</strong> {travelAccommodationRequestData.selectedAccommodationMembers.length} selected</p>
                              {travelAccommodationRequestData.selectedAccommodationMembers.length > 0 && (
                                <div className="mt-1">
                                  <div className="space-y-1">
                                    {travelAccommodationRequestData.selectedAccommodationMembers.map((member) => (
                                      <div key={member.id} className="flex items-center gap-2 text-sm">
                                        <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                                          <span className="text-xs font-medium text-green-700">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                          </span>
                                        </div>
                                        <span className="text-gray-700">{member.name}</span>
                                        <span className="text-gray-500">({member.role})</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Rental Vehicle Details */}
                          {travelAccommodationRequestData.rentalVehicleRequired && travelAccommodationRequestData.rentalVehicleDetails && (
                            <div className="mt-2">
                              <p><strong>Rental Vehicle Details:</strong></p>
                              <div className="mt-1">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-700">
                                      <strong>Duration:</strong> {new Date(travelAccommodationRequestData.rentalVehicleDetails.fromDate).toLocaleDateString()} to {new Date(travelAccommodationRequestData.rentalVehicleDetails.toDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-700">
                                      <strong>Number of Cars:</strong> {travelAccommodationRequestData.rentalVehicleDetails.numberOfCars}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Initial Empty State */
                    <EmptyState
                      icon={<TruckIcon />}
                      message="No travel & accommodation assigned yet"
                    />
                  )}
                </div>
              </Card>
            )}

            {/* Project Documents Card */}
            <Card
              className={`${isDragOver
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col gap-5">
                <div className="flex gap-4 items-start w-full">
                  <div className="flex flex-col gap-1 flex-1">
                    <h3 className="font-semibold text-lg text-[#101828] leading-7">Project Documents</h3>
                    <p className="font-normal text-sm text-[#475467] leading-5">
                      {uploadedDocuments.length} document{uploadedDocuments.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {/* Hidden file input */}
                    <input
                      type="file"
                      id="document-upload"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                      onChange={handleDocumentUpload}
                      className="hidden"
                    />
                    {/* Upload Document Button */}
                    <label
                      htmlFor="document-upload"
                      className="bg-white border border-[#d0d5dd] border-dashed text-[#475467] px-3 py-1.5 rounded-lg font-semibold text-xs leading-5 flex items-center gap-1.5 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload document
                    </label>
                  </div>
                </div>

                {/* Documents List or Empty State */}
                {uploadedDocuments.length > 0 ? (
                  <div className="space-y-3">
                    {uploadedDocuments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileIcon />
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
                          onClick={() => handleRemoveDocument(index)}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                          title="Remove document"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<FileIcon />}
                    message="No documents uploaded yet"
                  />
                )}
              </div>
            </Card>

            {/* Project Notes Card */}
            <ProjectNotes
              notes={preparationData.notes}
              onAddNote={handleAddNote}
              onEditNote={handleEditNote}
              onDeleteNote={handleDeleteNote}
              onAddAttachment={handleAddAttachment}
              onRemoveAttachment={handleRemoveAttachment}
              onDownloadAttachment={handleDownloadAttachment}
            />
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 flex-1">
            {/* Trailer & Films Card */}
            <TrailerLogisticsCard
              assignedTrailer={assignedTrailer}
              onAssignTrailer={handleAssignTrailer}
              onAddAttachment={handleFileAttachment}
              onMarkComplete={handleMarkTrailerComplete}
              hasReceipt={uploadedReceipts.length > 0}
              isCompleted={isTrailerCompleted}
              availableTrailers={availableTrailers}
              attachedFiles={uploadedReceipts}
            />
          </div>
        </div>
      </div>

      {/* Edit Project Details Modal */}
      <EditProjectDetailsModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        project={project}
        onSave={handleSaveProjectDetails}
      />

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

      {/* Travel & Accommodation Request Modal */}
      <TravelAccommodationRequestModal
        isOpen={showTravelAccommodationRequestModal}
        onClose={() => setShowTravelAccommodationRequestModal(false)}
        onSubmit={handleTravelAccommodationRequestSubmit}
        assignedTeamMembers={preparationData.assignedTeam?.members || []}
        projectLocation="123 Main Street, Downtown"
      />

      {/* Travel & Accommodation Details Modal */}
      <TravelAccommodationModal
        isOpen={showTravelAccommodationDetailsModal}
        onClose={() => setShowTravelAccommodationDetailsModal(false)}
        onSubmit={handleTravelAccommodationDetailsSubmit}
      />

      {/* Contract Required Modal */}
      <Modal
        isOpen={showContractRequiredModal}
        onClose={() => setShowContractRequiredModal(false)}
        title="Project Contract Required"
        size="md"
      >
        <div className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Warning Icon */}
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            {/* Main Message */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Project Cannot Move to Next Status
              </h3>
              <p className="text-gray-600 leading-relaxed">
                The project cannot move to the next status because the project contract needs to be added.
                Please contact the sales person.
              </p>
            </div>


            {/* Action Buttons */}
            <div className="flex justify-center w-full">
              <Button
                onClick={() => setShowContractRequiredModal(false)}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Setup Inventory Modal */}
      <SetupInventoryModal
        isOpen={showSetupInventoryModal}
        onClose={() => setShowSetupInventoryModal(false)}
        onSave={(items) => {
          console.log('Inventory items saved:', items);
          showToast('Inventory setup saved successfully');
        }}
      />
    </div>
  );
};
