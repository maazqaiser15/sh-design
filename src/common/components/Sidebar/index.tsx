import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Truck,
  BarChart3,
  Calendar,
  Settings,
  ChevronRight
} from 'lucide-react';
import { Logo } from '../Logo';
import { useAuth } from '../../../contexts/AuthContext';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  children?: NavigationItem[];
  permission?: string;
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    permission: 'dashboard',
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: FolderOpen,
    permission: 'projects',
  },
  {
    name: 'Team',
    href: '/team',
    icon: Users,
    permission: 'team',
  },
  {
    name: 'Trailers',
    href: '/trailers',
    icon: Truck,
    permission: 'trailers',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    permission: 'settings',
  },
  {
    name: 'Schedular',
    href: '/team-gantt-chart',
    icon: Calendar,
    permission: 'scheduler',
  },
];

/**
 * Main navigation sidebar component
 * Provides module navigation with role-based access control
 */
export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['Projects']);

  const hasPermission = (permission?: string) => {
    if (!permission || !user) return true;
    return user.permissions.some(p => p.module === permission && p.actions.length > 0);
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderNavItem = (item: NavigationItem, depth = 0) => {
    if (!hasPermission(item.permission)) return null;
    
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const Icon = item.icon;

    return (
      <div key={item.name}>
        <div className="relative">
          {hasChildren ? (
            <button
              onClick={() => toggleExpanded(item.name)}
              className={`
                w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors
                ${depth > 0 ? 'ml-4 pl-6' : ''}
                text-text-secondary hover:text-text-primary hover:bg-gray-100
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon size={18} />
                <span>{item.name}</span>
              </div>
              <ChevronRight
                size={16}
                className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              />
            </button>
          ) : (
            item.href?.startsWith('http') ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${depth > 0 ? 'ml-4 pl-6' : ''}
                  text-text-secondary hover:text-text-primary hover:bg-gray-100
                `}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </a>
            ) : (
              <NavLink
                to={item.href || '#'}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${depth > 0 ? 'ml-4 pl-6' : ''}
                  ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            )
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-border h-full flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <Logo size="md" textSize="sm" className="text-primary" />
        <p className="text-caption text-text-muted mt-2 ml-11">
          Project Management
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigation.map(item => renderNavItem(item))}
      </nav>

      {/* User Info */}
      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
            {user?.avatar || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {user?.name}
            </p>
            <div className="flex items-center space-x-2">
              <p className="text-xs text-text-muted truncate">
                {user?.role.name}
              </p>
              {user?.isDemo && (
                <span className="px-1.5 py-0.5 bg-secondary-teal/10 text-secondary-teal text-xs rounded-full">
                  Demo
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
