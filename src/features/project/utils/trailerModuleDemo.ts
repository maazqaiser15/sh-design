import { getAvailableTrailersForAssignment, convertTrailerToAssignment } from './trailerDataUtils';
import { getTrailerModuleData } from './trailerDataUtils';

/**
 * Demo function to show how trailer module data is integrated with project assignment
 */
export const demonstrateTrailerModuleIntegration = () => {
  console.log('=== Trailer Module Integration Demo ===');
  
  // Get original trailer module data
  const trailerModuleData = getTrailerModuleData();
  console.log('Original Trailer Module Data:', trailerModuleData.length, 'trailers');
  
  // Show first trailer from module
  const firstTrailer = trailerModuleData[0];
  console.log('First Trailer from Module:', {
    id: firstTrailer.id,
    trailerName: firstTrailer.trailerName,
    registrationNumber: firstTrailer.registrationNumber,
    location: firstTrailer.location,
    status: firstTrailer.status,
    inventoryCount: {
      tools: firstTrailer.inventory.tools.length,
      filmSheets: firstTrailer.inventory.filmSheets.length
    }
  });
  
  // Convert to assignment format
  const convertedTrailers = getAvailableTrailersForAssignment();
  console.log('Converted for Project Assignment:', convertedTrailers.length, 'trailers');
  
  // Show first converted trailer
  const firstConverted = convertedTrailers[0];
  console.log('First Converted Trailer:', {
    id: firstConverted.id,
    trailerName: firstConverted.trailerName,
    registrationNumber: firstConverted.registrationNumber,
    homeLocation: firstConverted.homeLocation,
    currentLocation: firstConverted.currentLocation,
    status: firstConverted.status,
    inventoryCount: {
      tools: firstConverted.inventory.tools.length,
      filmSheets: firstConverted.inventory.filmSheets.length
    }
  });
  
  console.log('=== Integration Complete ===');
  return {
    originalCount: trailerModuleData.length,
    convertedCount: convertedTrailers.length,
    sampleOriginal: firstTrailer,
    sampleConverted: firstConverted
  };
};
