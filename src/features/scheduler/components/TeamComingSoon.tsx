import React from 'react';
import { Users, Calendar, Clock, Wrench } from 'lucide-react';

export const TeamComingSoon: React.FC = () => {
  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <Users className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Team Scheduler
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Coming Soon! Track team member availability, assignments, and schedules across all your projects.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Team Availability
            </h3>
            <p className="text-gray-600">
              View team member availability, time off, and current project assignments in a unified calendar.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Smart Scheduling
            </h3>
            <p className="text-gray-600">
              Automatically suggest optimal team assignments based on skills, availability, and project requirements.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Time Tracking
            </h3>
            <p className="text-gray-600">
              Monitor team productivity and project progress with integrated time tracking and reporting.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Wrench className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Resource Management
            </h3>
            <p className="text-gray-600">
              Optimize resource allocation and prevent overbooking with advanced capacity planning tools.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Conflict Resolution
            </h3>
            <p className="text-gray-600">
              Automatically detect and resolve scheduling conflicts with intelligent conflict resolution algorithms.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Team Analytics
            </h3>
            <p className="text-gray-600">
              Get insights into team performance, utilization rates, and project delivery metrics.
            </p>
          </div>
        </div>

        {/* Status Update */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Development in Progress
          </h3>
          <p className="text-blue-700 mb-4">
            We're working hard to bring you the most comprehensive team scheduling solution. 
            The Team Scheduler will be available in the next release.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Expected release: Q2 2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};
