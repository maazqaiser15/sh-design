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
  ChevronRight,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { Logo } from '../Logo';
import { useAuth } from '../../../contexts/AuthContext';
import { useSidebar } from '../../../contexts/SidebarContext';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  children?: NavigationItem[];
  permission?: string;
  hideOnMobile?: boolean;
}

const navigation: NavigationItem[] = [
  {
    name: 'Project Overview',
    href: '/',
    icon: LayoutDashboard,
    permission: 'dashboard',
  },
  {
    name: 'Project Portfolio',
    href: '/projects',
    icon: FolderOpen,
    permission: 'projects',
  },
  {
    name: 'Team Management',
    href: '/team',
    icon: Users,
    permission: 'team',
  },
  {
    name: 'Trailers Management',
    href: '/trailers',
    icon: Truck,
    permission: 'trailers',
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
  },
  // {
  //   name: 'Settings',
  //   href: '/settings',
  //   icon: Settings,
  //   permission: 'settings',
  // },
  {
    name: 'Resource Planning',
    href: '/team-gantt-chart',
    icon: Calendar,
    permission: 'scheduler',
    hideOnMobile: true,
  },
];

/**
 * Main navigation sidebar component
 * Provides module navigation with role-based access control
 */
export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileSidebar, isMobile, capabilities } = useSidebar();
  const [expandedItems, setExpandedItems] = React.useState<string[]>(['Projects']);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  const hasPermission = (permission?: string) => {
    if (!permission || !user) return true;
    
    // Hide dashboard for Project Coordinators (role 2)
    if (permission === 'dashboard' && user.userType === 'project-coordinator') {
      return false;
    }
    
    return user.permissions.some(p => p.module === permission && p.actions.length > 0);
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  // Touch gesture handling for mobile sidebar
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isMobile) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!isMobile || !touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && isMobileOpen) {
      closeMobileSidebar();
    }
    if (isRightSwipe && !isMobileOpen) {
      toggleSidebar();
    }
  };


  const renderNavItem = (item: NavigationItem, depth = 0) => {
    if (!hasPermission(item.permission)) return null;
    if (isMobile && item.hideOnMobile) return null;
    
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
                w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg transition-colors mobile-touch-target
                ${depth > 0 ? 'ml-4 pl-6' : ''}
                text-text-secondary hover:text-text-primary hover:bg-gray-100
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon size={18} />
                {!isCollapsed && <span>{item.name}</span>}
              </div>
              {!isCollapsed && (
                <ChevronRight
                  size={16}
                  className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
              )}
            </button>
          ) : (
            item.href?.startsWith('http') ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  flex items-center space-x-3  px-3 py-3 text-sm font-medium rounded-lg transition-colors mobile-touch-target
                  ${depth > 0 ? 'ml-4 pl-6' : ''}
                  text-text-secondary hover:text-text-primary hover:bg-gray-100
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon size={18} />
                {!isCollapsed && <span>{item.name}</span>}
              </a>
            ) : (
              <NavLink
                to={item.href || '#'}
                className={({ isActive }) => `
                  flex items-center space-x-3  justify-center md:justify-start px-[14px] py-3 text-sm font-medium rounded-lg transition-colors mobile-touch-target
                  ${depth > 0 ? 'ml-4 pl-6' : ''}
                  ${
                    isActive
                      ? 'bg-[#0D76BF] text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-gray-100'
                  }
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon size={18} />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            )
          )}
        </div>

        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children?.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}
      
      {/* Mobile-specific styles */}
      <style jsx>{`
        @media (max-width: 767px) {
          .mobile-touch-target {
            min-height: 44px;
            min-width: 44px;
            padding: 12px 16px;
          }
          .mobile-scroll {
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
      
      {/* Sidebar */}
      <div 
        className={`
          ${isMobile 
            ? `fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out ${
                isMobileOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : `fixed top-0 left-0 h-full z-30 transform transition-all duration-300 ease-in-out ${
                isCollapsed ? 'w-16' : 'w-64'
              }`
          } 
          sm:bg-transparent  bg-white flex flex-col
        `}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Header with Logo and Toggle Button */}
        <div className="px-4 py-4  flex items-center justify-between min-h-[80px]">
          {(!isCollapsed || isMobile) && (
            <div className="flex-1">
              <Logo size="md" textSize="sm" className="text-primary" />
              <p className="text-xs text-gray-500 mt-1 ml-11">
                Project Management
              </p>
            </div>
          )}
          <button
            onClick={isMobile ? closeMobileSidebar : toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0 mobile-touch-target"
            title={isMobile ? 'Close menu' : (isCollapsed ? 'Expand sidebar' : 'Collapse sidebar')}
          >
            {isMobile ? <ChevronLeft size={20} /> : (isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />)}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto mobile-scroll">
          {navigation.map(item => renderNavItem(item))}
        </nav>
      </div>
    </>
  );
};
