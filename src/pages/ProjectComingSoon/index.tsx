import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../../common/components/Button';
import { Card } from '../../common/components/Card';

export const ProjectComingSoon: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const status = searchParams.get('status') || 'WIP';
  const title = searchParams.get('title') || 'Project';

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'WIP':
        return {
          icon: <Clock className="w-8 h-8 text-blue-500" />,
          title: 'Work in Progress',
          description: 'This project is currently in progress. The detailed project management interface is being developed.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'QF':
        return {
          icon: <CheckCircle className="w-8 h-8 text-orange-500" />,
          title: 'Quality Check',
          description: 'This project is in the quality check phase. The quality management interface is being developed.',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
      case 'Completed':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          title: 'Project Completed',
          description: 'This project has been completed. The project completion interface is being developed.',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      default:
        return {
          icon: <AlertCircle className="w-8 h-8 text-gray-500" />,
          title: 'Coming Soon',
          description: 'This project interface is being developed.',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="p-8 text-center">
          <div className={`mx-auto w-16 h-16 ${statusInfo.bgColor} ${statusInfo.borderColor} border-2 rounded-full flex items-center justify-center mb-6`}>
            {statusInfo.icon}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color} mb-6`}>
            {statusInfo.title}
          </div>
          
          <p className="text-gray-600 mb-8">
            {statusInfo.description}
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={() => navigate('/projects')}
              variant="secondary"
              icon={ArrowLeft}
              className="w-full"
            >
              Back to Projects
            </Button>
            
            <p className="text-sm text-gray-500">
              Project ID: {projectId}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
