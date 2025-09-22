export type TrailerStatus = 'available' | 'unavailable' | 'in-use' | 'maintenance';

export interface TrailerForAssignment {
  id: string;
  trailerName: string;
  registrationNumber: string;
  homeLocation: string;
  currentLocation: string;
  status: TrailerStatus;
  unavailableUntil?: string; // Date string if unavailable
  capacity: number;
  currentLoad: number;
  lastMaintenance: string;
  nextMaintenance: string;
  assignedProject?: string | null;
  inventory: {
    filmSheets: {
      sheetType: string;
      required: number;
      available: number;
    }[];
    tools: {
      toolName: string;
      available: number;
    }[];
  };
}

// Note: MOCK_TRAILERS has been moved to trailerDataUtils.ts
// This file now only contains type definitions for trailer assignment
