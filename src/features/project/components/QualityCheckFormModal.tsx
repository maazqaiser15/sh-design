import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { Button } from '../../../common/components/Button';
import { Card } from '../../../common/components/Card';

interface QualityCheckFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: QualityCheckFormData) => void;
}

export interface QualityCheckFormData {
  todaysDate: string;
  projectName: string;
  siteLocation: string;
  ownersRep: string;
  qualityWalkCompleted: boolean;
  windowsFreeFromDebris: boolean;
  curingTimeAcknowledged: boolean;
  inspectionDistance: boolean;
  visualInspectionCompleted: boolean;
  workmanshipApproved: boolean;
  professionalismApproved: boolean;
  signature: string;
  comments: string;
}

export const QualityCheckFormModal: React.FC<QualityCheckFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<QualityCheckFormData>({
    todaysDate: new Date().toLocaleDateString(),
    projectName: 'Marriot Windows Installation',
    siteLocation: '123 Main Street, Downtown',
    ownersRep: '',
    qualityWalkCompleted: false,
    windowsFreeFromDebris: false,
    curingTimeAcknowledged: false,
    inspectionDistance: false,
    visualInspectionCompleted: false,
    workmanshipApproved: false,
    professionalismApproved: false,
    signature: '',
    comments: ''
  });

  const handleInputChange = (field: keyof QualityCheckFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof QualityCheckFormData, checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      todaysDate: new Date().toLocaleDateString(),
      projectName: 'Marriot Windows Installation',
      siteLocation: '123 Main Street, Downtown',
      ownersRep: '',
      qualityWalkCompleted: false,
      windowsFreeFromDebris: false,
      curingTimeAcknowledged: false,
      inspectionDistance: false,
      visualInspectionCompleted: false,
      workmanshipApproved: false,
      professionalismApproved: false,
      signature: '',
      comments: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Safe Haven Defense Branding */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <div className="text-blue-600 font-bold text-lg">SHD</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">SAFE HAVEN</h1>
                <p className="text-blue-200 text-sm">DEFENSE</p>
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">Safe Haven Defense US, LLC</p>
              <p>22849 N 19TH Ave, Ste. 100</p>
              <p>Phoenix, AZ 85027</p>
              <p>p 480.689.7871</p>
              <p>// safehavendefense.com</p>
            </div>
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center py-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 underline">Quality Walk</h2>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 min-w-[120px]">Today's Date:</label>
              <input
                type="text"
                value={formData.todaysDate}
                onChange={(e) => handleInputChange('todaysDate', e.target.value)}
                className="flex-1 px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                placeholder="MM/DD/YYYY"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 min-w-[120px]">Project Name:</label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                className="flex-1 px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 min-w-[120px]">Site/Location:</label>
              <input
                type="text"
                value={formData.siteLocation}
                onChange={(e) => handleInputChange('siteLocation', e.target.value)}
                className="flex-1 px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 min-w-[120px]">Owners Rep.:</label>
              <input
                type="text"
                value={formData.ownersRep}
                onChange={(e) => handleInputChange('ownersRep', e.target.value)}
                className="flex-1 px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                placeholder="Enter owner's representative name"
              />
            </div>
          </div>

          {/* PURPOSE Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">PURPOSE</h3>
            
            <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
              <p>
                Safe Haven Defense US, LLC is a recognized leader in surety laminate solutions. We provide an exceptionally finished product installed by trained experts using our innovative installation technique. Our bullet resistant films are unique, lab tested, UL certified, and provide 1 Directional Bullet Resistance while restricting unauthorized access. We stand behind our work with comprehensive warranties.
              </p>
              
              <p>
                This form serves as your approval of our workmanship and the professionalism shown by our installation team. Please ensure windows are free from debris, particle dust exists, and note that 30 days or more of curing time is required. Conduct a quality walk at a 6'-0" distance, visually inspect our work areas and mainly at right angles, from a standing and/or seated position. Please sign below for approval of a successfully completed project.
              </p>
              
              <p>
                If you have any questions, comments or concerns, please contact us so we can find a solution. Thank you for your interest in our products and trust in contracting with Safe Haven Defense US.
              </p>
            </div>
          </div>



          {/* Comments Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Additional Comments</h3>
            <textarea
              value={formData.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any additional comments or concerns..."
            />
          </div>

          {/* Signature Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Signature</h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Owner's Representative Signature *
              </label>
              <input
                type="text"
                required
                value={formData.signature}
                onChange={(e) => handleInputChange('signature', e.target.value)}
                className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                placeholder="Type your full name to sign"
              />
              <p className="text-sm text-gray-500">
                By signing above, you confirm approval of a successfully completed project.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
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
                  !formData.signature ||
                  !formData.qualityWalkCompleted ||
                  !formData.windowsFreeFromDebris ||
                  !formData.curingTimeAcknowledged ||
                  !formData.inspectionDistance ||
                  !formData.visualInspectionCompleted ||
                  !formData.workmanshipApproved ||
                  !formData.professionalismApproved
                }
              >
                Submit Quality Walk Form
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
