import React, { useState, useMemo } from "react";
import { Search, Grid, List, Plus, Edit2, Trash2, Eye } from "lucide-react";
import { Card } from "../../../../common/components/Card";
import { Button } from "../../../../common/components/Button";
import { StatusBadge } from "../../../../common/components/StatusBadge";
import { Trailer, TrailerStatus } from "../../../../types";
import {
  filterTrailers,
  sortTrailers,
  TRAILER_LOCATIONS,
} from "../../utils/trailerUtils";

interface TrailerListProps {
  trailers: Trailer[];
  onCreateTrailer: () => void;
  onViewTrailer: (trailer: Trailer) => void;
  onEditTrailer: (trailer: Trailer) => void;
  onDeleteTrailer: (trailer: Trailer) => void;
}

type ViewMode = "card" | "table";

/**
 * Trailer list component with card and table view modes
 * Includes filtering, sorting, and search functionality
 */
export const TrailerList: React.FC<TrailerListProps> = ({
  trailers,
  onCreateTrailer,
  onViewTrailer,
  onEditTrailer,
  onDeleteTrailer,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TrailerStatus | "">("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState<
    "trailerNumber" | "registrationNumber" | "location" | "status" | "updatedAt"
  >("trailerNumber");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredAndSortedTrailers = useMemo(() => {
    const filtered = filterTrailers(trailers, {
      status: statusFilter || undefined,
      location: locationFilter || undefined,
      search: searchTerm || undefined,
    });

    return sortTrailers(filtered, sortBy, sortOrder);
  }, [trailers, searchTerm, statusFilter, locationFilter, sortBy, sortOrder]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Trailer Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage trailer inventory and track film stock levels
          </p>
        </div>
        <Button onClick={onCreateTrailer} icon={Plus}>
          Add New Trailer
        </Button>
      </div>

      {/* Filters and Search */}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as TrailerStatus | "")
            }
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="available">Available</option>
            <option value="low">Low Stock</option>
            <option value="unavailable">Unavailable</option>
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Locations</option>
            {TRAILER_LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex rounded-md border border-gray-300">
            <button
              onClick={() => setViewMode("card")}
              className={`px-3 py-2 rounded-l-md flex items-center gap-2 transition-colors ${
                viewMode === "card"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Grid size={16} />
              Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-2 rounded-r-md flex items-center gap-2 transition-colors border-l ${
                viewMode === "table"
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <List size={16} />
              Table
            </button>
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredAndSortedTrailers.length} of {trailers.length} trailers
      </div>

      {/* Content */}
      {viewMode === "card" ? (
        <TrailerCardView
          trailers={filteredAndSortedTrailers}
          onViewTrailer={onViewTrailer}
          onEditTrailer={onEditTrailer}
          onDeleteTrailer={onDeleteTrailer}
        />
      ) : (
        <TrailerTableView
          trailers={filteredAndSortedTrailers}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onViewTrailer={onViewTrailer}
          onEditTrailer={onEditTrailer}
          onDeleteTrailer={onDeleteTrailer}
        />
      )}
    </div>
  );
};

interface TrailerCardViewProps {
  trailers: Trailer[];
  onViewTrailer: (trailer: Trailer) => void;
  onEditTrailer: (trailer: Trailer) => void;
  onDeleteTrailer: (trailer: Trailer) => void;
}

const TrailerCardView: React.FC<TrailerCardViewProps> = ({
  trailers,
  onViewTrailer,
  onEditTrailer,
  onDeleteTrailer,
}) => {
  if (trailers.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Grid size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No trailers found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trailers.map((trailer) => (
        <Card
          key={trailer.id}
          hover
          className="relative cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => onViewTrailer(trailer)}
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {trailer.trailerNumber}
                </h3>
                <p className="text-sm text-gray-600">
                  {trailer.registrationNumber}
                </p>
              </div>
              <StatusBadge status={trailer.status} />
            </div>

            {/* Location */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">Location:</span> {trailer.location}
            </div>

          </div>
        </Card>
      ))}
    </div>
  );
};

interface TrailerTableViewProps {
  trailers: Trailer[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (
    field:
      | "trailerNumber"
      | "registrationNumber"
      | "location"
      | "status"
      | "updatedAt"
  ) => void;
  onViewTrailer: (trailer: Trailer) => void;
  onEditTrailer: (trailer: Trailer) => void;
  onDeleteTrailer: (trailer: Trailer) => void;
}

const TrailerTableView: React.FC<TrailerTableViewProps> = ({
  trailers,
  sortBy,
  sortOrder,
  onSort,
  onViewTrailer,
  onEditTrailer,
  onDeleteTrailer,
}) => {
  if (trailers.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <List size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No trailers found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      </Card>
    );
  }

  const SortButton: React.FC<{ field: string; children: React.ReactNode }> = ({
    field,
    children,
  }) => (
    <button
      onClick={() => onSort(field as any)}
      className="flex items-center gap-1 text-left hover:text-primary transition-colors"
    >
      {children}
      {sortBy === field && (
        <span className="text-primary">{sortOrder === "asc" ? "↑" : "↓"}</span>
      )}
    </button>
  );

  return (
    <Card padding="sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="trailerNumber">Trailer Number</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="registrationNumber">Registration</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="location">Location</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="status">Status</SortButton>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trailers.map((trailer) => (
              <tr key={trailer.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {trailer.trailerNumber}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {trailer.registrationNumber}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {trailer.location}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={trailer.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewTrailer(trailer)}
                      icon={Eye}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditTrailer(trailer)}
                      icon={Edit2}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTrailer(trailer)}
                      icon={Trash2}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
