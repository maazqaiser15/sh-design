import React from 'react';
import { Card } from '../../../../common/components/Card';
import { User, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface TeamMemberPerformance {
  id: string;
  name: string;
  role: string;
  done: number;
  active: number;
  issues: number;
  avatar?: string;
}

interface CrewPerformanceCardProps {
  teamMembers: TeamMemberPerformance[];
}

export const CrewPerformanceCard: React.FC<CrewPerformanceCardProps> = ({ teamMembers }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Crew Performance</h3>
        <span className="text-sm text-gray-500">{teamMembers.length} members</span>
      </div>

      <div className="space-y-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <div>
                <div className="font-medium text-gray-900">{member.name}</div>
                <div className="text-sm text-gray-500">{member.role}</div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Done */}
              <div className="text-center">
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-lg font-semibold">{member.done}</span>
                </div>
                <div className="text-xs text-gray-500">Done</div>
              </div>

              {/* Active */}
              <div className="text-center">
                <div className="flex items-center space-x-1 text-blue-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-lg font-semibold">{member.active}</span>
                </div>
                <div className="text-xs text-gray-500">Active</div>
              </div>

              {/* Issues */}
              <div className="text-center">
                <div className="flex items-center space-x-1 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-lg font-semibold">{member.issues}</span>
                </div>
                <div className="text-xs text-gray-500">Issues</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
