import React from 'react';
import { Settings, Bell, User, ArrowLeft } from 'lucide-react';

/**
 * Application header with navigation and user actions
 */
export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-border px-7 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Back Arrow */}
          <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
          
          {/* Navigation Labels */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded-sm"></div>
              </div>
              <span className="text-sm font-medium text-text-secondary">DASHBOARD</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-sm"></div>
              </div>
              <span className="text-sm font-medium text-text-primary">PROJECT</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="btn-icon" title="Notifications">
            <Bell size={20} className="text-text-secondary" />
          </button>
          <button className="btn-icon" title="Settings">
            <Settings size={20} className="text-text-secondary" />
          </button>
          <button className="btn-icon" title="Profile">
            <User size={20} className="text-text-secondary" />
          </button>
        </div>
      </div>
    </header>
  );
};
