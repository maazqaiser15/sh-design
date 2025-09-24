import React from 'react';
import { LogisticsTravelData } from '../types/logisticsTravel';

interface TravelTabViewProps {
  travelData: LogisticsTravelData;
}

const TravelTabView: React.FC<TravelTabViewProps> = ({ travelData }) => {
  // Mock travel and accommodation data for PV90 project
  const mockTravelData = {
    logistics: [
      {
        id: 'log-1',
        name: 'Hotel Accommodation',
        type: 'Other' as const,
        description: 'Marriott Downtown Hotel - 5 rooms for 3 nights',
        quantity: 5,
        location: '123 Main Street, Downtown',
        expectedDate: '2024-02-01',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'Logistics Manager'
      },
      {
        id: 'log-2',
        name: 'Rental Vehicles',
        type: 'Vehicle' as const,
        description: '2 pickup trucks for equipment transport',
        quantity: 2,
        location: 'Project Site',
        expectedDate: '2024-02-01',
        createdAt: '2024-01-16T09:00:00Z',
        updatedAt: '2024-01-16T09:00:00Z',
        createdBy: 'Logistics Manager'
      },
      {
        id: 'log-3',
        name: 'Flight Bookings',
        type: 'Other' as const,
        description: 'Round-trip flights for team members',
        quantity: 5,
        location: 'Various airports',
        expectedDate: '2024-01-31',
        createdAt: '2024-01-17T14:00:00Z',
        updatedAt: '2024-01-17T14:00:00Z',
        createdBy: 'Travel Coordinator'
      }
    ],
    travelPlans: [
      {
        id: 'travel-1',
        travelType: 'Flight' as const,
        departureLocation: 'Los Angeles, CA',
        destination: 'Project Site',
        departureDate: '2024-01-31T08:00:00Z',
        returnDate: '2024-02-15T18:00:00Z',
        assignedTeamMembers: ['tm-001', 'tm-002', 'tm-003', 'tm-004', 'tm-005'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'Travel Coordinator'
      }
    ]
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Flight':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
      case 'Vehicle':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
          </svg>
        );
      case 'Other':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg text-[#101828] leading-7">Travel & Accommodation</h3>
            <p className="font-normal text-sm text-[#475467] leading-5">
              Travel arrangements and accommodation details for the project
            </p>
          </div>
        </div>

        {/* Travel Plans Section */}
        <div>
          <h4 className="font-semibold text-base text-[#101828] mb-4">Travel Plans</h4>
          <div className="space-y-4">
            {mockTravelData.travelPlans.map((plan) => (
              <div key={plan.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {getTypeIcon(plan.travelType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-semibold text-sm text-[#101828]">{plan.travelType}</h5>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {plan.assignedTeamMembers.length} members
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#475467] mb-1">Departure</p>
                        <p className="font-medium text-sm text-[#101828]">{plan.departureLocation}</p>
                        <p className="text-xs text-[#475467]">{formatDateTime(plan.departureDate)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#475467] mb-1">Destination</p>
                        <p className="font-medium text-sm text-[#101828]">{plan.destination}</p>
                        {plan.returnDate && (
                          <p className="text-xs text-[#475467]">Return: {formatDateTime(plan.returnDate)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accommodation & Logistics Section */}
        <div>
          <h4 className="font-semibold text-base text-[#101828] mb-4">Accommodation & Logistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockTravelData.logistics.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-sm text-[#101828] mb-1">{item.name}</h5>
                    <p className="text-xs text-[#475467] mb-2">{item.description}</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-xs text-[#475467]">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs text-[#475467]">Expected: {formatDate(item.expectedDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="text-xs text-[#475467]">Quantity: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-blue-900">Travel Summary</h4>
              <p className="text-xs text-blue-700">
                All travel arrangements confirmed • 5 team members • 3 nights accommodation • 2 rental vehicles
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelTabView;
