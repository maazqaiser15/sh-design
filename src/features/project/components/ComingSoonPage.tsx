import React from 'react';
import { Clock, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../../common/components/Button';

export const ComingSoonPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const projectTitle = searchParams.get('title') || 'Project';
  const projectStatus = searchParams.get('status') || 'Unknown';

  const getStatusMessage = (status: string): string => {
    switch (status) {
      case 'WIP':
        return 'Work In Progress details are coming soon!';
      case 'QF':
        return 'Quality Check details are coming soon!';
      case 'Completed':
        return 'Completed project details are coming soon!';
      default:
        return 'Project details are coming soon!';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'WIP':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'QF':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Completed':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>

          {/* Status Badge */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getStatusColor(projectStatus)}`}>
            {projectStatus}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {projectTitle}
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-8">
            {getStatusMessage(projectStatus)}
          </p>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-500">
              We're working hard to bring you detailed project management features for {projectStatus} status projects. 
              This will include comprehensive tracking, reporting, and management tools.
            </p>
          </div>

          {/* Back Button */}
          <Button
            onClick={() => navigate('/projects')}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    </div>
  );
};
