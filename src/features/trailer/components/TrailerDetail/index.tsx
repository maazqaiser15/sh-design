import React, { useState } from 'react';
import { ArrowLeft, Edit2, Trash2, MapPin, Calendar, User, Activity, Package, Film, Truck, FileText, RotateCcw, Archive, Edit } from 'lucide-react';
import { Card } from '../../../../common/components/Card';
import { Button } from '../../../../common/components/Button';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { Trailer, CartInventoryItem, CaulkingInventoryItem, TrailerInventoryItem, FilmInventoryItem } from '../../../../types';
import CustomDataTable from 'common/components/CustomDataTable';
import { cartItemData, caulkingItemData, tailerItemData } from './tabledata';

interface TrailerDetailProps {
  trailer: Trailer;
  onBack: () => void;
  onEdit: (trailer: Trailer) => void;
  onArchive: (trailer: Trailer) => void;
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
  onArchive,
  onRestock,
}) => {
  const [activeTab, setActiveTab] = useState<'cart' | 'caulking' | 'trailer' | 'film'>('cart');
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
        cartItems: (trailer.inventory.cartItems || []).map(item => ({
          ...item,
          currentStock: item.threshold,
          status: 'good' as const
        })),
        caulkingSupplies: (trailer.inventory.caulkingSupplies || []).map(item => ({
          ...item,
          currentStock: item.threshold,
          status: 'good' as const
        })),
        trailerItems: (trailer.inventory.trailerItems || []).map(item => ({
          ...item,
          currentStock: item.threshold,
          status: 'good' as const
        })),
        films: (trailer.inventory.films || []).map(item => ({
          ...item,
          currentStock: item.threshold,
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

  const cartColumns = [
    {
      name: 'Tool Name',
      selector: (row: any) => row.name,
    },
    {
      name: 'Min Threshold',
      selector: (row: any) => row.threshold,
    },
    {
      name: 'Current Inventory',
      selector: (row: any) => row.inventoryLeft,
    },
    {
      name: 'Status & Stock Level',
      selector: (row: any) => row.status,
      cell: (row: any) => <div className='w-full'>

        <div className="space-y-1">
          <span className={`inline-flex px-2 py-1 mt-1 text-xs font-semibold rounded-full ${row.status === 'Good on stock' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
            }`}>
            {row.status}
          </span>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${row.status === 'Good on stock' ? 'bg-green-500' :
                'bg-red-500'
                }`}
              style={{ width: `${Math.min((row.inventoryLeft / row.threshold) * 100, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-600">
            {row.inventoryLeft > row.threshold ? (
              <span className="text-green-600">
                +{row.inventoryLeft - row.threshold} above threshold
              </span>
            ) : row.inventoryLeft === row.threshold ? (
              <span className="text-yellow-600">At threshold</span>
            ) : row.inventoryLeft === 0 ? (
              <span className="text-red-600">Out of stock</span>
            ) : (
              <span className="text-red-600">
                {row.threshold - row.inventoryLeft} below threshold
              </span>
            )}
          </div>
        </div>
      </div>
    }
  ]

  const caulkingColumns = [
    {
      name: 'Tool Name',
      selector: (row: any) => row.name,
    },
    {
      name: 'Min Threshold',
      selector: (row: any) => row.threshold,
    },
    {
      name: 'Current Inventory',
      selector: (row: any) => row.inventoryLeft,
    },
    {
      name: 'Status & Stock Level',
      selector: (row: any) => row.status,
      cell: (row: any) => <div className='w-full'>

        <div className="space-y-1">
          <span className={`inline-flex px-2 py-1 mt-1 text-xs font-semibold rounded-full ${row.status === 'Good on stock' ? 'bg-green-100 text-green-800' :
            'bg-red-100 text-red-800'
            }`}>
            {row.status}
          </span>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${row.status === 'Good on stock' ? 'bg-green-500' :
                'bg-red-500'
                }`}
              style={{ width: `${Math.min((row.inventoryLeft / row.threshold) * 100, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-600">
            {row.inventoryLeft > row.threshold ? (
              <span className="text-green-600">
                +{row.inventoryLeft - row.threshold} above threshold
              </span>
            ) : row.inventoryLeft === row.threshold ? (
              <span className="text-yellow-600">At threshold</span>
            ) : row.inventoryLeft === 0 ? (
              <span className="text-red-600">Out of stock</span>
            ) : (
              <span className="text-red-600">
                {row.threshold - row.inventoryLeft} below threshold
              </span>
            )}
          </div>
        </div>
      </div>
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* <Button
            variant="ghost"
            onClick={onBack}
            icon={ArrowLeft}
            className="p-2"
          >
            Back
          </Button> */}
          {/* <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {trailer.trailerName}
            </h1>
            <p className="text-sm text-gray-600">
              Registration: {trailer.registrationNumber}
            </p>
          </div> */}
        </div>
      </div>

      {/* Basic Information Card */}
      <Card>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck size={30} className="text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{trailer.trailerName}</div>
                <div className="text-sm text-gray-600">Trailer Name</div>
              </div>
            </div>
            <div className='flex'>
              <Button icon={Archive} className='bg-transparent  hover:bg-transparent' variant='ghost'>   Archive</Button>
              <button  className='bg-transparent rounded-lg hover:bg-transparent text-[#334155] border border-[#CBD5E1] p-2'> <Edit size={20}/> </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


            <div className="flex items-center gap-3">
            
              <div>
                <div className="text-sm text-gray-600">Registration Number</div>
                <div className="font-medium text-gray-900">{trailer.registrationNumber}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
          
              <div>
                <div className="text-sm text-gray-600">Parking Address</div>
                <div className="font-medium text-gray-900">{trailer.parkingAddress}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
         
              <div>
                <div className="text-sm text-gray-600">Project Location</div>
                <div className="font-medium text-gray-500">-</div>
              </div>
            </div>
          </div>
        </div>
    
        <div className="absolute inset-[-1px] pointer-events-none shadow-[-5px_-5px_250px_0px_inset_rgba(255,255,255,0.02)]" />
      </Card>


      {/* Inventory Section with Tabs */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Inventory</h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('cart')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'cart'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Cart Item
            </button>
            <button
              onClick={() => setActiveTab('caulking')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'caulking'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Caulking Supplies
            </button>
            <button
              onClick={() => setActiveTab('trailer')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'trailer'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Trailer Item
            </button>
            <button
              onClick={() => setActiveTab('film')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'film'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Film
            </button>
          </div>

          {/* Cart Item Tab */}
          {activeTab === 'cart' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Cart Item
              </h3>
              <p className="text-sm text-gray-600">
                Current stock levels and thresholds for each cart item.
              </p>

              <div className="overflow-x-auto">
                <CustomDataTable title={''} columns={cartColumns} data={cartItemData} selectableRows={undefined} pagination={false} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={undefined} />
              </div>
            </div>
          )}

          {/* Caulking Supplies Tab */}
          {activeTab === 'caulking' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Caulking Supplies
              </h3>
              <p className="text-sm text-gray-600">
                Current stock levels and thresholds for each caulking supply item.
              </p>
              <div className="overflow-x-auto">
                <CustomDataTable title={''} columns={cartColumns} data={caulkingItemData} selectableRows={undefined} pagination={false} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={undefined} />
              </div>
            </div>
          )}

          {/* Trailer Item Tab */}
          {activeTab === 'trailer' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Trailer Item
              </h3>
              <p className="text-sm text-gray-600">
                Current stock levels and thresholds for each trailer item.
              </p>
              <div className="overflow-x-auto">
                <CustomDataTable title={''} columns={cartColumns} data={tailerItemData} selectableRows={undefined} pagination={false} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={undefined} />
              </div>
            </div>
          )}

          {/* Film Tab */}
          {activeTab === 'film' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <CustomDataTable title={''} columns={cartColumns} data={tailerItemData} selectableRows={undefined} pagination={false} highlightOnHover={undefined} striped={undefined} onRowClicked={undefined} progressPending={undefined} paginationPerPage={undefined} />
              </div>
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
                      <div className={`p-1 rounded-full ${log.systemGenerated ? 'bg-blue-100' : 'bg-green-100'
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

