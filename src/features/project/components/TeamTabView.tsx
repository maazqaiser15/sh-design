import React from 'react';
import { TeamMember } from '../types/teamMembers';

interface TeamTabViewProps {
  assignedTeam: TeamMember[] | null;
}

const TeamTabView: React.FC<TeamTabViewProps> = ({ assignedTeam }) => {
  // Mock data for 5 team members as requested
  const mockTeamMembers: TeamMember[] = [
    {
      id: 'tm-001',
      name: 'John Smith',
      role: 'Lead Supervisor',
      status: 'Available',
      phone: '+1-555-0123',
      email: 'john@company.com',
      avatar: 'JS',
      location: 'Los Angeles, CA',
      experience: 8,
      specializations: ['Security Film', 'Window Installation', 'Team Management']
    },
    {
      id: 'tm-002',
      name: 'Sarah Johnson',
      role: 'Crew Leader',
      status: 'Available',
      phone: '+1-555-0124',
      email: 'sarah@company.com',
      avatar: 'SJ',
      location: 'Chicago, IL',
      experience: 6,
      specializations: ['Quality Control', 'Safety Protocols']
    },
    {
      id: 'tm-003',
      name: 'Mike Wilson',
      role: 'Installer',
      status: 'Available',
      phone: '+1-555-0125',
      email: 'mike@company.com',
      avatar: 'MW',
      location: 'Houston, TX',
      experience: 4,
      specializations: ['Precision Installation']
    },
    {
      id: 'tm-004',
      name: 'Emily Davis',
      role: 'Installer',
      status: 'Available',
      phone: '+1-555-0126',
      email: 'emily@company.com',
      avatar: 'ED',
      location: 'Phoenix, AZ',
      experience: 5,
      specializations: ['Commercial Projects']
    },
    {
      id: 'tm-005',
      name: 'David Brown',
      role: 'Installer',
      status: 'Available',
      phone: '+1-555-0127',
      email: 'david@company.com',
      avatar: 'DB',
      location: 'Miami, FL',
      experience: 3,
      specializations: ['Residential Projects']
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Lead Supervisor':
        return 'bg-blue-100 text-blue-800';
      case 'Crew Leader':
        return 'bg-green-100 text-green-800';
      case 'Installer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg text-[#101828] leading-7">Team Members</h3>
            <p className="font-normal text-sm text-[#475467] leading-5">
              {mockTeamMembers.length} team members assigned to this project
            </p>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTeamMembers.map((member) => (
            <div key={member.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-blue-800 text-sm">
                    {member.avatar}
                  </span>
                </div>

                {/* Member Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-[#101828] leading-5 truncate">
                      {member.name}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-xs text-[#475467]">{member.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-xs text-[#475467]">{member.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs text-[#475467]">{member.experience} years experience</span>
                    </div>
                  </div>

                  {/* Specializations */}
                  {member.specializations && member.specializations.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {member.specializations.slice(0, 2).map((spec, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            {spec}
                          </span>
                        ))}
                        {member.specializations.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{member.specializations.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Summary */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-blue-900">Team Composition</h4>
              <p className="text-xs text-blue-700">
                1 Lead Supervisor, 1 Crew Leader, 3 Installers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamTabView;
