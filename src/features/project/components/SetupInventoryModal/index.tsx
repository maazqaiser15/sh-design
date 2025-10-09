import React, { useState } from 'react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';

interface InventoryItem {
  id: string;
  width: string;
  length: string;
  quantity: number;
  product: string;
  interiorLayer: number;
  exteriorLayer: number;
  color: string;
  tint: string;
  extraTintLayer: boolean;
  stripping: boolean;
  thickness: string;
  comments: string;
}

interface SetupInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (items: InventoryItem[]) => void;
}

// Mock data for initial rows
const mockInventoryData: InventoryItem[] = [
  {
    id: '1',
    width: '48"',
    length: '96"',
    quantity: 10,
    product: 'Standard Glass',
    interiorLayer: 2,
    exteriorLayer: 1,
    color: 'Clear',
    tint: 'None',
    extraTintLayer: false,
    stripping: true,
    thickness: '1/4"',
    comments: 'Standard window glass'
  },
  {
    id: '2',
    width: '36"',
    length: '72"',
    quantity: 5,
    product: 'Tempered Glass',
    interiorLayer: 3,
    exteriorLayer: 2,
    color: 'Bronze',
    tint: 'Medium',
    extraTintLayer: true,
    stripping: false,
    thickness: '3/8"',
    comments: 'Tempered for safety'
  },
  {
    id: '3',
    width: '24"',
    length: '48"',
    quantity: 15,
    product: 'Laminated Glass',
    interiorLayer: 1,
    exteriorLayer: 1,
    color: 'Blue',
    tint: 'Light',
    extraTintLayer: false,
    stripping: true,
    thickness: '1/2"',
    comments: 'Laminated for security'
  },
  {
    id: '4',
    width: '60"',
    length: '120"',
    quantity: 3,
    product: 'Insulated Glass',
    interiorLayer: 4,
    exteriorLayer: 3,
    color: 'Green',
    tint: 'Dark',
    extraTintLayer: true,
    stripping: false,
    thickness: '5/8"',
    comments: 'Energy efficient'
  },
  {
    id: '5',
    width: '30"',
    length: '60"',
    quantity: 8,
    product: 'Low-E Glass',
    interiorLayer: 2,
    exteriorLayer: 2,
    color: 'Silver',
    tint: 'None',
    extraTintLayer: false,
    stripping: true,
    thickness: '1/4"',
    comments: 'Low emissivity coating'
  }
];

const colorOptions = ['Clear', 'Bronze', 'Blue', 'Green', 'Silver', 'Gray', 'Black'];
const tintOptions = ['None', 'Light', 'Medium', 'Dark'];
const thicknessOptions = ['1/8"', '1/4"', '3/8"', '1/2"', '5/8"', '3/4"', '1"'];
const productOptions = ['Standard Glass', 'Tempered Glass', 'Laminated Glass', 'Insulated Glass', 'Low-E Glass', 'Safety Glass'];

export const SetupInventoryModal: React.FC<SetupInventoryModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryData);

  const handleItemChange = (id: string, field: keyof InventoryItem, value: string | number | boolean) => {
    setInventoryItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const handleSave = () => {
    onSave?.(inventoryItems);
    onClose();
  };

  const addNewItem = () => {
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      width: '',
      length: '',
      quantity: 1,
      product: '',
      interiorLayer: 1,
      exteriorLayer: 1,
      color: '',
      tint: '',
      extraTintLayer: false,
      stripping: false,
      thickness: '',
      comments: ''
    };
    setInventoryItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setInventoryItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Setup Inventory"
      size="xl"
    >
      <div className="space-y-6">
        {/* Add New Item Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={addNewItem}
          >
            Add New Item
          </Button>
        </div>

        {/* Table Container */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Width
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Length
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Interior Layer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Exterior Layer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Color
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Tint
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Extra Tint
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Stripping
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    Thickness
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Comments/Notes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {/* Width */}
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.width}
                        onChange={(e) => handleItemChange(item.id, 'width', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 48&quot;"
                      />
                    </td>

                    {/* Length */}
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.length}
                        onChange={(e) => handleItemChange(item.id, 'length', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 96&quot;"
                      />
                    </td>

                    {/* Quantity */}
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>

                    {/* Product */}
                    <td className="px-4 py-3">
                      <select
                        value={item.product}
                        onChange={(e) => handleItemChange(item.id, 'product', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Product</option>
                        {productOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>

                    {/* Interior Layer */}
                    <td className="px-4 py-3">
                      <select
                        value={item.interiorLayer}
                        onChange={(e) => handleItemChange(item.id, 'interiorLayer', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </td>

                    {/* Exterior Layer */}
                    <td className="px-4 py-3">
                      <select
                        value={item.exteriorLayer}
                        onChange={(e) => handleItemChange(item.id, 'exteriorLayer', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </td>

                    {/* Color */}
                    <td className="px-4 py-3">
                      <select
                        value={item.color}
                        onChange={(e) => handleItemChange(item.id, 'color', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Color</option>
                        {colorOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>

                    {/* Tint */}
                    <td className="px-4 py-3">
                      <select
                        value={item.tint}
                        onChange={(e) => handleItemChange(item.id, 'tint', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Tint</option>
                        {tintOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>

                    {/* Extra Tint Layer */}
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={item.extraTintLayer}
                        onChange={(e) => handleItemChange(item.id, 'extraTintLayer', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>

                    {/* Stripping */}
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={item.stripping}
                        onChange={(e) => handleItemChange(item.id, 'stripping', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>

                    {/* Thickness */}
                    <td className="px-4 py-3">
                      <select
                        value={item.thickness}
                        onChange={(e) => handleItemChange(item.id, 'thickness', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Thickness</option>
                        {thicknessOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>

                    {/* Comments/Notes */}
                    <td className="px-4 py-3">
                      <textarea
                        value={item.comments}
                        onChange={(e) => handleItemChange(item.id, 'comments', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={2}
                        placeholder="Add comments..."
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};