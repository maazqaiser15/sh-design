import React from "react";
import { ProjectListPage } from "../../../features/project";
import { useSetBreadcrumbs } from "../../../contexts/BreadcrumbContext";

export const ProjectList: React.FC = () => {
  useSetBreadcrumbs([
    { label: "Projects", href: "/projects" },
  ]);

  return <ProjectListPage />;
};