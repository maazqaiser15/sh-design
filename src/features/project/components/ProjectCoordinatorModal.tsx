import React, { useState } from 'react';
import { X, User, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProjectListItem } from '../types';
import { Button } from '../../../common/components/Button';
import { Card } from '../../../common/components/Card';

interface ProjectCoordinatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectListItem | null;
  onAssignCoordinator: (projectId: string, coordinatorId: string) => void;
}

// Mock project coordinators data
const mockCoordinators = [
  {
    id: 'coord-1',
    name: 'Jennifer White',
    email: 'jennifer@company.com',
    phone: '+1-555-0130',
    location: 'Boston, MA',
    specializations: ['Project Coordination', 'Client Communication'],
    avatar: 'JW'
  },
  {
    id: 'coord-2',
    name: 'Maria Garcia',
    email: 'maria@company.com',
    phone: '+1-555-0134',
    location: 'Austin, TX',
    specializations: ['Client Relations', 'Scheduling'],
    avatar: 'MG'
  },
  {
    id: 'coord-3',
    name: 'Jessica Miller',
    email: 'jessica@company.com',
    phone: '+1-555-0140',
    location: 'Tampa, FL',
    specializations: ['Documentation', 'Client Communication'],
    avatar: 'JM'
  },
  {
    id: 'coord-4',
    name: 'David Brown',
    email: 'david@company.com',
    phone: '+1-555-0127',
    location: 'Miami, FL',
    specializations: ['Large Scale Projects', 'Equipment Management'],
    avatar: 'DB'
  }
];

export const ProjectCoordinatorModal: React.FC<ProjectCoordinatorModalProps> = ({
  isOpen,
  onClose,
  project,
  onAssignCoordinator
}) => {
  const navigate = useNavigate();
  const [selectedCoordinator, setSelectedCoordinator] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  if (!isOpen || !project) return null;

  const handleAssign = async () => {
    if (!selectedCoordinator) return;
    
    setIsAssigning(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onAssignCoordinator(project.id, selectedCoordinator);
      
      // Navigate to project details preparation stage
      navigate(`/projects/${project.id}?status=${project.status}&title=${encodeURIComponent(project.title)}`);
      
      onClose();
      setSelectedCoordinator(null);
    } catch (error) {
      console.error('Error assigning coordinator:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Assign Project Coordinator
              </h2>
              <p className="text-gray-600 mt-1">
                Select a coordinator for <span className="font-medium">{project.title}</span>
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              icon={X}
            >
              Close
            </Button>
          </div>

          {/* Project Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-500">Project ID</span>
                <p className="font-medium">{project.vinCode}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Status</span>
                <p className="font-medium">{project.status}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Location</span>
                <p className="font-medium">{project.location}</p>
              </div>
            </div>
          </div>

          {/* Coordinators List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Available Coordinators
            </h3>
            
            {mockCoordinators.map((coordinator) => (
              <div
                key={coordinator.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedCoordinator === coordinator.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCoordinator(coordinator.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {coordinator.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{coordinator.name}</h4>
                      <p className="text-sm text-gray-600">{coordinator.email}</p>
                      <p className="text-sm text-gray-500">{coordinator.location}</p>
                    </div>
                    <div className="flex items-center">
                      {selectedCoordinator === coordinator.id ? (
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>


          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isAssigning}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAssign}
              disabled={!selectedCoordinator || isAssigning}
              icon={isAssigning ? undefined : User}
            >
              {isAssigning ? 'Assigning...' : 'Assign Coordinator'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
