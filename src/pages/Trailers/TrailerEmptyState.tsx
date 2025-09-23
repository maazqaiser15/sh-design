import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Plus, Search } from 'lucide-react';
import { Card } from '../../common/components/Card';
import { Button } from '../../common/components/Button';

/**
 * Empty state component that matches the trailer listing page layout exactly
 * but shows placeholder instead of table
 */
export const TrailerEmptyState: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateFirstTrailer = () => {
    navigate('/trailers/create');
  };

  return (
    <div className="space-y-6">
      {/* Header - Exact same as TrailerList */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Trailer Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage trailer inventory and track film stock levels
          </p>
        </div>
        <Button onClick={handleCreateFirstTrailer} icon={Plus}>
          Add New Trailer
        </Button>
      </div>

      {/* Filters and Search - Exact same as TrailerList but disabled */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search trailers by name or registration number.."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                disabled
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            disabled
          >
            <option value="">All Statuses</option>
          </select>

          {/* State Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
            disabled
          >
            <option value="">All Locations</option>
          </select>
        </div>
      </Card>

      {/* Empty State - Replaces the table */}
      <Card>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Truck size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Trailers Exist
          </h3>
          <p className="text-gray-600 mb-6">
            You don't have any trailers yet. Create your first trailer to start managing your inventory and tracking locations.
          </p>
          <Button
            variant="primary"
            onClick={handleCreateFirstTrailer}
            icon={Plus}
          >
            Get Started
          </Button>
        </div>
      </Card>
    </div>
  );
};
