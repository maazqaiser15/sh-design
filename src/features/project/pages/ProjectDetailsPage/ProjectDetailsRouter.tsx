import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ProjectDetails, MOCK_PROJECT_DETAILS } from '../../types/projectDetails';
import { ProjectDetailsPrep } from './ProjectDetailsPrep';
import { ProjectDetailsWIP } from './ProjectDetailsWIP';

/**
 * ProjectDetailsRouter - Routes to different project detail layouts based on status
 * - PV75, PV90, UB, WB: Shows preparation stage layout
 * - WIP, QF, Completed: Shows work-in-progress layout
 */
export const ProjectDetailsRouter: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const [project, setProject] = useState<ProjectDetails>(MOCK_PROJECT_DETAILS);
  
  // Get project status from URL params or project data
  const statusFromUrl = searchParams.get('status');
  const projectStatus = statusFromUrl || project.status;

  // Determine which layout to show based on status
  const isPreparationStage = ['PV75', 'PV90', 'UB', 'WB'].includes(projectStatus);
  const isWorkInProgressStage = ['WIP', 'QF', 'Completed'].includes(projectStatus);

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
    return <ProjectDetailsWIP projectStatus={projectStatus as 'WIP' | 'QF' | 'Completed'} />;
  }

  // Default fallback to preparation stage
  return <ProjectDetailsPrep />;
};
