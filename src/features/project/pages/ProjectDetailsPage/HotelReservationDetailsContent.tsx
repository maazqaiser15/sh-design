import React from "react";
import { FileText, Calendar, Clock, Plane, DollarSign, Upload } from "lucide-react";
import { Card } from "../../../../common/components/Card";
import { Form, Formik } from "formik";
import FormField from "common/components/FormField";

export const HotelReservationDetailsContent: React.FC = () => {
  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Hotel Information</h4>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Hotel Name:</span>
            <span className="text-sm font-medium text-gray-900">Hotel Picaso</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Address:</span>
            <span className="text-sm font-medium text-gray-900">123 Ocean Drive, Miami, FL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Check-in:</span>
            <span className="text-sm font-medium text-gray-900">Sep 25, 2025 - 3:00 PM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Check-out:</span>
            <span className="text-sm font-medium text-gray-900">Sep 26, 2025 - 11:00 AM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Room Type:</span>
            <span className="text-sm font-medium text-gray-900">Deluxe Suite</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Reservation Number:</span>
            <span className="text-sm font-medium text-gray-900">HTL-789456</span>
          </div>
        </div>
      </div>

 
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Attachments (3)</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Hotel Confirmation.pdf</span>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Download</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Hotel Voucher.pdf</span>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Download</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Hotel Map.pdf</span>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Download</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelReservationDetailsContent;

