import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, Plus, Edit2, Trash2, Eye, MoreVertical, Truck, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Card } from "../../../../common/components/Card";
import { Button } from "../../../../common/components/Button";
import { StatusBadge } from "../../../../common/components/StatusBadge";
import { Trailer, TrailerStatus } from "../../../../types";
import { useSidebar } from "../../../../contexts/SidebarContext";
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
  isExecutive?: boolean;
  selectedTrailers?: string[];
  onSelectTrailer?: (trailerId: string) => void;
  onSelectAllTrailers?: () => void;
  onBulkAction?: (action: string) => void;
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
  isExecutive = false,
  selectedTrailers = [],
  onSelectTrailer,
  onSelectAllTrailers,
  onBulkAction,
}) => {
  const { isMobile } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TrailerStatus | "">("");
  const [stateFilter, setStateFilter] = useState("");
      const [sortBy, setSortBy] = useState<
        "trailerName" | "registrationNumber" | "location" | "status" | "updatedAt"
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


      {/* Table View - Hidden on mobile */}
      {!isMobile && (
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
          isExecutive={isExecutive}
          selectedTrailers={selectedTrailers}
          onSelectTrailer={onSelectTrailer}
          onSelectAllTrailers={onSelectAllTrailers}
        />
      )}

      {/* Mobile Card View */}
      {isMobile && (
        <div className="space-y-4">
          {paginatedTrailers.map((trailer) => (
            <Card key={trailer.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{trailer.trailerName}</h3>
                  <p className="text-sm text-gray-600">{trailer.registrationNumber}</p>
                </div>
                <StatusBadge status={trailer.status} />
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{trailer.parkingAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Last updated: {new Date(trailer.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-end mt-4 gap-2">
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
                  className="text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

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
                  className="px-2 py-1 pr-6 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
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
      | "location"
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
  isExecutive?: boolean;
  selectedTrailers?: string[];
  onSelectTrailer?: (trailerId: string) => void;
  onSelectAllTrailers?: () => void;
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
  isExecutive = false,
  selectedTrailers = [],
  onSelectTrailer,
  onSelectAllTrailers,
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

  const SortButton: React.FC<{ field: "trailerName" | "registrationNumber" | "location" | "status" | "updatedAt"; children: React.ReactNode }> = ({
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
                    <div className="font-medium">{trailer.city}, {trailer.state}</div>
                    <div className="text-gray-500 text-xs">{trailer.parkingAddress}</div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={trailer.status} unavailableUntil={trailer.unavailableUntil} />
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
