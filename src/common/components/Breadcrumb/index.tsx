import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<any>;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

/**
 * Breadcrumb navigation component
 * Automatically generates breadcrumbs from URL or accepts custom items
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHome = true,
  className = ''
}) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs if no custom items provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(location.pathname);
  
  // Add home breadcrumb if enabled
  const allItems = showHome 
    ? [{ label: 'Project Overview', href: '/', icon: Home }, ...breadcrumbItems]
    : breadcrumbItems;

  // Don't show breadcrumb if we're on home page and only have home item
  if (allItems.length <= 1 && showHome && location.pathname === '/') {
    return null;
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const IconComponent = item.icon;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight size={16} className="text-gray-400 mx-2" />
              )}
              
              {isLast || !item.href ? (
                <span className="flex items-center text-gray-900 font-medium">
                  {IconComponent && (
                    <IconComponent size={16} className="mr-2 text-gray-600" />
                  )}
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="flex items-center text-gray-600 hover:text-primary transition-colors"
                >
                  {IconComponent && (
                    <IconComponent size={16} className="mr-2" />
                  )}
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

/**
 * Generate breadcrumbs automatically from the current path
 */
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  // Skip root path
  if (pathname === '/') return [];
  
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  pathSegments.forEach((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = formatSegmentLabel(segment, pathSegments, index);
    
    breadcrumbs.push({
      label,
      href: index === pathSegments.length - 1 ? undefined : href, // Last item shouldn't be clickable
    });
  });
  
  return breadcrumbs;
}

/**
 * Format path segment into a readable label
 */
function formatSegmentLabel(segment: string, allSegments: string[], index: number): string {
  // Handle specific route patterns
  const routeLabels: Record<string, string> = {
    'projects': 'Project Portfolio',
    'project': 'Project Details',
    'preparation': 'Preparation',
    'execution': 'Execution', 
    'completion': 'Completion',
    'team': 'Team Management',
    'trailers': 'Trailers Management',
    'trailer': 'Trailer Details',
    'scheduler': 'Resource Planning',
    'documents': 'Documents',
    'settings': 'Settings',
    'coming-soon': 'Coming Soon',
    'team-gantt-chart': 'Resource Planning',
  };

  // Check if it's a UUID or ID (for dynamic routes)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);
  const isId = isUuid || (/^[a-zA-Z0-9_-]+$/.test(segment) && segment.length > 5);
  
  if (isId) {
    // For IDs, try to infer the type from the previous segment
    const previousSegment = allSegments[index - 1];
    if (previousSegment === 'projects') {
      return isUuid ? `Project Details - ${segment.substring(0, 8)}...` : `Project Details - ${segment}`;
    }
    if (previousSegment === 'trailers') {
      return isUuid ? `Trailer Details - ${segment.substring(0, 8)}...` : `Trailer Details - ${segment}`;
    }
    if (previousSegment === 'team') {
      return isUuid ? `Team Member - ${segment.substring(0, 8)}...` : `Team Member - ${segment}`;
    }
    return isUuid ? `${segment.substring(0, 8)}...` : segment;
  }

  // Return mapped label or capitalize the segment
  return routeLabels[segment.toLowerCase()] || 
         segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
}

/**
 * Hook to get current breadcrumb items
 */
export const useBreadcrumbs = (customItems?: BreadcrumbItem[]) => {
  const location = useLocation();
  return customItems || generateBreadcrumbsFromPath(location.pathname);
};
