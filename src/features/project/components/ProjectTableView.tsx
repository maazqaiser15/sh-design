import React from 'react';
import { Users, Truck, Calendar, MoreVertical, Eye, Edit2, Trash2, Building2, Briefcase } from 'lucide-react';
import { ProjectListItem, PROJECT_STATUS_COLORS, PROJECT_STATUS_DESCRIPTIONS, ProjectSortOptions } from '../types';
import { formatProjectDuration } from '../utils';
import CustomDataTable from '../../../common/components/CustomDataTable';
import { Card } from 'common/components/Card';
import { formatDateMMDDYYYY } from '../../../utils/dateUtils';

interface ProjectTableViewProps {
  projects: ProjectListItem[];
  onProjectClick: (project: ProjectListItem) => void;
  sortOptions: ProjectSortOptions;
  onSort: (field: ProjectSortOptions['field']) => void;
}

export const ProjectTableView: React.FC<ProjectTableViewProps> = ({
  projects,
  onProjectClick,
  sortOptions,
  onSort,
}) => {
  const formatDate = (dateString: string): string => {
    return formatDateMMDDYYYY(dateString);
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getProgressPercentage = (project: ProjectListItem): number => {
    // Use actual progress value from project data if available
    if (project.progress !== undefined) {
      return project.progress;
    }

    // Fallback to status-based progress for backward compatibility
    switch (project.status) {
      case 'D75':
        return 5;
      case 'PV90':
        return 15;
      case 'UB':
        return 25;
      case 'WB':
        return 40;
      case 'WIP':
        return 75;
      case 'QF':
        return 90;
      case 'Completed':
        return 100;
      case 'Archived':
        return 100;
      default:
        return 0;
    }
  };

  const getProgressBarColor = (status: string): string => {
    switch (status) {
      case 'D75':
        return 'bg-gray-500';
      case 'PV90':
        return 'bg-purple-500';
      case 'UB':
        return 'bg-blue-500';
      case 'WB':
        return 'bg-yellow-500';
      case 'WIP':
        return 'bg-blue-500';
      case 'QF':
        return 'bg-orange-500';
      case 'Completed':
        return 'bg-green-500';
      case 'Archived':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  const columns = [
    {
      name: 'Project Name',
      selector: (row: ProjectListItem) => row.title,
      sortable: true,
      width: '300px',
      cell: (row: ProjectListItem) => (
        <div className="whitespace-nowrap">
          {row.title}
          <div className="flex text-xs text-gray-500 items-center whitespace-nowrap">
            Testing subtitile
          </div>
        </div>
      ),
    },
    {
      name: 'Industry',
      selector: (row: ProjectListItem) => row.industry,
      sortable: true,
      width: '200px',
      cell: (row: ProjectListItem) => (
        <div className="flex items-center whitespace-nowrap">
          <Briefcase className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
          {row.industry}
        </div>
      ),
    },
    {
      name: 'VIN Code',
      selector: (row: ProjectListItem) => row.vinCode,
      sortable: true,
      width: '250px',
      cell: (row: ProjectListItem) => (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 whitespace-nowrap">
          {row.vinCode}
        </span>
      ),
    },
    {
      name: 'Status',
      selector: (row: ProjectListItem) => row.status,
      sortable: true,
      width: '140px',
      cell: (row: ProjectListItem) => (
        <div className="flex flex-col space-y-1">
          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${PROJECT_STATUS_COLORS[row.status]}`}>
            {PROJECT_STATUS_DESCRIPTIONS[row.status]}
          </span>
        </div>
      ),
    },
    {
      name: 'Site',
      selector: (row: ProjectListItem) => row.site,
      sortable: true,
      width: '250px',
      cell: (row: ProjectListItem) => (
        <div className="flex items-center whitespace-nowrap">
          <Building2 className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
          {row.site}
        </div>
      ),
    },


    {
      name: 'Crew',
      selector: (row: ProjectListItem) => row.crewCount,
      sortable: true,
      width: '180px',
      cell: (row: ProjectListItem) => (
        <div className="flex items-center whitespace-nowrap">
          <Users className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
          <div className="flex items-center -space-x-1">
            {row.crew.slice(0, 3).map((member, index) => (
              <div
                key={member.id}
                className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700"
                title={member.name}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(member.name)
                )}
              </div>
            ))}
            {row.crewCount > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                +{row.crewCount - 3}
              </div>
            )}
          </div>
          <span className="ml-2 text-sm text-gray-500">
            ({row.crewCount})
          </span>
        </div>
      ),
    },
    {
      name: 'Trailer',
      selector: (row: ProjectListItem) => row.assignedTrailer || 'Not Assigned',
      sortable: true,
      width: '200px',
      cell: (row: ProjectListItem) => (
        <div className={`flex items-center whitespace-nowrap py-1 px-2 rounded-full ${row.assignedTrailer ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'} `}>
          <Truck className={`w-4 h-4 mr-2 text-gray-500 flex-shrink-0 ${row.assignedTrailer ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`} />
          {row.assignedTrailer || 'Not Assigned'}
        </div>
      ),
    },
    {
      name: 'Project Duration',
      selector: (row: ProjectListItem) => row.startDate,
      sortable: true,
      width: '250px',
      cell: (row: ProjectListItem) => (
        <div className="flex items-center whitespace-nowrap">
          <Calendar className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
          <div>
            <div className="text-sm font-medium">
              <span>{formatDateMMDDYYYY(row.startDate)}</span>
              <span className="mx-2 text-gray-400">→</span>
              <span>{formatDateMMDDYYYY(row.endDate)}</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Card>
      {/* <div className='overflow-x-auto'> */}
      <CustomDataTable
        title=""
        columns={columns}
        data={projects}
        selectableRows={undefined}
        pagination={true}
        highlightOnHover={undefined}
        striped={undefined}
        onRowClicked={onProjectClick}
        progressPending={undefined}
        paginationPerPage={10}
      />
      {/* </div> */}

    </Card>
  );
};
