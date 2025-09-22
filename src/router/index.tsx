import React from "react";
import { RouteObject } from "react-router-dom";
import { Root } from "../components/Root";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ProtectedLayout } from "../components/ProtectedLayout";
import { Scheduler } from "../pages/Scheduler";
import DesignSystemLibrary from "../components/DesignSystemLibrary";

/**
 * Coming Soon placeholder component for unimplemented routes
 */
const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-8 text-center text-text-muted">{title} - Coming Soon</div>
);

/**
 * Modern React Router configuration using createBrowserRouter API
 * Features lazy loading, error boundaries, and nested protected routes
 */
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorBoundary />,
    children: [
      // Public Routes
      {
        path: "login",
        async lazy() {
          const { Login } = await import("../pages/Login");
          return { element: <Login /> };
        },
      },
      {
        path: "forgot-password",
        async lazy() {
          const { ForgotPassword } = await import("../pages/ForgotPassword");
          return { element: <ForgotPassword /> };
        },
      },
      {
        path: "reset-password",
        async lazy() {
          const { ResetPassword } = await import("../pages/ResetPassword");
          return { element: <ResetPassword /> };
        },
      },

      // Protected Routes
      {
        path: "",
        element: <ProtectedLayout />,
        children: [
          // Dashboard (Root)
          {
            index: true,
            async lazy() {
              const { Dashboard } = await import("../pages/Dashboard");
              return { element: <Dashboard /> };
            },
          },

          // Projects Routes
          {
            path: "projects",
            async lazy() {
              const { ProjectList } = await import(
                "../pages/Projects/ProjectList"
              );
              return { element: <ProjectList /> };
            },
          },
          {
            path: "projects/:projectId/preparation",
            async lazy() {
              const { ProjectPreparationPage } = await import(
                "../features/project/pages/ProjectPreparationPage"
              );
              return { element: <ProjectPreparationPage /> };
            },
          },
          {
            path: "projects/:projectId",
            async lazy() {
              const { ProjectDetailsPage } = await import(
                "../features/project/pages/ProjectDetailsPage"
              );
              return { element: <ProjectDetailsPage /> };
            },
          },

          // Team Route
          {
            path: "team",
            async lazy() {
              const { Team } = await import("../pages/Team");
              return { element: <Team /> };
            },
          },

          // Trailers Routes
          {
            path: "trailers",
            children: [
              {
                index: true,
                async lazy() {
                  const { Trailers } = await import("../pages/Trailers");
                  return { element: <Trailers /> };
                },
              },
              {
                path: ":trailerId",
                async lazy() {
                  const { Trailers } = await import("../pages/Trailers");
                  return { element: <Trailers /> };
                },
              },
            ],
          },

          // Scheduler Route
        {
          path: "scheduler",
          element: <Scheduler />,
        },
        {
          path: "design-system",
          element: <DesignSystemLibrary />,
        },
        {
          path: "project-preparation-demo",
          async lazy() {
            const { ProjectPreparationDemo } = await import("../pages/ProjectPreparationDemo");
            return { element: <ProjectPreparationDemo /> };
          },
        },
        {
          path: "project-details-demo",
          async lazy() {
            const { ProjectDetailsDemo } = await import("../pages/ProjectDetailsDemo");
            return { element: <ProjectDetailsDemo /> };
          },
        },

          // Coming Soon Routes
          {
            path: "settings",
            element: <ComingSoon title="Settings" />,
          },
        ],
      },
    ],
  },
];
