import React from 'react';
import { X, Calendar, MapPin, Users, Truck, FileText } from 'lucide-react';
import { ProjectListItem, PROJECT_STATUS_COLORS, PROJECT_STATUS_DESCRIPTIONS } from '../types';
import { formatProjectDuration } from '../utils';

interface ProjectDetailsPlaceholderProps {
  project: ProjectListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailsPlaceholder: React.FC<ProjectDetailsPlaceholderProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !project) return null;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Project Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Project Title */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
              <p className="text-gray-600">VIN: {project.vinCode}</p>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${PROJECT_STATUS_COLORS[project.status]}`}>
                {PROJECT_STATUS_DESCRIPTIONS[project.status]}
              </span>
            </div>

            {/* Description */}
            {project.description && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Description
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
              </div>
            )}

            {/* Timeline */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Timeline
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Start Date:</span>
                  <span className="text-sm font-medium">{formatDate(project.startDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">End Date:</span>
                  <span className="text-sm font-medium">{formatDate(project.endDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="text-sm font-medium">{formatProjectDuration(project.startDate, project.endDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Progress:</span>
                  <span className="text-sm font-medium">{project.progress}%</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Location
              </h4>
              <p className="text-gray-600 text-sm">{project.location}</p>
            </div>

            {/* Crew */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Crew ({project.crewCount})
              </h4>
              {project.crew.length > 0 ? (
                <div className="space-y-2">
                  {project.crew.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          getInitials(member.name)
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No crew assigned</p>
              )}
            </div>

            {/* Trailer */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Truck className="w-4 h-4 mr-2" />
                Assigned Trailer
              </h4>
              <p className="text-gray-600 text-sm">
                {project.assignedTrailer || 'Not Assigned'}
              </p>
            </div>

            {/* Project Info */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Created:</span>
                  <p className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-600">Updated:</span>
                  <p className="font-medium">{new Date(project.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Placeholder Notice */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-1">Coming Soon</h4>
              <p className="text-sm text-blue-700">
                Full project details and management features will be available in a future update.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
