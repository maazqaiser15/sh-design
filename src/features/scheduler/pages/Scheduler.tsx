import React, { useState } from 'react';
import { SchedulerView, SchedulerProject, SchedulerMode } from '../types';
import { SchedulerHeader, DayView, WeekView, MonthView } from '../components';
import { TeamSchedulerView } from '../components/TeamSchedulerView';
import { MOCK_TEAM_MEMBERS } from '../utils/teamMockData';
import { TeamMemberProject } from '../types/teamScheduler';
import { MOCK_SCHEDULER_PROJECTS } from '../utils/mockData';

export const Scheduler: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<SchedulerView>('month');
  const [mode, setMode] = useState<SchedulerMode>('projects');
  const [hoveredProject, setHoveredProject] = useState<SchedulerProject | null>(null);
  const [hoveredTeamProject, setHoveredTeamProject] = useState<TeamMemberProject | null>(null);

  // Handle project click
  const handleProjectClick = (project: SchedulerProject) => {
    console.log('Project clicked:', project);
    // Future implementation: navigate to project detail screen
  };

  // Handle project hover
  const handleProjectHover = (project: SchedulerProject | null) => {
    setHoveredProject(project);
  };

  // Handle team project click
  const handleTeamProjectClick = (project: TeamMemberProject) => {
    console.log('Team project clicked:', project);
    // Future implementation: navigate to project detail screen
  };

  // Handle team project hover
  const handleTeamProjectHover = (project: TeamMemberProject | null) => {
    setHoveredTeamProject(project);
  };

  // Handle date change
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  // Handle view change
  const handleViewChange = (newView: SchedulerView) => {
    setView(newView);
  };

  // Handle mode change
  const handleModeChange = (newMode: SchedulerMode) => {
    setMode(newMode);
  };

  // Handle today click
  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  // Render the appropriate view
  const renderView = () => {
    // If team mode is selected, show team scheduler
    if (mode === 'team') {
      return (
        <TeamSchedulerView
          currentDate={currentDate}
          teamMembers={MOCK_TEAM_MEMBERS}
          onProjectClick={handleTeamProjectClick}
          onProjectHover={handleTeamProjectHover}
          hoveredProject={hoveredTeamProject}
        />
      );
    }


    // Otherwise render project views
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
        mode={mode}
        onDateChange={handleDateChange}
        onViewChange={handleViewChange}
        onModeChange={handleModeChange}
        onTodayClick={handleTodayClick}
      />

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderView()}
      </div>
    </div>
  );
};
