import { TeamMember, ProjectView, TrailerView, Project, ViewMode } from '../types/ganttTypes';

export const transformTeamDataToProjectView = (teamMembers: TeamMember[]): ProjectView[] => {
  const projectMap = new Map<string, ProjectView>();

  teamMembers.forEach(member => {
    member.projects.forEach(project => {
      if (!projectMap.has(project.projectId)) {
        projectMap.set(project.projectId, {
          projectId: project.projectId,
          projectName: project.projectName,
          status: project.status,
          startDate: project.startDate,
          endDate: project.endDate,
          assignedMembers: []
        });
      }

      const projectView = projectMap.get(project.projectId)!;
      projectView.assignedMembers.push({
        memberId: member.id,
        memberName: member.name,
        role: member.role,
        projectRole: project.role
      });
    });
  });

  return Array.from(projectMap.values()).sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
};

export const transformTrailerDataToProjectView = (trailers: TrailerView[]): ProjectView[] => {
  const projectMap = new Map<string, ProjectView>();

  trailers.forEach(trailer => {
    trailer.assignedProjects.forEach(project => {
      if (!projectMap.has(project.projectId)) {
        projectMap.set(project.projectId, {
          projectId: project.projectId,
          projectName: project.projectName,
          status: project.projectStatus,
          startDate: project.startDate,
          endDate: project.endDate,
          assignedMembers: []
        });
      }

      const projectView = projectMap.get(project.projectId)!;
      projectView.assignedMembers.push({
        memberId: trailer.trailerId,
        memberName: trailer.trailerName,
        role: 'Trailer',
        projectRole: project.role
      });
    });
  });

  return Array.from(projectMap.values()).sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
};

export const getTimelineCells = (currentDate: Date, viewMode: ViewMode) => {
  const cells = [];
  const today = new Date();
  
  if (viewMode === 'week') {
    // Get the start of the week (Monday)
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const cellDate = new Date(startOfWeek);
      cellDate.setDate(startOfWeek.getDate() + i);
      
      cells.push({
        date: cellDate,
        label: cellDate.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit' }),
        isToday: cellDate.toDateString() === today.toDateString(),
        isCurrentPeriod: true
      });
    }
  } else if (viewMode === 'month') {
    // Get the start of the month
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = endOfMonth.getDate();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      
      cells.push({
        date: cellDate,
        label: cellDate.toLocaleDateString('en-US', { day: '2-digit' }),
        isToday: cellDate.toDateString() === today.toDateString(),
        isCurrentPeriod: true
      });
    }
  } else if (viewMode === 'day') {
    const cellDate = new Date(currentDate);
    cells.push({
      date: cellDate,
      label: cellDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit' }),
      isToday: cellDate.toDateString() === today.toDateString(),
      isCurrentPeriod: true
    });
  } else if (viewMode === 'year') {
    // Get the start of the year
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    
    for (let i = 0; i < 12; i++) {
      const cellDate = new Date(currentDate.getFullYear(), i, 1);
      
      cells.push({
        date: cellDate,
        label: cellDate.toLocaleDateString('en-US', { month: 'short' }),
        isToday: cellDate.getMonth() === today.getMonth() && cellDate.getFullYear() === today.getFullYear(),
        isCurrentPeriod: true
      });
    }
  }
  
  return cells;
};

export const getProjectBarPosition = (project: Project, currentDate: Date, viewMode: ViewMode) => {
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.endDate);
  
  let startPosition = 0;
  let width = 0;
  
  if (viewMode === 'week') {
    // Get the start of the week (Monday)
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    // Check if project is within the current week
    if (endDate < startOfWeek || startDate > endOfWeek) {
      return { startPosition: 0, width: 0 };
    }
    
    // Calculate position within the week
    const weekStart = startOfWeek.getTime();
    const weekEnd = endOfWeek.getTime();
    const projectStart = Math.max(startDate.getTime(), weekStart);
    const projectEnd = Math.min(endDate.getTime(), weekEnd);
    
    startPosition = ((projectStart - weekStart) / (weekEnd - weekStart)) * 100;
    width = ((projectEnd - projectStart) / (weekEnd - weekStart)) * 100;
  } else if (viewMode === 'month') {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Check if project is within the current month
    if (endDate < startOfMonth || startDate > endOfMonth) {
      return { startPosition: 0, width: 0 };
    }
    
    const monthStart = startOfMonth.getTime();
    const monthEnd = endOfMonth.getTime();
    const projectStart = Math.max(startDate.getTime(), monthStart);
    const projectEnd = Math.min(endDate.getTime(), monthEnd);
    
    startPosition = ((projectStart - monthStart) / (monthEnd - monthStart)) * 100;
    width = ((projectEnd - projectStart) / (monthEnd - monthStart)) * 100;
  } else if (viewMode === 'day') {
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);
    
    // Check if project is within the current day
    if (endDate < dayStart || startDate > dayEnd) {
      return { startPosition: 0, width: 0 };
    }
    
    const dayStartTime = dayStart.getTime();
    const dayEndTime = dayEnd.getTime();
    const projectStart = Math.max(startDate.getTime(), dayStartTime);
    const projectEnd = Math.min(endDate.getTime(), dayEndTime);
    
    startPosition = ((projectStart - dayStartTime) / (dayEndTime - dayStartTime)) * 100;
    width = ((projectEnd - projectStart) / (dayEndTime - dayStartTime)) * 100;
  } else if (viewMode === 'year') {
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
    
    // Check if project is within the current year
    if (endDate < startOfYear || startDate > endOfYear) {
      return { startPosition: 0, width: 0 };
    }
    
    // For year view, calculate position based on month within the year
    const projectStartMonth = startDate.getMonth();
    const projectEndMonth = endDate.getMonth();
    
    // Each month takes up 100/12 = 8.33% of the timeline
    const monthWidth = 100 / 12;
    
    // Calculate start position based on the month
    startPosition = projectStartMonth * monthWidth;
    
    // Calculate width based on the number of months the project spans
    const monthsSpan = projectEndMonth - projectStartMonth + 1;
    width = monthsSpan * monthWidth;
  }
  
  return { startPosition, width };
};
