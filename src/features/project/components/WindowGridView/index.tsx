import React, { useState } from 'react';
import { MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import { Window, WINDOW_STATUS_COLORS, WINDOW_STATUS_DESCRIPTIONS } from '../../types/windows';
import { Button } from '../../../../common/components/Button';
import { Card } from '../../../../common/components/Card';

interface WindowGridViewProps {
  windows: Window[];
  onWindowClick: (window: Window) => void;
  onEditClick: (window: Window) => void;
  onDeleteClick: (windowId: string) => void;
}

export const WindowGridView: React.FC<WindowGridViewProps> = ({
  windows,
  onWindowClick,
  onEditClick,
  onDeleteClick
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {windows.map((window) => (
        <Card
          key={window.id}
          className="p-4 hover:shadow-md transition-shadow cursor-pointer relative group"
          onClick={() => onWindowClick(window)}
        >
          {/* Actions */}
          <div className="absolute top-3 right-3">
            <div className="relative">
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

          {/* Header */}
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-900 truncate pr-8">{window.windowName}</h3>
            <p className="text-xs text-gray-500">Created {formatDate(window.createdAt)}</p>
          </div>

          {/* Status Badge */}
          <div className="mb-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              WINDOW_STATUS_COLORS[window.status]
            }`}>
              {WINDOW_STATUS_DESCRIPTIONS[window.status]}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Film:</span>
              <span className="ml-1 font-medium">{window.filmType}</span>
            </div>
            <div>
              <span className="text-gray-500">Size:</span>
              <span className="ml-1 font-medium">{window.length}×{window.width}cm</span>
            </div>
            <div>
              <span className="text-gray-500">Layers:</span>
              <span className="ml-1 font-medium">{window.layers}</span>
            </div>
            <div>
              <span className="text-gray-500">Team:</span>
              <span className="ml-1 font-medium">{window.assignedTeamMembers.length}</span>
            </div>
          </div>

          {/* Installation Progress */}
          {window.installationBreakdown.length > 0 && (
            <div className="mt-3 pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Progress:</div>
              <div className="space-y-1">
                {window.installationBreakdown.slice(0, 2).map((layer, index) => (
                  <div
                    key={index}
                    className={`text-xs px-2 py-1 rounded ${
                      layer.status === 'installed'
                        ? 'bg-green-50 text-green-800'
                        : 'bg-red-50 text-red-800'
                    }`}
                  >
                    {layer.layerName} - {layer.installerName}
                  </div>
                ))}
                {window.installationBreakdown.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{window.installationBreakdown.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
