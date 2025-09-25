import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { Button } from '../../../common/components/Button';
import { Card } from '../../../common/components/Card';
import { useToast } from '../../../contexts/ToastContext';

interface QualityCheckFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: QualityCheckFormData) => void;
}

export interface QualityCheckFormData {
  overallQuality: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement';
  comments: string;
  issues: string[];
  scopeConfirmations: {
    installationsCompleted: boolean;
    materialsInspected: boolean;
    adjustmentsResolved: boolean;
  };
  clientConfirmations: {
    workReviewed: boolean;
    noOutstandingIssues: boolean;
    responsibilitiesFulfilled: boolean;
  };
  signature: string;
}

export const QualityCheckFormModal: React.FC<QualityCheckFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<QualityCheckFormData>({
    overallQuality: 'good',
    comments: '',
    issues: [],
    scopeConfirmations: {
      installationsCompleted: false,
      materialsInspected: false,
      adjustmentsResolved: false
    },
    clientConfirmations: {
      workReviewed: false,
      noOutstandingIssues: false,
      responsibilitiesFulfilled: false
    },
    signature: ''
  });

  const [newIssue, setNewIssue] = useState('');
  const [isSigned, setIsSigned] = useState(false);

  const handleInputChange = (field: keyof QualityCheckFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (section: 'scopeConfirmations' | 'clientConfirmations', field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: checked
      }
    }));
  };

  const handleAddIssue = () => {
    if (newIssue.trim()) {
      setFormData(prev => ({ ...prev, issues: [...prev.issues, newIssue.trim()] }));
      setNewIssue('');
    }
  };

  const handleRemoveIssue = (index: number) => {
    setFormData(prev => ({ ...prev, issues: prev.issues.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigned(true);
    showToast('Quality Check Form signed successfully!');
    onSubmit(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      overallQuality: 'good',
      comments: '',
      issues: [],
      scopeConfirmations: {
        installationsCompleted: false,
        materialsInspected: false,
        adjustmentsResolved: false
      },
      clientConfirmations: {
        workReviewed: false,
        noOutstandingIssues: false,
        responsibilitiesFulfilled: false
      },
      signature: ''
    });
    setNewIssue('');
    setIsSigned(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Quality Check Form</h2>
              <p className="text-sm text-gray-500">Marriot Windows Installation Project</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                  Marriot Windows Installation
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Location</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                  123 Main Street, Downtown
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                  Marriot Hotels
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>

          {/* Quality Assessment */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-orange-600" />
              Quality Assessment
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Quality Rating *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'excellent', label: 'Excellent', color: 'bg-green-100 text-green-800 border-green-200' },
                    { value: 'good', label: 'Good', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                    { value: 'satisfactory', label: 'Satisfactory', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                    { value: 'needs_improvement', label: 'Needs Improvement', color: 'bg-red-100 text-red-800 border-red-200' }
                  ].map((option) => (
                    <label key={option.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="overallQuality"
                        value={option.value}
                        checked={formData.overallQuality === option.value}
                        onChange={(e) => handleInputChange('overallQuality', e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-3 rounded-lg border-2 text-center transition-all ${
                        formData.overallQuality === option.value
                          ? option.color + ' border-current'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}>
                        {option.label}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Issues Found */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Issues Found
            </h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  placeholder="Add an issue..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIssue())}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddIssue}
                  disabled={!newIssue.trim()}
                >
                  Add Issue
                </Button>
              </div>
              {formData.issues.length > 0 && (
                <div className="space-y-2">
                  {formData.issues.map((issue, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <span className="text-red-800">{issue}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveIssue(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Scope of Review */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Scope of Review</h3>
            <p className="text-sm text-gray-600 mb-4">The undersigned confirms that:</p>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.scopeConfirmations.installationsCompleted}
                  onChange={(e) => handleCheckboxChange('scopeConfirmations', 'installationsCompleted', e.target.checked)}
                  className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">
                  All installations under this project have been completed in full as per the agreed scope of work.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.scopeConfirmations.materialsInspected}
                  onChange={(e) => handleCheckboxChange('scopeConfirmations', 'materialsInspected', e.target.checked)}
                  className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">
                  All windows, films, and materials have been inspected and meet the required standards.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.scopeConfirmations.adjustmentsResolved}
                  onChange={(e) => handleCheckboxChange('scopeConfirmations', 'adjustmentsResolved', e.target.checked)}
                  className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">
                  Any adjustments or corrections identified during the quality check have been resolved to the client's satisfaction.
                </span>
              </label>
            </div>
          </Card>

          {/* Client Confirmation */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Client Confirmation</h3>
            <p className="text-sm text-gray-600 mb-4">By signing below, the client acknowledges that:</p>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.clientConfirmations.workReviewed}
                  onChange={(e) => handleCheckboxChange('clientConfirmations', 'workReviewed', e.target.checked)}
                  className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">
                  The work has been reviewed and is satisfactory in quality and completion.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.clientConfirmations.noOutstandingIssues}
                  onChange={(e) => handleCheckboxChange('clientConfirmations', 'noOutstandingIssues', e.target.checked)}
                  className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">
                  No outstanding issues remain that prevent the project from being closed.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.clientConfirmations.responsibilitiesFulfilled}
                  onChange={(e) => handleCheckboxChange('clientConfirmations', 'responsibilitiesFulfilled', e.target.checked)}
                  className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">
                  Safe Haven Defense has fulfilled its responsibilities for this project.
                </span>
              </label>
            </div>
          </Card>

          {/* Project Sign-Off */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Project Sign-Off</h3>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                This document serves as the official sign-off and closure of the project. Upon signing, Safe Haven Defense is released from any further on-site work obligations, except under warranty terms (if applicable).
              </p>
            </div>
          </Card>

          {/* Digital Signature */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Digital Signature</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inspector Signature *
              </label>
              <input
                type="text"
                required
                value={formData.signature}
                onChange={(e) => handleInputChange('signature', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Type your full name to sign"
              />
              <p className="text-sm text-gray-500 mt-1">
                By typing your name above, you confirm that this quality inspection has been completed accurately.
              </p>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={
                isSigned ||
                !formData.signature ||
                !formData.scopeConfirmations.installationsCompleted ||
                !formData.scopeConfirmations.materialsInspected ||
                !formData.scopeConfirmations.adjustmentsResolved ||
                !formData.clientConfirmations.workReviewed ||
                !formData.clientConfirmations.noOutstandingIssues ||
                !formData.clientConfirmations.responsibilitiesFulfilled
              }
            >
              {isSigned ? 'QF Signed' : 'Submit Quality Check Form'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
