import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Truck, 
  FileText, 
  CheckCircle2, 
  CheckCircle,
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
  Square,
  Layers,
  ArrowRight,
  Grid,
  List,
  Upload,
  Trash2,
  Settings,
  Package,
  ClipboardCheck,
  FileCheck
} from 'lucide-react';
import { ProjectDetails, MOCK_PROJECT_DETAILS, ProjectNote } from '../../types/projectDetails';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { useToast } from '../../../../contexts/ToastContext';
import { WindowDetailModal } from '../../components/WindowDetailModal';
import { AddEditWindowModal } from '../../components/AddEditWindowModal';
import { ProjectNotes } from '../../components/ProjectNotes';
import { Window, TakeOffSheet, MOCK_WINDOWS, MOCK_TEAM_MEMBERS, LayerInstallation, FilmType, WindowStatus } from '../../types/windowManagement';
import { useAuth } from '../../../../contexts/AuthContext';
import { useSidebar } from '../../../../contexts/SidebarContext';
import { ROLE3_MOCK_WINDOWS } from '../../data/role3MockWindows';
import { MobileWindowsConfiguration } from '../../components/MobileWindowsConfiguration';
import { QualityCheckFormModal, QualityCheckFormData } from '../../components/QualityCheckFormModal';
import { AddUsageModal, InventoryItem } from '../../components/AddUsageModal';
import { UpdateTrailerModal } from '../../components/UpdateTrailerModal';
import { Trailer } from '../../../../types';
import { EXPANDED_TRAILER_DATA } from '../../../../pages/Trailers/expandedTrailerData';

interface ProjectDetailsWIPProps {
  projectStatus?: 'WIP' | 'QF' | 'Completed';
}

// Inline Setup Windows Form Component
export interface WindowRow {
  id: string;
  windowLabel: string;
  width: number;
  length: number;
  product: string;
  interiorLayer: number;
  exteriorLayer: number;
  color: string;
  tint: string;
  stripping: boolean;
}

export interface SetupWindowsData {
  windows: WindowRow[];
}

export interface BuildingRow {
  id: string;
  buildingName: string;
  width: number;
  length: number;
  product: string;
  interiorLayer: number;
  exteriorLayer: number;
  color: string;
  tint: string;
  stripping: boolean;
}

export interface SetupBuildingsData {
  buildings: BuildingRow[];
}

interface SetupBuildingsFormProps {
  onSave: (data: SetupBuildingsData) => void;
  onCancel: () => void;
}

const PRODUCTS = [
  'SW450SR',
  'SW600FE',
  'SW440RC',
  'SW600RC',
  'SW600RC+',
  'SW600BR',
  'Tint Only',
  'Kevlar'
];

const COLORS = ['Black', 'White'];
const TINTS = ['None', 'Light', 'Dark'];
const LAYER_OPTIONS = [1, 2, 3, 4];


// Setup Buildings Form Component
const SetupBuildingsForm: React.FC<SetupBuildingsFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState<SetupBuildingsData>({
    buildings: [
      {
        id: '1',
        buildingName: 'Building 1',
        width: 2,
        length: 2,
        product: 'SW450SR',
        interiorLayer: 2,
        exteriorLayer: 3,
        color: 'Black',
        tint: 'None',
        stripping: false
      }
    ]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleBuildingChange = (buildingId: string, field: keyof BuildingRow, value: any) => {
    setFormData((prev: SetupBuildingsData) => ({
      ...prev,
      buildings: prev.buildings.map((building: BuildingRow) => 
        building.id === buildingId 
          ? { ...building, [field]: value }
          : building
      )
    }));
  };

  const addBuilding = () => {
    const newId = (formData.buildings.length + 1).toString();
    const newBuilding: BuildingRow = {
      id: newId,
      buildingName: `Building ${formData.buildings.length + 1}`,
      width: 2,
      length: 2,
      product: 'SW450SR',
      interiorLayer: 1,
      exteriorLayer: 1,
      color: 'Black',
      tint: 'None',
      stripping: false
    };

    setFormData((prev: SetupBuildingsData) => ({
      ...prev,
      buildings: [...prev.buildings, newBuilding]
    }));
  };

  const removeBuilding = (buildingId: string) => {
    if (formData.buildings.length > 1) {
      setFormData((prev: SetupBuildingsData) => ({
        ...prev,
        buildings: prev.buildings.filter((building: BuildingRow) => building.id !== buildingId)
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.buildings.length === 0) {
      newErrors.buildings = 'At least one building is required';
    }
    
    formData.buildings.forEach((building: BuildingRow, index: number) => {
      if (!building.buildingName.trim()) {
        newErrors[`building-${index}-name`] = 'Building name is required';
      }
      if (building.width <= 0) {
        newErrors[`building-${index}-width`] = 'Width must be greater than 0';
      }
      if (building.length <= 0) {
        newErrors[`building-${index}-length`] = 'Length must be greater than 0';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Building Name Input */}
      <div className="space-y-2">
        <label htmlFor="building-name" className="block text-sm font-medium text-gray-700">
          Building Name
        </label>
        <input
          type="text"
          id="building-name"
          placeholder="Enter building name (e.g., Main Building, Office Block, etc.)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>

      {/* Buildings Table */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Buildings Configuration</h3>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              icon={Plus}
              onClick={addBuilding}
              className="text-sm"
            >
              Add Building
            </Button>
          </div>
        </div>

        {errors.buildings && (
          <p className="text-sm text-red-600">{errors.buildings}</p>
        )}

        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full divide-y divide-gray-200 text-sm table-fixed">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Width</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Length</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interior</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exterior</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tint</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stripping</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.buildings.map((building, index) => (
                  <tr key={building.id} className="hover:bg-gray-50">
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={building.buildingName}
                        onChange={(e) => handleBuildingChange(building.id, 'buildingName', e.target.value)}
                        className={`w-full px-2 py-1 border rounded text-sm ${
                          errors[`building-${index}-name`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors[`building-${index}-name`] && (
                        <p className="text-xs text-red-500 mt-0.5">{errors[`building-${index}-name`]}</p>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        value={building.width}
                        onChange={(e) => handleBuildingChange(building.id, 'width', parseFloat(e.target.value) || 0)}
                        className={`w-full px-2 py-1 border rounded text-sm ${
                          errors[`building-${index}-width`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="0"
                        step="0.1"
                      />
                      {errors[`building-${index}-width`] && (
                        <p className="text-xs text-red-500 mt-0.5">{errors[`building-${index}-width`]}</p>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        value={building.length}
                        onChange={(e) => handleBuildingChange(building.id, 'length', parseFloat(e.target.value) || 0)}
                        className={`w-full px-2 py-1 border rounded text-sm ${
                          errors[`building-${index}-length`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                        min="0"
                        step="0.1"
                      />
                      {errors[`building-${index}-length`] && (
                        <p className="text-xs text-red-500 mt-0.5">{errors[`building-${index}-length`]}</p>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <select
                        value={building.product}
                        onChange={(e) => handleBuildingChange(building.id, 'product', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {PRODUCTS.map(product => (
                          <option key={product} value={product}>{product}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2">
                      <select
                        value={building.interiorLayer}
                        onChange={(e) => handleBuildingChange(building.id, 'interiorLayer', parseInt(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {LAYER_OPTIONS.map(layer => (
                          <option key={layer} value={layer}>{layer}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2">
                      <select
                        value={building.exteriorLayer}
                        onChange={(e) => handleBuildingChange(building.id, 'exteriorLayer', parseInt(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {LAYER_OPTIONS.map(layer => (
                          <option key={layer} value={layer}>{layer}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2">
                      <select
                        value={building.color}
                        onChange={(e) => handleBuildingChange(building.id, 'color', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {COLORS.map(color => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2">
                      <select
                        value={building.tint}
                        onChange={(e) => handleBuildingChange(building.id, 'tint', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        {TINTS.map(tint => (
                          <option key={tint} value={tint}>{tint}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={building.stripping}
                          onChange={(e) => handleBuildingChange(building.id, 'stripping', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex justify-center">
                        <button
                          onClick={() => removeBuilding(building.id)}
                          disabled={formData.buildings.length === 1}
                          className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <Button
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
        >
          Setup Buildings
        </Button>
      </div>
    </div>
  );
};

export const ProjectDetailsWIP: React.FC<ProjectDetailsWIPProps> = ({ projectStatus: initialProjectStatus = 'WIP' }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // State for project status
  const [projectStatus, setProjectStatus] = useState<'WIP' | 'QF' | 'Completed'>(initialProjectStatus);
  const { user } = useAuth();
  const { isMobile } = useSidebar();
  const [activeTab, setActiveTab] = useState('job-brief');
  
  // Notes State
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  
  // Window Management State
  const [windows, setWindows] = useState<Window[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    filmType: 'all',
    status: 'all',
    layers: 'all',
    building: 'all'
  });
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Force grid view on mobile
  useEffect(() => {
    if (isMobile) {
      setViewMode('grid');
    }
  }, [isMobile]);

  // Modal State
  const [showQualityCheckModal, setShowQualityCheckModal] = useState(false);
  const [showAddUsageModal, setShowAddUsageModal] = useState(false);
  const [showUpdateTrailerModal, setShowUpdateTrailerModal] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState<Trailer | null>(null);
  const [trailers, setTrailers] = useState<Trailer[]>(EXPANDED_TRAILER_DATA);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showWindowDetailModal, setShowWindowDetailModal] = useState(false);
  const [editingWindow, setEditingWindow] = useState<Window | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<Window | null>(null);
  const [updateCounter, setUpdateCounter] = useState(0);
  
  // Card completion states
  const [isTrailerUpdated, setIsTrailerUpdated] = useState(false);
  const [isInventoryUpdated, setIsInventoryUpdated] = useState(false);
  const [isQualityFormSigned, setIsQualityFormSigned] = useState(false);
  
  // Setup Windows State
  const [showInlineSetup, setShowInlineSetup] = useState(false);
  const [isCreatingWindows, setIsCreatingWindows] = useState(false);
  const [windowsSetup, setWindowsSetup] = useState(false);

  // Setup Buildings State
  const [showBuildingsForm, setShowBuildingsForm] = useState(false);
  const [isCreatingBuildings, setIsCreatingBuildings] = useState(false);
  const [buildingsSetup, setBuildingsSetup] = useState(false);

  // Calculate window status based on layer statuses
  const calculateWindowStatus = (layers: LayerInstallation[]): WindowStatus => {
    const allInstalled = layers.every(layer => layer.status === 'Installed');
    const hasReinstall = layers.some(layer => layer.status === 'Reinstallation Needed');
    const hasInProgress = layers.some(layer => layer.status === 'In Progress');
    const allPending = layers.every(layer => layer.status === 'Pending');

    if (hasReinstall) {
      return 'Reinstallation Needed';
    } else if (allInstalled) {
      return 'Complete';
    } else if (hasInProgress) {
      return 'In Progress';
    } else {
      return 'Pending';
    }
  };

  // Initialize windows based on user role
  useEffect(() => {
    if (user?.userType === 'execution-team') {
      // Role 3: Show 15 mock windows directly, skip setup
      // Calculate proper status for each window based on layer statuses
      const windowsWithCalculatedStatus = ROLE3_MOCK_WINDOWS.map(window => ({
        ...window,
        status: calculateWindowStatus(window.layers)
      }));
      setWindows(windowsWithCalculatedStatus);
      setWindowsSetup(true); // Mark as setup to skip setup interface
    } else {
      // Other roles (including Role 4 Lead Supervisor): Use existing logic with Windows Configuration
      if (!windowsSetup && !isCreatingWindows && windows.length === 0) {
        setShowInlineSetup(true);
      } else {
        setShowInlineSetup(false);
      }
    }
  }, [user?.userType, windowsSetup, isCreatingWindows, windows.length]);

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

  // Calculate project progress based on window completion
  const calculateProjectProgress = (windows: Window[]) => {
    if (windows.length === 0) return 0;
    
    const completedWindows = windows.filter(w => w.status === 'Complete').length;
    const totalWindows = windows.length;
    
    return Math.round((completedWindows / totalWindows) * 100);
  };

  // Calculate project metrics
  const calculateProjectMetrics = (windows: Window[]) => {
    // Return fixed values as requested
    return {
      completed: 10, // Windows Completed
      started: 24, // Windows Started
      reinstallation: 4, // Issues Reported
      total: 300, // Total Windows
      totalLayers: 340, // Total Layers
      completedLayers: 40 // Layers Completed
    };
  };

  // Calculate dynamic project metrics
  const projectMetrics = calculateProjectMetrics(windows);
  const projectProgress = calculateProjectProgress(windows);

  // Get project data with dynamic values based on window status
  const project = {
    ...MOCK_PROJECT_DETAILS,
    progress: projectProgress,
    currentPhase: projectProgress === 100 ? 'Project Completed' : 
                  projectProgress > 0 ? 'Window Installation' : 'Ready to Start',
    estimatedCompletion: '2024-02-15',
    teamOnSite: 4, // Team Assigned: 4
    windowsCompleted: 10, // Windows Completed: 10/300
    windowsStarted: 24, // Windows Started
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

  // Helper function to calculate interior and exterior counts from layers
  const calculateLayerCounts = (layers: any[]) => {
    const interiorCount = layers.filter(layer => 
      layer.layerName?.toLowerCase().includes('interior')
    ).length;
    const exteriorCount = layers.filter(layer => 
      layer.layerName?.toLowerCase().includes('exterior')
    ).length;
    return { interiorCount, exteriorCount };
  };

  // Filter windows based on search and filters
  const filteredWindows = windows.filter(window => {
    const matchesSearch = (window.windowName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilmType = filters.filmType === 'all' || window.filmType === filters.filmType;
    const matchesStatus = filters.status === 'all' || window.status === filters.status;
    const matchesLayers = filters.layers === 'all' || (window.layers?.length || 0).toString() === filters.layers;
    const matchesBuilding = filters.building === 'all' || (window.buildingName || 'Main Building') === filters.building;
    
    return matchesSearch && matchesFilmType && matchesStatus && matchesLayers && matchesBuilding;
  });

  // Handlers
  const handleMarkForQF = () => {
    setProjectStatus('QF');
    showToast('Project marked for Quality Review');
  };

  // Modal handlers
  const handleSignQualityCheckForm = () => {
    setShowQualityCheckModal(true);
  };

  const handleQualityCheckFormSubmit = (formData: QualityCheckFormData) => {
    setShowQualityCheckModal(false);
    setIsQualityFormSigned(true);
    showToast('Quality check form submitted successfully');
    console.log('Quality Check Form Data:', formData);
  };

  const handleAddUsage = () => {
    setShowAddUsageModal(true);
  };

  const handleUsageSubmit = (usageData: InventoryItem[]) => {
    setShowAddUsageModal(false);
    setIsInventoryUpdated(true);
    showToast('Usage data added successfully');
    console.log('Usage Data:', usageData);
  };

  const handleUpdateTrailer = () => {
    // For now, select the first available trailer
    // In a real app, this would open a trailer selection modal
    const availableTrailer = trailers.find(t => t.status === 'available') || trailers[0];
    setSelectedTrailer(availableTrailer);
    setShowUpdateTrailerModal(true);
  };

  const handleTrailerUpdate = (updatedTrailer: Omit<Trailer, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedTrailer) {
      const updatedTrailers = trailers.map(t => 
        t.id === selectedTrailer.id 
          ? { ...t, ...updatedTrailer, updatedAt: new Date().toISOString() }
          : t
      );
      setTrailers(updatedTrailers);
      showToast('Trailer updated successfully');
      setShowUpdateTrailerModal(false);
      setSelectedTrailer(null);
      setIsTrailerUpdated(true);
    }
  };


  // Note handlers
  const handleAddNote = (content: string, isInternal: boolean) => {
    const newNote: ProjectNote = {
      id: `note-${Date.now()}`,
      content,
      author: user?.name || 'Current User',
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: projectId || '',
      isInternal
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



  const handleAddWindow = () => {
    setEditingWindow(null);
    setShowAddEditModal(true);
  };

  // Setup Windows Handlers
  const handleSetupSave = async (data: SetupWindowsData) => {
    setShowInlineSetup(false);
    setIsCreatingWindows(true);
    
    // Simulate API call to create windows
    setTimeout(() => {
      // Generate windows based on the table data
      const generatedWindows: Window[] = data.windows.map((windowRow, index) => {
        const randomStatus = ['Pending', 'In Progress', 'Complete'][Math.floor(Math.random() * 3)] as 'Pending' | 'In Progress' | 'Complete';
        
        // Generate layer installations based on interior and exterior layers
        const layerInstallations: LayerInstallation[] = [];
        const totalLayers = windowRow.interiorLayer + windowRow.exteriorLayer;
        
        for (let j = 1; j <= totalLayers; j++) {
          const isInterior = j <= windowRow.interiorLayer;
          layerInstallations.push({
            layerNumber: j,
            layerName: `${isInterior ? 'Interior' : 'Exterior'} Layer ${isInterior ? j : j - windowRow.interiorLayer}`,
            status: Math.random() > 0.5 ? 'Installed' : 'Pending',
            installedBy: Math.random() > 0.5 ? 'John Doe' : undefined,
            installedAt: Math.random() > 0.5 ? new Date() : undefined,
            notes: isInterior ? `Interior layer ${j}` : `Exterior layer ${j - windowRow.interiorLayer}`
          });
        }
        
        // Map product to film type
        const productToFilmType: Record<string, FilmType> = {
          'SW450SR': 'BR',
          'SW600FE': 'Riot',
          'SW440RC': 'Riot +',
          'SW600RC': 'Riot',
          'SW600RC+': 'Riot +',
          'SW600BR': 'BR',
          'Tint Only': 'PER',
          'Kevlar': 'Custom'
        };
        
        // Assign building names randomly
        const buildingNames = ['Main Building', 'Office Block', 'Warehouse', 'Annex'];
        const randomBuilding = buildingNames[Math.floor(Math.random() * buildingNames.length)];
        
        return {
          id: `window-${index + 1}`,
          windowName: windowRow.windowLabel,
          filmType: productToFilmType[windowRow.product] || 'BR',
          length: windowRow.length,
          width: windowRow.width,
          layers: layerInstallations,
          status: randomStatus,
          assignedTeamMembers: Math.random() > 0.5 ? ['John Doe', 'Jane Smith'] : ['Mike Johnson'],
          createdAt: new Date(),
          updatedAt: new Date(),
          createdFromSheet: true,
          interiorCount: windowRow.interiorLayer,
          exteriorCount: windowRow.exteriorLayer,
          buildingName: randomBuilding
        };
      });
      
      setWindows(generatedWindows);
      setWindowsSetup(true);
      setIsCreatingWindows(false);
      showToast(`Successfully created ${data.windows.length} windows`);
    }, 2000); // 2 second loading simulation
  };

  // Setup Buildings Handlers
  const handleBuildingsSave = async (data: SetupBuildingsData) => {
    setShowBuildingsForm(false);
    setIsCreatingBuildings(true);
    
    // Simulate API call to create buildings
    setTimeout(() => {
      setBuildingsSetup(true);
      setIsCreatingBuildings(false);
      showToast(`Successfully created ${data.buildings.length} buildings`);
    }, 2000); // 2 second loading simulation
  };

  const handleAddBuilding = () => {
    setShowBuildingsForm(true);
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

  const handleStartWorking = (window: Window) => {
    // Update window status to "In Progress" and add current user to assigned team
    const updatedWindow = {
      ...window,
      status: 'In Progress' as WindowStatus,
      assignedTeamMembers: [...window.assignedTeamMembers, user?.name || 'Current User'],
      updatedAt: new Date()
    };
    
    setWindows(prev => prev.map(w => 
      w.id === window.id ? updatedWindow : w
    ));
    
    // Update selectedWindow if it's the same window being viewed
    if (selectedWindow && selectedWindow.id === window.id) {
      setSelectedWindow(updatedWindow);
    }
    
    // Force re-render
    setUpdateCounter(prev => prev + 1);
    
    showToast(`Started working on ${window.windowName}`);
  };

  const handleMarkAsCompleted = (window: Window) => {
    // Mark all layers as installed and set window status to Complete
    const updatedLayers = window.layers.map(layer => ({
      ...layer,
      status: 'Installed' as const,
      installedBy: user?.name || 'Current User',
      installedAt: new Date()
    }));

    const updatedWindow = {
      ...window,
      layers: updatedLayers,
      status: 'Complete' as WindowStatus,
      assignedTeamMembers: [...window.assignedTeamMembers, user?.name || 'Current User'],
      updatedAt: new Date()
    };
    
    setWindows(prev => prev.map(w => 
      w.id === window.id ? updatedWindow : w
    ));
    
    // Update selectedWindow if it's the same window being viewed
    if (selectedWindow && selectedWindow.id === window.id) {
      setSelectedWindow(updatedWindow);
    }
    
    // Force re-render
    setUpdateCounter(prev => prev + 1);
    
    // Check if all windows are completed
    const updatedWindows = windows.map(w => w.id === window.id ? updatedWindow : w);
    const allCompleted = updatedWindows.every(w => w.status === 'Complete');
    
    if (allCompleted) {
      showToast(`🎉 Project Completed! All ${updatedWindows.length} windows have been successfully installed.`);
    } else {
      showToast(`Completed ${window.windowName}`);
    }
  };

  const getActionButton = (window: Window) => {
    if (window.status === 'Pending') {
      return null; // Removed Start Working button for Pending status
    } else if (window.status === 'In Progress') {
      return {
        text: 'Mark as Completed',
        icon: CheckCircle2,
        action: () => handleMarkAsCompleted(window),
        className: 'text-blue-700 hover:bg-blue-50',
        mobileClassName: 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 hover:border-blue-700 shadow-sm hover:shadow-md transition-all duration-200'
      };
    } else if (window.status === 'Reinstallation Needed') {
      return {
        text: 'Start Working',
        icon: CheckCircle2,
        action: () => handleStartWorking(window),
        className: 'text-orange-700 hover:bg-orange-50',
        mobileClassName: 'bg-orange-600 hover:bg-orange-700 text-white border border-orange-600 hover:border-orange-700 shadow-sm hover:shadow-md transition-all duration-200'
      };
    }
    return null;
  };

  const handleSaveWindow = (windowData: Partial<Window>) => {
    if (editingWindow) {
      // Update existing window
      const layerCounts = calculateLayerCounts(windowData.layers || editingWindow.layers);
      setWindows(prev => prev.map(w => 
        w.id === editingWindow.id 
          ? { ...w, ...windowData, ...layerCounts }
          : w
      ));
      showToast('Window updated successfully');
    } else {
      // Add new window
      const layerCounts = calculateLayerCounts(windowData.layers || []);
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
        ...layerCounts,
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
      // Create the updated window with new status
      const updatedWindow = { 
        ...selectedWindow, 
        ...windowData,
        status: calculateWindowStatus(windowData.layers || selectedWindow.layers),
        updatedAt: new Date()
      };
      
      // Update the windows list immediately
      setWindows(prev => prev.map(w => 
        w.id === selectedWindow.id ? updatedWindow : w
      ));
      
      // Update selectedWindow
      setSelectedWindow(updatedWindow);
      
      // Force re-render
      setUpdateCounter(prev => prev + 1);
      
      showToast('Window updated successfully');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <style>{`
        @media (max-width: 640px) {
          .touch-manipulation {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          .mobile-scroll {
            -webkit-overflow-scrolling: touch;
          }
          .mobile-card {
            border-radius: 12px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            margin-bottom: 16px;
          }
          .mobile-touch-target {
            min-height: 44px;
            min-width: 44px;
            padding: 12px 16px;
          }
        }
      `}</style>
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="py-4 px-4 sm:py-6 sm:px-6">
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:gap-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      Marriot Windows Installation
                    </h1>
                    <span className={`px-2 py-1 rounded-md text-xs sm:text-sm font-semibold w-fit ${
                      projectStatus === 'WIP' ? 'bg-blue-50 text-blue-700' :
                      projectStatus === 'QF' ? 'bg-orange-50 text-orange-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {projectStatus}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-md font-semibold w-fit">
                      {project.projectId}
                    </span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{project.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="truncate">{project.startDate} - {project.endDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  {projectStatus === 'WIP' && user?.userType !== 'execution-team' && (
                    <Button
                      variant="primary"
                      onClick={handleMarkForQF}
                      disabled={!windowsSetup}
                      className="px-3 py-2 text-sm w-full sm:w-auto"
                      title={!windowsSetup ? "Please set up windows before marking for QF" : ""}
                    >
                      Mark for QF
                    </Button>
                  )}
                  {projectStatus === 'QF' && user?.userType !== 'execution-team' && (
                    <Button
                      variant="primary"
                      onClick={() => showToast('Project approved for completion')}
                      className="px-3 py-2 text-sm w-full sm:w-auto"
                    >
                      Approve Completion
                    </Button>
                  )}
                  {projectStatus === 'Completed' && user?.userType !== 'execution-team' && (
                    <Button
                      variant="secondary"
                      onClick={() => showToast('Project completed successfully')}
                      className="px-3 py-2 text-sm w-full sm:w-auto"
                    >
                      View Report
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Section - Hidden for execution team and QF state */}
            {user?.userType !== 'execution-team' && projectStatus !== 'QF' && (
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
                  {(user?.userType as string) === 'execution-team' ? '' :
                   projectStatus === 'WIP' ? `Current Phase: ${project.currentPhase}` :
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
            )}

            {/* Action Cards Section - Hidden for execution team */}
            {user?.userType !== 'execution-team' && projectStatus === 'QF' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {/* Update Trailer Card */}
              <div className={`bg-white border rounded-lg p-4 sm:p-6 transition-all duration-200 ${
                isTrailerUpdated 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 hover:shadow-md cursor-pointer'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isTrailerUpdated ? 'bg-green-100' : 'bg-blue-50'
                    }`}>
                      {isTrailerUpdated ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Truck className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Update Trailer</h3>
                  </div>
                  {isTrailerUpdated && (
                    <button
                      onClick={handleUpdateTrailer}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Trailer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {isTrailerUpdated 
                    ? 'Trailer information has been updated successfully.'
                    : 'Update trailer information and logistics details for the project.'
                  }
                </p>
                {isTrailerUpdated ? (
                  <div className="flex items-center gap-2 text-green-700 bg-green-100 px-3 py-2 rounded-md">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                ) : (
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={handleUpdateTrailer}
                  >
                    Update Trailer
                  </Button>
                )}
              </div>

              {/* Update Inventory Card */}
              <div className={`bg-white border rounded-lg p-4 sm:p-6 transition-all duration-200 ${
                isInventoryUpdated 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 hover:shadow-md cursor-pointer'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isInventoryUpdated ? 'bg-green-100' : 'bg-green-50'
                    }`}>
                      {isInventoryUpdated ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Package className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Update Inventory</h3>
                  </div>
                  {isInventoryUpdated && (
                    <button
                      onClick={handleAddUsage}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Inventory"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {isInventoryUpdated 
                    ? 'Inventory levels have been updated successfully.'
                    : 'Manage and update inventory levels for project materials.'
                  }
                </p>
                {isInventoryUpdated ? (
                  <div className="flex items-center gap-2 text-green-700 bg-green-100 px-3 py-2 rounded-md">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                ) : (
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={handleAddUsage}
                  >
                    Update Inventory
                  </Button>
                )}
              </div>

              {/* Sign Quality Form Card */}
              <div className={`bg-white border rounded-lg p-4 sm:p-6 transition-all duration-200 ${
                isQualityFormSigned 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 hover:shadow-md cursor-pointer'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isQualityFormSigned ? 'bg-green-100' : 'bg-purple-50'
                  }`}>
                    {isQualityFormSigned ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <FileCheck className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Sign Quality Form</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {isQualityFormSigned 
                    ? 'Quality assurance form has been signed successfully.'
                    : 'Complete and sign the quality assurance form for project approval.'
                  }
                </p>
                {isQualityFormSigned ? (
                  <div className="flex items-center gap-2 text-green-700 bg-green-100 px-3 py-2 rounded-md">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                ) : (
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={handleSignQualityCheckForm}
                  >
                    Sign Quality Form
                  </Button>
                )}
              </div>
            </div>
            )}

            {/* Stats Section - Hidden for execution team and only show for WIP status */}
            {user?.userType !== 'execution-team' && projectStatus === 'WIP' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* Team on Site */}
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-50 rounded-md flex items-center justify-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <span className="text-lg sm:text-xl font-semibold text-gray-700">{project.teamOnSite}</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">Team Assigned</span>
              </div>


              {/* Layers Completed */}
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-50 rounded-md flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                  </div>
                  <span className="text-lg sm:text-xl font-semibold text-gray-700">{projectMetrics.completedLayers}/{projectMetrics.totalLayers}</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">Layers Installed</span>
              </div>

              {/* Windows Completed */}
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-50 rounded-md flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <span className="text-lg sm:text-xl font-semibold text-gray-700">{project.windowsCompleted}/{projectMetrics.total}</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">Windows Completed</span>
              </div>


              {/* Issues Reported */}
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-50 rounded-md flex items-center justify-center">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                  </div>
                  <span className="text-lg sm:text-xl font-semibold text-gray-700">{projectMetrics.reinstallation}</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">Issues Reported</span>
              </div>
            </div>
            )}


            {/* Completed Status Stats - Show when project is completed */}
            {user?.userType !== 'execution-team' && projectStatus === 'Completed' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-50 rounded-md flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  <span className="text-lg sm:text-xl font-semibold text-gray-700">15</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">Total Windows</span>
              </div>

              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-50 rounded-md flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  <span className="text-lg sm:text-xl font-semibold text-gray-700">15</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">Successfully Installed</span>
              </div>

              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-50 rounded-md flex items-center justify-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  <span className="text-lg sm:text-xl font-semibold text-gray-700">14</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">Days Duration</span>
              </div>

              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-50 rounded-md flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  <span className="text-lg sm:text-xl font-semibold text-gray-700">100%</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">Success Rate</span>
              </div>

              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-50 rounded-md flex items-center justify-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <span className="text-lg sm:text-xl font-semibold text-gray-700">4</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">Team Members</span>
              </div>

              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-50 rounded-md flex items-center justify-center">
                    <Layers className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                  </div>
                  <span className="text-lg sm:text-xl font-semibold text-gray-700">340</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">Total Layers</span>
              </div>

              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-50 rounded-md flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
                  </div>
                  <span className="text-lg sm:text-xl font-semibold text-gray-700">340</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 text-center">Layers Completed</span>
              </div>
            </div>
            )}

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-4 px-4 sm:py-6 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Left Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-4 sm:mb-6">
              <nav className="flex space-x-1 sm:space-x-4 lg:space-x-8 overflow-x-auto mobile-scroll">
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
                    className={`py-2 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 ${
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
                  {/* Inline Setup Interface - Only show when not setup and not Role 3 */}
                  {!windowsSetup && showInlineSetup && user?.userType !== 'execution-team' && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                      <MobileWindowsConfiguration onSave={handleSetupSave} onCancel={() => setShowInlineSetup(false)} onAddBuilding={handleAddBuilding} />
                    </div>
                  )}

                  {/* Second Windows Setup Interface - Only show when not setup and not Role 3 */}
                  {!windowsSetup && showBuildingsForm && user?.userType !== 'execution-team' && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                      {/* Building Name Input */}
                      <div className="space-y-2 mb-6">
                        <label htmlFor="building-name" className="block text-sm font-medium text-gray-700">
                          Building Name
                        </label>
                        <input
                          type="text"
                          id="building-name"
                          placeholder="Enter building name (e.g., Main Building, Office Block, etc.)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                      <MobileWindowsConfiguration onSave={handleSetupSave} onCancel={() => setShowBuildingsForm(false)} onAddBuilding={handleAddBuilding} showSetupButton={false} />
                    </div>
                  )}

                  {/* Loading States */}
                  {isCreatingWindows ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating Windows...</h3>
                      <p className="text-gray-600">Please wait while we set up your windows</p>
                    </div>
                  ) : isCreatingBuildings ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating Buildings...</h3>
                      <p className="text-gray-600">Please wait while we set up your buildings</p>
                    </div>
                  ) : windowsSetup ? (
                    <>
                      {/* Window Management Header */}
                      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Window Management</h3>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Button 
                              variant="primary" 
                              icon={Plus}
                              onClick={handleAddWindow}
                              className="w-full sm:w-auto text-sm"
                            >
                              Add Window
                            </Button>
                          </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              placeholder="Search by window name"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 w-full sm:w-auto">
                            <select
                              value={filters.filmType}
                              onChange={(e) => handleFilterChange('filmType', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                              <option value="all">All Film Types</option>
                              <option value="BR">BR</option>
                              <option value="Riot">Riot</option>
                              <option value="Riot+">Riot+</option>
                            </select>

                            <select
                              value={filters.status}
                              onChange={(e) => handleFilterChange('status', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                              <option value="all">All Status</option>
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Complete">Complete</option>
                              <option value="Reinstallation Needed">Reinstallation Needed</option>
                            </select>

                            <select
                              value={filters.building}
                              onChange={(e) => handleFilterChange('building', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm col-span-2 sm:col-span-1"
                            >
                              <option value="all">All Buildings</option>
                              <option value="Main Building">Main Building</option>
                              <option value="Office Block">Office Block</option>
                              <option value="Warehouse">Warehouse</option>
                              <option value="Annex">Annex</option>
                            </select>
                          </div>

                          <div className="hidden sm:flex items-center gap-2 justify-center sm:justify-start">
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
                        ) : viewMode === 'list' && !isMobile ? (
                          <div className="overflow-x-auto -mx-4 sm:mx-0 mobile-scroll">
                            <div className="min-w-full px-4 sm:px-0">
                              <table className="w-full min-w-[800px]">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-900 w-32">WINDOW</th>
                                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-900 w-20">WIDTH</th>
                                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-900 w-20">LENGTH</th>
                                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-900 w-24">PRODUCT</th>
                                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-900 w-16">INT</th>
                                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-900 w-16">EXT</th>
                                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-900 w-20">TOTAL</th>
                                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-900 w-16">COLOR</th>
                                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-900 w-16">TINT</th>
                                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-900 w-20">STRIP</th>
                                    <th className="text-left py-2 px-2 text-xs font-medium text-gray-900 w-20">STATUS</th>
                                    <th className="text-right py-2 px-2 text-xs font-medium text-gray-900 w-20">ACTIONS</th>
                                  </tr>
                                </thead>
                              <tbody>
                                {filteredWindows.map((window) => (
                                  <tr key={window.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-2 px-2 w-32">
                                      <div>
                                        <div className="text-sm font-medium text-gray-900 truncate">{window.windowName}</div>
                                        <div className="text-xs text-gray-500">{window.createdAt?.toLocaleDateString() || 'Unknown'}</div>
                                      </div>
                                    </td>
                                    <td className="py-2 px-2 text-xs text-gray-900 w-20">{window.width}"</td>
                                    <td className="py-2 px-2 text-xs text-gray-900 w-20">{window.length}"</td>
                                    <td className="py-2 px-2 w-24">
                                      <span className="text-xs text-blue-600 font-medium truncate">{window.filmType}</span>
                                    </td>
                                    <td className="py-2 px-2 text-xs text-gray-900 w-16 text-center">{window.interiorCount || 0}</td>
                                    <td className="py-2 px-2 text-xs text-gray-900 w-16 text-center">{window.exteriorCount || 0}</td>
                                    <td className="py-2 px-2 text-xs text-gray-900 font-semibold w-20 text-center">
                                      {(window.interiorCount || 0) + (window.exteriorCount || 0)}
                                    </td>
                                    <td className="py-2 px-2 text-xs text-gray-900 w-16 truncate">{window.color || 'N/A'}</td>
                                    <td className="py-2 px-2 text-xs text-gray-900 w-16 truncate">{window.tint || 'N/A'}</td>
                                    <td className="py-2 px-2 text-xs text-gray-900 w-20 text-center">
                                      {window.stripping ? 'Yes' : 'No'}
                                    </td>
                                    <td className="py-2 px-2 w-20">
                                      <StatusBadge key={`${window.id}-${updateCounter}`} status={window.status} />
                                    </td>
                                    <td className="py-2 px-2 w-20">
                                      <div className="flex items-center justify-end gap-2">
                                        {/* Mobile: Direct action buttons */}
                                        <div className="flex space-x-1 md:hidden">
                                          {user?.userType !== 'execution-team' && (
                                            <>
                                              <button
                                                onClick={() => {
                                                  handleViewWindow(window);
                                                }}
                                                className="text-gray-400 hover:text-gray-600 p-2 touch-manipulation"
                                              >
                                                <Eye className="w-3 h-3" />
                                              </button>
                                              <button
                                                onClick={() => {
                                                  handleEditWindow(window);
                                                }}
                                                className="text-gray-400 hover:text-gray-600 p-2 touch-manipulation"
                                              >
                                                <Edit className="w-3 h-3" />
                                              </button>
                                              <button
                                                onClick={() => {
                                                  handleDeleteWindow(window.id);
                                                }}
                                                className="text-gray-400 hover:text-red-600 p-2 touch-manipulation"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </button>
                                            </>
                                          )}
                                          {getActionButton(window) && (
                                            <button
                                              onClick={() => {
                                                getActionButton(window)?.action();
                                              }}
                                              className={`flex items-center gap-1 px-2 py-1 text-xs touch-manipulation ${getActionButton(window)?.className}`}
                                            >
                                              <CheckCircle2 className="w-3 h-3" />
                                              <span>{getActionButton(window)?.text || 'Complete'}</span>
                                            </button>
                                          )}
                                        </div>

                                        {/* Desktop: 3-dots menu */}
                                        <div className="hidden md:block relative dropdown-container">
                                          <button 
                                            onClick={() => {
                                              // Toggle dropdown for this specific window
                                              const dropdown = document.getElementById(`dropdown-${window.id}`);
                                              if (dropdown) {
                                                dropdown.classList.toggle('hidden');
                                              }
                                            }}
                                            className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
                                          >
                                            <MoreVertical className="w-4 h-4" />
                                          </button>
                                          <div 
                                            id={`dropdown-${window.id}`}
                                            className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                          >
                                            <div className="py-1">
                                              {user?.userType !== 'execution-team' && (
                                                <>
                                                  <button
                                                    onClick={() => {
                                                      handleViewWindow(window);
                                                      document.getElementById(`dropdown-${window.id}`)?.classList.add('hidden');
                                                    }}
                                                    className="flex items-center gap-2 w-full px-3 py-2 sm:py-1.5 text-xs text-gray-700 hover:bg-gray-100 touch-manipulation"
                                                  >
                                                    <Eye className="w-3 h-3" />
                                                    View Details
                                                  </button>
                                                  <button
                                                    onClick={() => {
                                                      handleEditWindow(window);
                                                      document.getElementById(`dropdown-${window.id}`)?.classList.add('hidden');
                                                    }}
                                                    className="flex items-center gap-2 w-full px-3 py-2 sm:py-1.5 text-xs text-gray-700 hover:bg-gray-100 touch-manipulation"
                                                  >
                                                    <Edit className="w-3 h-3" />
                                                    Edit Window
                                                  </button>
                                                  <button
                                                    onClick={() => {
                                                      handleDeleteWindow(window.id);
                                                      document.getElementById(`dropdown-${window.id}`)?.classList.add('hidden');
                                                    }}
                                                    className="flex items-center gap-2 w-full px-3 py-2 sm:py-1.5 text-xs text-red-600 hover:bg-red-50 touch-manipulation"
                                                  >
                                                    <Trash2 className="w-3 h-3" />
                                                    Delete Window
                                                  </button>
                                                </>
                                              )}
                                              {getActionButton(window) && (
                                                <button
                                                  onClick={() => {
                                                    getActionButton(window)?.action();
                                                    document.getElementById(`dropdown-${window.id}`)?.classList.add('hidden');
                                                  }}
                                                  className={`flex items-center gap-2 w-full px-3 py-2 sm:py-1.5 text-xs touch-manipulation ${getActionButton(window)?.className}`}
                                                >
                                                  <CheckCircle2 className="w-3 h-3" />
                                                  {getActionButton(window)?.text}
                                                </button>
                                              )}
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
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {filteredWindows.map((window) => (
                              <Card key={window.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewWindow(window)}>
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900">{window.windowName}</h4>
                                    <p className="text-xs text-gray-500">Created {window.createdAt?.toLocaleDateString() || 'Unknown'}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <StatusBadge key={`${window.id}-${updateCounter}`} status={window.status} />
                                    {/* Action buttons removed */}
                                  </div>
                                </div>
                                <div className="space-y-1 text-xs text-gray-600">
                                  <div>Product: {window.filmType}</div>
                                  <div>Dimensions: {window.width}" x {window.length}"</div>
                                  <div>Interior: {window.interiorCount || 0}</div>
                                  <div>Exterior: {window.exteriorCount || 0}</div>
                                  <div className="font-semibold text-gray-900">Total Layers: {(window.interiorCount || 0) + (window.exteriorCount || 0)}</div>
                                  <div>Color: {window.color || 'N/A'}</div>
                                  <div>Tint: {window.tint || 'N/A'}</div>
                                  <div>Stripping: {window.stripping ? 'Yes' : 'No'}</div>
                                </div>
                                <div className="flex items-center justify-end mt-4">
                                  {/* Mobile: Direct action buttons */}
                                  <div className="flex space-x-1 md:hidden">
                                    {user?.userType !== 'execution-team' && (
                                      <>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewWindow(window);
                                          }}
                                          className="text-gray-400 hover:text-gray-600 p-2 touch-manipulation"
                                        >
                                          <Eye className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditWindow(window);
                                          }}
                                          className="text-gray-400 hover:text-gray-600 p-2 touch-manipulation"
                                        >
                                          <Edit className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteWindow(window.id);
                                          }}
                                          className="text-gray-400 hover:text-red-600 p-2 touch-manipulation"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </>
                                    )}
                                    {getActionButton(window) && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          getActionButton(window)?.action();
                                        }}
                                        className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md touch-manipulation min-h-[32px] ${getActionButton(window)?.mobileClassName}`}
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>{getActionButton(window)?.text || 'Complete'}</span>
                                      </button>
                                    )}
                                  </div>

                                  {/* Desktop: 3-dots menu */}
                                  <div className="hidden md:block relative dropdown-container">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const dropdown = document.getElementById(`dropdown-grid-${window.id}`);
                                        if (dropdown) {
                                          dropdown.classList.toggle('hidden');
                                        }
                                      }}
                                      className="text-gray-400 hover:text-gray-600 p-1 touch-manipulation"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>
                                    <div 
                                      id={`dropdown-grid-${window.id}`}
                                      className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                                    >
                                      <div className="py-1">
                                        {user?.userType !== 'execution-team' && (
                                          <>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewWindow(window);
                                                document.getElementById(`dropdown-grid-${window.id}`)?.classList.add('hidden');
                                              }}
                                              className="flex items-center gap-2 w-full px-3 py-2 sm:py-1.5 text-xs text-gray-700 hover:bg-gray-100 touch-manipulation"
                                            >
                                              <Eye className="w-3 h-3" />
                                              View Details
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditWindow(window);
                                                document.getElementById(`dropdown-grid-${window.id}`)?.classList.add('hidden');
                                              }}
                                              className="flex items-center gap-2 w-full px-3 py-2 sm:py-1.5 text-xs text-gray-700 hover:bg-gray-100 touch-manipulation"
                                            >
                                              <Edit className="w-3 h-3" />
                                              Edit Window
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteWindow(window.id);
                                                document.getElementById(`dropdown-grid-${window.id}`)?.classList.add('hidden');
                                              }}
                                              className="flex items-center gap-2 w-full px-3 py-2 sm:py-1.5 text-xs text-red-600 hover:bg-red-50 touch-manipulation"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                              Delete Window
                                            </button>
                                          </>
                                        )}
                                        {getActionButton(window) && (
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              getActionButton(window)?.action();
                                              document.getElementById(`dropdown-grid-${window.id}`)?.classList.add('hidden');
                                            }}
                                            className={`flex items-center gap-2 w-full px-3 py-2 sm:py-1.5 text-xs touch-manipulation ${getActionButton(window)?.className}`}
                                          >
                                            <CheckCircle2 className="w-3 h-3" />
                                            {getActionButton(window)?.text}
                                          </button>
                                        )}
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
                          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 gap-4">
                            <div className="flex items-center gap-2">
                              <Button variant="secondary" size="sm" icon={ArrowLeft} className="text-xs">
                                Previous
                              </Button>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                              <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs sm:text-sm whitespace-nowrap">1</span>
                              <span className="px-2 sm:px-3 py-1 text-gray-600 text-xs sm:text-sm whitespace-nowrap">2</span>
                              <span className="px-2 sm:px-3 py-1 text-gray-600 text-xs sm:text-sm whitespace-nowrap">3</span>
                              <span className="px-2 sm:px-3 py-1 text-gray-600 text-xs sm:text-sm whitespace-nowrap">...</span>
                              <span className="px-2 sm:px-3 py-1 text-gray-600 text-xs sm:text-sm whitespace-nowrap">8</span>
                              <span className="px-2 sm:px-3 py-1 text-gray-600 text-xs sm:text-sm whitespace-nowrap">9</span>
                              <span className="px-2 sm:px-3 py-1 text-gray-600 text-xs sm:text-sm whitespace-nowrap">10</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="secondary" size="sm" icon={ArrowRight} className="text-xs">
                                Next
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : user?.userType !== 'lead-supervisor' ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Settings className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Setup Windows First</h3>
                      <p className="text-gray-600">Click "Setup Windows" to configure your windows and start managing them</p>
                    </div>
                  ) : null}
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
                      onClick={() => showToast('Upload document functionality coming soon')}
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
                <ProjectNotes
                  notes={notes}
                  onAddNote={handleAddNote}
                  onEditNote={handleEditNote}
                  onDeleteNote={handleDeleteNote}
                />
              </div>
            )}
          </div>

          {/* Right Sidebar - Activity Log */}
          <div className="w-80 flex-shrink-0">
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

      <AddUsageModal
        isOpen={showAddUsageModal}
        onClose={() => setShowAddUsageModal(false)}
        onSubmit={handleUsageSubmit}
      />

      <UpdateTrailerModal
        isOpen={showUpdateTrailerModal}
        onClose={() => {
          setShowUpdateTrailerModal(false);
          setSelectedTrailer(null);
        }}
        onUpdateTrailer={handleTrailerUpdate}
        trailer={selectedTrailer}
        existingTrailerNumbers={trailers.map(t => t.trailerName)}
      />

    </div>
  );
};