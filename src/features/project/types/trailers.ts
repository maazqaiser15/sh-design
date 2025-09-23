export type TrailerStatus = 'available' | 'unavailable' | 'low_stock';

export interface TrailerForAssignment {
  id: string;
  name: string;
  registrationNumber: string;
  currentLocation: string;
  status: TrailerStatus;
  unavailableUntil?: string; // Date string if unavailable
  inventory: {
    tools: {
      name: string;
      currentStock: number;
      threshold: number;
      status: 'good' | 'low' | 'critical';
    }[];
    filmSheets: {
      sheetType: string;
      currentStock: number;
      threshold: number;
      status: 'good' | 'low' | 'critical';
    }[];
  };
}

// Note: MOCK_TRAILERS has been moved to trailerDataUtils.ts
// This file now only contains type definitions for trailer assignment
