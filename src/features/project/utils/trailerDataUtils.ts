import { Trailer } from '../../../types';
import { TrailerForAssignment, TrailerStatus } from '../types/trailers';
import { EXPANDED_TRAILER_DATA } from '../../../pages/Trailers/expandedTrailerData';

/**
 * Convert Trailer from trailer module to TrailerForAssignment for project assignment
 */
export const convertTrailerToAssignment = (trailer: Trailer): TrailerForAssignment => {
  // Map trailer status to assignment status
  const mapStatus = (status: string): TrailerStatus => {
    switch (status) {
      case 'available':
        return 'available';
      case 'low':
        return 'low_stock';
      case 'unavailable':
        return 'unavailable';
      default:
        return 'available';
    }
  };

  return {
    id: trailer.id,
    trailerName: trailer.trailerName,
    registrationNumber: trailer.registrationNumber,
    homeLocation: `${trailer.city}, ${trailer.state}`,
    currentLocation: `${trailer.city}, ${trailer.state}`,
    status: mapStatus(trailer.status),
    unavailableUntil: trailer.status === 'unavailable' 
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Mock 7 days from now
      : undefined,
    capacity: 1000, // Default capacity
    currentLoad: 0, // Default current load
    lastMaintenance: trailer.updatedAt,
    nextMaintenance: new Date(new Date(trailer.updatedAt).getTime() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 6 months from last update
    assignedProject: null, // Will be set when assigned
    inventory: {
      filmSheets: trailer.inventory.filmSheets.map(sheet => ({
        sheetType: sheet.sheetType,
        required: sheet.threshold,
        available: sheet.currentStock
      })),
      tools: trailer.inventory.tools.map(tool => ({
        toolName: tool.toolName,
        available: tool.currentStock
      }))
    }
  };
};

/**
 * Get trailer data from the trailer module
 * This uses the actual trailer data from the trailer module
 */
export const getTrailerModuleData = (): Trailer[] => {
  return EXPANDED_TRAILER_DATA;
};

/**
 * Get available trailers for project assignment from trailer module
 */
export const getAvailableTrailersForAssignment = (): TrailerForAssignment[] => {
  const trailerModuleData = getTrailerModuleData();
  return trailerModuleData.map(convertTrailerToAssignment);
};