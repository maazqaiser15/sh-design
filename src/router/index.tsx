import React from "react";
import { RouteObject } from "react-router-dom";
import { Root } from "../components/Root";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ProtectedLayout } from "../components/ProtectedLayout";
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
              const { DashboardWrapper } = await import("../components/DashboardWrapper");
              return { element: <DashboardWrapper /> };
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
            path: "projects/:projectId",
            async lazy() {
              const { ProjectDetailsPage } = await import(
                "../features/project/pages/ProjectDetailsPage"
              );
              return { element: <ProjectDetailsPage /> };
            },
          },
          {
            path: "projects/:projectId/coming-soon",
            async lazy() {
              const { ProjectComingSoon } = await import(
                "../pages/ProjectComingSoon"
              );
              return { element: <ProjectComingSoon /> };
            },
          },
          {
            path: "projects/role3-project-wip",
            async lazy() {
              const { ProjectDetailsWIP } = await import(
                "../features/project/pages/ProjectDetailsPage/ProjectDetailsWIP"
              );
              return { element: <ProjectDetailsWIP projectStatus="WIP" /> };
            },
          },

          // Team Routes
          {
            path: "team",
            children: [
              {
                index: true,
                async lazy() {
                  const { Team } = await import("../pages/Team");
                  return { element: <Team /> };
                },
              },
              {
                path: ":memberId",
                async lazy() {
                  const { TeamMemberDetail } = await import("../pages/Team/TeamMemberDetail");
                  return { element: <TeamMemberDetail /> };
                },
              },
            ],
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
                path: "empty",
                async lazy() {
                  const { TrailerEmptyState } = await import("../pages/Trailers/TrailerEmptyState");
                  return { element: <TrailerEmptyState /> };
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

          // Team Scheduler Route
          {
            path: "team-gantt-chart",
            async lazy() {
              const { TeamGanttChart } = await import("../pages/TeamGanttChart");
              return { element: <TeamGanttChart /> };
            },
          },

        {
          path: "design-system",
          element: <DesignSystemLibrary />,
        },
        {
          path: "project-details-demo",
          async lazy() {
            const { ProjectDetailsDemo } = await import("../pages/ProjectDetailsDemo");
            return { element: <ProjectDetailsDemo /> };
          },
        },
        {
          path: "project-date-setup-demo",
          async lazy() {
            const { ProjectDateSetupDemo } = await import("../pages/ProjectDateSetupDemo");
            return { element: <ProjectDateSetupDemo /> };
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
