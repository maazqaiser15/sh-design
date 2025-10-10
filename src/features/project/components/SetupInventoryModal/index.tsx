import React from 'react';
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
    width: '2',
    length: '2',
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
    width: '2',
    length: '3',
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
    width: '3',
    length: '4',
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
    width: '4',
    length: '4',
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
    width: '4',
    length: '5',
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
    width: '3',
    length: '2',
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
    width: '2',
    length: '6',
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
    width: '5',
    length: '5',
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
      title="Take Off Sheet"
      size="xl"
    >
      <div className="space-y-6">

        {/* Table Container */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Width
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Length
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Interior Layer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Exterior Layer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Color
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Tint
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Extra Tint
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Stripping
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Thickness
                  </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {mockInventoryData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                    {/* Width */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">{item.width}</span>
                    </td>

                    {/* Length */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">{item.length}</span>
                    </td>

                    {/* Quantity */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">{item.quantity}</span>
                    </td>

                    {/* Product */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">{item.product}</span>
                    </td>

                    {/* Interior Layer */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">{item.interiorLayer}</span>
                    </td>

                    {/* Exterior Layer */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">{item.exteriorLayer}</span>
                    </td>

                    {/* Color */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">{item.color}</span>
                    </td>

                    {/* Tint */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">{item.tint}</span>
                    </td>

                    {/* Extra Tint Layer */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">
                        {item.extraTintLayer ? 'Yes' : 'No'}
                      </span>
                    </td>

                    {/* Stripping */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">
                        {item.stripping ? 'Yes' : 'No'}
                      </span>
                    </td>

                    {/* Thickness */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-900">{item.thickness}</span>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};