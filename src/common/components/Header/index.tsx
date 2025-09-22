import React from 'react';
import { Settings, Bell, User } from 'lucide-react';

/**
 * Application header with navigation and user actions
 */
export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-border px-7 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-h2 text-primary font-semibold">
            Project Management
          </h1>
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
