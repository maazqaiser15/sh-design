import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../../../common/components/Button';
import { StatusBadge } from '../../../../common/components/StatusBadge';

// Icons from Figma design
const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 18.3333C10 18.3333 16.6667 12.5 16.6667 8.33333C16.6667 6.44928 15.7143 4.64236 14.0711 3.28595C12.4278 1.92954 10.2243 1.16667 8.33333 1.16667C6.44238 1.16667 4.23886 1.92954 2.59564 3.28595C0.952427 4.64236 0 6.44928 0 8.33333C0 12.5 6.66667 18.3333 10 18.3333Z" stroke="#667085" strokeWidth="1.5"/>
    <path d="M10 10.8333C11.3807 10.8333 12.5 9.71405 12.5 8.33333C12.5 6.95262 11.3807 5.83333 10 5.83333C8.61929 5.83333 7.5 6.95262 7.5 8.33333C7.5 9.71405 8.61929 10.8333 10 10.8333Z" stroke="#667085" strokeWidth="1.5"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.66667 1.66667V4.16667M13.3333 1.66667V4.16667M2.91667 7.5H17.0833M4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V4.16667C17.5 3.24619 16.7538 2.5 15.8333 2.5H4.16667C3.24619 2.5 2.5 3.24619 2.5 4.16667V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333Z" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.3333 1.99999C11.5084 1.82498 11.7163 1.68604 11.9451 1.59128C12.1739 1.49653 12.4191 1.44775 12.6667 1.44775C12.9142 1.44775 13.1594 1.49653 13.3882 1.59128C13.617 1.68604 13.8249 1.82498 14 1.99999C14.175 2.175 14.3139 2.3829 14.4087 2.6117C14.5034 2.8405 14.5522 3.0857 14.5522 3.33332C14.5522 3.58094 14.5034 3.82614 14.4087 4.05494C14.3139 4.28374 14.175 4.49164 14 4.66665L5 13.6667L1.33333 14.6667L2.33333 11L11.3333 1.99999Z" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 11L8.5 8.5M9.5 5.25C9.5 7.59721 7.59721 9.5 5.25 9.5C2.90279 9.5 1 7.59721 1 5.25C1 2.90279 2.90279 1 5.25 1C7.59721 1 9.5 2.90279 9.5 5.25Z" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 4.5L6 7.5L9 4.5" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const XCloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 3L3 9M3 3L9 9" stroke="#475467" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 15L7.5 10L12.5 5" stroke="#344054" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 5L12.5 10L7.5 15" stroke="#344054" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DotsVerticalIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 10.8333C10.4602 10.8333 10.8333 10.4602 10.8333 10C10.8333 9.53976 10.4602 9.16666 10 9.16666C9.53976 9.16666 9.16666 9.53976 9.16666 10C9.16666 10.4602 9.53976 10.8333 10 10.8333Z" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 4.99999C10.4602 4.99999 10.8333 4.62689 10.8333 4.16666C10.8333 3.70642 10.4602 3.33332 10 3.33332C9.53976 3.33332 9.16666 3.70642 9.16666 4.16666C9.16666 4.62689 9.53976 4.99999 10 4.99999Z" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 16.6667C10.4602 16.6667 10.8333 16.2936 10.8333 15.8333C10.8333 15.3731 10.4602 15 10 15C9.53976 15 9.16666 15.3731 9.16666 15.8333C9.16666 16.2936 9.53976 16.6667 10 16.6667Z" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Pie Chart Component
const PieChart: React.FC<{ percentage: number }> = ({ percentage }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-20 h-20">
      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
        {/* Background circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#EAECF0"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#0D76BF"
          strokeWidth="8"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
    </div>
  );
};

// Activity Log Item Component
const ActivityItem: React.FC<{
  avatar: string;
  name: string;
  time: string;
  action: string;
  projectName: string;
  hasAttachment?: boolean;
  attachmentName?: string;
  attachmentSize?: string;
  note?: string;
}> = ({ avatar, name, time, action, projectName, hasAttachment, attachmentName, attachmentSize, note }) => (
  <div className="relative flex gap-3 items-start">
    <div className="flex-shrink-0">
      <img
        src={avatar}
        alt={name}
        className="w-8 h-8 rounded-full object-cover"
      />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        {action} <span className="font-medium text-blue-600">{projectName}</span>
      </p>
      {hasAttachment && (
        <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
          <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 2H4.5C3.11929 2 2 3.11929 2 4.5V11.5C2 12.8807 3.11929 14 4.5 14H11.5C12.8807 14 14 12.8807 14 11.5V6.5" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.5 2V6.5H14" stroke="#0D76BF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">{attachmentName}</p>
            <p className="text-xs text-gray-500">{attachmentSize}</p>
          </div>
        </div>
      )}
      {note && (
        <p className="text-sm text-gray-600 italic">"{note}"</p>
      )}
    </div>
    <div className="absolute top-0 right-0 w-2 h-2 bg-blue-600 rounded-full"></div>
  </div>
);

export const ProjectDetailsWIP: React.FC = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('job-brief');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const projectData = {
    id: projectId || '1',
    name: 'Marriot Windows Installation',
    projectId: 'TXDA-SJ1BR1-EETUSC01-P20001',
    status: 'WIP',
    location: '123 Main Street, Downtown',
    startDate: 'Feb 1, 2024',
    endDate: 'Feb 15, 2024',
    progress: 62,
    completedWindows: 42,
    totalWindows: 60,
    windowsStarted: 8,
    windowsCompleted: 5,
    issuesReported: 2,
  };

  const windows = [
    { id: 1, name: 'Main Office Window 1', filmType: 'BR', dimensions: '120 × 80 cm', layers: 3, status: 'Complete', created: 'Jan 15, 2025' },
    { id: 2, name: 'Main Office Window 2', filmType: 'Riot', dimensions: '120 × 80 cm', layers: 2, status: 'In Progress', created: 'Jan 15, 2025' },
    { id: 3, name: 'Main Office Window 3', filmType: 'Riot +', dimensions: '120 × 80 cm', layers: 3, status: 'Complete', created: 'Jan 15, 2025' },
    { id: 4, name: 'Main Office Window 4', filmType: 'Riot -', dimensions: '120 × 80 cm', layers: 1, status: 'Complete', created: 'Jan 15, 2025' },
    { id: 5, name: 'Main Office Window 5', filmType: 'BR', dimensions: '120 × 80 cm', layers: 2, status: 'In Progress', created: 'Jan 15, 2025' },
    { id: 6, name: 'Main Office Window 6', filmType: 'PER', dimensions: '120 × 80 cm', layers: 3, status: 'Complete', created: 'Jan 15, 2025' },
    { id: 7, name: 'Main Office Window 7', filmType: 'BR', dimensions: '120 × 80 cm', layers: 1, status: 'Complete', created: 'Jan 15, 2025' },
  ];

  const activities = [
    {
      id: 1,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      name: 'Maria Will',
      time: '2 mins ago',
      action: 'Added a document to',
      projectName: 'Marriot Windows Installation',
      hasAttachment: true,
      attachmentName: 'Tech requirements.pdf',
      attachmentSize: '720 KB',
    },
    {
      id: 2,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      name: 'John Doe',
      time: '2 mins ago',
      action: 'Added 3 layers to the project',
      projectName: 'Marriot Windows Installation',
    },
    {
      id: 3,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      name: 'Olivia Rhye',
      time: '2 mins ago',
      action: 'Installed 2 windows to the project',
      projectName: 'Marketing site redesign',
    },
    {
      id: 4,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      name: 'James Gun',
      time: '2 mins ago',
      action: 'Added a note in',
      projectName: 'Marketing site redesign',
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id.',
    },
  ];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'In Progress':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getFilmTypeBadgeColor = (filmType: string) => {
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Title and Status */}
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                {projectData.name}
              </h1>
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-sm font-semibold">
                {projectData.status}
              </span>
            </div>

            {/* Project Details */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-md text-xs font-semibold">
                {projectData.projectId}
              </span>
              <div className="flex items-center gap-2">
                <LocationIcon />
                <span>{projectData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon />
                <span>{projectData.startDate} – {projectData.endDate}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button className="bg-blue-600 text-white px-3 py-1.5 text-sm font-semibold rounded-md hover:bg-blue-700">
                Mark for QF
              </Button>
              <Button variant="outline" className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md">
                <EditIcon />
                Edit
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* Progress Overview */}
          <div className="flex items-center gap-6">
            {/* Pie Chart */}
            <div className="flex items-center gap-4">
              <PieChart percentage={projectData.progress} />
              <div className="flex flex-col">
                <span className="text-2xl font-semibold text-gray-700">
                  {projectData.progress}%
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {projectData.completedWindows}/{projectData.totalWindows} windows completed
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-16 bg-gray-200"></div>

            {/* Metrics */}
            <div className="flex gap-10">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                    <CalendarIcon />
                  </div>
                  <span className="text-xl font-semibold text-gray-700">
                    {projectData.windowsStarted}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600">Windows Started</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                    <CalendarIcon />
                  </div>
                  <span className="text-xl font-semibold text-gray-700">
                    {projectData.windowsCompleted}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600">Windows Completed</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center">
                    <CalendarIcon />
                  </div>
                  <span className="text-xl font-semibold text-gray-700">
                    {projectData.issuesReported}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-600">Issues Reported</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6 w-full">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="border-b border-gray-200">
                <div className="flex">
                  {[
                    { id: 'job-brief', label: 'Job brief' },
                    { id: 'team', label: 'Team' },
                    { id: 'travel-hotel', label: 'Travel & Hotel' },
                    { id: 'document', label: 'Document' },
                    { id: 'notes', label: 'Notes' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'job-brief' && (
                  <div>
                    {/* Window Management */}
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Window Management
                      </h2>

                      {/* Filters */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative flex-1 max-w-sm">
                          <SearchIcon />
                          <input
                            type="text"
                            placeholder="Search by window name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">Status</option>
                          <option value="complete">Complete</option>
                          <option value="in-progress">In Progress</option>
                        </select>
                        <Button variant="outline" className="flex items-center gap-2 px-3 py-2 text-sm">
                          <XCloseIcon />
                          Add window
                        </Button>
                      </div>

                      {/* Table */}
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-white border-b border-gray-200">
                              <tr>
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
                              {windows.map((window, index) => (
                                <tr key={window.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-6 py-4">
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {window.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Created {window.created}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-semibold ${getFilmTypeBadgeColor(window.filmType)}`}>
                                      {window.filmType}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {window.dimensions}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {window.layers}
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(window.status)}`}>
                                      {window.status}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <button className="text-gray-400 hover:text-gray-600">
                                      <DotsVerticalIcon />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination */}
                        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                          <Button variant="outline" className="flex items-center gap-2 px-3 py-2 text-sm">
                            <ArrowLeftIcon />
                            Previous
                          </Button>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, '...', 8, 9, 10].map((page, index) => (
                              <button
                                key={index}
                                className={`w-10 h-10 rounded-lg text-sm font-medium ${
                                  page === 1
                                    ? 'bg-gray-50 text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                          </div>
                          <Button variant="outline" className="flex items-center gap-2 px-3 py-2 text-sm">
                            Next
                            <ArrowRightIcon />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Activity Log */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Activity Log
                </h3>
                <p className="text-sm text-gray-500">2 new updates</p>
              </div>

              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="relative">
                    <ActivityItem {...activity} />
                    {activity.id < activities.length && (
                      <div className="absolute left-4 top-8 w-px h-8 bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
