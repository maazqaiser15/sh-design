import React from "react";
import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../ProtectedRoute";
import { Layout } from "../../common/components/Layout";

/**
 * Protected layout wrapper that combines authentication check with main layout
 * Used for all authenticated routes in the new router configuration
 */
export const ProtectedLayout: React.FC = () => {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
};
