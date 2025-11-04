import React from 'react';
import { Card } from '../../../../common/components/Card';
import { CheckCircle, Play, AlertTriangle } from 'lucide-react';

interface TodayProgressData {
  windowsStarted: number;
  windowsCompleted: number;
  issuesReported: number;
}

interface TodayProgressCardProps {
  data: TodayProgressData;
}

export const TodayProgressCard: React.FC<TodayProgressCardProps> = ({ data }) => {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Today's Progress</h3>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Windows Started */}
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-1.5 bg-blue-100 rounded-full flex items-center justify-center">
            <Play className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-gray-900">{data.windowsStarted}</div>
          <div className="text-xs text-gray-500">Windows Started</div>
        </div>

        {/* Windows Completed */}
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-1.5 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-xl font-bold text-gray-900">{data.windowsCompleted}</div>
          <div className="text-xs text-gray-500">Windows Completed</div>
        </div>

        {/* Layers Installed */}
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-1.5 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-xl font-bold text-gray-900">{data.issuesReported}</div>
          <div className="text-xs text-gray-500">Layers Installed</div>
        </div>
      </div>
    </Card>
  );
};
