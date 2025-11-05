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

  const travelRows = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        projectName: 'BRM',
        hotelCost: i % 3 === 0 ? '$1,050' : i % 3 === 1 ? '$820' : '$1,240',
        flightCostToJob: i % 2 === 0 ? '$450' : '$525',
        flightCostFromJob: i % 2 === 0 ? '$430' : '$510',
        rentalCar: i % 2 === 0 ? 'Yes' : 'No',
        rentalCost: i % 2 === 0 ? '$260' : '$0',
        travelCost:
          i % 3 === 0 ? '$2,190' : i % 3 === 1 ? '$1,855' : '$2,270',
      })),
    []
  );

  const labourRows = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        projectName: 'BRM',
        employeeSchedule: i % 2 === 0 ? 'Mon-Fri' : 'Tue-Sat',
        estimatedDays: i % 3 === 0 ? 5 : 6,
        actualDays: i % 3 === 0 ? 6 : 5,
        estimatedHours: i % 2 === 0 ? 40 : 48,
        actualHours: i % 2 === 0 ? 46 : 42,
        estimatedCost: i % 2 === 0 ? 6 : 4, // used by "Actucal Overtime Hours" column selector
        overtimePercentage: i % 2 === 0 ? '15%' : '9%',
        travelHours: i % 3 === 0 ? 6 : 4,
      })),
    []
  );

  const salesOpsRows = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        projectName: 'BRM',
        salesEstimate: i % 3 === 0 ? '12,500 sq ft' : i % 3 === 1 ? '10,800 sq ft' : '11,300 sq ft',
        opsEstimate: i % 3 === 0 ? '11,900 sq ft' : i % 3 === 1 ? '11,200 sq ft' : '10,950 sq ft',
        varianceInSqFt: i % 3 === 0 ? '600' : i % 3 === 1 ? '-400' : '350',
        varianceInPercentage: i % 3 === 0 ? '4.8%' : i % 3 === 1 ? '-3.7%' : '3.1%',
      })),
    []
  );

  const recutColumns = [
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

  const travelColumns = [
    {
      name: 'Project Name',
      selector: (row: any) => row.projectName,
    },
    {
      name: 'Hotel Cost',
      selector: (row: any) => row.hotelCost,
    },
    {
      name: 'Flight Cost To Job',
      selector: (row: any) => row.flightCostToJob,
    },
    {
      name: 'Flight Cost From Job',
      selector: (row: any) => row.flightCostFromJob,
    },
    {
      name: 'Rental Car Y/N',
      selector: (row: any) => row.rentalCar,
    },
    {
      name: 'Rental Cost',
      selector: (row: any) => row.rentalCost,
    },
    {
      name: 'Travel Cost',
      selector: (row: any) => row.travelCost,
    },
  ];

  const labourColumns = [
    {
      name: 'Project Name',
      selector: (row: any) => row.projectName,
    },
    {
      name: 'Employee Schedule',
      selector: (row: any) => row.employeeSchedule,
    },
    {
      name: 'Estimated Days',
      selector: (row: any) => row.estimatedDays,
    },
    {
      name: 'Actual Days',
      selector: (row: any) => row.actualDays,
    },
    { name: 'Estimated Hours', selector: (row: any) => row.estimatedHours, },
    { name: 'Actual Hours', selector: (row: any) => row.actualHours, },

    { name: 'Actucal Overtime Hours', selector: (row: any) => row.estimatedCost, },
    { name: 'Overtime Percentage', selector: (row: any) => row.overtimePercentage, },
    { name: 'Travel Hours', selector: (row: any) => row.travelHours, },
  ];

  const salesOpsColumns = [
    {
      name: 'Project Name',
      selector: (row: any) => row.projectName,
    },
    {
      name: 'Sales Estimate',
      selector: (row: any) => row.salesEstimate,
    },
    {
      name: 'Ops Estimate',
      selector: (row: any) => row.opsEstimate,
    },
    {
      name: 'Variance In Sq Ft',
      selector: (row: any) => row.varianceInSqFt,
    },
    {
      name: 'Variance In Percentage',
      selector: (row: any) => row.varianceInPercentage,
    },
  ];

  const recutData = [
    ...recutRows as any,
  ];

  const travelData = [
    ...travelRows as any,
  ];

  const labourData = [
    ...labourRows as any,
  ];

  const salesOpsData = [
    ...salesOpsRows as any,
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
              className={`relative pb-3 text-sm font-medium transition-colors ${activeTab === t.key
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
            <CustomDataTable title={''} columns={recutColumns} data={recutData} pagination={true} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={undefined} />
          </div>
        )}

        {activeTab === 'travel' && (
          <div className="">
            <CustomDataTable title={''} columns={travelColumns} data={travelData} pagination={true} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={undefined} />
          </div>
        )}

        {activeTab === 'labour' && (
          <div className="">
            <CustomDataTable title={''} columns={labourColumns} data={labourData} pagination={true} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={undefined} />
          </div>
        )}

        {activeTab === 'salesOps' && (
          <div className="">
            <CustomDataTable title={''} columns={salesOpsColumns} data={salesOpsData} pagination={true} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={undefined} />
          </div>
        )}
      </div>
      {/* </Card> */}
    </Card>
  );
};

export default Reports;


