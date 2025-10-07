import React, { useState } from 'react';
import { X, User, Calendar, CheckCircle, AlertCircle, Clock, Edit3 } from 'lucide-react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { useToast } from '../../../../contexts/ToastContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { Window as WindowType, LayerInstallation, WindowStatus, FilmType, MOCK_TEAM_MEMBERS, FILM_TYPE_OPTIONS } from '../../types/windowManagement';

interface WindowDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  windowItem: WindowType | null;
  onUpdate: (updatedWindow: WindowType) => void;
}

export const WindowDetailModal: React.FC<WindowDetailModalProps> = ({
  isOpen,
  onClose,
  windowItem,
  onUpdate
}) => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedWindow, setEditedWindow] = useState<WindowType | null>(null);

  React.useEffect(() => {
    if (windowItem) {
      setEditedWindow({ ...windowItem });
    }
  }, [windowItem]);

  if (!windowItem || !editedWindow) return null;

  const getStatusColor = (status: WindowStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-gray-100 text-gray-700';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'Complete':
        return 'bg-green-100 text-green-700';
      case 'Reinstallation Needed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getLayerStatusIcon = (status: string) => {
    switch (status) {
      case 'Installed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Reinstallation Needed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const handleFieldChange = (field: keyof WindowType, value: any) => {
    setEditedWindow(prev => {
      if (!prev) return null;
      const updated = { ...prev, [field]: value, updatedAt: new Date() };
      return updated;
    });
  };

  const handleLayerStatusChange = (layerIndex: number, status: string, installedBy?: string) => {
    setEditedWindow(prev => {
      if (!prev) return null;
      const updatedLayers = [...prev.layers];
      updatedLayers[layerIndex] = {
        ...updatedLayers[layerIndex],
        status: status as any,
        installedBy: status === 'Installed' ? installedBy : undefined,
        installedAt: status === 'Installed' ? new Date() : undefined
      };

      // Update window status based on layer statuses
      const allInstalled = updatedLayers.every(layer => layer.status === 'Installed');
      const hasReinstall = updatedLayers.some(layer => layer.status === 'Reinstallation Needed');
      const hasInProgress = updatedLayers.some(layer => layer.status === 'In Progress');
      const hasInstalledLayers = updatedLayers.some(layer => layer.status === 'Installed');

      let newStatus: WindowStatus = 'Pending';
      if (hasReinstall) {
        newStatus = 'Reinstallation Needed';
      } else if (allInstalled) {
        newStatus = 'Complete';
      } else if (hasInProgress || prev.assignedTeamMembers.length > 0 || hasInstalledLayers) {
        newStatus = 'In Progress';
      }

      return {
        ...prev,
        layers: updatedLayers,
        status: newStatus,
        updatedAt: new Date()
      };
    });
  };

  const handleMarkLayerComplete = (layerIndex: number) => {
    setEditedWindow(prev => {
      if (!prev) return null;
      const updatedLayers = [...prev.layers];
      updatedLayers[layerIndex] = {
        ...updatedLayers[layerIndex],
        status: 'Installed' as any,
        installedBy: 'Current User', // You can replace this with actual user name
        installedAt: new Date()
      };

      // Check if all layers are now complete
      const allInstalled = updatedLayers.every(layer => layer.status === 'Installed');
      const hasReinstall = updatedLayers.some(layer => layer.status === 'Reinstallation Needed');
      const hasInProgress = updatedLayers.some(layer => layer.status === 'In Progress');
      const hasInstalledLayers = updatedLayers.some(layer => layer.status === 'Installed');

      let newStatus: WindowStatus = 'Pending';
      if (hasReinstall) {
        newStatus = 'Reinstallation Needed';
      } else if (allInstalled) {
        newStatus = 'Complete';
      } else if (hasInProgress || prev.assignedTeamMembers.length > 0 || hasInstalledLayers) {
        newStatus = 'In Progress';
      }

      return {
        ...prev,
        layers: updatedLayers,
        status: newStatus,
        updatedAt: new Date()
      };
    });
    
    showToast(`Layer marked as complete`);
  };

  const handleMarkLayerReinstallationRequired = (layerIndex: number) => {
    setEditedWindow(prev => {
      if (!prev) return null;
      const updatedLayers = [...prev.layers];
      updatedLayers[layerIndex] = {
        ...updatedLayers[layerIndex],
        status: 'Reinstallation Needed' as any,
        notes: 'Layer requires reinstallation due to quality issues or damage',
        reinstallationMarkedBy: user?.name || 'Current User',
        reinstallationMarkedAt: new Date()
      };

      // Update window status based on layer statuses
      const allInstalled = updatedLayers.every(layer => layer.status === 'Installed');
      const hasReinstall = updatedLayers.some(layer => layer.status === 'Reinstallation Needed');
      const hasInProgress = updatedLayers.some(layer => layer.status === 'In Progress');

      let newStatus: WindowStatus = 'Pending';
      if (hasReinstall) {
        newStatus = 'Reinstallation Needed';
      } else if (allInstalled) {
        newStatus = 'Complete';
      } else if (hasInProgress || prev.assignedTeamMembers.length > 0) {
        newStatus = 'In Progress';
      }

      return {
        ...prev,
        layers: updatedLayers,
        status: newStatus,
        updatedAt: new Date()
      };
    });
    
    showToast(`Layer marked as requiring reinstallation`);
  };

  const handleCompleteReinstallation = (layerIndex: number) => {
    setEditedWindow(prev => {
      if (!prev) return null;
      const updatedLayers = [...prev.layers];
      updatedLayers[layerIndex] = {
        ...updatedLayers[layerIndex],
        status: 'Installed' as any,
        installedBy: user?.name || 'Current User',
        installedAt: new Date(),
        reinstallationCompletedBy: user?.name || 'Current User',
        reinstallationCompletedAt: new Date()
      };

      // Update window status based on layer statuses
      const allInstalled = updatedLayers.every(layer => layer.status === 'Installed');
      const hasReinstall = updatedLayers.some(layer => layer.status === 'Reinstallation Needed');
      const hasInProgress = updatedLayers.some(layer => layer.status === 'In Progress');

      let newStatus: WindowStatus = 'Pending';
      if (hasReinstall) {
        newStatus = 'Reinstallation Needed';
      } else if (allInstalled) {
        newStatus = 'Complete';
      } else if (hasInProgress || prev.assignedTeamMembers.length > 0) {
        newStatus = 'In Progress';
      }

      return {
        ...prev,
        layers: updatedLayers,
        status: newStatus,
        updatedAt: new Date()
      };
    });
    
    showToast(`Reinstallation completed successfully`);
  };

  const handleSave = () => {
    if (editedWindow) {
      onUpdate(editedWindow);
      setIsEditing(false);
      showToast('Window updated successfully', 'success');
    }
  };

  const handleCancel = () => {
    setEditedWindow({ ...windowItem });
    setIsEditing(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="xl"
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editedWindow.windowName}
                  onChange={(e) => handleFieldChange('windowName', e.target.value)}
                  className="text-xl sm:text-2xl font-bold text-gray-900 border border-gray-300 rounded px-2 py-1 w-full sm:w-auto"
                />
              ) : (
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{editedWindow.windowName}</h2>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${getStatusColor(editedWindow.status)}`}>
                {editedWindow.status}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
              <span>Created {editedWindow.createdAt.toLocaleDateString()}</span>
              <span className="hidden sm:inline">•</span>
              <span>Updated {editedWindow.updatedAt.toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isEditing ? (
              <>
                <Button variant="secondary" onClick={handleCancel} className="flex-1 sm:flex-none mobile-touch-target">
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave} className="flex-1 sm:flex-none mobile-touch-target">
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="secondary" onClick={() => setIsEditing(true)} icon={Edit3} className="w-full sm:w-auto mobile-touch-target">
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Film Type</label>
                {isEditing ? (
                  <select
                    value={editedWindow.filmType}
                    onChange={(e) => handleFieldChange('filmType', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mobile-touch-target"
                  >
                    {FILM_TYPE_OPTIONS.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900 text-sm sm:text-base">{editedWindow.filmType}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Length (cm)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedWindow.length}
                      onChange={(e) => handleFieldChange('length', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mobile-touch-target"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm sm:text-base">{editedWindow.length}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Width (cm)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedWindow.width}
                      onChange={(e) => handleFieldChange('width', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm mobile-touch-target"
                    />
                  ) : (
                    <p className="text-gray-900 text-sm sm:text-base">{editedWindow.width}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Layers</label>
                <p className="text-gray-900 text-sm sm:text-base">{editedWindow.layers.length}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Layer Installation Details */}
        <div className="mt-6 sm:mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Layer Installation Details</h3>
          
          <div className="space-y-3 sm:space-y-4">
            {editedWindow.layers.map((layer, index) => (
              <div key={index} className={`border border-gray-200 rounded-lg p-3 sm:p-4 ${
                layer.status === 'Reinstallation Needed' ? 'bg-orange-50 border-orange-200' : ''
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {getLayerStatusIcon(layer.status)}
                    <span className="font-medium text-gray-900 text-sm sm:text-base">{layer.layerName}</span>
                  </div>
                  {isEditing && (
                    <select
                      value={layer.status}
                      onChange={(e) => {
                        const installedBy = e.target.value === 'Installed' ? MOCK_TEAM_MEMBERS[0] : undefined;
                        handleLayerStatusChange(index, e.target.value, installedBy);
                      }}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm mobile-touch-target w-full sm:w-auto"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Installed">Installed</option>
                      <option value="Reinstallation Needed">Reinstallation Needed</option>
                    </select>
                  )}
                </div>
                
                {layer.status === 'Installed' && layer.installedBy && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span>Installed by {layer.installedBy}</span>
                        </div>
                        {layer.installedAt && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              <span>{layer.installedAt.toLocaleDateString()}</span>
                            </div>
                          </>
                        )}
                      </div>
                      {layer.reinstallationMarkedBy && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-orange-600">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>Marked by {layer.reinstallationMarkedBy}</span>
                          </div>
                          {layer.reinstallationMarkedAt && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                <span>{layer.reinstallationMarkedAt.toLocaleDateString()}</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                      {layer.reinstallationCompletedBy && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-green-600">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span>Reinstalled by {layer.reinstallationCompletedBy}</span>
                          </div>
                          {layer.reinstallationCompletedAt && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                <span>{layer.reinstallationCompletedAt.toLocaleDateString()}</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    {!isEditing && user?.userType === 'execution-team' && (
                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleMarkLayerReinstallationRequired(index)}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 text-sm mobile-touch-target"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Reinstallation Required
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {layer.status === 'Reinstallation Needed' && (
                  <div className="space-y-3">
                    {layer.notes && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        <strong>Note:</strong> {layer.notes}
                      </div>
                    )}
                    {layer.reinstallationMarkedBy && (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-orange-700">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Reinstallation marked by: {layer.reinstallationMarkedBy}</span>
                        </div>
                        {layer.reinstallationMarkedAt && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 flex-shrink-0" />
                              <span>{layer.reinstallationMarkedAt.toLocaleDateString()}</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {!isEditing && user?.userType === 'execution-team' && (
                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleCompleteReinstallation(index)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 text-sm mobile-touch-target"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Reinstallation Complete
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Mark as Complete button for In Progress and Pending status windows */}
                {(() => {
                  const shouldShowButton = (editedWindow.status === 'In Progress' || editedWindow.status === 'Pending') && 
                    (layer.status === 'In Progress' || layer.status === 'Pending') && 
                    !isEditing && 
                    layer.status !== 'Installed';
                  
                  // Debug logging
                  console.log('Button condition check:', {
                    windowStatus: editedWindow.status,
                    layerStatus: layer.status,
                    isEditing,
                    shouldShowButton
                  });
                  
                  return shouldShowButton;
                })() && (
                  <div className="mt-3 flex justify-end">
                    <Button
                      onClick={() => handleMarkLayerComplete(index)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 text-sm mobile-touch-target"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark as Complete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};