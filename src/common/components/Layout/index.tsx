import React from "react";
import { Sidebar } from "../Sidebar";
import { TopBar } from "../TopBar";
import { MobileBottomNav } from "../MobileBottomNav";
import { useSidebar } from "../../../contexts/SidebarContext";

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Main layout component with sidebar navigation and top bar
 * Provides the overall application structure
 */
export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isCollapsed && !isMobile ? 'ml-0' : ''}`}>
        {/* Top Bar with Breadcrumbs */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-4 px-4 sm:py-6 sm:px-16 pb-20 sm:pb-6">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};
