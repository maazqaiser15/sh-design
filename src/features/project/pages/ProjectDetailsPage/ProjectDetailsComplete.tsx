import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Truck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Edit,
  Plus,
  Eye,
  Download,
  Search,
  ChevronDown,
  X,
  MoreVertical,
  ArrowLeft,
  ArrowRight,
  Grid,
  List,
  Upload,
  Trash2,
  Shield,
  CheckSquare,
  XCircle,
  BarChart3,
  TrendingUp,
  Award,
  Star,
  Ruler,
  DollarSign,
  Scissors,
  Plane,
  Home,
  FileBarChart,
  Printer
} from 'lucide-react';
import { ProjectDetails, MOCK_PROJECT_DETAILS } from '../../types/projectDetails';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { PDFViewerModal } from '../../../../common/components/PDFViewerModal';
import { useToast } from '../../../../contexts/ToastContext';
import { generateProjectReportPDF, ProjectReportData } from '../../../../utils/pdfReportGenerator';

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
    showToast('Create Associated Project functionality coming soon');
  };

  const handleEditProject = () => {
    showToast('Edit project functionality coming soon');
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const reportData: ProjectReportData = {
        projectName: project.title || 'Project',
        projectId: project.projectId || 'N/A',
        location: project.location || 'N/A',
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
      showToast('Error generating PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const passedChecks = qualityChecks.filter(check => check.status === 'passed').length;
  const failedChecks = qualityChecks.filter(check => check.status === 'failed').length;
  const pendingChecks = qualityChecks.filter(check => check.status === 'pending').length;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="py-6">
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-md font-semibold">
                        {project.projectId || 'N/A'}
                      </span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{project.location || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{project.startDate || 'N/A'} - {project.endDate || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Est: {projectReport.estimatedCompletion} | Act: {projectReport.actualCompletion}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="font-medium">Safe Haven</span>
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">SH</span>
                      </div>
                    </div>
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
                  <Button
                    variant="secondary"
                    onClick={handleEditProject}
                    icon={Edit}
                    className="px-3 py-2"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>

            {/* Project Overview Card */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Project Overview
                </h3>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Successfully Completed</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-50 rounded-md flex items-center justify-center">
                      <Clock className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-xl font-semibold text-gray-700">{projectReport.totalHoursSpent}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">Hours Spent</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-50 rounded-md flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-xl font-semibold text-gray-700">{projectReport.totalPeopleWorked}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">People Worked</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                      <Ruler className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xl font-semibold text-gray-700">{projectReport.squareFootage.operationsMeasurement}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">Sq Ft Completed</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-50 rounded-md flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-xl font-semibold text-gray-700">${(projectReport.labourCosts.totalLabourCost / 1000).toFixed(1)}k</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">Labour Cost</span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Project Completion Status
                </h3>
                <span className="text-sm text-gray-600">
                  100% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="h-2 rounded-full transition-all duration-300 bg-green-600"
                  style={{ width: '100%' }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  Status: Project completed successfully
                </span>
                <span>
                  Completed on {project.endDate || 'N/A'}
                </span>
              </div>
            </div>

          </div>
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
                  { id: 'issues', label: 'Issues & Fixes' },
                  { id: 'team', label: 'Team' },
                  { id: 'document', label: 'Document' },
                  { id: 'notes', label: 'Notes' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-green-600 text-green-600'
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
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
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
                          {isGeneratingPDF ? 'Generating...' : 'Download Report'}
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
                          {/* Windows Passed QC Card */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">{passedChecks}</div>
                            <div className="text-sm text-green-700 font-medium">Windows Passed QC</div>
                          </div>
                          
                          {/* Windows Failed QC Card */}
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-red-600 mb-1">{failedChecks}</div>
                            <div className="text-sm text-red-700 font-medium">Windows Failed QC</div>
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
                                <p className="text-sm text-gray-600">No of Layers Reinstalled</p>
                                <p className="font-semibold text-gray-900">{member.layersReinstalled}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Hours</p>
                                <p className="font-semibold text-gray-900">{member.hoursWorked}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Quality</p>
                                <p className="font-semibold text-gray-900">{member.qualityScore}%</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'issues' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues & Fixes</h3>
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

            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
                  <div className="space-y-4">
                    {projectReport.teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.role}</p>
                        </div>
                        <div className="text-sm text-gray-600">
                          {member.layersInstalled} layers installed
                        </div>
                        <div className="text-sm text-gray-600">
                          {member.layersReinstalled} layers reinstalled
                        </div>
                        <div className="text-sm text-gray-600">
                          {member.hoursWorked} hours worked
                        </div>
                        <div className="text-sm text-gray-600">
                          {member.qualityScore}% quality
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'document' && (
              <div className="space-y-6">
                {/* Project Documents Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Project Documents</h3>
                      <p className="text-sm text-gray-500 mt-1">4 documents</p>
                    </div>
                    <Button
                      variant="secondary"
                      icon={Upload}
                      onClick={() => showToast('Upload document functionality coming soon')}
                      className="px-4 py-2"
                    >
                      Upload document
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Final Project Report */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-green-600">FPR</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Final Project Report.pdf</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>3.2 MB</span>
                            <span>•</span>
                            <span>Jan 20, 2024, 04:00 PM</span>
                            <span>•</span>
                            <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs">Sarah Johnson</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => showToast('Downloading Final Project Report.pdf')}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => showToast('Delete document functionality coming soon')}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Client Satisfaction Survey */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">CSS</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Client Satisfaction Survey.pdf</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>1.1 MB</span>
                            <span>•</span>
                            <span>Jan 19, 2024, 02:30 PM</span>
                            <span>•</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Emily Rodriguez</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => showToast('Downloading Client Satisfaction Survey.pdf')}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => showToast('Delete document functionality coming soon')}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Project Documentation */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">DOC</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Project Documentation Final.pdf</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>4.8 MB</span>
                            <span>•</span>
                            <span>Jan 18, 2024, 11:00 AM</span>
                            <span>•</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Ayesha Khan</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => showToast('Downloading Project Documentation Final.pdf')}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => showToast('Delete document functionality coming soon')}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Quality Inspection Report */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-orange-600">QIR</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Quality Inspection Report.pdf</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>2.1 MB</span>
                            <span>•</span>
                            <span>Jan 20, 2024, 11:15 AM</span>
                            <span>•</span>
                            <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs">John Smith</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => showToast('Downloading Quality Inspection Report.pdf')}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => showToast('Delete document functionality coming soon')}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Project Notes</h3>
                      <p className="text-sm text-gray-500 mt-1">4 notes</p>
                    </div>
                    <button 
                      onClick={() => showToast('Add note functionality coming soon')}
                      className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center hover:border-gray-400 hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Note 1 */}
                    <div className="py-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">John Smith</span>
                            <span className="text-sm text-gray-500">Jan 20, 2024, 04:00 PM</span>
                          </div>
                          <p className="text-gray-700">"Project completed successfully! All 15 windows installed and quality approved. Client is very satisfied with the work."</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button 
                            onClick={() => showToast('Edit note functionality coming soon')}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => showToast('Delete note functionality coming soon')}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Note 2 */}
                    <div className="py-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">Sarah Johnson</span>
                            <span className="text-sm text-gray-500">Jan 20, 2024, 02:30 PM</span>
                          </div>
                          <p className="text-gray-700">"Final quality inspection completed. All windows passed with excellent results. Ready for client handover."</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button 
                            onClick={() => showToast('Edit note functionality coming soon')}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => showToast('Delete note functionality coming soon')}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Note 3 */}
                    <div className="py-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">Mike Lee</span>
                            <span className="text-sm text-gray-500">Jan 19, 2024, 03:15 PM</span>
                          </div>
                          <p className="text-gray-700">"Reinstallation of windows #12 and #8 completed successfully. Both windows now pass quality standards."</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button 
                            onClick={() => showToast('Edit note functionality coming soon')}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => showToast('Delete note functionality coming soon')}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Note 4 */}
                    <div className="py-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-900">David Chen</span>
                            <span className="text-sm text-gray-500">Jan 18, 2024, 05:30 PM</span>
                          </div>
                          <p className="text-gray-700">"Site cleanup completed. All materials properly disposed and site returned to original condition."</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button 
                            onClick={() => showToast('Edit note functionality coming soon')}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => showToast('Delete note functionality coming soon')}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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

      {/* PDF Viewer Modal */}
      <PDFViewerModal
        isOpen={showPDFModal}
        onClose={() => setShowPDFModal(false)}
        pdfBlob={pdfBlob}
        fileName={`${(project.title || 'Project').replace(/\s+/g, '_')}_Project_Report_${new Date().toISOString().split('T')[0]}.pdf`}
      />
    </div>
  );
};
