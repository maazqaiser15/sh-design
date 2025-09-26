import React from 'react';
import { ProjectStatus, MemberStatus, TrailerStatus, FilmStockStatus } from '../../../types';

interface StatusBadgeProps {
  status: ProjectStatus | MemberStatus | TrailerStatus | FilmStockStatus | string;
  size?: 'sm' | 'md';
  className?: string;
  unavailableUntil?: string; // Date string for unavailable status
}

/**
 * Status badge component with color-coded styling
 * Supports different status types and sizes
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  className = '',
  unavailableUntil
}) => {
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      // Project statuses
      'UB': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'UB' },
      'WB': { bg: 'bg-teal-100', text: 'text-teal-800', label: 'WB' },
      'WIP': { bg: 'bg-amber-100', text: 'text-amber-800', label: 'WIP' },
      'Completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      'planning': { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Planning' },
      'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
      'completed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed' },
      'on-hold': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'On Hold' },

      // Member statuses
      'available': { bg: 'bg-green-100', text: 'text-green-800', label: 'Available' },
      'busy': { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Busy' },
      'unavailable': { bg: 'bg-red-100', text: 'text-red-800', label: 'Unavailable' },

      // Trailer statuses (note: available/unavailable already defined above)
      'low': { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Low Stock' },
      'in-use': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Use' },
      'maintenance': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Maintenance' },

      // Film stock statuses
      'good': { bg: 'bg-green-100', text: 'text-green-800', label: 'Good' },
      'critical': { bg: 'bg-red-100', text: 'text-red-800', label: 'Critical' },

      // Window statuses
      'Complete': { bg: 'bg-green-100', text: 'text-green-800', label: 'Complete' },
      'In Progress': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
      'Reinstallation Needed': { bg: 'bg-red-100', text: 'text-red-800', label: 'Reinstallation Needed' },
      'Pending': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Pending' },
      'Updated': { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Updated' },
    };

    return configs[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
  };

  const config = getStatusConfig(status);
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  // Format date for unavailable status
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const displayText = status === 'unavailable' && unavailableUntil 
    ? `${config.label} until ${formatDate(unavailableUntil)}`
    : config.label;

  return (
    <span className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ${config.bg} ${config.text} ${sizeClass} ${className}`}>
      {displayText}
    </span>
  );
};
