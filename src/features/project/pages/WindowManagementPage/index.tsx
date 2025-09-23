import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';
import { 
  Window, 
  WindowFilters, 
  WindowViewMode, 
  WindowStatus, 
  FilmType,
  MOCK_WINDOWS,
  FILM_TYPE_OPTIONS,
  WINDOW_STATUS_COLORS,
  WINDOW_STATUS_DESCRIPTIONS
} from '../../types/windows';
import { AddWindowModal } from '../../components/AddWindowModal';
import { EditWindowModal } from '../../components/EditWindowModal';
import { WindowDetailModal } from '../../components/WindowDetailModal';
import { WindowGridView } from '../../components/WindowGridView';
import { WindowListView } from '../../components/WindowListView';
import { useToast } from '../../../../contexts/ToastContext';

export const WindowManagementPage: React.FC = () => {
  const { showToast } = useToast();
  
  // State management
  const [windows, setWindows] = useState<Window[]>(MOCK_WINDOWS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<WindowFilters>({
    filmType: 'All',
    status: 'All',
    assignedTeamMember: 'All'
  });
  const [viewMode, setViewMode] = useState<WindowViewMode>({ type: 'list' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingWindow, setEditingWindow] = useState<Window | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<Window | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and search windows
  const filteredWindows = useMemo(() => {
    return windows.filter(window => {
      // Search by window name
      const matchesSearch = window.windowName.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by film type
      const matchesFilmType = filters.filmType === 'All' || window.filmType === filters.filmType;
      
      // Filter by status
      const matchesStatus = filters.status === 'All' || window.status === filters.status;
      
      // Filter by assigned team member
      const matchesTeamMember = filters.assignedTeamMember === 'All' || 
        window.assignedTeamMembers.includes(filters.assignedTeamMember);
      
      return matchesSearch && matchesFilmType && matchesStatus && matchesTeamMember;
    });
  }, [windows, searchQuery, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredWindows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWindows = filteredWindows.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Get unique values for filter options

  const uniqueTeamMembers = useMemo(() => {
    const members = new Set<string>();
    windows.forEach(window => {
      window.assignedTeamMembers.forEach(memberId => members.add(memberId));
    });
    return Array.from(members);
  }, [windows]);

  // Handlers
  const handleAddWindow = (windowData: Omit<Window, 'id' | 'createdAt' | 'updatedAt' | 'projectId'>) => {
    const newWindow: Window = {
      ...windowData,
      id: `win-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      projectId: 'proj-001' // In real app, get from context
    };
    
    setWindows(prev => [...prev, newWindow]);
    setShowAddModal(false);
    showToast('Window added successfully');
  };

  const handleEditWindow = (windowData: Omit<Window, 'id' | 'createdAt' | 'updatedAt' | 'projectId'>) => {
    if (!editingWindow) return;
    
    const updatedWindow: Window = {
      ...editingWindow,
      ...windowData,
      status: 'Updated', // Auto-update status when edited
      updatedAt: new Date().toISOString()
    };
    
    setWindows(prev => prev.map(w => w.id === editingWindow.id ? updatedWindow : w));
    setShowEditModal(false);
    setEditingWindow(null);
    showToast('Window updated successfully');
  };

  const handleDeleteWindow = (windowId: string) => {
    setWindows(prev => prev.filter(w => w.id !== windowId));
    showToast('Window removed successfully');
  };

  const handleWindowClick = (window: Window) => {
    setSelectedWindow(window);
    setShowDetailModal(true);
  };

  const handleEditClick = (window: Window) => {
    setEditingWindow(window);
    setShowEditModal(true);
  };

  const handleFilterChange = (key: keyof WindowFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      filmType: 'All',
      status: 'All',
      assignedTeamMember: 'All'
    });
    setSearchQuery('');
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 py-6">
        {/* Single Row Header with all controls */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-6">
          {/* Left side - Title and Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">Window Management</h1>
            </div>
            
            {/* Search Bar */}
            <div className="relative flex-1 min-w-0 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by window name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Right side - Filters, Button, Count, and View Toggle */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-shrink-0">
            {/* Filters */}
            <div className="flex items-center space-x-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
              
              {/* Film Type Filter */}
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 min-w-0"
                value={filters.filmType}
                onChange={(e) => handleFilterChange('filmType', e.target.value as FilmType | 'All')}
              >
                <option value="All">All Film Types</option>
                {FILM_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 min-w-0"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value as WindowStatus | 'All')}
              >
                <option value="All">All Status</option>
                {Object.entries(WINDOW_STATUS_DESCRIPTIONS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>


            </div>

            {/* Add Button */}
            <div className="flex items-center">
              <Button
                variant="primary"
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Window</span>
              </Button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1 flex-shrink-0">
              <button
                onClick={() => setViewMode({ type: 'list' })}
                className={`p-2 rounded-md transition-colors ${
                  viewMode.type === 'list' 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode({ type: 'grid' })}
                className={`p-2 rounded-md transition-colors ${
                  viewMode.type === 'grid' 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Windows Display */}
        {paginatedWindows.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No windows found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || Object.values(filters).some(f => f !== 'All') 
                ? 'Try adjusting your search or filters'
                : 'No windows yet. Upload a sheet or add manually.'
              }
            </p>
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Window</span>
            </Button>
          </Card>
        ) : (
          <>
            {viewMode.type === 'list' ? (
              <WindowListView
                windows={paginatedWindows}
                onWindowClick={handleWindowClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteWindow}
              />
            ) : (
              <WindowGridView
                windows={paginatedWindows}
                onWindowClick={handleWindowClick}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteWindow}
              />
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredWindows.length)} of {filteredWindows.length} windows
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => goToPage(pageNumber)}
                          className={`px-3 py-1 text-sm rounded-md ${
                            currentPage === pageNumber
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modals */}
        <AddWindowModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddWindow}
        />

        <EditWindowModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingWindow(null);
          }}
          onSave={handleEditWindow}
          window={editingWindow}
        />

        <WindowDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedWindow(null);
          }}
          window={selectedWindow}
          onUpdate={(updatedWindow) => {
            setWindows(prev => prev.map(w => w.id === updatedWindow.id ? updatedWindow : w));
            setSelectedWindow(updatedWindow);
          }}
        />
      </div>
    </div>
  );
};
