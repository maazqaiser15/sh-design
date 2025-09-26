import React, { useState } from 'react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';

interface InventoryItem {
  id: string;
  width: number;
  length: number;
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

interface ProductQuantity {
  product: string;
  required: number;
}

interface SetupInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productQuantities: ProductQuantity[]) => void;
}

// Mock data
const initialInventoryData: InventoryItem[] = [
  {
    id: '1',
    width: 2,
    length: 2,
    quantity: 1,
    product: 'SW450SR',
    interiorLayer: 2,
    exteriorLayer: 3,
    color: 'Black',
    tint: 'None',
    extraTintLayer: false,
    stripping: false,
    thickness: '4mm',
    comments: 'Main window panel'
  },
  {
    id: '2',
    width: 2,
    length: 3,
    quantity: 2,
    product: 'SW600FE',
    interiorLayer: 1,
    exteriorLayer: 4,
    color: 'White',
    tint: 'None',
    extraTintLayer: false,
    stripping: false,
    thickness: '5mm',
    comments: 'Front entrance'
  },
  {
    id: '3',
    width: 3,
    length: 4,
    quantity: 1,
    product: 'SW440RC',
    interiorLayer: 3,
    exteriorLayer: 2,
    color: 'Black',
    tint: 'Light',
    extraTintLayer: false,
    stripping: false,
    thickness: '6mm',
    comments: 'Reinforced corner'
  },
  {
    id: '4',
    width: 4,
    length: 4,
    quantity: 3,
    product: 'SW600RC',
    interiorLayer: 4,
    exteriorLayer: 1,
    color: 'Black',
    tint: 'Dark',
    extraTintLayer: true,
    stripping: false,
    thickness: '5mm',
    comments: 'Side wall glass'
  },
  {
    id: '5',
    width: 4,
    length: 5,
    quantity: 2,
    product: 'SW600RC+',
    interiorLayer: 2,
    exteriorLayer: 2,
    color: 'Black',
    tint: 'None',
    extraTintLayer: false,
    stripping: false,
    thickness: '6mm',
    comments: 'Heavy duty panel'
  },
  {
    id: '6',
    width: 3,
    length: 2,
    quantity: 1,
    product: 'SW600BR',
    interiorLayer: 1,
    exteriorLayer: 3,
    color: 'Black',
    tint: 'None',
    extraTintLayer: false,
    stripping: false,
    thickness: '5mm',
    comments: 'Balcony section'
  },
  {
    id: '7',
    width: 2,
    length: 6,
    quantity: 2,
    product: 'Tint Only',
    interiorLayer: 2,
    exteriorLayer: 4,
    color: 'Black',
    tint: 'Dark',
    extraTintLayer: true,
    stripping: false,
    thickness: '4mm',
    comments: 'Tint overlay'
  },
  {
    id: '8',
    width: 5,
    length: 5,
    quantity: 1,
    product: 'Kevlar',
    interiorLayer: 3,
    exteriorLayer: 3,
    color: 'Black',
    tint: 'None',
    extraTintLayer: false,
    stripping: false,
    thickness: '7mm',
    comments: 'Safety reinforced'
  }
];

const colorOptions = ['Black', 'White', 'Gray', 'Blue', 'Green', 'Red'];
const tintOptions = ['None', 'Light', 'Medium', 'Dark'];
const thicknessOptions = ['3mm', '4mm', '5mm', '6mm', '7mm', '8mm'];

/**
 * SetupInventoryModal - Modal for setting up project inventory
 * Features a comprehensive table with editable fields for inventory management
 */
export const SetupInventoryModal: React.FC<SetupInventoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [inventoryData] = useState<InventoryItem[]>(initialInventoryData);
  const [productQuantities, setProductQuantities] = useState<ProductQuantity[]>(() => {
    // Initialize with unique products and default quantity of 1
    const uniqueProducts = [...new Set(initialInventoryData.map(item => item.product))];
    return uniqueProducts.map(product => ({ product, required: 1 }));
  });

  const handleQuantityChange = (product: string, quantity: number) => {
    setProductQuantities(prev => 
      prev.map(item => 
        item.product === product ? { ...item, required: quantity } : item
      )
    );
  };

  const handleSubmit = () => {
    onSubmit(productQuantities);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Setup Inventory"
      size="xl"
    >
      <div className="p-6">
        {/* Read-only Table Container */}
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Width</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Length</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Quantity</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Product</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Interior Layer</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Exterior Layer</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Color</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Tint</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Extra Tint</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Stripping</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Thickness</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">Comments</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border-r border-gray-200 text-center">{item.width}</td>
                  <td className="px-3 py-2 border-r border-gray-200 text-center">{item.length}</td>
                  <td className="px-3 py-2 border-r border-gray-200 text-center">{item.quantity}</td>
                  <td className="px-3 py-2 border-r border-gray-200 font-medium">{item.product}</td>
                  <td className="px-3 py-2 border-r border-gray-200 text-center">{item.interiorLayer}</td>
                  <td className="px-3 py-2 border-r border-gray-200 text-center">{item.exteriorLayer}</td>
                  <td className="px-3 py-2 border-r border-gray-200">{item.color}</td>
                  <td className="px-3 py-2 border-r border-gray-200">{item.tint}</td>
                  <td className="px-3 py-2 border-r border-gray-200 text-center">
                    {item.extraTintLayer ? '✓' : '✗'}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200 text-center">
                    {item.stripping ? '✓' : '✗'}
                  </td>
                  <td className="px-3 py-2 border-r border-gray-200">{item.thickness}</td>
                  <td className="px-3 py-2 text-gray-600">{item.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Product Quantity Input Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Set Required Quantities</h3>
          <div className="grid grid-cols-2 gap-4">
            {productQuantities.map((productQty) => (
              <div key={productQty.product} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <span className="font-medium text-gray-900">{productQty.product}</span>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Required:</label>
                  <input
                    type="number"
                    value={productQty.required}
                    onChange={(e) => handleQuantityChange(productQty.product, parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};
