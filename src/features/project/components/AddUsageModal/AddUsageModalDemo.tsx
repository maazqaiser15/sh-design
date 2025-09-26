import React, { useState } from 'react';
import { Button } from '../../../../common/components/Button';
import { AddUsageModal, InventoryItem } from './index';

export const AddUsageModalDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (inventoryData: InventoryItem[]) => {
    console.log('Inventory Data:', inventoryData);
    alert(`Submitted ${inventoryData.length} inventory items`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add Usage Modal Demo</h1>
      <p className="text-gray-600 mb-6">
        Click the button below to open the Add Usage modal and test the inventory tracking functionality.
      </p>
      
      <Button
        variant="primary"
        onClick={() => setIsOpen(true)}
      >
        Open Add Usage Modal
      </Button>

      <AddUsageModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};
