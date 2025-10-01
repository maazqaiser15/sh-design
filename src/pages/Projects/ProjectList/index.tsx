import React from "react";
import { ProjectListPage } from "../../../features/project";
import { useSetBreadcrumbs } from "../../../contexts/BreadcrumbContext";

export const ProjectList: React.FC = () => {
  useSetBreadcrumbs([
    { label: "Project Portfolio", href: "/projects" },
  ]);

  return <ProjectListPage />;
};