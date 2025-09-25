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
  XCircle
} from 'lucide-react';
import { ProjectDetails, MOCK_PROJECT_DETAILS } from '../../types/projectDetails';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { useToast } from '../../../../contexts/ToastContext';
import { UploadTakeOffSheetModal } from '../../components/UploadTakeOffSheetModal';
import { UploadRecutSheetModal } from '../../components/UploadRecutSheetModal';
import { WindowDetailModal } from '../../components/WindowDetailModal';
import { AddEditWindowModal } from '../../components/AddEditWindowModal';
import { QualityCheckFormModal, QualityCheckFormData } from '../../components/QualityCheckFormModal';
import { Window, MOCK_WINDOWS, MOCK_TEAM_MEMBERS } from '../../types/windowManagement';

interface ProjectDetailsQFProps {
  projectStatus?: 'WIP' | 'QF' | 'Completed';
}

export const ProjectDetailsQF: React.FC<ProjectDetailsQFProps> = ({ projectStatus = 'QF' }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('window-management');
  
  // Window Management State - All windows set to completed status
  const [windows, setWindows] = useState<Window[]>(
    MOCK_WINDOWS.map(window => ({ ...window, status: 'Complete' as const }))
  );
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
  const [showQualityCheckModal, setShowQualityCheckModal] = useState(false);
  const [isQualityCheckSigned, setIsQualityCheckSigned] = useState(false);
  const [editingWindow, setEditingWindow] = useState<Window | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<Window | null>(null);
  const [showRecutSheetModal, setShowRecutSheetModal] = useState(false);

  // Quality Check State
  const [qualityChecks, setQualityChecks] = useState([
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
      status: 'failed',
      inspector: 'John Smith',
      checkedAt: '2024-01-20T11:15:00Z',
      notes: 'Minor bubbling detected in corner area',
      issues: ['Air bubbles in corner', 'Edge alignment needs adjustment']
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
      status: 'pending',
      inspector: null,
      checkedAt: null,
      notes: '',
      issues: []
    }
  ]);

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
    progress: 85,
    currentPhase: 'Quality Review',
    estimatedCompletion: '2024-02-15',
    teamOnSite: 5,
    windowsCompleted: 12,
    windowsStarted: 15,
    activityLog: [
      {
        id: '1',
        user: 'John Smith',
        action: 'completed quality inspection for Marriot Windows Installation',
        time: '2 hours ago',
        type: 'completion',
        fileName: null,
        fileSize: null,
        note: '13 out of 15 windows passed quality check'
      },
      {
        id: '2',
        user: 'Sarah Johnson',
        action: 'uploaded quality report for Marriot Windows Installation',
        time: '4 hours ago',
        type: 'document',
        fileName: 'quality-inspection-report.pdf',
        fileSize: '2.1 MB'
      },
      {
        id: '3',
        user: 'Mike Lee',
        action: 'marked 2 windows for reinstallation in Marriot Windows Installation',
        time: '6 hours ago',
        type: 'update',
        fileName: null,
        fileSize: null,
        note: 'Windows #12 and #8 require reinstallation due to quality issues'
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
        note: 'Quality review process initiated'
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
  const handleSignQualityCheckForm = () => {
    setShowQualityCheckModal(true);
  };

  const handleQualityCheckFormSubmit = (formData: QualityCheckFormData) => {
    setIsQualityCheckSigned(true);
    showToast('Quality check form submitted successfully - QF is marked as completed');
    console.log('Quality Check Form Data:', formData);
  };

  const handleEditProject = () => {
    showToast('Edit project functionality coming soon');
  };

  const handleUploadRecutSheet = () => {
    setShowRecutSheetModal(true);
  };

  const handleRecutSheetUploadComplete = (sheet: any) => {
    setShowRecutSheetModal(false);
    showToast('Recut sheet uploaded and processed successfully');
    console.log('Recut Sheet Data:', sheet);
  };

  const handleTakeOffSheetUploadComplete = (sheet: any) => {
    setShowUploadModal(false);
    showToast('Windows created successfully from sheet');
    console.log('Take-off Sheet Data:', sheet);
  };

  const handleAddWindow = () => {
    setEditingWindow(null);
    setShowAddEditModal(true);
  };

  const handleEditWindow = (window: Window) => {
    setEditingWindow(window);
    setShowAddEditModal(true);
  };

  const handleViewWindow = (window: Window) => {
    setSelectedWindow(window);
    setShowWindowDetailModal(true);
  };

  const handleDeleteWindow = (windowId: string) => {
    if (window.confirm('Are you sure you want to remove this window?')) {
      setWindows(prev => prev.filter(w => w.id !== windowId));
      showToast('Window removed successfully');
    }
  };

  const handleSaveWindow = (windowData: Partial<Window>) => {
    if (editingWindow) {
      // Update existing window
      setWindows(prev => prev.map(w => 
        w.id === editingWindow.id 
          ? { ...w, ...windowData, status: 'Updated' as const }
          : w
      ));
      showToast('Window updated successfully');
    } else {
      // Add new window
      const newWindow: Window = {
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
      showToast('Window added successfully');
    }
    setShowAddEditModal(false);
    setEditingWindow(null);
  };

  const handleUpdateWindow = (windowData: Partial<Window>) => {
    if (selectedWindow) {
      setWindows(prev => prev.map(w => 
        w.id === selectedWindow.id 
          ? { ...w, ...windowData, status: 'Updated' as const }
          : w
      ));
      setSelectedWindow({ ...selectedWindow, ...windowData });
      showToast('Window updated successfully');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleQualityCheck = (checkId: string, status: 'passed' | 'failed') => {
    setQualityChecks(prev => prev.map(check => 
      check.id === checkId 
        ? { ...check, status, inspector: 'John Smith', checkedAt: new Date().toISOString() }
        : check
    ));
    showToast(`Quality check ${status}`);
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
                    <span className="px-2 py-1 rounded-md text-sm font-semibold bg-orange-50 text-orange-700">
                      QF
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
                    onClick={handleSignQualityCheckForm}
                    className="px-3 py-2"
                    disabled={isQualityCheckSigned}
                  >
                    {isQualityCheckSigned ? 'QF Signed' : 'Sign Quality Check Form'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleUploadRecutSheet}
                    icon={Upload}
                    className="px-3 py-2"
                  >
                    Add Recut Sheet
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

            {/* Progress Section */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Window Installation Progress
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
                  Current Phase: Installation completed
                </span>
                <span>
                  Project Completed
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
                  { id: 'window-management', label: 'Window Management' },
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
                        ? 'border-orange-600 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'window-management' && (
              <div className="space-y-6">
                
                {/* Window Management Section */}
                <div className="space-y-6">
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
                </div>
              </div>
            )}

            {activeTab === 'issues' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues & Fixes</h3>
                  <div className="space-y-4">
                    {qualityChecks
                      .filter(check => check.status === 'failed')
                      .map((check) => (
                        <div key={check.id} className="p-4 border border-orange-200 rounded-lg">
                          <h4 className="font-medium text-orange-900">{check.windowName}</h4>
                          <p className="text-orange-700 mt-1">{check.notes}</p>
                          {check.issues.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm font-medium text-orange-800">Issues:</p>
                              <ul className="text-sm text-orange-700 list-disc list-inside">
                                {check.issues.map((issue, index) => (
                                  <li key={index}>{issue}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
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

            {activeTab === 'document' && (
              <div className="space-y-6">
                {/* Project Documents Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Project Documents</h3>
                      <p className="text-sm text-gray-500 mt-1">3 documents</p>
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
                    {/* Quality Report */}
                    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs font-medium text-orange-600">QR</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Quality Inspection Report.pdf</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>2.1 MB</span>
                            <span>•</span>
                            <span>Jan 20, 2024, 11:15 AM</span>
                            <span>•</span>
                            <span className="px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs">Sarah Johnson</span>
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
                          onClick={() => showToast('Downloading Site Map - Floor Plan.pdf')}
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
                          onClick={() => showToast('Downloading Architectural Plan.txt')}
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
                      onClick={() => showToast('Upload installation guide functionality coming soon')}
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

            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Project Notes</h3>
                      <p className="text-sm text-gray-500 mt-1">3 notes</p>
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
                            <span className="text-sm text-gray-500">Jan 20, 2024, 11:15 AM</span>
                          </div>
                          <p className="text-gray-700">"Quality inspection completed. 13 windows passed, 2 need reinstallation."</p>
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
                            <span className="font-medium text-gray-900">John Smith</span>
                            <span className="text-sm text-gray-500">Jan 20, 2024, 03:15 PM</span>
                          </div>
                          <p className="text-gray-700">"Client requested additional security measures for the main entrance."</p>
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
                            <span className="font-medium text-gray-900">Maria Will</span>
                            <span className="text-sm text-gray-500">Jan 11, 2024, 03:15 PM</span>
                          </div>
                          <p className="text-gray-700">"Site visit completed. All measurements confirmed."</p>
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
                            <span className="font-semibold text-orange-600 underline">Marriot Windows Installation</span>
                            {activity.action.split('Marriot Windows Installation')[1]}
                          </p>
                          {activity.type === 'document' && activity.fileName && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="w-6 h-6 bg-orange-50 rounded flex items-center justify-center">
                                <FileText className="w-3 h-3 text-orange-600" />
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
        onUploadComplete={handleTakeOffSheetUploadComplete}
      />

      <UploadRecutSheetModal
        isOpen={showRecutSheetModal}
        onClose={() => setShowRecutSheetModal(false)}
        onUploadComplete={handleRecutSheetUploadComplete}
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

      <QualityCheckFormModal
        isOpen={showQualityCheckModal}
        onClose={() => setShowQualityCheckModal(false)}
        onSubmit={handleQualityCheckFormSubmit}
      />
    </div>
  );
};
