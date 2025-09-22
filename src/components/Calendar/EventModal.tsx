import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, MapPin, Tag } from 'lucide-react';
import { Modal } from '../../common/components/Modal';
import { Button } from '../../common/components/Button';
import { CalendarEvent, EventType, EventStatus } from '../../types/scheduler';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onDelete?: (eventId: string) => void;
  selectedDate?: Date;
  selectedHour?: number;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  onSave,
  onDelete,
  selectedDate,
  selectedHour,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    allDay: false,
    type: 'project' as EventType,
    status: 'scheduled' as EventStatus,
    location: '',
    assignedTo: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      // Edit existing event
      setFormData({
        title: event.title,
        description: event.description || '',
        start: new Date(event.start).toISOString().slice(0, 16),
        end: new Date(event.end).toISOString().slice(0, 16),
        allDay: event.allDay || false,
        type: event.type,
        status: event.status,
        location: event.location || '',
        assignedTo: event.assignedTo || [],
      });
    } else if (selectedDate) {
      // Create new event
      const startDate = new Date(selectedDate);
      if (selectedHour !== undefined) {
        startDate.setHours(selectedHour, 0, 0, 0);
      }
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + 1);

      setFormData({
        title: '',
        description: '',
        start: startDate.toISOString().slice(0, 16),
        end: endDate.toISOString().slice(0, 16),
        allDay: false,
        type: 'project',
        status: 'scheduled',
        location: '',
        assignedTo: [],
      });
    }
  }, [event, selectedDate, selectedHour]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.start) newErrors.start = 'Start date is required';
    if (!formData.end) newErrors.end = 'End date is required';
    if (new Date(formData.start) >= new Date(formData.end)) {
      newErrors.end = 'End time must be after start time';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Create event object
    const eventData: Omit<CalendarEvent, 'id'> = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      start: new Date(formData.start),
      end: new Date(formData.end),
      allDay: formData.allDay,
      type: formData.type,
      status: formData.status,
      location: formData.location.trim() || undefined,
      assignedTo: formData.assignedTo.length > 0 ? formData.assignedTo : undefined,
    };

    onSave(eventData);
    onClose();
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
      onClose();
    }
  };

  const eventTypes: { value: EventType; label: string; color: string }[] = [
    { value: 'project', label: 'Project', color: 'bg-blue-500' },
    { value: 'task', label: 'Task', color: 'bg-green-500' },
    { value: 'meeting', label: 'Meeting', color: 'bg-purple-500' },
    { value: 'deadline', label: 'Deadline', color: 'bg-red-500' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-orange-500' },
  ];

  const eventStatuses: { value: EventStatus; label: string }[] = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event' : 'Create Event'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Event Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-border'
            }`}
            placeholder="Enter event title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder="Enter event description"
          />
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.start}
              onChange={(e) => setFormData(prev => ({ ...prev, start: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.start ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.start && <p className="text-red-500 text-sm mt-1">{errors.start}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.end}
              onChange={(e) => setFormData(prev => ({ ...prev, end: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.end ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.end && <p className="text-red-500 text-sm mt-1">{errors.end}</p>}
          </div>
        </div>

        {/* All Day Toggle */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allDay"
            checked={formData.allDay}
            onChange={(e) => setFormData(prev => ({ ...prev, allDay: e.target.checked }))}
            className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
          />
          <label htmlFor="allDay" className="ml-2 block text-sm text-text-secondary">
            All day event
          </label>
        </div>

        {/* Type and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Event Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as EventType }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {eventTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as EventStatus }))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {eventStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter event location"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-border">
          <div>
            {event && onDelete && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleDelete}
                className="text-red-600 hover:bg-red-50"
              >
                Delete Event
              </Button>
            )}
          </div>
          <div className="flex space-x-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {event ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
