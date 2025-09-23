import { Trailer } from '../../../types';
import { TrailerForAssignment, TrailerStatus } from '../types/trailers';

/**
 * Convert Trailer from trailer module to TrailerForAssignment for project assignment
 */
export const convertTrailerToAssignment = (trailer: Trailer): TrailerForAssignment => {
  return {
    id: trailer.id,
    trailerName: trailer.trailerName,
    registrationNumber: trailer.registrationNumber,
    homeLocation: trailer.location,
    currentLocation: trailer.location, // Using location as current location for now
    status: trailer.status as TrailerStatus,
    unavailableUntil: trailer.status === 'unavailable' || trailer.status === 'in-use' || trailer.status === 'maintenance' 
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
 * Get mock trailer data from the trailer module
 * This simulates getting data from the trailer module's data source
 */
export const getTrailerModuleData = (): Trailer[] => {
  // This is the same mock data from the trailer module
  return [
    {
      id: "1",
      trailerName: "Alpha Trailer",
      registrationNumber: "REG-001-2024",
      location: "Warehouse A",
      inventory: {
        tools: [
          { toolName: "CART", currentStock: 6, threshold: 6, status: "good" },
          { toolName: "BEER TANK W/ HOSE", currentStock: 4, threshold: 6, status: "low" },
          { toolName: "HARD PRESS", currentStock: 0, threshold: 6, status: "critical" },
          { toolName: "RED CARD", currentStock: 8, threshold: 6, status: "good" },
          { toolName: "OLFA", currentStock: 5, threshold: 6, status: "low" },
          { toolName: "OLFA BLADE PACK", currentStock: 3, threshold: 6, status: "low" },
          { toolName: "SCRAPERS", currentStock: 7, threshold: 6, status: "good" },
          { toolName: "SCRAPER BLADE PACK", currentStock: 2, threshold: 6, status: "low" },
          { toolName: "PICK KIT", currentStock: 4, threshold: 6, status: "low" },
          { toolName: "1 QRT ACETONE", currentStock: 8, threshold: 6, status: "good" },
          { toolName: "PHILLIPS HEAD SD", currentStock: 6, threshold: 6, status: "good" },
          { toolName: "FLAT HEAD SD", currentStock: 5, threshold: 6, status: "low" },
          { toolName: "WINDOW SQUEEGEE", currentStock: 3, threshold: 6, status: "low" },
          { toolName: "CORDLESS DRILL", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "DRILL BIT KIT", currentStock: 0, threshold: 1, status: "critical" },
          { toolName: "GENERATOR W/ CORD", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "CAULK SAUSAGE CASE", currentStock: 3, threshold: 2, status: "good" },
          { toolName: "9 PK BLUE TAPE", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "MICRO FIBER PACKAGE", currentStock: 3, threshold: 2, status: "good" },
          { toolName: "5 GAL GAS CAN", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "12 GAL WATER", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "AIR COMP W/ HOSE", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "TRASH CAN", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "55 GAL TRASH BAGS CASE", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "BATH TOWEL", currentStock: 10, threshold: 8, status: "good" },
          { toolName: "5 GAL BUCKETS", currentStock: 25, threshold: 20, status: "good" },
          { toolName: "SHARPIE PACK", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "DRY ERASE MARKER PACK", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "CAULK GUN (Sausage)", currentStock: 3, threshold: 2, status: "good" },
          { toolName: "PACK NITRILE GLOVES", currentStock: 1, threshold: 1, status: "good" },
        ],
        filmSheets: [
          { sheetType: "BR", currentStock: 25, threshold: 20, status: "good" },
          { sheetType: "Riot+", currentStock: 15, threshold: 20, status: "low" },
          { sheetType: "Riot", currentStock: 0, threshold: 15, status: "critical" },
          { sheetType: "Riot -", currentStock: 12, threshold: 10, status: "good" },
          { sheetType: "FER", currentStock: 8, threshold: 10, status: "low" },
          { sheetType: "Smash", currentStock: 5, threshold: 10, status: "low" },
          { sheetType: "Tint NI", currentStock: 3, threshold: 10, status: "low" },
          { sheetType: "Tint Incl", currentStock: 7, threshold: 10, status: "low" },
          { sheetType: "Anchoring", currentStock: 2, threshold: 10, status: "low" },
          { sheetType: "Kevlar", currentStock: 1, threshold: 10, status: "low" },
          { sheetType: "Stripping", currentStock: 4, threshold: 10, status: "low" },
        ],
      },
      status: "unavailable",
      activityLogs: [
        {
          id: "1",
          timestamp: "2024-01-15T10:30:00Z",
          type: "created",
          description: "Trailer TRL001 created",
          systemGenerated: true,
        },
        {
          id: "2",
          timestamp: "2024-01-16T14:20:00Z",
          type: "inventory_updated",
          description: "Inventory levels updated",
          user: "John Doe",
          systemGenerated: false,
        },
      ],
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-16T14:20:00Z",
    },
    {
      id: "2",
      trailerName: "Beta Trailer",
      registrationNumber: "REG-002-2024",
      location: "Field Site 1",
      inventory: {
        tools: [
          { toolName: "CART", currentStock: 8, threshold: 6, status: "good" },
          { toolName: "BEER TANK W/ HOSE", currentStock: 7, threshold: 6, status: "good" },
          { toolName: "HARD PRESS", currentStock: 6, threshold: 6, status: "good" },
          { toolName: "RED CARD", currentStock: 10, threshold: 6, status: "good" },
          { toolName: "OLFA", currentStock: 8, threshold: 6, status: "good" },
          { toolName: "OLFA BLADE PACK", currentStock: 7, threshold: 6, status: "good" },
          { toolName: "SCRAPERS", currentStock: 9, threshold: 6, status: "good" },
          { toolName: "SCRAPER BLADE PACK", currentStock: 6, threshold: 6, status: "good" },
          { toolName: "PICK KIT", currentStock: 8, threshold: 6, status: "good" },
          { toolName: "1 QRT ACETONE", currentStock: 10, threshold: 6, status: "good" },
          { toolName: "PHILLIPS HEAD SD", currentStock: 8, threshold: 6, status: "good" },
          { toolName: "FLAT HEAD SD", currentStock: 7, threshold: 6, status: "good" },
          { toolName: "WINDOW SQUEEGEE", currentStock: 6, threshold: 6, status: "good" },
          { toolName: "CORDLESS DRILL", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "DRILL BIT KIT", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "GENERATOR W/ CORD", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "CAULK SAUSAGE CASE", currentStock: 3, threshold: 2, status: "good" },
          { toolName: "9 PK BLUE TAPE", currentStock: 2, threshold: 1, status: "good" },
          { toolName: "MICRO FIBER PACKAGE", currentStock: 4, threshold: 2, status: "good" },
          { toolName: "5 GAL GAS CAN", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "12 GAL WATER", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "AIR COMP W/ HOSE", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "TRASH CAN", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "55 GAL TRASH BAGS CASE", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "BATH TOWEL", currentStock: 12, threshold: 8, status: "good" },
          { toolName: "5 GAL BUCKETS", currentStock: 30, threshold: 20, status: "good" },
          { toolName: "SHARPIE PACK", currentStock: 2, threshold: 1, status: "good" },
          { toolName: "DRY ERASE MARKER PACK", currentStock: 2, threshold: 1, status: "good" },
          { toolName: "CAULK GUN (Sausage)", currentStock: 4, threshold: 2, status: "good" },
          { toolName: "PACK NITRILE GLOVES", currentStock: 2, threshold: 1, status: "good" },
        ],
        filmSheets: [
          { sheetType: "BR", currentStock: 35, threshold: 20, status: "good" },
          { sheetType: "Riot+", currentStock: 28, threshold: 20, status: "good" },
          { sheetType: "Riot", currentStock: 18, threshold: 15, status: "good" },
          { sheetType: "Riot -", currentStock: 15, threshold: 10, status: "good" },
          { sheetType: "FER", currentStock: 12, threshold: 10, status: "good" },
          { sheetType: "Smash", currentStock: 15, threshold: 10, status: "good" },
          { sheetType: "Tint NI", currentStock: 12, threshold: 10, status: "good" },
          { sheetType: "Tint Incl", currentStock: 10, threshold: 10, status: "good" },
          { sheetType: "Anchoring", currentStock: 8, threshold: 10, status: "low" },
          { sheetType: "Kevlar", currentStock: 6, threshold: 10, status: "low" },
          { sheetType: "Stripping", currentStock: 9, threshold: 10, status: "low" },
        ],
      },
      status: "available",
      activityLogs: [
        {
          id: "3",
          timestamp: "2024-01-14T09:15:00Z",
          type: "created",
          description: "Trailer TRL002 created",
          systemGenerated: true,
        },
      ],
      createdAt: "2024-01-14T09:15:00Z",
      updatedAt: "2024-01-14T09:15:00Z",
    },
    {
      id: "3",
      trailerName: "Gamma Trailer",
      registrationNumber: "REG-003-2024",
      location: "Maintenance Bay",
      inventory: {
        tools: [
          { toolName: "CART", currentStock: 6, threshold: 6, status: "good" },
          { toolName: "BEER TANK W/ HOSE", currentStock: 6, threshold: 6, status: "good" },
          { toolName: "HARD PRESS", currentStock: 5, threshold: 6, status: "low" },
          { toolName: "RED CARD", currentStock: 4, threshold: 6, status: "low" },
          { toolName: "OLFA", currentStock: 3, threshold: 6, status: "low" },
          { toolName: "OLFA BLADE PACK", currentStock: 2, threshold: 6, status: "low" },
          { toolName: "SCRAPERS", currentStock: 4, threshold: 6, status: "low" },
          { toolName: "SCRAPER BLADE PACK", currentStock: 1, threshold: 6, status: "low" },
          { toolName: "PICK KIT", currentStock: 3, threshold: 6, status: "low" },
          { toolName: "1 QRT ACETONE", currentStock: 5, threshold: 6, status: "low" },
          { toolName: "PHILLIPS HEAD SD", currentStock: 4, threshold: 6, status: "low" },
          { toolName: "FLAT HEAD SD", currentStock: 3, threshold: 6, status: "low" },
          { toolName: "WINDOW SQUEEGEE", currentStock: 2, threshold: 6, status: "low" },
          { toolName: "CORDLESS DRILL", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "DRILL BIT KIT", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "GENERATOR W/ CORD", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "CAULK SAUSAGE CASE", currentStock: 2, threshold: 2, status: "good" },
          { toolName: "9 PK BLUE TAPE", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "MICRO FIBER PACKAGE", currentStock: 2, threshold: 2, status: "good" },
          { toolName: "5 GAL GAS CAN", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "12 GAL WATER", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "AIR COMP W/ HOSE", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "TRASH CAN", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "55 GAL TRASH BAGS CASE", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "BATH TOWEL", currentStock: 6, threshold: 8, status: "low" },
          { toolName: "5 GAL BUCKETS", currentStock: 15, threshold: 20, status: "low" },
          { toolName: "SHARPIE PACK", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "DRY ERASE MARKER PACK", currentStock: 1, threshold: 1, status: "good" },
          { toolName: "CAULK GUN (Sausage)", currentStock: 2, threshold: 2, status: "good" },
          { toolName: "PACK NITRILE GLOVES", currentStock: 1, threshold: 1, status: "good" },
        ],
        filmSheets: [
          { sheetType: "BR", currentStock: 20, threshold: 20, status: "good" },
          { sheetType: "Riot+", currentStock: 20, threshold: 20, status: "good" },
          { sheetType: "Riot", currentStock: 15, threshold: 15, status: "good" },
          { sheetType: "Riot -", currentStock: 8, threshold: 10, status: "low" },
          { sheetType: "FER", currentStock: 5, threshold: 10, status: "low" },
          { sheetType: "Smash", currentStock: 6, threshold: 10, status: "low" },
          { sheetType: "Tint NI", currentStock: 4, threshold: 10, status: "low" },
          { sheetType: "Tint Incl", currentStock: 5, threshold: 10, status: "low" },
          { sheetType: "Anchoring", currentStock: 3, threshold: 10, status: "low" },
          { sheetType: "Kevlar", currentStock: 2, threshold: 10, status: "low" },
          { sheetType: "Stripping", currentStock: 4, threshold: 10, status: "low" },
        ],
      },
      status: "low",
      activityLogs: [
        {
          id: "4",
          timestamp: "2024-01-13T16:45:00Z",
          type: "created",
          description: "Trailer TRL003 created",
          systemGenerated: true,
        },
      ],
      createdAt: "2024-01-13T16:45:00Z",
      updatedAt: "2024-01-13T16:45:00Z",
    },
  ];
};

/**
 * Get available trailers for project assignment from trailer module
 */
export const getAvailableTrailersForAssignment = (): TrailerForAssignment[] => {
  const trailerModuleData = getTrailerModuleData();
  return trailerModuleData.map(convertTrailerToAssignment);
};
