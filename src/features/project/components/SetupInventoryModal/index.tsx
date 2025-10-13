import React from 'react';
import { Modal } from '../../../../common/components/Modal';
import { Button } from '../../../../common/components/Button';
import { Edit, ChevronDown, Check, X } from 'lucide-react';

interface InventoryItem {
  id: string;
  width: string;
  length: string;
  quantity: number;
  product: string;
  anchoring: 'N' | 'X' | 'B';
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
    width: '2',
    length: '2',
    quantity: 1,
    product: 'SW450SR',
    anchoring: 'N',
    color: 'Black',
    tint: 'None',
    extraTintLayer: false,
    stripping: false,
    thickness: '4mm',
    comments: 'Main window panel'
  },
  {
    id: '2',
    width: '2',
    length: '3',
    quantity: 2,
    product: 'SW600FE',
    anchoring: 'X',
    color: 'White',
    tint: 'None',
    extraTintLayer: false,
    stripping: false,
    thickness: '5mm',
    comments: 'Front entrance'
  },
  {
    id: '3',
    width: '3',
    length: '4',
    quantity: 1,
    product: 'SW440RC',
    anchoring: 'B',
    color: 'Black',
    tint: 'Light',
    extraTintLayer: false,
    stripping: false,
    thickness: '6mm',
    comments: 'Reinforced corner'
  },
  {
    id: '4',
    width: '4',
    length: '4',
    quantity: 3,
    product: 'SW600RC',
    anchoring: 'N',
    color: 'Black',
    tint: 'Dark',
    extraTintLayer: true,
    stripping: false,
    thickness: '5mm',
    comments: 'Side wall glass'
  },
  {
    id: '5',
    width: '4',
    length: '5',
    quantity: 2,
    product: 'SW600RC+',
    anchoring: 'X',
    color: 'Black',
    tint: 'None',
    extraTintLayer: false,
    stripping: false,
    thickness: '6mm',
    comments: 'Heavy duty panel'
  },
  {
    id: '6',
    width: '3',
    length: '2',
    quantity: 1,
    product: 'SW600BR',
    anchoring: 'B',
    color: 'Black',
    tint: 'None',
    extraTintLayer: false,
    stripping: false,
    thickness: '5mm',
    comments: 'Balcony section'
  },
  {
    id: '7',
    width: '2',
    length: '6',
    quantity: 2,
    product: 'Tint Only',
    anchoring: 'N',
    color: 'Black',
    tint: 'Dark',
    extraTintLayer: true,
    stripping: false,
    thickness: '4mm',
    comments: 'Tint overlay'
  },
  {
    id: '8',
    width: '5',
    length: '5',
    quantity: 1,
    product: 'Kevlar',
    anchoring: 'X',
    color: 'Black',
    tint: 'None',
    extraTintLayer: false,
    stripping: false,
    thickness: '7mm',
    comments: 'Safety reinforced'
  }
];

const colorOptions = ['Clear', 'Bronze', 'Blue', 'Green', 'Silver', 'Gray', 'Black', 'White'];
const tintOptions = ['None', 'Light', 'Medium', 'Dark'];
const thicknessOptions = ['1/8"', '1/4"', '3/8"', '1/2"', '5/8"', '3/4"', '1"', '4mm', '5mm', '6mm', '7mm'];
const productOptions = ['SW450SR', 'SW600FE', 'SW440RC', 'SW600RC', 'SW600RC+', 'SW600BR', 'Tint Only', 'Kevlar', 'Standard Glass', 'Tempered Glass', 'Laminated Glass', 'Insulated Glass', 'Low-E Glass', 'Safety Glass'];

export const SetupInventoryModal: React.FC<SetupInventoryModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="xl"
      showCloseButton={false}
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-gray-900">Take off sheet</h1>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Product Summary Table */}
        <div className="mb-6">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Product Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pane Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subtotal
                    </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">Total BR</td>
                    <td className="px-6 py-3 text-sm text-gray-900">0.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">1.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 150.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 10.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">Total Riot+</td>
                    <td className="px-6 py-3 text-sm text-gray-900">0.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">1.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 150.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 10.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">Total Riot</td>
                    <td className="px-6 py-3 text-sm text-gray-900">0.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">1.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 150.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 10.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">Total Riot -</td>
                    <td className="px-6 py-3 text-sm text-gray-900">0.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">1.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 150.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 10.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">Total FER</td>
                    <td className="px-6 py-3 text-sm text-gray-900">0.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">1.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 150.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 10.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">Total Smash</td>
                    <td className="px-6 py-3 text-sm text-gray-900">0.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">1.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 150.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 10.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">Total Tint NI</td>
                    <td className="px-6 py-3 text-sm text-gray-900">0.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">1.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 150.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 10.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">Total Tint Incl</td>
                    <td className="px-6 py-3 text-sm text-gray-900">0.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">1.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 150.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 10.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">Total Anchoring</td>
                    <td className="px-6 py-3 text-sm text-gray-900">N/A</td>
                    <td className="px-6 py-3 text-sm text-gray-900">1.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 150.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 10.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">Total Kevlar</td>
                    <td className="px-6 py-3 text-sm text-gray-900">0.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">1.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 150.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 10.00</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3 text-sm text-gray-900">Total Stripping</td>
                    <td className="px-6 py-3 text-sm text-gray-900">0.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">1.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 150.00</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$ 10.00</td>
                  </tr>
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-6 py-3 text-sm text-gray-900">Total</td>
                    <td className="px-6 py-3 text-sm text-gray-900">-</td>
                    <td className="px-6 py-3 text-sm text-gray-900">-</td>
                    <td className="px-6 py-3 text-sm text-gray-900">-</td>
                    <td className="px-6 py-3 text-sm text-gray-900">$100.00</td>
                </tr>
            </tbody>
          </table>
            </div>
          </div>
        </div>

        {/* Main Table Container */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Width
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Length
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Anchoring
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Color
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Tint
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Extra Tint
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Stripping
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockInventoryData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {/* Width */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900">{item.width}</span>
                      </div>
                    </td>

                    {/* Length */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900">{item.length}</span>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900">{item.quantity}</span>
                      </div>
                    </td>

                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900">{item.product}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </td>

                    {/* Anchoring */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900">{item.anchoring}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </td>

                    {/* Color */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900">{item.color}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </td>

                    {/* Tint */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-900">{item.tint}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </td>

                    {/* Extra Tint Layer */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        {item.extraTintLayer ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </td>

                    {/* Stripping */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        {item.stripping ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </td>
                  </tr>
            ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Main Inventory Section */}
        <div className="mb-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Building 1</h2>
          {/* First Inventory Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Width
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Length
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Anchoring
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Color
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Tint
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Extra Tint
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Stripping
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockInventoryData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      {/* Width */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{item.width}</span>
                        </div>
                      </td>

                      {/* Length */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{item.length}</span>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{item.quantity}</span>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{item.product}</span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </td>

                      {/* Anchoring */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{item.anchoring}</span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </td>

                      {/* Color */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{item.color}</span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </td>

                      {/* Tint */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{item.tint}</span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </td>

                      {/* Extra Tint */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          {item.extraTintLayer ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </td>

                      {/* Stripping */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          {item.stripping ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">Building 2</h2>
          {/* Second Inventory Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Width
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Length
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Anchoring
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Color
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Tint
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Extra Tint
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Stripping
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockInventoryData.map((item, index) => (
                    <tr key={`second-${item.id}`} className="hover:bg-gray-50">
                      {/* Width */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{item.width}</span>
                        </div>
                      </td>

                      {/* Length */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{item.length}</span>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{item.quantity}</span>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{item.product}</span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </td>

                      {/* Anchoring */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{item.anchoring}</span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </td>

                      {/* Color */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{item.color}</span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </td>

                      {/* Tint */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900">{item.tint}</span>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </div>
                      </td>

                      {/* Extra Tint */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          {item.extraTintLayer ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </td>

                      {/* Stripping */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          {item.stripping ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-gray-400" />
                          )}
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
    </Modal>
  );
};