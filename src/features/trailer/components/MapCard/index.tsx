import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Truck, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card } from '../../../../common/components/Card';
import { Trailer, TrailerStatus } from '../../../../types';

interface MapCardProps {
  trailers: Trailer[];
  onTrailerClick?: (trailer: Trailer) => void;
  className?: string;
}

interface TrailerLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  status: TrailerStatus;
  city: string;
  state: string;
  address: string;
  registrationNumber: string;
  unavailableUntil?: string;
}

// Mock coordinates for US cities - in a real app, these would come from geocoding
const CITY_COORDINATES: Record<string, { x: number; y: number }> = {
  'Los Angeles': { x: 15, y: 75 },
  'Houston': { x: 45, y: 65 },
  'Phoenix': { x: 20, y: 60 },
  'Chicago': { x: 50, y: 40 },
  'Philadelphia': { x: 60, y: 35 },
  'San Antonio': { x: 40, y: 70 },
  'San Diego': { x: 12, y: 78 },
  'Dallas': { x: 42, y: 68 },
  'San Jose': { x: 8, y: 72 },
  'Austin': { x: 38, y: 72 },
  'Jacksonville': { x: 65, y: 55 },
  'Fort Worth': { x: 41, y: 67 },
  'Columbus': { x: 55, y: 42 },
  'Charlotte': { x: 62, y: 50 },
  'San Francisco': { x: 6, y: 70 },
  'Indianapolis': { x: 52, y: 38 },
  'Seattle': { x: 8, y: 25 },
  'Denver': { x: 30, y: 45 },
  'Washington': { x: 62, y: 38 },
  'Boston': { x: 68, y: 30 },
  'El Paso': { x: 25, y: 75 },
  'Nashville': { x: 55, y: 48 },
  'Detroit': { x: 55, y: 35 },
  'Oklahoma City': { x: 35, y: 55 },
  'Portland': { x: 5, y: 30 },
  'Las Vegas': { x: 18, y: 55 },
  'Memphis': { x: 50, y: 52 },
  'Louisville': { x: 55, y: 45 },
  'Baltimore': { x: 64, y: 40 },
  'Milwaukee': { x: 52, y: 32 },
  'Albuquerque': { x: 28, y: 60 },
  'Tucson': { x: 22, y: 62 },
  'Fresno': { x: 10, y: 68 },
  'Sacramento': { x: 8, y: 65 },
  'Mesa': { x: 21, y: 61 },
  'Kansas City': { x: 45, y: 45 },
  'Atlanta': { x: 58, y: 52 },
  'Long Beach': { x: 14, y: 76 },
  'Colorado Springs': { x: 32, y: 48 },
  'Raleigh': { x: 64, y: 48 },
  'Miami': { x: 70, y: 75 },
  'Virginia Beach': { x: 66, y: 42 },
  'Omaha': { x: 42, y: 40 },
  'Oakland': { x: 7, y: 71 },
  'Minneapolis': { x: 48, y: 28 },
  'Tulsa': { x: 38, y: 52 },
  'Arlington': { x: 41, y: 67 },
  'Tampa': { x: 68, y: 70 },
  'New Orleans': { x: 50, y: 65 },
};

const getStatusColor = (status: TrailerStatus): string => {
  switch (status) {
    case 'available':
      return 'text-green-600 bg-green-100';
    case 'low':
      return 'text-orange-600 bg-orange-100';
    case 'unavailable':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const getStatusIcon = (status: TrailerStatus) => {
  // Always return truck icon regardless of status
  return <Truck className="w-4 h-4" />;
};

const formatUnavailableUntil = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const MapCard: React.FC<MapCardProps> = ({
  trailers,
  onTrailerClick,
  className = ''
}) => {
  const [hoveredTrailer, setHoveredTrailer] = useState<TrailerLocation | null>(null);
  const [selectedTrailer, setSelectedTrailer] = useState<TrailerLocation | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [showHoverTooltip, setShowHoverTooltip] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Convert trailers to locations with coordinates
  const trailerLocations: TrailerLocation[] = trailers.map(trailer => {
    const cityKey = trailer.city;
    const coordinates = CITY_COORDINATES[cityKey] || { x: 50, y: 50 }; // Default center if city not found
    
    return {
      id: trailer.id,
      name: trailer.trailerName,
      x: coordinates.x,
      y: coordinates.y,
      status: trailer.status,
      city: trailer.city,
      state: trailer.state,
      address: trailer.parkingAddress,
      registrationNumber: trailer.registrationNumber,
      unavailableUntil: trailer.unavailableUntil
    };
  });

  const handlePinClick = (location: TrailerLocation) => {
    setSelectedTrailer(location);
    setHoveredTrailer(null); // Clear hover when clicking
    onTrailerClick?.(trailers.find(t => t.id === location.id)!);
  };

  const handlePinHover = (location: TrailerLocation | null, event?: React.MouseEvent) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    if (location && event && mapRef.current) {
      const mapRect = mapRef.current.getBoundingClientRect();
      const pinX = (location.x / 100) * mapRect.width;
      const pinY = (location.y / 100) * mapRect.height;
      
      // Calculate tooltip position relative to the map container
      let tooltipX = pinX;
      let tooltipY = pinY - 60; // Position above the pin
      
      // Adjust if tooltip would go off the right edge
      if (tooltipX > mapRect.width - 200) {
        tooltipX = mapRect.width - 200;
      }
      
      // Adjust if tooltip would go off the left edge
      if (tooltipX < 0) {
        tooltipX = 0;
      }
      
      // Adjust if tooltip would go off the top edge
      if (tooltipY < 0) {
        tooltipY = pinY + 40; // Position below the pin instead
      }
      
      setTooltipPosition({ x: tooltipX, y: tooltipY });
      setHoveredTrailer(location);
      
      // Show tooltip after a small delay
      hoverTimeoutRef.current = setTimeout(() => {
        setShowHoverTooltip(true);
      }, 300);
    } else {
      setHoveredTrailer(null);
      setShowHoverTooltip(false);
      setTooltipPosition(null);
    }
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mapRef.current && !mapRef.current.contains(event.target as Node)) {
        setSelectedTrailer(null);
        setHoveredTrailer(null);
        setTooltipPosition(null);
        setShowHoverTooltip(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Trailer Locations</h3>
          </div>
          <div className="text-sm text-gray-500">
            {trailers.length} trailer{trailers.length !== 1 ? 's' : ''} tracked
          </div>
        </div>
      </div>

      <div className="relative" ref={mapRef}>
        {/* Map Container */}
        <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          {/* State Boundaries (simplified) */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Simplified US outline */}
            <path
              d="M 5 25 L 15 20 L 25 15 L 35 20 L 45 15 L 55 20 L 65 15 L 75 20 L 85 15 L 90 25 L 85 35 L 80 45 L 85 55 L 80 65 L 75 70 L 70 75 L 60 80 L 50 85 L 40 80 L 30 75 L 20 70 L 15 60 L 10 50 L 5 40 Z"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="0.3"
              opacity="0.6"
            />
          </svg>

          {/* Trailer Pins */}
          {trailerLocations.map((location) => (
            <div
              key={location.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{
                left: `${location.x}%`,
                top: `${location.y}%`,
              }}
              onClick={() => handlePinClick(location)}
              onMouseEnter={(e) => handlePinHover(location, e)}
              onMouseLeave={() => handlePinHover(null)}
            >
              {/* Pin */}
              <div className={`
                relative w-8 h-8 rounded-full border-2 border-white shadow-lg
                flex items-center justify-center transition-all duration-200
                group-hover:scale-110 group-hover:shadow-xl
                ${getStatusColor(location.status)}
              `}>
                {getStatusIcon(location.status)}
                
                {/* Pulse animation for low/unavailable trailers */}
                {(location.status === 'low' || location.status === 'unavailable') && (
                  <div className={`
                    absolute inset-0 rounded-full animate-ping
                    ${location.status === 'low' ? 'bg-orange-400' : 'bg-red-400'}
                    opacity-75
                  `} />
                )}
              </div>

              {/* Pin Tail */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white" />
            </div>
          ))}

          {/* Hover Tooltip */}
          {hoveredTrailer && !selectedTrailer && tooltipPosition && showHoverTooltip && (
            <div
              ref={tooltipRef}
              className="absolute z-20 bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-48 max-w-64 transition-opacity duration-200"
              style={{
                left: `${tooltipPosition.x}px`,
                top: `${tooltipPosition.y}px`,
              }}
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-gray-600" />
                  <span className="font-semibold text-gray-900">{hoveredTrailer.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div>{hoveredTrailer.city}, {hoveredTrailer.state}</div>
                  <div className="text-xs text-gray-500">{hoveredTrailer.address}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(hoveredTrailer.status)}`}>
                    {hoveredTrailer.status.charAt(0).toUpperCase() + hoveredTrailer.status.slice(1)}
                  </span>
                  {hoveredTrailer.unavailableUntil && (
                    <span className="text-xs text-gray-500">
                      Until {formatUnavailableUntil(hoveredTrailer.unavailableUntil)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Click Tooltip */}
          {selectedTrailer && (
            <div
              className="absolute z-30 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 min-w-64 max-w-80"
              style={{
                left: `${Math.min(selectedTrailer.x, 75)}%`,
                top: `${Math.max(selectedTrailer.y - 15, 10)}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-900">{selectedTrailer.name}</span>
                  </div>
                  <button
                    onClick={() => setSelectedTrailer(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{selectedTrailer.city}, {selectedTrailer.state}</div>
                    <div className="text-gray-600">{selectedTrailer.address}</div>
                    <div className="text-xs text-gray-500 font-mono">{selectedTrailer.registrationNumber}</div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTrailer.status)}`}>
                      {selectedTrailer.status.charAt(0).toUpperCase() + selectedTrailer.status.slice(1)}
                    </span>
                    {selectedTrailer.unavailableUntil && (
                      <span className="text-sm text-gray-500">
                        Until {formatUnavailableUntil(selectedTrailer.unavailableUntil)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="text-sm font-medium text-gray-900 mb-2">Status Legend</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300 flex items-center justify-center">
                <Truck className="w-2 h-2 text-green-600" />
              </div>
              <span className="text-xs text-gray-700">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center">
                <Truck className="w-2 h-2 text-orange-600" />
              </div>
              <span className="text-xs text-gray-700">Low Stock</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-100 border border-red-300 flex items-center justify-center">
                <Truck className="w-2 h-2 text-red-600" />
              </div>
              <span className="text-xs text-gray-700">Unavailable</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
