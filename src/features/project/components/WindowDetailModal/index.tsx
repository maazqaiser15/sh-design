import React from 'react';
import { Layers, Ruler, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { Window, WINDOW_STATUS_COLORS, WINDOW_STATUS_DESCRIPTIONS } from '../../types/windows';

interface WindowDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  window: Window | null;
  onUpdate: (updatedWindow: Window) => void;
}

export const WindowDetailModal: React.FC<WindowDetailModalProps> = ({
  isOpen,
  onClose,
  window,
  onUpdate
}) => {
  if (!window) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-5 h-5 text-gray-500" />;
      case 'Updated':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'In Progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Complete':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Reinstallation Needed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusExplanation = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'This window is newly created and waiting for assignment or work to begin.';
      case 'Updated':
        return 'This window has been modified and is ready for review or assignment.';
      case 'In Progress':
        return 'This window is currently being worked on by assigned team members.';
      case 'Complete':
        return 'All layers have been successfully installed and the window is complete.';
      case 'Reinstallation Needed':
        return 'Some layers require reinstallation due to issues or quality concerns.';
      default:
        return 'Status information not available.';
    }
  };

  const getProgressPercentage = () => {
    if (window.layers === 0) return 0;
    const installedLayers = window.installationBreakdown.filter(l => l.status === 'installed').length;
    return Math.round((installedLayers / window.layers) * 100);
  };


  const handleMarkLayerReinstallation = (layerNumber: number) => {
    const updatedBreakdown = window.installationBreakdown.map(layer => 
      layer.layerNumber === layerNumber 
        ? { ...layer, status: 'reinstallation_needed' as const }
        : layer
    );

    const updatedWindow: Window = {
      ...window,
      installationBreakdown: updatedBreakdown,
      status: 'Reinstallation Needed',
      updatedAt: new Date().toISOString()
    };

    onUpdate(updatedWindow);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          {getStatusIcon(window.status)}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{window.windowName}</h2>
            <p className="text-sm text-gray-500">Created {formatDate(window.createdAt)}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            WINDOW_STATUS_COLORS[window.status]
          }`}>
            {WINDOW_STATUS_DESCRIPTIONS[window.status]}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Film Type</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {window.filmType}
                  </span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Dimensions</span>
                  <div className="flex items-center space-x-1 text-sm text-gray-900">
                    <Ruler className="w-4 h-4" />
                    <span>{window.length} × {window.width} cm</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Layers</span>
                  <div className="flex items-center space-x-1 text-sm text-gray-900">
                    <Layers className="w-4 h-4" />
                    <span>{window.layers}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Details</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-2">{getStatusExplanation(window.status)}</p>
                
                {window.status === 'In Progress' && window.assignedTeamMembers.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Assigned Team Members:</p>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{window.assignedTeamMembers.length} members assigned</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Installation Progress */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Installation Progress</h3>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                  <span>Overall Progress</span>
                  <span>{getProgressPercentage()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </div>

              {/* Layer Breakdown */}
              <div className="space-y-2">
                {Array.from({ length: window.layers }, (_, index) => {
                  const layerNumber = index + 1;
                  const layerInfo = window.installationBreakdown.find(l => l.layerNumber === layerNumber);
                  
                  return (
                    <div
                      key={layerNumber}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        layerInfo?.status === 'installed'
                          ? 'bg-green-50 border-green-200'
                          : layerInfo?.status === 'reinstallation_needed'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {layerInfo?.status === 'installed' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : layerInfo?.status === 'reinstallation_needed' ? (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          Layer {layerNumber}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        {layerInfo ? (
                          <div>
                            <p className="text-sm text-gray-600">{layerInfo.installerName}</p>
                            <p className="text-xs text-gray-500">{formatDate(layerInfo.installedAt)}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Not installed</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-3">
            {window.installationBreakdown.some(l => l.status === 'installed') && (
              <Button
                variant="outline"
                onClick={() => {
                  const layerNumber = window.installationBreakdown.find(l => l.status === 'installed')?.layerNumber;
                  if (layerNumber) {
                    handleMarkLayerReinstallation(layerNumber);
                  }
                }}
                className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Mark for Reinstallation</span>
              </Button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
