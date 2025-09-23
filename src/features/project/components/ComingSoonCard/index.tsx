import React from 'react';
import { Card } from '../../../../common/components/Card';
import { Clock, ArrowRight } from 'lucide-react';

interface ComingSoonCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  stageName: string;
}

/**
 * ComingSoonCard - Shows a coming soon message for stages not yet implemented
 */
export const ComingSoonCard: React.FC<ComingSoonCardProps> = ({
  title,
  description,
  icon,
  stageName
}) => {
  return (
    <Card className="p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      
      <p className="text-sm text-gray-500 mb-6 max-w-sm">
        {description}
      </p>
      
      <div className="flex items-center space-x-2 text-blue-600">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">Coming Soon in {stageName}</span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </Card>
  );
};
