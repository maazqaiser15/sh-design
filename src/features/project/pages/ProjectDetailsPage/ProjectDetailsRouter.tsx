import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ProjectDetails, MOCK_PROJECT_DETAILS } from '../../types/projectDetails';
import { useSetBreadcrumbs } from '../../../../contexts/BreadcrumbContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { ProjectDetailsPrep } from './ProjectDetailsPrep';
import { ProjectDetailsWIP } from './ProjectDetailsWIP';
import { ProjectDetailsQF } from './ProjectDetailsQF';
import { ProjectDetailsComplete } from './ProjectDetailsComplete';

/**
 * ProjectDetailsRouter - Routes to different project detail layouts based on status
 * - D75, PV90, UB, WB: Shows preparation stage layout
 * - WIP: Shows work-in-progress layout
 * - QF: Shows quality check layout
 * - Completed: Shows completion layout
 */
export const ProjectDetailsRouter: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const [project, setProject] = useState<ProjectDetails>(MOCK_PROJECT_DETAILS);
  const { user } = useAuth();
  
  // Get project status and title from URL params or project data
  const statusFromUrl = searchParams.get('status');
  const projectTitle = searchParams.get('title');
  const projectStatus = statusFromUrl || project.status;
  
  // Set breadcrumbs for project details
  useSetBreadcrumbs([
    { label: 'Project Portfolio', href: '/projects' },
    { label: 'Project Details', href: undefined }
  ], [projectId, projectTitle, project.title]);

  // Determine which layout to show based on status
  const isPreparationStage = ['D75', 'PV90', 'UB', 'WB'].includes(projectStatus);
  const isWorkInProgressStage = projectStatus === 'WIP';
  const isQualityCheckStage = projectStatus === 'QF';
  const isCompletedStage = projectStatus === 'Completed';

  // In a real app, you would fetch the project data based on projectId
  useEffect(() => {
    // Mock: Update project status based on URL params
    if (statusFromUrl) {
      setProject(prev => ({
        ...prev,
        status: statusFromUrl as any
      }));
    }
  }, [statusFromUrl]);

  // Route to appropriate component based on status
  if (isPreparationStage) {
    return <ProjectDetailsPrep />;
  }
  
  if (isWorkInProgressStage) {
    return <ProjectDetailsWIP projectStatus="WIP" />;
  }

  if (isQualityCheckStage) {
    return <ProjectDetailsQF projectStatus="QF" />;
  }

  if (isCompletedStage) {
    return <ProjectDetailsComplete projectStatus="Completed" />;
  }

  // Default fallback to preparation stage
  return <ProjectDetailsPrep />;
};
