import React from 'react';
import { ProjectPreparationData } from '../../types/preparation';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { Button } from '../../../../common/components/Button';

interface ProjectSummaryCardProps {
  data: ProjectPreparationData;
  onAssignTrailer: () => void;
}

/**
 * ProjectSummaryCard - Sticky top card showing project overview
 * Displays project name, VIN, status, location, crew progress, and trailer assignment
 */
export const ProjectSummaryCard: React.FC<ProjectSummaryCardProps> = ({
  data,
  onAssignTrailer
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      'UB': 'bg-blue-50 text-blue-800 border-blue-200',
      'WB': 'bg-teal-50 text-teal-800 border-teal-200',
      'WIP': 'bg-amber-50 text-amber-800 border-amber-200',
      'Completed': 'bg-green-50 text-green-800 border-green-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-50 text-gray-800 border-gray-200';
  };

  const getCrewDisplay = () => {
    const maxVisible = 3;
    const visibleCrew = data.crew.slice(0, maxVisible);
    const remainingCount = data.crew.length - maxVisible;

    return (
      <div className="flex items-center space-x-1">
        <div className="flex -space-x-2">
          {visibleCrew.map((member, index) => (
            <div
              key={member.id}
              className="relative group"
              title={`${member.name} - ${member.designation}`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  member.name.charAt(0).toUpperCase()
                )}
              </div>
              {member.status === 'unavailable' && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
              )}
            </div>
          ))}
        </div>
        {remainingCount > 0 && (
          <div className="ml-2 text-sm text-gray-500 group">
            +{remainingCount}
            <div className="absolute z-10 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-48">
              <div className="text-xs font-medium text-gray-900 mb-2">Full Team List</div>
              {data.crew.map((member) => (
                <div key={member.id} className="flex items-center space-x-2 py-1">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      member.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.designation}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    member.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        {/* Left side - Project details */}
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {data.projectName}
            </h1>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                {data.vinCode}
              </span>
              <StatusBadge
                status={data.status}
                className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(data.status)}`}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{data.location}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Crew Progress</span>
            </div>
          </div>
        </div>

        {/* Right side - Crew and Trailer */}
        <div className="flex items-center space-x-6">
          {/* Crew Progress */}
          <div className="flex flex-col items-end">
            <div className="text-sm font-medium text-gray-900 mb-1">
              {data.crew.length} members assigned
            </div>
            {getCrewDisplay()}
          </div>

          {/* Trailer Assignment */}
          <div className="flex flex-col items-end">
            {data.assignedTrailer ? (
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {data.assignedTrailer.trailerNumber}
                </div>
                <div className="text-xs text-gray-500">
                  {data.assignedTrailer.registrationNumber}
                </div>
                <div className="text-xs text-gray-500">
                  {data.assignedTrailer.location}
                </div>
              </div>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                onClick={onAssignTrailer}
                className="whitespace-nowrap"
              >
                Assign Trailer
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
