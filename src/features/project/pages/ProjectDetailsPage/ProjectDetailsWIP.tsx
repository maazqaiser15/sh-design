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
  Trash2
} from 'lucide-react';
import { ProjectDetails, MOCK_PROJECT_DETAILS } from '../../types/projectDetails';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { useToast } from '../../../../contexts/ToastContext';
import { UploadTakeOffSheetModal } from '../../components/UploadTakeOffSheetModal';
import { WindowDetailModal } from '../../components/WindowDetailModal';
import { AddEditWindowModal } from '../../components/AddEditWindowModal';
import { WindowType, MOCK_WINDOWS, MOCK_TEAM_MEMBERS } from '../../types/windowManagement';

interface ProjectDetailsWIPProps {
  projectStatus?: 'WIP' | 'QF' | 'Completed';
}

export const ProjectDetailsWIP: React.FC<ProjectDetailsWIPProps> = ({ projectStatus = 'WIP' }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('job-brief');
  
  // Window Management State
  const [windows, setWindows] = useState<WindowType[]>(MOCK_WINDOWS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    filmType: 'all',
    status: 'all',
    layers: 'all'
  });
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showWindowDetailModal, setShowWindowDetailModal] = useState(false);
  const [editingWindow, setEditingWindow] = useState<WindowType | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<WindowType | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        // Close all dropdowns
        const dropdowns = document.querySelectorAll('[id^="dropdown-"]');
        dropdowns.forEach(dropdown => {
          dropdown.classList.add('hidden');
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get project data with default values for missing properties
  const project = {
    ...MOCK_PROJECT_DETAILS,
    progress: 75,
    currentPhase: 'Window Installation',
    estimatedCompletion: '2024-02-15',
    teamOnSite: 5,
    windowsCompleted: 12,
    windowsStarted: 15,
    activityLog: [
      {
        id: '1',
        user: 'John Smith',
        action: 'updated Marriot Windows Installation project',
        time: '2 hours ago',
        type: 'update',
        fileName: 'project-update.pdf',
        fileSize: '2.4 MB',
        note: 'All windows have been measured and marked for installation'
      },
      {
        id: '2',
        user: 'Sarah Johnson',
        action: 'uploaded document for Marriot Windows Installation',
        time: '4 hours ago',
        type: 'document',
        fileName: 'site-measurements.pdf',
        fileSize: '1.8 MB'
      },
      {
        id: '3',
        user: 'Mike Lee',
        action: 'completed window installation for Marriot Windows Installation',
        time: '6 hours ago',
        type: 'completion',
        fileName: null,
        fileSize: null,
        note: 'Windows 1-5 successfully installed with BR film'
      },
      {
        id: '4',
        user: 'Emily Rodriguez',
        action: 'uploaded document for Marriot Windows Installation',
        time: '1 day ago',
        type: 'document',
        fileName: 'safety-checklist.pdf',
        fileSize: '0.9 MB'
      },
      {
        id: '5',
        user: 'David Chen',
        action: 'updated Marriot Windows Installation project',
        time: '1 day ago',
        type: 'update',
        fileName: null,
        fileSize: null,
        note: 'Site preparation completed, ready for installation'
      },
      {
        id: '6',
        user: 'Ayesha Khan',
        action: 'uploaded document for Marriot Windows Installation',
        time: '2 days ago',
        type: 'document',
        fileName: 'architectural-plans.pdf',
        fileSize: '3.2 MB'
      }
    ]
  };
  
  // Update project status based on prop
  const currentProject = { ...project, status: projectStatus };

  // Filter windows based on search and filters
  const filteredWindows = windows.filter(window => {
    const matchesSearch = (window.windowName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilmType = filters.filmType === 'all' || window.filmType === filters.filmType;
    const matchesStatus = filters.status === 'all' || window.status === filters.status;
    const matchesLayers = filters.layers === 'all' || (window.layers?.length || 0).toString() === filters.layers;
    
    return matchesSearch && matchesFilmType && matchesStatus && matchesLayers;
  });

  // Handlers
  const handleMarkForQF = () => {
    showToast('Project marked for Quality Review', 'success');
  };

  const handleEditProject = () => {
    showToast('Edit project functionality coming soon', 'info');
  };

  const handleUploadComplete = (newWindows: WindowType[]) => {
    setWindows(prev => [...prev, ...newWindows]);
    setShowUploadModal(false);
    showToast('Windows created successfully from sheet', 'success');
  };

  const handleAddWindow = () => {
    setEditingWindow(null);
    setShowAddEditModal(true);
  };

  const handleEditWindow = (window: WindowType) => {
    setEditingWindow(window);
    setShowAddEditModal(true);
  };

  const handleViewWindow = (window: WindowType) => {
    setSelectedWindow(window);
    setShowWindowDetailModal(true);
  };

  const handleDeleteWindow = (windowId: string) => {
    if (window.confirm('Are you sure you want to remove this window?')) {
      setWindows(prev => prev.filter(w => w.id !== windowId));
      showToast('Window removed successfully', 'success');
    }
  };

  const handleSaveWindow = (windowData: Partial<WindowType>) => {
    if (editingWindow) {
      // Update existing window
      setWindows(prev => prev.map(w => 
        w.id === editingWindow.id 
          ? { ...w, ...windowData, status: 'Updated' as const }
          : w
      ));
      showToast('Window updated successfully', 'success');
    } else {
      // Add new window
      const newWindow: WindowType = {
        id: Date.now().toString(),
        windowName: windowData.windowName || '',
        filmType: windowData.filmType || 'BR',
        length: windowData.length || 0,
        width: windowData.width || 0,
        layers: windowData.layers || [],
        status: 'Pending',
        assignedTeamMembers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        ...windowData
      };
      setWindows(prev => [...prev, newWindow]);
      showToast('Window added successfully', 'success');
    }
    setShowAddEditModal(false);
    setEditingWindow(null);
  };

  const handleUpdateWindow = (windowData: Partial<WindowType>) => {
    if (selectedWindow) {
      setWindows(prev => prev.map(w => 
        w.id === selectedWindow.id 
          ? { ...w, ...windowData, status: 'Updated' as const }
          : w
      ));
      setSelectedWindow({ ...selectedWindow, ...windowData });
      showToast('Window updated successfully', 'success');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-[60px] py-6">
          <div className="flex flex-col gap-6">
            {/* Page Header */}
            <div className="flex flex-col gap-5">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold text-gray-900">
                      Marriot Windows Installation
                    </h1>
                    <span className={`px-2 py-1 rounded-md text-sm font-semibold ${
                      projectStatus === 'WIP' ? 'bg-blue-50 text-blue-700' :
                      projectStatus === 'QF' ? 'bg-orange-50 text-orange-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {projectStatus}
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
                  {projectStatus === 'WIP' && (
                    <Button
                      variant="primary"
                      onClick={handleMarkForQF}
                      className="px-3 py-2"
                    >
                      Mark for QF
                    </Button>
                  )}
                  {projectStatus === 'QF' && (
                    <Button
                      variant="primary"
                      onClick={() => showToast('Project approved for completion', 'success')}
                      className="px-3 py-2"
                    >
                      Approve Completion
                    </Button>
                  )}
                  {projectStatus === 'Completed' && (
                    <Button
                      variant="secondary"
                      onClick={() => showToast('Project completed successfully', 'success')}
                      className="px-3 py-2"
                    >
                      View Report
                    </Button>
                  )}
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

            {/* Progress Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {projectStatus === 'WIP' ? 'Project Progress' :
                   projectStatus === 'QF' ? 'Quality Review Progress' :
                   'Project Completion'}
                </h3>
                <span className="text-sm text-gray-600">
                  {projectStatus === 'WIP' ? `${project.progress}% Complete` :
                   projectStatus === 'QF' ? 'Under Review' :
                   '100% Complete'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    projectStatus === 'WIP' ? 'bg-blue-600' :
                    projectStatus === 'QF' ? 'bg-orange-600' :
                    'bg-green-600'
                  }`}
                  style={{ width: `${projectStatus === 'Completed' ? 100 : project.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                  {projectStatus === 'WIP' ? `Current Phase: ${project.currentPhase}` :
                   projectStatus === 'QF' ? 'Status: Quality Review in Progress' :
                   'Status: Project Completed Successfully'}
                </span>
                <span>
                  {projectStatus === 'WIP' ? `Est. Completion: ${project.estimatedCompletion}` :
                   projectStatus === 'QF' ? 'Review Due: 2 days' :
                   `Completed: ${project.endDate}`}
                </span>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-4 gap-6">
              {projectStatus === 'WIP' ? (
                <>
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-xl font-semibold text-gray-700">{project.teamOnSite}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Team on Site</span>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-xl font-semibold text-gray-700">{project.windowsCompleted}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Windows Completed</span>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-xl font-semibold text-gray-700">{project.windowsStarted}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Windows Started</span>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-xl font-semibold text-gray-700">2</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Issues Reported</span>
                  </div>
                </>
              ) : projectStatus === 'QF' ? (
                <>
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-50 rounded-md flex items-center justify-center">
                        <Search className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-xl font-semibold text-gray-700">15</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Windows Inspected</span>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-50 rounded-md flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-xl font-semibold text-gray-700">13</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Passed Quality Check</span>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-50 rounded-md flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-xl font-semibold text-gray-700">2</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Need Reinstallation</span>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-50 rounded-md flex items-center justify-center">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-xl font-semibold text-gray-700">2</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Days Remaining</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-50 rounded-md flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-xl font-semibold text-gray-700">15</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Total Windows</span>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-50 rounded-md flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-xl font-semibold text-gray-700">15</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Successfully Installed</span>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-50 rounded-md flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-xl font-semibold text-gray-700">14</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Days Duration</span>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-50 rounded-md flex items-center justify-center">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-xl font-semibold text-gray-700">5</span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">Team Members</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-[60px] py-6">
        <div className="flex gap-6">
          {/* Left Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {(projectStatus === 'WIP' ? [
                  { id: 'job-brief', label: 'Window Management' },
                  { id: 'team', label: 'Team' },
                  { id: 'travel-hotel', label: 'Travel & Hotel' },
                  { id: 'document', label: 'Document' },
                  { id: 'notes', label: 'Notes' }
                ] : projectStatus === 'QF' ? [
                  { id: 'quality-check', label: 'Quality Check' },
                  { id: 'issues', label: 'Issues & Fixes' },
                  { id: 'team', label: 'Team' },
                  { id: 'document', label: 'Document' },
                  { id: 'notes', label: 'Notes' }
                ] : [
                  { id: 'completion-report', label: 'Completion Report' },
                  { id: 'final-stats', label: 'Final Stats' },
                  { id: 'team', label: 'Team' },
                  { id: 'document', label: 'Document' },
                  { id: 'notes', label: 'Notes' }
                ]).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
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
            {activeTab === 'job-brief' && (
              <div className="space-y-6">
                
                {/* Window Management Section */}
                <div className="space-y-6">
                  {/* Empty State - Show upload CTA if no windows */}
                  {windows.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No windows yet</h3>
                      <p className="text-gray-600 mb-6">Upload a take-off sheet or add windows manually to get started</p>
                      <div className="flex justify-center gap-3">
                        <Button 
                          variant="primary" 
                          icon={Upload}
                          onClick={() => setShowUploadModal(true)}
                        >
                          Upload Take-off Sheet
                        </Button>
                        <Button 
                          variant="secondary" 
                          icon={Plus}
                          onClick={handleAddWindow}
                        >
                          Add Window Manually
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Window Management Header */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-semibold text-gray-900">Window Management</h3>
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="primary" 
                              icon={Upload}
                              onClick={() => setShowUploadModal(true)}
                            >
                              Upload Sheet
                            </Button>
                            <Button 
                              variant="primary" 
                              icon={Plus}
                              onClick={handleAddWindow}
                            >
                              Add Window
                            </Button>
                          </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              placeholder="Search by window name"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <select
                            value={filters.filmType}
                            onChange={(e) => handleFilterChange('filmType', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="all">All Film Types</option>
                            <option value="BR">BR</option>
                            <option value="Riot">Riot</option>
                            <option value="Riot+">Riot+</option>
                          </select>

                          <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Updated">Updated</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Complete">Complete</option>
                            <option value="Reinstallation Needed">Reinstallation Needed</option>
                          </select>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewMode('list')}
                              className={`p-2 rounded-lg ${
                                viewMode === 'list' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <List className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setViewMode('grid')}
                              className={`p-2 rounded-lg ${
                                viewMode === 'grid' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <Grid className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Windows List/Grid */}
                        {filteredWindows.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-500">No windows found matching your criteria</p>
                          </div>
                        ) : viewMode === 'list' ? (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="text-left py-3 px-4 font-medium text-gray-900">WINDOW NAME</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-900">FILM TYPE</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-900">DIMENSIONS</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-900">LAYERS</th>
                                  <th className="text-left py-3 px-4 font-medium text-gray-900">STATUS</th>
                                  <th className="text-right py-3 px-4 font-medium text-gray-900">ACTIONS</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredWindows.map((window) => (
                                  <tr key={window.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4">
                                      <div>
                                        <div className="font-medium text-gray-900">{window.windowName}</div>
                                        <div className="text-sm text-gray-500">Created {window.createdAt?.toLocaleDateString() || 'Unknown'}</div>
                                      </div>
                                    </td>
                                    <td className="py-4 px-4">
                                      <span className="text-blue-600 font-medium">{window.filmType}</span>
                                    </td>
                                    <td className="py-4 px-4 text-gray-900">{window.length} x {window.width} cm</td>
                                    <td className="py-4 px-4 text-gray-900">{window.layers.length}</td>
                                    <td className="py-4 px-4">
                                      <StatusBadge status={window.status} />
                                    </td>
                                    <td className="py-4 px-4">
                                      <div className="flex items-center justify-end">
                                        <div className="relative dropdown-container">
                                          <button 
                                            onClick={() => {
                                              // Toggle dropdown for this specific window
                                              const dropdown = document.getElementById(`dropdown-${window.id}`);
                                              if (dropdown) {
                                                dropdown.classList.toggle('hidden');
                                              }
                                            }}
                                            className="text-gray-400 hover:text-gray-600 p-1"
                                          >
                                            <MoreVertical className="w-4 h-4" />
                                          </button>
                                          <div 
                                            id={`dropdown-${window.id}`}
                                            className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                          >
                                            <div className="py-1">
                                              <button
                                                onClick={() => {
                                                  handleViewWindow(window);
                                                  document.getElementById(`dropdown-${window.id}`)?.classList.add('hidden');
                                                }}
                                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                              >
                                                <Eye className="w-4 h-4" />
                                                View Details
                                              </button>
                                              <button
                                                onClick={() => {
                                                  handleEditWindow(window);
                                                  document.getElementById(`dropdown-${window.id}`)?.classList.add('hidden');
                                                }}
                                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                              >
                                                <Edit className="w-4 h-4" />
                                                Edit Window
                                              </button>
                                              <button
                                                onClick={() => {
                                                  handleDeleteWindow(window.id);
                                                  document.getElementById(`dropdown-${window.id}`)?.classList.add('hidden');
                                                }}
                                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                              >
                                                <Trash2 className="w-4 h-4" />
                                                Delete Window
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredWindows.map((window) => (
                              <Card key={window.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewWindow(window)}>
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{window.windowName}</h4>
                                    <p className="text-sm text-gray-500">Created {window.createdAt?.toLocaleDateString() || 'Unknown'}</p>
                                  </div>
                                  <StatusBadge status={window.status} />
                                </div>
                                <div className="space-y-2 text-sm text-gray-600">
                                  <div>Film Type: {window.filmType}</div>
                                  <div>Dimensions: {window.length} x {window.width} cm</div>
                                  <div>Layers: {window.layers.length}</div>
                                </div>
                                <div className="flex items-center justify-end mt-4">
                                  <div className="relative dropdown-container">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const dropdown = document.getElementById(`dropdown-grid-${window.id}`);
                                        if (dropdown) {
                                          dropdown.classList.toggle('hidden');
                                        }
                                      }}
                                      className="text-gray-400 hover:text-gray-600 p-1"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                    <div 
                                      id={`dropdown-grid-${window.id}`}
                                      className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                    >
                                      <div className="py-1">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewWindow(window);
                                            document.getElementById(`dropdown-grid-${window.id}`)?.classList.add('hidden');
                                          }}
                                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                          <Eye className="w-4 h-4" />
                                          View Details
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditWindow(window);
                                            document.getElementById(`dropdown-grid-${window.id}`)?.classList.add('hidden');
                                          }}
                                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                          <Edit className="w-4 h-4" />
                                          Edit Window
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteWindow(window.id);
                                            document.getElementById(`dropdown-grid-${window.id}`)?.classList.add('hidden');
                                          }}
                                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                          Delete Window
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        )}

                        {/* Pagination */}
                        {filteredWindows.length > 0 && (
                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-2">
                              <Button variant="secondary" size="sm" icon={ArrowLeft}>
                                Previous
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">1</span>
                              <span className="px-3 py-1 text-gray-600 text-sm">2</span>
                              <span className="px-3 py-1 text-gray-600 text-sm">3</span>
                              <span className="px-3 py-1 text-gray-600 text-sm">...</span>
                              <span className="px-3 py-1 text-gray-600 text-sm">8</span>
                              <span className="px-3 py-1 text-gray-600 text-sm">9</span>
                              <span className="px-3 py-1 text-gray-600 text-sm">10</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="secondary" size="sm" icon={ArrowRight}>
                                Next
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'John Smith', role: 'Lead Supervisor', phone: '+1-555-0123' },
                      { name: 'Ayesha Khan', role: 'Crew Leader', phone: '+1-555-0124' },
                      { name: 'Mike Lee', role: 'Senior Installer', phone: '+1-555-0125' },
                      { name: 'Sarah Johnson', role: 'Installer', phone: '+1-555-0126' },
                      { name: 'David Chen', role: 'Installer', phone: '+1-555-0127' },
                      { name: 'Emily Rodriguez', role: 'Safety Coordinator', phone: '+1-555-0128' }
                    ].map((member, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
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
                          {member.phone}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'travel-hotel' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel & Hotel</h3>
                  <div className="space-y-6">
                    {/* Travel Details Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Travel details</h4>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Lahore → Miami</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span>2 attachments</span>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Hotel Reservation Details Section */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Hotel Reservation Details</h4>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">Hotel Picaso · Sep 25 → Sep 26, 2025</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span>3 attachments</span>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
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
                      <p className="text-sm text-gray-500 mt-1">2 documents</p>
                    </div>
                    <Button
                      variant="secondary"
                      icon={Upload}
                      onClick={() => showToast('Upload document functionality coming soon', 'info')}
                      className="px-4 py-2"
                    >
                      Upload document
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Document 1 */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">DOC</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Site Map - Floor Plan.pdf</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>1.95 MB</span>
                            <span>•</span>
                            <span>Jan 15, 2024, 02:00 PM</span>
                            <span>•</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">John Doe</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => showToast('Downloading Site Map - Floor Plan.pdf', 'info')}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => showToast('Delete document functionality coming soon', 'info')}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Document 2 */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">TXT</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Architectural Plan.txt</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>1.95 MB</span>
                            <span>•</span>
                            <span>Jan 15, 2024, 02:00 PM</span>
                            <span>•</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">Ema Will</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => showToast('Downloading Architectural Plan.txt', 'info')}
                          className="p-2 text-gray-400 hover:text-gray-600"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => showToast('Delete document functionality coming soon', 'info')}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Installation Guides Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Installation Guides</h3>
                      <p className="text-sm text-gray-500 mt-1">Step-by-step installation procedures</p>
                    </div>
                    <Button
                      variant="secondary"
                      icon={Upload}
                      onClick={() => showToast('Upload installation guide functionality coming soon', 'info')}
                      className="px-4 py-2"
                    >
                      Upload document
                    </Button>
                  </div>
                  
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No installation guides uploaded yet</p>
                    <p className="text-sm text-gray-400 mt-1">Upload guides to help your team with installation procedures</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'quality-check' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Check Results</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">Passed Quality Check</h4>
                      <p className="text-green-700 mt-1">13 out of 15 windows passed quality inspection</p>
                    </div>
                    <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                      <h4 className="font-medium text-orange-900">Needs Reinstallation</h4>
                      <p className="text-orange-700 mt-1">2 windows require reinstallation due to minor defects</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">Quality Inspector</h4>
                      <p className="text-gray-600 mt-1">John Smith - Senior Quality Inspector</p>
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
                    <div className="p-4 border border-orange-200 rounded-lg">
                      <h4 className="font-medium text-orange-900">Window #12 - Minor Bubbling</h4>
                      <p className="text-orange-700 mt-1">Small air bubbles detected in corner area. Requires reinstallation.</p>
                    </div>
                    <div className="p-4 border border-orange-200 rounded-lg">
                      <h4 className="font-medium text-orange-900">Window #8 - Edge Alignment</h4>
                      <p className="text-orange-700 mt-1">Film edge not properly aligned. Needs adjustment.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'completion-report' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Completion Report</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">Project Successfully Completed</h4>
                      <p className="text-green-700 mt-1">All 15 windows installed and quality approved</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">Final Statistics</h4>
                      <p className="text-gray-600 mt-1">Duration: 14 days | Team: 5 members | Quality Score: 98%</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">Client Satisfaction</h4>
                      <p className="text-gray-600 mt-1">Client feedback: Excellent work quality and timely completion</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'final-stats' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Final Project Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">Total Windows</h4>
                      <p className="text-2xl font-bold text-gray-700 mt-1">15</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">Success Rate</h4>
                      <p className="text-2xl font-bold text-green-600 mt-1">100%</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">Project Duration</h4>
                      <p className="text-2xl font-bold text-gray-700 mt-1">14 days</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900">Team Members</h4>
                      <p className="text-2xl font-bold text-gray-700 mt-1">5</p>
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
                      <p className="text-sm text-gray-500 mt-1">2 notes</p>
                    </div>
                    <button 
                      onClick={() => showToast('Add note functionality coming soon', 'info')}
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
                            <span className="text-sm text-gray-500">Jan 20, 2024, 03:15 PM</span>
                          </div>
                          <p className="text-gray-700">"Client requested additional security measures for the main entrance."</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button 
                            onClick={() => showToast('Edit note functionality coming soon', 'info')}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => showToast('Delete note functionality coming soon', 'info')}
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
                            <span className="font-medium text-gray-900">Maria Will</span>
                            <span className="text-sm text-gray-500">Jan 11, 2024, 03:15 PM</span>
                          </div>
                          <p className="text-gray-700">"Site visit completed. All measurements confirmed."</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button 
                            onClick={() => showToast('Edit note functionality coming soon', 'info')}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => showToast('Delete note functionality coming soon', 'info')}
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
                            <span className="font-semibold text-blue-600 underline">Marriot Windows Installation</span>
                            {activity.action.split('Marriot Windows Installation')[1]}
                          </p>
                          {activity.type === 'document' && activity.fileName && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-50 rounded flex items-center justify-center">
                                <FileText className="w-3 h-3 text-blue-600" />
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

      {/* Modals */}
      <UploadTakeOffSheetModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={handleUploadComplete}
      />

      <AddEditWindowModal
        isOpen={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        windowItem={editingWindow}
        onSave={handleSaveWindow}
      />

      <WindowDetailModal
        isOpen={showWindowDetailModal}
        onClose={() => setShowWindowDetailModal(false)}
        windowItem={selectedWindow}
        onUpdate={handleUpdateWindow}
      />
    </div>
  );
};