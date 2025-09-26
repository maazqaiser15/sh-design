import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Truck, 
  Calendar,
  Settings 
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useSidebar } from '../../../contexts/SidebarContext';

interface MobileBottomNavProps {
  className?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  permission?: string;
}

const navigation: NavItem[] = [
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
    name: 'Schedule',
    href: '/team-gantt-chart',
    icon: Calendar,
    permission: 'scheduler',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    permission: 'settings',
  },
];

/**
 * Mobile bottom navigation component
 * Provides primary navigation for mobile devices
 * Only visible on mobile screens
 */
export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { isMobile } = useSidebar();

  const hasPermission = (permission?: string) => {
    if (!permission || !user) return true;
    return user.permissions.some(p => p.module === permission && p.actions.length > 0);
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  if (!isMobile) return null;

  return (
    <nav className={`mobile-bottom-nav ${className}`}>
      <div className="flex items-center justify-around">
        {navigation
          .filter(item => hasPermission(item.permission))
          .map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`
                  flex flex-col items-center justify-center p-2 rounded-lg transition-colors
                  ${active 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
                aria-label={item.name}
              >
                <Icon 
                  size={20} 
                  className={active ? 'text-blue-600' : 'text-gray-600'}
                />
                <span className="text-xs font-medium mt-1">
                  {item.name}
                </span>
              </button>
            );
          })}
      </div>
    </nav>
  );
};
