import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, Plus, Edit2, Trash2, Eye, MoreVertical, Truck, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Card } from "../../../../common/components/Card";
import { Button } from "../../../../common/components/Button";
import { StatusBadge } from "../../../../common/components/StatusBadge";
import { Trailer, TrailerStatus } from "../../../../types";
import {
  filterTrailers,
  sortTrailers,
  USA_STATES,
} from "../../utils/trailerUtils";

interface TrailerListProps {
  trailers: Trailer[];
  onCreateTrailer: () => void;
  onViewTrailer: (trailer: Trailer) => void;
  onEditTrailer: (trailer: Trailer) => void;
  onDeleteTrailer: (trailer: Trailer) => void;
}

/**
 * Trailer list component with table view
 * Includes filtering, sorting, and search functionality
 */
export const TrailerList: React.FC<TrailerListProps> = ({
  trailers,
  onCreateTrailer,
  onViewTrailer,
  onEditTrailer,
  onDeleteTrailer,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TrailerStatus | "">("");
  const [stateFilter, setStateFilter] = useState("");
      const [sortBy, setSortBy] = useState<
        "trailerName" | "registrationNumber" | "city" | "state" | "parkingAddress" | "currentLocation" | "status" | "updatedAt"
      >("trailerName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredAndSortedTrailers = useMemo(() => {
    const filtered = filterTrailers(trailers, {
      status: statusFilter || undefined,
      state: stateFilter || undefined,
      search: searchTerm || undefined,
    });

        return sortTrailers(filtered, sortBy as any, sortOrder);
  }, [trailers, searchTerm, statusFilter, stateFilter, sortBy, sortOrder]);

  // Pagination calculations
  const totalItems = filteredAndSortedTrailers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTrailers = filteredAndSortedTrailers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, stateFilter]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDropdownToggle = (trailerId: string) => {
    setActiveDropdown(activeDropdown === trailerId ? null : trailerId);
  };

  const handleMenuAction = (action: string, trailer: Trailer) => {
    setActiveDropdown(null);
    switch (action) {
      case 'view':
        onViewTrailer(trailer);
        break;
      case 'edit':
        onEditTrailer(trailer);
        break;
      case 'delete':
        onDeleteTrailer(trailer);
        break;
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

          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All States</option>
            {USA_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

        </div>
      </Card>

      {/* Table View */}
      <TrailerTableView
        trailers={paginatedTrailers}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onViewTrailer={onViewTrailer}
        onEditTrailer={onEditTrailer}
        onDeleteTrailer={onDeleteTrailer}
        activeDropdown={activeDropdown}
        onDropdownToggle={handleDropdownToggle}
        onMenuAction={handleMenuAction}
        dropdownRef={dropdownRef}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Card>
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left side: Items per page and showing count */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
                  Items per page:
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} trailers
              </div>
            </div>

            {/* Right side: Navigation controls */}
            <div className="flex items-center space-x-2">
              {/* Previous button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-2"
              >
                <ChevronLeft size={16} />
              </Button>

              {/* Page numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === page
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};


interface TrailerTableViewProps {
  trailers: Trailer[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (
    field:
      | "trailerName"
      | "registrationNumber"
      | "parkingAddress"
      | "state"
      | "city"
      | "currentLocation"
      | "status"
      | "updatedAt"
  ) => void;
  onViewTrailer: (trailer: Trailer) => void;
  onEditTrailer: (trailer: Trailer) => void;
  onDeleteTrailer: (trailer: Trailer) => void;
  activeDropdown: string | null;
  onDropdownToggle: (trailerId: string) => void;
  onMenuAction: (action: string, trailer: Trailer) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

const TrailerTableView: React.FC<TrailerTableViewProps> = ({
  trailers,
  sortBy,
  sortOrder,
  onSort,
  onViewTrailer,
  onEditTrailer,
  onDeleteTrailer,
  activeDropdown,
  onDropdownToggle,
  onMenuAction,
  dropdownRef,
}) => {
  if (trailers.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Truck size={48} className="mx-auto" />
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

  const SortButton: React.FC<{ field: "trailerName" | "registrationNumber" | "parkingAddress" | "state" | "city" | "currentLocation" | "status" | "updatedAt"; children: React.ReactNode }> = ({
    field,
    children,
  }) => (
    <button
      onClick={() => onSort(field)}
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
                <SortButton field="trailerName">Trailer Name</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="registrationNumber">Registration</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="city">City</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="state">State</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="parkingAddress">Parking Address</SortButton>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortButton field="currentLocation">Current Location</SortButton>
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
              <tr 
                key={trailer.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onViewTrailer(trailer)}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {trailer.trailerName}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {trailer.registrationNumber}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {trailer.city}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {trailer.state}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {trailer.parkingAddress}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin size={16} className="mr-1" />
                    <span>-</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={trailer.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div 
                    className="relative inline-block text-left" 
                    ref={activeDropdown === trailer.id ? dropdownRef : null}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDropdownToggle(trailer.id);
                      }}
                      id={`menu-button-${trailer.id}`}
                      aria-expanded={activeDropdown === trailer.id}
                      aria-haspopup="true"
                    >
                      <MoreVertical size={20} />
                    </button>
                    
                    {activeDropdown === trailer.id && (
                      <div 
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMenuAction('view', trailer);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye size={16} className="mr-2" />
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMenuAction('edit', trailer);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit2 size={16} className="mr-2" />
                            Edit Trailer
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMenuAction('delete', trailer);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={16} className="mr-2" />
                            Delete Trailer
                          </button>
                        </div>
                      </div>
                    )}
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
