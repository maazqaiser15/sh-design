import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Truck, Plus, Package, Film, MapPin, BarChart3, Download, Settings, RefreshCw, AlertTriangle, CheckCircle, TrendingUp, Users, Filter, MoreHorizontal, Search, Inbox } from "lucide-react";
import { TrailerList } from "../../features/trailer/components/TrailerList";
import { TrailerDetail } from "../../features/trailer/components/TrailerDetail";
import { TrailerForm } from "../../features/trailer/components/TrailerForm";
import { DeleteConfirmationModal } from "../../features/trailer/components/DeleteConfirmationModal";
import { MapCard } from "../../features/trailer/components/MapCard";
import { Trailer } from "../../types";
import { useSetBreadcrumbs } from "../../contexts/BreadcrumbContext";
import { useAuth } from "../../contexts/AuthContext";
import { Card } from "../../common/components/Card";
import { Button } from "../../common/components/Button";
import {
  calculateTrailerStatus,
  updateInventoryStatus,
  createActivityLog,
} from "../../features/trailer/utils/trailerUtils";
import { EXPANDED_TRAILER_DATA } from "./expandedTrailerData";

/**
 * Main Trailer Management page component
 * Enhanced with executive-level trailer and equipment management capabilities
 */
export const Trailers: React.FC = () => {
  const { trailerId } = useParams<{ trailerId: string }>();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const isExecutive = user?.userType === 'executive';

  // Sample data - in a real app, this would come from an API
  const [trailers, setTrailers] = useState<Trailer[]>(EXPANDED_TRAILER_DATA);

  // UI State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [trailerToDelete, setTrailerToDelete] = useState<Trailer | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'create' | 'edit'>('list');
  const [trailerToEdit, setTrailerToEdit] = useState<Trailer | null>(null);
  const [selectedTrailers, setSelectedTrailers] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [stateFilter, setStateFilter] = useState<string>("");
  const [showArchived, setShowArchived] = useState(false);

  // Get existing trailer numbers for validation
  const existingTrailerNames = trailers.map(
    (trailer) => trailer.trailerName
  );

  // Filter trailers based on search and filter criteria
  const filteredTrailers = useMemo(() => {
    return trailers.filter((trailer) => {
      const matchesSearch = !searchTerm || 
        trailer.trailerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trailer.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = !statusFilter || trailer.status === statusFilter;
      const matchesState = !stateFilter || trailer.state === stateFilter;
      
      // Filter by archived status
      const matchesArchived = showArchived ? trailer.status === 'archived' : trailer.status !== 'archived';
      
      return matchesSearch && matchesStatus && matchesState && matchesArchived;
    });
  }, [trailers, searchTerm, statusFilter, stateFilter, showArchived]);

  // Executive analytics calculations
  const trailerAnalytics = useMemo(() => {
    if (!isExecutive) return null;
    
    const totalTrailers = trailers.length;
    const availableTrailers = trailers.filter(t => t.status === 'available').length;
    const lowStockTrailers = trailers.filter(t => t.status === 'low').length;
    const unavailableTrailers = trailers.filter(t => t.status === 'unavailable').length;
    
    const trailersByStatus = trailers.reduce((acc, trailer) => {
      acc[trailer.status] = (acc[trailer.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const trailersByState = trailers.reduce((acc, trailer) => {
      acc[trailer.state] = (acc[trailer.state] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate inventory health
    const totalTools = trailers.reduce((sum, trailer) => 
      sum + trailer.inventory.tools.reduce((toolSum, tool) => toolSum + tool.currentStock, 0), 0);
    const totalFilmSheets = trailers.reduce((sum, trailer) => 
      sum + trailer.inventory.filmSheets.reduce((filmSum, film) => filmSum + film.currentStock, 0), 0);
    
    const averageUtilization = totalTrailers > 0 ? 
      ((availableTrailers + lowStockTrailers) / totalTrailers) * 100 : 0;
    
    return {
      totalTrailers,
      availableTrailers,
      lowStockTrailers,
      unavailableTrailers,
      trailersByStatus,
      trailersByState,
      totalTools,
      totalFilmSheets,
      averageUtilization
    };
  }, [trailers, isExecutive]);

  // Find selected trailer based on URL parameter
  const selectedTrailer = trailerId
    ? trailers.find((t) => t.id === trailerId)
    : null;

  // Determine current view based on URL and state
  useEffect(() => {
    if (trailerId && selectedTrailer) {
      setCurrentView('detail');
    } else if (!trailerId) {
      // Only reset to list if we're not in create/edit mode and no trailerId
      setCurrentView(prev => {
        if (prev === 'create' || prev === 'edit') {
          return prev; // Keep current view if in create/edit mode
        }
        return 'list';
      });
    }
  }, [trailerId, selectedTrailer]);

  // Set breadcrumbs based on current view
  useSetBreadcrumbs(
    currentView === 'detail' && selectedTrailer
      ? [
          { label: "Trailers", href: "/trailers", icon: Truck },
          { label: `Trailer ${selectedTrailer.trailerName}` },
        ]
      : currentView === 'create'
      ? [
          { label: "Trailers", href: "/trailers", icon: Truck },
          { label: "Add New Trailer" },
        ]
      : currentView === 'edit' && trailerToEdit
      ? [
          { label: "Trailers", href: "/trailers", icon: Truck },
          { label: `Edit Trailer ${trailerToEdit.trailerName}` },
        ]
      : [{ label: "Trailers", icon: Truck }],
    [currentView, selectedTrailer, trailerToEdit]
  );

  // Redirect to list if trailer not found
  useEffect(() => {
    if (trailerId && !selectedTrailer) {
      navigate("/trailers", { replace: true });
    }
  }, [trailerId, selectedTrailer, navigate]);

  // Handlers
  const handleCreateTrailer = useCallback(
    (newTrailerData: Omit<Trailer, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();

      // Update inventory status and calculate overall status
      const updatedInventory = updateInventoryStatus(newTrailerData.inventory);
      const status = calculateTrailerStatus(updatedInventory);

      const newTrailer: Trailer = {
        ...newTrailerData,
        id: crypto.randomUUID(),
        inventory: updatedInventory,
        status,
        createdAt: now,
        updatedAt: now,
      };

      setTrailers((prev) => [...prev, newTrailer]);
      setCurrentView('list');
    },
    []
  );

  const handleViewTrailer = useCallback(
    (trailer: Trailer) => {
      navigate(`/trailers/${trailer.id}`);
    },
    [navigate]
  );

  const handleBackToList = useCallback(() => {
    navigate("/trailers");
    setCurrentView('list');
  }, [navigate]);

  const handleEditTrailer = useCallback((trailer: Trailer) => {
    setTrailerToEdit(trailer);
    setCurrentView('edit');
  }, []);

  const handleUpdateTrailer = useCallback((updatedTrailer: Omit<Trailer, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    
    const updatedTrailerWithId: Trailer = {
      ...updatedTrailer,
      id: trailerToEdit?.id || crypto.randomUUID(),
      createdAt: trailerToEdit?.createdAt || now,
      updatedAt: now,
    };

    setTrailers((prev) =>
      prev.map((trailer) =>
        trailer.id === updatedTrailerWithId.id ? updatedTrailerWithId : trailer
      )
    );
    setCurrentView('list');
    setTrailerToEdit(null);
  }, [trailerToEdit]);

  const handleCreateNew = useCallback(() => {
    setCurrentView('create');
  }, []);

  const handleCancelForm = useCallback(() => {
    setCurrentView('list');
    setTrailerToEdit(null);
  }, []);

  const handleArchiveTrailer = useCallback((trailer: Trailer) => {
    setTrailerToDelete(trailer);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmArchive = useCallback(
    (trailer: Trailer) => {
      setTrailers((prev) => prev.map((t) => 
        t.id === trailer.id ? { ...t, status: 'archived' as const } : t
      ));

      // If we're viewing the archived trailer, go back to list
      if (trailerId === trailer.id) {
        navigate("/trailers");
      }
    },
    [trailerId, navigate]
  );


  const handleCloseArchiveModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setTrailerToDelete(null);
  }, []);

  // Executive action handlers
  const handleSelectTrailer = useCallback((trailerId: string) => {
    setSelectedTrailers(prev => 
      prev.includes(trailerId) 
        ? prev.filter(id => id !== trailerId)
        : [...prev, trailerId]
    );
  }, []);

  const handleSelectAllTrailers = useCallback(() => {
    if (selectedTrailers.length === trailers.length) {
      setSelectedTrailers([]);
    } else {
      setSelectedTrailers(trailers.map(t => t.id));
    }
  }, [selectedTrailers.length, trailers]);

  const handleBulkAction = useCallback((action: string) => {
    console.log(`Bulk action: ${action} on trailers:`, selectedTrailers);
    // Implement bulk actions here
    switch (action) {
      case 'restock':
        // Bulk restock selected trailers
        break;
      case 'maintenance':
        // Schedule maintenance for selected trailers
        break;
      case 'relocate':
        // Relocate selected trailers
        break;
      case 'export':
        // Export selected trailers data
        break;
    }
  }, [selectedTrailers]);

  const handleExportTrailers = useCallback(() => {
    console.log('Export all trailers data');
    // Implement export functionality
  }, []);

  const handleRefreshInventory = useCallback(() => {
    console.log('Refresh inventory status for all trailers');
    // Implement inventory refresh
  }, []);

  // Show empty state if no trailers exist
  if (trailers.length === 0 && currentView === 'list') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          {/* Main Empty State Card */}
          <Card className="text-center py-12">
            {/* Icon */}
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Truck size={48} className="text-blue-600" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Trailers Yet
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Get started by adding your first trailer to manage inventory, track locations, and streamline your operations.
            </p>

            {/* CTA Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleCreateNew}
              icon={Plus}
              className="mb-8"
            >
              Create Your First Trailer
            </Button>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Package size={24} className="text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Tool Management</h3>
                <p className="text-sm text-gray-600">
                  Track tools and equipment with real-time inventory levels
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Film size={24} className="text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Film Inventory</h3>
                <p className="text-sm text-gray-600">
                  Monitor film sheet stock and get low inventory alerts
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MapPin size={24} className="text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Location Tracking</h3>
                <p className="text-sm text-gray-600">
                  Keep track of trailer locations and parking addresses
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Tips */}
          <Card className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Getting Started Tips</h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">1</span>
                </div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">Set up basic information</p>
                  <p className="text-sm text-gray-600">Add trailer name, registration number, and parking address</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">2</span>
                </div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">Configure inventory thresholds</p>
                  <p className="text-sm text-gray-600">Set minimum stock levels for tools and film sheets</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-semibold">3</span>
                </div>
                <div>
                  <p className="text-sm text-gray-900 font-medium">Start tracking</p>
                  <p className="text-sm text-gray-600">Monitor inventory levels and get automated alerts</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'detail' && selectedTrailer ? (
        <TrailerDetail
          trailer={selectedTrailer}
          onBack={handleBackToList}
          onEdit={handleEditTrailer}
          onArchive={handleArchiveTrailer}
          onRestock={(restockedTrailer) => {
            // Update the trailer in the list
            setTrailers(prev => 
              prev.map(t => t.id === restockedTrailer.id ? restockedTrailer : t)
            );
          }}
        />
      ) : currentView === 'create' ? (
        <TrailerForm
          trailer={null}
          onSave={handleCreateTrailer}
          onCancel={handleCancelForm}
          existingTrailerNumbers={existingTrailerNames}
        />
      ) : currentView === 'edit' && trailerToEdit ? (
        <TrailerForm
          trailer={trailerToEdit}
          onSave={handleUpdateTrailer}
          onCancel={handleCancelForm}
          existingTrailerNumbers={existingTrailerNames.filter(
            (name) => name !== trailerToEdit?.trailerName
          )}
        />
      ) : (
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Trailer Management
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage trailer inventory and track film stock levels
              </p>
            </div>
            <Button onClick={handleCreateNew} icon={Plus}>
              Add New Trailer
            </Button>
          </div>

          {/* Search, Filters and Action Buttons */}
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
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 pr-7 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
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
                className="px-3 py-2 pr-7 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Locations</option>
                <option value="CA">California</option>
                <option value="TX">Texas</option>
                <option value="NY">New York</option>
                <option value="FL">Florida</option>
                <option value="IL">Illinois</option>
              </select>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    // TODO: Implement map view functionality
                    console.log('Show map view');
                  }}
                  icon={MapPin}
                >
                  Show Map
                </Button>
                <Button
                  variant={showArchived ? "primary" : "secondary"}
                  onClick={() => setShowArchived(!showArchived)}
                  icon={Inbox}
                  title={showArchived ? "Show Active Trailers" : "Show Archived Trailers"}
                />
              </div>
            </div>
          </Card>


          {/* Executive Analytics Panel */}
          {isExecutive && showAnalytics && trailerAnalytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Trailers</p>
                    <p className="text-2xl font-bold text-gray-900">{trailerAnalytics.totalTrailers}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Available</p>
                    <p className="text-2xl font-bold text-green-600">{trailerAnalytics.availableTrailers}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Low Stock</p>
                    <p className="text-2xl font-bold text-orange-600">{trailerAnalytics.lowStockTrailers}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Utilization</p>
                    <p className="text-2xl font-bold text-purple-600">{trailerAnalytics.averageUtilization.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </Card>
            </div>
          )}


          <TrailerList
            trailers={filteredTrailers}
            onCreateTrailer={handleCreateNew}
            onViewTrailer={handleViewTrailer}
            onEditTrailer={handleEditTrailer}
            onArchiveTrailer={handleArchiveTrailer}
            isExecutive={isExecutive}
            selectedTrailers={selectedTrailers}
            onSelectTrailer={handleSelectTrailer}
            onSelectAllTrailers={handleSelectAllTrailers}
            onBulkAction={handleBulkAction}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseArchiveModal}
        trailer={trailerToDelete}
        onConfirmArchive={handleConfirmArchive}
      />
    </div>
  );
};
