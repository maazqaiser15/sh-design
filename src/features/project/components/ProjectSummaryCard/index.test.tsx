import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProjectSummaryCard } from './index';
import { MOCK_PREPARATION_DATA } from '../../types/preparation';

// Mock the Button component
jest.mock('../../../../common/components/Button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Mock the StatusBadge component
jest.mock('../../../../common/components/StatusBadge', () => ({
  StatusBadge: ({ status, className, ...props }: any) => (
    <span className={className} {...props}>
      {status}
    </span>
  ),
}));

describe('ProjectSummaryCard', () => {
  const mockOnAssignTrailer = jest.fn();

  beforeEach(() => {
    mockOnAssignTrailer.mockClear();
  });

  it('renders project name and VIN code', () => {
    render(
      <ProjectSummaryCard
        data={MOCK_PREPARATION_DATA}
        onAssignTrailer={mockOnAssignTrailer}
      />
    );

    expect(screen.getByText(MOCK_PREPARATION_DATA.projectName)).toBeInTheDocument();
    expect(screen.getByText(MOCK_PREPARATION_DATA.vinCode)).toBeInTheDocument();
  });

  it('renders project status', () => {
    render(
      <ProjectSummaryCard
        data={MOCK_PREPARATION_DATA}
        onAssignTrailer={mockOnAssignTrailer}
      />
    );

    expect(screen.getByText(MOCK_PREPARATION_DATA.status)).toBeInTheDocument();
  });

  it('renders location', () => {
    render(
      <ProjectSummaryCard
        data={MOCK_PREPARATION_DATA}
        onAssignTrailer={mockOnAssignTrailer}
      />
    );

    expect(screen.getByText(MOCK_PREPARATION_DATA.location)).toBeInTheDocument();
  });

  it('renders crew count', () => {
    render(
      <ProjectSummaryCard
        data={MOCK_PREPARATION_DATA}
        onAssignTrailer={mockOnAssignTrailer}
      />
    );

    expect(screen.getByText(`${MOCK_PREPARATION_DATA.crew.length} members assigned`)).toBeInTheDocument();
  });

  it('calls onAssignTrailer when assign trailer button is clicked', () => {
    const dataWithoutTrailer = {
      ...MOCK_PREPARATION_DATA,
      assignedTrailer: null
    };

    render(
      <ProjectSummaryCard
        data={dataWithoutTrailer}
        onAssignTrailer={mockOnAssignTrailer}
      />
    );

    const assignButton = screen.getByText('Assign Trailer');
    assignButton.click();

    expect(mockOnAssignTrailer).toHaveBeenCalledTimes(1);
  });

  it('renders assigned trailer information when trailer is assigned', () => {
    render(
      <ProjectSummaryCard
        data={MOCK_PREPARATION_DATA}
        onAssignTrailer={mockOnAssignTrailer}
      />
    );

    expect(screen.getByText(MOCK_PREPARATION_DATA.assignedTrailer!.trailerNumber)).toBeInTheDocument();
    expect(screen.getByText(MOCK_PREPARATION_DATA.assignedTrailer!.registrationNumber)).toBeInTheDocument();
  });
});
