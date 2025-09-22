import React from "react";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext";
import { BreadcrumbProvider } from "../../contexts/BreadcrumbContext";
import { CollapsibleSidePanelProvider } from "../../common/components/CollapsibleSidePanel";

/**
 * Root component that wraps the entire application with providers
 * Used as the root element in the new router configuration
 */
export const Root: React.FC = () => {
  return (
    <AuthProvider>
      <BreadcrumbProvider>
        <CollapsibleSidePanelProvider>
          <Outlet />
        </CollapsibleSidePanelProvider>
      </BreadcrumbProvider>
    </AuthProvider>
  );
};
