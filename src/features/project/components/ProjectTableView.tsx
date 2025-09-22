import React from 'react';
import { ChevronUp, ChevronDown, MapPin, Users, Truck, Calendar } from 'lucide-react';
import { ProjectListItem, PROJECT_STATUS_COLORS, PROJECT_STATUS_DESCRIPTIONS, ProjectSortOptions } from '../types';
import { formatProjectDuration } from '../utils';

interface ProjectTableViewProps {
  projects: ProjectListItem[];
  onProjectClick: (project: ProjectListItem) => void;
  sortOptions: ProjectSortOptions;
  onSort: (field: ProjectSortOptions['field']) => void;
}

export const ProjectTableView: React.FC<ProjectTableViewProps> = ({
  projects,
  onProjectClick,
  sortOptions,
  onSort,
}) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getSortIcon = (field: ProjectSortOptions['field']) => {
    if (sortOptions.field !== field) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }
    return sortOptions.direction === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-gray-600" /> : 
      <ChevronDown className="w-4 h-4 text-gray-600" />;
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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('title')}
              >
                <div className="flex items-center">
                  Project Name
                  {getSortIcon('title')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('vinCode')}
              >
                <div className="flex items-center">
                  VIN
                  {getSortIcon('vinCode')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {getSortIcon('status')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('location')}
              >
                <div className="flex items-center">
                  Location
                  {getSortIcon('location')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('crewCount')}
              >
                <div className="flex items-center">
                  Crew
                  {getSortIcon('crewCount')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('assignedTrailer')}
              >
                <div className="flex items-center">
                  Trailer
                  {getSortIcon('assignedTrailer')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('startDate')}
              >
                <div className="flex items-center">
                  Start Date
                  {getSortIcon('startDate')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('endDate')}
              >
                <div className="flex items-center">
                  End Date
                  {getSortIcon('endDate')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr
                key={project.id}
                onClick={() => onProjectClick(project)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {project.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {project.description}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {project.vinCode}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${PROJECT_STATUS_COLORS[project.status]}`}>
                    {PROJECT_STATUS_DESCRIPTIONS[project.status]}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    {project.location}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <div className="flex items-center -space-x-1">
                      {project.crew.slice(0, 3).map((member, index) => (
                        <div
                          key={member.id}
                          className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700"
                          title={member.name}
                        >
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
                      ))}
                      {project.crewCount > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                          +{project.crewCount - 3}
                        </div>
                      )}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      ({project.crewCount})
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Truck className="w-4 h-4 mr-1 text-gray-400" />
                    {project.assignedTrailer || 'Not Assigned'}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    {formatDate(project.startDate)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    {formatDate(project.endDate)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
        </div>
      )}
    </div>
  );
};
