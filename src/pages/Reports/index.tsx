import React from 'react';
import { Card } from 'common/components/Card';

export const Reports: React.FC = () => {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600">This is the Reports page. Add charts, exports and analytics here.</p>
      </Card>
    </div>
  );
};

export default Reports;


