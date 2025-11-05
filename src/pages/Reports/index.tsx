import React, { useMemo, useState } from 'react';
import { Card } from 'common/components/Card';
import { Calendar, Download, ChevronDown, X } from 'lucide-react';
import CustomDataTable from 'common/components/CustomDataTable';

export const Reports: React.FC = () => {
  type TabKey = 'recut' | 'travel' | 'labour' | 'salesOps';
  const [activeTab, setActiveTab] = useState<TabKey>('recut');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'recut', label: 'Recut Report' },
    { key: 'travel', label: 'Travel and Accommodation Report' },
    { key: 'labour', label: 'Labour Efficiency Report' },
    { key: 'salesOps', label: 'Sales vs Ops Estimates' },
  ];

  const recutRows = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        projectName: 'BRM',
        filmUsed: i % 3 === 0 ? '69 sq ft' : i % 3 === 1 ? '130 sq ft' : '110 sq ft',
        recut: i % 3 === 0 ? '69 sq ft' : '120 sq ft',
        wastage: i % 3 === 0 ? '99%' : '88%',
      })),
    []
  );

  const columns = [
    {
      name: 'Project Name',
      selector: (row: any) => row.projectName,
    },
    {
      name: 'Film Used',
      selector: (row: any) => row.filmUsed,
    },
    {
      name: 'Recut',
      selector: (row: any) => row.recut,
    },
    {
      name: 'Wastage',
      selector: (row: any) => row.wastage,
    },
  ];

  const data = [
    ...recutRows as any,
  ];
  return (
    <Card className="">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Project closure details and overall results</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm">
            <Calendar className="w-4 h-4" />
            <span>02/10/2025 - 02/15/2025</span>
            <button className="ml-1 text-gray-500 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          </div>
          <button className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm">
            <span>Export Data</span>
            <Download className="w-4 h-4" />
          </button>
          <button className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-sm">
            <span>Custom</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* <Card className="p-0"> */}
        {/* Tabs header */}
        <div className="px-2 pt-4">
          <nav className="flex flex-wrap mb-6 items-center gap-6" aria-label="Reports Tabs">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`relative pb-3 text-sm font-medium transition-colors ${
                  activeTab === t.key
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {t.label}
                {activeTab === t.key && (
                  <span className="absolute left-0 -bottom-[1px] h-[2px] w-full bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="">
          {activeTab === 'recut' && (
            <div className="">
              <CustomDataTable title={''} columns={columns} data={data} pagination={true} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={undefined}/>
            </div>
          )}

          {activeTab === 'travel' && (
            <div className="text-sm text-gray-600">Travel & Accommodation report content goes here.</div>
          )}

          {activeTab === 'labour' && (
            <div className="text-sm text-gray-600">Labour Efficiency report content goes here.</div>
          )}

          {activeTab === 'salesOps' && (
            <div className="text-sm text-gray-600">Sales vs Ops Estimates content goes here.</div>
          )}
        </div>
      {/* </Card> */}
    </Card>
  );
};

export default Reports;


