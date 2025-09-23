import { TeamMember, ProjectView } from '../types/ganttTypes';

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
