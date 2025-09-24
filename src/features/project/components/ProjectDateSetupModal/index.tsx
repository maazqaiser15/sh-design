import React, { useState } from 'react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';

interface ProjectDateSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (startDate: string, endDate: string) => void;
  projectName: string;
  projectStatus: 'PV75' | 'PV90' | 'UB' | 'WB';
}

export const ProjectDateSetupModal: React.FC<ProjectDateSetupModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectName,
  projectStatus
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState<{ startDate?: string; endDate?: string }>({});

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'PV75': return 'PV75 (75% Complete)';
      case 'PV90': return 'PV90 (90% Complete)';
      case 'UB': return 'UB (Under Budget)';
      case 'WB': return 'WB (Within Budget)';
      default: return status;
    }
  };

  const validateDates = () => {
    const newErrors: { startDate?: string; endDate?: string } = {};

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateDates()) {
      onSave(startDate, endDate);
      setStartDate('');
      setEndDate('');
      setErrors({});
    }
  };

  const handleClose = () => {
    setStartDate('');
    setEndDate('');
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Setup Project Dates">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Project: {projectName}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Status: <span className="font-medium">{getStatusDisplayName(projectStatus)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Please set up the project start and end dates to proceed to the project details.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Project Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.startDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Project End Date *
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.endDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="secondary"
            onClick={handleClose}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className="px-4 py-2"
          >
            Save & Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
};
