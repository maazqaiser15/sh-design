import React, { useState } from 'react';
import { X, User, Calendar, CheckCircle, AlertCircle, Clock, Edit3 } from 'lucide-react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { useToast } from '../../../../contexts/ToastContext';
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
      case 'Updated':
        return 'bg-blue-100 text-blue-700';
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
      
      // Auto-update status to "Updated" when any field is edited
      if (field !== 'status' && prev.status !== 'In Progress' && prev.status !== 'Complete') {
        updated.status = 'Updated';
      }
      
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

      let newStatus: WindowStatus = 'Updated';
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
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {isEditing ? (
                <input
                  type="text"
                  value={editedWindow.windowName}
                  onChange={(e) => handleFieldChange('windowName', e.target.value)}
                  className="text-2xl font-bold text-gray-900 border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900">{editedWindow.windowName}</h2>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(editedWindow.status)}`}>
                {editedWindow.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Created {editedWindow.createdAt.toLocaleDateString()}</span>
              <span>Updated {editedWindow.updatedAt.toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="secondary" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="secondary" onClick={() => setIsEditing(true)} icon={Edit3}>
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Film Type</label>
                {isEditing ? (
                  <select
                    value={editedWindow.filmType}
                    onChange={(e) => handleFieldChange('filmType', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {FILM_TYPE_OPTIONS.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">{editedWindow.filmType}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedWindow.length}
                      onChange={(e) => handleFieldChange('length', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  ) : (
                    <p className="text-gray-900">{editedWindow.length}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedWindow.width}
                      onChange={(e) => handleFieldChange('width', parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  ) : (
                    <p className="text-gray-900">{editedWindow.width}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Layers</label>
                <p className="text-gray-900">{editedWindow.layers.length}</p>
              </div>
            </div>
          </div>

          {/* Team Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Team Assignment</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Team Members</label>
              {isEditing ? (
                <div className="space-y-2">
                  {editedWindow.assignedTeamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <select
                        value={member}
                        onChange={(e) => {
                          const updated = [...editedWindow.assignedTeamMembers];
                          updated[index] = e.target.value;
                          handleFieldChange('assignedTeamMembers', updated);
                        }}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                      >
                        {MOCK_TEAM_MEMBERS.map(member => (
                          <option key={member} value={member}>{member}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          const updated = editedWindow.assignedTeamMembers.filter((_, i) => i !== index);
                          handleFieldChange('assignedTeamMembers', updated);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const updated = [...editedWindow.assignedTeamMembers, MOCK_TEAM_MEMBERS[0]];
                      handleFieldChange('assignedTeamMembers', updated);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Team Member
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  {editedWindow.assignedTeamMembers.length > 0 ? (
                    editedWindow.assignedTeamMembers.map((member, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-900">
                        <User className="w-4 h-4" />
                        <span>{member}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No team members assigned</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Layer Installation Details */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Layer Installation Details</h3>
          
          <div className="space-y-3">
            {editedWindow.layers.map((layer, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getLayerStatusIcon(layer.status)}
                    <span className="font-medium text-gray-900">{layer.layerName}</span>
                  </div>
                  {isEditing && (
                    <select
                      value={layer.status}
                      onChange={(e) => {
                        const installedBy = e.target.value === 'Installed' ? MOCK_TEAM_MEMBERS[0] : undefined;
                        handleLayerStatusChange(index, e.target.value, installedBy);
                      }}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Installed">Installed</option>
                      <option value="Reinstallation Needed">Reinstallation Needed</option>
                    </select>
                  )}
                </div>
                
                {layer.status === 'Installed' && layer.installedBy && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Installed by {layer.installedBy}</span>
                    {layer.installedAt && (
                      <>
                        <span>•</span>
                        <Calendar className="w-4 h-4" />
                        <span>{layer.installedAt.toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                )}
                
                {layer.status === 'Reinstallation Needed' && layer.notes && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <strong>Note:</strong> {layer.notes}
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