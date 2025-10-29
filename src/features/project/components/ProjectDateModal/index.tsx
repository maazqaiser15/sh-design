import React, { useState, useEffect } from 'react';
import { Button } from '../../../../common/components/Button';
import { Modal } from '../../../../common/components/Modal';
import { DatePicker } from '../../../../common/components/DatePicker';
import { ProjectStatus } from '../../types';

interface ProjectDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: string, endDate: string) => void;
  projectTitle: string;
  projectStatus: ProjectStatus;
  initialStartDate?: string;
  initialEndDate?: string;
}

export const ProjectDateModal: React.FC<ProjectDateModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  projectTitle,
  projectStatus,
  initialStartDate = '',
  initialEndDate = '',
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState<{ startDate?: string; endDate?: string }>({});
  const [duration, setDuration] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStartDate(initialStartDate);
      setEndDate(initialEndDate);
      setErrors({});
      setDuration(null);
    }
  }, [isOpen, initialStartDate, initialEndDate]);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start < end) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDuration(`${diffDays} days`);
      } else {
        setDuration(null);
      }
    } else {
      setDuration(null);
    }
  }, [startDate, endDate]);

  const validate = () => {
    const newErrors: { startDate?: string; endDate?: string } = {};
    const today = new Date().toISOString().split('T')[0];

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (startDate < today) {
      newErrors.startDate = 'Start date cannot be in the past';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    } else if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onConfirm(startDate, endDate);
      onClose();
    }
  };

  const getMinEndDate = () => {
    if (startDate) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + 1); // End date must be at least one day after start date
      return start.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  };

  const getStatusDisplay = (status: ProjectStatus) => {
    switch (status) {
      case 'PV90':
        return 'PV90 (Pre-Visit 90 days)';
      case 'UB':
        return 'UB (Under Budget)';
      case 'WB':
        return 'WB (Within Budget)';
      default:
        return status;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Set Project Dates for ${projectTitle}`}>
      <div className="p-6 space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            This project is in the <span className="font-semibold">{getStatusDisplay(projectStatus)}</span> stage. 
            Please set the estimated start and end dates for project planning and scheduling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DatePicker
            label="Project Start Date"
            value={startDate}
            onChange={(value) => setStartDate(value)}
            min={new Date().toISOString().split('T')[0]}
            required
            error={errors.startDate}
            id="startDate"
          />

          <DatePicker
            label="Project End Date"
            value={endDate}
            onChange={(value) => setEndDate(value)}
            min={getMinEndDate()}
            disabled={!startDate}
            required
            error={errors.endDate}
            id="endDate"
          />
        </div>

        {duration && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <span className="font-semibold">Estimated Project Duration:</span> {duration}
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Dates
          </Button>
        </div>
      </div>
    </Modal>
  );
};