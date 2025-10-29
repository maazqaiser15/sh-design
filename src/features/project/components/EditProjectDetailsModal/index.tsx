import React, { useState } from 'react';
import { Calendar, User, Phone, Building, ChevronDown, PlusCircle, MinusCircle, Subtitles, MinusSquare } from 'lucide-react';
import { Formik, Form } from 'formik';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import FormField from '../../../../common/components/FormField';
import { ProjectDetails } from '../../types/projectDetails';
import SelectField from 'common/components/SelectField';

interface EditProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectDetails;
  onSave: (updatedProject: ProjectDetails) => void;
}

interface FormData {
  contactPersonName: string;
  contactPersonPhone: string;
  contactPersonJobTitle: string;
  startDate: string;
  endDate: string;
  coordinatorId: string;
}

// Mock coordinator data
const MOCK_COORDINATORS = [
  { id: 'coord-1', name: 'Jennifer White', email: 'jennifer.white@company.com', phone: '+1-555-0130', label: 'Jennifer White', value: 'coord-1' },
  { id: 'coord-2', name: 'Michael Rodriguez', email: 'michael.rodriguez@company.com', phone: '+1-555-0131', label: 'Michael Rodriguez', value: 'coord-2' },
  { id: 'coord-3', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', phone: '+1-555-0132', label: 'Sarah Johnson', value: 'coord-3' },
  { id: 'coord-4', name: 'David Lee', email: 'david.lee@company.com', phone: '+1-555-0133', label: 'David Lee', value: 'coord-4' },
  { id: 'coord-5', name: 'Lisa Wilson', email: 'lisa.wilson@company.com', phone: '+1-555-0134', label: 'Lisa Wilson', value: 'coord-5' },
];


export const EditProjectDetailsModal: React.FC<EditProjectDetailsModalProps> = ({
  isOpen,
  onClose,
  project,
  onSave
}) => {
  const initialValues: FormData = {
    contactPersonName: project.contactPerson?.name || '',
    contactPersonPhone: project.contactPerson?.phone || '',
    contactPersonJobTitle: '',
    startDate: project.startDate,
    endDate: project.endDate,
    coordinatorId: project.assignedCoordinator?.id || ''
  };

  const [isShowSecondaryContact, setIsShowSecondaryContact] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [pendingValues, setPendingValues] = useState<FormData | null>(null)

  const handleRequestSubmit = (values: FormData) => {
    setPendingValues(values);
    setIsConfirming(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={isConfirming ? "Update Project Dates" : "Edit Project Details"}>
      {isConfirming ? (
        <div className="space-y-6">
          <p className="text-sm text-gray-700">
            Changing the project dates will unassign all crew members and the trailer linked to this schedule. Are you sure you want to continue?
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={() => setIsConfirming(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                onClose();
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          onSubmit={handleRequestSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Contact Person Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base flex justify-between  font-semibold text-gray-900  items-center gap-2 mb-3">
                <div className='flex items-center gap-2'>
                  <div className="p-1.5 bg-blue-100 rounded-md">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  Primary Contact Person
                </div>
              {!isShowSecondaryContact && <Button variant='ghost' onClick={() => setIsShowSecondaryContact(!isShowSecondaryContact)}>{<PlusCircle size={18}/>} </Button>}  
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  label="Name"
                  name="contactPersonName"
                  type="text"
                  placeholder="Enter contact person name"
                  className='mb-0'
                />
                <FormField
                  label="Phone Number"
                  name="contactPersonPhone"
                  type="tel"
                  placeholder="Enter phone number"
                  isLeftIcon={<Phone className="w-4 h-4" />}
                  className='mb-0'
                />
                <FormField
                  label="Job Title"
                  name="contactPersonJobTitle"
                  type="text"
                  placeholder="Enter job title"
                  className='mb-0'
                />
              </div>
            </div>

            {isShowSecondaryContact && <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base flex justify-between  font-semibold text-gray-900  items-center gap-2 mb-3">
                <div className='flex items-center gap-2'>
                  <div className="p-1.5 bg-blue-100 rounded-md">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  Secondary Contact Person
                </div>
              {isShowSecondaryContact && <Button variant='ghost' onClick={() => setIsShowSecondaryContact(!isShowSecondaryContact)}>{<MinusCircle size={18}/>} </Button>}  
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  label="Name"
                  name="contactPersonName"
                  type="text"
                  placeholder="Enter contact person name"
                  className='mb-0'
                />
                <FormField
                  label="Phone Number"
                  name="contactPersonPhone"
                  type="tel"
                  placeholder="Enter phone number"
                  isLeftIcon={<Phone className="w-4 h-4" />}
                  className='mb-0'
                />
                <FormField
                  label="Job Title"
                  name="contactPersonJobTitle"
                  type="text"
                  placeholder="Enter job title"
                  className='mb-0'
                />
              </div>
            </div>}
            {/* {Project Subtite} */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-purple-100 rounded-md">
                  <Subtitles className="w-4 h-4 text-purple-600" />
                </div>
                Job Subtitle
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  label="Job Subtitle"
                  name="jobSubtitle"
                  type="text"
                  className='mb-0'
                  placeholder='Enter Job Subtitle'
                />
              </div>
            </div>

            {/* Project Dates Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-yellow-100 rounded-md">
                  <Calendar className="w-4 h-4 text-yellow-600" />
                </div>
                Project Dates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  className='mb-0'
                />
                <FormField
                  label="End Date"
                  name="endDate"
                  type="date"
                  className='mb-0'
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
              <SelectField inputClassName={'border border-gray-300'} className={''} label={'Coordinator Name'} value={values.coordinatorId} onChange={(e) => setFieldValue('coordinatorId', e.target.value)} placeholder={'Select a coordinator'} options={MOCK_COORDINATORS} />
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
      )}
    </Modal>
  );
};
