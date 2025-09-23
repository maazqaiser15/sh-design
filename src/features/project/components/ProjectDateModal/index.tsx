import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Modal } from '../../../../common/components/Modal';
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
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Project Start Date *
            </label>
            <div className="relative">
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              Project End Date *
            </label>
            <div className="relative">
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={getMinEndDate()}
                disabled={!startDate}
                className={`w-full px-3 py-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${!startDate ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
          </div>
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