import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Dashboard } from '../../pages/Dashboard';

/**
 * Dashboard wrapper component that handles role-based access
 * Redirects Project Coordinators (role 2) to projects page
 */
export const DashboardWrapper: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect Project Coordinators (role 2) to projects page
    if (user?.userType === 'project-coordinator') {
      navigate('/projects', { replace: true });
    }
  }, [user, navigate]);

  // Don't render dashboard for Project Coordinators
  if (user?.userType === 'project-coordinator') {
    return null;
  }

  return <Dashboard />;
};
