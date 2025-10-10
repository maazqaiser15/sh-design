import React from 'react';
import { Search, X } from 'lucide-react';
import { ProjectFilters, ProjectStatus, PROJECT_STATUS_DESCRIPTIONS } from '../types';

interface ProjectFiltersProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
}

export const ProjectFiltersComponent: React.FC<ProjectFiltersProps> = ({
  filters,
  onFiltersChange,
  searchQuery,
  onSearchChange,
  onClearFilters,
}) => {
  const statusOptions: ProjectStatus[] = ['PV90', 'UB', 'WB', 'WIP', 'QF', 'QC', 'Completed'];

  const handleStatusChange = (status: ProjectStatus) => {
    onFiltersChange({
      status: [status],
    });
  };

  const hasActiveFilters = 
    filters.status.length > 0 ||
    searchQuery.length > 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-6">
        {/* Status Filter Dropdown */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filters.status[0] || ''}
            onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
            className="w-full px-3 py-2 pr-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {PROJECT_STATUS_DESCRIPTIONS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClearFilters}
            className="flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            <X className="w-4 h-4 mr-1" />
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
