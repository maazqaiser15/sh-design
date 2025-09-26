import { Window, WindowStatus, FilmType } from '../types/windowManagement';

// Mock windows data specifically for Role 3 (Execution Team)
// Mixed statuses: some pending, some reinstallation required, some completed
export const ROLE3_MOCK_WINDOWS: Window[] = [
  // PENDING WINDOWS (5 windows)
  {
    id: 'w1',
    windowName: 'Main Office Window 1',
    filmType: 'BR',
    length: 48,
    width: 32,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Pending', installedBy: undefined, installedAt: undefined },
      { layerNumber: 2, layerName: 'Middle Layer', status: 'Pending', installedBy: undefined, installedAt: undefined },
      { layerNumber: 3, layerName: 'Exterior Layer', status: 'Pending', installedBy: undefined, installedAt: undefined }
    ],
    status: 'Pending',
    assignedTeamMembers: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdFromSheet: true,
    sheetId: 'sheet-1',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'Black',
    tint: 'None',
    stripping: false,
    buildingName: 'Main Building'
  },
  {
    id: 'w2',
    windowName: 'Main Office Window 2',
    filmType: 'Riot',
    length: 36,
    width: 24,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Pending', installedBy: undefined, installedAt: undefined },
      { layerNumber: 2, layerName: 'Exterior Layer', status: 'Pending', installedBy: undefined, installedAt: undefined }
    ],
    status: 'Pending',
    assignedTeamMembers: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdFromSheet: true,
    sheetId: 'sheet-2',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'White',
    tint: 'Light',
    stripping: true,
    buildingName: 'Main Building'
  },
  {
    id: 'w3',
    windowName: 'Conference Room Window 1',
    filmType: 'Riot +',
    length: 60,
    width: 40,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Pending', installedBy: undefined, installedAt: undefined },
      { layerNumber: 2, layerName: 'Middle Layer', status: 'Pending', installedBy: undefined, installedAt: undefined },
      { layerNumber: 3, layerName: 'Exterior Layer', status: 'Pending', installedBy: undefined, installedAt: undefined }
    ],
    status: 'Pending',
    assignedTeamMembers: [],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    createdFromSheet: true,
    sheetId: 'sheet-3',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'Black',
    tint: 'Dark',
    stripping: false,
    buildingName: 'Main Building'
  },
  {
    id: 'w4',
    windowName: 'Reception Window 1',
    filmType: 'PER',
    length: 42,
    width: 28,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Pending', installedBy: undefined, installedAt: undefined },
      { layerNumber: 2, layerName: 'Exterior Layer', status: 'Pending', installedBy: undefined, installedAt: undefined }
    ],
    status: 'Pending',
    assignedTeamMembers: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdFromSheet: true,
    sheetId: 'sheet-4',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'White',
    tint: 'None',
    stripping: false,
    buildingName: 'Main Building'
  },
  {
    id: 'w5',
    windowName: 'Break Room Window 1',
    filmType: 'BR',
    length: 30,
    width: 20,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Pending', installedBy: undefined, installedAt: undefined },
      { layerNumber: 2, layerName: 'Exterior Layer', status: 'Pending', installedBy: undefined, installedAt: undefined }
    ],
    status: 'Pending',
    assignedTeamMembers: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdFromSheet: true,
    sheetId: 'sheet-5',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'White',
    tint: 'None',
    stripping: false,
    buildingName: 'Main Building'
  },
  
  // REINSTALLATION NEEDED WINDOWS (5 windows)
  {
    id: 'w6',
    windowName: 'Executive Office Window 1',
    filmType: 'Riot',
    length: 50,
    width: 35,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'John Smith', installedAt: new Date('2024-01-15') },
      { layerNumber: 2, layerName: 'Exterior Layer', status: 'Reinstallation Needed', installedBy: 'John Smith', installedAt: new Date('2024-01-15'), reinstallationMarkedBy: 'Mike Wilson', reinstallationMarkedAt: new Date('2024-01-18'), notes: 'Quality issue detected' }
    ],
    status: 'Reinstallation Needed',
    assignedTeamMembers: ['John Smith', 'Mike Wilson'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-18'),
    createdFromSheet: true,
    sheetId: 'sheet-6',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'Black',
    tint: 'Dark',
    stripping: false,
    buildingName: 'Main Building'
  },
  {
    id: 'w7',
    windowName: 'Executive Office Window 2',
    filmType: 'Riot +',
    length: 45,
    width: 30,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Reinstallation Needed', installedBy: 'Sarah Johnson', installedAt: new Date('2024-01-16'), reinstallationMarkedBy: 'David Brown', reinstallationMarkedAt: new Date('2024-01-19'), notes: 'Film peeling at edges' },
      { layerNumber: 2, layerName: 'Middle Layer', status: 'Installed', installedBy: 'Sarah Johnson', installedAt: new Date('2024-01-16') },
      { layerNumber: 3, layerName: 'Exterior Layer', status: 'Installed', installedBy: 'Sarah Johnson', installedAt: new Date('2024-01-16') }
    ],
    status: 'Reinstallation Needed',
    assignedTeamMembers: ['Sarah Johnson', 'David Brown'],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-19'),
    createdFromSheet: true,
    sheetId: 'sheet-7',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'White',
    tint: 'Light',
    stripping: true,
    buildingName: 'Main Building'
  },
  {
    id: 'w8',
    windowName: 'Conference Room Window 2',
    filmType: 'PER',
    length: 55,
    width: 38,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'Mike Wilson', installedAt: new Date('2024-01-17') },
      { layerNumber: 2, layerName: 'Exterior Layer', status: 'Reinstallation Needed', installedBy: 'Mike Wilson', installedAt: new Date('2024-01-17'), reinstallationMarkedBy: 'Lisa Garcia', reinstallationMarkedAt: new Date('2024-01-20'), notes: 'Bubbles in film' }
    ],
    status: 'Reinstallation Needed',
    assignedTeamMembers: ['Mike Wilson', 'Lisa Garcia'],
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-20'),
    createdFromSheet: true,
    sheetId: 'sheet-8',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'Black',
    tint: 'None',
    stripping: false,
    buildingName: 'Main Building'
  },
  {
    id: 'w9',
    windowName: 'Reception Window 2',
    filmType: 'BR',
    length: 40,
    width: 25,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Reinstallation Needed', installedBy: 'David Brown', installedAt: new Date('2024-01-18'), reinstallationMarkedBy: 'Jennifer White', reinstallationMarkedAt: new Date('2024-01-21'), notes: 'Scratches on film surface' },
      { layerNumber: 2, layerName: 'Exterior Layer', status: 'Installed', installedBy: 'David Brown', installedAt: new Date('2024-01-18') }
    ],
    status: 'Reinstallation Needed',
    assignedTeamMembers: ['David Brown', 'Jennifer White'],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-21'),
    createdFromSheet: true,
    sheetId: 'sheet-9',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'White',
    tint: 'Light',
    stripping: true,
    buildingName: 'Main Building'
  },
  {
    id: 'w10',
    windowName: 'Break Room Window 2',
    filmType: 'Riot',
    length: 35,
    width: 22,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'Lisa Garcia', installedAt: new Date('2024-01-19') },
      { layerNumber: 2, layerName: 'Exterior Layer', status: 'Reinstallation Needed', installedBy: 'Lisa Garcia', installedAt: new Date('2024-01-19'), reinstallationMarkedBy: 'Maria Rodriguez', reinstallationMarkedAt: new Date('2024-01-22'), notes: 'Film not adhering properly' }
    ],
    status: 'Reinstallation Needed',
    assignedTeamMembers: ['Lisa Garcia', 'Maria Rodriguez'],
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-22'),
    createdFromSheet: true,
    sheetId: 'sheet-10',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'Black',
    tint: 'Dark',
    stripping: false,
    buildingName: 'Main Building'
  },
  
  // COMPLETED WINDOWS (5 windows)
  {
    id: 'w11',
    windowName: 'Main Office Window 3',
    filmType: 'Riot +',
    length: 48,
    width: 32,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'John Smith', installedAt: new Date('2024-01-16') },
      { layerNumber: 2, layerName: 'Middle Layer', status: 'Installed', installedBy: 'John Smith', installedAt: new Date('2024-01-16') },
      { layerNumber: 3, layerName: 'Exterior Layer', status: 'Installed', installedBy: 'John Smith', installedAt: new Date('2024-01-16') }
    ],
    status: 'Complete',
    assignedTeamMembers: ['John Smith'],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
    createdFromSheet: true,
    sheetId: 'sheet-11',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'Black',
    tint: 'Dark',
    stripping: false,
    buildingName: 'Main Building'
  },
  {
    id: 'w12',
    windowName: 'Conference Room Window 3',
    filmType: 'PER',
    length: 60,
    width: 40,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'Sarah Johnson', installedAt: new Date('2024-01-17') },
      { layerNumber: 2, layerName: 'Exterior Layer', status: 'Installed', installedBy: 'Sarah Johnson', installedAt: new Date('2024-01-17') }
    ],
    status: 'Complete',
    assignedTeamMembers: ['Sarah Johnson'],
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
    createdFromSheet: true,
    sheetId: 'sheet-12',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'White',
    tint: 'None',
    stripping: false,
    buildingName: 'Main Building'
  },
  {
    id: 'w13',
    windowName: 'Reception Window 3',
    filmType: 'BR',
    length: 42,
    width: 28,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'Mike Wilson', installedAt: new Date('2024-01-18') },
      { layerNumber: 2, layerName: 'Middle Layer', status: 'Installed', installedBy: 'Mike Wilson', installedAt: new Date('2024-01-18') },
      { layerNumber: 3, layerName: 'Exterior Layer', status: 'Installed', installedBy: 'Mike Wilson', installedAt: new Date('2024-01-18') }
    ],
    status: 'Complete',
    assignedTeamMembers: ['Mike Wilson'],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    createdFromSheet: true,
    sheetId: 'sheet-13',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'Black',
    tint: 'Light',
    stripping: false,
    buildingName: 'Main Building'
  },
  {
    id: 'w14',
    windowName: 'Break Room Window 3',
    filmType: 'Riot',
    length: 30,
    width: 20,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'David Brown', installedAt: new Date('2024-01-19') },
      { layerNumber: 2, layerName: 'Exterior Layer', status: 'Installed', installedBy: 'David Brown', installedAt: new Date('2024-01-19') }
    ],
    status: 'Complete',
    assignedTeamMembers: ['David Brown'],
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
    createdFromSheet: true,
    sheetId: 'sheet-14',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'White',
    tint: 'Dark',
    stripping: true,
    buildingName: 'Main Building'
  },
  {
    id: 'w15',
    windowName: 'Executive Office Window 3',
    filmType: 'Riot +',
    length: 50,
    width: 35,
    layers: [
      { layerNumber: 1, layerName: 'Interior Layer', status: 'Installed', installedBy: 'Lisa Garcia', installedAt: new Date('2024-01-20') },
      { layerNumber: 2, layerName: 'Middle Layer', status: 'Installed', installedBy: 'Lisa Garcia', installedAt: new Date('2024-01-20') },
      { layerNumber: 3, layerName: 'Exterior Layer', status: 'Installed', installedBy: 'Lisa Garcia', installedAt: new Date('2024-01-20') }
    ],
    status: 'Complete',
    assignedTeamMembers: ['Lisa Garcia'],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    createdFromSheet: true,
    sheetId: 'sheet-15',
    interiorCount: 1,
    exteriorCount: 1,
    color: 'Black',
    tint: 'None',
    stripping: false,
    buildingName: 'Main Building'
  }
];