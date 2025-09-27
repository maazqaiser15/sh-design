import React, { useState, useEffect } from 'react';
import { MoreVertical, Eye, Edit, Trash2, Layers, Ruler } from 'lucide-react';
import { Window, WINDOW_STATUS_COLORS, WINDOW_STATUS_DESCRIPTIONS } from '../../types/windows';
import { Button } from '../../../../common/components/Button';

interface WindowListViewProps {
  windows: Window[];
  onWindowClick: (window: Window) => void;
  onEditClick: (window: Window) => void;
  onDeleteClick: (windowId: string) => void;
}

export const WindowListView: React.FC<WindowListViewProps> = ({
  windows,
  onWindowClick,
  onEditClick,
  onDeleteClick
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuId]);

  const toggleMenu = (windowId: string) => {
    setOpenMenuId(openMenuId === windowId ? null : windowId);
  };

  const handleView = (window: Window) => {
    setOpenMenuId(null);
    onWindowClick(window);
  };

  const handleEdit = (window: Window) => {
    setOpenMenuId(null);
    onEditClick(window);
  };

  const handleDelete = (windowId: string) => {
    setOpenMenuId(null);
    if (window.confirm('Are you sure you want to remove this window?')) {
      onDeleteClick(windowId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-3">Window Name</div>
          <div className="col-span-2">Film Type</div>
          <div className="col-span-2">Dimensions</div>
          <div className="col-span-1">Layers</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Installation Progress</div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {windows.map((window) => (
          <div
            key={window.id}
            className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onWindowClick(window)}
          >
            <div className="grid grid-cols-12 gap-2 items-center">
              {/* Window Name */}
              <div className="col-span-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{window.windowName}</p>
                  <p className="text-xs text-gray-500">Created {formatDate(window.createdAt)}</p>
                </div>
              </div>

              {/* Film Type */}
              <div className="col-span-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {window.filmType}
                </span>
              </div>

              {/* Dimensions */}
              <div className="col-span-2">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Ruler className="w-4 h-4" />
                  <span>{window.length} × {window.width} cm</span>
                </div>
              </div>

              {/* Layers */}
              <div className="col-span-1">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Layers className="w-4 h-4" />
                  <span>{window.layers}</span>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  WINDOW_STATUS_COLORS[window.status]
                }`}>
                  {WINDOW_STATUS_DESCRIPTIONS[window.status]}
                </span>
              </div>

              {/* Installation Progress */}
              <div className="col-span-1">
                <div className="text-xs text-gray-600">
                  {window.installationBreakdown.length > 0 ? (
                    <div className="space-y-2">
                      {window.installationBreakdown.map((layer, index) => (
                        <div key={index} className="block">
                          <span className="text-gray-700">{layer.layerName} - {layer.installerName}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">No progress</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-1">
                <div className="relative flex justify-end">
                  {/* Mobile: Direct action buttons */}
                  <div className="flex space-x-1 md:hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(window);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(window);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(window.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Desktop: 3-dots menu */}
                  <div className="hidden md:block">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMenu(window.id);
                      }}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                    
                    {/* Dropdown Menu */}
                    {openMenuId === window.id && (
                      <div className="absolute right-0 top-8 z-10 w-32 bg-white border border-gray-200 rounded-lg shadow-lg">
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleView(window);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(window);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(window.id);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
