import { overflow } from 'html2canvas/dist/types/css/property-descriptors/overflow';
import React from 'react';
import DataTable from 'react-data-table-component';
import styled from 'styled-components';

interface tableProps {
  title: string;
  columns: any[];
  data: any;
  selectableRows: any;
  pagination: boolean;
  highlightOnHover: any;
  striped: any;
  onRowClicked: any;
  progressPending: any;
  paginationPerPage: any;
}

const CustomDataTable: React.FC<tableProps> = ({
  title,
  columns,
  data,
  selectableRows,
  progressPending,
  paginationPerPage,
  pagination,
  highlightOnHover,
  striped,
  onRowClicked,
}) => {

  // Custom styled component for pagination styles
  const CustomPaginationStyles = styled.div`
    .rdt_Pagination {
      padding-right: 50px;
    }
    .rdt_Pagination #pagination-first-page,
    .rdt_Pagination #pagination-last-page {
      display: none !important;
    }
  `;

  // Custom styles for the table and pagination
  const customStyles = {
    tableWrapper: {
      style: {
        width: '100%',
        overflowX: 'auto',         // ← horizontal scroll lives here
      },
    },
    table: {
      style: {
        backgroundColor: "transparent", // ✅ whole table background color
        tableLayout: "fixed",
      },
    },
    headRow: {
      style: {
        backgroundColor: '#fff',
        border: 0,
        minHeight: '48px',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
      },
    },
    headCells: {
      style: {
        color: '#475569',
        fontSize: '16px',
        backgroundColor: 'transparent',
        fontWeight: 400,
        paddingLeft: "16px",
        paddingRight: "16px",
        whiteSpace: "nowrap",
      },
    },
    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
        whiteSpace: "nowrap",
      },
    },
    rows: {
      style: {
        minHeight: '56px',
        backgroundColor: 'transparent',
      },
    },
    // columns: columns.map((col, index) => {
    //   if (index === columns.length - 1) {
    //     return {
    //       ...col,
    //       // Applying right alignment to the last column
    //       style: {
    //         justifyContent: 'right',  // Right-aligning the last column cells
    //         background: 'red'
    //       },
    //     };
    //   }
    //   return col;
    // }),
    pagination: {
      style: {
        backgroundColor: 'transparent', // Pagination background color
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: '#d1d5db',
        minHeight: '56px',
      },
      pageButtonsStyle: {
        borderRadius: '50%',
        border: '1px solid #1E293B',
        height: '32px',
        width: '32px',
        padding: '4px',
        margin: '0 4px',
        cursor: 'pointer',
        transition: 'all 0.25s',
        color: '#1f2937',
        fill: '#1f2937',
        '&:hover': {
          backgroundColor: '#dbeafe',
        },
      },
      '&[id="pagination-first-page"], &[id="pagination-last-page"]': {
        display: 'none !important',
        margin: 0,
        padding: 0,
        border: 'none',
        width: 0,
        height: 0,
      },
      '&:disabled': {
        cursor: 'unset',
        color: '#9ca3af',
        fill: '#9ca3af',
        border: '1px solid #9ca3af',
        opacity: 0.6,
      },
      noData: {
        style: {
          backgroundColor: 'transparent', // Background color behind "No records to display"
          color: '#1d4ed8', // Text color for "No records to display"
          fontSize: '16px',
          fontWeight: '500',
          padding: '24px',
        },
      },
    },
  };

  return (
    <CustomPaginationStyles>
        <DataTable
          title={title}
          columns={columns}
          data={data}
          selectableRows={selectableRows}
          pagination={pagination}
          highlightOnHover={highlightOnHover}
          striped={striped}
          onRowClicked={onRowClicked}
          paginationIconFirstPage={false}
          paginationIconLastPage={null}
          progressPending={progressPending}
          paginationPerPage={paginationPerPage}
          customStyles={customStyles}
        />
    </CustomPaginationStyles>
  );
};

export default CustomDataTable;
