import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Plus, Package, Film, MapPin } from 'lucide-react';
import { Card } from '../../common/components/Card';
import { Button } from '../../common/components/Button';

/**
 * Empty state component for when no trailers exist
 * Provides a welcoming interface to create the first trailer
 */
export const TrailerEmptyState: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateFirstTrailer = () => {
    navigate('/trailers/create');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Main Empty State Card */}
        <Card className="text-center py-12">
          {/* Icon */}
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Truck size={48} className="text-blue-600" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            No Trailers Yet
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Get started by adding your first trailer to manage inventory, track locations, and streamline your operations.
          </p>

          {/* CTA Button */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreateFirstTrailer}
            icon={Plus}
            className="mb-8"
          >
            Create Your First Trailer
          </Button>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Package size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Tool Management</h3>
              <p className="text-sm text-gray-600">
                Track tools and equipment with real-time inventory levels
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Film size={24} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Film Inventory</h3>
              <p className="text-sm text-gray-600">
                Monitor film sheet stock and get low inventory alerts
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <MapPin size={24} className="text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Location Tracking</h3>
              <p className="text-sm text-gray-600">
                Keep track of trailer locations and parking addresses
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Tips */}
        <Card className="mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Getting Started Tips</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">1</span>
              </div>
              <div>
                <p className="text-sm text-gray-900 font-medium">Set up basic information</p>
                <p className="text-sm text-gray-600">Add trailer name, registration number, and parking address</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">2</span>
              </div>
              <div>
                <p className="text-sm text-gray-900 font-medium">Configure inventory thresholds</p>
                <p className="text-sm text-gray-600">Set minimum stock levels for tools and film sheets</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">3</span>
              </div>
              <div>
                <p className="text-sm text-gray-900 font-medium">Start tracking</p>
                <p className="text-sm text-gray-600">Monitor inventory levels and get automated alerts</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
