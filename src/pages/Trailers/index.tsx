import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";
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

/**
 * Main Trailer Management page component
 * Manages all trailer operations and state
 */
export const Trailers: React.FC = () => {
  const { trailerId } = useParams<{ trailerId: string }>();
  const navigate = useNavigate();

  // Sample data - in a real app, this would come from an API
  const [trailers, setTrailers] = useState<Trailer[]>([
    {
      id: "1",
      trailerNumber: "TRL001",
      registrationNumber: "REG-001-2024",
      location: "Warehouse A",
      inventory: {
        tools: [
          { toolName: "CART", currentStock: 6, threshold: 6, status: "good" },
          { toolName: "BEER TANK W/ HOSE", currentStock: 4, threshold: 6, status: "low" },
          { toolName: "HARD PRESS", currentStock: 0, threshold: 6, status: "critical" },
          { toolName: "RED CARD", currentStock: 8, threshold: 6, status: "good" },
          { toolName: "OLFA", currentStock: 5, threshold: 6, status: "low" },
          { toolName: "OLFA BLADE PACK", currentStock: 3, threshold: 6, status: "low" },
          { toolName: "SCRAPERS", currentStock: 7, threshold: 6, status: "good" },
          { toolName: "SCRAPER BLADE PACK", currentStock: 2, threshold: 6, status: "low" },
          { toolName: "PICK KIT", currentStock: 4, threshold: 6, status: "low" },
          { toolName: "1 QRT ACETONE", currentStock: 8, threshold: 6, status: "good" },
          { toolName: "PHILLIPS HEAD SD", currentStock: 6, threshold: 6, status: "good" },
          { toolName: "FLAT HEAD SD", currentStock: 5, threshold: 6, status: "low" },
          { toolName: "WINDOW SQUEEGEE", currentStock: 3, threshold: 6, status: "low" },
          { toolName: "CORDLESS DRILL", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "DRILL BIT KIT", currentStock: 0, threshold: 1, status: "critical" },
          { toolName: "GENERATOR W/ CORD", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "CAULK SAUSAGE CASE", currentStock: 3, threshold: 2, status: "good" },
          { toolName: "9 PK BLUE TAPE", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "MICRO FIBER PACKAGE", currentStock: 3, threshold: 2, status: "good" },
          { toolName: "5 GAL GAS CAN", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "12 GAL WATER", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "AIR COMP W/ HOSE", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "TRASH CAN", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "55 GAL TRASH BAGS CASE", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "BATH TOWEL", currentStock: 10, threshold: 8, status: "good" },
          { toolName: "5 GAL BUCKETS", currentStock: 25, threshold: 20, status: "good" },
          { toolName: "SHARPIE PACK", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "DRY ERASE MARKER PACK", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "CAULK GUN (Sausage)", currentStock: 3, threshold: 2, status: "good" },
          { toolName: "PACK NITRILE GLOVES", currentStock: 1, threshold: 1, status: "good" },
        ],
        filmSheets: [
          { sheetType: "BR", currentStock: 25, threshold: 20, status: "good" },
          { sheetType: "Riot+", currentStock: 15, threshold: 20, status: "low" },
          { sheetType: "Riot", currentStock: 0, threshold: 15, status: "critical" },
          { sheetType: "Riot -", currentStock: 12, threshold: 10, status: "good" },
          { sheetType: "FER", currentStock: 8, threshold: 10, status: "low" },
          { sheetType: "Smash", currentStock: 5, threshold: 10, status: "low" },
          { sheetType: "Tint NI", currentStock: 3, threshold: 10, status: "low" },
          { sheetType: "Tint Incl", currentStock: 7, threshold: 10, status: "low" },
          { sheetType: "Anchoring", currentStock: 2, threshold: 10, status: "low" },
          { sheetType: "Kevlar", currentStock: 1, threshold: 10, status: "low" },
          { sheetType: "Stripping", currentStock: 4, threshold: 10, status: "low" },
        ],
      },
      status: "unavailable",
      activityLogs: [
        {
          id: "1",
          timestamp: "2024-01-15T10:30:00Z",
          type: "created",
          description: "Trailer TRL001 created",
          systemGenerated: true,
        },
        {
          id: "2",
          timestamp: "2024-01-16T14:20:00Z",
          type: "inventory_updated",
          description: "Inventory levels updated",
          user: "John Doe",
          systemGenerated: false,
        },
      ],
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-16T14:20:00Z",
    },
    {
      id: "2",
      trailerNumber: "TRL002",
      registrationNumber: "REG-002-2024",
      location: "Field Site 1",
      inventory: {
        tools: [
          { toolName: "CART", currentStock: 8, threshold: 6, status: "good" },
          { toolName: "BEER TANK W/ HOSE", currentStock: 7, threshold: 6, status: "good" },
          { toolName: "HARD PRESS", currentStock: 6, threshold: 6, status: "good" },
          { toolName: "RED CARD", currentStock: 10, threshold: 6, status: "good" },
          { toolName: "OLFA", currentStock: 8, threshold: 6, status: "good" },
          { toolName: "OLFA BLADE PACK", currentStock: 7, threshold: 6, status: "good" },
          { toolName: "SCRAPERS", currentStock: 9, threshold: 6, status: "good" },
          { toolName: "SCRAPER BLADE PACK", currentStock: 6, threshold: 6, status: "good" },
          { toolName: "PICK KIT", currentStock: 8, threshold: 6, status: "good" },
          { toolName: "1 QRT ACETONE", currentStock: 10, threshold: 6, status: "good" },
          { toolName: "PHILLIPS HEAD SD", currentStock: 8, threshold: 6, status: "good" },
          { toolName: "FLAT HEAD SD", currentStock: 7, threshold: 6, status: "good" },
          { toolName: "WINDOW SQUEEGEE", currentStock: 6, threshold: 6, status: "good" },
          { toolName: "CORDLESS DRILL", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "DRILL BIT KIT", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "GENERATOR W/ CORD", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "CAULK SAUSAGE CASE", currentStock: 3, threshold: 2, status: "good" },
          { toolName: "9 PK BLUE TAPE", currentStock: 2, threshold: 1, status: "good" },
          { toolName: "MICRO FIBER PACKAGE", currentStock: 4, threshold: 2, status: "good" },
          { toolName: "5 GAL GAS CAN", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "12 GAL WATER", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "AIR COMP W/ HOSE", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "TRASH CAN", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "55 GAL TRASH BAGS CASE", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "BATH TOWEL", currentStock: 12, threshold: 8, status: "good" },
          { toolName: "5 GAL BUCKETS", currentStock: 30, threshold: 20, status: "good" },
          { toolName: "SHARPIE PACK", currentStock: 2, threshold: 1, status: "good" },
          { toolName: "DRY ERASE MARKER PACK", currentStock: 2, threshold: 1, status: "good" },
          { toolName: "CAULK GUN (Sausage)", currentStock: 4, threshold: 2, status: "good" },
          { toolName: "PACK NITRILE GLOVES", currentStock: 2, threshold: 1, status: "good" },
        ],
        filmSheets: [
          { sheetType: "BR", currentStock: 35, threshold: 20, status: "good" },
          { sheetType: "Riot+", currentStock: 28, threshold: 20, status: "good" },
          { sheetType: "Riot", currentStock: 18, threshold: 15, status: "good" },
          { sheetType: "Riot -", currentStock: 15, threshold: 10, status: "good" },
          { sheetType: "FER", currentStock: 12, threshold: 10, status: "good" },
          { sheetType: "Smash", currentStock: 15, threshold: 10, status: "good" },
          { sheetType: "Tint NI", currentStock: 12, threshold: 10, status: "good" },
          { sheetType: "Tint Incl", currentStock: 10, threshold: 10, status: "good" },
          { sheetType: "Anchoring", currentStock: 8, threshold: 10, status: "low" },
          { sheetType: "Kevlar", currentStock: 6, threshold: 10, status: "low" },
          { sheetType: "Stripping", currentStock: 9, threshold: 10, status: "low" },
        ],
      },
      status: "available",
      activityLogs: [
        {
          id: "3",
          timestamp: "2024-01-14T09:15:00Z",
          type: "created",
          description: "Trailer TRL002 created",
          systemGenerated: true,
        },
      ],
      createdAt: "2024-01-14T09:15:00Z",
      updatedAt: "2024-01-14T09:15:00Z",
    },
    {
      id: "3",
      trailerNumber: "TRL003",
      registrationNumber: "REG-003-2024",
      location: "Maintenance Bay",
      inventory: {
        tools: [
          { toolName: "CART", currentStock: 6, threshold: 6, status: "good" },
          { toolName: "BEER TANK W/ HOSE", currentStock: 6, threshold: 6, status: "good" },
          { toolName: "HARD PRESS", currentStock: 5, threshold: 6, status: "low" },
          { toolName: "RED CARD", currentStock: 4, threshold: 6, status: "low" },
          { toolName: "OLFA", currentStock: 3, threshold: 6, status: "low" },
          { toolName: "OLFA BLADE PACK", currentStock: 2, threshold: 6, status: "low" },
          { toolName: "SCRAPERS", currentStock: 4, threshold: 6, status: "low" },
          { toolName: "SCRAPER BLADE PACK", currentStock: 1, threshold: 6, status: "low" },
          { toolName: "PICK KIT", currentStock: 3, threshold: 6, status: "low" },
          { toolName: "1 QRT ACETONE", currentStock: 5, threshold: 6, status: "low" },
          { toolName: "PHILLIPS HEAD SD", currentStock: 4, threshold: 6, status: "low" },
          { toolName: "FLAT HEAD SD", currentStock: 3, threshold: 6, status: "low" },
          { toolName: "WINDOW SQUEEGEE", currentStock: 2, threshold: 6, status: "low" },
          { toolName: "CORDLESS DRILL", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "DRILL BIT KIT", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "GENERATOR W/ CORD", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "CAULK SAUSAGE CASE", currentStock: 2, threshold: 2, status: "good" },
          { toolName: "9 PK BLUE TAPE", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "MICRO FIBER PACKAGE", currentStock: 2, threshold: 2, status: "good" },
          { toolName: "5 GAL GAS CAN", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "12 GAL WATER", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "AIR COMP W/ HOSE", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "TRASH CAN", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "55 GAL TRASH BAGS CASE", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "BATH TOWEL", currentStock: 6, threshold: 8, status: "low" },
          { toolName: "5 GAL BUCKETS", currentStock: 15, threshold: 20, status: "low" },
          { toolName: "SHARPIE PACK", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "DRY ERASE MARKER PACK", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "CAULK GUN (Sausage)", currentStock: 2, threshold: 2, status: "good" },
          { toolName: "PACK NITRILE GLOVES", currentStock: 1, threshold: 1, status: "good" },
        ],
        filmSheets: [
          { sheetType: "BR", currentStock: 20, threshold: 20, status: "good" },
          { sheetType: "Riot+", currentStock: 20, threshold: 20, status: "good" },
          { sheetType: "Riot", currentStock: 15, threshold: 15, status: "good" },
          { sheetType: "Riot -", currentStock: 8, threshold: 10, status: "low" },
          { sheetType: "FER", currentStock: 5, threshold: 10, status: "low" },
          { sheetType: "Smash", currentStock: 6, threshold: 10, status: "low" },
          { sheetType: "Tint NI", currentStock: 4, threshold: 10, status: "low" },
          { sheetType: "Tint Incl", currentStock: 5, threshold: 10, status: "low" },
          { sheetType: "Anchoring", currentStock: 3, threshold: 10, status: "low" },
          { sheetType: "Kevlar", currentStock: 2, threshold: 10, status: "low" },
          { sheetType: "Stripping", currentStock: 4, threshold: 10, status: "low" },
        ],
      },
      status: "low",
      activityLogs: [
        {
          id: "4",
          timestamp: "2024-01-13T16:45:00Z",
          type: "created",
          description: "Trailer TRL003 created",
          systemGenerated: true,
        },
      ],
      createdAt: "2024-01-13T16:45:00Z",
      updatedAt: "2024-01-13T16:45:00Z",
    },
  ]);

  // UI State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [trailerToDelete, setTrailerToDelete] = useState<Trailer | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'detail' | 'create' | 'edit'>('list');
  const [trailerToEdit, setTrailerToEdit] = useState<Trailer | null>(null);

  // Get existing trailer numbers for validation
  const existingTrailerNumbers = trailers.map(
    (trailer) => trailer.trailerNumber
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
          { label: `Trailer ${selectedTrailer.trailerNumber}` },
        ]
      : currentView === 'create'
      ? [
          { label: "Trailers", href: "/trailers", icon: Truck },
          { label: "Add New Trailer" },
        ]
      : currentView === 'edit' && trailerToEdit
      ? [
          { label: "Trailers", href: "/trailers", icon: Truck },
          { label: `Edit Trailer ${trailerToEdit.trailerNumber}` },
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

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'detail' && selectedTrailer ? (
        <TrailerDetail
          trailer={selectedTrailer}
          onBack={handleBackToList}
          onEdit={handleEditTrailer}
          onDelete={handleDeleteTrailer}
        />
      ) : currentView === 'create' ? (
        <TrailerForm
          trailer={null}
          onSave={handleCreateTrailer}
          onCancel={handleCancelForm}
          existingTrailerNumbers={existingTrailerNumbers}
        />
      ) : currentView === 'edit' && trailerToEdit ? (
        <TrailerForm
          trailer={trailerToEdit}
          onSave={handleUpdateTrailer}
          onCancel={handleCancelForm}
          existingTrailerNumbers={existingTrailerNumbers.filter(
            (num) => num !== trailerToEdit?.trailerNumber
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
