import React, { useState } from 'react';
import { Bell, LogOut, Menu, User, Settings } from 'lucide-react';
import { Button } from '../Button';
import { Breadcrumb } from '../Breadcrumb';
import { NotificationsOverlay, Notification } from '../NotificationsOverlay';
import { useAuth } from '../../../contexts/AuthContext';
import { useBreadcrumbContext } from '../../../contexts/BreadcrumbContext';
import { useSidebar } from '../../../contexts/SidebarContext';
import { useNavigate } from 'react-router-dom';

/**
 * Top navigation bar component
 * Provides breadcrumbs, notifications, and user actions with authentication
 */
export const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { customBreadcrumbs } = useBreadcrumbContext();
  const { isMobile, toggleMobileSidebar } = useSidebar();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Project Status Update',
      message: 'Downtown Office Complex project has moved to WB status',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      read: false,
      actionUrl: '/projects/proj-001'
    },
    {
      id: '2',
      title: 'Team Assignment Complete',
      message: '3 team members have been assigned to Project TXDA-SJ1BR1-EETUSC01-P20001',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
      actionUrl: '/projects/proj-001'
    },
    {
      id: '3',
      title: 'Trailer Inventory Low',
      message: 'Trailer TR-2024-002 is running low on protective film stock',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      read: true,
      actionUrl: '/trailers/tr-2024-002'
    },
    {
      id: '4',
      title: 'Document Upload Required',
      message: 'Site map document is required for Project TXDA-SJ1BR1-EETUSC01-P20003',
      type: 'error',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
      read: true,
      actionUrl: '/projects/proj-003'
    },
    {
      id: '5',
      title: 'Travel Confirmation',
      message: 'Hotel booking confirmed for Downtown Office Complex project team',
      type: 'success',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      read: true,
      actionUrl: '/projects/proj-001'
    }
  ]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="bg-white border-b border-border px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={toggleMobileSidebar}
              className="p-2 text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-lg transition-colors mr-2"
            >
              <Menu size={20} />
            </button>
          )}
          
          {/* Breadcrumbs - Hidden on mobile */}
          <div className="flex-1 hidden sm:block">
            <Breadcrumb items={customBreadcrumbs || undefined} />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                {user?.avatar || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-text-primary">
                  {user?.name}
                  {user?.isDemo && <span className="ml-1 text-xs text-secondary-teal">(Demo)</span>}
                </p>
                <p className="text-xs text-text-muted">{user?.role.name}</p>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border z-50">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                    <p className="text-xs text-text-muted">{user?.email}</p>
                    {user?.isDemo && (
                      <span className="inline-block mt-1 px-2 py-1 bg-secondary-teal/10 text-secondary-teal text-xs rounded-full">
                        Demo Account
                      </span>
                    )}
                  </div>
                  
                  {/* Profile Settings Button */}
                  <button
                    onClick={() => {
                      navigate('/settings/profile');
                      setShowUserMenu(false); // Close dropdown after navigation
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <Settings size={16} />
                    <span>Profile Settings</span>
                  </button>
                  
                  {/* View Profile Button - Only show for execution-team users */}
                  {user?.userType === 'execution-team' && (
                    <button
                      onClick={() => {
                        // Map current user to team member ID for demo purposes
                        const teamMemberId = 'tm-001'; // John Smith - first team member
                        navigate(`/team/${teamMemberId}`);
                        setShowUserMenu(false); // Close dropdown after navigation
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <User size={16} />
                      <span>View Profile</span>
                    </button>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </header>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Notifications Overlay */}
      <NotificationsOverlay
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDeleteNotification={handleDeleteNotification}
      />
    </>
  );
};
