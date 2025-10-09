import React, { useState, useEffect } from 'react';
import { Calendar, User, Phone, Mail, Building, ChevronDown } from 'lucide-react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import FormField from '../../../../common/components/FormField';
import { ProjectDetails } from '../../types/projectDetails';

interface EditProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectDetails;
  onSave: (updatedProject: ProjectDetails) => void;
}

interface FormData {
  contactPersonName: string;
  contactPersonPhone: string;
  billingContactName: string;
  billingContactEmail: string;
  billingContactPhone: string;
  startDate: string;
  endDate: string;
  coordinatorId: string;
}

// Mock coordinator data
const MOCK_COORDINATORS = [
  { id: '1', name: 'Jennifer White', email: 'jennifer.white@company.com' },
  { id: '2', name: 'Michael Rodriguez', email: 'michael.rodriguez@company.com' },
  { id: '3', name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
  { id: '4', name: 'David Lee', email: 'david.lee@company.com' },
  { id: '5', name: 'Lisa Wilson', email: 'lisa.wilson@company.com' },
];

// Validation schema
const validationSchema = Yup.object({
  contactPersonName: Yup.string(),
  contactPersonPhone: Yup.string().matches(
    /^[\+]?[1-9][\d]{0,15}$/,
    'Please enter a valid phone number'
  ),
  billingContactName: Yup.string(),
  billingContactEmail: Yup.string().email('Please enter a valid email address'),
  billingContactPhone: Yup.string().matches(
    /^[\+]?[1-9][\d]{0,15}$/,
    'Please enter a valid phone number'
  ),
  startDate: Yup.date(),
  endDate: Yup.date().when('startDate', (startDate, schema) => {
    return startDate ? schema.min(startDate, 'End date must be after start date') : schema;
  }),
  coordinatorId: Yup.string().required('Please select a coordinator'),
});

export const EditProjectDetailsModal: React.FC<EditProjectDetailsModalProps> = ({
  isOpen,
  onClose,
  project,
  onSave
}) => {
  const initialValues: FormData = {
    contactPersonName: project.contactPerson?.name || '',
    contactPersonPhone: project.contactPerson?.phone || '',
    billingContactName: project.billingContact?.name || '',
    billingContactEmail: project.billingContact?.email || '',
    billingContactPhone: project.billingContact?.phone || '',
    startDate: project.startDate,
    endDate: project.endDate,
    coordinatorId: project.assignedCoordinator?.id || ''
  };

  const handleSubmit = (values: FormData) => {
    const selectedCoordinator = MOCK_COORDINATORS.find(c => c.id === values.coordinatorId);
    
    const updatedProject: ProjectDetails = {
      ...project,
      contactPerson: {
        name: values.contactPersonName,
        phone: values.contactPersonPhone
      },
      billingContact: {
        name: values.billingContactName,
        email: values.billingContactEmail,
        phone: values.billingContactPhone
      },
      startDate: values.startDate,
      endDate: values.endDate,
      assignedCoordinator: selectedCoordinator ? {
        id: selectedCoordinator.id,
        name: selectedCoordinator.name,
        email: selectedCoordinator.email,
        phone: '+1-555-0200' // Default phone for coordinators
      } : undefined,
      updatedAt: new Date().toISOString()
    };

    onSave(updatedProject);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Edit Project Details">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Contact Person Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-100 rounded-md">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                Contact Person
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  label="Name"
                  name="contactPersonName"
                  type="text"
                  placeholder="Enter contact person name"
                />
                <FormField
                  label="Phone Number"
                  name="contactPersonPhone"
                  type="tel"
                  placeholder="Enter phone number"
                  isLeftIcon={<Phone className="w-4 h-4" />}
                />
              </div>
            </div>

            {/* Billing Contact Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-green-100 rounded-md">
                  <Mail className="w-4 h-4 text-green-600" />
                </div>
                Billing Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  label="Name"
                  name="billingContactName"
                  type="text"
                  placeholder="Enter billing contact name"
                />
                <FormField
                  label="Email"
                  name="billingContactEmail"
                  type="email"
                  placeholder="Enter email address"
                  isLeftIcon={<Mail className="w-4 h-4" />}
                />
                <FormField
                  label="Phone Number"
                  name="billingContactPhone"
                  type="tel"
                  placeholder="Enter phone number"
                  isLeftIcon={<Phone className="w-4 h-4" />}
                />
              </div>
            </div>

            {/* Project Dates Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-purple-100 rounded-md">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                Project Dates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  label="Start Date"
                  name="startDate"
                  type="date"
                />
                <FormField
                  label="End Date"
                  name="endDate"
                  type="date"
                />
              </div>
            </div>

            {/* Project Coordinator Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-orange-100 rounded-md">
                  <User className="w-4 h-4 text-orange-600" />
                </div>
                Project Coordinator
              </h3>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Coordinator Name
                </label>
                <div className="relative">
                  <select
                    name="coordinatorId"
                    value={values.coordinatorId}
                    onChange={(e) => setFieldValue('coordinatorId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="">Select a coordinator</option>
                    {MOCK_COORDINATORS.map((coordinator) => (
                      <option key={coordinator.id} value={coordinator.id}>
                        {coordinator.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
