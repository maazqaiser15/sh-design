import React, { useState } from 'react';
import { X, Plus, Trash2, Settings } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Modal } from '../../../../common/components/Modal';

interface SetupWindowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SetupWindowsData) => void;
}

export interface WindowRow {
  id: string;
  windowLabel: string;
  width: number;
  length: number;
  product: string;
  interiorLayer: number;
  exteriorLayer: number;
  color: string;
  tint: string;
  stripping: boolean;
}

export interface SetupWindowsData {
  windows: WindowRow[];
}

const PRODUCTS = [
  'SW450SR',
  'SW600FE',
  'SW440RC',
  'SW600RC',
  'SW600RC+',
  'SW600BR',
  'Tint Only',
  'Kevlar'
];

const COLORS = ['Black', 'White'];

const TINTS = ['None', 'Light', 'Dark'];

const LAYER_OPTIONS = [1, 2, 3, 4];

export const SetupWindowsModal: React.FC<SetupWindowsModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<SetupWindowsData>({
    windows: [
      {
        id: '1',
        windowLabel: 'W1',
        width: 2,
        length: 2,
        product: 'SW450SR',
        interiorLayer: 2,
        exteriorLayer: 3,
        color: 'Black',
        tint: 'None',
        stripping: false
      }
    ]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});


  const handleWindowChange = (windowId: string, field: keyof WindowRow, value: any) => {
    setFormData(prev => ({
      ...prev,
      windows: prev.windows.map(window => 
        window.id === windowId 
          ? { ...window, [field]: value }
          : window
      )
    }));
  };

  const addWindow = () => {
    const newId = (formData.windows.length + 1).toString();
    const newWindow: WindowRow = {
      id: newId,
      windowLabel: `W${formData.windows.length + 1}`,
      width: 2,
      length: 2,
      product: 'SW450SR',
      interiorLayer: 1,
      exteriorLayer: 1,
      color: 'Black',
      tint: 'None',
      stripping: false
    };

    setFormData(prev => ({
      ...prev,
      windows: [...prev.windows, newWindow]
    }));
  };

  const removeWindow = (windowId: string) => {
    if (formData.windows.length > 1) {
      setFormData(prev => ({
        ...prev,
        windows: prev.windows.filter(window => window.id !== windowId)
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.windows.length === 0) {
      newErrors.windows = 'At least one window is required';
    }

    // Validate each window
    formData.windows.forEach((window, index) => {
      if (!window.windowLabel.trim()) {
        newErrors[`window_${index}_label`] = 'Window label is required';
      }
      if (window.width <= 0) {
        newErrors[`window_${index}_width`] = 'Width must be greater than 0';
      }
      if (window.length <= 0) {
        newErrors[`window_${index}_length`] = 'Length must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      windows: [
        {
          id: '1',
          windowLabel: 'W1',
          width: 2,
          length: 2,
          product: 'SW450SR',
          interiorLayer: 2,
          exteriorLayer: 3,
          color: 'Black',
          tint: 'None',
          stripping: false
        }
      ]
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Setup Windows for Project"
      size="xl"
    >
      <div className="space-y-6">

        {/* Windows Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Windows Configuration</h3>
            <Button
              variant="secondary"
              icon={Plus}
              onClick={addWindow}
              className="text-sm"
            >
              Add Window
            </Button>
          </div>

          {errors.windows && (
            <p className="text-sm text-red-600">{errors.windows}</p>
          )}

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      Window Label
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                      Width
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                      Length
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      Product
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      Interior Layer
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                      Exterior Layer
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                      Color
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                      Tint
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                      Stripping
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.windows.map((window, index) => (
                    <tr key={window.id} className="hover:bg-gray-50">
                      {/* Window Label */}
                      <td className="px-3 py-3">
                        <input
                          type="text"
                          value={window.windowLabel}
                          onChange={(e) => handleWindowChange(window.id, 'windowLabel', e.target.value)}
                          className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent ${
                            errors[`window_${index}_label`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="W1"
                        />
                        {errors[`window_${index}_label`] && (
                          <p className="text-xs text-red-600 mt-1">{errors[`window_${index}_label`]}</p>
                        )}
                      </td>

                      {/* Width */}
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          min="1"
                          value={window.width}
                          onChange={(e) => handleWindowChange(window.id, 'width', parseInt(e.target.value) || 0)}
                          className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent ${
                            errors[`window_${index}_width`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors[`window_${index}_width`] && (
                          <p className="text-xs text-red-600 mt-1">{errors[`window_${index}_width`]}</p>
                        )}
                      </td>

                      {/* Length */}
                      <td className="px-3 py-3">
                        <input
                          type="number"
                          min="1"
                          value={window.length}
                          onChange={(e) => handleWindowChange(window.id, 'length', parseInt(e.target.value) || 0)}
                          className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent ${
                            errors[`window_${index}_length`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors[`window_${index}_length`] && (
                          <p className="text-xs text-red-600 mt-1">{errors[`window_${index}_length`]}</p>
                        )}
                      </td>

                      {/* Product */}
                      <td className="px-3 py-3">
                        <select
                          value={window.product}
                          onChange={(e) => handleWindowChange(window.id, 'product', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        >
                          {PRODUCTS.map(product => (
                            <option key={product} value={product}>{product}</option>
                          ))}
                        </select>
                      </td>

                      {/* Interior Layer */}
                      <td className="px-3 py-3">
                        <select
                          value={window.interiorLayer}
                          onChange={(e) => handleWindowChange(window.id, 'interiorLayer', parseInt(e.target.value))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        >
                          {LAYER_OPTIONS.map(layer => (
                            <option key={layer} value={layer}>{layer}</option>
                          ))}
                        </select>
                      </td>

                      {/* Exterior Layer */}
                      <td className="px-3 py-3">
                        <select
                          value={window.exteriorLayer}
                          onChange={(e) => handleWindowChange(window.id, 'exteriorLayer', parseInt(e.target.value))}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        >
                          {LAYER_OPTIONS.map(layer => (
                            <option key={layer} value={layer}>{layer}</option>
                          ))}
                        </select>
                      </td>

                      {/* Color */}
                      <td className="px-3 py-3">
                        <select
                          value={window.color}
                          onChange={(e) => handleWindowChange(window.id, 'color', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        >
                          {COLORS.map(color => (
                            <option key={color} value={color}>{color}</option>
                          ))}
                        </select>
                      </td>

                      {/* Tint */}
                      <td className="px-3 py-3">
                        <select
                          value={window.tint}
                          onChange={(e) => handleWindowChange(window.id, 'tint', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        >
                          {TINTS.map(tint => (
                            <option key={tint} value={tint}>{tint}</option>
                          ))}
                        </select>
                      </td>

                      {/* Stripping */}
                      <td className="px-3 py-3">
                        <div className="flex justify-center">
                          <input
                            type="checkbox"
                            checked={window.stripping}
                            onChange={(e) => handleWindowChange(window.id, 'stripping', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3">
                        <div className="flex justify-center">
                          <button
                            onClick={() => removeWindow(window.id)}
                            disabled={formData.windows.length === 1}
                            className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <Button
          variant="secondary"
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
        >
          Setup Windows
        </Button>
      </div>
    </Modal>
  );
};
