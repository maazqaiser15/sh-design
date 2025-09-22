import React, { useState } from 'react';
import { SchedulerView, SchedulerProject } from '../types';
import { SchedulerHeader } from '../components/SchedulerHeader';
import { DayView } from '../components/DayView';
import { WeekView } from '../components/WeekView';
import { MonthView } from '../components/MonthView';
import { MOCK_SCHEDULER_PROJECTS } from '../utils/mockData';

export const Scheduler: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<SchedulerView>('month');
  const [hoveredProject, setHoveredProject] = useState<SchedulerProject | null>(null);

  // Handle project click
  const handleProjectClick = (project: SchedulerProject) => {
    console.log('Project clicked:', project);
    // Future implementation: navigate to project detail screen
  };

  // Handle project hover
  const handleProjectHover = (project: SchedulerProject | null) => {
    setHoveredProject(project);
  };

  // Handle date change
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  // Handle view change
  const handleViewChange = (newView: SchedulerView) => {
    setView(newView);
  };

  // Handle today click
  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  // Render the appropriate view
  const renderView = () => {
    const commonProps = {
      currentDate,
      projects: MOCK_SCHEDULER_PROJECTS,
      onProjectClick: handleProjectClick,
      onProjectHover: handleProjectHover,
      hoveredProject,
    };

    switch (view) {
      case 'day':
        return <DayView {...commonProps} />;
      case 'week':
        return <WeekView {...commonProps} />;
      case 'month':
        return <MonthView {...commonProps} />;
      default:
        return <MonthView {...commonProps} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <SchedulerHeader
        currentDate={currentDate}
        view={view}
        onDateChange={handleDateChange}
        onViewChange={handleViewChange}
        onTodayClick={handleTodayClick}
      />

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderView()}
      </div>
    </div>
  );
};
