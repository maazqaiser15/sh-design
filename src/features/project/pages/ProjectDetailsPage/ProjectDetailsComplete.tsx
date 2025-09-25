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
  Star
} from 'lucide-react';
import { ProjectDetails, MOCK_PROJECT_DETAILS } from '../../types/projectDetails';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { useToast } from '../../../../contexts/ToastContext';

interface ProjectDetailsCompleteProps {
  projectStatus?: 'WIP' | 'QF' | 'Completed';
}

export const ProjectDetailsComplete: React.FC<ProjectDetailsCompleteProps> = ({ projectStatus = 'Completed' }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('project-report');
  
  // Project Report Data
  const [projectReport] = useState({
    totalHoursSpent: 320,
    totalPeopleWorked: 5,
    windowLayersReinstalled: 2,
    sheetLayersInstalled: 45,
    teamMembers: [
      {
        id: '1',
        name: 'John Smith',
        role: 'Lead Supervisor',
        hoursWorked: 80,
        performance: 'Excellent',
        rating: 5,
        tasksCompleted: 15,
        qualityScore: 98
      },
      {
        id: '2',
        name: 'Ayesha Khan',
        role: 'Crew Leader',
        hoursWorked: 75,
        performance: 'Very Good',
        rating: 4.5,
        tasksCompleted: 12,
        qualityScore: 95
      },
      {
        id: '3',
        name: 'Mike Lee',
        role: 'Senior Installer',
        hoursWorked: 70,
        performance: 'Good',
        rating: 4,
        tasksCompleted: 10,
        qualityScore: 92
      },
      {
        id: '4',
        name: 'Sarah Johnson',
        role: 'Installer',
        hoursWorked: 65,
        performance: 'Very Good',
        rating: 4.5,
        tasksCompleted: 8,
        qualityScore: 94
      },
      {
        id: '5',
        name: 'David Chen',
        role: 'Installer',
        hoursWorked: 60,
        performance: 'Good',
        rating: 4,
        tasksCompleted: 7,
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
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-md font-semibold">
                      Project ID: {project.id}
                    </span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{project.startDate} - {project.endDate}</span>
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
                    <div className="w-8 h-8 bg-orange-50 rounded-md flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-xl font-semibold text-gray-700">{projectReport.windowLayersReinstalled}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">Window Layers Reinstalled</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xl font-semibold text-gray-700">{projectReport.sheetLayersInstalled}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">Sheet Layers Installed</span>
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
                  Completed on {project.endDate}
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
                          variant="secondary" 
                          icon={Download}
                          onClick={() => showToast('Downloading project report...')}
                        >
                          Download Report
                        </Button>
                      </div>
                    </div>

                    {/* Project Statistics */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900">Project Metrics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Total Hours Spent</span>
                            <span className="font-semibold text-gray-900">{projectReport.totalHoursSpent} hours</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Total People Worked</span>
                            <span className="font-semibold text-gray-900">{projectReport.totalPeopleWorked} people</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Window Layers Reinstalled</span>
                            <span className="font-semibold text-orange-600">{projectReport.windowLayersReinstalled} layers</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Sheet Layers Installed</span>
                            <span className="font-semibold text-blue-600">{projectReport.sheetLayersInstalled} layers</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900">Quality Summary</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Windows Passed QC</span>
                            <span className="font-semibold text-green-600">{passedChecks} windows</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Windows Failed QC</span>
                            <span className="font-semibold text-red-600">{failedChecks} windows</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Success Rate</span>
                            <span className="font-semibold text-green-600">100%</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Average Quality Score</span>
                            <span className="font-semibold text-blue-600">94.8%</span>
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
                                <p className="text-sm text-gray-600">Hours</p>
                                <p className="font-semibold text-gray-900">{member.hoursWorked}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Tasks</p>
                                <p className="font-semibold text-gray-900">{member.tasksCompleted}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Quality</p>
                                <p className="font-semibold text-gray-900">{member.qualityScore}%</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Rating</p>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="font-semibold text-gray-900">{member.rating}</span>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-600">Performance</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  member.performance === 'Excellent' ? 'bg-green-100 text-green-800' :
                                  member.performance === 'Very Good' ? 'bg-blue-100 text-blue-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {member.performance}
                                </span>
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
                          {member.hoursWorked} hours worked
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900">{member.rating}</span>
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
                  {project.activityLog.map((activity) => (
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
    </div>
  );
};
