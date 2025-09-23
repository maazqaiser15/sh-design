import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Truck, Plus, Package, Film, MapPin } from "lucide-react";
import { TrailerList } from "../../features/trailer/components/TrailerList";
import { TrailerDetail } from "../../features/trailer/components/TrailerDetail";
import { TrailerForm } from "../../features/trailer/components/TrailerForm";
import { DeleteConfirmationModal } from "../../features/trailer/components/DeleteConfirmationModal";
import { Trailer } from "../../types";
import { useSetBreadcrumbs } from "../../contexts/BreadcrumbContext";
import {
  calculateTrailerStatus,
  updateInventoryStatus,
  createActivityLog,
} from "../../features/trailer/utils/trailerUtils";
import { EXPANDED_TRAILER_DATA } from "./expandedTrailerData";

/**
 * Main Trailer Management page component
 * Manages all trailer operations and state
 */
export const Trailers: React.FC = () => {
  const { trailerId } = useParams<{ trailerId: string }>();
  const navigate = useNavigate();

  // Sample data - in a real app, this would come from an API
  const [trailers, setTrailers] = useState<Trailer[]>(EXPANDED_TRAILER_DATA);

  // UI State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [trailerToDelete, setTrailerToDelete] = useState<Trailer | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'create' | 'edit'>('list');
  const [trailerToEdit, setTrailerToEdit] = useState<Trailer | null>(null);

  // Get existing trailer numbers for validation
  const existingTrailerNames = trailers.map(
    (trailer) => trailer.trailerName
  );

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

  const handleDeleteTrailer = useCallback((trailer: Trailer) => {
    setTrailerToDelete(trailer);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(
    (trailer: Trailer) => {
      setTrailers((prev) => prev.filter((t) => t.id !== trailer.id));

      // If we're viewing the deleted trailer, go back to list
      if (trailerId === trailer.id) {
        navigate("/trailers");
      }
    },
    [trailerId, navigate]
  );


  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setTrailerToDelete(null);
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
          onDelete={handleDeleteTrailer}
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
        <TrailerList
          trailers={trailers}
          onCreateTrailer={handleCreateNew}
          onViewTrailer={handleViewTrailer}
          onEditTrailer={handleEditTrailer}
          onDeleteTrailer={handleDeleteTrailer}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        trailer={trailerToDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};
