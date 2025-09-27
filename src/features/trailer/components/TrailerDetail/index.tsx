import React, { useState } from 'react';
import { ArrowLeft, Edit2, Trash2, MapPin, Calendar, User, Activity, Package, Film, Truck, FileText, Plus, RotateCcw } from 'lucide-react';
import { Card } from '../../../../common/components/Card';
import { Button } from '../../../../common/components/Button';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { Trailer, ToolInventoryItem, FilmSheetInventoryItem } from '../../../../types';

interface TrailerDetailProps {
  trailer: Trailer;
  onBack: () => void;
  onEdit: (trailer: Trailer) => void;
  onDelete: (trailer: Trailer) => void;
  onRestock?: (trailer: Trailer) => void;
}

/**
 * Trailer detail component showing comprehensive trailer information
 * Includes basic info, inventory tabs (Tools/Film Sheets), and activity logs
 */
export const TrailerDetail: React.FC<TrailerDetailProps> = ({
  trailer: initialTrailer,
  onBack,
  onEdit,
  onDelete,
  onRestock,
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'sheets'>('tools');
  const [trailer, setTrailer] = useState<Trailer>(initialTrailer);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRestock = () => {
    const restockedTrailer: Trailer = {
      ...trailer,
      inventory: {
        tools: trailer.inventory.tools.map(tool => ({
          ...tool,
          currentStock: tool.threshold,
          status: 'good' as const
        })),
        filmSheets: trailer.inventory.filmSheets.map(sheet => ({
          ...sheet,
          currentStock: sheet.threshold,
          status: 'good' as const
        }))
      },
      status: 'available' as const,
      updatedAt: new Date().toISOString(),
      activityLogs: [
        ...trailer.activityLogs,
        {
          id: `restock-${Date.now()}`,
          type: 'inventory_updated' as const,
          description: 'Trailer inventory restocked to threshold levels',
          timestamp: new Date().toISOString(),
          systemGenerated: true,
          user: 'System'
        }
      ]
    };

    setTrailer(restockedTrailer);
    onRestock?.(restockedTrailer);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            icon={ArrowLeft}
            className="p-2"
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {trailer.trailerName}
            </h1>
            <p className="text-sm text-gray-600">
              Registration: {trailer.registrationNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {trailer.status === 'available' && (
            <Button
              variant="primary"
              onClick={() => {
                // TODO: Implement project assignment functionality
                console.log('Assign trailer to project:', trailer.trailerName);
              }}
              icon={Plus}
            >
              Assign to Project
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={() => onEdit(trailer)}
            icon={Edit2}
          >
            Edit Trailer
          </Button>
          <Button
            variant="ghost"
            onClick={() => onDelete(trailer)}
            icon={Trash2}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Basic Information Card */}
      <Card>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            <StatusBadge status={trailer.status} size="md" unavailableUntil={trailer.unavailableUntil} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Trailer Name</div>
                <div className="font-medium text-gray-900">{trailer.trailerName}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Registration Number</div>
                <div className="font-medium text-gray-900">{trailer.registrationNumber}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Address</div>
                <div className="font-medium text-gray-900">{trailer.parkingAddress}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin size={20} className="text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Current Location</div>
                <div className="font-medium text-gray-500">-</div>
              </div>
            </div>
          </div>
        </div>
      </Card>


      {/* Inventory Section with Tabs */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Inventory</h2>
            <Button
              variant="secondary"
              onClick={handleRestock}
              icon={RotateCcw}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              Mark Restocked
            </Button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'tools'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Package size={16} />
                Tools ({trailer.inventory.tools.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('sheets')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'sheets'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Film size={16} />
                Film Sheets ({trailer.inventory.filmSheets.length})
              </div>
            </button>
          </div>

          {/* Tools Tab */}
          {activeTab === 'tools' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tool Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Initial Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inventory Left
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Stock Level
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trailer.inventory.tools.map((item, index) => (
                    <ToolInventoryRow key={index} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Film Sheets Tab */}
          {activeTab === 'sheets' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sheet Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Initial Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inventory Left
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status & Stock Level
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trailer.inventory.filmSheets.map((item, index) => (
                    <FilmSheetInventoryRow key={index} item={item} />
                  ))}
                </tbody>
              </table>
              
            </div>
          )}
        </div>
      </Card>

      {/* Activity Log */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
          </div>
          
          {trailer.activityLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No activity logs available
            </div>
          ) : (
            <div className="space-y-3">
              {trailer.activityLogs
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <div className={`p-1 rounded-full ${
                      log.systemGenerated ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {log.systemGenerated ? (
                        <Activity size={14} className="text-blue-600" />
                      ) : (
                        <User size={14} className="text-green-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-900">{log.description}</p>
                      <time className="text-xs text-gray-500 flex-shrink-0 ml-4">
                        {formatDate(log.timestamp)}
                      </time>
                    </div>
                    {log.user && (
                      <p className="text-xs text-gray-600 mt-1">by {log.user}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

interface ToolInventoryRowProps {
  item: ToolInventoryItem;
}

const ToolInventoryRow: React.FC<ToolInventoryRowProps> = ({ item }) => {
  const getStockLevelWidth = () => {
    if (item.threshold === 0) return 100;
    return Math.min((item.currentStock / item.threshold) * 100, 100);
  };

  const getStockLevelColor = () => {
    if (item.status === 'critical') return 'bg-red-500';
    if (item.status === 'low') return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {item.toolName}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">{item.currentStock}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">{item.threshold}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="space-y-2">
          <StatusBadge status={item.status} />
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${getStockLevelColor()}`}
              style={{ width: `${getStockLevelWidth()}%` }}
            />
          </div>
          <div className="text-xs text-gray-600">
            {item.currentStock > item.threshold ? (
              <span className="text-green-600">
                +{item.currentStock - item.threshold} above threshold
              </span>
            ) : item.currentStock === item.threshold ? (
              <span className="text-amber-600">At threshold</span>
            ) : item.currentStock === 0 ? (
              <span className="text-red-600">Out of stock</span>
            ) : (
              <span className="text-red-600">
                {item.threshold - item.currentStock} below threshold
              </span>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

interface FilmSheetInventoryRowProps {
  item: FilmSheetInventoryItem;
}

const FilmSheetInventoryRow: React.FC<FilmSheetInventoryRowProps> = ({ item }) => {
  const getStockLevelWidth = () => {
    if (item.threshold === 0) return 100;
    return Math.min((item.currentStock / item.threshold) * 100, 100);
  };

  const getStockLevelColor = () => {
    if (item.status === 'critical') return 'bg-red-500';
    if (item.status === 'low') return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {item.sheetType}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">{item.currentStock}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">{item.threshold}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="space-y-2">
          <StatusBadge status={item.status} />
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${getStockLevelColor()}`}
              style={{ width: `${getStockLevelWidth()}%` }}
            />
          </div>
          <div className="text-xs text-gray-600">
            {item.currentStock > item.threshold ? (
              <span className="text-green-600">
                +{item.currentStock - item.threshold} above threshold
              </span>
            ) : item.currentStock === item.threshold ? (
              <span className="text-amber-600">At threshold</span>
            ) : item.currentStock === 0 ? (
              <span className="text-red-600">Out of stock</span>
            ) : (
              <span className="text-red-600">
                {item.threshold - item.currentStock} below threshold
              </span>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};
