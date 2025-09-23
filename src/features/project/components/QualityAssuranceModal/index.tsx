import React, { useState } from 'react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { CheckCircle, FileText, DollarSign, ThumbsUp, Plus, X } from 'lucide-react';

interface QualityAssuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: QualityAssuranceFormData) => void;
  projectName: string;
}

export interface QualityAssuranceFormData {
  clientName: string;
  workCompleted: boolean;
  teamSignOff: boolean;
  invoiceSent: boolean;
  clientSatisfied: boolean;
  additionalNotes: string;
  hasAdditionalNotes: boolean;
}

export const QualityAssuranceModal: React.FC<QualityAssuranceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectName
}) => {
  const [formData, setFormData] = useState<QualityAssuranceFormData>({
    clientName: '',
    workCompleted: true,
    teamSignOff: true,
    invoiceSent: false,
    clientSatisfied: false,
    additionalNotes: '',
    hasAdditionalNotes: false
  });

  const [showNotesSection, setShowNotesSection] = useState(false);

  const handleInputChange = (field: keyof QualityAssuranceFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.clientName.trim()) {
      alert('Please enter your name to sign the form');
      return;
    }

    onSave(formData);
    onClose();
  };

  const handleAddNotes = () => {
    setShowNotesSection(true);
    setFormData(prev => ({
      ...prev,
      hasAdditionalNotes: true
    }));
  };

  const handleRemoveNotes = () => {
    setShowNotesSection(false);
    setFormData(prev => ({
      ...prev,
      hasAdditionalNotes: false,
      additionalNotes: ''
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Quality Assurance Form"
      size="lg"
    >
      <div className="space-y-6">
        {/* Project Information */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Project: {projectName}</h3>
          <p className="text-sm text-blue-700">
            Please review and confirm the following items before signing off on this project.
          </p>
        </div>

        {/* Quality Assurance Checklist */}
        <div className="space-y-4">
          <h4 className="text-md font-semibold text-gray-900">Quality Assurance Checklist</h4>
          
          {/* Work Completed */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                All work has been completed according to specifications
              </label>
            </div>
            <input
              type="checkbox"
              checked={formData.workCompleted}
              onChange={(e) => handleInputChange('workCompleted', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>

          {/* Team Sign Off */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Team has officially signed off on project completion
              </label>
            </div>
            <input
              type="checkbox"
              checked={formData.teamSignOff}
              onChange={(e) => handleInputChange('teamSignOff', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>

          {/* Invoice Sent */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Invoice has been sent to client for billing
              </label>
            </div>
            <input
              type="checkbox"
              checked={formData.invoiceSent}
              onChange={(e) => handleInputChange('invoiceSent', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>

          {/* Client Satisfaction */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <ThumbsUp className="w-5 h-5 text-purple-600" />
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Client is satisfied with the completed work
              </label>
            </div>
            <input
              type="checkbox"
              checked={formData.clientSatisfied}
              onChange={(e) => handleInputChange('clientSatisfied', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Additional Notes Section */}
        {!showNotesSection ? (
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={handleAddNotes}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Add Additional Notes
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-gray-900">Additional Notes</h4>
              <Button
                variant="ghost"
                size="sm"
                icon={X}
                onClick={handleRemoveNotes}
                className="text-gray-500 hover:text-gray-700"
              >
                Remove
              </Button>
            </div>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              placeholder="Add any additional notes, feedback, or special considerations for this project..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
            />
          </div>
        )}

        {/* Client Signature */}
        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">Client Signature</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type your name to sign this form
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                placeholder="Enter your full name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500">
              By typing your name above, you are electronically signing this Quality Assurance form and confirming all items listed above.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="secondary"
            onClick={onClose}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            icon={CheckCircle}
            className="px-6"
          >
            Save & Complete Project
          </Button>
        </div>
      </div>
    </Modal>
  );
};
