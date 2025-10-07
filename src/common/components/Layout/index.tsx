import React from "react";
import { Sidebar } from "../Sidebar";
import { TopBar } from "../TopBar";
import { useSidebar } from "../../../contexts/SidebarContext";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout component with sidebar navigation and top bar
 * Provides the overall application structure
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isCollapsed, isMobile, isMobileOpen } = useSidebar();

  return (
    <div className="h-screen bg-gray-50 backgroung-image-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={`
        h-full flex flex-col overflow-hidden transition-all duration-300
        ${isMobile 
          ? 'ml-0' 
          : isCollapsed 
            ? 'ml-16' 
            : 'ml-64'
        }
      `}>
        {/* Top Bar with Breadcrumbs */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-4 px-4">{children}</div>
        </main>
      </div>
    </div>
  );
};
