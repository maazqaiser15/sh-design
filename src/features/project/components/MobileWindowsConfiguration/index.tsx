import React, { useState } from 'react';
import { Trash2, Plus, Edit2, Save, X, ChevronDown, ChevronUp, Building2, AppWindow } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { useSidebar } from '../../../../contexts/SidebarContext';
import FormField from 'common/components/FormField';
import { Form, Formik } from 'formik';
import CustomDataTable from 'common/components/CustomDataTable';

interface WindowRow {
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

interface SetupWindowsData {
  windows: WindowRow[];
}

interface MobileWindowsConfigurationProps {
  onSave: (data: SetupWindowsData) => void;
  onCancel: () => void;
  onAddBuilding: () => void;
  showSetupButton?: boolean;
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

export const MobileWindowsConfiguration: React.FC<MobileWindowsConfigurationProps> = ({
  onSave,
  onCancel,
  onAddBuilding,
  showSetupButton = true
}) => {
  const { isMobile } = useSidebar();
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

  const [editingWindow, setEditingWindow] = useState<string | null>(null);
  const [expandedBuildings, setExpandedBuildings] = useState<Set<string>>(new Set(['building-1']));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleWindowChange = (windowId: string, field: keyof WindowRow, value: any) => {
    setFormData((prev: SetupWindowsData) => ({
      ...prev,
      windows: prev.windows.map((window: WindowRow) =>
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

    setFormData((prev: SetupWindowsData) => ({
      ...prev,
      windows: [...prev.windows, newWindow]
    }));
  };

  const removeWindow = (windowId: string) => {
    if (formData.windows.length > 1) {
      setFormData((prev: SetupWindowsData) => ({
        ...prev,
        windows: prev.windows.filter((window: WindowRow) => window.id !== windowId)
      }));
    }
  };

  const toggleEdit = (windowId: string) => {
    setEditingWindow(editingWindow === windowId ? null : windowId);
  };

  const toggleBuilding = (buildingId: string) => {
    setExpandedBuildings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(buildingId)) {
        newSet.delete(buildingId);
      } else {
        newSet.add(buildingId);
      }
      return newSet;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.windows.length === 0) {
      newErrors.windows = 'At least one window is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  // Mobile Card Component
  const WindowCard: React.FC<{ window: WindowRow }> = ({ window }) => {
    const isEditing = editingWindow === window.id;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 text-base">{window.windowLabel} </h3>
              <span className="text-sm text-gray-500">{window.product}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600">{window.color}</span>
              {window.tint !== 'None' && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {window.tint}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleEdit(window.id)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded mobile-touch-target"
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => removeWindow(window.id)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded mobile-touch-target"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card Body - Read Mode */}
        {!isEditing && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Width</label>
                <div className="text-sm text-gray-900 mt-1">{window.width}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Length</label>
                <div className="text-sm text-gray-900 mt-1">{window.length}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Interior</label>
                <div className="text-sm text-gray-900 mt-1">{window.interiorLayer}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Exterior</label>
                <div className="text-sm text-gray-900 mt-1">{window.exteriorLayer}</div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tint</label>
                <div className="text-sm text-gray-900 mt-1">{window.tint}</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={window.stripping}
                  disabled
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">Stripping</label>
              </div>
            </div>
          </div>
        )}

        {/* Card Body - Edit Mode */}
        {isEditing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Width</label>
                <input
                  type="number"
                  value={window.width}
                  onChange={(e) => handleWindowChange(window.id, 'width', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mobile-touch-target"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Length</label>
                <input
                  type="number"
                  value={window.length}
                  onChange={(e) => handleWindowChange(window.id, 'length', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mobile-touch-target"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Product</label>
                <select
                  value={window.product}
                  onChange={(e) => handleWindowChange(window.id, 'product', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mobile-touch-target"
                >
                  {PRODUCTS.map((product) => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Interior</label>
                  <select
                    value={window.interiorLayer}
                    onChange={(e) => handleWindowChange(window.id, 'interiorLayer', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mobile-touch-target"
                  >
                    {LAYER_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Exterior</label>
                  <select
                    value={window.exteriorLayer}
                    onChange={(e) => handleWindowChange(window.id, 'exteriorLayer', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mobile-touch-target"
                  >
                    {LAYER_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Color</label>
                  <select
                    value={window.color}
                    onChange={(e) => handleWindowChange(window.id, 'color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mobile-touch-target"
                  >
                    {COLORS.map((color) => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Tint</label>
                  <select
                    value={window.tint}
                    onChange={(e) => handleWindowChange(window.id, 'tint', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mobile-touch-target"
                  >
                    {TINTS.map((tint) => (
                      <option key={tint} value={tint}>{tint}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={window.stripping}
                  onChange={(e) => handleWindowChange(window.id, 'stripping', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mobile-touch-target"
                />
                <label className="text-sm text-gray-700">Stripping</label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditingWindow(null)}
                className="mobile-touch-target"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setEditingWindow(null)}
                className="mobile-touch-target"
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const columns = [
    {
      name: 'Window',
      selector: (row: any) => row.name,
      cell: (row: any) => <div>
        <input
          type="text"
          value={row.windowLabel}
          onChange={(e) => handleWindowChange(row.id, 'windowLabel', e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded "
        />
      </div>,
      width: '92px'
    },
    {
      name: 'Width',
      selector: (row: any) => row.name,
      cell: (row: any) => <div>
        <input
          type="number"
          value={row.width}
          onChange={(e) => handleWindowChange(row.id, 'width', parseInt(e.target.value) || 0)}
          className="w-full px-2 py-1 border border-gray-300 rounded "
        />
      </div>,
      width: '82px'
    },
    {
      name: 'Length',
      selector: (row: any) => row.name,
      cell: (row: any) => <div>
        <input
          type="number"
          value={row.length}
          onChange={(e) => handleWindowChange(row.id, 'length', parseInt(e.target.value) || 0)}
          className="w-full px-2 py-1 border border-gray-300 rounded "
        />
      </div>,
      width: '92px'
    },
    {
      name: 'Product',
      selector: (row: any) => row.name,
      cell: (row: any) => <div>
        <select
          value={row.product}
          onChange={(e) => handleWindowChange(row.id, 'product', e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded "
        >
          {PRODUCTS.map((product) => (
            <option key={product} value={product}>{product}</option>
          ))}
        </select>
      </div>,
      width: '140px'
    },
    {
      name: 'Interior',
      selector: (row: any) => row.name,
      cell: (row: any) => <div>
        <select
          value={row.interiorLayer}
          onChange={(e) => handleWindowChange(row.id, 'interiorLayer', parseInt(e.target.value))}
          className="w-full px-2 py-1 border border-gray-300 rounded "
        >
          {LAYER_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>,
      width: '84px'
    },
    {
      name: 'Exterior',
      selector: (row: any) => row.name,
      cell: (row: any) => <div>
        <select
          value={row.exteriorLayer}
          onChange={(e) => handleWindowChange(row.id, 'exteriorLayer', parseInt(e.target.value))}
          className="w-full px-2 py-1 border border-gray-300 rounded "
        >
          {LAYER_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>,
      width: '90px'
    },
    {
      name: 'Color',
      selector: (row: any) => row.name,
      cell: (row: any) => <div>
        <select
          value={row.color}
          onChange={(e) => handleWindowChange(row.id, 'color', e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded "
        >
          {COLORS.map((color) => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
      </div>,
      width: '120px'
    },
    {
      name: 'Tint',
      selector: (row: any) => row.name,
      cell: (row: any) => <div>
        <select
          value={row.tint}
          onChange={(e) => handleWindowChange(row.id, 'tint', e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded "
        >
          {TINTS.map((tint) => (
            <option key={tint} value={tint}>{tint}</option>
          ))}
        </select>
      </div>,
      width: '120px'
    },
    {
      name: 'Stripping',
      selector: (row: any) => row.name,
      cell: (row: any) => <div>
        <input
          type="checkbox"
          checked={row.stripping}
          onChange={(e) => handleWindowChange(row.id, 'stripping', e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </div>,
      width: '100px'
    },
    {
      name: 'Actions',
      selector: (row: any) => row.name,
      cell: (row: any) => <div>
        <button
          onClick={() => removeWindow(row.id)}
          className="text-red-600 hover:text-red-800 p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    }

  ]
  // Desktop Table View
  const DesktopTableView = () => (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <CustomDataTable title={''} columns={columns} data={formData?.windows} selectableRows={undefined} pagination={false} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={undefined} />
      </div>
    </div>
  );

  return (
    <div className="">
      <style>{`
        @media (max-width: 640px) {
          .mobile-touch-target {
            min-height: 44px;
            min-width: 44px;
            padding: 12px 16px;
          }
          .mobile-scroll {
            -webkit-overflow-scrolling: touch;
          }
          .mobile-card {
            border-radius: 12px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
            margin-bottom: 16px;
          }
        }
      `}</style>
      {/* Header */}
      <div className="mb-4 mt-0">
        <div className='flex justify-between items-center mb-4'>
          <h2 className="text-lg font-semibold text-gray-900">Windows Configuration</h2>
          {showSetupButton ?
            <Button
              variant="primary"
              onClick={handleSave}
              className="w-full sm:w-auto mobile-touch-target"
            >
              Setup Windows
            </Button> :
            <Button
              variant="secondary"
              onClick={handleSave}
              className="w-full sm:w-auto mobile-touch-target"
            >
              <Trash2 size={18} />  Remove
            </Button>
          }
        </div>

        <div className="flex flex-col items-center justify-between sm:flex-row gap-2 sm:gap-3">
          <div className='flex-1'>
            <Formik
              initialValues={{ building: "" }}
              onSubmit={(vals) => console.log(vals)}
            >
              <Form>
                <FormField className='mb-0' label="" name="building" type="text" placeholder='Enter building name (e.g., Main Building, Office Block, etc.)' />
              </Form>
            </Formik>

          </div>

          <div className='flex gap-2'>
            <Button
              variant="secondary"
              icon={Plus}
              onClick={onAddBuilding}
              size='md'
              className="text-sm py-[11px] mobile-touch-target w-full sm:w-auto"
            >
             
              Add Building
            </Button>
            <Button
              variant="secondary"
              icon={Plus}
              onClick={addWindow}
              className="text-sm py-[11px] mobile-touch-target w-full sm:w-auto"
            >
             
              Add Window
            </Button>
          </div>

        </div>
      </div>


      {/* Error Display */}
      {errors.windows && (
        <div className="text-red-600 text-sm">
          <p>{errors.windows}</p>
        </div>
      )}

      {/* Content - Mobile Cards or Desktop Table */}
      {isMobile ? (
        <div className="space-y-3">
          {/* Building Header */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Main Building</h3>
              <p className="text-sm text-gray-500">{formData.windows.length} Windows Configured</p>
            </div>
            <button
              onClick={() => toggleBuilding('building-1')}
              className="p-2 text-gray-400 hover:text-gray-600 mobile-touch-target"
            >
              {expandedBuildings.has('building-1') ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Windows List */}
          {expandedBuildings.has('building-1') && (
            <div className="space-y-3">
              {formData.windows.map((window) => (
                <WindowCard key={window.id} window={window} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <DesktopTableView />
      )}
    </div>
  );
};
