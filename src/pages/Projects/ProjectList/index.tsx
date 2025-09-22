import React from "react";
import { ProjectListPage } from "../../../features/project";
import { useSetBreadcrumbs } from "../../../contexts/BreadcrumbContext";

export const ProjectList: React.FC = () => {
  useSetBreadcrumbs([
    { label: "Dashboard", href: "/" },
    { label: "Projects", href: "/projects" },
  ]);

  return <ProjectListPage />;
};