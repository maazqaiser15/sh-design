import { Trailer, ToolInventoryItem, FilmSheetInventoryItem, FilmType, FilmSheetType, TrailerStatus, FilmStockStatus, ActivityLog } from '../../../types';

/**
 * Fixed film types for trailer inventory (legacy)
 */
export const FILM_TYPES: FilmType[] = [
  'Protective Film A',
  'Protective Film B',
  'Adhesive Film X',
  'Adhesive Film Y',
  'Transparent Film',
  'Matte Film',
  'Specialty Film 1',
  'Specialty Film 2',
];

/**
 * Tools inventory with default thresholds
 */
export const TOOL_INVENTORY: Array<{ name: string; defaultThreshold: number }> = [
  { name: 'CART', defaultThreshold: 6 },
  { name: 'BEER TANK W/ HOSE', defaultThreshold: 6 },
  { name: 'HARD PRESS', defaultThreshold: 6 },
  { name: 'RED CARD', defaultThreshold: 6 },
  { name: 'OLFA', defaultThreshold: 6 },
  { name: 'OLFA BLADE PACK', defaultThreshold: 6 },
  { name: 'SCRAPERS', defaultThreshold: 6 },
  { name: 'SCRAPER BLADE PACK', defaultThreshold: 6 },
  { name: 'PICK KIT', defaultThreshold: 6 },
  { name: '1 QRT ACETONE', defaultThreshold: 6 },
  { name: 'PHILLIPS HEAD SD', defaultThreshold: 6 },
  { name: 'FLAT HEAD SD', defaultThreshold: 6 },
  { name: 'WINDOW SQUEEGEE', defaultThreshold: 6 },
  { name: 'CORDLESS DRILL', defaultThreshold: 1 },
  { name: 'DRILL BIT KIT', defaultThreshold: 1 },
  { name: 'GENERATOR W/ CORD', defaultThreshold: 1 },
  { name: 'CAULK SAUSAGE CASE', defaultThreshold: 2 },
  { name: '9 PK BLUE TAPE', defaultThreshold: 1 },
  { name: 'MICRO FIBER PACKAGE', defaultThreshold: 2 },
  { name: '5 GAL GAS CAN', defaultThreshold: 1 },
  { name: '12 GAL WATER', defaultThreshold: 1 },
  { name: 'AIR COMP W/ HOSE', defaultThreshold: 1 },
  { name: 'TRASH CAN', defaultThreshold: 1 },
  { name: '55 GAL TRASH BAGS CASE', defaultThreshold: 1 },
  { name: 'BATH TOWEL', defaultThreshold: 8 },
  { name: '5 GAL BUCKETS', defaultThreshold: 20 },
  { name: 'SHARPIE PACK', defaultThreshold: 1 },
  { name: 'DRY ERASE MARKER PACK', defaultThreshold: 1 },
  { name: 'CAULK GUN (Sausage)', defaultThreshold: 2 },
  { name: 'PACK NITRILE GLOVES', defaultThreshold: 1 },
  { name: 'CASE OF BLUE TOWELS', defaultThreshold: 1 },
  { name: 'TRIANGLE SQUARE', defaultThreshold: 1 },
  { name: 'NON SERATED SCISSORS', defaultThreshold: 1 },
  { name: 'TUB O\' TOWELS', defaultThreshold: 1 },
  { name: 'LADDERS', defaultThreshold: 4 },
  { name: 'TANK FIX KITS', defaultThreshold: 2 },
  { name: 'EXTRAS SPRAY NOZZLES', defaultThreshold: 2 },
];

/**
 * Film sheet types
 */
export const FILM_SHEET_TYPES: FilmSheetType[] = [
  'BR',
  'Riot+',
  'Riot',
  'Riot -',
  'FER',
  'Smash',
  'Tint NI',
  'Tint Incl',
  'Anchoring',
  'Kevlar',
  'Stripping',
];

/**
 * Common locations for trailers
 */
// USA States data
export const USA_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
  'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

// USA Cities data (major cities for each state)
export const USA_CITIES: Record<string, string[]> = {
  'Alabama': ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville', 'Tuscaloosa'],
  'Alaska': ['Anchorage', 'Fairbanks', 'Juneau', 'Sitka', 'Ketchikan'],
  'Arizona': ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale'],
  'Arkansas': ['Little Rock', 'Fort Smith', 'Fayetteville', 'Springdale', 'Jonesboro'],
  'California': ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Long Beach', 'Oakland'],
  'Colorado': ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Lakewood'],
  'Connecticut': ['Bridgeport', 'New Haven', 'Hartford', 'Stamford', 'Waterbury'],
  'Delaware': ['Wilmington', 'Dover', 'Newark', 'Middletown', 'Smyrna'],
  'Florida': ['Jacksonville', 'Miami', 'Tampa', 'Orlando', 'St. Petersburg', 'Hialeah', 'Tallahassee', 'Fort Lauderdale'],
  'Georgia': ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens'],
  'Hawaii': ['Honolulu', 'Pearl City', 'Hilo', 'Kailua', 'Kaneohe'],
  'Idaho': ['Boise', 'Nampa', 'Meridian', 'Idaho Falls', 'Pocatello'],
  'Illinois': ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville', 'Springfield', 'Peoria', 'Elgin'],
  'Indiana': ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend', 'Carmel'],
  'Iowa': ['Des Moines', 'Cedar Rapids', 'Davenport', 'Sioux City', 'Iowa City'],
  'Kansas': ['Wichita', 'Overland Park', 'Kansas City', 'Topeka', 'Olathe'],
  'Kentucky': ['Louisville', 'Lexington', 'Bowling Green', 'Owensboro', 'Covington'],
  'Louisiana': ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette', 'Lake Charles'],
  'Maine': ['Portland', 'Lewiston', 'Bangor', 'South Portland', 'Auburn'],
  'Maryland': ['Baltimore', 'Frederick', 'Rockville', 'Gaithersburg', 'Bowie'],
  'Massachusetts': ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell'],
  'Michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Lansing'],
  'Minnesota': ['Minneapolis', 'Saint Paul', 'Rochester', 'Duluth', 'Bloomington'],
  'Mississippi': ['Jackson', 'Gulfport', 'Southaven', 'Hattiesburg', 'Biloxi'],
  'Missouri': ['Kansas City', 'Saint Louis', 'Springfield', 'Independence', 'Columbia'],
  'Montana': ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Butte'],
  'Nebraska': ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island', 'Kearney'],
  'Nevada': ['Las Vegas', 'Henderson', 'Reno', 'North Las Vegas', 'Sparks'],
  'New Hampshire': ['Manchester', 'Nashua', 'Concord', 'Derry', 'Rochester'],
  'New Jersey': ['Newark', 'Jersey City', 'Paterson', 'Elizabeth', 'Edison'],
  'New Mexico': ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe', 'Roswell'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany', 'New Rochelle', 'Mount Vernon'],
  'North Carolina': ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'],
  'North Dakota': ['Fargo', 'Bismarck', 'Grand Forks', 'Minot', 'West Fargo'],
  'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron', 'Dayton', 'Parma', 'Canton'],
  'Oklahoma': ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow', 'Lawton'],
  'Oregon': ['Portland', 'Salem', 'Eugene', 'Gresham', 'Hillsboro'],
  'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading'],
  'Rhode Island': ['Providence', 'Warwick', 'Cranston', 'Pawtucket', 'East Providence'],
  'South Carolina': ['Columbia', 'Charleston', 'North Charleston', 'Mount Pleasant', 'Rock Hill'],
  'South Dakota': ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Brookings', 'Watertown'],
  'Tennessee': ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga', 'Clarksville'],
  'Texas': ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi'],
  'Utah': ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan', 'Orem'],
  'Vermont': ['Burlington', 'Essex', 'South Burlington', 'Colchester', 'Rutland'],
  'Virginia': ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Newport News'],
  'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'],
  'West Virginia': ['Charleston', 'Huntington', 'Parkersburg', 'Morgantown', 'Wheeling'],
  'Wisconsin': ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha', 'Racine'],
  'Wyoming': ['Cheyenne', 'Casper', 'Laramie', 'Gillette', 'Rock Springs']
};

/**
 * Calculate the status of individual film stock based on current stock and threshold
 */
export const calculateFilmStockStatus = (currentStock: number, threshold: number): FilmStockStatus => {
  if (currentStock === 0) return 'critical';
  if (currentStock <= threshold) return 'low';
  return 'good';
};

/**
 * Calculate the overall trailer status based on all inventory items
 */
export const calculateTrailerStatus = (inventory: { tools: ToolInventoryItem[]; filmSheets: FilmSheetInventoryItem[] }): TrailerStatus => {
  const allItems = [...inventory.tools, ...inventory.filmSheets];
  
  if (allItems.some(item => item.currentStock === 0)) {
    return 'unavailable';
  }
  
  if (allItems.some(item => item.currentStock <= item.threshold)) {
    return 'low';
  }
  
  return 'available';
};

/**
 * Create initial tools inventory for a new trailer
 */
export const createInitialToolsInventory = (thresholds: Record<string, number>): ToolInventoryItem[] => {
  return TOOL_INVENTORY.map(tool => ({
    toolName: tool.name,
    currentStock: 0,
    threshold: thresholds[tool.name] || tool.defaultThreshold,
    status: 'critical' as FilmStockStatus,
  }));
};

/**
 * Create initial film sheets inventory for a new trailer
 */
export const createInitialFilmSheetsInventory = (thresholds: Record<FilmSheetType, number>): FilmSheetInventoryItem[] => {
  return FILM_SHEET_TYPES.map(sheetType => ({
    sheetType,
    currentStock: 0,
    threshold: thresholds[sheetType] || 10,
    status: 'critical' as FilmStockStatus,
  }));
};

/**
 * Create initial inventory for a new trailer
 */
export const createInitialInventory = (toolThresholds: Record<string, number>, filmSheetThresholds: Record<FilmSheetType, number>) => {
  return {
    tools: createInitialToolsInventory(toolThresholds),
    filmSheets: createInitialFilmSheetsInventory(filmSheetThresholds),
  };
};

/**
 * Update inventory and recalculate statuses
 */
export const updateInventoryStatus = (inventory: { tools: ToolInventoryItem[]; filmSheets: FilmSheetInventoryItem[] }) => {
  return {
    tools: inventory.tools.map(item => ({
      ...item,
      status: calculateFilmStockStatus(item.currentStock, item.threshold),
    })),
    filmSheets: inventory.filmSheets.map(item => ({
      ...item,
      status: calculateFilmStockStatus(item.currentStock, item.threshold),
    })),
  };
};

/**
 * Generate activity log entry
 */
export const createActivityLog = (
  type: ActivityLog['type'],
  description: string,
  user?: string,
  systemGenerated: boolean = false
): ActivityLog => ({
  id: crypto.randomUUID(),
  timestamp: new Date().toISOString(),
  type,
  description,
  user,
  systemGenerated,
});

/**
 * Format trailer name for display
 */
export const formatTrailerName = (trailerName: string): string => {
  return trailerName.trim();
};

/**
 * Validate trailer form data
 */
export interface TrailerFormData {
  trailerName: string;
  registrationNumber: string;
  parkingAddress: string;
  state: string;
  city: string;
  toolThresholds: Record<string, number>;
  filmSheetThresholds: Record<FilmSheetType, number>;
}

export const validateTrailerForm = (data: TrailerFormData): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.trailerName.trim()) {
    errors.trailerName = 'Trailer name is required';
  }

  if (!data.registrationNumber.trim()) {
    errors.registrationNumber = 'Registration number is required';
  }

  if (!data.parkingAddress.trim()) {
    errors.parkingAddress = 'Parking address is required';
  }

  if (!data.state.trim()) {
    errors.state = 'State is required';
  }

  if (!data.city.trim()) {
    errors.city = 'City is required';
  }

  // Validate tool thresholds
  TOOL_INVENTORY.forEach(tool => {
    const threshold = data.toolThresholds[tool.name];
    if (threshold !== undefined && threshold < 0) {
      errors[`tool_${tool.name}`] = 'Threshold cannot be negative';
    }
  });

  // Validate film sheet thresholds
  FILM_SHEET_TYPES.forEach(sheetType => {
    const threshold = data.filmSheetThresholds[sheetType];
    if (threshold !== undefined && threshold < 0) {
      errors[`sheet_${sheetType}`] = 'Threshold cannot be negative';
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Get status color classes for UI consistency
 */
export const getStatusColorClasses = (status: TrailerStatus | FilmStockStatus) => {
  const colorMap = {
    available: 'bg-green-100 text-green-800',
    low: 'bg-amber-100 text-amber-800',
    unavailable: 'bg-red-100 text-red-800',
    good: 'bg-green-100 text-green-800',
    critical: 'bg-red-100 text-red-800',
  };

  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Filter trailers by status, location, or search term
 */
export const filterTrailers = (
  trailers: Trailer[],
  filters: {
    status?: TrailerStatus;
    state?: string;
    city?: string;
    search?: string;
  }
): Trailer[] => {
  return trailers.filter(trailer => {
    if (filters.status && trailer.status !== filters.status) {
      return false;
    }

    if (filters.state && trailer.state !== filters.state) {
      return false;
    }

    if (filters.city && trailer.city !== filters.city) {
      return false;
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        trailer.trailerName.toLowerCase().includes(searchTerm) ||
        trailer.registrationNumber.toLowerCase().includes(searchTerm) ||
        trailer.parkingAddress.toLowerCase().includes(searchTerm) ||
        trailer.state.toLowerCase().includes(searchTerm) ||
        trailer.city.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });
};

/**
 * Sort trailers by different criteria
 */
export const sortTrailers = (
  trailers: Trailer[],
  sortBy: 'trailerName' | 'registrationNumber' | 'location' | 'status' | 'updatedAt',
  order: 'asc' | 'desc' = 'asc'
): Trailer[] => {
  return [...trailers].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    // Handle location sorting by combining city, state, and parking address
    if (sortBy === 'location') {
      aValue = `${a.city}, ${a.state} ${a.parkingAddress}`.toLowerCase();
      bValue = `${b.city}, ${b.state} ${b.parkingAddress}`.toLowerCase();
    } else {
      aValue = a[sortBy];
      bValue = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};
