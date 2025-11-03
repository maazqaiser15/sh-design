import React from "react";
import { FileText } from "lucide-react";

export const TravelDetailsContent: React.FC = () => {
  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Flight Information</h4>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Route:</span>
            <span className="text-sm font-medium text-gray-900">Lahore → Miami</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Departure:</span>
            <span className="text-sm font-medium text-gray-900">Sep 25, 2025 - 10:30 AM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Arrival:</span>
            <span className="text-sm font-medium text-gray-900">Sep 25, 2025 - 6:45 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Flight Number:</span>
            <span className="text-sm font-medium text-gray-900">AA 1234</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Airline:</span>
            <span className="text-sm font-medium text-gray-900">American Airlines</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Booking Reference:</span>
            <span className="text-sm font-medium text-gray-900">ABC123XYZ</span>
          </div>
        </div>
      </div> */}

      {/* <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Passenger Details</h4>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Name:</span>
            <span className="text-sm font-medium text-gray-900">John Doe</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Seat Number:</span>
            <span className="text-sm font-medium text-gray-900">12A</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Class:</span>
            <span className="text-sm font-medium text-gray-900">Business</span>
          </div>
        </div>
      </div> */}


      {/* Vehical details */}

      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Vehical details Details</h4>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Passenger Name:</span>
            <span className="text-sm font-medium text-gray-900">John Doe</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Departure Date:</span>
            <span className="text-sm font-medium text-gray-900">05/12/2025</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Departure Time:</span>
            <span className="text-sm font-medium text-gray-900">4:00 Pm</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Arrival Date            :</span>
            <span className="text-sm font-medium text-gray-900">05/12/2025</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Arrival Time            :</span>
            <span className="text-sm font-medium text-gray-900">5:00 Pm</span>
          </div>

        <div className="flex justify-between">
            <span className="text-sm text-gray-600">Airline :</span>
            <span className="text-sm font-medium text-gray-900">Fly Jinnah
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Ticket Cost:</span>
            <span className="text-sm font-medium text-gray-900">$100
            </span>
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Attachments (2)</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Flight Ticket.pdf</span>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Download</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Boarding Pass.pdf</span>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Download</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelDetailsContent;

