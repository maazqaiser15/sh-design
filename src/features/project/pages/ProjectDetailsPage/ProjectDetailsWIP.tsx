import React, { useState } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { ProjectDetails, MOCK_PROJECT_DETAILS } from '../../types/projectDetails';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { useToast } from '../../../../contexts/ToastContext';

// Mock data for WIP/QF/Completed projects
const MOCK_WIP_PROJECT_DATA = {
  ...MOCK_PROJECT_DETAILS,
  status: 'WIP' as const,
    progress: 62,
  currentPhase: 'Installation',
  estimatedCompletion: '2024-02-20',
  teamOnSite: 8,
  windowsCompleted: 42,
    totalWindows: 60,
    windowsStarted: 8,
    issuesReported: 2,
  windows: [
    {
      id: '1',
      name: 'Main Office Window 1',
      filmType: 'BR',
      dimensions: '120 × 80 cm',
      layers: 3,
      status: 'Complete',
      createdDate: 'Jan 15, 2025'
    },
    {
      id: '2',
      name: 'Main Office Window 2',
      filmType: 'Riot',
      dimensions: '120 × 80 cm',
      layers: 2,
      status: 'In Progress',
      createdDate: 'Jan 15, 2025'
    },
    {
      id: '3',
      name: 'Main Office Window 3',
      filmType: 'Riot +',
      dimensions: '120 × 80 cm',
      layers: 3,
      status: 'Complete',
      createdDate: 'Jan 15, 2025'
    },
    {
      id: '4',
      name: 'Main Office Window 4',
      filmType: 'Riot -',
      dimensions: '120 × 80 cm',
      layers: 1,
      status: 'Complete',
      createdDate: 'Jan 15, 2025'
    },
    {
      id: '5',
      name: 'Main Office Window 5',
      filmType: 'BR',
      dimensions: '120 × 80 cm',
      layers: 2,
      status: 'In Progress',
      createdDate: 'Jan 15, 2025'
    },
    {
      id: '6',
      name: 'Main Office Window 6',
      filmType: 'PER',
      dimensions: '120 × 80 cm',
      layers: 3,
      status: 'Complete',
      createdDate: 'Jan 15, 2025'
    },
    {
      id: '7',
      name: 'Main Office Window 7',
      filmType: 'BR',
      dimensions: '120 × 80 cm',
      layers: 1,
      status: 'Complete',
      createdDate: 'Jan 15, 2025'
    }
  ],
  activityLog: [
    {
      id: '1',
      user: 'Maria Will',
      avatar: '/api/placeholder/32/32',
      action: 'Added a document to Marriot Windows Installation',
      time: '2 mins ago',
      type: 'document',
      fileName: 'Tech requirements.pdf',
      fileSize: '720 KB',
      isNew: true
    },
    {
      id: '2',
      user: 'John Doe',
      avatar: '/api/placeholder/32/32',
      action: 'Added 3 layers to the project Marriot Windows Installation',
      time: '2 mins ago',
      type: 'update',
      isNew: true
    },
    {
      id: '3',
      user: 'Olivia Rhye',
      avatar: '/api/placeholder/32/32',
      action: 'Installed 2 windows to the project Marketing site redesign',
      time: '2 mins ago',
      type: 'update',
      isNew: false
    },
    {
      id: '4',
      user: 'James Gun',
      avatar: '/api/placeholder/32/32',
      action: 'Added a note in Marketing site redesign',
      time: '2 mins ago',
      type: 'note',
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id.',
      isNew: false
    }
  ]
};

export const ProjectDetailsWIP: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('job-brief');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const project = MOCK_WIP_PROJECT_DATA;

  const handleMarkForQF = () => {
    showToast('Project marked for Quality Review', 'success');
  };

  const handleEditProject = () => {
    showToast('Edit project functionality', 'info');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'success';
      case 'In Progress':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const filteredWindows = project.windows.filter(window => {
    const matchesSearch = window.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || window.status.toLowerCase().replace(' ', '-') === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm font-semibold">
                      WIP
              </span>
            </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-md font-semibold">
                      TXDA-SJ1BR1-EETUSC01-P20001
              </span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>123 Main Street, Downtown</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Feb 1, 2024 – Feb 15, 2024</span>
              </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    onClick={handleMarkForQF}
                    className="px-3 py-2"
                  >
                Mark for QF
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

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Progress Section */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 relative">
                  {/* Pie Chart Placeholder */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-300 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">62%</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="text-2xl font-semibold text-gray-700">62%</div>
                  <div className="text-sm font-medium text-blue-600">
                    42/60 windows completed
                  </div>
                </div>
              </div>

              <div className="w-px h-16 bg-gray-200"></div>

              <div className="flex gap-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xl font-semibold text-gray-700">8</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">Windows Started</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xl font-semibold text-gray-700">5</span>
                </div>
                <span className="text-sm font-medium text-gray-600">Windows Completed</span>
              </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xl font-semibold text-gray-700">2</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">Issues Reported</span>
                </div>
              </div>
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
                  {[
                    { id: 'job-brief', label: 'Job brief' },
                    { id: 'team', label: 'Team' },
                    { id: 'travel-hotel', label: 'Travel & Hotel' },
                    { id: 'document', label: 'Document' },
                  { id: 'notes', label: 'Notes' }
                  ].map((tab) => (
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

            {/* Window Management Table */}
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Table Header */}
              <div className="px-5 py-5 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Window Management</h2>
              </div>

                      {/* Filters */}
              <div className="px-5 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search by window name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
                          />
                        </div>
                    <div className="relative">
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="all">Status</option>
                          <option value="complete">Complete</option>
                          <option value="in-progress">In Progress</option>
                        </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    icon={Plus}
                    className="px-3 py-2"
                  >
                          Add window
                        </Button>
                </div>
                      </div>

                      {/* Table */}
                        <div className="overflow-x-auto">
                          <table className="w-full">
                  <thead>
                    <tr className="bg-white border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Window Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Film Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Dimensions
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Layers
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                    {filteredWindows.map((window, index) => (
                                <tr key={window.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-6 py-4">
                                    <div>
                            <div className="text-sm font-medium text-gray-900">{window.name}</div>
                            <div className="text-sm text-gray-500">Created {window.createdDate}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm font-semibold">
                                      {window.filmType}
                                    </span>
                                  </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                                    {window.dimensions}
                                  </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                                    {window.layers}
                                  </td>
                                  <td className="px-6 py-4">
                          <StatusBadge
                            status={window.status}
                            variant={getStatusBadgeColor(window.status)}
                          />
                                  </td>
                                  <td className="px-6 py-4">
                                    <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination */}
              <div className="px-5 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <Button
                    variant="secondary"
                    icon={ArrowLeft}
                    className="px-3 py-2"
                  >
                            Previous
                          </Button>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, '...', 8, 9, 10].map((page, index) => (
                              <button
                                key={index}
                                className={`w-10 h-10 rounded-lg text-sm font-medium ${
                                  page === 1
                            ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                          </div>
                  <Button
                    variant="secondary"
                    icon={ArrowRight}
                    iconPosition="right"
                    className="px-3 py-2"
                  >
                    Next
                          </Button>
                        </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Activity Log */}
          <div className="w-80 flex-shrink-0">
            <Card className="p-5 h-fit">
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
                <p className="text-sm text-gray-500">2 new updates</p>
              </div>

              <div className="space-y-4">
                  {project.activityLog.map((activity) => (
                  <div key={activity.id} className="relative">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {activity.user.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-700">{activity.user}</span>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {activity.action.split('Marriot Windows Installation')[0]}
                            <span className="font-medium text-blue-600">Marriot Windows Installation</span>
                            {activity.action.split('Marriot Windows Installation')[1]}
                          </p>
                          {activity.type === 'document' && (
                            <div className="mt-2 flex items-center gap-2">
                              <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center">
                                <FileText className="w-3 h-3 text-blue-600" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-700">{activity.fileName}</div>
                                <div className="text-xs text-gray-500">{activity.fileSize}</div>
                              </div>
                            </div>
                          )}
                          {activity.type === 'note' && activity.note && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-600 italic">"{activity.note}"</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {activity.isNew && (
                        <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
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