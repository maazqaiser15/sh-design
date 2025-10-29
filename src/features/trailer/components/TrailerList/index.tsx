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
import CustomDataTable from "common/components/CustomDataTable";
import { formatDateMMDDYYYY } from "../../../../utils/dateUtils";

interface TrailerListProps {
  trailers: Trailer[];
  onCreateTrailer: () => void;
  onViewTrailer: (trailer: Trailer) => void;
  onEditTrailer: (trailer: Trailer) => void;
  onArchiveTrailer: (trailer: Trailer) => void;
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
  onArchiveTrailer,
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
        onArchiveTrailer(trailer);
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
          onArchiveTrailer={onArchiveTrailer}
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
                  <span>Last updated: {formatDateMMDDYYYY(trailer.updatedAt)}</span>
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
                  onClick={() => onArchiveTrailer(trailer)}
                  icon={Trash2}
                  className="text-red-600 hover:text-red-700"
                >
                  Archive
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
    
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
  onArchiveTrailer: (trailer: Trailer) => void;
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
  onArchiveTrailer,
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

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-50";
      case "unavailable":
        return "text-red-600 bg-red-50";
        case "unavailable":
        return "text-red-600 bg-red-50";
        case "low": 
        return 'text-yellow-600 bg-yellow-50'
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const columns = [
    {
      name: 'Trailer Name',
      selector: (row: any) => row.trailerName,
    },
    {
      name: 'Registration',
      selector: (row: any) => row.registrationNumber,
    },
    {
      name: 'Status',
      selector: (row: any) => row.status,
      cell: (row: any) => (
        <div className="flex flex-col space-y-1">
          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(row.status)}`}>
            {row.status}
          </span>
          {row.status === "Unavailable" && row.unavailableUntil && (
            <span className="text-caption text-text-muted">
              Until {row.unavailableUntil}
            </span>
          )}
        </div>
      ),
    },
    {
      name: 'Location',
      selector: (row: any) => row.state,
    },
    {
      name: 'Actions',
      selector: (row: any) => row.action,
      allowOverflow: true,
      style: { overflow: 'visible' },
      cell: (row: any) => (
        <div className="relative inline-block text-right" ref={activeDropdown === row.id ? dropdownRef : null} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              onDropdownToggle(row.id);
            }}
            id={`menu-button-${row.id}`}
            aria-expanded={activeDropdown === row.id}
            // aria-haspopup="true"
          >
            <MoreVertical size={20} />
          </button>
        
          {activeDropdown === row.id && (
            <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" onClick={(e) => e.stopPropagation()}>
              <div className="py-1">
                <button onClick={(e) => { e.stopPropagation(); onMenuAction('view', row); }} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Eye size={16} className="mr-2" />
                  View Details
                </button>
                <button onClick={(e) => { e.stopPropagation(); onMenuAction('edit', row); }} className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Edit2 size={16} className="mr-2" />
                  Edit Trailer
                </button>
                <button onClick={(e) => { e.stopPropagation(); onMenuAction('delete', row); }} className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50">
                  <Trash2 size={16} className="mr-2" />
                  Delete Trailer
                </button>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <CustomDataTable title="" columns={columns} data={trailers} selectableRows={false} pagination={true} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={undefined} />
    </div>
  );
};
