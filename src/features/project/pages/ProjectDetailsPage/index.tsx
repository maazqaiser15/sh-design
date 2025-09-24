import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, CheckCircle } from 'lucide-react';
import { ProjectDetails, PreparationStageData, MOCK_PROJECT_DETAILS, MOCK_PREPARATION_DATA } from '../../types/projectDetails';
import { AssignTeamModal } from '../../components/AssignTeamModal';
import { AddLogisticsModal } from '../../components/AddLogisticsModal';
import { AddTravelModal } from '../../components/AddTravelModal';
import { MOCK_TEAM_MEMBERS, TeamMember } from '../../types/teamMembers';
import { LogisticsItem, TravelPlan } from '../../types/logisticsTravel';
import { ProjectDateModal } from '../../components/ProjectDateModal';
import { AssignTrailerModal } from '../../components/AssignTrailerModal';
import { AssignedTeamCard } from '../../components/AssignedTeamCard';
import { TravelAccommodationModal, TravelAccommodationData } from '../../components/TravelAccommodationModal';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { useToast } from '../../../../contexts/ToastContext';
import { getAvailableTrailersForAssignment } from '../../utils/trailerDataUtils';
import { TrailerForAssignment } from '../../types/trailers';
import { Window, MOCK_WINDOWS } from '../../types/windows';

// Icons from Figma design

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 18.3333C10 18.3333 16.6667 12.5 16.6667 8.33333C16.6667 6.44928 15.7143 4.64236 14.0711 3.28595C12.4278 1.92954 10.2243 1.16667 8.33333 1.16667C6.44238 1.16667 4.23886 1.92954 2.59564 3.28595C0.952427 4.64236 0 6.44928 0 8.33333C0 12.5 6.66667 18.3333 10 18.3333Z" stroke="#667085" strokeWidth="1.5"/>
    <path d="M10 10.8333C11.3807 10.8333 12.5 9.71405 12.5 8.33333C12.5 6.95262 11.3807 5.83333 10 5.83333C8.61929 5.83333 7.5 6.95262 7.5 8.33333C7.5 9.71405 8.61929 10.8333 10 10.8333Z" stroke="#667085" strokeWidth="1.5"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.66667 1.66667V4.16667M13.3333 1.66667V4.16667M2.91667 7.5H17.0833M17.5 7.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V7.5H17.5ZM2.5 7.5V5.83333C2.5 5.39131 2.67559 4.96738 2.98816 4.65482C3.30072 4.34226 3.72464 4.16667 4.16667 4.16667H15.8333C16.2754 4.16667 16.6993 4.34226 17.0118 4.65482C17.3244 4.96738 17.5 5.39131 17.5 5.83333V7.5H2.5Z" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.3333 1.99999C11.5084 1.82498 11.7163 1.68604 11.9451 1.59128C12.1739 1.49652 12.4191 1.44775 12.6667 1.44775C12.9142 1.44775 13.1594 1.49652 13.3882 1.59128C13.617 1.68604 13.8249 1.82498 14 1.99999C14.175 2.175 14.3139 2.3829 14.4087 2.6117C14.5035 2.8405 14.5522 3.0857 14.5522 3.33332C14.5522 3.58094 14.5035 3.82614 14.4087 4.05492C14.3139 4.2837 14.175 4.4916 14 4.66665L5 13.6667L1.33333 14.6667L2.33333 11L11.3333 1.99999Z" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1.33333C11.6819 1.33333 14.6667 4.3181 14.6667 8C14.6667 11.6819 11.6819 14.6667 8 14.6667C4.3181 14.6667 1.33333 11.6819 1.33333 8C1.33333 4.3181 4.3181 1.33333 8 1.33333Z" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 8L7.33333 9.33333L10.6667 6" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DotIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="4" cy="4" r="4" fill="#667085"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3333 6.66667C13.3333 8.50761 11.841 10 10 10C8.15905 10 6.66667 8.50761 6.66667 6.66667C6.66667 4.82572 8.15905 3.33333 10 3.33333C11.841 3.33333 13.3333 4.82572 13.3333 6.66667Z" stroke="#0D76BF" strokeWidth="1.5"/>
    <path d="M10 12.5C7.23858 12.5 5 14.7386 5 17.5H15C15 14.7386 12.7614 12.5 10 12.5Z" stroke="#0D76BF" strokeWidth="1.5"/>
    <path d="M15.8333 6.66667C15.8333 7.58714 15.4542 8.47052 14.7791 9.14559C14.104 9.82066 13.2206 10.2 12.3 10.2" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M17.5 12.5C17.5 13.4205 17.1209 14.3039 16.4458 14.9789C15.7707 15.654 14.8873 16.0333 13.9667 16.0333" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ExpandIcon = () => (
  <img 
    alt="expand" 
    className="w-4 h-4" 
    src="http://localhost:3845/assets/3e78c16b10a97a5ae477b888f056cb3c7d900fb9.svg"
  />
);

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 1V11M1 6H11" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.66667 12.5H13.3333V4.16667H1.66667V12.5Z" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.3333 8.33333H15.8333L18.3333 10.8333V12.5H13.3333" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="5" cy="15" r="1.66667" stroke="#0D76BF" strokeWidth="1.5"/>
    <circle cx="15" cy="15" r="1.66667" stroke="#0D76BF" strokeWidth="1.5"/>
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3333 1.66667H5C4.55797 1.66667 4.13405 1.84226 3.82149 2.15482C3.50893 2.46738 3.33333 2.89131 3.33333 3.33333V16.6667C3.33333 17.1087 3.50893 17.5326 3.82149 17.8452C4.13405 18.1577 4.55797 18.3333 5 18.3333H15C15.442 18.3333 15.866 18.1577 16.1785 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V6.66667L13.3333 1.66667Z" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.3333 1.66667V6.66667H16.6667" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StickerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 2.5H5C4.17157 2.5 3.5 3.17157 3.5 4V16C3.5 16.8284 4.17157 17.5 5 17.5H15C15.8284 17.5 16.5 16.8284 16.5 16V4C16.5 3.17157 15.8284 2.5 15 2.5Z" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.33333 7.5H11.6667" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.33333 10.8333H11.6667" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1.33333V10.6667M8 1.33333L5.33333 4M8 1.33333L10.6667 4M2.66667 10.6667H13.3333" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3L3 9M3 3L9 9" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PaperclipIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.6667 4.66667L5.33333 10C4.59695 10.7364 4.59695 11.9302 5.33333 12.6667C6.06971 13.403 7.26362 13.403 8 12.6667L13.3333 7.33333C14.8061 5.86056 14.8061 3.47278 13.3333 2C11.8606 0.527241 9.47278 0.527241 8 2L2.66667 7.33333" stroke="#344054" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
        <div className="bg-[#027a48] rounded-xl w-6 h-6 flex items-center justify-center">
          <CheckCircleIcon />
        </div>
      );
    }
    return (
      <div className="bg-white border border-gray-200 rounded-xl w-6 h-6 flex items-center justify-center">
        <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
      </div>
    );
  };

  return (
    <div className="flex gap-3 items-start flex-1">
      <div className="flex flex-col items-center pt-1">
        {getStepIcon()}
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <p className="font-semibold text-sm text-[#344054] leading-5">{title}</p>
        <p className="font-normal text-xs text-[#475467] leading-4">{description}</p>
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
export const ProjectDetailsPage: React.FC = () => {
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
  const [showTravelAccommodationModal, setShowTravelAccommodationModal] = useState(false);
  const [travelAccommodationRequestSubmitted, setTravelAccommodationRequestSubmitted] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const [availableTrailers] = useState<TrailerForAssignment[]>(getAvailableTrailersForAssignment());
  const [windows, setWindows] = useState<Window[]>(MOCK_WINDOWS);



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

  // Handle travel accommodation modal
  const handleOpenTravelAccommodationModal = () => {
    setShowTravelAccommodationModal(true);
  };

  const handleTravelAccommodationSubmit = (data: TravelAccommodationData) => {
    console.log('Travel & Accommodation Request:', data);
    setTravelAccommodationRequestSubmitted(true);
    showToast('Request submitted to logistics manager successfully!');
    // Here you would typically save the data to your backend
  };

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
    console.log('Mark stage as complete');
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Main Content */}
      <div className="px-[60px] py-6">
        {/* Project Header Card */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
          <div className="flex flex-col gap-6">
            {/* Project Title and Actions */}
            <div className="flex gap-4 items-start w-full">
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex gap-3 items-center">
                  <h1 className="font-semibold text-2xl text-gray-900 leading-9.5">Marriot Windows Installation</h1>
                  <div className="bg-[#e6f4fd] flex items-center justify-center px-2 py-1 rounded-md">
                    <p className="font-semibold text-sm text-[#0d76bf] leading-5">PV90</p>
                  </div>
                </div>
                <div className="flex gap-3 items-center">
                  <div className="bg-gray-50 flex items-center justify-center px-2 py-1 rounded-md">
                    <p className="font-semibold text-xs text-[#344054] leading-5">TXDA-SJ1BR1-EETUSC01-P20001</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <LocationIcon />
                    <p className="font-normal text-xs text-[#475467] leading-5">123 Main Street, Downtown</p>
                  </div>
                  <div className="flex gap-1 items-center">
                    <CalendarIcon />
                    <p className="font-normal text-xs text-[#475467] leading-5">Feb 1, 2024 – Feb 15, 2024</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Button
                  onClick={handleMarkStageComplete}
                  className="bg-[#0d76bf] text-white px-3 py-1.5 rounded-md font-semibold text-sm leading-5 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                >
                  Mark Stage as Complete
                </Button>
                <Button
                  onClick={handleEditProject}
                  variant="outline"
                  className="bg-white border border-[#d0d5dd] text-[#475467] px-3 py-1.5 rounded-md font-semibold text-sm leading-5 flex items-center gap-2 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]"
                >
                  <EditIcon />
                  Edit
                </Button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 w-full"></div>

            {/* Progress Steps */}
            <div className="flex items-center w-full">
              <ProgressStep
                title="Team Assignment"
                status="completed"
                description="Completed"
              />
              <ProgressStep
                title="Travel & Accommodation"
                status="current"
                description="In Progress"
              />
              <ProgressStep
                title="Trailer & Logistics"
                status="incomplete"
                description="In Progress"
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-6 flex-1">
            {/* Assigned Team Card */}
            <AssignedTeamCard
              assignedTeam={preparationData.assignedTeam}
              onAddMember={handleAssignTeam}
              onRemoveMember={handleRemoveTeamMember}
              onMarkComplete={() => console.log('Mark team as complete')}
              onExpand={() => console.log('Expand team view')}
              showActions={true}
            />

            {/* Travel & Accommodation Card */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex flex-col gap-5">
                <div className="flex gap-4 items-start w-full">
                  <div className="flex flex-col gap-1 flex-1">
                    <h3 className="font-semibold text-lg text-[#101828] leading-7">Travel & Accommodation</h3>
                    <p className="font-normal text-sm text-[#475467] leading-5">
                      {travelAccommodationRequestSubmitted ? 'Request submitted to logistics manager' : 'Assign travel & accommodation'}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {!travelAccommodationRequestSubmitted ? (
                      <>
                        {/* Not Required Button */}
                        <button
                          onClick={() => console.log('Mark as not required')}
                          className="bg-white border border-[#d0d5dd] text-[#475467] px-3 py-1.5 rounded-lg font-semibold text-xs leading-5 flex items-center gap-1.5 hover:bg-gray-50 transition-colors"
                        >
                          <CheckCircleIcon />
                          Not Required
                        </button>

                        {/* Add/Remove Button */}
                        <button
                          onClick={handleOpenTravelAccommodationModal}
                          className="bg-white border border-[#d0d5dd] border-dashed text-[#475467] w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <PlusIcon />
                        </button>
                      </>
                    ) : (
                      /* Add Details Button - shows after request submission */
                      <Button
                        onClick={() => console.log('Add travel details')}
                        className="bg-[#0d76bf] text-white px-3 py-1.5 rounded-md font-semibold text-sm leading-5 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        Add Details
                      </Button>
                    )}
                  </div>
                </div>
                {!travelAccommodationRequestSubmitted ? (
                  <EmptyState
                    icon={<TruckIcon />}
                    message="No travel & accommodation assigned yet"
                  />
                ) : (
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
                  </div>
                )}
              </div>
            </div>

            {/* Project Documents Card */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
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
                      <img 
                        alt="upload" 
                        className="w-4 h-4" 
                        src="http://localhost:3845/assets/daadc190803c0c7b65b2152c51e5a058c692c5f4.svg"
                      />
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
            </div>

            {/* Project Notes Card */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex flex-col gap-5">
                <div className="flex gap-4 items-start w-full">
                  <div className="flex flex-col gap-1 flex-1">
                    <h3 className="font-semibold text-lg text-[#101828] leading-7">Project Notes</h3>
                    <p className="font-normal text-sm text-[#475467] leading-5">0 notes</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    {/* Add Notes Button */}
                    <button
                      onClick={() => console.log('Add note')}
                      className="bg-white border border-[#d0d5dd] border-dashed text-[#475467] w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <PlusIcon />
                    </button>
                  </div>
                </div>
                <EmptyState
                  icon={<StickerIcon />}
                  message="No notes added yet"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6 flex-1">
            {/* Trailer & Logistics Card */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex flex-col gap-3">
                <SectionHeader
                  title="Trailer & Logistics"
                  subtitle="136 required • 45 in trailer"
                  actionButton={
                    <Button
                      variant="outline"
                      className="bg-white border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg font-semibold text-xs leading-5 flex items-center gap-1.5 opacity-0"
                    >
                      <CheckCircleIcon />
                      Mark as Complete
                    </Button>
                  }
                  secondaryButton={
                    <Button
                      variant="outline"
                      className="bg-white border border-gray-300 text-gray-600 w-8 h-8 rounded-lg flex items-center justify-center opacity-0"
                    >
                      <PlusIcon />
                    </Button>
                  }
                />

                {/* Trailer Assignment */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <TruckIcon />
                      <p className="font-normal text-xs text-[#475467] leading-4">No trailer assigned yet</p>
                    </div>
                    <Button
                      variant="outline"
                      className="bg-white border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg font-semibold text-xs leading-5 flex items-center gap-1.5"
                    >
                      <XIcon />
                      Add trailer
                    </Button>
                  </div>
                </div>

                {/* Inventory Table */}
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="flex">
                    {/* Required Column */}
                    <div className="flex-1">
                      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                        <p className="font-medium text-xs text-[#475467] leading-4.5">Required</p>
                      </div>
                      <div className="px-4 py-2 border-b border-gray-200 h-14 flex flex-col justify-center">
                        <p className="font-medium text-sm text-[#101828] leading-5">BR</p>
                        <p className="font-normal text-xs text-[#475467] leading-5">30 Sheets</p>
                      </div>
                      <div className="px-4 py-2 border-b border-gray-200 h-14 flex flex-col justify-center">
                        <p className="font-medium text-sm text-[#101828] leading-5">Riot+</p>
                        <p className="font-normal text-xs text-[#475467] leading-5">10 Sheets</p>
                      </div>
                      <div className="px-4 py-2 border-b border-gray-200 h-14 flex flex-col justify-center">
                        <p className="font-medium text-sm text-[#101828] leading-5">Smash</p>
                        <p className="font-normal text-xs text-[#475467] leading-5">5</p>
                      </div>
                      <div className="px-4 py-2 h-14 flex flex-col justify-center">
                        <p className="font-medium text-sm text-[#101828] leading-5">FER</p>
                        <p className="font-normal text-xs text-[#475467] leading-5">4 Sheets</p>
                      </div>
                    </div>

                    {/* In Trailer Column */}
                    <div className="flex-1">
                      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                        <p className="font-medium text-xs text-[#475467] leading-4.5">In Trailer</p>
                      </div>
                      <div className="px-4 py-2 border-b border-gray-200 flex items-center h-14">
                        <p className="font-normal text-sm text-[#475467] leading-5">15 sheets</p>
                      </div>
                      <div className="px-4 py-2 border-b border-gray-200 flex items-center h-14">
                        <p className="font-normal text-sm text-[#475467] leading-5">5 sheets</p>
                      </div>
                      <div className="px-4 py-2 border-b border-gray-200 flex items-center h-14">
                        <p className="font-normal text-sm text-[#475467] leading-5">2 sheets</p>
                      </div>
                      <div className="px-4 py-2 flex items-center h-14">
                        <p className="font-normal text-sm text-[#475467] leading-5">3 sheets</p>
                      </div>
                    </div>

                    {/* Need to Ship Column */}
                    <div className="flex-1">
                      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                        <p className="font-medium text-xs text-[#475467] leading-4.5">Need to Ship</p>
                      </div>
                      <div className="px-4 py-2 border-b border-gray-200 flex items-center h-14">
                        <p className="font-normal text-sm text-[#475467] leading-5">15 sheets</p>
                      </div>
                      <div className="px-4 py-2 border-b border-gray-200 flex items-center h-14">
                        <p className="font-normal text-sm text-[#475467] leading-5">5 sheets</p>
                      </div>
                      <div className="px-4 py-2 border-b border-gray-200 flex items-center h-14">
                        <p className="font-normal text-sm text-[#475467] leading-5">3 sheets</p>
                      </div>
                      <div className="px-4 py-2 flex items-center h-14">
                        <p className="font-normal text-sm text-[#475467] leading-5">1 sheets</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* More Film Types Button */}
                <div className="flex items-center justify-center">
                  <Button
                    variant="ghost"
                    className="text-[#0d76bf] font-semibold text-sm leading-5 flex items-center gap-2"
                  >
                    <XIcon />
                    7 more film types
                  </Button>
                </div>

                {/* Receipt Section */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <StickerIcon />
                      <p className="font-normal text-xs text-[#475467] leading-4">No receipt attached yet</p>
                    </div>
                    <Button
                      variant="outline"
                      className="bg-white border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg font-semibold text-xs leading-5 flex items-center gap-1.5"
                    >
                      <PaperclipIcon />
                      Add attachment
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
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

        {/* Travel & Accommodation Modal */}
        <TravelAccommodationModal
          isOpen={showTravelAccommodationModal}
          onClose={() => setShowTravelAccommodationModal(false)}
          onSubmit={handleTravelAccommodationSubmit}
        />
    </div>
  );
};
