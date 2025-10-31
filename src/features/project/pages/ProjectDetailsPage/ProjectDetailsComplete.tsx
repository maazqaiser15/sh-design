import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  Download,
  Upload,
  Trash2,
  Ruler,
  DollarSign,
  Scissors,
  Plane,
  User,
  Building,
  Dot,
  Edit,
  MapPin,
} from 'lucide-react';
import { PieChart } from "../../../../common/components/PieChart";
import { ProjectDetails, MOCK_PROJECT_DETAILS, ProjectNote } from '../../types/projectDetails';
import { NoteAttachment } from '../../../../types';
import { ProjectNotes } from '../../components/ProjectNotes';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { PDFViewerModal } from '../../../../common/components/PDFViewerModal';
import { useToast } from '../../../../contexts/ToastContext';
import { generateProjectReportPDF, ProjectReportData } from '../../../../utils/pdfReportGenerator';
import { AssignTeamModal } from '../../components/AssignTeamModal';
import { MOCK_TEAM_MEMBERS } from '../../types/teamMembers';
import { AssignTrailerModal } from '../../components/AssignTrailerModal';
import { TrailerForAssignment } from '../../types/trailers';
import { getAvailableTrailersForAssignment } from '../../utils/trailerDataUtils';
import { Modal } from 'common/components/Modal';
import TravelDetailsContent from './TravelDetailsContent';

interface ProjectDetailsCompleteProps {
  projectStatus?: 'WIP' | 'QF' | 'Completed';
}

export const ProjectDetailsComplete: React.FC<ProjectDetailsCompleteProps> = ({ projectStatus = 'Completed' }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('project-report');
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [showAssignTrailerModal, setShowAssignTrailerModal] = useState(false);
  const [availableTrailers] = useState<TrailerForAssignment[]>(getAvailableTrailersForAssignment());
  const [showTravelDetailsModal, setShowTravelDetailsModal] = useState(false);
  // Notes State
  const [notes, setNotes] = useState<ProjectNote[]>([]);

  // Project Report Data
  const [projectReport] = useState({
    totalHoursSpent: 320,
    totalPeopleWorked: 5,
    windowLayersReinstalled: 2,
    sheetLayersInstalled: 45,
    // Project Completion Dates
    estimatedCompletion: '2024-02-15',
    actualCompletion: '2024-02-14',
    // Square Footage Metrics
    squareFootage: {
      salesEstimate: 2850, // sq ft estimated by sales
      operationsMeasurement: 2795, // sq ft measured by operations
      variance: -55, // difference between sales and ops
      variancePercentage: -1.93 // percentage variance
    },
    // Labour Cost Metrics
    labourCosts: {
      regularHours: 308, // regular hours worked
      regularCost: 24640, // regular cost
      overtimeHours: 12, // overtime hours worked
      overtimeCost: 1920, // overtime cost
      actualHours: 320, // actual hours worked
      estimatedHours: 300, // estimated hours
      actualOvertimeHours: 12, // actual overtime hours
      overtimePercentage: 3.75 // overtime percentage
    },
    // Film Usage Metrics
    filmUsage: {
      totalFilmUsed: 2850, // sq ft of film used
      filmRecut: 45, // sq ft of film recut
      wastePercentage: 2.98, // percentage of waste
      recutPercentage: 1.58, // percentage of recut
      filmCostPerSqFt: 12.50 // cost per square foot
    },
    // Travel & Accommodation Costs
    travelAccommodation: {
      hotelCost: 1800, // hotel costs
      flightCostToJob: 1200, // flight cost to job
      flightCostFromJob: 1200, // flight cost from job
      rentalCar: true, // rental car Y/N
      rentalCost: 400, // rental cost
      totalTravelAccommodation: 4600, // total travel & accommodation
      teamMembersTraveled: 5 // number of team members who traveled
    },
    teamMembers: [
      {
        id: '1',
        name: 'John Smith',
        role: 'Lead Supervisor',
        hoursWorked: 80,
        layersInstalled: 12,
        layersReinstalled: 2,
        qualityScore: 98
      },
      {
        id: '2',
        name: 'Ayesha Khan',
        role: 'Crew Leader',
        hoursWorked: 75,
        layersInstalled: 10,
        layersReinstalled: 1,
        qualityScore: 95
      },
      {
        id: '3',
        name: 'Mike Lee',
        role: 'Senior Installer',
        hoursWorked: 70,
        layersInstalled: 8,
        layersReinstalled: 1,
        qualityScore: 92
      },
      {
        id: '4',
        name: 'Sarah Johnson',
        role: 'Installer',
        hoursWorked: 65,
        layersInstalled: 7,
        layersReinstalled: 0,
        qualityScore: 94
      },
      {
        id: '5',
        name: 'David Chen',
        role: 'Installer',
        hoursWorked: 60,
        layersInstalled: 6,
        layersReinstalled: 0,
        qualityScore: 90
      }
    ]
  });

  // Quality Check State
  const [qualityChecks] = useState([
    {
      id: '1',
      windowId: '1',
      windowName: 'Main Entrance Window',
      status: 'passed',
      inspector: 'John Smith',
      checkedAt: '2024-01-20T10:30:00Z',
      notes: 'Perfect installation, no issues detected',
      issues: []
    },
    {
      id: '2',
      windowId: '2',
      windowName: 'Conference Room Window',
      status: 'passed',
      inspector: 'John Smith',
      checkedAt: '2024-01-20T11:15:00Z',
      notes: 'Excellent work quality after reinstallation',
      issues: []
    },
    {
      id: '3',
      windowId: '3',
      windowName: 'Office Window A',
      status: 'passed',
      inspector: 'Sarah Johnson',
      checkedAt: '2024-01-20T12:00:00Z',
      notes: 'Excellent work quality',
      issues: []
    },
    {
      id: '4',
      windowId: '4',
      windowName: 'Office Window B',
      status: 'passed',
      inspector: 'Sarah Johnson',
      checkedAt: '2024-01-20T13:00:00Z',
      notes: 'Perfect installation',
      issues: []
    }
  ]);

  // Get project data with default values for missing properties
  const project = {
    ...MOCK_PROJECT_DETAILS,
    progress: 100,
    currentPhase: 'Project Completed',
    estimatedCompletion: '2024-02-15',
    teamOnSite: 5,
    windowsCompleted: 15,
    windowsStarted: 15,
    activityLog: [
      {
        id: '1',
        user: 'John Smith',
        action: 'completed final quality inspection for Marriot Windows Installation',
        time: '2 hours ago',
        type: 'completion',
        fileName: null,
        fileSize: null,
        note: 'All 15 windows passed final quality check - project completed successfully'
      },
      {
        id: '2',
        user: 'Sarah Johnson',
        action: 'uploaded final project report for Marriot Windows Installation',
        time: '4 hours ago',
        type: 'document',
        fileName: 'final-project-report.pdf',
        fileSize: '3.2 MB'
      },
      {
        id: '3',
        user: 'Mike Lee',
        action: 'completed reinstallation of 2 windows in Marriot Windows Installation',
        time: '6 hours ago',
        type: 'completion',
        fileName: null,
        fileSize: null,
        note: 'Windows #12 and #8 successfully reinstalled and quality approved'
      },
      {
        id: '4',
        user: 'Emily Rodriguez',
        action: 'uploaded client satisfaction survey for Marriot Windows Installation',
        time: '1 day ago',
        type: 'document',
        fileName: 'client-satisfaction-survey.pdf',
        fileSize: '1.1 MB'
      },
      {
        id: '5',
        user: 'David Chen',
        action: 'completed project cleanup for Marriot Windows Installation',
        time: '1 day ago',
        type: 'completion',
        fileName: null,
        fileSize: null,
        note: 'Site cleanup completed, all materials properly disposed'
      },
      {
        id: '6',
        user: 'Ayesha Khan',
        action: 'uploaded final documentation for Marriot Windows Installation',
        time: '2 days ago',
        type: 'document',
        fileName: 'project-documentation-final.pdf',
        fileSize: '4.8 MB'
      }
    ]
  };

  // Update project status based on prop
  const currentProject = { ...project, status: projectStatus };

  // Handlers
  const handleCreateAssociatedProject = () => {
    navigate(`/associatedProject`);
  };

  // Note handlers
  const handleAddNote = (content: string, isInternal: boolean, attachments?: NoteAttachment[]) => {
    const newNote: ProjectNote = {
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
    setNotes(prev => [...prev, newNote]);
  };

  const handleEditNote = (noteId: string, content: string) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId
        ? { ...note, content, updatedAt: new Date().toISOString() }
        : note
    ));
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  // Attachment handlers
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

    setNotes(prev => prev.map(note =>
      note.id === noteId
        ? { ...note, attachments: [...(note.attachments || []), newAttachment] }
        : note
    ));
  };

  const handleRemoveAttachment = (noteId: string, attachmentId: string) => {
    setNotes(prev => prev.map(note =>
      note.id === noteId
        ? { ...note, attachments: (note.attachments || []).filter(att => att.id !== attachmentId) }
        : note
    ));
  };

  const handleDownloadAttachment = (attachment: NoteAttachment) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const reportData: ProjectReportData = {
        projectName: project.name || 'Project',
        projectId: project.projectId || 'N/A',
        site: project.site || 'N/A',
        startDate: project.startDate || 'N/A',
        endDate: project.endDate || 'N/A',
        estimatedCompletion: projectReport.estimatedCompletion,
        actualCompletion: projectReport.actualCompletion,
        totalHoursSpent: projectReport.totalHoursSpent,
        totalPeopleWorked: projectReport.totalPeopleWorked,
        squareFootage: projectReport.squareFootage,
        labourCosts: projectReport.labourCosts,
        filmUsage: projectReport.filmUsage,
        travelAccommodation: projectReport.travelAccommodation,
        qualityChecks: {
          passed: passedChecks,
          failed: failedChecks,
          successRate: 100,
          averageQualityScore: 94.8
        },
        teamMembers: projectReport.teamMembers
      };

      const pdf = generateProjectReportPDF(reportData);
      const pdfBlob = pdf.output('blob');
      setPdfBlob(pdfBlob);
      setShowPDFModal(true);
      showToast('PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showToast('Unable to generate report. Please check your connection and try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const passedChecks = qualityChecks.filter(check => check.status === 'passed').length;
  const failedChecks = qualityChecks.filter(check => check.status === 'failed').length;
  const pendingChecks = qualityChecks.filter(check => check.status === 'pending').length;

  return (
    <div className=" min-h-screen">
      {/* Header Section */}
      <div className=" border-b border-gray-200">
        <div className="py-6">
          <Card>
            <div className="flex flex-col gap-6">
              {/* Page Header */}
              <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-semibold text-gray-900">
                        Marriot Windows Installation
                      </h1>
                      <span className="px-2 py-1 rounded-md text-sm font-semibold bg-green-50 text-green-700">
                        Completed
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="primary"
                      onClick={handleCreateAssociatedProject}
                      className="px-3 py-2"
                    >
                      Create Associated Project
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap  items-start justify-between mb-0">
                  {/* VIN Code */}
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        VIN Code
                      </p>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {project?.projectId || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Site */}
                  {project.site && (
                    <div className="flex items-start gap-2">
                      <Building className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Site</p>
                        <p className="text-sm text-gray-900 font-medium">
                          {project.site}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Duration */}
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        Duration
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        Feb 1, 2024 – Feb 15, 2024
                      </p>
                    </div>
                  </div>

                  {/* Industry */}
                  {project.industry && (
                    <div className="flex items-start gap-2">
                      <Building className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Industry
                        </p>
                        <p className="text-sm text-gray-900 font-medium">
                          {project.industry}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Coordinator */}
                  {project.assignedCoordinator && (
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Coordinator
                        </p>
                        <p className="text-sm text-gray-900 font-medium">
                          {project.assignedCoordinator.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Contact Person */}
                  {project.contactPerson && (
                    <div className="flex items-start gap-2 pr-6">
                      <User className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Primary Contact Person</p>
                        <p className="text-sm text-gray-900 font-medium">{project.contactPerson.name}</p>
                        {project.contactPerson.phone && <p className="text-xs text-gray-700 flex items-center">Testing Role<Dot /> {project.contactPerson.phone}</p>}
                        {project.contactPerson?.email && <p className="text-xs text-gray-700">{project.contactPerson.email}</p>}

                      </div>
                    </div>
                  )}

                  {project.contactPerson && (
                    <div className="flex items-start gap-2 pr-6">
                      <User className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Secondary Contact Person</p>
                        <p className="text-sm text-gray-900 font-medium">{project.contactPerson.name}</p>
                        {project.contactPerson.phone && <p className="text-xs text-gray-700 flex items-center">Testing Role<Dot /> {project.contactPerson.phone}</p>}
                        {project.contactPerson?.email && <p className="text-xs text-gray-700">{project.contactPerson.email}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </div>



              <div className="grid grid-cols-2 mt-3 sm:grid-cols-5 gap-3 sm:gap-4">
                <div className="flex-shrink-0   flex items-center gap-3 justify-start">
                  <PieChart percentage={30} size={80} />
                  <div>
                    <h2>
                      42/60 <br /> windows completed
                    </h2>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xl font-semibold text-gray-700">{projectReport.totalHoursSpent}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">Total Hours Worked</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xl font-semibold text-gray-700">{projectReport.totalPeopleWorked}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">Team Members</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                      <Ruler className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xl font-semibold text-gray-700">{projectReport.squareFootage.operationsMeasurement}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">Square Footage Installed</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xl font-semibold text-gray-700">{projectReport.sheetLayersInstalled}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">Layers Installed</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-6">
        <div className="flex gap-6">
          {/* Left Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {[
                  { id: 'project-report', label: 'Project Report' },
                  { id: 'team', label: 'Team' },
                  {
                    id: "travel-accommodation",
                    label: "Travel & Accommodation",
                  },
                  {
                    id: "trailer-films",
                    label: "Trailer & Films",
                  },
                  { id: "document", label: "Document" },
                  { id: 'notes', label: 'Notes' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'project-report' && (
              <div className="space-y-6">
                {/* Project Report Section */}
                <div className="space-y-6">
                  {/* Project Report Header */}
                  <Card className="">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Project Report</h3>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="primary"
                          icon={Download}
                          onClick={handleGeneratePDF}
                          disabled={isGeneratingPDF}
                          className="px-4 py-2"
                        >
                          {isGeneratingPDF ? 'Generating...' : 'Export Report'}
                        </Button>
                      </div>
                    </div>

                    {/* Project Statistics */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Square Footage Metrics */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Ruler className="w-5 h-5 text-blue-600" />
                          <h4 className="text-md font-semibold text-gray-900">Square Footage Analysis</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Sales Estimate</span>
                            <span className="font-semibold text-gray-900">{projectReport.squareFootage.salesEstimate.toLocaleString()} sq ft</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Operations Measurement</span>
                            <span className="font-semibold text-blue-600">{projectReport.squareFootage.operationsMeasurement.toLocaleString()} sq ft</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Variance</span>
                            <span className={`font-semibold ${projectReport.squareFootage.variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {projectReport.squareFootage.variance > 0 ? '+' : ''}{projectReport.squareFootage.variance} sq ft
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Variance %</span>
                            <span className={`font-semibold ${projectReport.squareFootage.variancePercentage < 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {projectReport.squareFootage.variancePercentage > 0 ? '+' : ''}{projectReport.squareFootage.variancePercentage}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Labour Cost Metrics */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-purple-600" />
                          <h4 className="text-md font-semibold text-gray-900">Labour Cost Breakdown</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Regular Hours</span>
                            <span className="font-semibold text-blue-600">{projectReport.labourCosts.regularHours} hrs</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Overtime Hours</span>
                            <span className="font-semibold text-orange-600">{projectReport.labourCosts.overtimeHours} hrs</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Estimated Hours</span>
                            <span className="font-semibold text-blue-600">{projectReport.labourCosts.estimatedHours} hrs</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Actual Hours</span>
                            <span className="font-semibold text-green-600">{projectReport.labourCosts.actualHours} hrs</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Actual Overtime Hours</span>
                            <span className="font-semibold text-orange-600">{projectReport.labourCosts.actualOvertimeHours} hrs</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Overtime Percentage</span>
                            <span className="font-semibold text-purple-600">{projectReport.labourCosts.overtimePercentage}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quality Summary Row */}
                    <div className="mb-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <h4 className="text-md font-semibold text-gray-900">Quality Summary</h4>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          {/* Layers Installed Card  */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">{passedChecks}</div>
                            <div className="text-sm text-green-700 font-medium">Layers Installed</div>
                          </div>

                          {/* Layers Reinstalled Card */}
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-red-600 mb-1">{failedChecks}</div>
                            <div className="text-sm text-red-700 font-medium">Layers Reinstalled</div>
                          </div>

                          {/* Success Rate Card */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">100%</div>
                            <div className="text-sm text-green-700 font-medium">Success Rate</div>
                          </div>

                          {/* Average Quality Score Card */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-1">94.8%</div>
                            <div className="text-sm text-blue-700 font-medium">Average Quality Score</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Metrics Row */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      {/* Film Usage Metrics */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Scissors className="w-5 h-5 text-orange-600" />
                          <h4 className="text-md font-semibold text-gray-900">Film Usage & Waste Analysis</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Total Film Used</span>
                            <span className="font-semibold text-gray-900">{projectReport.filmUsage.totalFilmUsed.toLocaleString()} sq ft</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Film Recut</span>
                            <span className="font-semibold text-orange-600">{projectReport.filmUsage.filmRecut} sq ft</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Waste Percentage</span>
                            <span className="font-semibold text-red-600">{projectReport.filmUsage.wastePercentage}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Travel & Accommodation Costs */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Plane className="w-5 h-5 text-indigo-600" />
                          <h4 className="text-md font-semibold text-gray-900">Travel & Accommodation</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Hotel Cost</span>
                            <span className="font-semibold text-gray-900">${projectReport.travelAccommodation.hotelCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Flight Cost To Job</span>
                            <span className="font-semibold text-blue-600">${projectReport.travelAccommodation.flightCostToJob.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Flight Cost From Job</span>
                            <span className="font-semibold text-blue-600">${projectReport.travelAccommodation.flightCostFromJob.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Rental Car Y/N</span>
                            <span className="font-semibold text-gray-900">{projectReport.travelAccommodation.rentalCar ? 'Yes' : 'No'}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Rental Cost</span>
                            <span className="font-semibold text-orange-600">${projectReport.travelAccommodation.rentalCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Total Travel & Accommodation</span>
                            <span className="font-semibold text-indigo-600">${projectReport.travelAccommodation.totalTravelAccommodation.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Team Performance */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Team Performance Summary</h4>
                      <div className="space-y-3">
                        {projectReport.teamMembers.map((member) => (
                          <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{member.name}</p>
                                <p className="text-sm text-gray-500">{member.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-center">
                                <p className="text-sm text-gray-600">No of Layers Installed</p>
                                <p className="font-semibold text-gray-900">{member.layersInstalled}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Issues Reported</p>
                                <p className="font-semibold text-gray-900">{member.layersReinstalled}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Hours</p>
                                <p className="font-semibold text-gray-900">{member.hoursWorked}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}


            {activeTab === "trailer-films" && (
              <div className="space-y-6">
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Trailer & Films hahah
                  </h3>
                  <div className="space-y-6">
                    {/* Travel Details Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Trailer
                      </h4>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 flex">
                            Beta Trailer <Dot /> ABCD7643826
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1.5">
                            <MapPin className="w-4 h-4" /> Location: Miami
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Button variant="secondary" onClick={() => setShowAssignTrailerModal(true)}>
                            Change Trailer
                          </Button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Hotel Reservation Details Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Films
                      </h4>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            Shipment Receipt
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                            <span>3 attachments</span>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}


            {activeTab === "travel-accommodation" && (
              <div className="space-y-6">
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Travel & Accommodation
                  </h3>
                  <div className="space-y-6">
                    {/* Travel Details Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Travel details
                      </h4>
                      <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">John Doe</p>
                            <div className="flex-1 flex items-center gap-2">
                              <p className="font-medium text-gray-500 text-xs ">
                                Islamabad → New York
                              </p>
                              <p className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                One Way
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                />
                              </svg>
                              <span>2 attachments</span>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() => {
                                setShowTravelDetailsModal(true);
                              }}>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">John Doe</p>
                            <div className="flex-1 flex items-center gap-2">
                              <p className="font-medium text-gray-500 text-xs ">
                                Islamabad → New York
                              </p>
                              <p className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                One Way
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                />
                              </svg>
                              <span>2 attachments</span>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() => {
                                setShowTravelDetailsModal(true);
                              }}>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">John Doe</p>
                            <div className="flex-1 flex items-center gap-2">
                              <p className="font-medium text-gray-500 text-xs ">
                                Miami → Lahore
                              </p>
                              <p className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Round Trip
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                />
                              </svg>
                              <span>2 attachments</span>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() => {
                                setShowTravelDetailsModal(true);
                              }}>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hotel Reservation Details Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Hotel Reservation Details
                      </h4>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            Hotel Picaso · Sep 25 → Sep 26, 2025
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1.5">
                            Duration: 1 night
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                            <span>3 attachments</span>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => {
                              setShowHotelDetailsModal(true);
                            }}>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Rental Vehical */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Rental Vehical Details
                      </h4>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            System Vehical Services
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1.5">
                            Duration: Sep 25 → Sep 26, 2025
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                              />
                            </svg>
                            <span>3 attachments</span>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => {
                              setShowTravelDetailsModal(true);
                            }}>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'issues' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Issues</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">All Issues Resolved</h4>
                      <p className="text-green-700 mt-1">All quality issues have been successfully addressed and resolved</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">Resolution Summary</h4>
                      <p className="text-gray-600 mt-1">2 windows were reinstalled and passed final quality inspection</p>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {activeTab === "team" && (
              <div className="space-y-6">
                <Card className="">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Team Members
                    </h3>
                    <button onClick={() => setShowEditTeamModal(true)} className="bg-white border border-[#d0d5dd] border-dashed text-[#475467] w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Edit size={18} className="text-gray-600" />
                    </button>

                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        name: "John Smith",
                        role: "Lead Supervisor",
                        phone: "+1-555-0123",
                      },
                      {
                        name: "Ayesha Khan",
                        role: "Crew Leader",
                        phone: "+1-555-0124",
                      },
                      {
                        name: "Mike Lee",
                        role: "Senior Installer",
                        phone: "+1-555-0125",
                      },
                      {
                        name: "Sarah Johnson",
                        role: "Installer",
                        phone: "+1-555-0126",
                      },
                      {
                        name: "David Chen",
                        role: "Installer",
                        phone: "+1-555-0127",
                      },
                      {
                        name: "Emily Rodriguez",
                        role: "Safety Coordinator",
                        phone: "+1-555-0128",
                      },
                    ].map((member, index) => (
                      <Card
                        key={index}
                        className="flex items-center gap-3  bg-white">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {member.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member.role}{" "}
                            <span className="bg-black rounded-full inline-block w-1 h-1 mx-1" />{" "}
                            <span>({member.phone})</span>
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </div>
            )}
            {activeTab === "document" && (
              <div className="space-y-6">
                {/* Project Documents Section */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Project Documents
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">2 documents</p>
                    </div>
                    <Button
                      variant="secondary"
                      icon={Upload}
                      onClick={() =>
                        showToast("Upload document functionality coming soon")
                      }
                      className="px-4 py-2">
                      Upload document
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {/* Document 1 */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            DOC
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Site Map - Floor Plan.pdf
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>1.95 MB</span>
                            <span>•</span>
                            <span>Jan 15, 2024, 02:00 PM</span>
                            <span>•</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              John Doe
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            showToast("Downloading Site Map - Floor Plan.pdf")
                          }
                          className="p-2 text-gray-400 hover:text-gray-600">
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            showToast(
                              "Delete document functionality coming soon"
                            )
                          }
                          className="p-2 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Document 2 */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            TXT
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Architectural Plan.txt
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>1.95 MB</span>
                            <span>•</span>
                            <span>Jan 15, 2024, 02:00 PM</span>
                            <span>•</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              Ema Will
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            showToast("Downloading Architectural Plan.txt")
                          }
                          className="p-2 text-gray-400 hover:text-gray-600">
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            showToast(
                              "Delete document functionality coming soon"
                            )
                          }
                          className="p-2 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-6">
                <ProjectNotes
                  notes={notes}
                  onAddNote={handleAddNote}
                  onEditNote={handleEditNote}
                  onDeleteNote={handleDeleteNote}
                  onAddAttachment={handleAddAttachment}
                  onRemoveAttachment={handleRemoveAttachment}
                  onDownloadAttachment={handleDownloadAttachment}
                />
              </div>
            )}
          </div>

          {/* Right Sidebar - Activity Log */}
          <div className="w-96 flex-shrink-0">
            <Card className="p-5 h-fit">
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
                  <p className="text-sm text-gray-500">6 recent updates</p>
                </div>

                <div className="space-y-4">
                  {(project.activityLog || []).map((activity) => (
                    <div key={activity.id} className="relative">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {activity.user.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-900">{activity.user}</span>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {activity.action.split('Marriot Windows Installation')[0]}
                            <span className="font-semibold text-green-600 underline">Marriot Windows Installation</span>
                            {activity.action.split('Marriot Windows Installation')[1]}
                          </p>
                          {activity.type === 'document' && activity.fileName && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="w-6 h-6 bg-green-50 rounded flex items-center justify-center">
                                <FileText className="w-3 h-3 text-green-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-700">{activity.fileName}</div>
                                <div className="text-xs text-gray-500">{activity.fileSize}</div>
                              </div>
                            </div>
                          )}
                          {(activity.type === 'update' || activity.type === 'completion') && activity.note && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600 italic">"{activity.note}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <AssignTrailerModal
        isOpen={showAssignTrailerModal}
        onClose={() => setShowAssignTrailerModal(false)}
        onAssignTrailer={() => console.log('click')}
        availableTrailers={availableTrailers}
        assignedTrailerId={availableTrailers?.id}
      />


         {showTravelDetailsModal && (
              <Modal
                isOpen={showTravelDetailsModal}
                onClose={() => setShowTravelDetailsModal(false)}
                title={"Travel Details"}
                size="lg">
                <TravelDetailsContent />
              </Modal>
            )}
            

      <AssignTeamModal
        isOpen={showEditTeamModal}
        onClose={() => setShowEditTeamModal(false)}
        onAssignTeam={() => { console.log('heheheh') }}
        availableMembers={MOCK_TEAM_MEMBERS}
        projectDetails={project}
      />

      {/* PDF Viewer Modal */}
      <PDFViewerModal
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        pdfBlob={pdfBlob}
        fileName={`${(project.name || 'Project').replace(/\s+/g, '_')}_Project_Report_${new Date().toISOString().split('T')[0]}.pdf`}
      />
    </div>
  );
};
