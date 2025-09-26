import React, { useState } from 'react';
import { TravelAccommodationDetailsCard, TravelAccommodationData } from './index';
import { TravelAccommodationModal } from '../TravelAccommodationModal';

export const TravelAccommodationDetailsCardDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [travelAccommodationData, setTravelAccommodationData] = useState<TravelAccommodationData | undefined>(undefined);

  const handleAddDetails = () => {
    setShowModal(true);
  };

  const handleEditDetails = () => {
    setShowModal(true);
  };

  const handleModalSubmit = (data: TravelAccommodationData) => {
    setTravelAccommodationData(data);
    setShowModal(false);
  };

  const handleMarkComplete = () => {
    console.log('Marked as complete');
  };

  const handleExpand = () => {
    console.log('Expand details');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Travel & Accommodation Details Card Demo</h1>
        
        <TravelAccommodationDetailsCard
          travelAccommodationData={travelAccommodationData}
          onAddDetails={handleAddDetails}
          onEditDetails={handleEditDetails}
          onMarkComplete={handleMarkComplete}
          onExpand={handleExpand}
        />

        <TravelAccommodationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      </div>
    </div>
  );
};
