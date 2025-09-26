import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../../common/components/Button';
import { Modal } from '../../../../common/components/Modal';

export interface InventoryItem {
  id: string;
  product: string;
  total: number;
  usedSheets: number;
  serialNumbers: string[];
}

export interface AddUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (usageData: InventoryItem[]) => void;
}

// Predefined product list
const PRODUCT_LIST = [
  'SW450SR',
  'SW440RC',
  'SW600RC+',
  'SW600FE',
  'SW600RC+',
  'Tint Only',
  'SW600FE',
  'SW600RC',
  'SW600BR',
  'Kevlar'
];

export const AddUsageModal: React.FC<AddUsageModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(
    PRODUCT_LIST.map((product, index) => ({
      id: `item-${index + 1}`,
      product,
      total: 0,
      usedSheets: 0,
      serialNumbers: ['']
    }))
  );

  const handleAddSerialNumber = (itemId: string) => {
    setInventoryItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, serialNumbers: [...item.serialNumbers, ''] }
        : item
    ));
  };

  const handleRemoveSerialNumber = (itemId: string, serialIndex: number) => {
    setInventoryItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            serialNumbers: item.serialNumbers.filter((_, index) => index !== serialIndex)
          }
        : item
    ));
  };

  const handleItemChange = (itemId: string, field: keyof Omit<InventoryItem, 'id' | 'product' | 'serialNumbers'>, value: number) => {
    setInventoryItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const handleSerialNumberChange = (itemId: string, serialIndex: number, value: string) => {
    setInventoryItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            serialNumbers: item.serialNumbers.map((serial, index) => 
              index === serialIndex ? value : serial
            )
          }
        : item
    ));
  };

  const handleSubmit = () => {
    const validItems = inventoryItems.filter(item => 
      item.total > 0 || item.usedSheets > 0 || item.serialNumbers.some(serial => serial.trim())
    );
    
    if (validItems.length === 0) {
      alert('Please add at least one valid inventory item');
      return;
    }

    onSubmit(validItems);
    onClose();
  };

  const handleClose = () => {
    setInventoryItems(
      PRODUCT_LIST.map((product, index) => ({
        id: `item-${index + 1}`,
        product,
        total: 0,
        usedSheets: 0,
        serialNumbers: ['']
      }))
    );
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Add Usage</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Add materials and quantities used for this project. This will help track project costs and inventory.
          </p>
        </div>

        {/* Project Inventory Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Project Inventory</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Used Sheets
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Serial Numbers
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {/* Product Column */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.product}</div>
                    </td>
                    
                    {/* Total Column */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        value={item.total}
                        onChange={(e) => handleItemChange(item.id, 'total', parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </td>
                    
                    {/* Used Sheets Column */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        value={item.usedSheets}
                        onChange={(e) => handleItemChange(item.id, 'usedSheets', parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </td>
                    
                    {/* Serial Numbers Column */}
                    <td className="px-4 py-4">
                      <div className="space-y-2">
                        {item.serialNumbers.map((serial, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={serial}
                              onChange={(e) => handleSerialNumberChange(item.id, index, e.target.value)}
                              placeholder="Enter serial number"
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {item.serialNumbers.length > 1 && (
                              <button
                                onClick={() => handleRemoveSerialNumber(item.id, index)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddSerialNumber(item.id)}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Serial Number
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
          <Button
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
          >
            Add Usage
          </Button>
        </div>
      </div>
    </Modal>
  );
};
