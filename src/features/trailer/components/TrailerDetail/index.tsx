import React, { useState } from 'react';
import { ArrowLeft, Edit2, Trash2, MapPin, Calendar, User, Activity, Package, Film, Truck, FileText, RotateCcw } from 'lucide-react';
import { Card } from '../../../../common/components/Card';
import { Button } from '../../../../common/components/Button';
import { StatusBadge } from '../../../../common/components/StatusBadge';
import { Trailer, CartInventoryItem, CaulkingInventoryItem, TrailerInventoryItem, FilmInventoryItem } from '../../../../types';

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
      </div>

      {/* Basic Information Card - New Figma Design */}
      <div className="backdrop-blur-[21px] backdrop-filter border border-slate-100 border-solid box-border content-stretch flex flex-col gap-[24px] items-start p-[24px] relative rounded-[14px] size-full">
        <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
          <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
            <div className="bg-[#dbe9fe] box-border content-stretch flex gap-[10px] items-center p-[10px] relative rounded-[12px] shrink-0">
              <div className="relative shrink-0 size-[24px]">
                <Truck size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[6px] items-start justify-center leading-none not-italic relative shrink-0 text-nowrap whitespace-pre">
              <p className="font-semibold relative shrink-0 text-[#101827] text-[20px]">
                {trailer.trailerName}
              </p>
              <p className="font-normal relative shrink-0 text-[14px] text-gray-600">
                Registration: {trailer.registrationNumber}
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[12px] items-center justify-center relative shrink-0">
            <Button
              variant="secondary"
              onClick={() => onArchive(trailer)}
              className="box-border content-stretch flex gap-[4px] items-center justify-center min-w-[80px] overflow-clip px-[16px] py-[8px] relative rounded-[8px] shrink-0"
            >
              <Trash2 size={16} className="text-slate-700" />
              Archive
            </Button>
            <Button
              variant="ghost"
              onClick={() => onEdit(trailer)}
              className="border border-slate-300 border-solid content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]"
            >
              <Edit2 size={16} className="text-slate-700" />
            </Button>
          </div>
        </div>
        <div className="content-stretch flex gap-[32px] items-start relative shrink-0">
          <div className="content-stretch flex flex-col gap-[8px] items-start justify-center relative shrink-0 w-[300px]">
            <p className="font-normal leading-none not-italic relative shrink-0 text-[14px] text-gray-600 text-nowrap whitespace-pre">
              Status
            </p>
            <div className="bg-red-100 box-border content-stretch flex h-[24px] items-center justify-center overflow-clip px-[12px] py-[2px] relative rounded-[24px] shrink-0">
              <p className="font-normal leading-none not-italic relative shrink-0 text-[14px] text-nowrap text-red-700 whitespace-pre">
                {trailer.unavailableUntil ? `Unavailable until ${new Date(trailer.unavailableUntil).toLocaleDateString('en-GB')}` : 'Available'}
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-start justify-center leading-none not-italic relative shrink-0 text-[14px] text-nowrap w-[300px] whitespace-pre">
            <p className="font-normal relative shrink-0 text-gray-600">
              Parking Address
            </p>
            <p className="font-semibold relative shrink-0 text-[#101827]">
              {trailer.parkingAddress}
            </p>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-start justify-center leading-none not-italic relative shrink-0 text-[14px] text-nowrap w-[300px] whitespace-pre">
            <p className="font-normal relative shrink-0 text-gray-600">
              Project Location
            </p>
            <p className="font-semibold relative shrink-0 text-[#101827]">
              ----
            </p>
          </div>
        </div>
        <div className="absolute inset-[-1px] pointer-events-none shadow-[-5px_-5px_250px_0px_inset_rgba(255,255,255,0.02)]" />
      </div>


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
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'cart'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Cart Item
            </button>
            <button
              onClick={() => setActiveTab('caulking')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'caulking'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Caulking Supplies
            </button>
            <button
              onClick={() => setActiveTab('trailer')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'trailer'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Trailer Item
            </button>
            <button
              onClick={() => setActiveTab('film')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'film'
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
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tool Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Min Threshold
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Inventory
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status & Stock Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { name: 'Beer Tank W/ Hose', threshold: 5, inventoryLeft: 6, status: 'Good on stock' },
                      { name: 'Hard Press', threshold: 3, inventoryLeft: 5, status: 'Good on stock' },
                      { name: 'Red Card', threshold: 6, inventoryLeft: 8, status: 'Good on stock' },
                      { name: 'Olfa', threshold: 4, inventoryLeft: 3, status: 'Low on stock' },
                      { name: 'Olfa Blade Pack', threshold: 8, inventoryLeft: 12, status: 'Good on stock' },
                      { name: 'Scrapers', threshold: 4, inventoryLeft: 2, status: 'Low on stock' },
                      { name: 'Scraper Blade Pack', threshold: 5, inventoryLeft: 7, status: 'Good on stock' },
                      { name: 'Pick', threshold: 2, inventoryLeft: 1, status: 'Low on stock' },
                      { name: '1 Qrt Acetone', threshold: 3, inventoryLeft: 4, status: 'Good on stock' },
                      { name: 'Phillips Head SD', threshold: 4, inventoryLeft: 3, status: 'Low on stock' },
                      { name: 'Window Squeegee', threshold: 4, inventoryLeft: 6, status: 'Good on stock' },
                      { name: 'Sharps Containers', threshold: 3, inventoryLeft: 2, status: 'Low on stock' },
                      { name: 'Headlamps', threshold: 3, inventoryLeft: 5, status: 'Good on stock' },
                      { name: 'Batteries for Headlamps (Pack)', threshold: 5, inventoryLeft: 8, status: 'Good on stock' }
                    ].map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.threshold}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.inventoryLeft}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="space-y-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.status === 'Good on stock' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.status}
                            </span>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  item.status === 'Good on stock' ? 'bg-green-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${Math.min((item.inventoryLeft / item.threshold) * 100, 100)}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-600">
                              {item.inventoryLeft > item.threshold ? (
                                <span className="text-green-600">
                                  +{item.inventoryLeft - item.threshold} above threshold
                                </span>
                              ) : item.inventoryLeft === item.threshold ? (
                                <span className="text-yellow-600">At threshold</span>
                              ) : item.inventoryLeft === 0 ? (
                                <span className="text-red-600">Out of stock</span>
                              ) : (
                                <span className="text-red-600">
                                  {item.threshold - item.inventoryLeft} below threshold
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                    {[
                      { name: 'Rolls of Painters Tape', threshold: 6, inventoryLeft: 8, status: 'Good on stock' },
                      { name: 'Caulk Sausage Case', threshold: 3, inventoryLeft: 4, status: 'Good on stock' },
                      { name: 'Caulk Gun (Sausage)', threshold: 3, inventoryLeft: 2, status: 'Low on stock' },
                      { name: 'Pack Nitrile Gloves', threshold: 10, inventoryLeft: 15, status: 'Good on stock' },
                      { name: 'Case of Blue Towels', threshold: 5, inventoryLeft: 3, status: 'Low on stock' },
                      { name: 'Tub O\' Towels', threshold: 2, inventoryLeft: 1, status: 'Low on stock' },
                      { name: 'Crocodile Wipes', threshold: 5, inventoryLeft: 7, status: 'Good on stock' },
                      { name: 'Caulking Gun Tips', threshold: 8, inventoryLeft: 12, status: 'Good on stock' }
                    ].map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.threshold}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.inventoryLeft}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="space-y-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.status === 'Good on stock' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.status}
                            </span>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  item.status === 'Good on stock' ? 'bg-green-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${Math.min((item.inventoryLeft / item.threshold) * 100, 100)}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-600">
                              {item.inventoryLeft > item.threshold ? (
                                <span className="text-green-600">
                                  +{item.inventoryLeft - item.threshold} above threshold
                                </span>
                              ) : item.inventoryLeft === item.threshold ? (
                                <span className="text-yellow-600">At threshold</span>
                              ) : item.inventoryLeft === 0 ? (
                                <span className="text-red-600">Out of stock</span>
                              ) : (
                                <span className="text-red-600">
                                  {item.threshold - item.inventoryLeft} below threshold
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
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
                    {[
                      { name: 'Cordless Drill', threshold: 1, inventoryLeft: 2, status: 'Good on stock' },
                      { name: 'Allen Key Set', threshold: 2, inventoryLeft: 4, status: 'Good on stock' },
                      { name: 'Channel Lock Pliers', threshold: 3, inventoryLeft: 2, status: 'Low on stock' },
                      { name: 'Drill Bit Kit', threshold: 4, inventoryLeft: 6, status: 'Good on stock' },
                      { name: 'Generator W/ Cord', threshold: 2, inventoryLeft: 1, status: 'Low on stock' },
                      { name: 'Micro Fiber Package', threshold: 5, inventoryLeft: 7, status: 'Good on stock' },
                      { name: '5 Gal Gas Can', threshold: 2, inventoryLeft: 1, status: 'Low on stock' },
                      { name: 'Air Compressor W/ Hose', threshold: 1, inventoryLeft: 2, status: 'Good on stock' },
                      { name: 'Trash Can', threshold: 2, inventoryLeft: 3, status: 'Good on stock' },
                      { name: '55 Gal Trash Bags Case', threshold: 3, inventoryLeft: 4, status: 'Good on stock' },
                      { name: 'Bath Towel', threshold: 4, inventoryLeft: 5, status: 'Good on stock' },
                      { name: 'Towel Clips for Hanging', threshold: 6, inventoryLeft: 9, status: 'Good on stock' },
                      { name: '5 Gal Buckets', threshold: 4, inventoryLeft: 3, status: 'Low on stock' },
                      { name: 'Sharpie Pack', threshold: 5, inventoryLeft: 8, status: 'Good on stock' },
                      { name: 'Dry Erase Marker Pack', threshold: 4, inventoryLeft: 6, status: 'Good on stock' },
                      { name: 'Square', threshold: 3, inventoryLeft: 2, status: 'Low on stock' },
                      { name: 'Non Serated Scissors', threshold: 3, inventoryLeft: 4, status: 'Good on stock' },
                      { name: 'Ladders', threshold: 2, inventoryLeft: 1, status: 'Low on stock' },
                      { name: 'Tank Fix Kits', threshold: 2, inventoryLeft: 3, status: 'Good on stock' },
                      { name: 'Extras Spray Nozzles', threshold: 4, inventoryLeft: 5, status: 'Good on stock' },
                      { name: 'Broom and Dust Pan', threshold: 2, inventoryLeft: 2, status: 'Good on stock' },
                      { name: 'Scotch Brite Case', threshold: 3, inventoryLeft: 4, status: 'Good on stock' },
                      { name: 'Sos Pad Box', threshold: 3, inventoryLeft: 2, status: 'Low on stock' },
                      { name: 'Glass Thickness Gauge', threshold: 2, inventoryLeft: 1, status: 'Low on stock' },
                      { name: 'PPE Bin/SDS Binder', threshold: 2, inventoryLeft: 2, status: 'Good on stock' },
                      { name: 'Spare Cutter Blades (Box)', threshold: 2, inventoryLeft: 3, status: 'Good on stock' },
                      { name: 'Tire Patch Kit', threshold: 3, inventoryLeft: 2, status: 'Low on stock' },
                      { name: 'Parking Cones', threshold: 4, inventoryLeft: 6, status: 'Good on stock' },
                      { name: 'Wheel Chalks', threshold: 3, inventoryLeft: 4, status: 'Good on stock' },
                      { name: 'Tongue Lock', threshold: 2, inventoryLeft: 1, status: 'Low on stock' }
                    ].map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.threshold}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.inventoryLeft}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="space-y-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.status === 'Good on stock' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.status}
                            </span>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  item.status === 'Good on stock' ? 'bg-green-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${Math.min((item.inventoryLeft / item.threshold) * 100, 100)}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-600">
                              {item.inventoryLeft > item.threshold ? (
                                <span className="text-green-600">
                                  +{item.inventoryLeft - item.threshold} above threshold
                                </span>
                              ) : item.inventoryLeft === item.threshold ? (
                                <span className="text-yellow-600">At threshold</span>
                              ) : item.inventoryLeft === 0 ? (
                                <span className="text-red-600">Out of stock</span>
                              ) : (
                                <span className="text-red-600">
                                  {item.threshold - item.inventoryLeft} below threshold
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}

          {/* Film Tab */}
          {activeTab === 'film' && (
            <div className="space-y-4">

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tool Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Min Threshold
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Inventory
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status & Stock Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { name: 'SW450', threshold: 8, inventoryLeft: 12, status: 'Good on stock' },
                      { name: 'SW440BR', threshold: 6, inventoryLeft: 8, status: 'Good on stock' },
                      { name: 'SW600BR', threshold: 5, inventoryLeft: 6, status: 'Good on stock' },
                      { name: 'CL700 EXT', threshold: 5, inventoryLeft: 4, status: 'Low on stock' },
                      { name: 'Madico SG20 E Tint', threshold: 10, inventoryLeft: 15, status: 'Good on stock' },
                      { name: 'Madico RS20 E Tint', threshold: 8, inventoryLeft: 12, status: 'Good on stock' },
                      { name: 'Suntek SXT-20', threshold: 6, inventoryLeft: 9, status: 'Good on stock' },
                      { name: 'Suntek SXT-35', threshold: 7, inventoryLeft: 10, status: 'Good on stock' },
                      { name: 'Suntek IXT-20', threshold: 5, inventoryLeft: 7, status: 'Good on stock' },
                      { name: 'Suntek IXT-35', threshold: 6, inventoryLeft: 5, status: 'Low on stock' },
                      { name: 'Suntek Frost', threshold: 4, inventoryLeft: 3, status: 'Low on stock' }
                    ].map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.threshold}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.inventoryLeft}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="space-y-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.status === 'Good on stock' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.status}
                            </span>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  item.status === 'Good on stock' ? 'bg-green-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${Math.min((item.inventoryLeft / item.threshold) * 100, 100)}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-600">
                              {item.inventoryLeft > item.threshold ? (
                                <span className="text-green-600">
                                  +{item.inventoryLeft - item.threshold} above threshold
                                </span>
                              ) : item.inventoryLeft === item.threshold ? (
                                <span className="text-yellow-600">At threshold</span>
                              ) : item.inventoryLeft === 0 ? (
                                <span className="text-red-600">Out of stock</span>
                              ) : (
                                <span className="text-red-600">
                                  {item.threshold - item.inventoryLeft} below threshold
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

